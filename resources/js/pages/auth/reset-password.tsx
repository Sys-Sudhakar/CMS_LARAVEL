import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    KeyRound,
    Mail,
    ShieldCheck,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({
    token,
    email,
    passwordRules,
}: Props) {
    return (
        <>
            <Head title="Reset Password | Sysnet CMS" />

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

                        {/* CONTENT */}
                        <div className="max-w-xl">

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
                                <ShieldCheck className="h-4 w-4" />

                                Secure Password Update
                            </div>

                            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                                Create a new secure password for your account.
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                                Choose a strong password to protect your Sysnet
                                CMS account and maintain secure access to the
                                administrative portal.
                            </p>

                            {/* INFO CARD */}
                            <div className="mt-10 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                                <div className="flex items-start gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/20">
                                        <KeyRound className="h-5 w-5 text-blue-300" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            Password Security
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-slate-400">
                                            Use a strong password that is
                                            different from passwords used on
                                            other services.
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

                            {/* RESET CARD */}
                            <div className="rounded-[30px] border border-white/20 bg-white p-8 shadow-2xl shadow-black/25 sm:p-10">

                                {/* HEADER */}
                                <div className="text-center">

                                    <img
                                        src="/sysnet-icon.png"
                                        alt="Sysnet"
                                        className="mx-auto h-16 w-16 object-contain"
                                    />

                                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">
                                        Reset your password
                                    </h1>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        Enter and confirm your new password
                                        below.
                                    </p>
                                </div>

                                {/* FORM */}
                                <Form
                                    {...update.form()}
                                    transform={(data) => ({
                                        ...data,
                                        token,
                                        email,
                                    })}
                                    resetOnSuccess={[
                                        'password',
                                        'password_confirmation',
                                    ]}
                                    className="mt-8"
                                >
                                    {({ processing, errors }) => (
                                        <div className="space-y-6">

                                            {/* EMAIL */}
                                            <div>

                                                <Label
                                                    htmlFor="email"
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    Email address
                                                </Label>

                                                <div className="relative">

                                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        autoComplete="email"
                                                        value={email}
                                                        readOnly
                                                        className="
                                                            h-12
                                                            rounded-xl
                                                            border-slate-300
                                                            bg-slate-100
                                                            pl-11
                                                            pr-4
                                                            text-sm
                                                            text-slate-600
                                                            shadow-sm
                                                            cursor-not-allowed
                                                        "
                                                    />
                                                </div>

                                                <InputError
                                                    message={errors.email}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* PASSWORD */}
                                            <div>

                                                <Label
                                                    htmlFor="password"
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    New password
                                                </Label>

                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    autoComplete="new-password"
                                                    autoFocus
                                                    placeholder="Enter your new password"
                                                    passwordrules={passwordRules}
                                                    className="
                                                        h-12
                                                        rounded-xl
                                                        border-slate-300
                                                        bg-slate-50
                                                        text-sm
                                                        shadow-sm
                                                        focus-visible:border-blue-500
                                                        focus-visible:bg-white
                                                        focus-visible:ring-blue-500/15
                                                    "
                                                />

                                                <InputError
                                                    message={errors.password}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* CONFIRM PASSWORD */}
                                            <div>

                                                <Label
                                                    htmlFor="password_confirmation"
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    Confirm new password
                                                </Label>

                                                <PasswordInput
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    autoComplete="new-password"
                                                    placeholder="Re-enter your new password"
                                                    passwordrules={passwordRules}
                                                    className="
                                                        h-12
                                                        rounded-xl
                                                        border-slate-300
                                                        bg-slate-50
                                                        text-sm
                                                        shadow-sm
                                                        focus-visible:border-blue-500
                                                        focus-visible:bg-white
                                                        focus-visible:ring-blue-500/15
                                                    "
                                                />

                                                <InputError
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* RESET BUTTON */}
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                data-test="reset-password-button"
                                                className="
                                                    h-12
                                                    w-full
                                                    rounded-xl
                                                    bg-blue-600
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
                                                {processing && <Spinner />}

                                                {processing
                                                    ? 'Resetting password...'
                                                    : 'Reset Password'}
                                            </Button>

                                        </div>
                                    )}
                                </Form>

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
                                        After your password is successfully
                                        updated, use the new password the next
                                        time you sign in to the CMS.
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

ResetPassword.layout = {
    title: '',
    description: '',
    fullScreen: true,
};