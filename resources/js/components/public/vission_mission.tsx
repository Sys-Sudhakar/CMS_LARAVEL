interface VisionMissionContent {
    variant?:
        | 'cards'
        | 'values'
        | 'principles'
        | string;

    heading?: string;
    description?: string;

    mission_title?: string;
    mission?: string;

    vision_title?: string;
    vision?: string;

    values?: string[];
}

interface VisionMissionSectionProps {
    title?: string | null;
    content?: VisionMissionContent;
}

/* =========================================================
   COMMON HEADER
   ========================================================= */

function SectionHeader({
    title,
    heading,
    description,
    dark = false,
}: {
    title?: string | null;
    heading: string;
    description?: string;
    dark?: boolean;
}) {
    return (
        <div className="mx-auto mb-10 max-w-3xl text-center">
            <p
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                    dark
                        ? 'text-red-400'
                        : 'text-red-600'
                }`}
            >
                {title || 'Our Vision & Mission'}
            </p>

            <h2
                className={`mt-2 text-3xl font-bold tracking-tight sm:text-4xl ${
                    dark
                        ? 'text-white'
                        : 'text-slate-900'
                }`}
            >
                {heading}
            </h2>

            <div
                className={`mx-auto mt-4 h-1 w-12 rounded-full ${
                    dark
                        ? 'bg-red-500'
                        : 'bg-red-600'
                }`}
            />

            {description && (
                <p
                    className={`mt-5 text-sm leading-7 sm:text-base ${
                        dark
                            ? 'text-slate-300'
                            : 'text-slate-600'
                    }`}
                >
                    {description}
                </p>
            )}
        </div>
    );
}

/* =========================================================
   VISION & MISSION SECTION
   ========================================================= */

export default function VisionMissionSection({
    title,
    content = {},
}: VisionMissionSectionProps) {
    const variant =
        content.variant ?? 'cards';

    const values = Array.isArray(
        content.values,
    )
        ? content.values.filter(
              (item) =>
                  typeof item === 'string' &&
                  item.trim() !== '',
          )
        : [];

    const heading =
        content.heading ||
        'Our Vision & Mission';

    const missionTitle =
        content.mission_title ||
        'Driving Business Success';

    const visionTitle =
        content.vision_title ||
        'Building a Digital Future';

    /* =====================================================
       CARDS VARIANT
       ===================================================== */

    if (variant === 'cards') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* MISSION */}

                        <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-8">
                            <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="8"
                                        />
                                        <path
                                            d="M12 8v4l3 2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">
                                        Mission
                                    </p>

                                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                        {missionTitle}
                                    </h3>
                                </div>
                            </div>

                            {content.mission && (
                                <p className="mt-6 text-base leading-8 text-slate-600">
                                    {
                                        content.mission
                                    }
                                </p>
                            )}

                            <div className="mt-7 h-px w-full bg-slate-100" />

                            <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                Purpose & Direction
                            </div>
                        </article>

                        {/* VISION */}

                        <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-7 text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-8">
                            <div className="absolute inset-x-0 top-0 h-1 bg-[#0A5F9E]" />

                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    >
                                        <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="2.5"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-300">
                                        Vision
                                    </p>

                                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">
                                        {visionTitle}
                                    </h3>
                                </div>
                            </div>

                            {content.vision && (
                                <p className="mt-6 text-base leading-8 text-slate-300">
                                    {
                                        content.vision
                                    }
                                </p>
                            )}

                            <div className="mt-7 h-px w-full bg-white/10" />

                            <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                                Future & Growth
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       VALUES VARIANT
       ===================================================== */

    if (variant === 'values') {
        return (
            <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />

                    <div className="grid gap-6 lg:grid-cols-2">
                        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">
                                Mission
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                {missionTitle}
                            </h3>

                            {content.mission && (
                                <p className="mt-4 text-base leading-8 text-slate-600">
                                    {
                                        content.mission
                                    }
                                </p>
                            )}
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0A5F9E]">
                                Vision
                            </p>

                            <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                {visionTitle}
                            </h3>

                            {content.vision && (
                                <p className="mt-4 text-base leading-8 text-slate-600">
                                    {
                                        content.vision
                                    }
                                </p>
                            )}
                        </article>
                    </div>

                    {values.length > 0 ? (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {values.map(
                                (
                                    value,
                                    index,
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-md"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-[#0A5F9E]">
                                                {String(
                                                    index +
                                                        1,
                                                ).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>

                                            <p className="pt-1 text-sm font-semibold leading-6 text-slate-700">
                                                {
                                                    value
                                                }
                                            </p>
                                        </div>

                                        <div className="mt-5 h-0.5 w-8 rounded-full bg-red-600 transition-all duration-200 group-hover:w-14" />
                                    </div>
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                Add values from the CMS.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    /* =====================================================
       PRINCIPLES VARIANT
       Reuses values[] so no additional backend fields are
       required. Useful for core principles / company values.
       ===================================================== */

    if (variant === 'principles') {
        return (
            <section className="bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                        dark
                    />

                    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-5">
                            <article className="rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm sm:p-8">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-400">
                                    Mission
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-white">
                                    {missionTitle}
                                </h3>

                                {content.mission && (
                                    <p className="mt-4 text-base leading-8 text-slate-300">
                                        {
                                            content.mission
                                        }
                                    </p>
                                )}
                            </article>

                            <article className="rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm sm:p-8">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-300">
                                    Vision
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-white">
                                    {visionTitle}
                                </h3>

                                {content.vision && (
                                    <p className="mt-4 text-base leading-8 text-slate-300">
                                        {
                                            content.vision
                                        }
                                    </p>
                                )}
                            </article>
                        </div>

                        {values.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {values.map(
                                    (
                                        value,
                                        index,
                                    ) => (
                                        <article
                                            key={
                                                index
                                            }
                                            className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-sky-400/30 hover:bg-white/[0.08]"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A5F9E] text-sm font-bold text-white">
                                                {String(
                                                    index +
                                                        1,
                                                ).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>

                                            <p className="mt-5 text-sm font-semibold leading-7 text-slate-100">
                                                {
                                                    value
                                                }
                                            </p>

                                            <div className="mt-5 h-0.5 w-8 rounded-full bg-red-500 transition-all duration-200 group-hover:w-14" />
                                        </article>
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.04] px-6 py-10 text-center">
                                <p className="text-sm font-semibold text-slate-300">
                                    Add principles from the CMS.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    /* =====================================================
       FALLBACK
       ===================================================== */

    return (
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <SectionHeader
                    title={title}
                    heading={heading}
                    description={
                        content.description
                    }
                />
            </div>
        </section>
    );
}
