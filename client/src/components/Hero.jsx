import React from 'react';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const images = [
        "https://images.unsplash.com/photo-1638347244745-ed524cbef3b7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "/images/bgImg.jpg",
        "https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    const [activeImage, setActiveImage] = React.useState(images[0]);
    const navigate = useNavigate();

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[var(--color-primary)]">
            {/* Background Image Container */}
            <div className="md:px-12 px-2 py-6 absolute inset-0 z-0">
                <img
                    // Using the absolute path as requested, but in React normally you import or use /public
                    // Since it is in public/images folder, we can reference it directly as /images/bgImg.jpg
                    src={activeImage}
                    alt="Bakery Background"
                    className="w-full rounded-2xl h-full object-cover object-center transition-opacity duration-500 ease-in-out"
                />
                {/* Overlay gradient for text readability if needed, though the design looks clean */}
                {/* <div className="absolute inset-0 bg-black/10"></div> */}
            </div>

            <div className="z-10 w-full px-6 h-full flex flex-col md:justify-center items-start justify-end py-10">
                <div className="max-w-xl md:mx-20 backdrop-blur-md flex flex-col items-start justify-center mb-10 md:p-9 p-4 rounded-4xl shadow-2xl mt-20 text-white drop-shadow-md text-left">

                    <h1 className="text-2xl md:text-6xl font-bold leading-tight mb-4">
                        Exquisite Dining. <br className="md:block hidden" />
                        Memorable Moments <br />
                        Every Day at Restaurant.
                    </h1>

                    <p className="text-lg mb-8 opacity-90 max-w-md font-light">
                        Restaurant has arrived at Crenshaw Village Plaza — serving gourmet dishes,
                        seasonal specialties, and signature cocktails every day.
                    </p>

                    <div className="flex gap-4 items-center">
                        <button onClick={() => navigate('/products')} className="bg-white text-gray-800 px-6 py-2 rounded-lg font-bold shadow-lg">
                            Explore Menu
                        </button>
                    </div>

                </div>
            </div>


            {/* Floating Product Card (Right Side) */}
            <div className="absolute top-1/2 right-10 md:right-32 transform -translate-y-1/3 z-20 hidden md:block">
                {/* Breads Floating Effect - Simulated with layout or images in the design. 
             Since I don't have separate bread images, I will focus on the Card itself.
             The user image provided is a single BG image, so the breads might be part of it? 
             Checking the file name 'bgImg.jpg', it likely contains the breads. 
             So I just need to place the White Card overlay. */}

                <div className="bg-white p-6 rounded-2xl shadow-xl w-80 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-[var(--color-primary)] fill-current" />
                        ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                        sandwiches
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-gray-900 font-bold text-lg">$8.95</span>
                        <button onClick={() => navigate('/products')} className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors">
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Small thumbnails below card - mimicking the design */}
                <div className="flex gap-3 mt-4 justify-end">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveImage(img)}
                            className={`w-20 h-14 bg-white/50 backdrop-blur-sm rounded-lg border-2 ${activeImage === img ? 'border-[var(--color-primary)]' : 'border-transparent'} overflow-hidden shadow-lg transform hover:scale-105 transition-transform cursor-pointer`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`thumb-${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;

