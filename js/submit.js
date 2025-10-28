
const scriptUrl = "https://script.google.com/macros/s/AKfycbzy4wDoAxhsA2wsviFX6KezEVnTlajpYBL7kHjioh_rwE5-hG72tt_nbnyjvZqeedRXeA/exec";
let form = document.getElementById("form_contact");

form.addEventListener("submit", function(e){
  e.preventDefault();
  fetch(scriptUrl, {
      method: 'POST', 
      body: new FormData(form),
  })
  .then((response )=>{
      setTimeout(() => {
          localStorage.removeItem("cart"); // 🧹 امسح الكارت بعد الإرسال
          window.location.reload();
      },1000);
  })
  .catch((error )=> console.error("error!", error.message))
});


// ✅ تحميل بيانات الكارت في صفحة الشيك آوت
document.addEventListener("DOMContentLoaded", () => {

  const checkoutItemsContainer = document.getElementById("checkout_items");
  const subtotalEl = document.querySelector(".subtotal_checkout");
  const totalEl = document.querySelector(".total_checkout");
  const countInput = document.getElementById("count_items");
  const itemsInput = document.getElementById("items");
  const totalInput = document.getElementById("total_price");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 🔁 دالة لتحديث العرض
  function renderCart() {
    if (cart.length === 0) {
      checkoutItemsContainer.innerHTML = `<p class="empty_cart ">السلة فارغة </p>`;
      subtotalEl.textContent = "$0.00";
      totalEl.textContent = "$0.00";
      countInput.value = 0;
      itemsInput.value = "";
      totalInput.value = "0";
      return;
    }

    let subtotal = 0;
    let itemsHTML = "";

    cart.forEach((item, index) => {
      const quantity = item.quantity || 1;
      const itemTotal = item.price * quantity;
      subtotal += itemTotal;

      itemsHTML += `
        <div class="item_cart">
          <img src="${item.img}" alt="${item.name}">
          <div class="info">
            <h4>${item.name}</h4>
            <div class="quantity_control">
              <button class="minus" data-index="${index}">-</button>
              <span>${quantity}</span>
              <button class="plus" data-index="${index}">+</button>
            </div>
            <p class="price">$${itemTotal.toFixed(2)}</p>
          </div>
          <div class="delete_item" data-index="${index}">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>
      `;
    });

    checkoutItemsContainer.innerHTML = itemsHTML;

    const shipping = 20;
    const total = subtotal + shipping;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    // تحديث القيم المخفية في الفورم
    countInput.value = cart.length;
    totalInput.value = total.toFixed(2);
    itemsInput.value = cart.map(item => `${item.name} (x${item.quantity || 1})`).join(", ");

    // 🔗 إضافة الأحداث للأزرار
    addEventListeners();
  }

  // ⚙️ دوال التحكم
  function addEventListeners() {
    document.querySelectorAll(".plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    document.querySelectorAll(".minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          // لو وصلت للواحد ممكن تختار تمسحها أو تسيبها
          cart[index].quantity = 1;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });

    document.querySelectorAll(".delete_item").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  // ✅ أول تحميل
  renderCart();
});

