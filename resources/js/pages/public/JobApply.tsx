import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import PublicWebsiteLayout from '@/layouts/PublicWebsiteLayout';

interface JobOpening {
    id: number;
    title: string;
    slug: string;
    department: string | null;
    location: string | null;
    employment_type: string;
    experience: string | null;
}

interface Props {
    job: JobOpening;
}

interface ApplicationForm {
    name: string;
    email: string;
    phone: string;
    work_authorization: string;
    work_authorization_other: string;
    highest_qualification: string;
    current_salary: string;
    expected_salary: string;
    notice_period: string;
    current_location: string;
    shift_willingness: string;
    skills_project: string;
    experience_responsibilities: string;
    cover_letter: string;
    resume: File | null;
}

export default function JobApply({ job }: Props) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm<ApplicationForm>({
        name: '',
        email: '',
        phone: '',
        work_authorization: '',
        work_authorization_other: '',
        highest_qualification: '',
        current_salary: '',
        expected_salary: '',
        notice_period: '',
        current_location: '',
        shift_willingness: '',
        skills_project: '',
        experience_responsibilities: '',
        cover_letter: '',
        resume: null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(`/careers/${job.slug}/apply`, {
            forceFormData: true,
        });
    };

    const inputClass =
        'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0B67A3] focus:ring-2 focus:ring-[#0B67A3]/10';

    const labelClass =
        'mb-2 block text-sm font-semibold text-[#0B2239]';

    const errorClass =
        'mt-1.5 text-xs font-medium text-red-600';

    const Required = () => (
        <span className="ml-1 text-red-600">*</span>
    );

    return (
        <PublicWebsiteLayout>
            <Head title={`Apply - ${job.title}`} />

            <main className="min-h-screen bg-white">
                <div className="mx-auto max-w-[980px] px-5 py-12 sm:px-6 md:py-16 lg:px-8">

                    <Link
                        href={`/careers/${job.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B67A3] transition hover:text-[#084F7D]"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Job Details
                    </Link>

                    <div className="mx-auto mt-8 max-w-3xl text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0B67A3]">
                            Job Application
                        </p>

                        <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-[#0B2239] sm:text-4xl">
                            Apply for {job.title}
                        </h1>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                            Complete the application form below. Our recruitment team will review your profile and contact you if your experience matches the role.
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                            {job.department && (
                                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                                    {job.department}
                                </span>
                            )}

                            {job.location && (
                                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                                    {job.location}
                                </span>
                            )}

                            {job.employment_type && (
                                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                                    {job.employment_type}
                                </span>
                            )}
                        </div>
                    </div>

                    <form
                        onSubmit={submit}
                        className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:p-8"
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
                            <div>
                                <h2 className="text-xl font-bold text-[#0B2239]">
                                    Candidate Information
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Please provide accurate and up-to-date information.
                                </p>
                            </div>

                            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
                                <span className="mr-1 text-red-600">*</span>
                                Required
                            </span>
                        </div>

                        {/* Personal Information */}
                        <section className="mt-8">
                            <h3 className="text-base font-bold text-[#0B2239]">
                                Personal Information
                            </h3>

                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className={labelClass}>
                                        Full Name <Required />
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter your full name"
                                        className={inputClass}
                                    />
                                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelClass}>
                                        Email Address <Required />
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="name@example.com"
                                        className={inputClass}
                                    />
                                    {errors.email && <p className={errorClass}>{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className={labelClass}>
                                        Phone Number <Required />
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="Enter phone number"
                                        className={inputClass}
                                    />
                                    {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="current_location" className={labelClass}>
                                        Current Location <Required />
                                    </label>
                                    <input
                                        id="current_location"
                                        type="text"
                                        value={data.current_location}
                                        onChange={(e) => setData('current_location', e.target.value)}
                                        placeholder="City, state and country"
                                        className={inputClass}
                                    />
                                    {errors.current_location && (
                                        <p className={errorClass}>{errors.current_location}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="work_authorization" className={labelClass}>
                                        Work Authorization <Required />
                                    </label>
                                    <select
                                        id="work_authorization"
                                        value={data.work_authorization}
                                        onChange={(e) => {
                                            setData('work_authorization', e.target.value);

                                            if (e.target.value !== 'Other') {
                                                setData('work_authorization_other', '');
                                            }
                                        }}
                                        className={inputClass}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="Singapore Citizen">Singapore Citizen</option>
                                        <option value="Singapore PR">Singapore PR</option>
                                        <option value="EP Holder">EP Holder</option>
                                        <option value="S Pass Holder">S Pass Holder</option>
                                        <option value="Dependant Pass (DP) with Work Eligibility">
                                            Dependant Pass (DP) with Work Eligibility
                                        </option>
                                        <option value="Indian Citizen working in India">
                                            Indian Citizen working in India
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.work_authorization && (
                                        <p className={errorClass}>{errors.work_authorization}</p>
                                    )}
                                </div>

                                {data.work_authorization === 'Other' && (
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="work_authorization_other"
                                            className={labelClass}
                                        >
                                            Please Specify <Required />
                                        </label>
                                        <input
                                            id="work_authorization_other"
                                            type="text"
                                            value={data.work_authorization_other}
                                            onChange={(e) =>
                                                setData(
                                                    'work_authorization_other',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Specify your work authorization"
                                            className={inputClass}
                                        />
                                        {errors.work_authorization_other && (
                                            <p className={errorClass}>
                                                {errors.work_authorization_other}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="my-8 border-t border-slate-200" />

                        {/* Professional Information */}
                        <section>
                            <h3 className="text-base font-bold text-[#0B2239]">
                                Professional Information
                            </h3>

                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label htmlFor="highest_qualification" className={labelClass}>
                                        Highest Educational Qualification <Required />
                                    </label>
                                    <input
                                        id="highest_qualification"
                                        type="text"
                                        value={data.highest_qualification}
                                        onChange={(e) =>
                                            setData('highest_qualification', e.target.value)
                                        }
                                        placeholder="Example: BE in Computer Engineering"
                                        className={inputClass}
                                    />
                                    {errors.highest_qualification && (
                                        <p className={errorClass}>
                                            {errors.highest_qualification}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="current_salary" className={labelClass}>
                                        Current Salary
                                    </label>
                                    <input
                                        id="current_salary"
                                        type="text"
                                        value={data.current_salary}
                                        onChange={(e) => setData('current_salary', e.target.value)}
                                        placeholder="Enter current salary"
                                        className={inputClass}
                                    />
                                    {errors.current_salary && (
                                        <p className={errorClass}>{errors.current_salary}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="expected_salary" className={labelClass}>
                                        Expected Salary
                                    </label>
                                    <input
                                        id="expected_salary"
                                        type="text"
                                        value={data.expected_salary}
                                        onChange={(e) => setData('expected_salary', e.target.value)}
                                        placeholder="Enter expected salary"
                                        className={inputClass}
                                    />
                                    {errors.expected_salary && (
                                        <p className={errorClass}>{errors.expected_salary}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="notice_period" className={labelClass}>
                                        Notice Period <Required />
                                    </label>
                                    <input
                                        id="notice_period"
                                        type="text"
                                        value={data.notice_period}
                                        onChange={(e) => setData('notice_period', e.target.value)}
                                        placeholder="Immediate / 30 days / 60 days"
                                        className={inputClass}
                                    />
                                    {errors.notice_period && (
                                        <p className={errorClass}>{errors.notice_period}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="shift_willingness" className={labelClass}>
                                        Shift Willingness <Required />
                                    </label>
                                    <select
                                        id="shift_willingness"
                                        value={data.shift_willingness}
                                        onChange={(e) =>
                                            setData('shift_willingness', e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="Day shift">Day shift</option>
                                        <option value="Night shift">Night shift</option>
                                        <option value="Rotational shift">Rotational shift</option>

                                    </select>
                                    {errors.shift_willingness && (
                                        <p className={errorClass}>{errors.shift_willingness}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="my-8 border-t border-slate-200" />

                        {/* Skills */}
                        <section>
                            <h3 className="text-base font-bold text-[#0B2239]">
                                Skills & Experience
                            </h3>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <label htmlFor="skills_project" className={labelClass}>
                                        Skills + Recent Project <Required />
                                    </label>
                                    <textarea
                                        id="skills_project"
                                        rows={5}
                                        value={data.skills_project}
                                        onChange={(e) => setData('skills_project', e.target.value)}
                                        placeholder="List your top relevant skills and briefly describe one recent project."
                                        className={`${inputClass} resize-y leading-7`}
                                    />
                                    {errors.skills_project && (
                                        <p className={errorClass}>{errors.skills_project}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="experience_responsibilities"
                                        className={labelClass}
                                    >
                                        Experience & Responsibilities <Required />
                                    </label>
                                    <textarea
                                        id="experience_responsibilities"
                                        rows={5}
                                        value={data.experience_responsibilities}
                                        onChange={(e) =>
                                            setData(
                                                'experience_responsibilities',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Describe your relevant experience and responsibilities."
                                        className={`${inputClass} resize-y leading-7`}
                                    />
                                    {errors.experience_responsibilities && (
                                        <p className={errorClass}>
                                            {errors.experience_responsibilities}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="my-8 border-t border-slate-200" />

                        {/* Documents */}
                        <section>
                            <h3 className="text-base font-bold text-[#0B2239]">
                                Resume & Cover Letter
                            </h3>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <label htmlFor="resume" className={labelClass}>
                                        Resume / CV <Required />
                                    </label>

                                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                                        <input
                                            id="resume"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) =>
                                                setData(
                                                    'resume',
                                                    e.target.files?.[0] ?? null
                                                )
                                            }
                                            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-[#0B67A3] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[#084F7D]"
                                        />

                                        <p className="mt-2 text-xs text-slate-500">
                                            PDF, DOC or DOCX. Maximum size: 5MB.
                                        </p>
                                    </div>

                                    {errors.resume && (
                                        <p className={errorClass}>{errors.resume}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="cover_letter" className={labelClass}>
                                        Cover Letter
                                    </label>
                                    <textarea
                                        id="cover_letter"
                                        rows={6}
                                        value={data.cover_letter}
                                        onChange={(e) => setData('cover_letter', e.target.value)}
                                        placeholder="Tell us why you are interested in this position."
                                        className={`${inputClass} resize-y leading-7`}
                                    />
                                    {errors.cover_letter && (
                                        <p className={errorClass}>{errors.cover_letter}</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={`/careers/${job.slug}`}
                                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-lg bg-[#0B67A3] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#084F7D] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </PublicWebsiteLayout>
    );
}
