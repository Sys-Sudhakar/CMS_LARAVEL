import { Head, Link, router } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useState } from 'react';
import CMSLayout from '@/layouts/CMSLayout';


interface Website {
    id: number;
    name: string;
}


interface JobOpening {
    id: number;
    title: string;
    slug: string;
    department: string | null;
    location: string | null;
    employment_type: string;

    website?: Website | null;
}


interface JobApplication {
    id: number;
    job_opening_id: number;

    name: string;
    email: string;
    phone: string | null;

    work_authorization: string | null;
    work_authorization_other: string | null;

    highest_qualification: string | null;

    current_salary: string | null;
    expected_salary: string | null;
    notice_period: string | null;

    preferred_location: string | null;
    current_location: string | null;

    relocation_willingness: string | null;
    shift_willingness: string | null;

    skills_project: string | null;
    experience_responsibilities: string | null;

    resume: string | null;
    cover_letter: string | null;

    status:
        | 'new'
        | 'reviewing'
        | 'shortlisted'
        | 'rejected'
        | 'hired';

    created_at: string;
    updated_at: string;

    job_opening: JobOpening | null;
}


interface Props {
    application: JobApplication;
}


export default function Show({
    application,
}: Props) {

    const [status, setStatus] =
        useState(application.status);

    const [updating, setUpdating] =
        useState(false);


    /* =========================================================
       FORMAT DATE
       ========================================================= */

    const formatDate = (
        date: string
    ) => {

        return new Date(
            date
        ).toLocaleString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }
        );

    };


    /* =========================================================
       UPDATE STATUS
       ========================================================= */

    const updateStatus = (
        e: FormEvent
    ) => {

        e.preventDefault();

        setUpdating(true);

        router.patch(
            `/admin/job-applications/${application.id}/status`,
            {
                status,
            },
            {
                preserveScroll: true,

                onFinish: () => {
                    setUpdating(false);
                },
            }
        );

    };


    /* =========================================================
       STATUS COLOUR
       ========================================================= */

    const getStatusClass = (
        applicationStatus:
            JobApplication['status']
    ) => {

        switch (
            applicationStatus
        ) {

            case 'new':
                return 'bg-blue-100 text-blue-700';

            case 'reviewing':
                return 'bg-yellow-100 text-yellow-700';

            case 'shortlisted':
                return 'bg-purple-100 text-purple-700';

            case 'rejected':
                return 'bg-red-100 text-red-700';

            case 'hired':
                return 'bg-green-100 text-green-700';

            default:
                return 'bg-gray-100 text-gray-700';

        }

    };


    /* =========================================================
       DISPLAY VALUE
       ========================================================= */

    const displayValue = (
        value: string | null | undefined
    ) => {

        if (
            !value ||
            value.trim() === ''
        ) {
            return 'Not provided';
        }

        return value;

    };


    return (

        <CMSLayout>

            <Head
                title={`Application - ${application.name}`}
            />


            <div className="space-y-6">


                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <h1 className="text-2xl font-bold text-gray-900">
                                Job Application
                            </h1>


                            <span
                                className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    capitalize
                                    ${getStatusClass(
                                        application.status
                                    )}
                                `}
                            >
                                {application.status}
                            </span>

                        </div>


                        <p className="mt-1 text-sm text-gray-500">
                            Review candidate information and application details.
                        </p>

                    </div>


                    <Link
                        href="/admin/job-applications"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-gray-700
                            hover:bg-gray-50
                        "
                    >
                        ← Back to Applications
                    </Link>

                </div>


                {/* =====================================================
                    MAIN LAYOUT
                ====================================================== */}

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">


                    {/* =================================================
                        LEFT SIDE
                    ================================================== */}

                    <div className="space-y-6">


                        {/* =================================================
                            CANDIDATE INFORMATION
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Candidate Information
                            </h2>


                            <p className="mt-1 text-sm text-gray-500">
                                Personal, contact, location, and work authorization details.
                            </p>


                            <div className="mt-6 grid gap-6 sm:grid-cols-2">


                                {/* Full Name */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Full Name
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {application.name}
                                    </p>

                                </div>


                                {/* Email */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Email Address
                                    </p>

                                    <a
                                        href={`mailto:${application.email}`}
                                        className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        {application.email}
                                    </a>

                                </div>


                                {/* Phone */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Phone Number
                                    </p>


                                    {application.phone ? (

                                        <a
                                            href={`tel:${application.phone}`}
                                            className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            {application.phone}
                                        </a>

                                    ) : (

                                        <p className="mt-2 text-sm text-gray-500">
                                            Not provided
                                        </p>

                                    )}

                                </div>


                                {/* Applied On */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Applied On
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {formatDate(
                                            application.created_at
                                        )}
                                    </p>

                                </div>


                                {/* Current Location */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Current Location
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.current_location
                                        )}
                                    </p>

                                </div>


                                {/* Work Authorization */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Work Authorization
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.work_authorization
                                        )}
                                    </p>


                                    {application.work_authorization ===
                                        'Other' &&
                                        application.work_authorization_other && (

                                            <p className="mt-1 text-xs text-gray-500">
                                                {
                                                    application.work_authorization_other
                                                }
                                            </p>

                                        )}

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            PROFESSIONAL INFORMATION
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Professional Information
                            </h2>


                            <p className="mt-1 text-sm text-gray-500">
                                Education, salary, availability, and location preferences.
                            </p>


                            <div className="mt-6 grid gap-6 sm:grid-cols-2">


                                {/* Qualification */}

                                <div className="sm:col-span-2">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Highest Educational Qualification
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.highest_qualification
                                        )}
                                    </p>

                                </div>


                                {/* Current Salary */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Current Salary
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.current_salary
                                        )}
                                    </p>

                                </div>


                                {/* Expected Salary */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Expected Salary
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.expected_salary
                                        )}
                                    </p>

                                </div>


                                {/* Notice Period */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Notice Period
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.notice_period
                                        )}
                                    </p>

                                </div>


                                {/* Preferred Location */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Preferred Location
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.preferred_location
                                        )}
                                    </p>

                                </div>


                                {/* Relocation */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Relocation Willingness
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.relocation_willingness
                                        )}
                                    </p>

                                </div>


                                {/* Shift */}

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Shift Willingness
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                        {displayValue(
                                            application.shift_willingness
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            POSITION APPLIED FOR
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Position Applied For
                            </h2>


                            {application.job_opening ? (

                                <div className="mt-6">

                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {application.job_opening.title}
                                    </h3>


                                    {application.job_opening.website && (

                                        <div className="mt-3">

                                            <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {
                                                    application.job_opening
                                                        .website.name
                                                }
                                            </span>

                                        </div>

                                    )}


                                    <div className="mt-4 flex flex-wrap gap-2">

                                        {application.job_opening.department && (

                                            <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                                                {
                                                    application.job_opening
                                                        .department
                                                }
                                            </span>

                                        )}


                                        {application.job_opening.location && (

                                            <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                                                {
                                                    application.job_opening
                                                        .location
                                                }
                                            </span>

                                        )}


                                        <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                                            {
                                                application.job_opening
                                                    .employment_type
                                            }
                                        </span>

                                    </div>

                                </div>

                            ) : (

                                <p className="mt-4 text-sm text-gray-500">
                                    The job opening associated with this application is no longer available.
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            SKILLS + RECENT PROJECT
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Skills + Recent Project
                            </h2>


                            <p className="mt-1 text-sm text-gray-500">
                                Candidate's relevant skills and recent project experience.
                            </p>


                            {application.skills_project ? (

                                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-700">
                                    {application.skills_project}
                                </div>

                            ) : (

                                <p className="mt-5 text-sm text-gray-500">
                                    Not provided.
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            EXPERIENCE & RESPONSIBILITIES
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Experience & Responsibilities
                            </h2>


                            <p className="mt-1 text-sm text-gray-500">
                                Relevant experience and day-to-day responsibilities.
                            </p>


                            {application.experience_responsibilities ? (

                                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-700">
                                    {
                                        application.experience_responsibilities
                                    }
                                </div>

                            ) : (

                                <p className="mt-5 text-sm text-gray-500">
                                    Not provided.
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            COVER LETTER
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Cover Letter
                            </h2>


                            {application.cover_letter ? (

                                <div className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                                    {application.cover_letter}
                                </div>

                            ) : (

                                <p className="mt-4 text-sm text-gray-500">
                                    No cover letter was provided.
                                </p>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT SIDE
                    ================================================== */}

                    <aside className="space-y-6">


                        {/* =================================================
                            STATUS
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Application Status
                            </h2>


                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Update the current recruitment status for this candidate.
                            </p>


                            <form
                                onSubmit={updateStatus}
                                className="mt-5"
                            >

                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Status
                                </label>


                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(
                                            e.target.value as
                                                JobApplication['status']
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        text-gray-700
                                        focus:border-blue-500
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-blue-500
                                    "
                                >

                                    <option value="new">
                                        New
                                    </option>

                                    <option value="reviewing">
                                        Reviewing
                                    </option>

                                    <option value="shortlisted">
                                        Shortlisted
                                    </option>

                                    <option value="rejected">
                                        Rejected
                                    </option>

                                    <option value="hired">
                                        Hired
                                    </option>

                                </select>


                                <button
                                    type="submit"
                                    disabled={
                                        updating ||
                                        status === application.status
                                    }
                                    className="
                                        mt-4
                                        w-full
                                        rounded-lg
                                        bg-blue-600
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-blue-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {updating
                                        ? 'Updating...'
                                        : 'Update Status'}
                                </button>

                            </form>

                        </div>


                        {/* =================================================
                            RESUME
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Resume / CV
                            </h2>


                            {application.resume ? (

                                <div className="mt-4">

                                    <p className="mb-4 text-sm leading-6 text-gray-500">
                                        Review the resume submitted by this candidate.
                                    </p>


                                    <a
                                        href={`/storage/${application.resume}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-blue-200
                                            bg-blue-50
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-blue-700
                                            hover:bg-blue-100
                                        "
                                    >
                                        View / Download Resume
                                    </a>

                                </div>

                            ) : (

                                <p className="mt-4 text-sm text-gray-500">
                                    No resume is available.
                                </p>

                            )}

                        </div>


                        {/* =================================================
                            QUICK CANDIDATE SUMMARY
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Candidate Summary
                            </h2>


                            <div className="mt-5 space-y-4">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Preferred Location
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {displayValue(
                                            application.preferred_location
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Notice Period
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {displayValue(
                                            application.notice_period
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Expected Salary
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {displayValue(
                                            application.expected_salary
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Work Authorization
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {displayValue(
                                            application.work_authorization
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            APPLICATION ID
                        ================================================== */}

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Application Reference
                            </p>


                            <p className="mt-2 text-sm font-semibold text-gray-700">
                                APP-
                                {String(
                                    application.id
                                ).padStart(
                                    5,
                                    '0'
                                )}
                            </p>

                        </div>

                    </aside>

                </div>

            </div>

        </CMSLayout>

    );
}