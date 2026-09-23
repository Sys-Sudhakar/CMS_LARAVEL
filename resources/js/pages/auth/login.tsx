import { Form, Head } from '@inertiajs/react';
import {
    Building2,
    Mail,
    ShieldCheck,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { store } from '@/routes/login';
import { request } from '@/routes/password';

import type { TeamInvitationContext } from '@/types';

type Props = {
    status?: string;
    canResetPassword: boolean;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Login({
    status,
    canResetPassword,
    teamInvitation,
}: Props) {
    return (
        <>
            <Head title="Login | Sysnet CMS" />

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

                    <div className="hidden flex-col justify-between px-14 py-12 lg:flex xl:px-20 xl:py-14">

                        {/* BRAND LOGO */}

                        <div className="flex items-center">

                            <img
                                src="/images/Sys.png"
                                alt="Sysnet System and Solutions"
                                className="h-20 w-auto object-contain xl:h-35"
                            />

                        </div>


                        {/* HERO */}

                        <div className="max-w-xl">

                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">

                                <ShieldCheck className="h-4 w-4" />

                                Centralized Content Management

                            </div>


                            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">

                                Manage your digital ecosystem

                                <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                    from one secure platform.
                                </span>

                            </h1>


                            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                                Manage websites, content, media, users and permissions
                                from one centralized administrative workspace.
                            </p>


                            <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">

                                        <ShieldCheck className="h-5 w-5 text-blue-300" />

                                    </div>


                                    <p className="text-sm font-semibold text-white">
                                        Secure Access
                                    </p>


                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Protected authentication and role-based permissions.
                                    </p>

                                </div>


                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">

                                        <Building2 className="h-5 w-5 text-cyan-300" />

                                    </div>


                                    <p className="text-sm font-semibold text-white">
                                        Multi-site Control
                                    </p>


                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Manage assigned websites from one CMS environment.
                                    </p>

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

                        <div className="w-full max-w-[500px]">

                            {/* MOBILE BRAND LOGO */}

                            <div className="mb-8 flex justify-center lg:hidden">

                                <img
                                    src="/images/Sys.png"
                                    alt="Sysnet System and Solutions"
                                    className="h-16 w-auto object-contain"
                                />

                            </div>


                            {/* LOGIN CARD */}

                            <div className="rounded-[26px] border border-slate-200/80 bg-white/95 p-7 shadow-[0_24px_70px_rgba(2,12,27,0.28)] backdrop-blur-xl sm:p-8">

                                {/* HEADER */}

                                <div className="text-center">

                                    <img
                                        src="/sysnet-icon.png"
                                        alt="Sysnet"
                                        className="mx-auto h-12 w-12 object-contain"
                                    />


                                    <h1 className="mt-4 text-[28px] font-semibold tracking-[-0.02em] text-slate-950">
                                        Welcome back
                                    </h1>


                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                        Sign in to continue to Sysnet CMS.
                                    </p>

                                </div>


                                {/* TEAM INVITATION */}

                                {teamInvitation && (

                                    <div className="mt-6">

                                        <TeamInvitationAlert
                                            invitation={teamInvitation}
                                            action="Log in"
                                        />

                                    </div>

                                )}


                                {/* STATUS */}

                                {status && (

                                    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">

                                        {status}

                                    </div>

                                )}


                                {/* PASSKEY */}

                                <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">

                                    <div className="mb-3 flex items-center justify-between gap-4">

                                        <div>

                                            <p className="text-sm font-semibold text-slate-900">
                                                Sign in with a passkey
                                            </p>


                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                Use your registered device for a faster,
                                                passwordless sign-in.
                                            </p>

                                        </div>


                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">

                                            <ShieldCheck className="h-4 w-4 text-blue-600" />

                                        </div>

                                    </div>


                                    <PasskeyVerify />

                                </div>


                                {/* DIVIDER */}

                                <div className="my-6 flex items-center gap-4">

                                    <div className="h-px flex-1 bg-slate-200" />


                                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        Continue with email
                                    </span>


                                    <div className="h-px flex-1 bg-slate-200" />

                                </div>


                                {/* FORM */}

                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password']}
                                    className="space-y-5"
                                >
                                    {({ processing, errors }) => (

                                        <>

                                            {/* PRESERVE TEAM INVITATION */}

                                            {teamInvitation && (

                                                <input
                                                    type="hidden"
                                                    name="invitation"
                                                    value={teamInvitation.code}
                                                />

                                            )}


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
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="name@company.com"
                                                        className="
                                                            h-12
                                                            rounded-xl
                                                            border-slate-200
                                                            bg-slate-50/80
                                                            pl-11
                                                            pr-4
                                                            text-sm
                                                            shadow-sm
                                                            transition-all
                                                            placeholder:text-slate-400
                                                            focus-visible:border-blue-500
                                                            focus-visible:bg-white
                                                            focus-visible:ring-blue-500/15
                                                        "
                                                    />

                                                </div>


                                                <InputError
                                                    message={errors.email}
                                                />

                                            </div>


                                            {/* PASSWORD */}

                                            <div>

                                                <div className="mb-2 flex items-center justify-between">

                                                    <Label
                                                        htmlFor="password"
                                                        className="text-sm font-medium text-slate-700"
                                                    >
                                                        Password
                                                    </Label>


                                                    {canResetPassword && (

                                                        <TextLink
                                                            href={request()}
                                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                                            tabIndex={5}
                                                        >
                                                            Forgot password?
                                                        </TextLink>

                                                    )}

                                                </div>


                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="
                                                        h-12
                                                        rounded-xl
                                                        border-slate-200
                                                        bg-slate-50/80
                                                        text-sm
                                                        shadow-sm
                                                        focus-visible:border-blue-500
                                                        focus-visible:bg-white
                                                        focus-visible:ring-blue-500/15
                                                    "
                                                />


                                                <InputError
                                                    message={errors.password}
                                                />

                                            </div>


                                            {/* REMEMBER */}

                                            <div className="flex items-center justify-between">

                                                <div className="flex items-center gap-3">

                                                    <Checkbox
                                                        id="remember"
                                                        name="remember"
                                                        tabIndex={3}
                                                    />


                                                    <Label
                                                        htmlFor="remember"
                                                        className="cursor-pointer text-sm font-normal text-slate-600"
                                                    >
                                                        Remember me
                                                    </Label>

                                                </div>


                                                <span className="text-[11px] text-slate-400">
                                                    Personal device recommended
                                                </span>

                                            </div>


                                            {/* LOGIN BUTTON */}

                                            <Button
                                                type="submit"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                                className="
                                                    h-12
                                                    w-full
                                                    rounded-xl
                                                    bg-gradient-to-r
                                                    from-blue-600
                                                    to-blue-500
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                    shadow-lg
                                                    shadow-blue-600/20
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    hover:from-blue-700
                                                    hover:to-blue-600
                                                    hover:shadow-xl
                                                    hover:shadow-blue-600/25
                                                "
                                            >

                                                {processing && <Spinner />}


                                                {processing
                                                    ? 'Signing in...'
                                                    : 'Log in to CMS'}

                                            </Button>

                                        </>

                                    )}

                                </Form>


                                {/* SECURITY */}

                                <div className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">

                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />


                                    <p className="text-xs leading-5 text-slate-500">
                                        Secure access is restricted to authorized Sysnet users.
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


Login.layout = {
    title: '',
    description: '',
    fullScreen: true,
};