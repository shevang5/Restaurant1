
import { nanoid } from 'nanoid';
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { asyncRegisterUser } from '../store/action/userActions';
import { useDispatch } from 'react-redux';
import bakeryHero from '/images/bgImg.jpg'

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const onSubmit = (user) => {
    user.id = nanoid()
    user.isAdmin = false
    console.log(user);
    dispatch(asyncRegisterUser(user))
    Navigate('/login')

  }

  return (
    <div className="flex min-h-screen w-full bg-orange-50/30">

      {/* Left Text/Image Side (Bakery Vibe) - Same as Login for consistency */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--color-primary)] items-center justify-center p-5">
        <div className="absolute inset-0">
          {/* Use the same image or a different relevant one if available. Using the same for now for consistency */}
          <img
            // Assuming we can import the same image or use a different one. 
            // Since I can't easily see if another image exists, I'll use the same import if I add it, 
            // or just a placeholder if the variable isn't available.
            // Wait, I need to add the import to Register.jsx first.
            // For now, let's assume I will add the import in a separate step or I can just use a similar structure.
            // I will use a placeholder src or I need to update imports.
            // Let's use the variable 'bakeryHero' and I will add the import in a subsequent edit if needed, 
            // but 'replace_file_content' is single block.
            // I will assume I can add the import at the top in a separate tool call or just use a placeholder div.
            // Actually, the best way is to do it all at once if possible, but I can't edit top and bottom.
            // I will leave the image src as a variable `bakeryHero` and I MUST add the import in a separate step.
            src={bakeryHero}
            alt="Delicious assortment of fresh bakery goods"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/90 to-black/40"></div>
        </div>

        <div className="relative z-10 px-12 text-center text-white">
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide font-serif drop-shadow-md">
            Restaurant
          </h1>
          <p className="text-2xl font-light italic text-orange-50">
            "Freshness you can taste, quality you can trust."
          </p>
          <p className="mt-8 text-lg text-orange-100 max-w-lg mx-auto">
            Create an account to unlock exclusive offers, track your orders, and enjoy our seamless checkout experience.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-2 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-orange-100">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Join our community of food lovers!
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 ml-1">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  required
                  {...register('name')} // Note: the original used 'name' for username
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                  placeholder="JohnDoe123"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  {...register('email')}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 ml-1">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="tel"
                  required
                  {...register('phone')}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                  placeholder="00000 00000"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  {...register('password')}
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                  placeholder="********"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 rounded-xl text-lg font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Register
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`${import.meta.env.VITE_SERVER_URL}/auth/google`}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                    />
                  </svg>
                  Sign up with Google
                </a>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/login"
                className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition duration-200 hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
