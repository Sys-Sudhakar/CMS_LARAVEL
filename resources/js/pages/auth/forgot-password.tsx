import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    KeyRound,
    Mail,
    ShieldCheck,
} from 'lucide-react';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({
    status,
}: ForgotPasswordProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/forgot-password');
    };

    return (
        <>
            <Head title="Forgot Password | Sysnet CMS" />

            <div className="relative min-h-screen overflow-hidden bg-slate-950">

                {/* BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#07142f] via-[#11245b] to-[#07354a]" />

                <div className="absolute -left-28 top-20 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[120px]" />

                <div className="absolute -right-28 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[120px]" />

                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
                        backgroundSize: '42px 42px',
                    }}
                />

                {/* MAIN */}
                <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

                    {/* LEFT PANEL */}
                    <div className="hidden flex-col justify-between px-14 py-14 lg:flex xl:px-20">

                        {/* BRAND LOGO */}
                        <div className="flex items-center">
                            <img
                                src="/images/Sys.png"
                                alt="Sysnet System and Solutions"
                                className="h-20 w-auto object-contain xl:h-35"
                            />
                        </div>

                        {/* LEFT CONTENT */}
                        <div className="max-w-xl">

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
                                <ShieldCheck className="h-4 w-4" />

                                Secure Account Recovery
                            </div>

                            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                                Recover access to your account securely.
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                                Enter your registered email address and we will
                                send you a secure password reset link to regain
                                access to the Sysnet CMS.
                            </p>

                            {/* INFO CARD */}
                            <div className="mt-10 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                                        <KeyRound className="h-5 w-5 text-blue-300" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            Password Reset Protection
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-slate-400">
                                            Your reset link is generated securely
                                            and sent only to your registered email
                                            address.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} Sysnet Systems.
                            All rights reserved.
                        </p>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">

                        <div className="w-full max-w-[520px]">

                            {/* MOBILE BRAND LOGO */}
                            <div className="mb-8 flex justify-center lg:hidden">
                                <img
                                    src="/images/Sys.png"
                                    alt="Sysnet System and Solutions"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* CARD */}
                            <div className="rounded-[30px] border border-white/20 bg-white p-8 shadow-2xl shadow-black/25 sm:p-10">

                                {/* HEADER */}
                                <div className="text-center">

                                    <img
                                        src="/sysnet-icon.png"
                                        alt="Sysnet"
                                        className="mx-auto h-16 w-16 object-contain"
                                    />

                                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
                                        Forgot your password?
                                    </h1>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        Enter your registered email address and
                                        we&apos;ll send you a secure password
                                        reset link.
                                    </p>
                                </div>

                                {/* SUCCESS STATUS */}
                                {status && (
                                    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                                        <div className="flex items-start gap-3">

                                            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                                            <span>
                                                {status}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* FORM */}
                                <form
                                    onSubmit={submit}
                                    className="mt-8 space-y-6"
                                >

                                    {/* EMAIL */}
                                    <div>

                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Email address
                                        </label>

                                        <div className="relative">

                                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="name@company.com"
                                                className="
                                                    h-12
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-slate-300
                                                    bg-slate-50
                                                    pl-11
                                                    pr-4
                                                    text-sm
                                                    text-slate-900
                                                    shadow-sm
                                                    outline-none
                                                    transition-all
                                                    placeholder:text-slate-400
                                                    focus:border-blue-500
                                                    focus:bg-white
                                                    focus:ring-4
                                                    focus:ring-blue-500/10
                                                "
                                            />
                                        </div>

                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="
                                            flex
                                            h-12
                                            w-full
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-blue-600
                                            px-4
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-lg
                                            shadow-blue-600/20
                                            transition-all
                                            hover:bg-blue-700
                                            hover:shadow-xl
                                            hover:shadow-blue-600/25
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >
                                        {processing
                                            ? 'Sending reset link...'
                                            : 'Send Password Reset Link'}
                                    </button>

                                </form>

                                {/* BACK TO LOGIN */}
                                <div className="mt-7 border-t border-slate-200 pt-6">

                                    <Link
                                        href="/login"
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            text-sm
                                            font-semibold
                                            text-blue-600
                                            transition-colors
                                            hover:text-blue-700
                                        "
                                    >
                                        <ArrowLeft className="h-4 w-4" />

                                        Back to Login
                                    </Link>
                                </div>

                                {/* SECURITY NOTE */}
                                <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">

                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                                    <p className="text-xs leading-5 text-slate-500">
                                        For your security, password reset links
                                        are time-limited and can only be used for
                                        the associated account.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: '',
    description: '',
    fullScreen: true,
};