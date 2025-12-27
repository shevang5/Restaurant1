import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { asyncLoginUsers } from '../../store/action/userActions';
import axios from '../../api/config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(asyncLoginUsers({ email, password }))
      .then(() => navigate('/'))
      .catch((error) => console.log(error));
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg('');
    try {
      const { data } = await axios.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMsg(data.message || 'If your email exists, a reset link was sent.');
    } catch (err) {
      setForgotMsg(err.response?.data?.message || 'Error sending reset link.');
    }
    setForgotLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-orange-50/30">

      {/* Left Text/Image Side (Bakery Vibe) */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--color-primary)] items-center justify-center p-12">
        <div className="absolute inset-0">
          <img
            src="/images/bgImg.jpg"
            alt="Delicious assortment of fresh bakery goods"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/90 to-black/40"></div>
        </div>

        <div className="relative z-10 px-12 text-center text-white">
          <h1 className="text-6xl font-extrabold mb-6 tracking-wide font-serif drop-shadow-md">
            LA Bakery 🥐
          </h1>
          <p className="text-xl text-orange-50 italic">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="block text-sm font-semibold text-gray-700" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline"
                    onClick={() => setShowForgot(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="mt-1">
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50 text-base"
                    placeholder="********"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 rounded-xl text-lg font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Login to LA Bakery
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
                  Sign in with Google
                </a>
              </div>
            </div>

            <div className="text-center mt-6">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/register" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition duration-200 hover:underline">
                Create an account
              </Link>
            </div>

          </form>
        </div>
      </div>

      {/* Forgot Password Modal - Styled to match */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative transform transition-all scale-100">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => { setShowForgot(false); setForgotMsg(''); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 6 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Reset Password</h3>
            <p className="text-gray-500 mb-6 text-sm">Enter your email and we'll send you a link to reset your password.</p>

            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 ml-1 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 bg-gray-50"
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/20 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            {forgotMsg && (
              <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${forgotMsg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {forgotMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
