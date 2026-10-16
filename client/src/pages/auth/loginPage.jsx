import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, Mail, ShoppingBag, Sparkles, Truck, X } from "lucide-react";
import { asyncLoginUsers } from "../../store/action/userActions";
import axios from "../../api/config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(asyncLoginUsers({ email, password }));
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleForgot = async (event) => {
    event.preventDefault();
    setForgotLoading(true);
    setForgotMsg("");
    try {
      const { data } = await axios.post("/auth/forgot-password", { email: forgotEmail });
      setForgotMsg(data.message || "If your email exists, a reset link was sent.");
    } catch (error) {
      setForgotMsg(error.response?.data?.message || "Error sending reset link.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="min-h-[100svh] bg-[#ffe2d9] sm:flex sm:items-center sm:justify-center sm:p-5">
      <section className="relative isolate flex min-h-[100svh] w-full max-w-[430px] flex-col overflow-hidden bg-[#e52c08] px-6 pb-5 pt-7 text-white sm:min-h-[820px] sm:rounded-[34px] sm:shadow-[0_24px_70px_rgba(116,34,15,.28)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-24 top-40 h-64 w-64 rounded-full bg-[#f54a20]/70 blur-2xl" />
          <div className="absolute -right-28 top-[42%] h-72 w-72 rounded-full bg-[#b91c06]/55 blur-2xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#f25a30]/55 blur-3xl" />
          <div className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: "repeating-linear-gradient(162deg, transparent 0 40px, #ffac8f 41px 54px, transparent 55px 88px)" }} />
        </div>

        <header className="relative flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#fff1e9] px-4 py-2 text-[11px] font-bold tracking-wide text-[#9b250d] shadow-sm">
            <Sparkles size={14} className="text-orange-600" /> FRESH FLAVORS · READY TO ORDER
          </div>
        </header>

        <div className="relative z-10 mt-7 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.28em] text-orange-100">Good food, good mood</p>
          <h1 className="mt-3 text-[clamp(2.7rem,12vw,3.65rem)] font-black leading-[.88] tracking-[-.055em] drop-shadow-sm">
            Welcome to<br /><span className="text-[#fff1df]">Restaurant</span>
          </h1>
        </div>

        <div className="relative mx-auto mt-5 h-[clamp(190px,34vh,285px)] w-full max-w-[340px] shrink-0">
          <div className="absolute inset-x-4 inset-y-3 rotate-[-5deg] rounded-[44%_56%_48%_52%] bg-[#ffb15c] shadow-[0_22px_35px_rgba(86,18,5,.3)]" />
          <div className="absolute inset-x-5 inset-y-1 rotate-[3deg] overflow-hidden rounded-[48%_52%_42%_58%] border-[5px] border-[#ffad68] bg-orange-200 shadow-xl">
            <img src="/images/bgImg.jpg" alt="Freshly made sandwich with vegetables" className="h-full w-full scale-110 object-cover object-[50%_55%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#8f210d]/35 via-transparent to-white/5" />
          </div>
          <div className="absolute -bottom-1 right-4 rotate-3 rounded-full border border-white/30 bg-[#fff1e8] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#a12a12] shadow-lg">Made fresh for you</div>
        </div>

        <div className="relative z-10 mt-auto space-y-3 pt-5">
          <button type="button" onClick={() => setShowLogin(true)} className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#fff0e9] px-5 py-3 text-sm font-bold text-[#3c211b] shadow-md transition hover:bg-white active:scale-[.98]">
            <Mail size={17} /> Continue with Email
          </button>
          <Link to="/products" className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/90 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[.98]">
            <ShoppingBag size={17} /> Order Delivery <Truck size={16} />
          </Link>
          <p className="mx-auto max-w-[340px] pt-1 text-center text-[9px] leading-[1.55] text-orange-50/90">By continuing, you agree to our Terms and Conditions and Privacy Policy.</p>
        </div>

        {showLogin && <div className="absolute inset-0 z-30 flex items-end bg-black/40 p-3 backdrop-blur-[2px] sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowLogin(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="login-title" className="max-h-[92%] w-full overflow-y-auto rounded-[28px] bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-[.16em] text-orange-600">Welcome back</p><h2 id="login-title" className="mt-1 text-2xl font-black">Sign in to continue</h2></div>
              <button type="button" onClick={() => setShowLogin(false)} aria-label="Close sign in" className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email address<input type="email" id="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-normal outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></label>
              <label className="block text-sm font-semibold text-slate-700" htmlFor="password"><span className="flex items-center justify-between">Password<button type="button" onClick={() => { setForgotEmail(email); setShowForgot(true); }} className="text-xs font-bold text-orange-700 hover:underline">Forgot password?</button></span><input type="password" id="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-normal outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></label>
              <button type="submit" className="w-full rounded-xl bg-[#e52c08] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#c92305] active:scale-[.99]">Sign in</button>
            </form>
            <div className="my-4 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>or continue with<span className="h-px flex-1 bg-slate-200"/></div>
            <a href={`${import.meta.env.VITE_SERVER_URL}/auth/google`} className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.75 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.28-1.93-6.15-4.53H2.16v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.16a11 11 0 0 0 0 9.9l3.69-2.84Z"/><path fill="#EA4335" d="M12 5.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.01 14.97 1 12 1a11 11 0 0 0-9.84 6.05l3.69 2.84C6.72 7.29 9.14 5.36 12 5.36Z"/></svg>
              Continue with Google
            </a>
            <p className="mt-5 text-center text-sm text-slate-500">New here? <Link to="/register" className="font-bold text-orange-700 hover:underline">Create an account</Link></p>
            <button type="button" onClick={() => setShowLogin(false)} className="mt-4 flex w-full items-center justify-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700"><ArrowLeft size={14}/> Back to welcome</button>
          </section>
        </div>}

        {showForgot && <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="forgot-title" className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
            <button type="button" onClick={() => { setShowForgot(false); setForgotMsg(""); }} aria-label="Close password reset" className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={20}/></button>
            <h2 id="forgot-title" className="text-xl font-bold">Reset password</h2><p className="mt-2 text-sm text-slate-500">Enter your email and we’ll send a reset link.</p>
            <form onSubmit={handleForgot} className="mt-5 space-y-3"><label className="block text-sm font-semibold" htmlFor="forgot-email">Email address<input id="forgot-email" type="email" required value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} placeholder="you@example.com" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"/></label><button type="submit" disabled={forgotLoading} className="w-full rounded-xl bg-[#e52c08] px-4 py-3 font-bold text-white disabled:opacity-60">{forgotLoading ? "Sending…" : "Send reset link"}</button></form>
            {forgotMsg && <p role="status" className={`mt-3 rounded-xl p-3 text-center text-sm ${forgotMsg.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{forgotMsg}</p>}
          </section>
        </div>}
      </section>
    </main>
  );
};

export default LoginPage;
