import React from 'react';
import { Instagram, Utensils, Wheat, Coffee, Pizza, Soup, IceCream } from 'lucide-react';

const About = () => {
    // Positions for the scattered images (simulated based on the design)
    // We will use absolute positioning relative to the container for the images

    return (
        <div className="relative py-24 bg-[var(--color-bg-cream)] h-screen flex items-center justify-center overflow-hidden">

            {/* Central Content */}
            <div className="relative z-10 text-center max-w-4xl px-4">
                <h2 className="text-3xl md:text-5xl  font-bold text-[var(--color-primary)] leading-tight mb-4">
                    Cali Bistro is Hawthorne’s newest spot for gourmet dining, seasonal dishes, and crafted cocktails. <span className="text-[#888] font-medum text-3xl md:text-4xl">Located in Crenshaw Village Plaza, we proudly serve the community daily with artisanal flavors,
                        warm service, and a sophisticated experience for everyone.</span>
                </h2>

                <div className="mt-8 flex justify-center">
                    <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-md">
                        <Instagram className="w-5 h-5" />
                        Follow Our Instagram
                    </button>
                </div>
            </div>

            {/* Scattered Images - Using placeholders mostly */}
            {/* Scattered Icons */}
            {/* Top Center-Right */}
            <div className="absolute top-20 right-4 md:top-12 md:right-[28%] w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700 delay-100">
                <Utensils className="w-8 h-8 md:w-12 md:h-12 text-[var(--color-primary)] opacity-80" />
            </div>

            {/* Top Right */}
            <div className="absolute top-32 right-2 md:top-24 md:right-[10%] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700 delay-200">
                <Wheat className="w-6 h-6 md:w-10 md:h-10 text-[var(--color-primary)] opacity-70" />
            </div>

            {/* Middle Right */}
            <div className="absolute top-1/2 right-4 md:right-[15%] w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700 delay-300">
                <Coffee className="w-8 h-8 md:w-12 md:h-12 text-[var(--color-primary)] opacity-80" />
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-40 right-4 md:bottom-32 md:right-[20%] w-16 h-16 md:w-28 md:h-28 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700 delay-400">
                <Pizza className="w-8 h-8 md:w-14 md:h-14 text-[var(--color-primary)] opacity-80" />
            </div>

            {/* Top Left */}
            <div className="absolute top-24 left-4 md:top-32 md:left-[15%] w-20 h-20 md:w-32 md:h-32 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700 delay-500">
                <Soup className="w-10 h-10 md:w-16 md:h-16 text-[var(--color-primary)] opacity-80" />
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-48 left-2 md:bottom-36 md:left-[8%] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700 delay-600">
                <IceCream className="w-6 h-6 md:w-10 md:h-10 text-[var(--color-primary)] opacity-70" />
            </div>

            {/* Bottom Left-Center */}
            <div className="absolute bottom-24 left-8 md:bottom-20 md:left-[35%] w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full animate-in fade-in zoom-in duration-700 delay-700">
                <Utensils className="w-8 h-8 md:w-12 md:h-12 text-[var(--color-primary)] opacity-80 -rotate-45" />
            </div>

            {/* Decor elements */}
            {/* Add subtle background elements if needed */}
        </div>
    );
};

export default About;
