import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react'; // Simulating social icons

const Footer = () => {
    return (
        <footer>
            {/* CTA Banner */}
            <div className="bg-[var(--color-primary)] py-20 relative overflow-hidden">
                {/* Decorative background elements (leaves pattern) could be SVGs/Images. 
                     Using simple CSS shapes for effect if needed, but clean red is fine for MVP. */}
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-8 leading-tight">
                        Join us for an exquisite <br />
                        culinary journey at Restaurant <br />
                        prepared with passion!
                    </h2>
                    <button className="bg-white text-[var(--color-primary)] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
                        Contact Us
                    </button>
                </div>
            </div>

            {/* Main Footer */}
            <div className="bg-[var(--color-primary)] border-t border-white/10 pt-16 pb-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full border-2 border-white/80">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] font-bold">
                                    CB
                                </div>
                            </div>
                            <div className="flex flex-col leading-tight text-white">
                                <span className="font-bold text-xl tracking-wide">Restaurant</span>
                                <span className="font-bold text-sm tracking-widest opacity-80">GASTRO-KITCHEN</span>
                            </div>
                        </div>

                        {/* App Stores */}
                        <div className="flex gap-4">
                            {/* Google Play Button Placeholder */}
                            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/20 hover:bg-gray-900 transition-colors">
                                <div className="w-6 h-6 bg-green-500 rounded-sm"></div> {/* Icon placeholder */}
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] uppercase">our location</span>
                                    <span className="text-sm font-bold">Google maps</span>
                                </div>
                            </button>
                            {/* App Store Button Placeholder */}
                            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/20 hover:bg-gray-900 transition-colors">
                                <div className="w-6 h-6 bg-white rounded-sm"></div> {/* Icon placeholder */}
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] uppercase">visit on the</span>
                                    <span className="text-sm font-bold">restaurant.com</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Links & Socials */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-white/80 text-sm border-t border-white/10 pt-8">
                        <div className="flex flex-wrap justify-center gap-8">
                            <a href="#" className="hover:text-white hover:underline">Store Location</a>
                            <a href="#" className="hover:text-white hover:underline">Terms of Use</a>
                            <a href="#" className="hover:text-white hover:underline">Contact Us</a>
                            <a href="#" className="hover:text-white hover:underline">About Us</a>
                            <a href="#" className="hover:text-white hover:underline">Privacy Policy</a>
                            <a href="#" className="hover:text-white hover:underline">FAQ</a>
                            <a href="#" className="hover:text-white hover:underline">Disclaimer</a>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="bg-white text-[var(--color-primary)] p-2 rounded-full hover:bg-gray-100 transition-colors"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="bg-white text-[var(--color-primary)] p-2 rounded-full hover:bg-gray-100 transition-colors"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="bg-white text-[var(--color-primary)] p-2 rounded-full hover:bg-gray-100 transition-colors"><Twitter className="w-4 h-4" /></a>
                        </div>
                    </div>

                    <div className="text-center text-white/50 text-xs mt-8">
                        © 2025 Restaurant, Inc. All Rights Reserved
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

