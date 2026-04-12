import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import logo from '@/assets/images/cakra logo.png';
import { useEffect, useState } from 'react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    const [slide, setSlide] = useState(0);
    const [mounted, setMounted] = useState(false);
    const TOTAL = 6;

    useEffect(() => {
        const dir = sessionStorage.getItem('auth-nav-dir');
        sessionStorage.removeItem('auth-nav-dir');
        if (dir === 'to-login') {
            setMounted(false);
            requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
        } else {
            setMounted(true);
        }
        const t = setInterval(() => setSlide(s => (s + 1) % TOTAL), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <>
            <Head title="Login" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .lg-root {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 16px;
                    overflow-x: hidden;
                    background: #eeeeff;
                }

                /* Background — pakai background biasa agar aman di Safari iOS */
                .lg-bg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                }

                /* ── CARD ── */
                .lg-card {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    max-width: 860px;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.5);
                    box-shadow: 0 8px 48px rgba(93,95,239,0.15), 0 2px 12px rgba(93,95,239,0.08);
                    opacity: 0;
                    transform: translateX(60px);
                }

                .lg-card.visible {
                    animation: swipeInFromRight 0.45s cubic-bezier(0.4,0,0.2,1) forwards;
                }

                @keyframes swipeInFromRight {
                    from { opacity:0; transform:translateX(60px); }
                    to   { opacity:1; transform:translateX(0); }
                }

                /* ── LEFT — Form ── */
                .lg-left {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 40px 44px;
                    background: #ffffff;
                    overflow-y: auto;
                }

                .lg-form-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #1a2a6e;
                    margin-bottom: 4px;
                }

                .lg-form-sub {
                    font-size: 12.5px;
                    color: rgba(60,80,160,0.6);
                    margin-bottom: 20px;
                }

                .lg-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .lg-field {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .lg-field label {
                    font-size: 11.5px;
                    font-weight: 600;
                    color: rgba(30,50,140,0.75);
                    letter-spacing: 0.01em;
                }

                .lg-field input,
                .lg-field [data-slot="input"],
                .lg-field [data-slot="password-input"] {
                    height: 40px;
                    border-radius: 10px;
                    border: 1.5px solid #e2e8f5;
                    background: #f8faff;
                    font-size: 13px;
                    color: #1a2a6e;
                    padding: 0 14px;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    width: 100%;
                    outline: none;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .lg-field input::placeholder,
                .lg-field [data-slot="input"]::placeholder {
                    color: rgba(80,110,180,0.45);
                }

                .lg-field input:focus,
                .lg-field [data-slot="input"]:focus,
                .lg-field [data-slot="input"]:focus-within {
                    border-color: rgba(93,95,239,0.55);
                    box-shadow: 0 0 0 3px rgba(93,95,239,0.1);
                    background: #ffffff;
                }

                /* ── ERROR — icon ⚠ + teks ── */
                .lg-field .input-error,
                .lg-field [data-slot="input-error"] {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11.5px;
                    font-weight: 500;
                    color: #c0392b;
                    margin-top: 3px;
                    animation: errorFadeIn 0.2s ease;
                }

                .lg-field .input-error::before,
                .lg-field [data-slot="input-error"]::before {
                    content: '';
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    flex-shrink: 0;
                    background-color: #e74c3c;
                    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z'/%3E%3C/svg%3E");
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z'/%3E%3C/svg%3E");
                    mask-repeat: no-repeat;
                    -webkit-mask-repeat: no-repeat;
                    mask-size: contain;
                    -webkit-mask-size: contain;
                }

                /* Field border merah saat ada error */
                .lg-field:has(.input-error) input,
                .lg-field:has(.input-error) [data-slot="input"],
                .lg-field:has([data-slot="input-error"]) input,
                .lg-field:has([data-slot="input-error"]) [data-slot="input"] {
                    border-color: rgba(231,76,60,0.6);
                    background: #fff8f8;
                }

                @keyframes errorFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .lg-remember {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: rgba(30,50,140,0.65);
                }

                .lg-forgot {
                    font-size: 11.5px;
                    color: #5D5FEF;
                    font-weight: 600;
                    text-decoration: none;
                    text-align: right;
                    display: block;
                    margin-top: -4px;
                }

                .lg-forgot:hover { text-decoration: underline; }

                .lg-btn {
                    width: 100%;
                    height: 42px;
                    background: rgba(93,95,239,0.88);
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    font-size: 13.5px;
                    font-weight: 600;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: background 0.2s, transform 0.12s, box-shadow 0.2s;
                    letter-spacing: 0.02em;
                    box-shadow: 0 4px 18px rgba(93,95,239,0.3);
                }

                .lg-btn:hover:not(:disabled) {
                    background: rgba(71,72,216,0.95);
                    box-shadow: 0 6px 24px rgba(93,95,239,0.4);
                }

                .lg-btn:active:not(:disabled) { transform: translateY(1px); }
                .lg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .lg-register-link {
                    text-align: center;
                    font-size: 12.5px;
                    color: rgba(60,80,160,0.65);
                    margin-top: 14px;
                }

                .lg-register-link a {
                    color: #5D5FEF;
                    font-weight: 600;
                    text-decoration: none;
                }

                .lg-register-link a:hover { text-decoration: underline; }

                .lg-status {
                    font-size: 12px;
                    color: #16a34a;
                    text-align: center;
                    margin-bottom: 10px;
                    font-weight: 500;
                }

                /* ── RIGHT — Branding ── */
                .lg-right {
                    position: relative;
                    width: 42%;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 36px 32px;
                    overflow: hidden;
                    backdrop-filter: blur(20px) saturate(1.4);
                    -webkit-backdrop-filter: blur(20px) saturate(1.4);
                    min-height: 500px;
                }

                .lg-right::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.08);
                    border-left: 1px solid rgba(255,255,255,0.4);
                    z-index: 0;
                }

                .lg-right > * { position: relative; z-index: 1; }

                .lg-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }

                .lg-brand img { width: 36px; height: 36px; object-fit: contain; }

                .lg-brand-name {
                    font-size: 19px;
                    font-weight: 700;
                    color: #1a2a6e;
                    letter-spacing: 0.06em;
                }

                .lg-carousel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 16px 0;
                    min-height: 0;
                }

                .lg-slide {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    animation: fadeSlide 0.5s ease;
                }

                @keyframes fadeSlide {
                    from { opacity:0; transform:translateY(10px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                .lg-visual {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .lg-visual svg { width: 100%; max-width: 190px; height: auto; }

                .lg-slide-title {
                    font-size: 12.5px;
                    font-weight: 700;
                    color: #1a2a6e;
                    text-align: center;
                    line-height: 1.4;
                }

                .lg-right-body { flex-shrink: 0; }

                .lg-tagline {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a2a6e;
                    line-height: 1.4;
                    margin-bottom: 8px;
                }

                .lg-desc {
                    font-size: 11.5px;
                    color: rgba(30,50,140,0.65);
                    line-height: 1.7;
                }

                /* ── SVG ANIMATIONS ── */
                @keyframes drawLine    { from{stroke-dashoffset:200} to{stroke-dashoffset:0} }
                @keyframes pulseDot    { 0%,100%{r:3;opacity:1} 50%{r:5;opacity:0.6} }
                @keyframes flowNode    { 0%,100%{opacity:0.2;transform:scale(0.85)} 50%{opacity:1;transform:scale(1.08)} }
                @keyframes pulseRing   { 0%{r:6;opacity:0.9} 100%{r:22;opacity:0} }
                @keyframes spinGear    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes speedLineMid{ from{transform:translateX(-30px);opacity:0} 50%{opacity:1} to{transform:translateX(30px);opacity:0} }
                @keyframes rotateCycle { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

                /* ════════════ RESPONSIVE ════════════ */
                @media (max-width: 860px) {
                    .lg-card     { max-width: 700px; border-radius: 20px; }
                    .lg-right    { width: 45%; padding: 28px 22px; min-height: unset; }
                    .lg-brand img     { width: 30px; height: 30px; }
                    .lg-brand-name    { font-size: 16px; }
                    .lg-tagline       { font-size: 15px; }
                    .lg-desc          { font-size: 10.5px; }
                    .lg-slide-title   { font-size: 11px; }
                    .lg-visual svg    { max-width: 160px; }
                    .lg-left          { padding: 32px 28px; }
                    .lg-form-title    { font-size: 19px; }
                }

                /* Mobile — form di atas, branding di bawah */
                @media (max-width: 640px) {
                    .lg-root { padding: 0; align-items: flex-start; }

                    .lg-card {
                        flex-direction: column;
                        border-radius: 0;
                        max-width: 100%;
                        min-height: 100vh;
                    }

                    /* Form panel — full width, tampil pertama */
                    .lg-left {
                        width: 100%;
                        order: 1;
                        padding: 36px 24px 28px;
                        justify-content: flex-start;
                        flex: 1;
                    }

                    /* Branding panel — compact horizontal bar di bawah */
                    .lg-right {
                        width: 100%;
                        order: 2;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 12px;
                        padding: 16px 24px;
                        min-height: unset;
                        flex-shrink: 0;
                    }

                    .lg-right::before {
                        border-left: none;
                        border-top: 1px solid rgba(255,255,255,0.4);
                    }

                    .lg-brand { flex-shrink: 0; }
                    .lg-brand img  { width: 28px; height: 28px; }
                    .lg-brand-name { font-size: 15px; }

                    .lg-carousel {
                        flex: 1;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        padding: 0;
                        min-height: unset;
                    }

                    .lg-slide {
                        flex-direction: row;
                        align-items: center;
                        gap: 8px;
                        width: auto;
                    }

                    .lg-visual { width: 48px; height: 48px; flex-shrink: 0; }
                    .lg-visual svg { width: 48px; height: 48px; max-width: unset; }
                    .lg-slide-title { font-size: 11px; text-align: left; max-width: 120px; }

                    .lg-right-body { display: none; }

                    .lg-form-title { font-size: 20px; }
                    .lg-form-sub   { margin-bottom: 16px; }

                    .lg-field input,
                    .lg-field [data-slot="input"],
                    .lg-field [data-slot="password-input"] {
                        height: 44px;
                        font-size: 14px;
                    }

                    .lg-btn { height: 46px; font-size: 14px; }
                }

                @media (max-width: 400px) {
                    .lg-left  { padding: 28px 18px 24px; }
                    .lg-right { padding: 14px 18px; }

                    .lg-brand img  { width: 24px; height: 24px; }
                    .lg-brand-name { font-size: 13px; }
                    .lg-visual     { width: 40px; height: 40px; }
                    .lg-visual svg { width: 40px; height: 40px; }
                    .lg-slide-title { font-size: 11px; max-width: 100px; }

                    .lg-form-title { font-size: 18px; }
                    .lg-form-sub   { font-size: 11.5px; margin-bottom: 14px; }
                    .lg-fields     { gap: 10px; margin-bottom: 14px; }

                    .lg-field input,
                    .lg-field [data-slot="input"],
                    .lg-field [data-slot="password-input"] {
                        height: 42px;
                        font-size: 13.5px;
                    }

                    .lg-btn           { height: 44px; font-size: 13.5px; }
                    .lg-register-link { font-size: 12px; }
                }
            `}</style>

            <div className="lg-root">

                {/* Background SVG — absolute agar aman di Safari iOS */}
                <svg className="lg-bg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="lg-sky" x1="0" y1="0" x2="0.6" y2="1">
                            <stop offset="0%" stopColor="#f0f0ff" />
                            <stop offset="50%" stopColor="#e4e4fa" />
                            <stop offset="100%" stopColor="#d0d0f5" />
                        </linearGradient>
                        <radialGradient id="lg-gtr" cx="82%" cy="8%" r="52%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                            <stop offset="45%" stopColor="#e8e8ff" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#d0d0ff" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="lg-wA" x1="0" y1="0.8" x2="1" y2="0.4">
                            <stop offset="0%" stopColor="#9b9cf4" stopOpacity="0.7" />
                            <stop offset="60%" stopColor="#b8b9f8" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#d5d5ff" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="lg-wB" x1="0" y1="0.85" x2="0.9" y2="0.45">
                            <stop offset="0%" stopColor="#7879ee" stopOpacity="0.85" />
                            <stop offset="55%" stopColor="#9b9cf4" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#c0c0ff" stopOpacity="0.08" />
                        </linearGradient>
                        <linearGradient id="lg-wC" x1="0" y1="0.9" x2="0.85" y2="0.5">
                            <stop offset="0%" stopColor="#6667ec" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#8889f0" stopOpacity="0.65" />
                            <stop offset="100%" stopColor="#b0b0ff" stopOpacity="0.12" />
                        </linearGradient>
                        <linearGradient id="lg-wD" x1="0" y1="0.92" x2="0.75" y2="0.55">
                            <stop offset="0%" stopColor="#5D5FEF" stopOpacity="0.95" />
                            <stop offset="45%" stopColor="#7778ee" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#a0a0f8" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="lg-wE" x1="0" y1="0.95" x2="0.65" y2="0.6">
                            <stop offset="0%" stopColor="#4a4bda" stopOpacity="1" />
                            <stop offset="40%" stopColor="#5D5FEF" stopOpacity="0.9" />
                            <stop offset="85%" stopColor="#8889f0" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#a0a0f8" stopOpacity="0.1" />
                        </linearGradient>
                        <filter id="lg-b6"><feGaussianBlur stdDeviation="6" /></filter>
                        <filter id="lg-b3"><feGaussianBlur stdDeviation="3" /></filter>
                        <filter id="lg-b12"><feGaussianBlur stdDeviation="12" /></filter>
                    </defs>
                    <rect width="1440" height="900" fill="url(#lg-sky)" />
                    <rect width="1440" height="900" fill="url(#lg-gtr)" />
                    <path d="M -100 900 C 80 850,260 760,480 670 C 660 594,860 555,1100 558 C 1260 560,1380 572,1500 585 L 1500 900 Z" fill="url(#lg-wA)" filter="url(#lg-b6)" />
                    <path d="M -100 900 C 60 868,200 800,380 720 C 530 650,700 612,900 610 C 1060 608,1200 622,1360 642 L 1500 662 L 1500 900 Z" fill="url(#lg-wB)" filter="url(#lg-b3)" />
                    <path d="M -100 900 C 40 880,160 828,310 760 C 440 698,590 660,760 656 C 910 652,1040 666,1180 686 L 1380 714 L 1500 730 L 1500 900 Z" fill="url(#lg-wC)" />
                    <path d="M -100 900 C 20 892,120 854,240 798 C 354 744,480 710,630 704 C 764 698,880 712,1000 732 L 1200 762 L 1440 796 L 1500 808 L 1500 900 Z" fill="url(#lg-wD)" />
                    <path d="M -100 900 C 10 898,90 874,188 830 C 278 788,380 758,510 750 C 630 742,736 754,840 772 L 1020 800 L 1260 840 L 1500 872 L 1500 900 Z" fill="url(#lg-wE)" />
                    <ellipse cx="60" cy="860" rx="200" ry="140" fill="#5D5FEF" opacity="0.4" filter="url(#lg-b12)" />
                </svg>

                <div className={`lg-card${mounted ? ' visible' : ''}`}>

                    {/* ── Form (order:1 di mobile) ── */}
                    <div className="lg-left">
                        <h1 className="lg-form-title">Selamat Datang!</h1>
                        <p className="lg-form-sub">Masuk ke akun Anda</p>

                        {status && <p className="lg-status">{status}</p>}

                        {/* noValidate — matikan validasi bawaan browser */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            noValidate
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="lg-fields">
                                        <div className="lg-field">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email@example.com"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="lg-field">
                                            <Label htmlFor="password">Password</Label>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        {canResetPassword && (
                                            <TextLink href={request()} className="lg-forgot" tabIndex={5}>
                                                Forgot password?
                                            </TextLink>
                                        )}

                                        <div className="lg-remember">
                                            <Checkbox id="remember" name="remember" tabIndex={3} />
                                            <Label htmlFor="remember" style={{ fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                                                Remember me
                                            </Label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="lg-btn"
                                        tabIndex={4}
                                        data-test="login-button"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Masuk
                                    </button>

                                    {canRegister && (
                                        <div className="lg-register-link">
                                            Belum punya akun?{' '}
                                            <TextLink
                                                href={register()}
                                                tabIndex={6}
                                                onClick={() => sessionStorage.setItem('auth-nav-dir', 'to-register')}
                                            >
                                                Daftar
                                            </TextLink>
                                        </div>
                                    )}
                                </>
                            )}
                        </Form>
                    </div>

                    {/* ── Branding (order:2 di mobile) ── */}
                    <div className="lg-right">
                        <div className="lg-brand">
                            <img src={logo} alt="Logo" />
                            <span className="lg-brand-name">CAKRA</span>
                        </div>

                        <div className="lg-carousel">
                            <div className="lg-slide" key={slide}>
                                <div className="lg-visual">
                                    {slide === 0 && (
                                        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {[130,100,70,40].map((y,i)=><line key={i} x1="20" y1={y} x2="190" y2={y} stroke="rgba(30,50,140,0.08)" strokeWidth="1" strokeDasharray="4 3"/>)}
                                            <line x1="20" y1="20" x2="20" y2="140" stroke="rgba(30,50,140,0.2)" strokeWidth="1.5"/>
                                            <line x1="20" y1="140" x2="190" y2="140" stroke="rgba(30,50,140,0.2)" strokeWidth="1.5"/>
                                            <path d="M20,130 C50,120 70,105 95,85 C115,68 135,55 160,42 C170,38 180,36 190,34 L190,140 L20,140 Z" fill="rgba(93,95,239,0.08)"/>
                                            <path d="M20,130 C50,120 70,105 95,85 C115,68 135,55 160,42 C170,38 180,36 190,34" stroke="#5D5FEF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="0" style={{animation:'drawLine 1.2s ease forwards'}}/>
                                            {[[20,130],[55,118],[95,85],[135,55],[160,42],[190,34]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="3.5" fill="#fff" stroke="#5D5FEF" strokeWidth="2" style={{animation:`pulseDot 1.8s ease-in-out ${i*0.2}s infinite`}}/>)}
                                            <text x="190" y="28" fontSize="9" fill="#5D5FEF" textAnchor="end" fontWeight="600">+84%</text>
                                            {['Jan','Mar','Mei','Jul','Sep','Nov'].map((l,i)=><text key={i} x={20+i*34} y="153" fontSize="8" fill="rgba(30,50,140,0.4)" textAnchor="middle">{l}</text>)}
                                        </svg>
                                    )}
                                    {slide === 1 && (
                                        <svg viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="90" cy="80" r="58" stroke="rgba(93,95,239,0.12)" strokeWidth="1.5" strokeDasharray="5 4"/>
                                            <circle cx="90" cy="80" r="18" fill="rgba(93,95,239,0.1)" stroke="rgba(93,95,239,0.35)" strokeWidth="1.5"/>
                                            <text x="90" y="84" fontSize="8.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">CAKRA</text>
                                            {[{label:'Data',angle:-90,color:'#5D5FEF',delay:'0s'},{label:'Monitor',angle:0,color:'#7879ee',delay:'0.75s'},{label:'Evaluasi',angle:90,color:'#8889f0',delay:'1.5s'},{label:'Update',angle:180,color:'#4a4bda',delay:'2.25s'}].map(({label,angle,color,delay},i)=>{
                                                const rad=(angle*Math.PI)/180;
                                                const nx=90+58*Math.cos(rad),ny=80+58*Math.sin(rad);
                                                const lx=90+76*Math.cos(rad),ly=80+76*Math.sin(rad);
                                                return(<g key={i}><line x1="90" y1="80" x2={nx} y2={ny} stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2"/><circle cx={nx} cy={ny} r="10" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" style={{animation:`flowNode 2.4s ease-in-out ${delay} infinite`}}/><text x={lx} y={ly+3.5} fontSize="8" fill={color} textAnchor="middle" fontWeight="600">{label}</text></g>);
                                            })}
                                            <g style={{transformOrigin:'90px 80px',animation:'rotateCycle 4s linear infinite'}}><circle cx="90" cy="22" r="4" fill="#5D5FEF" fillOpacity="0.7"/></g>
                                        </svg>
                                    )}
                                    {slide === 2 && (
                                        <svg viewBox="0 0 190 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="95" cy="80" r="22" fill="rgba(93,95,239,0.15)" stroke="#5D5FEF" strokeWidth="2"/>
                                            <text x="95" y="77" fontSize="7.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">PUSAT</text>
                                            <text x="95" y="88" fontSize="7" fill="#5D5FEF" textAnchor="middle">DATA</text>
                                            {[{x:20,y:20,label:'Site A'},{x:170,y:20,label:'Site B'},{x:20,y:140,label:'Site C'},{x:170,y:140,label:'Site D'},{x:95,y:10,label:'HQ'},{x:10,y:80,label:'Field'},{x:180,y:80,label:'Mgmt'}].map(({x,y,label},i)=>(
                                                <g key={i}><line x1={x} y1={y} x2="95" y2="80" stroke="rgba(93,95,239,0.2)" strokeWidth="1" strokeDasharray="4 3" style={{animation:`drawLine 1s ease ${i*0.12}s forwards`}}/><circle cx={x} cy={y} r="6" fill="rgba(93,95,239,0.12)" stroke="rgba(93,95,239,0.5)" strokeWidth="1.2" style={{animation:`flowNode 2s ease ${i*0.3}s infinite`}}/><text x={x} y={y-10} fontSize="7" fill="rgba(30,50,140,0.6)" textAnchor="middle">{label}</text></g>
                                            ))}
                                        </svg>
                                    )}
                                    {slide === 3 && (
                                        <svg viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {[60,45,30,16].map((r,i)=><circle key={i} cx="90" cy="85" r={r} fill="none" stroke={i===3?'#5D5FEF':`rgba(93,95,239,${0.12+i*0.06})`} strokeWidth={i===3?2:1.2}/>)}
                                            <line x1="90" y1="20" x2="90" y2="150" stroke="rgba(93,95,239,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
                                            <line x1="25" y1="85" x2="155" y2="85" stroke="rgba(93,95,239,0.15)" strokeWidth="1" strokeDasharray="3 3"/>
                                            <line x1="90" y1="18" x2="90" y2="74" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round" strokeDasharray="120" strokeDashoffset="0" style={{animation:'drawLine 1s ease forwards'}}/>
                                            <polygon points="90,80 85,68 95,68" fill="#5D5FEF"/>
                                            <circle cx="90" cy="85" r="5" fill="#5D5FEF"/>
                                            <circle cx="90" cy="85" r="6" fill="none" stroke="#5D5FEF" strokeWidth="1.5" style={{animation:'pulseRing 1.5s ease-out infinite'}}/>
                                            <rect x="115" y="20" width="50" height="22" rx="6" fill="rgba(93,95,239,0.1)" stroke="rgba(93,95,239,0.3)" strokeWidth="1"/>
                                            <text x="140" y="35" fontSize="11" fill="#5D5FEF" textAnchor="middle" fontWeight="700">98%</text>
                                        </svg>
                                    )}
                                    {slide === 4 && (
                                        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {[[40,120,100,60],[100,30,100,60],[160,120,100,60],[40,120,100,30],[160,120,100,30]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(93,95,239,0.2)" strokeWidth="1.2" strokeDasharray="4 3" style={{animation:`drawLine 1.2s ease ${i*0.15}s forwards`}}/>)}
                                            <circle cx="100" cy="30" r="16" fill="rgba(93,95,239,0.12)" stroke="#5D5FEF" strokeWidth="1.8"/>
                                            <text x="100" y="27" fontSize="7" fill="#5D5FEF" textAnchor="middle" fontWeight="600">Admin</text>
                                            <text x="100" y="37" fontSize="9" fill="#5D5FEF" textAnchor="middle">👤</text>
                                            <circle cx="40" cy="120" r="16" fill="rgba(93,95,239,0.1)" stroke="#7879ee" strokeWidth="1.8" style={{animation:'flowNode 2s ease 0.3s infinite'}}/>
                                            <text x="40" y="117" fontSize="7" fill="#7879ee" textAnchor="middle" fontWeight="600">Teknisi</text>
                                            <text x="40" y="127" fontSize="9" fill="#7879ee" textAnchor="middle">🔧</text>
                                            <circle cx="160" cy="120" r="16" fill="rgba(74,75,218,0.1)" stroke="#4a4bda" strokeWidth="1.8" style={{animation:'flowNode 2s ease 0.6s infinite'}}/>
                                            <text x="160" y="117" fontSize="7" fill="#4a4bda" textAnchor="middle" fontWeight="600">Manager</text>
                                            <text x="160" y="127" fontSize="9" fill="#4a4bda" textAnchor="middle">📊</text>
                                            <circle cx="100" cy="75" r="12" fill="rgba(93,95,239,0.18)" stroke="#5D5FEF" strokeWidth="1.5"/>
                                            <text x="100" y="79" fontSize="7.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">HUB</text>
                                        </svg>
                                    )}
                                    {slide === 5 && (
                                        <svg viewBox="0 0 190 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g style={{transformOrigin:'75px 85px',animation:'spinGear 3s linear infinite'}}><circle cx="75" cy="85" r="32" fill="none" stroke="rgba(93,95,239,0.3)" strokeWidth="10" strokeDasharray="14 8"/><circle cx="75" cy="85" r="10" fill="rgba(93,95,239,0.15)" stroke="#5D5FEF" strokeWidth="2"/></g>
                                            <g style={{transformOrigin:'128px 65px',animation:'spinGear 3s linear infinite reverse'}}><circle cx="128" cy="65" r="20" fill="none" stroke="rgba(93,95,239,0.25)" strokeWidth="7" strokeDasharray="9 5"/><circle cx="128" cy="65" r="6" fill="rgba(93,95,239,0.15)" stroke="#7879ee" strokeWidth="1.5"/></g>
                                            {[{x:30,y:130,w:50,delay:'0s'},{x:20,y:140,w:70,delay:'0.2s'},{x:35,y:150,w:40,delay:'0.4s'}].map(({x,y,w,delay},i)=><line key={i} x1={x} y1={y} x2={x+w} y2={y} stroke="rgba(93,95,239,0.35)" strokeWidth="2" strokeLinecap="round" style={{animation:`speedLineMid 1.2s ease-in-out ${delay} infinite`}}/>)}
                                            <rect x="125" y="105" width="52" height="22" rx="7" fill="rgba(93,95,239,0.1)" stroke="rgba(93,95,239,0.3)" strokeWidth="1"/>
                                            <text x="151" y="120" fontSize="9.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">2× faster</text>
                                        </svg>
                                    )}
                                </div>
                                <p className="lg-slide-title">
                                    {['Pantau Progres Secara Real-Time','Siklus Kerja Tanpa Henti','Semua Data, Satu Pusat','Keputusan Lebih Tepat & Cepat','Terhubung dari Lapangan ke Manajemen','Lebih Cepat, Lebih Efisien'][slide]}
                                </p>
                            </div>
                        </div>

                        <div className="lg-right-body">
                            <p className="lg-tagline">Platform Konstruksi<br />Terintegrasi</p>
                            <p className="lg-desc">Monitor JPP, evaluasi subcon, dan kelola operasional proyek dalam satu platform terpadu.</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}