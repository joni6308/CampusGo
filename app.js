const menuItems = [
  { id: 1, name: "Veg Fried Rice", vendor: "Main Canteen", category: "meals", price: 70 },
  { id: 2, name: "Chicken Biryani", vendor: "Main Canteen", category: "meals", price: 110 },
  { id: 3, name: "Paneer Sandwich", vendor: "Tech Park Cafe", category: "snacks", price: 55 },
  { id: 4, name: "Samosa (2 pcs)", vendor: "Library Kiosk", category: "snacks", price: 30 },
  { id: 5, name: "Cold Coffee", vendor: "Tech Park Cafe", category: "drinks", price: 50 },
  { id: 6, name: "Fresh Lime Juice", vendor: "Main Canteen", category: "drinks", price: 25 },
];

let cart = [];
let activeCategory = "all";

const menuGrid = document.getElementById("menu-grid");
const searchInput = document.getElementById("search-input");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartItemsEl = document.getElementById("cart-items");
const cartDrawer = document.getElementById("cart-drawer");

function renderMenu() {
  const query = searchInput.value.toLowerCase();
  const filtered = menuItems.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesText =
      item.name.toLowerCase().includes(query) ||
      item.vendor.toLowerCase().includes(query);
    return matchesCat && matchesText;
  });

  menuGrid.innerHTML = filtered
    .map(
      (item) => `
      <div class="card">
        <div>
          <h3>${item.name}</h3>
          <div class="vendor">${item.vendor}</div>
        </div>
        <div class="card-bottom">
          <span class="price">₹${item.price}</span>
          <button class="add-btn" onclick="addToCart(${item.id})">Add</button>
        </div>
      </div>
    `
    )
    .join("");
}

function addToCart(id) {
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = menuItems.find((m) => m.id === id);
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = count;
  cartTotal.textContent = total;

  cartItemsEl.innerHTML =
    cart.length === 0
      ? "<p style='color:#64748b'>Your cart is empty.</p>"
      : cart
          .map(
            (item) => `
          <div class="cart-item">
            <div>
              <strong>${item.name}</strong>
              <div style="font-size:0.85rem;color:#64748b">₹${item.price} × ${item.qty}</div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="border:none;background:none;color:#ef4444;cursor:pointer">Remove</button>
          </div>
        `
          )
          .join("");
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderMenu();
  });
});

searchInput.addEventListener("input", renderMenu);
document.getElementById("cart-btn").addEventListener("click", () => cartDrawer.classList.remove("hidden"));
document.getElementById("close-cart").addEventListener("click", () => cartDrawer.classList.add("hidden"));

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Add items to your cart first!");
  const pickup = document.getElementById("pickup-point").value;
  alert(`Order placed! Pick up at ${pickup}.`);
  cart = [];
  updateCartUI();
  cartDrawer.classList.add("hidden");
});

renderMenu();
updateCartUI();
