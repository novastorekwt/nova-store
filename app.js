const SUPABASE_URL = "https://uxyzwaqqdntknndworhj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4eXp3YXFxZG50a25uZHdvcmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTgyMTIsImV4cCI6MjA5NjY5NDIxMn0.aAbxh6L3wD2NI0RqL61FN9S6FI721drvd8MVApJxOuw";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
  {name:"ASUS ROG RTX 5080", brand:"ASUS", category:"Graphics", price:429.900, old:507.282, discount:true, stock:"3 Left", type:"gpu", desc:"High-end graphics card for elite gaming builds."},
  {name:"MSI RTX 4070 Super", brand:"MSI", category:"Graphics", price:219.900, old:249.900, discount:true, stock:"In Stock", type:"gpu", desc:"Great 1440p gaming graphics card."},
  {name:"Gigabyte RTX 4060", brand:"Gigabyte", category:"Graphics", price:119.900, old:null, discount:false, stock:"In Stock", type:"gpu", desc:"Affordable gaming graphics card."},
  {name:"Ryzen 7 9800X3D", brand:"AMD", category:"Processor", price:189.900, old:null, discount:false, stock:"In Stock", type:"cpu", desc:"Gaming CPU with excellent performance."},
  {name:"Intel Core i7", brand:"Intel", category:"Processor", price:154.900, old:174.900, discount:true, stock:"In Stock", type:"cpu", desc:"Strong processor for work and gaming."},
  {name:"Samsung 990 Pro 2TB", brand:"Samsung", category:"Storage", price:59.900, old:70.682, discount:true, stock:"In Stock", type:"ram", desc:"Fast NVMe storage."},
  {name:"G.Skill DDR5 32GB", brand:"G.Skill", category:"RAM", price:44.900, old:52.982, discount:true, stock:"3 Left", type:"ram", desc:"Fast DDR5 memory."},
  {name:"Lian Li O11 EVO RGB", brand:"Lian Li", category:"Case", price:49.900, old:null, discount:false, stock:"3 Left", type:"case", desc:"Premium RGB case."},
  {name:"Corsair RM1000x", brand:"Corsair", category:"PSU", price:54.900, old:null, discount:false, stock:"In Stock", type:"case", desc:"Reliable power supply."},
  {name:"Samsung Odyssey 27", brand:"Samsung", category:"Monitor", price:119.900, old:141.482, discount:true, stock:"In Stock", type:"monitor", desc:"Gaming monitor for smooth visuals."}
];

let shown = [...products];
let cart = JSON.parse(localStorage.getItem("nova_cart") || "[]");
let currentProduct = products[0];
let lang = "en";

const $ = (q) => document.querySelector(q);
const $$ = (q) => [...document.querySelectorAll(q)];
function saveCart(){ localStorage.setItem("nova_cart", JSON.stringify(cart)); }
function money(n){ return Number(n).toFixed(3) + " KD"; }
function showPage(id){ $$(".page").forEach(p => p.classList.remove("active")); const page = $("#" + id); if(page) page.classList.add("active"); closeDrawer(); window.scrollTo(0,0); if(id === "cart") renderCart(); }

function renderProducts(list = shown){
  $("#productsGrid").innerHTML = list.map((p) => {
    const realIndex = products.indexOf(p);
    return `<article class="card product">
      <div class="product-photo ${p.type}" data-open="${realIndex}">
        <div class="visual"></div>
        <span class="tag stock">In Stock</span>
        ${p.discount ? `<span class="tag discount">Discount</span>` : ""}
        <span class="tag ${p.stock.includes("3") ? "lefttag" : "stock"}">${p.stock}</span>
      </div>
      <h3>${p.name}</h3>
      <span class="badge">${p.brand}</span>
      ${p.old ? `<div class="old">${money(p.old)}</div>` : ""}
      <div class="price">${money(p.price)}</div>
      <button class="primary wide" data-add="${realIndex}">Add to Cart</button>
    </article>`;
  }).join("");
}

function openProduct(i){ currentProduct = products[i]; $("#detailTitle").textContent = currentProduct.name; $("#detailName").textContent = currentProduct.name; $("#detailDesc").textContent = currentProduct.desc; $("#detailBrand").textContent = currentProduct.brand; $("#detailPrice").textContent = money(currentProduct.price); $("#detailOld").textContent = currentProduct.old ? money(currentProduct.old) : ""; $("#detailDiscount").style.display = currentProduct.discount ? "inline-block" : "none"; $("#detailImage").className = "product-photo big " + currentProduct.type; $("#detailImage").innerHTML = '<div class="visual"></div>'; showPage("productDetail"); }
function addToCart(p){ const found = cart.find(x => x.name === p.name); if(found) found.qty += 1; else cart.push({name:p.name, price:p.price, qty:1}); saveCart(); renderCart(); showPage("cart"); }
function renderCart(){ if(cart.length === 0){ $("#cartItems").innerHTML = "<h3>Your cart is empty</h3><p>Add products to continue.</p>"; $("#cartCount").textContent = "0"; $("#cartTotal").textContent = "0.000"; return; } $("#cartItems").innerHTML = cart.map((item, i) => `<div class="cart-item"><div><b>${item.name}</b><br><span class="muted">NOVA Product</span></div><div class="qty"><button data-dec="${i}">−</button><span>${item.qty}</span><button data-inc="${i}">+</button></div><b>${money(item.price * item.qty)}</b><button class="remove" data-remove="${i}">🗑 Remove</button></div>`).join(""); $("#cartCount").textContent = cart.reduce((a,b)=>a+b.qty,0); $("#cartTotal").textContent = cart.reduce((a,b)=>a+b.price*b.qty,0).toFixed(3); }
function filterProducts(){ const q = $("#searchInput").value.toLowerCase(); shown = products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)); renderProducts(); showPage("products"); }
function filterByBrand(brand){ shown = products.filter(p => p.brand === brand); renderProducts(); showPage("products"); }
function filterByCategory(cat){ shown = products.filter(p => p.category === cat); renderProducts(); showPage("products"); }
function sortProducts(mode){ shown.sort((a,b) => mode === "low" ? a.price - b.price : b.price - a.price); renderProducts(); }
function renderBuilder(){ const selected = [products[3], products[0], products[6], products[5], products[7], products[8]]; $("#builderGrid").innerHTML = selected.map(p => `<div class="builder-row"><div><b>${p.category}</b><br><span>${p.name}</span></div><b>${money(p.price)}</b></div>`).join(""); $("#builderTotal").textContent = money(selected.reduce((a,b)=>a+b.price,0)); }
function openDrawer(){ $("#drawer").classList.add("open"); $("#overlay").classList.add("show"); }
function closeDrawer(){ $("#drawer").classList.remove("open"); $("#overlay").classList.remove("show"); }
function toggleLang(){ lang = lang === "en" ? "ar" : "en"; document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; document.body.classList.toggle("rtl", lang === "ar"); $("#langBtn").textContent = lang === "ar" ? "English" : "العربية"; $$("[data-en]").forEach(el => el.textContent = el.dataset[lang]); }
function msg(id, text, type="success"){ const el = $("#" + id); el.className = "message " + type; el.textContent = text; }

async function updateAuthUI(){ const { data } = await supabaseClient.auth.getUser(); const user = data.user; if(user){ $("#loggedOutBox").classList.add("hidden"); $("#loggedInBox").classList.remove("hidden"); $("#userEmail").textContent = user.email || "NOVA User"; } else { $("#loggedOutBox").classList.remove("hidden"); $("#loggedInBox").classList.add("hidden"); } }
async function signUp(){ const email = $("#signupEmail").value.trim(); const password = $("#signupPassword").value; const name = $("#signupName").value.trim(); const phone = $("#signupPhone").value.trim(); if(!email || !password) return msg("signupMsg","Enter email and password.","error"); if(password.length < 6) return msg("signupMsg","Password must be at least 6 characters.","error"); const { error } = await supabaseClient.auth.signUp({ email, password, options: { data: { full_name:name, phone }, emailRedirectTo: window.location.origin } }); if(error) return msg("signupMsg", error.message, "error"); msg("signupMsg", "Account created. Check your email to confirm your account.", "success"); }
async function login(){ const email = $("#loginEmail").value.trim(); const password = $("#loginPassword").value; if(!email || !password) return msg("loginMsg","Enter email and password.","error"); const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if(error) return msg("loginMsg", error.message, "error"); await updateAuthUI(); showPage("account"); }
async function resetPassword(){ const email = $("#loginEmail").value.trim(); if(!email) return msg("loginMsg","Enter your email first.","error"); const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); if(error) return msg("loginMsg", error.message, "error"); msg("loginMsg", "Password reset email sent.", "success"); }
async function logout(){ await supabaseClient.auth.signOut(); await updateAuthUI(); showPage("account"); }

document.addEventListener("click", (e) => { const pageBtn = e.target.closest("[data-page]"); if(pageBtn) showPage(pageBtn.dataset.page); const addBtn = e.target.closest("[data-add]"); if(addBtn) addToCart(products[Number(addBtn.dataset.add)]); const openBtn = e.target.closest("[data-open]"); if(openBtn) openProduct(Number(openBtn.dataset.open)); const brandBtn = e.target.closest("[data-brand]"); if(brandBtn) filterByBrand(brandBtn.dataset.brand); const catBtn = e.target.closest("[data-category]"); if(catBtn) filterByCategory(catBtn.dataset.category); const inc = e.target.closest("[data-inc]"); if(inc){ cart[Number(inc.dataset.inc)].qty++; saveCart(); renderCart(); } const dec = e.target.closest("[data-dec]"); if(dec){ const i = Number(dec.dataset.dec); cart[i].qty = Math.max(1, cart[i].qty - 1); saveCart(); renderCart(); } const rem = e.target.closest("[data-remove]"); if(rem){ cart.splice(Number(rem.dataset.remove), 1); saveCart(); renderCart(); } });
$("#menuBtn").addEventListener("click", openDrawer); $("#closeMenu").addEventListener("click", closeDrawer); $("#overlay").addEventListener("click", closeDrawer); $("#langBtn").addEventListener("click", toggleLang); $("#searchBtn").addEventListener("click", filterProducts); $("#topSearchBtn").addEventListener("click", () => { $("#searchInput").value = $("#topSearch").value; filterProducts(); }); $("#allBtn").addEventListener("click", () => { shown = [...products]; renderProducts(); }); $("#discountBtn").addEventListener("click", () => { shown = products.filter(p=>p.discount); renderProducts(); }); $("#stockBtn").addEventListener("click", () => { shown = products.filter(p=>p.stock.includes("Stock")); renderProducts(); }); $("#leftBtn").addEventListener("click", () => { shown = products.filter(p=>p.stock.includes("3")); renderProducts(); }); $("#lowHigh").addEventListener("click", () => sortProducts("low")); $("#highLow").addEventListener("click", () => sortProducts("high")); $("#detailAdd").addEventListener("click", () => addToCart(currentProduct)); $("#addBuild").addEventListener("click", () => { [products[3],products[0],products[6],products[5]].forEach(addToCart); }); $("#signupBtn").addEventListener("click", signUp); $("#loginBtn").addEventListener("click", login); $("#resetBtn").addEventListener("click", resetPassword); $("#logoutBtn").addEventListener("click", logout); $("#logoutSide").addEventListener("click", logout); $("#guestOrder").addEventListener("click", () => showPage("success"));
supabaseClient.auth.onAuthStateChange(updateAuthUI); renderProducts(); renderCart(); renderBuilder(); updateAuthUI();
