
// السليدر اللي فى الناف 
var swiper = new Swiper(".slide-swp", {
    pagination: {
      el: ".swiper-pagination",
      dynamicBullests: true,
      clickable:true
    },
    autoplay:{
        delay:2500,
    },
    loop:true
  });


  /* swiper slide products */

  var swiper = new Swiper(".slide_product", {
    slidesPerView: 5,  // عدد المنتجات اللي هتبان في الشريحه
    spaceBetween:20,  // المسافه بين كل منتج والتاني
    autoplay:{
        delay:1500,
    },
    // ييي
    // الزرارينة اللي هيقلبوا بين المنجات
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev"
    },
    loop:true, //   علشان هيقلب من غير ما يوقف او يرجع 
    // الريسبونسيف فى الاسليدر بتاع المكتبة 
    breakpoints:{
      1200:{
        slidesPerView : 5,
        spaceBetween: 20
      },
      1000:{
        slidesPerView : 4,
        spaceBetween: 20
      },
      700:{
        slidesPerView: 3 , 
        spaceBetween: 15 ,

      },
      0:{
        slidesPerView : 2,
        spaceBetween: 10
      }
    }
  });

  