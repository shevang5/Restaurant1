import React from "react";

const Blog = () => {
  return (
    <section id="services" className="bg-gradient-to-b from-amber-50 via-white to-rose-50 py-16 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-800 tracking-tight">
            Crafting Moments, Serving You
          </h2>
          <p className="mt-4 text-base-content/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            From unforgettable flavors to seamless service, we make every meal special.
            Whether you dine in, take out, or order online — we’ve got your cravings covered.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Card 1 */}
          <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100">
            <figure className="overflow-hidden">
              <img
                src="https://scontent.cdninstagram.com/v/t51.82787-15/572982991_17850115848590072_4923808928296466436_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzc2MDM4NzkwMzc1NTE0OTYyMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=6blUpI7qxTwQ7kNvwGTbskO&_nc_oc=Adkz7KsYkc5udBLL3uBmTXAzlvFqR6AcdICnjgOXqPnYGHfGcv9hq9rNDCG9NbZAVxbIZgIpJG-QmgLBWJX-qNYz&_nc_ad=z-m&_nc_cid=1012&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=9bz99XOW1ZmFEzpxhA9n8A&oh=00_AfgevCQ8Mx9epRGJRSaAX2TqXngXeLxCnVLHWLyVPFbNXg&oe=692C3E5C"
                alt="Buffet Service"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </figure>
            <div className="p-6 flex flex-col gap-3">
              <h5 className="text-xl font-semibold text-amber-700">Fresh Pastries</h5>
              <p className="text-base-content/70 leading-relaxed mb-4">
                Hand-crafted pastries baked daily — warm, flaky, and made with premium ingredients.
              </p>
              <a
                href="#"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold 
                bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 
                hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-md"
              >
                Read More
                <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
              </a>
            </div>
          </div>

          {/* Card 2 — UPDATED */}
          <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100">
            <figure className="overflow-hidden">
              <img
                src="https://demos.flyonui.com/templates/assets/img/free-landing-page/free-blog-2.png"
                alt="Pickup & Delivery"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </figure>
            <div className="p-6 flex flex-col gap-3">
              <h5 className="text-xl font-semibold text-amber-700">Pickup & Delivery</h5>
              <p className="text-base-content/70 leading-relaxed mb-4">
                Grab your favorites on the go or enjoy fast delivery straight to your doorstep — fresh and quick.
              </p>
              <a
                href="#"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold 
                bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 
                hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-md"
              >
                Read More
                <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100">
            <figure className="overflow-hidden">
              <img
                src="https://scontent.cdninstagram.com/v/t51.82787-15/579836470_17850738876590072_4549004573209444619_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=108&ig_cache_key=Mzc2MzYxNzYzMzc3NDY3MjE1NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTQ0MC5zZHIuQzMifQ%3D%3D&_nc_ohc=U2hHHcndu4gQ7kNvwFLp9Nu&_nc_oc=AdmkKq-KJENljc52xpZaRa7bBmraAH6aKz0QPzil7FxssHXOLGapx6cX9fMzW7vd_Ubx642Bzq-R3FI9vRqmxpbm&_nc_ad=z-m&_nc_cid=1012&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=9bz99XOW1ZmFEzpxhA9n8A&oh=00_Afj-ZQwEjWTXW_S4DOeT-nw_OPX4SWnKOQHaaIAkjG1e5w&oe=692C3690"
                alt="Cafeteria"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </figure>
            <div className="p-6 flex flex-col gap-3">
              <h5 className="text-xl font-semibold text-amber-700">Café Experience</h5>
              <p className="text-base-content/70 leading-relaxed mb-4">
                Enjoy a cozy vibe, handcrafted coffee, and a relaxing space to unwind or work.
              </p>
              <a
                href="#"
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-semibold 
                bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 
                hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-md"
              >
                Read More
                <span className="icon-[tabler--arrow-right] size-5 rtl:rotate-180"></span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Blog;
