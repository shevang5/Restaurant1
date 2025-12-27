import React from 'react';

const occasions = [
    // First row
    { type: 'title', content: 'Breads for every occasions' },
    { type: 'image', title: 'Coffee Break', image: '/images/bgImg.jpg' },
    { type: 'image', title: 'Dessert', image: '/images/bgImg.jpg' },
    { type: 'image', title: 'Breakfast', image: '/images/bgImg.jpg' },
    // Second row
    { type: 'image', title: 'Snack', image: '/images/bgImg.jpg' },
    { type: 'image', title: 'Birthday Party', image: '/images/bgImg.jpg' },
    { type: 'image', title: 'Gathering', image: '/images/bgImg.jpg' },
    { type: 'see-all', content: 'See All' },
];

const OccasionsSection = () => {
    // We are reusing the bgImg.jpg as placeholder since we don't have separate images.
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-auto lg:h-[800px]">
            {occasions.map((item, index) => {
                // Render Title Block (Red)
                if (item.type === 'title') {
                    return (
                        <div key={index} className="bg-[var(--color-primary)] p-10 flex items-center h-80 lg:h-full">
                            <h2 className="text-4xl lg:text-5xl font-serif text-white font-medium leading-tight">
                                {item.content} <br />
                                <span className="opacity-100">occasions</span> {/* Adjusting line break manually for design match */}
                            </h2>
                        </div>
                    );
                }

                // Render "See All" Block (Red)
                if (item.type === 'see-all') {
                    return (
                        <div key={index} className="bg-[var(--color-primary)] p-10 flex items-center justify-center h-80 lg:h-full group cursor-pointer hover:bg-[var(--color-primary-hover)] transition-colors">
                            <span className="text-2xl font-serif text-white font-medium group-hover:underline underline-offset-4">
                                {item.content}
                            </span>
                        </div>
                    );
                }

                // Render Image Block
                return (
                    <div key={index} className="relative h-80 lg:h-full group overflow-hidden cursor-pointer">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                        <div className="absolute bottom-10 left-0 right-0 text-center">
                            <h3 className="text-white text-xl font-medium drop-shadow-md">{item.title}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OccasionsSection;
