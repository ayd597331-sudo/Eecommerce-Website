// دي دالة بتجلب البيانات من ملف خارجي (في حالتنا products.json)
fetch('products.json')
// res بتمثل “الاستجابة” من السيرفر،
  .then(res => res.json())
  // البيانات اللي عندك يعني 
  .then(data => {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // هنا بتسدعي الدفات اللي هتحط في المنتجات 
    const sections = {
      sale: document.getElementById("swiper_items_sale"),
      electronics: document.getElementById("swiper_elctronics"),
      appliances: document.getElementById("swiper_appliances"),
      mobiles: document.getElementById("swiper_mobiles"),
    };

    // دالة عامة لتوليد كرت المنتج
    const createProductCard = (product, isInCart) => {
      const hasDiscount = product.old_price;
      const discountPercent = hasDiscount
        ? Math.floor((product.old_price - product.price) / product.old_price * 100)
        : null;

      return `
        <div class="swiper-slide product">
          ${hasDiscount ? `<span class="sale_present">%${discountPercent}</span>` : ''}
          <div class="img_product">
            <a href="#"><img src="${product.img}" alt=""></a>
          </div>

          <div class="stars">
            ${'<i class="fa-solid fa-star"></i>'.repeat(5)}
          </div>

          <p class="name_product"><a href="#">${product.name}</a></p>

          <div class="price">
            <p><span>$${product.price}</span></p>
            ${hasDiscount ? `<p class="old_price">$${product.old_price}</p>` : ''}
          </div>

          <div class="icons">
            <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
              <i class="fa-solid fa-cart-shopping"></i>
              ${isInCart ? 'Item in cart' : 'add to cart'}
            </span>
            <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
          </div>
        </div>
      `;
    };

    // توزيع المنتجات حسب القسم
    data.forEach(product => {
      const isInCart = cart.some(item => item.id === product.id);
      const { catetory, old_price } = product;

      // عروض الخصومات (sale section)
      if (old_price) sections.sale.innerHTML += createProductCard(product, isInCart);

      // باقي الفئات
      if (sections[catetory]) {
        sections[catetory].innerHTML += createProductCard(product, isInCart);
      }
    });
  });
