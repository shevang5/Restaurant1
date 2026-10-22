import { useState } from "react";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, ChefHat, Eye, EyeOff, LockKeyhole, Mail, Phone, Sparkles, UserRound } from "lucide-react";
import { asyncRegisterUser } from "../store/action/userActions";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (user) => {
    user.id = nanoid();
    user.isAdmin = false;
    delete user.confirmPassword;
    try {
      await dispatch(asyncRegisterUser(user));
      navigate("/login");
    } catch {
      // Keep the form open so the user can fix the issue and retry.
    }
  };

  const fieldClass = "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100";
  const labelClass = "mb-1.5 block text-xs font-bold text-slate-700";

  return (
    <main className="min-h-[100svh] bg-[#fff8f3] text-slate-900 lg:grid lg:min-h-screen lg:grid-cols-2">
      <section className="relative isolate flex min-h-[230px] flex-col overflow-hidden bg-gradient-to-br from-[#f35a16] via-[#e9430a] to-[#c92d08] px-5 pb-16 pt-5 text-white sm:min-h-[255px] sm:px-8 lg:min-h-screen lg:justify-between lg:px-12 lg:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[35px] border-white/10" />
          <div className="absolute -bottom-36 -left-20 h-80 w-80 rounded-full bg-orange-300/20 blur-2xl" />
          <img src="/images/bgImg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-[.14] mix-blend-screen" />
        </div>

        <Link to="/" aria-label="Back to home" className="flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
          <ArrowLeft size={15} /> Back to home
        </Link>

        <div className="mt-8 max-w-lg lg:mb-12 lg:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-orange-50 backdrop-blur-sm">
            <Sparkles size={13} /> Fresh food, good company
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">A seat at our table<br className="hidden lg:block" /> is waiting for you.</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-orange-50/90 sm:text-base">Create an account to save your favorites and keep every order close.</p>
        </div>

        <div className="hidden items-center gap-3 text-sm font-semibold text-white/85 lg:flex">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><ChefHat size={21} /></span>
          <span><span className="block text-white">Restaurant</span><span className="text-xs font-normal text-orange-100">Made fresh for you</span></span>
        </div>
      </section>

      <section className="relative z-10 -mt-9 px-3 pb-8 sm:px-6 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-md rounded-[26px] border border-orange-100/80 bg-white p-5 shadow-[0_16px_50px_rgba(110,48,19,.12)] sm:p-8 lg:rounded-3xl">
          <div className="mb-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-orange-600">Join our community</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Create your account</h2>
            <p className="mt-1 text-sm text-slate-500">Good food is even better when it’s yours.</p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="username" className={labelClass}>Your name</label>
              <div className="relative"><UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="username" type="text" autoComplete="name" placeholder="How should we call you?" className={fieldClass} {...register("name", { required: "Please enter your name." })} /></div>
              {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email address</label>
              <div className="relative"><Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="email" type="email" autoComplete="email" placeholder="you@example.com" className={fieldClass} {...register("email", { required: "Please enter your email." })} /></div>
              {errors.email && <p className="mt-1 text-xs font-medium text-rose-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Phone number</label>
              <div className="relative"><Phone size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="phone" type="tel" autoComplete="tel" placeholder="Your contact number" className={fieldClass} {...register("phone", { required: "Please enter your phone number." })} /></div>
              {errors.phone && <p className="mt-1 text-xs font-medium text-rose-600">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="relative"><LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" className={`${fieldClass} pr-12`} {...register("password", { required: "Please create a password.", minLength: { value: 6, message: "Use at least 6 characters." } })} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide passwords" : "Show passwords"} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-orange-600">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
              {errors.password && <p className="mt-1 text-xs font-medium text-rose-600">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
              <div className="relative"><LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter it one more time" className={fieldClass} {...register("confirmPassword", { required: "Please confirm your password.", validate: (value) => value === watch("password") || "Passwords do not match." })} /></div>
              {errors.confirmPassword && <p className="mt-1 text-xs font-medium text-rose-600">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f05a16] to-[#e9430a] px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(233,67,10,.24)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(233,67,10,.3)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Creating your account…" : "Create account"}
              {!isSubmitting && <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3"><span className="h-px flex-1 bg-slate-100" /><span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Or sign up with</span><span className="h-px flex-1 bg-slate-100" /></div>

          <a href={`${import.meta.env.VITE_SERVER_URL}/auth/google`} className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.75 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.53H2.16v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.16a11 11 0 0 0 0 9.9l3.69-2.84Z"/><path fill="#EA4335" d="M12 5.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.01 14.97 1 12 1a11 11 0 0 0-9.84 6.05l3.69 2.84C6.72 7.29 9.14 5.36 12 5.36Z"/></svg>
            Continue with Google
          </a>

          <p className="mt-4 text-center text-xs text-slate-500">Already have an account? <Link to="/login" className="font-extrabold text-orange-700 hover:text-orange-800">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
};

export default Register;
