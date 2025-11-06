// عناصر الواجهة
const category_nav_list = document.querySelector(".category_nav_list");
const nav_links = document.querySelector(".nav_links");
const cartElement = document.querySelector(".cart");
const cartItemsContainer = document.getElementById("cart_items");

// وظائف الواجهة
const toggleClass = (el, cls) => el?.classList.toggle(cls);
const Open_Categ_list = () => toggleClass(category_nav_list, "active");
const open_Menu = () => toggleClass(nav_links, "active");
const open_close_cart = () => toggleClass(cartElement, "active");
// 
// وظائف السلة
const Cart = {
  get: () => JSON.parse(localStorage.getItem("cart")) || [],
  set: (cart) => localStorage.setItem("cart", JSON.stringify(cart)),
// الاضافة الى السلة
  add(product) {
    const cart = this.get();
    //...product → نسخ كل خصائص المنتج.
    cart.push({ ...product, quantity: 1 });
    // حفظ  بعد الإضافة.
    this.set(cart);
    // تحديث واجهة المستخدم
    this.update();
  },

// الحذف من السلة
  remove(index) {
    const cart = this.get();
    // إزالة عنصر واحد من  بمؤشر index.
    const removed = cart.splice(index, 1)[0];
    this.set(cart);
    this.update();
    // إعادة تفعيل زر "Add to Cart" للمنتج ال
    this.updateButtons(removed.id);
  },

  // تحديث أزرار الإضافة للمنتجات بعد الحذف 
  updateButtons(productId) {
    document
      .querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
      .forEach((btn) => {
        btn.classList.remove("active");
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> add to cart`;
      });
  },
// تحديث الكارت
  update() {
    const cart = this.get();
    let total = 0, //المجوع الكلي 
      count = 0; //عدد المنتجات
    cartItemsContainer.innerHTML = ""; //محتوى السلة يبقا فاضي 

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      count += item.quantity;

      cartItemsContainer.innerHTML += `
<div class="item_cart">
  <img src="${item.img}" alt="${item.name}">
  <div class="content">
    <h4>${item.name}</h4>

    <p class="price_cart">$${item.price * item.quantity}</p>
    <div class="quantity_control">
      <button class="decrease_quantity" data-index="${index}">-</button>
      <span class="quantity">${item.quantity}</span>
      <button class="increase_quantity" data-index="${index}">+</button>
    </div>
  </div>
  <button class="delete_item" data-index="${index}">
    <i class="fa-solid fa-trash-can"></i>
  </button>
</div>

      `;
    });

    document.querySelector(".price_cart_toral").textContent = `$${total}`;
    document.querySelector(".Count_item_cart").textContent = count;
    document.querySelector(".count_item_header").textContent = count;
  },

  // زرار الاضافة 
  increase(index) {
    const cart = this.get();
    cart[index].quantity++;
    this.set(cart);
    this.update();
  },
// زرار الحذف
  decrease(index) {
    const cart = this.get();
    if (cart[index].quantity > 1) cart[index].quantity--;
    this.set(cart);
    this.update();
  },
};

// التعامل مع الأزرار
fetch("products.json")
  .then((res) => res.json())
  .then((products) => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn_add_cart");
      const inc = e.target.closest(".increase_quantity");
      const dec = e.target.closest(".decrease_quantity");
      const del = e.target.closest(".delete_item");

      if (btn) {
        const product = products.find((p) => p.id == btn.dataset.id);
        Cart.add(product);
        document
          .querySelectorAll(`.btn_add_cart[data-id="${product.id}"]`)
          .forEach((b) => {
            b.classList.add("active");
            b.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
          });
      }

      if (inc) Cart.increase(inc.dataset.index);
      if (dec) Cart.decrease(dec.dataset.index);
      if (del) Cart.remove(del.dataset.index);
    });
  });

Cart.update();
// 🔁 تحديث تلقائي بين الصفحات عند تغيير بيانات الكارت
window.addEventListener("storage", (e) => {
  if (e.key === "cart") {
    // إعادة تحديث الكارت في الصفحة الحالية
    if (typeof Cart !== "undefined") {
      Cart.update(); // لو احنا في index.html
    }

    if (typeof renderCart === "function") {
      renderCart(); // لو احنا في checkout.html
    }
  }
});
