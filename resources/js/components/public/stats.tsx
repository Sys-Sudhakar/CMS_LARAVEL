interface StatItem {
    value?: string;
    label?: string;
    suffix?: string;
    icon?: string;

    description?: string;
    trend?: string;
}


interface StatsContent {
    variant?:
        | 'cards'
        | 'counter'
        | 'highlight'
        | 'benefits'
        | 'kpi'
        | string;

    heading?: string;
    description?: string;
    items?: StatItem[];
}


interface StatsSectionProps {
    title?: string | null;
    content?: StatsContent;
}


/* =========================================================
   COMMON SECTION HEADER
   ========================================================= */

function StatsHeader({
    title,
    heading,
    description,
}: {
    title?: string | null;
    heading: string;
    description?: string;
}) {
    return (
        <div
            className="
                mx-auto
                mb-12
                max-w-3xl
                text-center
            "
        >
            {title && (
                <div
                    className="
                        inline-flex
                        items-center
                        gap-3
                    "
                >
                    <span
                        className="
                            h-[2px]
                            w-7
                            bg-[#D71920]
                        "
                    />

                    <span
                        className="
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-[0.17em]
                            text-[#0A5F9E]

                            sm:text-xs
                        "
                    >
                        {title}
                    </span>
                </div>
            )}


            <h2
                className="
                    mt-4
                    text-3xl
                    font-extrabold
                    tracking-[-0.04em]
                    text-[#0B2D4D]

                    sm:text-4xl
                    lg:text-[48px]
                "
            >
                {heading}
            </h2>


            <div
                className="
                    mx-auto
                    mt-5
                    flex
                    items-center
                    justify-center
                    gap-2
                "
            >
                <div
                    className="
                        h-[3px]
                        w-12
                        rounded-full
                        bg-[#D71920]
                    "
                />

                <div
                    className="
                        h-[3px]
                        w-5
                        rounded-full
                        bg-[#0A5F9E]
                    "
                />
            </div>


            {description && (
                <p
                    className="
                        mx-auto
                        mt-7
                        max-w-2xl
                        text-base
                        leading-8
                        text-[#5C6F82]

                        sm:text-[17px]
                    "
                >
                    {description}
                </p>
            )}
        </div>
    );
}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function StatsEmptyState() {
    return (
        <div
            className="
                rounded-[28px]
                border
                border-dashed
                border-[#BCD0DF]
                bg-white
                px-6
                py-14
                shadow-[0_12px_40px_rgba(11,45,77,0.05)]
                text-center
            "
        >
            <p
                className="
                    text-sm
                    font-semibold
                    text-slate-600
                "
            >
                No statistics have been added yet.
            </p>
        </div>
    );
}


/* =========================================================
   STAT ICON
   ========================================================= */

function StatIcon({
    icon,
}: {
    icon?: string;
}) {
    return (
        <div
            className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/10
                text-xl
                text-white
                backdrop-blur-md
            "
        >
            {icon || '•'}
        </div>
    );
}


/* =========================================================
   STATS SECTION
   ========================================================= */

export default function StatsSection({
    title,
    content = {},
}: StatsSectionProps) {
    const variant =
        content.variant ?? 'counter';


    const items =
        Array.isArray(
            content.items,
        )
            ? content.items
            : [];


    const sectionHeading =
        content.heading ||
        title ||
        'Our Numbers';


    /* =====================================================
       COUNTER
       ===================================================== */

    if (
        variant === 'counter'
    ) {
        return (
            <section
                className="
                    relative
                    overflow-hidden
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6
                    lg:px-8
                    lg:py-28
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                    "
                >
                    <div
                        className="
                            absolute
                            -left-32
                            top-10
                            h-[320px]
                            w-[320px]
                            rounded-full
                            bg-[#0A5F9E]/5
                            blur-[115px]
                        "
                    />

                    <div
                        className="
                            absolute
                            -right-28
                            bottom-0
                            h-[300px]
                            w-[300px]
                            rounded-full
                            bg-[#D71920]/4
                            blur-[115px]
                        "
                    />
                </div>

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >

                    <StatsHeader
                        title={title}
                        heading={
                            sectionHeading
                        }
                        description={
                            content.description
                        }
                    />


                    {items.length > 0 ? (
                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[34px]
                                border
                                border-[#174E77]
                                bg-[linear-gradient(135deg,#071D31_0%,#0A355A_46%,#0A5F9E_100%)]
                                px-6
                                py-10
                                shadow-[0_28px_85px_rgba(11,45,77,0.22)]

                                sm:px-8
                                lg:px-10
                                lg:py-12
                            "
                        >

                            {/* Decorative glow */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-20
                                    -top-28
                                    h-[300px]
                                    w-[300px]
                                    rounded-full
                                    bg-[#52A8DF]/24
                                    blur-[95px]
                                "
                            />


                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -bottom-24
                                    left-[20%]
                                    h-[260px]
                                    w-[260px]
                                    rounded-full
                                    bg-[#D71920]/12
                                    blur-[100px]
                                "
                            />


                            <div
                                className="
                                    relative
                                    z-10
                                    grid
                                    gap-5

                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                    lg:gap-5
                                "
                            >

                                {items.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="
                                                group
                                                relative
                                                overflow-hidden
                                                rounded-[24px]
                                                border
                                                border-white/10
                                                bg-white/[0.055]
                                                px-5
                                                py-6
                                                text-center
                                                backdrop-blur-sm
                                                transition
                                                duration-300
                                                hover:-translate-y-1
                                                hover:border-white/20
                                                hover:bg-white/[0.09]

                                                lg:px-8
                                            "
                                        >

                                            {index !== 0 && (
                                                <div
                                                    className="
                                                        hidden
                                                    "
                                                />
                                            )}


                                            <StatIcon
                                                icon={
                                                    item.icon
                                                }
                                            />


                                            <div
                                                className="
                                                    mt-5
                                                    flex
                                                    items-end
                                                    justify-center
                                                    gap-1
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-4xl
                                                        font-extrabold
                                                        tracking-[-0.035em]
                                                        text-white

                                                        sm:text-[52px]
                                                    "
                                                >
                                                    {item.value ??
                                                        ''}
                                                </span>


                                                {item.suffix && (
                                                    <span
                                                        className="
                                                            pb-1
                                                            text-lg
                                                            font-bold
                                                            text-[#F4C15D]

                                                            sm:text-xl
                                                        "
                                                    >
                                                        {
                                                            item.suffix
                                                        }
                                                    </span>
                                                )}

                                            </div>


                                            <p
                                                className="
                                                    mt-3
                                                    text-sm
                                                    font-semibold
                                                    text-white/90
                                                "
                                            >
                                                {item.label ??
                                                    ''}
                                            </p>


                                            {item.description && (
                                                <p
                                                    className="
                                                        mx-auto
                                                        mt-2
                                                        max-w-[180px]
                                                        text-xs
                                                        leading-5
                                                        text-white/60
                                                    "
                                                >
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            )}

                                        </div>
                                    ),
                                )}

                            </div>

                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}

                </div>

            </section>
        );
    }


    /* =====================================================
       CARDS
       ===================================================== */

    if (
        variant === 'cards'
    ) {
        return (
            <section
                className="
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6
                    lg:px-8
                    lg:py-28
                "
            >

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >

                    <StatsHeader
                        title={title}
                        heading={
                            sectionHeading
                        }
                        description={
                            content.description
                        }
                    />


                    {items.length > 0 ? (
                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            {items.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="
                                            group
                                            relative
                                            overflow-hidden
                                            relative
                                            overflow-hidden
                                            rounded-[26px]
                                            border
                                            border-[#DCE7EF]
                                            bg-white
                                            p-6
                                            shadow-[0_10px_30px_rgba(11,45,77,0.055)]
                                            transition
                                            duration-300

                                            hover:-translate-y-1
                                            hover:border-[#A9CDE7]
                                            hover:shadow-[0_20px_48px_rgba(11,45,77,0.10)]
                                        "
                                    >

                                        <div
                                            className="
                                                absolute
                                                left-0
                                                top-0
                                                h-[3px]
                                                w-20
                                                bg-[linear-gradient(90deg,#0A5F9E,#D71920)]
                                                transition-all
                                                duration-300

                                                group-hover:w-full
                                            "
                                        />


                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <div>

                                                <div
                                                    className="
                                                        flex
                                                        items-end
                                                        gap-1
                                                    "
                                                >
                                                    <span
                                                        className="
                                                            text-4xl
                                                            font-extrabold
                                                            tracking-[-0.04em]
                                                            text-[#0B2D4D]
                                                        "
                                                    >
                                                        {item.value ??
                                                            ''}
                                                    </span>


                                                    {item.suffix && (
                                                        <span
                                                            className="
                                                                pb-1
                                                                text-lg
                                                                font-bold
                                                                text-[#D71920]
                                                            "
                                                        >
                                                            {
                                                                item.suffix
                                                            }
                                                        </span>
                                                    )}

                                                </div>


                                                <p
                                                    className="
                                                        mt-3
                                                        text-sm
                                                        font-semibold
                                                        text-[#4E6173]
                                                    "
                                                >
                                                    {item.label ??
                                                        ''}
                                                </p>

                                            </div>


                                            <div
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)]
                                                    text-xl
                                                    text-[#0A5F9E]
                                                "
                                            >
                                                {item.icon ||
                                                    '•'}
                                            </div>

                                        </div>


                                        {item.description && (
                                            <p
                                                className="
                                                    mt-5
                                                    text-sm
                                                    leading-6
                                                    text-slate-500
                                                "
                                            >
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}

                                    </article>
                                ),
                            )}

                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}

                </div>

            </section>
        );
    }


    /* =====================================================
       HIGHLIGHT
       ===================================================== */

    if (
        variant === 'highlight'
    ) {
        return (
            <section
                className="
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6
                    lg:px-8
                    lg:py-28
                "
            >

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >

                    <StatsHeader
                        title={title}
                        heading={
                            sectionHeading
                        }
                        description={
                            content.description
                        }
                    />


                    {items.length > 0 ? (
                        <div
                            className="
                                overflow-hidden
                                rounded-[36px]
                                border
                                border-[#174E77]
                                bg-[linear-gradient(145deg,#061B2C_0%,#0B2D4D_45%,#0A5F9E_100%)]
                                shadow-[0_28px_85px_rgba(11,45,77,0.22)]
                            "
                        >

                            <div
                                className="
                                    grid
                                    gap-4
                                    p-5

                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                    lg:p-6
                                "
                            >

                                {items.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="
                                                group
                                                relative
                                                overflow-hidden
                                                rounded-[24px]
                                                border
                                                border-white/10
                                                bg-white/[0.055]
                                                px-6
                                                py-9
                                                text-center
                                                text-white
                                                backdrop-blur-sm
                                                transition
                                                duration-300
                                                hover:-translate-y-1
                                                hover:border-white/20
                                                hover:bg-white/[0.09]

                                                sm:px-8
                                                lg:py-11
                                            "
                                        >

                                            {index !==
                                                0 && (
                                                <div
                                                    className="
                                                        hidden
                                                    "
                                                />
                                            )}


                                            <StatIcon
                                                icon={
                                                    item.icon
                                                }
                                            />


                                            <div
                                                className="
                                                    mt-5
                                                    flex
                                                    items-end
                                                    justify-center
                                                    gap-1
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-4xl
                                                        font-extrabold

                                                        sm:text-[52px]
                                                    "
                                                >
                                                    {item.value ??
                                                        ''}
                                                </span>


                                                {item.suffix && (
                                                    <span
                                                        className="
                                                            pb-1
                                                            text-lg
                                                            font-bold
                                                            text-[#F4C15D]

                                                            sm:text-xl
                                                        "
                                                    >
                                                        {
                                                            item.suffix
                                                        }
                                                    </span>
                                                )}

                                            </div>


                                            <p
                                                className="
                                                    mt-3
                                                    text-sm
                                                    font-medium
                                                    text-white/75
                                                "
                                            >
                                                {item.label ??
                                                    ''}
                                            </p>

                                        </div>
                                    ),
                                )}

                            </div>

                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}

                </div>

            </section>
        );
    }


    /* =====================================================
       BENEFITS
       ===================================================== */

    if (
        variant === 'benefits'
    ) {
        return (
            <section
                className="
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6
                    lg:px-8
                    lg:py-28
                "
            >

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >

                    <StatsHeader
                        title={title}
                        heading={
                            sectionHeading
                        }
                        description={
                            content.description
                        }
                    />


                    {items.length > 0 ? (
                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            {items.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="
                                            group
                                            relative
                                            overflow-hidden
                                            rounded-[26px]
                                            border
                                            border-[#DCE7EF]
                                            bg-white
                                            p-6
                                            shadow-[0_10px_30px_rgba(11,45,77,0.055)]
                                            transition
                                            duration-300

                                            hover:-translate-y-1
                                            hover:border-[#A9CDE7]
                                            hover:shadow-[0_20px_48px_rgba(11,45,77,0.10)]
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)]
                                                    text-xl
                                                    text-[#0A5F9E]
                                                "
                                            >
                                                {item.icon ||
                                                    '✓'}
                                            </div>


                                            {item.trend && (
                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-[#EAF8F1]
                                                        px-2.5
                                                        py-1
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-[#238A55]
                                                    "
                                                >
                                                    {
                                                        item.trend
                                                    }
                                                </span>
                                            )}

                                        </div>


                                        <div
                                            className="
                                                mt-5
                                                flex
                                                items-end
                                                gap-1
                                            "
                                        >
                                            <span
                                                className="
                                                    text-4xl
                                                    font-extrabold
                                                    tracking-[-0.04em]
                                                    text-[#0B2D4D]
                                                "
                                            >
                                                {item.value ??
                                                    ''}
                                            </span>


                                            {item.suffix && (
                                                <span
                                                    className="
                                                        pb-1
                                                        text-lg
                                                        font-bold
                                                        text-[#D71920]
                                                    "
                                                >
                                                    {
                                                        item.suffix
                                                    }
                                                </span>
                                            )}

                                        </div>


                                        <h3
                                            className="
                                                mt-3
                                                text-sm
                                                font-bold
                                                text-[#0B2D4D]
                                            "
                                        >
                                            {item.label ??
                                                ''}
                                        </h3>


                                        {item.description && (
                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    leading-6
                                                    text-slate-500
                                                "
                                            >
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}

                                    </article>
                                ),
                            )}

                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}

                </div>

            </section>
        );
    }


    /* =====================================================
       KPI
       ===================================================== */

    if (
        variant === 'kpi'
    ) {
        return (
            <section
                className="
                    bg-[#F7FAFD]
                    px-5
                    py-20

                    sm:px-6
                    lg:px-8
                    lg:py-28
                "
            >

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >

                    <StatsHeader
                        title={title}
                        heading={
                            sectionHeading
                        }
                        description={
                            content.description
                        }
                    />


                    {items.length > 0 ? (
                        <div
                            className="
                                grid
                                gap-5

                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            {items.map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <article
                                        key={
                                            index
                                        }
                                        className="
                                            group
                                            relative
                                            overflow-hidden
                                            rounded-[28px]
                                            border
                                            border-white/10
                                            bg-[linear-gradient(145deg,#071D31_0%,#0A355A_48%,#0A5F9E_100%)]
                                            p-6
                                            text-center
                                            shadow-[0_18px_48px_rgba(11,45,77,0.20)]
                                            transition
                                            duration-300

                                            hover:-translate-y-1
                                            hover:shadow-[0_26px_62px_rgba(11,45,77,0.26)]
                                        "
                                    >

                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                -right-14
                                                -top-14
                                                h-36
                                                w-36
                                                rounded-full
                                                bg-white/10
                                                blur-2xl
                                            "
                                        />


                                        <div
                                            className="
                                                relative
                                                z-10
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <StatIcon
                                                icon={
                                                    item.icon
                                                }
                                            />


                                            <span
                                                className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.12em]
                                                    text-white/35
                                                "
                                            >
                                                KPI {String(index + 1).padStart(2, '0')}
                                            </span>

                                        </div>


                                        <div
                                            className="
                                                mt-5
                                                flex
                                                items-end
                                                justify-center
                                                gap-1
                                            "
                                        >
                                            <span
                                                className="
                                                    text-4xl
                                                    font-extrabold
                                                    tracking-[-0.04em]
                                                    text-white

                                                    sm:text-[52px]
                                                "
                                            >
                                                {item.value ??
                                                    ''}
                                            </span>


                                            {item.suffix && (
                                                <span
                                                    className="
                                                        pb-1
                                                        text-lg
                                                        font-bold
                                                        text-[#F4C15D]
                                                    "
                                                >
                                                    {
                                                        item.suffix
                                                    }
                                                </span>
                                            )}

                                        </div>


                                        <p
                                            className="
                                                mt-3
                                                text-sm
                                                font-semibold
                                                text-white/90
                                            "
                                        >
                                            {item.label ??
                                                ''}
                                        </p>


                                        {item.description && (
                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    leading-6
                                                    text-white/60
                                                "
                                            >
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}

                                        {item.trend && (
                                            <div
                                                className="
                                                    mt-6
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    border-t
                                                    border-white/10
                                                    pt-4
                                                "
                                            >
                                                <span
                                                    className="
                                                        h-2
                                                        w-2
                                                        rounded-full
                                                        bg-[#6EE7A8]
                                                    "
                                                />

                                                <span
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-white/65
                                                    "
                                                >
                                                    {item.trend}
                                                </span>
                                            </div>
                                        )}

                                    </article>
                                ),
                            )}

                        </div>
                    ) : (
                        <StatsEmptyState />
                    )}

                </div>

            </section>
        );
    }


    /* =====================================================
       FALLBACK
       ===================================================== */

    return (
        <section
            className="
                bg-[#F7FAFD]
                px-5
                py-20

                sm:px-6
                lg:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-[1400px]
                "
            >

                <StatsHeader
                    title={title}
                    heading={
                        sectionHeading
                    }
                    description={
                        content.description
                    }
                />


                <StatsEmptyState />

            </div>

        </section>
    );
}