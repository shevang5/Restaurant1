import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="absolute top-0 h-screen w-full overflow-hidden font-sans text-white">
      {/* Background Video with Dark Overlay */}
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://www.pexels.com/download/video/3371015/" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle darkening to match the moody vibe */}
      </div>

      {/* Navigation */}
      {/* <Navbar /> */}

      {/* Main Content Container */}
      <div className="relative z-10 h-[90%]  flex flex-col justify-between px-4 md:px-10 ">
        <div className="flex flex-col mt-32 items-center text-center">
        
        {/* Brand Name - Large Bold Header */}
        <div className="mt-10 ">
          <h1 className="text-[14vw]  leading-none tracking-tighter uppercase sm:text-[10vw] [font-family:'Archivo',sans-serif]">
            DEMO RESTAURANT
          </h1>
        </div>
<div className='md:px-5 flex flex-col items-center text-center'>


        {/* Restaurant Quick Stats */}
<div className="flex gap-8 text-white [font-family:Archivo',sans-serif]">
  <div className="text-center">
    <div className="text-xl md:text-3xl font-medium">100+</div>
    <div className="text-sm opacity-80">Dishes Served</div>
  </div>
  <div className="text-center">
    <div className="text-xl md:text-3xl font-medium">INR 199+</div>
    <div className="text-sm opacity-80">Starting Price</div>
  </div>
  <div className="text-center">
    <div className="text-xl md:text-3xl font-medium">4.8</div>
    <div className="text-sm opacity-80">Guest Rating</div>
  </div>
  <div className="text-center">
    <div className="text-xl md:text-3xl font-medium">Open</div>
    <div className="text-sm opacity-80">Daily</div>
  </div>
</div>

{/* Primary CTAs - Styled for Luxury */}
<div className="flex gap-6 mt-3 relative z-10 justify-center">
  <button
    onClick={() => navigate("/products")}
    className="bg-white text-black hover:bg-opacity-90 p-4 rounded-lg md:px-10 md:py-4 transition-all duration-300 tracking-widest uppercase text-xs font-bold"
  >
    EXPLORE MENU
  </button>
  <button onClick={() => setShowForm(true)} className="border border-white/40 hover:bg-white/10 backdrop-blur-sm text-white p-4 rounded-lg md:px-10 md:py-4 transition-all duration-300 tracking-widest uppercase text-xs font-bold">
    Reserve a Table
  </button>
</div>

{/* WhatsApp Quick Contact - Subtle & Integrated */}
<div className="mt-6 relative z-10">
  <a href="https://wa.me/919876543210" className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
      <span className="text-xs">WA</span>
    </div>
    <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Chat on WhatsApp</span>
  </a>
</div>
</div>
        </div>

{/* Lead Capture Form - Glassmorphism Style */}
{showForm && (
<div className=" absolute z-50 right-12 bottom-28  md:top-20 left-5 md:left-[unset] bg-white/5 backdrop-blur-xl border border-white/10 p-8 w-96 shadow-2xl rounded-sm">
  <div className="flex justify-end mb-2">
    <button
      type="button"
      onClick={() => setShowForm(false)}
      className="text-white/70 hover:text-white text-xs tracking-widest uppercase"
    >
      Close
    </button>
  </div>
  <div className="mb-8">
    <h3 className="text-xl font-bold tracking-tight uppercase mb-1 italic">Book Your Table</h3>
    <div className="h-[1px] w-12 bg-white/40 mb-3"></div>
    <p className="text-[10px] uppercase tracking-widest text-white/50">Confirmation in a few minutes</p>
  </div>
  
  <form className="space-y-4">
    <input 
      type="text" 
      placeholder="YOUR NAME" 
      className="w-full bg-white/5 border-b border-white/20 px-0 py-3 text-xs tracking-widest focus:outline-none focus:border-white transition-colors placeholder:text-white/30 uppercase"
      required
    />
    <input 
      type="tel" 
      placeholder="PHONE NUMBER" 
      className="w-full bg-white/5 border-b border-white/20 px-0 py-3 text-xs tracking-widest focus:outline-none focus:border-white transition-colors placeholder:text-white/30 uppercase"
      required
    />
    <select className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-xs tracking-widest focus:outline-none focus:border-white transition-colors uppercase appearance-none cursor-pointer">
      <option className="bg-zinc-900">Select Dining Preference</option>
      <option className="bg-zinc-900 text-white">Couple Table - Cozy Indoor</option>
      <option className="bg-zinc-900 text-white">Family Table - 4 to 6 Guests</option>
      <option className="bg-zinc-900 text-white">Group Table - 8+ Guests</option>
    </select>
    
    <button 
      type="submit"
      className="w-full mt-4 bg-white text-black py-4 font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
    >
      Confirm Reservation
    </button>
  </form>
  
  <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
    <div className="w-1 h-1 bg-white rounded-full"></div>
    <p className="text-[9px] tracking-widest uppercase">Fresh Food Guaranteed</p>
    <div className="w-1 h-1 bg-white rounded-full"></div>
  </div>
</div>
)}

        {/* Footer Info of Hero Section */}
        <div className="flex flex-col bg-red-700 md:flex-row justify-between md:items-center px-4 rounded-lg md:gap-6">
          <div className="max-w-xs">
            <h2 className="text-2xl md:text-3xl font-light leading-tight tracking-tight uppercase">
              A New Standard <br /> Of Dining Experience
            </h2>
          </div>
          
          <div className="text-right">
            <p className="sm:text-[4vw] text-2xl [font-family:'Archivo',sans-serif]  uppercase">
              SANJAN
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

