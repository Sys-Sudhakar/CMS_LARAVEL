import { Head, Link, router } from '@inertiajs/react';
import CMSLayout from '@/layouts/CMSLayout';

interface Contact {
    id: number;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    service_category: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    contact: Contact;
}

export default function Show({ contact }: Props) {

    const updateStatus = (status: string) => {
        router.patch(
            `/admin/contacts/${contact.id}/status`,
            {
                status,
            },
            {
                preserveScroll: true,
            }
        );
    };

    return (
        <CMSLayout>
            <Head title={`Contact - ${contact.name}`} />

            <div className="p-6">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Contact Submission
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            View and manage this enquiry.
                        </p>
                    </div>

                    <Link
                        href="/admin/contacts"
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back to Contacts
                    </Link>

                </div>

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Contact Details */}
                    <div className="lg:col-span-2">

                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">

                            <div className="border-b border-gray-200 px-6 py-4">
                                <h2 className="text-base font-semibold text-gray-900">
                                    Contact Details
                                </h2>
                            </div>

                            <div className="grid gap-6 p-6 md:grid-cols-2">

                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Full Name
                                    </p>

                                    <p className="mt-1 text-sm text-gray-900">
                                        {contact.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Email
                                    </p>

                                    <p className="mt-1 text-sm text-gray-900">
                                        {contact.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Company
                                    </p>

                                    <p className="mt-1 text-sm text-gray-900">
                                        {contact.company || '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm text-gray-900">
                                        {contact.phone || '-'}
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Service Category
                                    </p>

                                    <p className="mt-1 text-sm text-gray-900">
                                        {contact.service_category}
                                    </p>
                                </div>

                                <div className="md:col-span-2">
                                    <p className="text-xs font-semibold uppercase text-gray-500">
                                        Message
                                    </p>

                                    <div className="mt-2 rounded-md bg-gray-50 p-4">
                                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                            {contact.message}
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Status */}
                    <div>

                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">

                            <div className="border-b border-gray-200 px-6 py-4">
                                <h2 className="text-base font-semibold text-gray-900">
                                    Submission Status
                                </h2>
                            </div>

                            <div className="space-y-3 p-6">

                                {[
                                    ['new', 'New'],
                                    ['read', 'Read'],
                                    ['in_progress', 'In Progress'],
                                    ['resolved', 'Resolved'],
                                ].map(([value, label]) => (

                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() =>
                                            updateStatus(value)
                                        }
                                        className={`w-full rounded-md border px-4 py-2.5 text-left text-sm font-medium transition ${
                                            contact.status === value
                                                ? 'border-gray-900 bg-gray-900 text-white'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {label}
                                    </button>

                                ))}

                            </div>

                        </div>

                        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

                            <p className="text-xs font-semibold uppercase text-gray-500">
                                Submitted
                            </p>

                            <p className="mt-1 text-sm text-gray-700">
                                {new Date(
                                    contact.created_at
                                ).toLocaleString()}
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </CMSLayout>
    );
}