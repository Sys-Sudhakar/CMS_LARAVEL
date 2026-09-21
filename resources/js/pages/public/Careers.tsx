import { Head, Link } from '@inertiajs/react';
import PublicWebsiteLayout from '@/layouts/PublicWebsiteLayout';

interface CurrentWebsite {
    id: number;
    name: string;
    slug: string;
    url: string;
}

interface Job {
    id: number;
    title: string;
    slug: string;
    department?: string | null;
    location?: string | null;
    employment_type?: string | null;
    experience?: string | null;
    short_description?: string | null;
    description?: string | null;
    closing_date?: string | null;
    status?: string | null;
}

interface CareersUi {
    page_title: string;
    eyebrow: string;
    heading: string;
    intro: string;
    no_openings: string;
    no_openings_description: string;
    open: string;
    experience: string;
    closing_date: string;
    view_details: string;
}

interface CareersProps {
    jobs: Job[];
    ui: CareersUi;
    currentLanguage?: string;
    currentWebsite?: CurrentWebsite | null;
}

function formatDate(value?: string | null): string {
    if (!value) {
        return '';
    }

    /*
     * Laravel may return either:
     * 2026-09-24
     * or
     * 2026-09-24T00:00:00.000000Z
     */
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        const dateOnly = value.split('T')[0];
        const fallback = new Date(`${dateOnly}T00:00:00`);

        if (Number.isNaN(fallback.getTime())) {
            return dateOnly;
        }

        return new Intl.DateTimeFormat('en', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(fallback);
    }

    return new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsedDate);
}

function getDescription(job: Job): string {
    const value =
        job.short_description?.trim() ||
        job.description?.trim() ||
        '';

    if (value.length <= 220) {
        return value;
    }

    return `${value.slice(0, 217).trim()}...`;
}

export default function Careers({
    jobs = [],
    ui,
}: CareersProps) {
    return (
        <PublicWebsiteLayout>
            <Head title={ui?.page_title ?? 'Careers'} />

            <main className="min-h-screen bg-white">

                <div className="mx-auto max-w-[1040px] px-5 py-14 sm:px-6 md:py-18 lg:px-8">

                    {/* =====================================================
                        PAGE INTRO
                    ===================================================== */}

                    <div className="mx-auto max-w-3xl text-center">

                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0B67A3]">
                            {ui?.eyebrow ?? 'Career Opportunities'}
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-[#0B2239] sm:text-4xl md:text-[42px]">
                            {ui?.heading ?? 'Current Openings'}
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 md:text-base">
                            {ui?.intro ??
                                'Browse our available career opportunities and find the position that matches your skills, experience and career goals.'}
                        </p>

                        <div className="mx-auto mt-6 h-px w-16 bg-slate-200" />

                    </div>


                    {/* =====================================================
                        OPENING COUNT
                    ===================================================== */}

                    <div className="mx-auto mt-10 flex max-w-[760px] items-center justify-between">

                        <p className="text-sm font-semibold text-[#0B2239]">
                            Available Opportunities
                        </p>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {jobs.length}{' '}
                            {jobs.length === 1 ? 'Opening' : 'Openings'}
                        </span>

                    </div>


                    {/* =====================================================
                        JOB LIST
                    ===================================================== */}

                    <div className="mx-auto mt-5 max-w-[760px]">

                        {jobs.length > 0 ? (

                            <div className="space-y-4">

                                {jobs.map((job) => {
                                    const description =
                                        getDescription(job);

                                    return (
                                        <article
                                            key={job.id}
                                            className="
                                                group
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-5
                                                shadow-[0_2px_10px_rgba(15,23,42,0.04)]
                                                transition-all
                                                duration-200
                                                hover:border-slate-300
                                                hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]
                                                md:p-6
                                            "
                                        >

                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                            {ui?.open ?? 'Open'}
                                                        </span>

                                                        {job.department && (
                                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                                                {job.department}
                                                            </span>
                                                        )}

                                                        {job.employment_type && (
                                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                                                                {job.employment_type}
                                                            </span>
                                                        )}

                                                    </div>


                                                    <h2 className="mt-3 text-xl font-bold tracking-[-0.01em] text-[#0B2239] transition-colors group-hover:text-[#0B67A3]">
                                                        {job.title}
                                                    </h2>


                                                    {(job.location || job.experience) && (
                                                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">

                                                            {job.location && (
                                                                <span className="inline-flex items-center gap-1.5">
                                                                    <span aria-hidden="true">📍</span>
                                                                    {job.location}
                                                                </span>
                                                            )}

                                                            {job.experience && (
                                                                <span className="inline-flex items-center gap-1.5">
                                                                    <span aria-hidden="true">💼</span>
                                                                    {ui?.experience ?? 'Experience'}:{' '}
                                                                    <span className="font-medium text-slate-700">
                                                                        {job.experience}
                                                                    </span>
                                                                </span>
                                                            )}

                                                        </div>
                                                    )}


                                                    {description && (
                                                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                                            {description}
                                                        </p>
                                                    )}


                                                    {job.closing_date && (
                                                        <p className="mt-4 text-xs text-slate-500">
                                                            <span className="font-medium text-slate-600">
                                                                {ui?.closing_date ?? 'Application Closing Date'}:
                                                            </span>{' '}
                                                            <span className="font-semibold text-[#0B2239]">
                                                                {formatDate(job.closing_date)}
                                                            </span>
                                                        </p>
                                                    )}

                                                </div>


                                                <div className="shrink-0">

                                                    <Link
                                                        href={`/careers/${job.slug}`}
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-lg
                                                            bg-[#0B67A3]
                                                            px-5
                                                            py-2.5
                                                            text-sm
                                                            font-semibold
                                                            text-white
                                                            transition
                                                            hover:bg-[#084F7D]
                                                        "
                                                    >
                                                        {ui?.view_details ?? 'View Job Details'}
                                                        <span aria-hidden="true">→</span>
                                                    </Link>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                })}

                            </div>

                        ) : (

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                                    💼
                                </div>

                                <h2 className="mt-4 text-xl font-bold text-[#0B2239]">
                                    {ui?.no_openings ?? 'No Current Openings'}
                                </h2>

                                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
                                    {ui?.no_openings_description ??
                                        'There are currently no available job openings. Please check again later for new opportunities.'}
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </main>
        </PublicWebsiteLayout>
    );
}
