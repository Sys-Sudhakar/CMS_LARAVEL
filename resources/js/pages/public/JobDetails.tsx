import { Head, Link } from '@inertiajs/react';
import PublicWebsiteLayout from '@/layouts/PublicWebsiteLayout';

interface JobOpening {
    id: number;
    title: string;
    slug: string;
    department: string | null;
    location: string | null;
    employment_type: string;
    experience: string | null;
    short_description: string | null;
    description: string | null;
    responsibilities: string | null;
    requirements: string | null;
    qualifications: string | null;
    status: string;
    closing_date: string | null;
}

interface JobDetailsUi {
    back_to_careers: string;
    career_opportunity: string;
    department: string;
    location: string;
    experience: string;
    job_description: string;
    responsibilities: string;
    requirements: string;
    qualifications: string;
    apply_now: string;
    interested: string;
    apply_description: string;
    closing_date: string;
}

interface Props {
    job: JobOpening;
    ui: JobDetailsUi;
    currentLanguage?: string;
}

export default function JobDetails({
    job,
    ui,
    currentLanguage = 'en',
}: Props) {
    const locale =
        currentLanguage === 'zh'
            ? 'zh-CN'
            : currentLanguage === 'ta'
              ? 'ta-IN'
              : currentLanguage === 'ms'
                ? 'ms-MY'
                : 'en-IN';

    const formatDate = (date: string | null) => {
        if (!date) return null;

        return new Date(date).toLocaleDateString(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const detailSections = [
        { title: ui.job_description, content: job.description },
        { title: ui.responsibilities, content: job.responsibilities },
        { title: ui.requirements, content: job.requirements },
        { title: ui.qualifications, content: job.qualifications },
    ].filter((section) => Boolean(section.content));

    return (
        <PublicWebsiteLayout>
            <Head title={job.title} />

            <main className="min-h-screen bg-white">
                <div className="mx-auto max-w-[1080px] px-5 py-12 sm:px-6 md:py-16 lg:px-8">

                    <Link
                        href="/careers"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B67A3] transition hover:text-[#084F7D]"
                    >
                        <span aria-hidden="true">←</span>
                        {ui.back_to_careers}
                    </Link>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 md:px-8 md:py-10">

                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B67A3]">
                            {ui.career_opportunity}
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-[#0B2239] sm:text-4xl md:text-[42px]">
                            {job.title}
                        </h1>

                        {job.short_description && (
                            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 md:text-base">
                                {job.short_description}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-2">
                            {job.department && (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                                    {ui.department}: {job.department}
                                </span>
                            )}

                            {job.location && (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                                    {ui.location}: {job.location}
                                </span>
                            )}

                            {job.employment_type && (
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                                    {job.employment_type}
                                </span>
                            )}

                            {job.experience && (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                                    {ui.experience}: {job.experience}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">

                        <div className="space-y-8">
                            {detailSections.map((section) => (
                                <section
                                    key={section.title}
                                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_3px_14px_rgba(15,23,42,0.04)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="h-5 w-1 rounded-full bg-[#0B67A3]" />
                                        <h2 className="text-lg font-bold text-[#0B2239] md:text-xl">
                                            {section.title}
                                        </h2>
                                    </div>

                                    <div className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                                        {section.content}
                                    </div>
                                </section>
                            ))}
                        </div>

                        <aside className="lg:sticky lg:top-24">
                            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-[0_4px_16px_rgba(15,23,42,0.05)]">

                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0B67A3]">
                                    {ui.apply_now}
                                </p>

                                <h3 className="mt-2 text-xl font-bold text-[#0B2239]">
                                    {ui.interested}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {ui.apply_description}
                                </p>

                                <Link
                                    href={`/careers/${job.slug}/apply`}
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[#0B67A3] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084F7D]"
                                >
                                    {ui.apply_now}
                                </Link>

                                {job.closing_date && (
                                    <div className="mt-5 border-t border-slate-200 pt-4">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                            {ui.closing_date}
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#0B2239]">
                                            {formatDate(job.closing_date)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </aside>

                    </div>
                </div>
            </main>
        </PublicWebsiteLayout>
    );
}
