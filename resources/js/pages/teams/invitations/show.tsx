import { Head, router } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    Mail,
    ShieldCheck,
    UserRound,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Invitation {
    code: string;
    email: string;
    role: string;
    expiresAt: string | null;

    team: {
        name: string;
        slug: string;
    };

    inviter: {
        name: string;
        email: string;
    };
}

interface Props {
    invitation: Invitation;
}

export default function Show({
    invitation,
}: Props) {
    const [accepting, setAccepting] =
        useState(false);

    const [declining, setDeclining] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Accept Invitation
    |--------------------------------------------------------------------------
    */

    const acceptInvitation = () => {
        setAccepting(true);

        router.post(
            `/invitations/${invitation.code}/accept`,
            {},
            {
                preserveScroll: true,

                onFinish: () => {
                    setAccepting(false);
                },
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Decline Invitation
    |--------------------------------------------------------------------------
    */

    const declineInvitation = () => {
        if (
            ! window.confirm(
                'Are you sure you want to decline this invitation?'
            )
        ) {
            return;
        }

        setDeclining(true);

        router.delete(
            `/invitations/${invitation.code}`,
            {
                preserveScroll: true,

                onFinish: () => {
                    setDeclining(false);
                },
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Expiry
    |--------------------------------------------------------------------------
    */

    const expiry =
        invitation.expiresAt
            ? new Date(
                  invitation.expiresAt
              ).toLocaleString(
                  'en-IN',
                  {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                  }
              )
            : null;


    return (
        <>
            <Head title="Team Invitation | Sysnet CMS" />

            <div className="relative min-h-screen overflow-hidden bg-slate-950">

                {/* Background */}

                <div className="absolute inset-0 bg-gradient-to-br from-[#07142f] via-[#11245b] to-[#07354a]" />

                <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[120px]" />

                <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[120px]" />


                {/* Content */}

                <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">

                    <div className="w-full max-w-xl">

                        {/* Logo */}

                        <div className="mb-8 flex justify-center">

                            <img
                                src="/images/Sys.png"
                                alt="Sysnet System and Solutions"
                                className="h-20 w-auto object-contain"
                            />

                        </div>


                        {/* Card */}

                        <div className="rounded-[28px] border border-white/10 bg-white p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-10">

                            {/* Icon */}

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

                                <ShieldCheck className="h-7 w-7 text-blue-600" />

                            </div>


                            {/* Header */}

                            <div className="mt-6 text-center">

                                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                                    Team Invitation
                                </p>

                                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                                    You've been invited to join
                                </h1>

                                <p className="mt-2 text-xl font-semibold text-blue-600">
                                    {invitation.team.name}
                                </p>

                            </div>


                            {/* Details */}

                            <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                                {/* Team */}

                                <div className="flex items-start gap-3">

                                    <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Team
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {invitation.team.name}
                                        </p>
                                    </div>

                                </div>


                                {/* Inviter */}

                                <div className="flex items-start gap-3">

                                    <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Invited By
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {invitation.inviter.name}
                                        </p>
                                    </div>

                                </div>


                                {/* Email */}

                                <div className="flex items-start gap-3">

                                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Your Account
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {invitation.email}
                                        </p>
                                    </div>

                                </div>

                            </div>


                            {/* Description */}

                            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4">

                                <p className="text-sm leading-6 text-blue-800">
                                    Accepting this invitation will add your account
                                    to the <strong>{invitation.team.name}</strong> team.
                                    CMS roles and permissions can be assigned by the
                                    team administrator after you join.
                                </p>

                                {expiry && (
                                    <p className="mt-2 text-xs font-medium text-blue-600">
                                        Invitation expires: {expiry}
                                    </p>
                                )}

                            </div>


                            {/* Actions */}

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">

                                <button
                                    type="button"
                                    onClick={acceptInvitation}
                                    disabled={
                                        accepting ||
                                        declining
                                    }
                                    className="
                                        inline-flex
                                        h-12
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-blue-600
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-blue-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    <CheckCircle2 className="h-4 w-4" />

                                    {accepting
                                        ? 'Joining Team...'
                                        : 'Accept Invitation'}
                                </button>


                                <button
                                    type="button"
                                    onClick={declineInvitation}
                                    disabled={
                                        accepting ||
                                        declining
                                    }
                                    className="
                                        inline-flex
                                        h-12
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-white
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    <XCircle className="h-4 w-4" />

                                    {declining
                                        ? 'Declining...'
                                        : 'Decline'}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}