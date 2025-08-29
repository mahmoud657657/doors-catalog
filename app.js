
// تخزين بسيط للعربة في localStorage
const CART_KEY = "store_cart_v1";

export function loadCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
export function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

export function addToCart(item){
  const cart = loadCart();
  const idx = cart.findIndex(p => p.id === item.id);
  if(idx>=0){ cart[idx].qty += 1; } else { cart.push({...item, qty:1}); }
  saveCart(cart);
  updateCartCount();
  alert("تمت الإضافة للسلة ✅");
}

export function removeFromCart(id){
  const cart = loadCart().filter(p => p.id !== id);
  saveCart(cart); renderCart();
}

export async function fetchProducts(){
  const res = await fetch('products.json');
  return res.json();
}

export function updateCartCount(){
  const countEl = document.querySelector('.cart-count');
  if(!countEl) return;
  const total = loadCart().reduce((a,b)=>a+b.qty,0);
  countEl.textContent = total;
}

export function renderCart(){
  const tbody = document.querySelector('#cart-body');
  const totalEl = document.querySelector('#cart-total');
  if(!tbody) return;
  const cart = loadCart();
  tbody.innerHTML = cart.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.qty}</td>
      <td>${p.price.toFixed(2)} ₪</td>
      <td>${(p.qty*p.price).toFixed(2)} ₪</td>
      <td><button onclick="removeFromCart(${p.id})">حذف</button></td>
    </tr>
  `).join('');
  const total = cart.reduce((a,b)=>a + b.qty*b.price, 0);
  totalEl.textContent = total.toFixed(2) + " ₪";
}

export function whatsappCheckout(){
  const cart = loadCart();
  if(!cart.length){ alert("السلة فاضية"); return; }
  const lines = cart.map(p => `• ${p.name} x${p.qty} = ${(p.qty*p.price).toFixed(2)}₪`);
  const total = cart.reduce((a,b)=>a + b.qty*b.price, 0).toFixed(2);
  const msg = encodeURIComponent(`طلب جديد:\n${lines.join('\n')}\nالمجموع: ${total}₪`);
  // عدّل رقم هاتفك هنا (رمز الدولة + الرقم بدون صفر)
  const phone = "972590000000";
  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}

document.addEventListener('DOMContentLoaded', updateCartCount);
