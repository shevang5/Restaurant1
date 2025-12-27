import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="py-16 px-4 lg:py-32 bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col items-center text-sm max-w-4xl mx-auto">
        <p className="text-lg text-[var(--color-primary)] font-semibold tracking-wide uppercase pb-2">Contact Us</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 pb-4 text-center">Join us for an unforgettable dining experience</h1>
        <p className="text-base text-gray-500 text-center pb-12 max-w-2xl">
          Have a question about our menu, need a custom cake for a special occasion, or just want to say hello?
          Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-[700px]">
          <div className="w-full">
            <label htmlFor="name" className="text-slate-700 font-medium ml-1">Your Name</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="h-12 p-4 mt-2 w-full border border-gray-200 rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-gray-50"
              type="text"
              required
            />
          </div>
          <div className="w-full">
            <label htmlFor="email" className="text-slate-700 font-medium ml-1">Your Email</label>
            <input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="h-12 p-4 mt-2 w-full border border-gray-200 rounded-lg outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-gray-50"
              type="email"
              required
            />
          </div>
        </div>

        <div className="mt-6 w-full md:w-[700px]">
          <label htmlFor="message" className="text-slate-700 font-medium ml-1">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your sweet cravings..."
            className="w-full mt-2 p-4 h-48 border border-gray-200 rounded-lg resize-none outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-gray-50"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="mt-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold h-12 w-56 rounded-lg active:scale-95 transition-all shadow-md hover:shadow-lg"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
