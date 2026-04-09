import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import logo from '@/assets/images/cakra logo.png';
import { useEffect, useState } from 'react';

export default function Register() {
    const [slide, setSlide] = useState(0);
    const [mounted, setMounted] = useState(false);
    const TOTAL = 6;

    useEffect(() => {
        const dir = sessionStorage.getItem('auth-nav-dir');
        sessionStorage.removeItem('auth-nav-dir');
        if (dir === 'to-register') {
            setMounted(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setMounted(true));
            });
        } else {
            setMounted(true);
        }

        const t = setInterval(() => setSlide(s => (s + 1) % TOTAL), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <>
            <Head title="Register" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

                *, *::before, *::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .rg-root {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 16px;
                    overflow: hidden;
                    background: #eeeeff;
                }

                .rg-bg {
                    position: fixed;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                }

                .rg-card {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    max-width: 860px;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow:
                        0 8px 48px rgba(93, 95, 239, 0.15),
                        0 2px 12px rgba(93, 95, 239, 0.08);
                    opacity: 0;
                    transform: translateX(-60px);
                    transition: opacity 0s, transform 0s;
                }

                .rg-card.visible {
                    animation: swipeInFromLeft 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes swipeInFromLeft {
                    from { opacity: 0; transform: translateX(-60px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                /* ── LEFT PANEL ── */
                .rg-left {
                    position: relative;
                    width: 42%;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 36px 32px;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.06);
                    backdrop-filter: blur(20px) saturate(1.4);
                    -webkit-backdrop-filter: blur(20px) saturate(1.4);
                    min-height: 500px;
                }

                .rg-left::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(255, 255, 255, 0.08);
                    border-right: 1px solid rgba(255, 255, 255, 0.4);
                    z-index: 0;
                }

                .rg-left > * { position: relative; z-index: 1; }

                .rg-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }

                .rg-brand img {
                    width: 36px;
                    height: 36px;
                    object-fit: contain;
                }

                .rg-brand-name {
                    font-size: 19px;
                    font-weight: 700;
                    color: #1a2a6e;
                    letter-spacing: 0.06em;
                }

                .rg-carousel {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 16px 0;
                    min-height: 0;
                }

                .rg-slide {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    animation: fadeSlide 0.5s ease;
                }

                @keyframes fadeSlide {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .rg-visual {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .rg-visual svg {
                    width: 100%;
                    max-width: 190px;
                    height: auto;
                }

                .rg-slide-title {
                    font-size: 12.5px;
                    font-weight: 700;
                    color: #1a2a6e;
                    text-align: center;
                    line-height: 1.4;
                }

                .rg-dots {
                    display: flex;
                    gap: 6px;
                    justify-content: center;
                }

                .rg-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(30, 50, 140, 0.2);
                    cursor: pointer;
                    transition: background 0.3s, transform 0.3s;
                    border: none;
                    padding: 0;
                }

                .rg-dot.active {
                    background: #1a2a6e;
                    transform: scale(1.3);
                }

                .rg-left-body {
                    flex-shrink: 0;
                }

                .rg-tagline {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a2a6e;
                    line-height: 1.4;
                    margin-bottom: 8px;
                }

                .rg-desc {
                    font-size: 11.5px;
                    color: rgba(30, 50, 140, 0.65);
                    line-height: 1.7;
                }

                /* ── RIGHT PANEL ── */
                .rg-right {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 40px 44px;
                    background: #ffffff;
                }

                .rg-form-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #1a2a6e;
                    margin-bottom: 4px;
                }

                .rg-form-sub {
                    font-size: 12.5px;
                    color: rgba(60, 80, 160, 0.6);
                    margin-bottom: 20px;
                }

                .rg-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .rg-field {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .rg-field label {
                    font-size: 11.5px;
                    font-weight: 600;
                    color: rgba(30, 50, 140, 0.75);
                    letter-spacing: 0.01em;
                }

                .rg-field input,
                .rg-field [data-slot="input"],
                .rg-field [data-slot="password-input"] {
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

                .rg-field input::placeholder,
                .rg-field [data-slot="input"]::placeholder {
                    color: rgba(80, 110, 180, 0.45);
                }

                .rg-field input:focus,
                .rg-field [data-slot="input"]:focus,
                .rg-field [data-slot="input"]:focus-within {
                    border-color: rgba(93, 95, 239, 0.55);
                    box-shadow: 0 0 0 3px rgba(93, 95, 239, 0.1);
                    background: #ffffff;
                }

                .rg-btn {
                    width: 100%;
                    height: 42px;
                    background: rgba(93, 95, 239, 0.88);
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
                    box-shadow: 0 4px 18px rgba(93, 95, 239, 0.3);
                }

                .rg-btn:hover:not(:disabled) {
                    background: rgba(71, 72, 216, 0.95);
                    box-shadow: 0 6px 24px rgba(93, 95, 239, 0.4);
                }

                .rg-btn:active:not(:disabled) { transform: translateY(1px); }
                .rg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .rg-login-link {
                    text-align: center;
                    font-size: 12.5px;
                    color: rgba(60, 80, 160, 0.65);
                    margin-top: 14px;
                }

                .rg-login-link a {
                    color: #5D5FEF;
                    font-weight: 600;
                    text-decoration: none;
                }

                .rg-login-link a:hover { text-decoration: underline; }

                /* ── SVG ANIMATIONS ── */
                @keyframes drawLine {
                    from { stroke-dashoffset: 200; }
                    to   { stroke-dashoffset: 0; }
                }
                @keyframes pulseDot {
                    0%, 100% { r: 3; opacity: 1; }
                    50%      { r: 5; opacity: 0.6; }
                }
                @keyframes flowNode {
                    0%, 100% { opacity: 0.2; transform: scale(0.85); }
                    50%      { opacity: 1;   transform: scale(1.08); }
                }
                @keyframes pulseRing {
                    0%   { r: 6;  opacity: 0.9; }
                    100% { r: 22; opacity: 0; }
                }
                @keyframes spinGear {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes speedLineMid {
                    from { transform: translateX(-30px); opacity: 0; }
                    50%  { opacity: 1; }
                    to   { transform: translateX(30px);  opacity: 0; }
                }
                @keyframes rotateCycle {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                /* ════════════════════════════════
                   RESPONSIVE
                ════════════════════════════════ */
                @media (max-width: 860px) {
                    .rg-card { max-width: 700px; border-radius: 20px; }

                    .rg-left {
                        width: 45%;
                        padding: 28px 22px;
                        min-height: unset;
                    }

                    .rg-brand img   { width: 30px; height: 30px; }
                    .rg-brand-name  { font-size: 16px; }
                    .rg-tagline     { font-size: 15px; }
                    .rg-desc        { font-size: 10.5px; }
                    .rg-slide-title { font-size: 11px; }
                    .rg-visual svg  { max-width: 160px; }
                    .rg-right       { padding: 32px 28px; }
                    .rg-form-title  { font-size: 19px; }
                }

                @media (max-width: 640px) {
                    .rg-root { padding: 12px; align-items: flex-start; }

                    .rg-card {
                        flex-direction: column;
                        border-radius: 20px;
                        max-width: 100%;
                    }

                    .rg-left {
                        width: 100%;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        gap: 12px;
                        padding: 18px 20px;
                        min-height: unset;
                    }

                    .rg-left::before {
                        border-right: none;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.4);
                    }

                    .rg-brand { flex-shrink: 0; }
                    .rg-brand img  { width: 26px; height: 26px; }
                    .rg-brand-name { font-size: 14px; }

                    .rg-carousel {
                        flex: 1;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        padding: 0;
                    }

                    .rg-slide {
                        flex-direction: row;
                        align-items: center;
                        gap: 8px;
                        width: auto;
                    }

                    .rg-visual { width: 52px; height: 52px; flex-shrink: 0; }
                    .rg-visual svg { width: 52px; height: 52px; max-width: unset; }
                    .rg-slide-title { font-size: 10px; text-align: left; max-width: 110px; }
                    .rg-dots { flex-direction: column; gap: 4px; }

                    .rg-left-body { flex-shrink: 0; max-width: 120px; }
                    .rg-tagline   { font-size: 10px; margin-bottom: 4px; }
                    .rg-desc      { display: none; }

                    .rg-right      { padding: 24px 20px; }
                    .rg-form-title { font-size: 18px; }

                    .rg-field input,
                    .rg-field [data-slot="input"],
                    .rg-field [data-slot="password-input"] {
                        height: 38px;
                        font-size: 14px;
                    }

                    .rg-btn { height: 44px; font-size: 14px; }
                }

                @media (max-width: 400px) {
                    .rg-root { padding: 8px; }
                    .rg-left { padding: 14px 16px; gap: 8px; }

                    .rg-brand-name  { font-size: 13px; }
                    .rg-brand img   { width: 22px; height: 22px; }
                    .rg-visual      { width: 44px; height: 44px; }
                    .rg-visual svg  { width: 44px; height: 44px; }
                    .rg-slide-title { font-size: 9.5px; max-width: 90px; }
                    .rg-left-body   { display: none; }

                    .rg-right      { padding: 20px 16px; }
                    .rg-form-title { font-size: 16px; }
                    .rg-form-sub   { font-size: 11px; margin-bottom: 14px; }
                    .rg-fields     { gap: 10px; margin-bottom: 12px; }

                    .rg-field input,
                    .rg-field [data-slot="input"],
                    .rg-field [data-slot="password-input"] {
                        height: 36px;
                        font-size: 13px;
                    }

                    .rg-btn        { height: 40px; font-size: 13px; }
                    .rg-login-link { font-size: 11px; }
                }
            `}</style>

            <div className="rg-root">

                <svg className="rg-bg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="sky" x1="0" y1="0" x2="0.6" y2="1">
                            <stop offset="0%" stopColor="#f0f0ff" />
                            <stop offset="50%" stopColor="#e4e4fa" />
                            <stop offset="100%" stopColor="#d0d0f5" />
                        </linearGradient>
                        <radialGradient id="glowTopRight" cx="82%" cy="8%" r="52%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                            <stop offset="45%" stopColor="#e8e8ff" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#d0d0ff" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="glowMidRight" cx="88%" cy="52%" r="30%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                            <stop offset="55%" stopColor="#ddddff" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ddddff" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="waveA" x1="0" y1="0.8" x2="1" y2="0.4">
                            <stop offset="0%" stopColor="#9b9cf4" stopOpacity="0.7" />
                            <stop offset="60%" stopColor="#b8b9f8" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#d5d5ff" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id="waveB" x1="0" y1="0.85" x2="0.9" y2="0.45">
                            <stop offset="0%" stopColor="#7879ee" stopOpacity="0.85" />
                            <stop offset="55%" stopColor="#9b9cf4" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#c0c0ff" stopOpacity="0.08" />
                        </linearGradient>
                        <linearGradient id="waveC" x1="0" y1="0.9" x2="0.85" y2="0.5">
                            <stop offset="0%" stopColor="#6667ec" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#8889f0" stopOpacity="0.65" />
                            <stop offset="100%" stopColor="#b0b0ff" stopOpacity="0.12" />
                        </linearGradient>
                        <linearGradient id="waveD" x1="0" y1="0.92" x2="0.75" y2="0.55">
                            <stop offset="0%" stopColor="#5D5FEF" stopOpacity="0.95" />
                            <stop offset="45%" stopColor="#7778ee" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#a0a0f8" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="waveE" x1="0" y1="0.95" x2="0.65" y2="0.6">
                            <stop offset="0%" stopColor="#4a4bda" stopOpacity="1" />
                            <stop offset="40%" stopColor="#5D5FEF" stopOpacity="0.9" />
                            <stop offset="85%" stopColor="#8889f0" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#a0a0f8" stopOpacity="0.1" />
                        </linearGradient>
                        <filter id="blur6" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="6" />
                        </filter>
                        <filter id="blur3" x="-5%" y="-5%" width="110%" height="110%">
                            <feGaussianBlur stdDeviation="3" />
                        </filter>
                        <filter id="blur12" x="-15%" y="-15%" width="130%" height="130%">
                            <feGaussianBlur stdDeviation="12" />
                        </filter>
                    </defs>
                    <rect width="1440" height="900" fill="url(#sky)" />
                    <rect width="1440" height="900" fill="url(#glowTopRight)" />
                    <rect width="1440" height="900" fill="url(#glowMidRight)" />
                    <path d="M -100 900 C 80 850, 260 760, 480 670 C 660 594, 860 555, 1100 558 C 1260 560, 1380 572, 1500 585 L 1500 900 Z" fill="url(#waveA)" filter="url(#blur6)" />
                    <path d="M -100 900 C 60 868, 200 800, 380 720 C 530 650, 700 612, 900 610 C 1060 608, 1200 622, 1360 642 L 1500 662 L 1500 900 Z" fill="url(#waveB)" filter="url(#blur3)" />
                    <path d="M -100 900 C 40 880, 160 828, 310 760 C 440 698, 590 660, 760 656 C 910 652, 1040 666, 1180 686 L 1380 714 L 1500 730 L 1500 900 Z" fill="url(#waveC)" />
                    <path d="M -100 900 C 20 892, 120 854, 240 798 C 354 744, 480 710, 630 704 C 764 698, 880 712, 1000 732 L 1200 762 L 1440 796 L 1500 808 L 1500 900 Z" fill="url(#waveD)" />
                    <path d="M -100 900 C 10 898, 90 874, 188 830 C 278 788, 380 758, 510 750 C 630 742, 736 754, 840 772 L 1020 800 L 1260 840 L 1500 872 L 1500 900 Z" fill="url(#waveE)" />
                    <ellipse cx="60" cy="860" rx="200" ry="140" fill="#5D5FEF" opacity="0.4" filter="url(#blur12)" />
                    <path d="M -100 900 C 80 850, 260 760, 480 670 C 660 594, 860 555, 1100 558 C 1260 560, 1380 572, 1500 585" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" filter="url(#blur3)" />
                    <path d="M -100 900 C 60 868, 200 800, 380 720 C 530 650, 700 612, 900 610 C 1060 608, 1200 622, 1360 642 L 1500 662" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" filter="url(#blur3)" />
                    <path d="M -100 900 C 40 880, 160 828, 310 760 C 440 698, 590 660, 760 656 C 910 652, 1040 666, 1180 686 L 1380 714 L 1500 730" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                    <path d="M -100 900 C 20 892, 120 854, 240 798 C 354 744, 480 710, 630 704 C 764 698, 880 712, 1000 732 L 1200 762 L 1440 796 L 1500 808" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
                </svg>

                <div className={`rg-card${mounted ? ' visible' : ''}`}>

                    {/* ── LEFT ── */}
                    <div className="rg-left">

                        {/* 1. Brand */}
                        <div className="rg-brand">
                            <img src={logo} alt="Logo" style={{ transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)' }} />
                            <span className="rg-brand-name">CAKRA</span>
                        </div>

                        {/* 2. Carousel */}
                        <div className="rg-carousel">
                            <div className="rg-slide" key={slide}>
                                <div className="rg-visual">

                                    {/* Slide 0 — Grafik Progres */}
                                    {slide === 0 && (
                                        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {[130, 100, 70, 40].map((y, i) => (
                                                <line key={i} x1="20" y1={y} x2="190" y2={y} stroke="rgba(30,50,140,0.08)" strokeWidth="1" strokeDasharray="4 3" />
                                            ))}
                                            <line x1="20" y1="20" x2="20" y2="140" stroke="rgba(30,50,140,0.2)" strokeWidth="1.5" />
                                            <line x1="20" y1="140" x2="190" y2="140" stroke="rgba(30,50,140,0.2)" strokeWidth="1.5" />
                                            <path d="M20,130 C50,120 70,105 95,85 C115,68 135,55 160,42 C170,38 180,36 190,34 L190,140 L20,140 Z" fill="rgba(93,95,239,0.08)" />
                                            <path d="M20,130 C50,120 70,105 95,85 C115,68 135,55 160,42 C170,38 180,36 190,34"
                                                stroke="#5D5FEF" strokeWidth="2.5" strokeLinecap="round"
                                                strokeDasharray="200" strokeDashoffset="0"
                                                style={{ animation: 'drawLine 1.2s ease forwards' }} />
                                            {[[20,130],[55,118],[95,85],[135,55],[160,42],[190,34]].map(([cx, cy], i) => (
                                                <circle key={i} cx={cx} cy={cy} r="3.5" fill="#fff" stroke="#5D5FEF" strokeWidth="2"
                                                    style={{ animation: `pulseDot 1.8s ease-in-out ${i * 0.2}s infinite` }} />
                                            ))}
                                            <text x="190" y="28" fontSize="9" fill="#5D5FEF" textAnchor="end" fontWeight="600">+84%</text>
                                            {['Jan','Mar','Mei','Jul','Sep','Nov'].map((l, i) => (
                                                <text key={i} x={20 + i * 34} y="153" fontSize="8" fill="rgba(30,50,140,0.4)" textAnchor="middle">{l}</text>
                                            ))}
                                        </svg>
                                    )}

                                    {/* Slide 1 — Siklus Loop */}
                                    {slide === 1 && (
                                        <svg viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="90" cy="80" r="58" stroke="rgba(93,95,239,0.12)" strokeWidth="1.5" strokeDasharray="5 4" />
                                            <circle cx="90" cy="80" r="18" fill="rgba(93,95,239,0.1)" stroke="rgba(93,95,239,0.35)" strokeWidth="1.5" />
                                            <text x="90" y="84" fontSize="8.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">CAKRA</text>
                                            {[
                                                { label: 'Data',     angle: -90, color: '#5D5FEF', delay: '0s' },
                                                { label: 'Monitor',  angle:   0, color: '#7879ee', delay: '0.75s' },
                                                { label: 'Evaluasi', angle:  90, color: '#8889f0', delay: '1.5s' },
                                                { label: 'Update',   angle: 180, color: '#4a4bda', delay: '2.25s' },
                                            ].map(({ label, angle, color, delay }, i) => {
                                                const rad = (angle * Math.PI) / 180;
                                                const nx = 90 + 58 * Math.cos(rad);
                                                const ny = 80 + 58 * Math.sin(rad);
                                                const lx = 90 + 76 * Math.cos(rad);
                                                const ly = 80 + 76 * Math.sin(rad);
                                                return (
                                                    <g key={i}>
                                                        <line x1="90" y1="80" x2={nx} y2={ny} stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
                                                        <circle cx={nx} cy={ny} r="10" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"
                                                            style={{ animation: `flowNode 2.4s ease-in-out ${delay} infinite` }} />
                                                        <text x={lx} y={ly + 3.5} fontSize="8" fill={color} textAnchor="middle" fontWeight="600">{label}</text>
                                                    </g>
                                                );
                                            })}
                                            <g style={{ transformOrigin: '90px 80px', animation: 'rotateCycle 4s linear infinite' }}>
                                                <circle cx="90" cy="22" r="4" fill="#5D5FEF" fillOpacity="0.7" />
                                            </g>
                                        </svg>
                                    )}

                                    {/* Slide 2 — Centralized System */}
                                    {slide === 2 && (
                                        <svg viewBox="0 0 190 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="95" cy="80" r="22" fill="rgba(93,95,239,0.15)" stroke="#5D5FEF" strokeWidth="2" />
                                            <text x="95" y="77" fontSize="7.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">PUSAT</text>
                                            <text x="95" y="88" fontSize="7" fill="#5D5FEF" textAnchor="middle">DATA</text>
                                            {[
                                                { x: 20,  y: 20,  label: 'Site A' },
                                                { x: 170, y: 20,  label: 'Site B' },
                                                { x: 20,  y: 140, label: 'Site C' },
                                                { x: 170, y: 140, label: 'Site D' },
                                                { x: 95,  y: 10,  label: 'HQ' },
                                                { x: 10,  y: 80,  label: 'Field' },
                                                { x: 180, y: 80,  label: 'Mgmt' },
                                            ].map(({ x, y, label }, i) => (
                                                <g key={i}>
                                                    <line x1={x} y1={y} x2="95" y2="80" stroke="rgba(93,95,239,0.2)" strokeWidth="1" strokeDasharray="4 3"
                                                        style={{ animation: `drawLine 1s ease ${i * 0.12}s forwards` }} />
                                                    <circle cx={x} cy={y} r="6" fill="rgba(93,95,239,0.12)" stroke="rgba(93,95,239,0.5)" strokeWidth="1.2"
                                                        style={{ animation: `flowNode 2s ease ${i * 0.3}s infinite` }} />
                                                    <text x={x} y={y - 10} fontSize="7" fill="rgba(30,50,140,0.6)" textAnchor="middle">{label}</text>
                                                </g>
                                            ))}
                                        </svg>
                                    )}

                                    {/* Slide 3 — Decision & Accuracy */}
                                    {slide === 3 && (
                                        <svg viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {[60, 45, 30, 16].map((r, i) => (
                                                <circle key={i} cx="90" cy="85" r={r}
                                                    fill="none"
                                                    stroke={i === 3 ? '#5D5FEF' : `rgba(93,95,239,${0.12 + i * 0.06})`}
                                                    strokeWidth={i === 3 ? 2 : 1.2} />
                                            ))}
                                            <line x1="90" y1="20" x2="90" y2="150" stroke="rgba(93,95,239,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                                            <line x1="25" y1="85" x2="155" y2="85" stroke="rgba(93,95,239,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                                            <line x1="90" y1="18" x2="90" y2="74" stroke="#5D5FEF" strokeWidth="2" strokeLinecap="round"
                                                strokeDasharray="120" strokeDashoffset="0"
                                                style={{ animation: 'drawLine 1s ease forwards' }} />
                                            <polygon points="90,80 85,68 95,68" fill="#5D5FEF" />
                                            <circle cx="90" cy="85" r="5" fill="#5D5FEF" />
                                            <circle cx="90" cy="85" r="6" fill="none" stroke="#5D5FEF" strokeWidth="1.5"
                                                style={{ animation: 'pulseRing 1.5s ease-out infinite' }} />
                                            <rect x="115" y="20" width="50" height="22" rx="6" fill="rgba(93,95,239,0.1)" stroke="rgba(93,95,239,0.3)" strokeWidth="1" />
                                            <text x="140" y="35" fontSize="11" fill="#5D5FEF" textAnchor="middle" fontWeight="700">98%</text>
                                        </svg>
                                    )}

                                    {/* Slide 4 — Kolaborasi Tim */}
                                    {slide === 4 && (
                                        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            {[
                                                [40, 120, 100, 60],
                                                [100, 30, 100, 60],
                                                [160, 120, 100, 60],
                                                [40, 120, 100, 30],
                                                [160, 120, 100, 30],
                                            ].map(([x1, y1, x2, y2], i) => (
                                                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                                    stroke="rgba(93,95,239,0.2)" strokeWidth="1.2" strokeDasharray="4 3"
                                                    style={{ animation: `drawLine 1.2s ease ${i * 0.15}s forwards` }} />
                                            ))}
                                            <circle cx="100" cy="30" r="16" fill="rgba(93,95,239,0.12)" stroke="#5D5FEF" strokeWidth="1.8" />
                                            <text x="100" y="27" fontSize="7" fill="#5D5FEF" textAnchor="middle" fontWeight="600">Admin</text>
                                            <text x="100" y="37" fontSize="9" fill="#5D5FEF" textAnchor="middle">👤</text>
                                            <circle cx="40" cy="120" r="16" fill="rgba(93,95,239,0.1)" stroke="#7879ee" strokeWidth="1.8"
                                                style={{ animation: 'flowNode 2s ease 0.3s infinite' }} />
                                            <text x="40" y="117" fontSize="7" fill="#7879ee" textAnchor="middle" fontWeight="600">Teknisi</text>
                                            <text x="40" y="127" fontSize="9" fill="#7879ee" textAnchor="middle">🔧</text>
                                            <circle cx="160" cy="120" r="16" fill="rgba(74,75,218,0.1)" stroke="#4a4bda" strokeWidth="1.8"
                                                style={{ animation: 'flowNode 2s ease 0.6s infinite' }} />
                                            <text x="160" y="117" fontSize="7" fill="#4a4bda" textAnchor="middle" fontWeight="600">Manager</text>
                                            <text x="160" y="127" fontSize="9" fill="#4a4bda" textAnchor="middle">📊</text>
                                            <circle cx="100" cy="75" r="12" fill="rgba(93,95,239,0.18)" stroke="#5D5FEF" strokeWidth="1.5" />
                                            <text x="100" y="79" fontSize="7.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">HUB</text>
                                        </svg>
                                    )}

                                    {/* Slide 5 — Speed */}
                                    {slide === 5 && (
                                        <svg viewBox="0 0 190 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g style={{ transformOrigin: '75px 85px', animation: 'spinGear 3s linear infinite' }}>
                                                <circle cx="75" cy="85" r="32" fill="none" stroke="rgba(93,95,239,0.3)" strokeWidth="10" strokeDasharray="14 8" />
                                                <circle cx="75" cy="85" r="10" fill="rgba(93,95,239,0.15)" stroke="#5D5FEF" strokeWidth="2" />
                                            </g>
                                            <g style={{ transformOrigin: '128px 65px', animation: 'spinGear 3s linear infinite reverse' }}>
                                                <circle cx="128" cy="65" r="20" fill="none" stroke="rgba(93,95,239,0.25)" strokeWidth="7" strokeDasharray="9 5" />
                                                <circle cx="128" cy="65" r="6" fill="rgba(93,95,239,0.15)" stroke="#7879ee" strokeWidth="1.5" />
                                            </g>
                                            {[
                                                { x: 30, y: 130, w: 50, delay: '0s' },
                                                { x: 20, y: 140, w: 70, delay: '0.2s' },
                                                { x: 35, y: 150, w: 40, delay: '0.4s' },
                                            ].map(({ x, y, w, delay }, i) => (
                                                <line key={i} x1={x} y1={y} x2={x + w} y2={y}
                                                    stroke="rgba(93,95,239,0.35)" strokeWidth="2" strokeLinecap="round"
                                                    style={{ animation: `speedLineMid 1.2s ease-in-out ${delay} infinite` }} />
                                            ))}
                                            <rect x="125" y="105" width="52" height="22" rx="7" fill="rgba(93,95,239,0.1)" stroke="rgba(93,95,239,0.3)" strokeWidth="1" />
                                            <text x="151" y="120" fontSize="9.5" fill="#5D5FEF" textAnchor="middle" fontWeight="700">2× faster</text>
                                        </svg>
                                    )}

                                </div>

                                <p className="rg-slide-title">
                                    {[
                                        'Pantau Progres Secara Real-Time',
                                        'Siklus Kerja Tanpa Henti',
                                        'Semua Data, Satu Pusat',
                                        'Keputusan Lebih Tepat & Cepat',
                                        'Terhubung dari Lapangan ke Manajemen',
                                        'Lebih Cepat, Lebih Efisien',
                                    ][slide]}
                                </p>
                            </div>
                        </div>

                        {/* 3. Tagline + Desc */}
                        <div className="rg-left-body">
                            <p className="rg-tagline">
                                Platform Konstruksi<br />Terintegrasi
                            </p>
                            <p className="rg-desc">
                                Monitor progres PT3, evaluasi subcon, dan kelola operasional proyek dalam satu platform terpadu.
                            </p>
                        </div>

                    </div>

                    {/* ── RIGHT — Form ── */}
                    <div className="rg-right">
                        <h1 className="rg-form-title">Registrasi !</h1>
                        <p className="rg-form-sub">Enter your Full Details</p>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="rg-fields">
                                        <div className="rg-field">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" type="text" required autoFocus tabIndex={1} autoComplete="name" name="name" placeholder="Full name" />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                        <div className="rg-field">
                                            <Label htmlFor="email">Email address</Label>
                                            <Input id="email" type="email" required tabIndex={2} autoComplete="email" name="email" placeholder="email@example.com" />
                                            <InputError message={errors.email} />
                                        </div>
                                        <div className="rg-field">
                                            <Label htmlFor="password">Password</Label>
                                            <PasswordInput id="password" required tabIndex={3} autoComplete="new-password" name="password" placeholder="Password" />
                                            <InputError message={errors.password} />
                                        </div>
                                        <div className="rg-field">
                                            <Label htmlFor="password_confirmation">Confirm password</Label>
                                            <PasswordInput id="password_confirmation" required tabIndex={4} autoComplete="new-password" name="password_confirmation" placeholder="Confirm password" />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    <button type="submit" className="rg-btn" tabIndex={5} data-test="register-user-button" disabled={processing}>
                                        {processing && <Spinner />}
                                        Continue
                                    </button>

                                    <div className="rg-login-link">
                                        Already have an account?{' '}
                                        <TextLink
                                            href={login()}
                                            tabIndex={6}
                                            onClick={() => sessionStorage.setItem('auth-nav-dir', 'to-login')}
                                        >
                                            Sign in
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                </div>
            </div>
        </>
    );
}