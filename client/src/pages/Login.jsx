import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { asyncLoginUsers } from '../store/action/userActions'
import { nanoid } from 'nanoid'
// Use a more inviting, high-quality, bakery-specific image
import bakeryHero from '/images/bgImg.jpg'

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    data.id = nanoid()
    dispatch(asyncLoginUsers(data))
    console.log(data)
    // Use a better success message or state management here for real apps
    navigate('/products')
  }

  // --- UI Improvements in this section ---

  return (
    <div className="flex min-h-screen w-full bg-orange-50/30">

      {/* Left Text/Image Side (Bakery Vibe) */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--color-primary)] items-center justify-center p-12">
        <div className="absolute inset-0">
          <img
            src={bakeryHero}
            alt="Delicious assortment of fresh bakery goods"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/90 to-black/40"></div>
        </div>

        <div className="relative z-10 px-12 text-center text-white">
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide font-serif drop-shadow-md">
            LA Bakery 🥐
          </h1>
          <p className="text-2xl font-light italic text-orange-50">
            "The smell of fresh baking is the smell of home."
          </p>
          <p className="mt-8 text-lg text-orange-100 max-w-lg mx-auto">
            Welcome back! Please login to your account to continue ordering our delightful pastries, artisan breads, and coffee.
          </p>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-orange-100">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">
              Sign In
            </h2>
            <p className="mt-3 text-base text-gray-500">
              Your next treat is just a click away!
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    {...register('email')}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-[var(--color-primary)]">Email is required</p>}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    {...register('password')}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                    placeholder="********"
                  />
                  {errors.password && <p className="mt-1 text-sm text-[var(--color-primary)]">Password is required</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 rounded-xl text-lg font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Login to LA Bakery
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/register"
                className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition duration-200 hover:underline"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login