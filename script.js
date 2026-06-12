const STORAGE_KEY = "karrim_music_store_v1";
const THEME_KEY = "karrim_music_theme_v1";
const CUSTOM_NAME_KEY = "karrim_music_name_v1";
const CUSTOM_LOGO_KEY = "karrim_music_logo_v1";
const HISTORY_LIMIT = 1000;

const defaultState = {
  storeName: "KARRIM MART",
  tagline: "Belanja Mudah, Harga Bersahabat",
  darkMode: false,
  nextTransactionNo: 1,
  products: [
    {
      id: crypto.randomUUID(),
      code: "BRG001",
      name: "Gitar Akustik",
      price: 750000,
      stock: 12,
      category: "Gitar",
      unit: "pcs",
      image: "img/gitar.jpg",
      desc: "Gitar akustik nyaman untuk belajar dan tampil.",
      discount: 0,
      sold: 14
    },
    {
      id: crypto.randomUUID(),
      code: "BRG002",
      name: "Senar Gitar",
      price: 35000,
      stock: 50,
      category: "Aksesoris",
      unit: "set",
      image: "img/senar.jpg",
      desc: "Senar gitar awet dan enak dipakai.",
      discount: 0,
      sold: 22
    },
    {
      id: crypto.randomUUID(),
      code: "BRG003",
      name: "Pick Guitar",
      price: 10000,
      stock: 100,
      category: "Aksesoris",
      unit: "pcs",
      image: "img/pick.jpg",
      desc: "Pick gitar untuk petikan lebih nyaman.",
      discount: 0,
      sold: 35
    },
    {
      id: crypto.randomUUID(),
      code: "BRG004",
      name: "Capo Guitar",
      price: 45000,
      stock: 25,
      category: "Aksesoris",
      unit: "pcs",
      image: "img/capo.jpg",
      desc: "Capo untuk ubah nada dengan cepat.",
      discount: 0,
      sold: 11
    },
    {
      id: crypto.randomUUID(),
      code: "BRG005",
      name: "Amplifier Mini",
      price: 320000,
      stock: 8,
      category: "Audio",
      unit: "pcs",
      image: "img/ampli.jpg",
      desc: "Amplifier kecil untuk latihan dan performa.",
      discount: 5,
      sold: 9
    },
    {
      id: crypto.randomUUID(),
      code: "BRG006",
      name: "Mikrofon Wireless",
      price: 280000,
      stock: 15,
      category: "Audio",
      unit: "pcs",
      image: "img/mic.jpg",
      desc: "Mikrofon wireless praktis untuk vokal.",
      discount: 0,
      sold: 13
    },
    {
      id: crypto.randomUUID(),
      code: "BRG007",
      name: "Kabel Jack",
      price: 55000,
      stock: 20,
      category: "Aksesoris",
      unit: "pcs",
      image: "img/kabel.jpg",
      desc: "Kabel jack untuk gitar dan audio.",
      discount: 0,
      sold: 10
    },
    {
      id: crypto.randomUUID(),
      code: "BRG008",
      name: "Stand Gitar",
      price: 85000,
      stock: 18,
      category: "Aksesoris",
      unit: "pcs",
      image: "img/stand.jpg",
      desc: "Stand gitar agar alat musik lebih aman.",
      discount: 0,
      sold: 7
    },
    {
      id: crypto.randomUUID(),
      code: "BRG009",
      name: "Pedal Efek",
      price: 450000,
      stock: 7,
      category: "Efek",
      unit: "pcs",
      image: "img/pedal.jpg",
      desc: "Pedal efek untuk sound gitar lebih keren.",
      discount: 0,
      sold: 16
    },
    {
      id: crypto.randomUUID(),
      code: "BRG010",
      name: "Ukulele Concert",
      price: 220000,
      stock: 10,
      category: "Ukulele",
      unit: "pcs",
      image: "img/ukulele.jpg",
      desc: "Ukulele kecil yang enak dimainkan.",
      discount: 0,
      sold: 6
    }
  ],
  cart: [],
  history: []
};

let state = loadState();
let activeCategory = "all";
let searchValue = "";
let activePayment = "cash";
let cashInputValue = 0;
let currentTransaction = null;
let adminMode = true;
let editingProductId = null;

const els = {
  storeName: document.getElementById("storeName"),
  storeTagline: document.getElementById("storeTagline"),
  brandLogo: document.getElementById("brandLogo"),
  themeBtn: document.getElementById("themeBtn"),
  searchInput: document.getElementById("searchInput"),
  categoryRow: document.getElementById("categoryRow"),
  productGrid: document.getElementById("productGrid"),
  cartList: document.getElementById("cartList"),
  cartCount: document.getElementById("cartCount"),
  cartSubtotal: document.getElementById("cartSubtotal"),
  metricProducts: document.getElementById("metricProducts"),
  metricStock: document.getElementById("metricStock"),
  metricOmzet: document.getElementById("metricOmzet"),
  salesChart: document.getElementById("salesChart"),
  topSellerList: document.getElementById("topSellerList"),
  historyList: document.getElementById("historyList"),
  openCheckoutBtn: document.getElementById("openCheckoutBtn"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  resetCartBtn: document.getElementById("resetCartBtn"),
  resetSystemBtn: document.getElementById("resetSystemBtn"),
  checkoutModal: document.getElementById("checkoutModal"),
  closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),
  cancelCheckoutBtn: document.getElementById("cancelCheckoutBtn"),
  finishCheckoutBtn: document.getElementById("finishCheckoutBtn"),
  paymentMethods: document.getElementById("paymentMethods"),
  paymentBox: document.getElementById("paymentBox"),
  paymentNote: document.getElementById("paymentNote"),
  modalTotal: document.getElementById("modalTotal"),
  receiptModal: document.getElementById("receiptModal"),
  receiptContent: document.getElementById("receiptContent"),
  closeReceiptBtn: document.getElementById("closeReceiptBtn"),
  printReceiptBtn: document.getElementById("printReceiptBtn"),
  doneReceiptBtn: document.getElementById("doneReceiptBtn"),
  productForm: document.getElementById("productForm"),
  productCode: document.getElementById("productCode"),
  productName: document.getElementById("productName"),
  productPrice: document.getElementById("productPrice"),
  productStock: document.getElementById("productStock"),
  productCategory: document.getElementById("productCategory"),
  productUnit: document.getElementById("productUnit"),
  productImage: document.getElementById("productImage"),
  productDiscount: document.getElementById("productDiscount"),
  productDesc: document.getElementById("productDesc"),
  adminProductList: document.getElementById("adminProductList")
};

const productTemplate = document.getElementById("productTemplate");

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : structuredClone(defaultState.products),
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      history: Array.isArray(parsed.history) ? parsed.history.slice(0, HISTORY_LIMIT) : []
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(THEME_KEY, state.darkMode ? "1" : "0");
  localStorage.setItem(CUSTOM_NAME_KEY, state.storeName);
}

function money(value) {
  return new Intl.NumberFormat("id-ID").format(Math.round(value || 0));
}

function nowString() {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "medium"
  }).format(new Date());
}

function formatShortDate(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function safeImagePath(value) {
  if (!value) return "img/gitar.jpg";
  if (/^https?:\/\//i.test(value) || value.startsWith("img/") || value.startsWith("./") || value.startsWith("../")) return value;
  return `img/${value}`;
}

function discountPrice(product) {
  const discount = Number(product.discount || 0);
  return Math.max(0, Math.round(product.price * (1 - discount / 100)));
}

function subtotalOfCart() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function totalOmzet() {
  return state.history.reduce((sum, trx) => sum + trx.total, 0);
}

function setTheme() {
  document.body.classList.toggle("dark", state.darkMode);
  els.themeBtn.textContent = state.darkMode ? "☀️" : "🌙";
}

function setHeaderData() {
  els.storeName.textContent = state.storeName;
  els.storeTagline.textContent = state.tagline;
  const customLogo = localStorage.getItem(CUSTOM_LOGO_KEY);
  if (customLogo) els.brandLogo.src = customLogo;
}

function filteredProducts() {
  return state.products.filter((product) => {
    const byCategory = activeCategory === "all" || product.category === activeCategory;
    const q = searchValue.trim().toLowerCase();
    const bySearch = !q || [product.code, product.name, product.category, product.desc].join(" ").toLowerCase().includes(q);
    return byCategory && bySearch;
  });
}

function renderProducts() {
  const list = filteredProducts();
  els.productGrid.innerHTML = "";
  if (!list.length) {
    els.productGrid.innerHTML = `<div class="small-note">Tidak ada produk yang cocok.</div>`;
    renderMetrics();
    return;
  }

  list.forEach((product) => {
    const node = productTemplate.content.cloneNode(true);
    node.querySelector("img").src = safeImagePath(product.image);
    node.querySelector("img").alt = product.name;
    node.querySelector(".category-badge").textContent = product.category;
    node.querySelector(".stock-badge").textContent = `Stok: ${product.stock}`;
    node.querySelector(".product-title").textContent = `${product.code} • ${product.name}`;
    node.querySelector(".product-desc").textContent = product.desc;
    const priceEl = node.querySelector(".price");
    const finalPrice = discountPrice(product);
    if (Number(product.discount) > 0) {
      priceEl.innerHTML = `Rp ${money(finalPrice)} <span class="small-note">(<s>Rp ${money(product.price)}</s> -${product.discount}%)</span>`;
    } else {
      priceEl.textContent = `Rp ${money(finalPrice)}`;
    }
    node.querySelector(".add-btn").addEventListener("click", () => addToCart(product.id));
    els.productGrid.appendChild(node);
  });
  renderMetrics();
}

function renderCart() {
  els.cartList.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  if (!state.cart.length) {
    els.cartList.innerHTML = `<div class="small-note">Keranjang masih kosong.</div>`;
  }

  state.cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    itemCount += item.qty;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${safeImagePath(item.image)}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <small>Rp ${money(item.price)} x ${item.qty}</small>
        <p><strong>Rp ${money(lineTotal)}</strong></p>
      </div>
      <div class="qty-box">
        <button type="button" aria-label="Kurangi">−</button>
        <button type="button" aria-label="Tambah">+</button>
        <button type="button" aria-label="Hapus">🗑</button>
      </div>
    `;
    const [minusBtn, plusBtn, deleteBtn] = cartItem.querySelectorAll("button");
    minusBtn.addEventListener("click", () => changeQty(item.id, -1));
    plusBtn.addEventListener("click", () => changeQty(item.id, 1));
    deleteBtn.addEventListener("click", () => removeFromCart(item.id));
    els.cartList.appendChild(cartItem);
  });

  els.cartCount.textContent = itemCount;
  els.cartSubtotal.textContent = money(total);
  els.modalTotal.textContent = money(total);
}

function renderMetrics() {
  els.metricProducts.textContent = state.products.length;
  els.metricStock.textContent = state.products.reduce((sum, p) => sum + p.stock, 0);
  els.metricOmzet.textContent = money(totalOmzet());
}

function renderTopSellers() {
  const sorted = [...state.products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, state.products.length);
  els.topSellerList.innerHTML = sorted.map((p, index) => `
    <div class="seller-row">
      <div>
        <strong>${index + 1}. ${p.name}</strong>
        <div class="small-note">${p.category} • Terjual ${p.sold}x</div>
      </div>
      <strong>${money(discountPrice(p))}</strong>
    </div>
  `).join("");
}

function renderHistory() {
  const history = [...state.history].slice().reverse();
  if (!history.length) {
    els.historyList.innerHTML = `<div class="history-empty">Belum ada transaksi.</div>`;
    return;
  }

  els.historyList.innerHTML = history.slice(0, 12).map((trx) => `
    <div class="history-item">
      <div>
        <strong>${trx.no}</strong>
        <div class="small-note">${trx.date} • ${trx.paymentMethod} • ${trx.cashier}</div>
      </div>
      <strong>Rp ${money(trx.total)}</strong>
    </div>
  `).join("");
}

function renderChart() {
  const canvas = els.salesChart;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 600;
  const height = 320;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const list = [...state.products].sort((a, b) => b.sold - a.sold).slice(0, 6);
  const maxSold = Math.max(...list.map((p) => p.sold), 1);
  const barWidth = (width - 60) / list.length;
  const primary = getComputedStyle(document.body).getPropertyValue("--primary").trim();
  const textColor = getComputedStyle(document.body).getPropertyValue("--text").trim();
  const muted = getComputedStyle(document.body).getPropertyValue("--muted").trim();

  ctx.fillStyle = muted;
  ctx.font = "13px Poppins, sans-serif";
  ctx.fillText("Grafik Barang Terlaris", 16, 22);

  list.forEach((product, index) => {
    const x = 20 + index * barWidth;
    const barHeight = ((height - 80) * product.sold) / maxSold;
    const y = height - 40 - barHeight;

    ctx.fillStyle = primary;
    ctx.fillRect(x, y, barWidth * 0.62, barHeight);

    ctx.fillStyle = textColor;
    ctx.font = "12px Poppins, sans-serif";
    ctx.fillText(product.name.slice(0, 10), x - 2, height - 16);
    ctx.fillText(String(product.sold), x + 4, y - 6);
  });
}

function renderAdminProducts() {

  els.adminProductList.innerHTML = "";

  state.products.forEach(product => {

    const div = document.createElement("div");

    div.className = "admin-product";

    div.innerHTML = `
      <div>
        <strong>${product.code}</strong><br>
        ${product.name}<br>
        Rp ${money(product.price)}
      </div>

      <div class="admin-product-buttons">
        <button class="btn btn-warning edit-btn">Edit</button>
        <button class="btn btn-danger delete-btn">Hapus</button>
      </div>
    `;

    div.querySelector(".edit-btn")
      .addEventListener("click", () => editProduct(product.id));

    div.querySelector(".delete-btn")
      .addEventListener("click", () => deleteProduct(product.id));

    els.adminProductList.appendChild(div);

  });

}

function editProduct(id){

  const product =
    state.products.find(p => p.id === id);

  if(!product) return;

  editingProductId = id;

  els.productCode.value = product.code;
  els.productName.value = product.name;
  els.productPrice.value = product.price;
  els.productStock.value = product.stock;
  els.productCategory.value = product.category;
  els.productUnit.value = product.unit;
  els.productImage.value = product.image;
  els.productDiscount.value = product.discount;
  els.productDesc.value = product.desc;

}

function deleteProduct(id){

  if(!confirm("Hapus produk ini?"))
    return;

  state.products =
    state.products.filter(
      p => p.id !== id
    );

  saveState();
  renderAll();

}

function renderAll() {
  setTheme();
  setHeaderData();
  renderProducts();
  renderCart();
  renderMetrics();
  renderTopSellers();
  renderHistory();
  renderChart();
  renderAdminProducts();
}

function addToCart(id) {
  const product = state.products.find((item) => item.id === id);
  if (!product) return;
  if (product.stock <= 0) return alert("Stok habis.");

  const finalPrice = discountPrice(product);
  const existing = state.cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      code: product.code,
      name: product.name,
      price: finalPrice,
      image: product.image,
      qty: 1
    });
  }

  product.stock -= 1;
  product.sold += 1;
  saveState();
  renderAll();
}

function changeQty(id, delta) {
  const cartItem = state.cart.find((item) => item.id === id);
  const product = state.products.find((item) => item.id === id);
  if (!cartItem || !product) return;

  if (delta > 0) {
    if (product.stock <= 0) return alert("Stok tidak cukup.");
    cartItem.qty += 1;
    product.stock -= 1;
    product.sold += 1;
  } else {
    cartItem.qty -= 1;
    product.stock += 1;
    product.sold -= 1;
    if (cartItem.qty <= 0) {
      state.cart = state.cart.filter((item) => item.id !== id);
    }
  }

  saveState();
  renderAll();
}

function removeFromCart(id) {
  const cartItem = state.cart.find((item) => item.id === id);
  const product = state.products.find((item) => item.id === id);
  if (!cartItem || !product) return;

  product.stock += cartItem.qty;
  product.sold -= cartItem.qty;
  state.cart = state.cart.filter((item) => item.id !== id);
  saveState();
  renderAll();
}

function openCheckout() {
  if (!state.cart.length) return alert("Keranjang masih kosong.");
  els.checkoutModal.classList.remove("hidden");
  activePayment = "cash";
  updatePaymentUI();
}

function closeCheckout() {
  els.checkoutModal.classList.add("hidden");
}

function updatePaymentUI() {
  const total = subtotalOfCart();
  const notes = {
    cash: "Masukkan nominal uang pembeli untuk menghitung kembalian.",
    qris: "Pembayaran QRIS simulasi siap digunakan.",
    transfer: "Transfer ke rekening yang tertera.",
    dana: "Gunakan e-wallet DANA ke nomor tujuan.",
    ovo: "Gunakan e-wallet OVO ke nomor tujuan.",
    gopay: "Gunakan e-wallet GoPay ke nomor tujuan.",
    shopeepay: "Gunakan e-wallet ShopeePay ke nomor tujuan.",
    linkaja: "Gunakan e-wallet LinkAja ke nomor tujuan."
  };
  els.paymentNote.textContent = notes[activePayment] || "Pilih metode pembayaran di atas.";

  if (activePayment === "cash") {
    els.paymentBox.innerHTML = `
      <div class="payment-card">
        <h4>Tunai / Cash</h4>
        <div class="payment-grid">
          <div>Total Belanja: <strong>Rp ${money(total)}</strong></div>
          <label>
            Masukkan Uang Pembeli
            <input id="cashInput" class="cash-input" type="number" min="0" placeholder="Contoh: 50000">
          </label>
          <div id="changeBox"><strong>Kembalian: Rp 0</strong></div>
        </div>
      </div>
    `;
    const cashInput = document.getElementById("cashInput");
    const changeBox = document.getElementById("changeBox");
    cashInput.value = cashInputValue || "";
    cashInput.addEventListener("input", (e) => {
      cashInputValue = Number(e.target.value || 0);
      const change = cashInputValue - total;
      if (cashInputValue < total) {
        changeBox.innerHTML = `<strong style="color:#ef4444">Uang belum cukup</strong>`;
      } else {
        changeBox.innerHTML = `<strong>Kembalian: Rp ${money(change)}</strong>`;
      }
    });
    return;
  }

  if (activePayment === "qris") {
    els.paymentBox.innerHTML = `
      <div class="payment-card">
        <h4>QRIS</h4>
        <div class="qris-preview">
          <p><strong>QRIS SIMULASI</strong></p>
          <img src="img/qris.png" alt="QRIS" style="max-width:220px;margin:10px auto;border-radius:12px;">
          <p>KARRIM MART</p>
          <p>Total: Rp ${money(total)}</p>
        </div>
      </div>
    `;
    return;
  }

  if (activePayment === "transfer") {
    els.paymentBox.innerHTML = paymentCardHtml("Transfer Bank", `Bank: BRI<br>Nomor Rekening: 1234567890<br>Atas Nama: KARRIM MART<br>Total: Rp ${money(total)}`);
    return;
  }

  const labelMap = {
    dana: "DANA",
    ovo: "OVO",
    gopay: "GoPay",
    shopeepay: "ShopeePay",
    linkaja: "LinkAja"
  };
  const label = labelMap[activePayment] || "E-Wallet";
  const number = "082211230790";
  els.paymentBox.innerHTML = paymentCardHtml(label, `Nomor tujuan: ${number}<br>Atas Nama: KARRIM MART<br>Total: Rp ${money(total)}`);
}

function paymentCardHtml(title, body) {
  return `
    <div class="payment-card">
      <h4>${title}</h4>
      <p>${body}</p>
    </div>
  `;
}

function buildReceipt(tx) {
  return `
    <div class="receipt-title">KARRIM MART</div>
    <div class="receipt-small" style="text-align:center;">${state.tagline}</div>
    <hr>
    <div>No Transaksi: <strong>${tx.no}</strong></div>
    <div>Tanggal: ${tx.date}</div>
    <div>Kasir: ${tx.cashier}</div>
    <div>Metode: ${tx.paymentMethod}</div>
    <hr>
    ${tx.items.map((item) => `
      <div class="receipt-row"><span>${item.name} x${item.qty}</span><span>Rp ${money(item.price * item.qty)}</span></div>
    `).join("")}
    <hr>
    <div class="receipt-row"><strong>Total</strong><strong>Rp ${money(tx.total)}</strong></div>
    <div class="receipt-row"><span>Bayar</span><span>Rp ${money(tx.paid)}</span></div>
    <div class="receipt-row"><span>Kembalian</span><span>Rp ${money(tx.change)}</span></div>
    <hr>
    <div class="receipt-small" style="text-align:center;">Terima Kasih Telah Berbelanja di KARRIM MART</div>
    <div class="receipt-small" style="text-align:center;">Barang Yang Sudah Dibeli Tidak Dapat Ditukar atau Dikembalikan</div>
  `;
}

function finishCheckout() {
  if (!state.cart.length) return;

  const total = subtotalOfCart();
  let paid = total;
  let change = 0;
  let ok = true;

  if (activePayment === "cash") {
    paid = Number(document.getElementById("cashInput")?.value || 0);
    if (paid < total) {
      alert("Uang pembeli tidak mencukupi.");
      return;
    }
    change = paid - total;
  }

  const transactionNo = `TRX-${String(state.nextTransactionNo).padStart(5, "0")}`;
  state.nextTransactionNo += 1;

  const items = state.cart.map((item) => ({ ...item }));
  const tx = {
    no: transactionNo,
    date: formatShortDate(),
    cashier: "Karrim",
    paymentMethod: activePayment === "cash" ? "Tunai" : activePayment.toUpperCase(),
    items,
    total,
    paid,
    change,
    paymentRaw: activePayment
  };

  state.history.push(tx);
  if (state.history.length > HISTORY_LIMIT) state.history = state.history.slice(-HISTORY_LIMIT);
  state.cart = [];
  saveState();
  currentTransaction = tx;
  closeCheckout();
  renderAll();
  openReceipt(tx);
  alert("Pembayaran berhasil. Transaksi tersimpan.");
}

function openReceipt(tx) {
  els.receiptContent.innerHTML = buildReceipt(tx);
  els.receiptModal.classList.remove("hidden");
}

function closeReceipt() {
  els.receiptModal.classList.add("hidden");
}

function printReceipt() {
  window.print();
}

function resetCart() {
  if (!state.cart.length) return;
  if (!confirm("Kosongkan keranjang?")) return;
  state.cart.forEach((cartItem) => {
    const product = state.products.find((p) => p.id === cartItem.id);
    if (product) {
      product.stock += cartItem.qty;
      product.sold -= cartItem.qty;
    }
  });
  state.cart = [];
  saveState();
  renderAll();
}

function submitProduct(event) {
  event.preventDefault();

  const code = els.productCode.value.trim();
  const name = els.productName.value.trim();
  const price = Number(els.productPrice.value);
  const stock = Number(els.productStock.value);
  const category = els.productCategory.value.trim();
  const unit = els.productUnit.value.trim();
  const image = els.productImage.value.trim() || "gitar.jpg";
  const discount = Number(els.productDiscount.value || 0);
  const desc = els.productDesc.value.trim() || "Produk baru dari admin.";

  if (!code || !name || !price || stock < 0 || !category || !unit) return alert("Lengkapi data produk.");

  const existing = state.products.find(
  p =>
    p.code.toLowerCase() === code.toLowerCase() &&
    p.id !== editingProductId
);

if(existing){
  alert("Kode barang sudah dipakai.");
  return;
}

  if(editingProductId){

  const product =
    state.products.find(
      p => p.id === editingProductId
    );

  product.code = code;
  product.name = name;
  product.price = price;
  product.stock = stock;
  product.category = category;
  product.unit = unit;
  product.image = image;
  product.discount = discount;
  product.desc = desc;

  editingProductId = null;

}else{

  state.products.unshift({
    id: crypto.randomUUID(),
    code,
    name,
    price,
    stock,
    category,
    unit,
    image,
    desc,
    discount,
    sold:0
  });

}

  saveState();
  event.target.reset();
  els.productDiscount.value = 0;
  renderAll();
}

function switchCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".chip").forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.chip[data-category="${category}"]`);
  if (activeBtn) activeBtn.classList.add("active");
  renderProducts();
}

els.themeBtn.addEventListener("click", () => {
  state.darkMode = !state.darkMode;
  saveState();
  renderAll();
});

els.searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value;
  renderProducts();
});

els.categoryRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  switchCategory(btn.dataset.category);
});

els.openCheckoutBtn.addEventListener("click", openCheckout);
els.checkoutBtn.addEventListener("click", openCheckout);
els.closeCheckoutBtn.addEventListener("click", closeCheckout);
els.cancelCheckoutBtn.addEventListener("click", closeCheckout);
els.finishCheckoutBtn.addEventListener("click", finishCheckout);
els.checkoutModal.addEventListener("click", (e) => {
  if (e.target === els.checkoutModal) closeCheckout();
});

els.paymentMethods.addEventListener("click", (e) => {
  const btn = e.target.closest(".pay-chip");
  if (!btn) return;
  activePayment = btn.dataset.pay;
  document.querySelectorAll(".pay-chip").forEach((item) => item.classList.remove("active"));
  btn.classList.add("active");
  updatePaymentUI();
});

els.productForm.addEventListener("submit", submitProduct);
els.resetCartBtn.addEventListener("click", resetCart);
els.resetSystemBtn.addEventListener("click", resetSystem);
els.closeReceiptBtn.addEventListener("click", closeReceipt);
els.doneReceiptBtn.addEventListener("click", closeReceipt);
els.printReceiptBtn.addEventListener("click", printReceipt);
els.receiptModal.addEventListener("click", (e) => {
  if (e.target === els.receiptModal) closeReceipt();
});
window.addEventListener("resize", renderChart);
window.addEventListener("storage", () => {
  state = loadState();
  renderAll();
});

if (localStorage.getItem(THEME_KEY) === "1") state.darkMode = true;
if (localStorage.getItem(CUSTOM_NAME_KEY)) state.storeName = localStorage.getItem(CUSTOM_NAME_KEY);
if (localStorage.getItem(CUSTOM_LOGO_KEY)) els.brandLogo.src = localStorage.getItem(CUSTOM_LOGO_KEY);

function resetSystem() {

  const konfirmasi = confirm(
    "PERINGATAN!\n\n" +
    "Semua data akan dihapus.\n\n" +
    "- Produk tambahan\n" +
    "- Riwayat transaksi\n" +
    "- Statistik penjualan\n" +
    "- Omzet\n" +
    "- Keranjang\n" +
    "- Perubahan stok\n\n" +
    "Data akan kembali seperti awal.\n\n" +
    "Lanjutkan?"
  );

  if(!konfirmasi) return;

  const konfirmasi2 = prompt(
    'Ketik "RESET" untuk melanjutkan'
  );

  if(konfirmasi2 !== "RESET"){
    alert("Reset dibatalkan");
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  alert(
    "Semua data berhasil direset.\nAplikasi akan dimuat ulang."
  );

  location.reload();
}

renderAll();
updatePaymentUI();