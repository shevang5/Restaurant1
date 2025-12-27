import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight, Play, MessageSquareQuote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
    {
        id: 1,
        name: 'Analie Hernandez',
        date: 'Oct 23, 2025',
        image: 'https://lh3.googleusercontent.com/geougc-cs/AMBA38uJfVJLcHLv3_ydTxrtS8E1mjHf3JtfoUOHDo-0rQ8P8f-VAnXpm95uKIcGpRIEAzv6Ihx9fBjwsTaElS1lgHUi6O6YbwaI6NxlPDSYA_QfWUb9mIhK236m9kyrp2H3zIVawY47Ffa7HVmo=w600-h450-p',
        type: 'video',
    },
    {
        id: 2,
        name: 'Jerry Helfer',
        date: 'Nov 28, 2025',
        content: 'Good small place nice & cozy for coffee and sandwiches in Hawthorn..especially the Lox Bagel 🥯 and Iced Matcha Coconut Latte customized 😃👌Should try and support local business family owned…',
        image: 'https://lh3.googleusercontent.com/a-/ALV-UjUjJJyYAkldPZG_MXyvLcstaBdrbjq6hkgfDL7I3TWxKCAlC00=w36-h36-p-rp-mo-br100',
        type: 'text'
    },
    {
        id: 3,
        name: 'Derek Stone',
        date: 'Nov 10, 2025',
        content: 'I can’t wait to come back and trying other breakfast sandwiches from this place , this morning I got Bagel turkey BLT and house ice coffee , everything I had tried here are delicious and great experiences with this new place . Definitely will be back .',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocKohTi3xYZXDum9hFZ4YZy8Ccz-SkhJ_BuEnrFIebPWoZSMwA=w36-h36-p-rp-mo-br100',
        type: 'text'
    },
    {
        id: 4,
        name: 'moises arriola',
        date: 'Aug 8, 2025',
        content: 'Best croissant I had ever had, extremely soft fresh and tasty ! Coffee was extremely delicious and flavorful. If you are looking for quality food I would 100% recommend ',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocJmeWoJrWyA-5_tgvh2-tx8Oz-ppq_rjf_69IJ-nuhjcGbdxA=w36-h36-p-rp-mo-ba2-br100',
        type: 'text'
    },
];

const Reviews = () => {
    return (
        <div className="py-24 h-screen bg-[var(--color-bg-cream)]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-4 text-[var(--color-primary)]">
                        <MessageSquareQuote className="w-12 h-12 fill-current" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900">What They Said</h2>
                </div>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                        nextEl: '.testi-next',
                        prevEl: '.testi-prev',
                    }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-12"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id} className="h-auto">
                            {item.type === 'video' ? (
                                <div className="relative h-[400px] rounded-xl overflow-hidden group cursor-pointer">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 text-white text-left">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
                                                <img src={item.image} alt="User" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-serif font-bold text-lg">{item.name}</h4>
                                                <p className="text-xs opacity-80">{item.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-between p-2">
                                    <p className="text-gray-700 leading-relaxed mb-8 text-base font-light">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-lg text-gray-900">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.date}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="flex justify-center gap-8 mt-8 text-gray-400">
                    <button className="testi-prev p-2 hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button className="testi-next p-2 hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
