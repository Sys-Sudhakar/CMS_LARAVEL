import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import CMSLayout from '@/layouts/CMSLayout';

interface Website {
    id: number;
    name: string;
}

interface CreateJobOpeningProps {
    websites: Website[];
}

interface JobOpeningForm {
    website_ids: string[];
    title: string;
    department: string;
    location: string;
    employment_type: string;
    experience: string;
    short_description: string;
    description: string;
    responsibilities: string;
    requirements: string;
    qualifications: string;
    status: string;
    closing_date: string;
}

export default function Create({ websites }: CreateJobOpeningProps) {
    const { data, setData, post, processing, errors } =
        useForm<JobOpeningForm>({
            website_ids: [],
            title: '',
            department: '',
            location: '',
            employment_type: 'Full Time',
            experience: '',
            short_description: '',
            description: '',
            responsibilities: '',
            requirements: '',
            qualifications: '',
            status: 'active',
            closing_date: '',
        });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post('/admin/job-openings');
    };

    return (
        <CMSLayout>
            <Head title="Create Job Opening" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create Job Opening
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Add a new career opportunity.
                        </p>
                    </div>

                    <Link
                        href="/admin/job-openings"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back to Job Openings
                    </Link>
                </div>

                {/* Form */}
                <form
                    onSubmit={submit}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Websites */}
                        <div className="md:col-span-2">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Websites <span className="text-red-500">*</span>
                                    </label>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Select one or more websites where this job opening should be published.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setData(
                                            'website_ids',
                                            data.website_ids.length === websites.length
                                                ? []
                                                : websites.map((website) =>
                                                      String(website.id),
                                                  ),
                                        )
                                    }
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    {data.website_ids.length === websites.length
                                        ? 'Clear All'
                                        : 'Select All Websites'}
                                </button>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                {websites.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {websites.map((website) => {
                                            const websiteId = String(website.id);
                                            const checked =
                                                data.website_ids.includes(
                                                    websiteId,
                                                );

                                            return (
                                                <label
                                                    key={website.id}
                                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-4 py-3 transition ${
                                                        checked
                                                            ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => {
                                                            const next = checked
                                                                ? data.website_ids.filter(
                                                                      (id) =>
                                                                          id !==
                                                                          websiteId,
                                                                  )
                                                                : [
                                                                      ...data.website_ids,
                                                                      websiteId,
                                                                  ];

                                                            setData(
                                                                'website_ids',
                                                                next,
                                                            );
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />

                                                    <span className="text-sm font-medium text-gray-800">
                                                        {website.name}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No websites are available.
                                    </p>
                                )}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs text-gray-500">
                                    Selected:{' '}
                                    <span className="font-semibold text-gray-700">
                                        {data.website_ids.length}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-gray-700">
                                        {websites.length}
                                    </span>{' '}
                                    websites
                                </p>

                                {data.website_ids.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {websites
                                            .filter((website) =>
                                                data.website_ids.includes(
                                                    String(website.id),
                                                ),
                                            )
                                            .map((website) => (
                                                <span
                                                    key={website.id}
                                                    className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                                                >
                                                    {website.name}
                                                </span>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {errors.website_ids && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.website_ids}
                                </p>
                            )}
                        </div>

                        {/* Job Title */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Job Title <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="e.g. Senior Software Engineer"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Department */}
                        <div>
                            <label
                                htmlFor="department"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Department
                            </label>

                            <input
                                id="department"
                                type="text"
                                value={data.department}
                                onChange={(e) =>
                                    setData('department', e.target.value)
                                }
                                placeholder="e.g. Engineering"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.department && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.department}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Location
                            </label>

                            <input
                                id="location"
                                type="text"
                                value={data.location}
                                onChange={(e) =>
                                    setData('location', e.target.value)
                                }
                                placeholder="e.g. Chennai, India"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        {/* Employment Type */}
                        <div>
                            <label
                                htmlFor="employment_type"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Employment Type{' '}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="employment_type"
                                value={data.employment_type}
                                onChange={(e) =>
                                    setData(
                                        'employment_type',
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                                <option value="Temporary">Temporary</option>
                            </select>

                            {errors.employment_type && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.employment_type}
                                </p>
                            )}
                        </div>

                        {/* Experience */}
                        <div>
                            <label
                                htmlFor="experience"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Experience
                            </label>

                            <input
                                id="experience"
                                type="text"
                                value={data.experience}
                                onChange={(e) =>
                                    setData('experience', e.target.value)
                                }
                                placeholder="e.g. 3-5 years"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.experience && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.experience}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Status <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Closing Date */}
                        <div>
                            <label
                                htmlFor="closing_date"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Closing Date
                            </label>

                            <input
                                id="closing_date"
                                type="date"
                                value={data.closing_date}
                                onChange={(e) =>
                                    setData('closing_date', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.closing_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.closing_date}
                                </p>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="short_description"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Short Description
                            </label>

                            <textarea
                                id="short_description"
                                rows={3}
                                value={data.short_description}
                                onChange={(e) =>
                                    setData(
                                        'short_description',
                                        e.target.value,
                                    )
                                }
                                placeholder="Brief summary of the job opportunity..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.short_description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.short_description}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Job Description
                            </label>

                            <textarea
                                id="description"
                                rows={6}
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Provide a detailed description of the role..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Responsibilities */}
                        <div>
                            <label
                                htmlFor="responsibilities"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Responsibilities
                            </label>

                            <textarea
                                id="responsibilities"
                                rows={6}
                                value={data.responsibilities}
                                onChange={(e) =>
                                    setData(
                                        'responsibilities',
                                        e.target.value,
                                    )
                                }
                                placeholder="List the key responsibilities..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.responsibilities && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.responsibilities}
                                </p>
                            )}
                        </div>

                        {/* Requirements */}
                        <div>
                            <label
                                htmlFor="requirements"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Requirements
                            </label>

                            <textarea
                                id="requirements"
                                rows={6}
                                value={data.requirements}
                                onChange={(e) =>
                                    setData('requirements', e.target.value)
                                }
                                placeholder="List the required skills and experience..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.requirements && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.requirements}
                                </p>
                            )}
                        </div>

                        {/* Qualifications */}
                        <div className="md:col-span-2">
                            <label
                                htmlFor="qualifications"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Qualifications
                            </label>

                            <textarea
                                id="qualifications"
                                rows={5}
                                value={data.qualifications}
                                onChange={(e) =>
                                    setData(
                                        'qualifications',
                                        e.target.value,
                                    )
                                }
                                placeholder="List the educational and professional qualifications..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            {errors.qualifications && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.qualifications}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
                        <Link
                            href="/admin/job-openings"
                            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? 'Creating...'
                                : 'Create Job Opening'}
                        </button>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}