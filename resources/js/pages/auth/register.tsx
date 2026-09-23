import { Form, Head } from '@inertiajs/react';

import {
    Building2,
    Mail,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { login } from '@/routes';
import { store } from '@/routes/register';

import type { TeamInvitationContext } from '@/types';

type Props = {
    passwordRules: string;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Register({
    passwordRules,
    teamInvitation,
}: Props) {
    return (
        <>
            <Head title="Register | Sysnet CMS" />

            <div className="relative min-h-screen overflow-hidden bg-slate-950">

                {/* =====================================================
                    BACKGROUND
                   ===================================================== */}

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

                {/* =====================================================
                    MAIN
                   ===================================================== */}

                <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

                    {/* =================================================
                        LEFT PANEL
                       ================================================= */}

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
                                Create your access to
                                <span className="block bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                    the Sysnet CMS platform.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-base leading-7 text-slate-300">
                                Create your account to securely access assigned
                                websites, content, media and administrative
                                tools through one centralized CMS environment.
                            </p>

                            {/* FEATURE CARDS */}

                            <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                                        <ShieldCheck className="h-5 w-5 text-blue-300" />
                                    </div>

                                    <p className="text-sm font-semibold text-white">
                                        Secure Registration
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Protected account creation with secure
                                        authentication and access controls.
                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
                                        <Building2 className="h-5 w-5 text-cyan-300" />
                                    </div>

                                    <p className="text-sm font-semibold text-white">
                                        Role-based Access
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-slate-400">
                                        Available CMS features are determined by
                                        your assigned role and permissions.
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

                    {/* =================================================
                        RIGHT PANEL
                       ================================================= */}

                    <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">

                        <div className="w-full max-w-[500px]">

                            {/* MOBILE BRAND */}

                            <div className="mb-8 flex justify-center lg:hidden">
                                <img
                                    src="/images/Sys.png"
                                    alt="Sysnet System and Solutions"
                                    className="h-16 w-auto object-contain"
                                />
                            </div>

                            {/* =================================================
                                REGISTER CARD
                               ================================================= */}

                            <div className="rounded-[28px] border border-white/20 bg-white p-8 shadow-2xl shadow-black/25 sm:p-9">

                                {/* HEADER */}

                                <div className="text-center">

                                    <img
                                        src="/sysnet-icon.png"
                                        alt="Sysnet"
                                        className="mx-auto h-14 w-14 object-contain"
                                    />

                                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                                        Create your account
                                    </h1>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        Register to continue to Sysnet CMS.
                                    </p>

                                </div>

                                {/* TEAM INVITATION */}

                                {teamInvitation && (
                                    <div className="mt-6">
                                        <TeamInvitationAlert
                                            invitation={teamInvitation}
                                            action="Register"
                                        />
                                    </div>
                                )}

                                {/* =================================================
                                    REGISTER FORM
                                   ================================================= */}

                                <Form
                                    {...store.form()}
                                    resetOnSuccess={[
                                        'password',
                                        'password_confirmation',
                                    ]}
                                    disableWhileProcessing
                                    className="mt-7"
                                >
                                    {({ processing, errors }) => (
                                        <div className="space-y-5">

                                            {/* NAME */}

                                            <div>

                                                <Label
                                                    htmlFor="name"
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    Full name
                                                </Label>

                                                <div className="relative">

                                                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="name"
                                                        name="name"
                                                        placeholder="Enter your full name"
                                                        className="
                                                            h-12
                                                            rounded-xl
                                                            border-slate-300
                                                            bg-slate-50
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
                                                    message={errors.name}
                                                    className="mt-2"
                                                />

                                            </div>

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
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="email"
                                                        name="email"
                                                        placeholder="name@company.com"
                                                        className="
                                                            h-12
                                                            rounded-xl
                                                            border-slate-300
                                                            bg-slate-50
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
                                                    className="mt-2"
                                                />

                                            </div>

                                            {/* PASSWORD */}

                                            <div>

                                                <Label
                                                    htmlFor="password"
                                                    className="mb-2 block text-sm font-medium text-slate-700"
                                                >
                                                    Password
                                                </Label>

                                                <PasswordInput
                                                    id="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Create a password"
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
                                                    Confirm password
                                                </Label>

                                                <PasswordInput
                                                    id="password_confirmation"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Re-enter your password"
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

                                            {/* CREATE ACCOUNT */}

                                            <Button
                                                type="submit"
                                                tabIndex={5}
                                                disabled={processing}
                                                data-test="register-user-button"
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
                                                    ? 'Creating account...'
                                                    : 'Create account'}
                                            </Button>

                                        </div>
                                    )}
                                </Form>

                                {/* =================================================
                                    LOGIN LINK
                                   ================================================= */}

                                <div className="mt-6 border-t border-slate-200 pt-5 text-center">

                                    <p className="text-sm text-slate-500">

                                        Already have an account?{' '}

                                        <TextLink
                                            href={
                                                teamInvitation
                                                    ? login.url({
                                                          query: {
                                                              invitation:
                                                                  teamInvitation.code,
                                                          },
                                                      })
                                                    : login()
                                            }
                                            data-test="team-invitation-login-link"
                                            tabIndex={6}
                                            className="font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            Log in
                                        </TextLink>

                                    </p>

                                </div>

                                {/* =================================================
                                    SECURITY NOTE
                                   ================================================= */}

                                <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3">

                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                                    <p className="text-xs leading-5 text-slate-500">
                                        CMS access and available features are
                                        controlled by your assigned role and
                                        permissions.
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

Register.layout = {
    title: '',
    description: '',
    fullScreen: true,
};