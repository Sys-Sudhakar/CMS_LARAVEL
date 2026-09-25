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
   COMMON SECTION HEADER
   ========================================================= */

function SectionHeader({
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
                mb-14
                max-w-3xl
                text-center
            "
        >
            <div
                className="
                    flex
                    justify-center
                "
            >
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
                            tracking-[0.18em]
                            text-[#0A5F9E]

                            sm:text-xs
                        "
                    >
                        {title || 'Our Vision & Mission'}
                    </span>
                </div>
            </div>


            <h2
                className="
                    mt-5
                    text-3xl
                    font-extrabold
                    leading-[1.08]
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
                <span
                    className="
                        h-[3px]
                        w-12
                        rounded-full
                        bg-[#D71920]
                    "
                />

                <span
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
   MISSION ICON
   ========================================================= */

function MissionIcon() {
    return (
        <div
            className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-[#FFF0F1]
                text-[#D71920]
                shadow-[inset_0_0_0_1px_rgba(215,25,32,0.08)]
            "
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="4" />
                <circle
                    cx="12"
                    cy="12"
                    r="1"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
}


/* =========================================================
   VISION ICON
   ========================================================= */

function VisionIcon() {
    return (
        <div
            className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-white/10
                text-[#9ED7F8]
                backdrop-blur-sm
            "
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
                aria-hidden="true"
            >
                <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                <circle cx="12" cy="12" r="2.5" />
            </svg>
        </div>
    );
}


/* =========================================================
   SMALL CHECK ICON
   ========================================================= */

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden="true"
        >
            <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
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

    const values =
        Array.isArray(
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
       PREMIUM DUAL-CONCEPT COMPOSITION
       ===================================================== */

    if (
        variant === 'cards'
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
                {/* Background atmosphere */}

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
                            left-[7%]
                            top-[10%]
                            h-[280px]
                            w-[280px]
                            rounded-full
                            bg-[#0A5F9E]/6
                            blur-[115px]
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-[2%]
                            right-[6%]
                            h-[280px]
                            w-[280px]
                            rounded-full
                            bg-[#D71920]/5
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
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />


                    <div
                        className="
                            grid
                            gap-6

                            lg:grid-cols-[0.96fr_1.04fr]
                        "
                    >
                        {/* =====================================
                            MISSION
                        ====================================== */}

                        <article
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[32px]
                                border
                                border-[#E0E8EE]
                                bg-white
                                p-7
                                shadow-[0_18px_50px_rgba(11,45,77,0.075)]
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-[#D6C6C8]
                                hover:shadow-[0_26px_60px_rgba(11,45,77,0.12)]

                                sm:p-9

                                lg:p-10
                            "
                        >
                            <div
                                className="
                                    absolute
                                    left-0
                                    top-0
                                    h-full
                                    w-[4px]
                                    bg-[linear-gradient(180deg,#D71920_0%,#F26D72_100%)]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -right-20
                                    -top-20
                                    h-56
                                    w-56
                                    rounded-full
                                    bg-[#D71920]/6
                                    blur-3xl
                                    transition
                                    duration-500

                                    group-hover:scale-110
                                "
                            />


                            <div
                                className="
                                    relative
                                    flex
                                    items-start
                                    justify-between
                                    gap-6
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-4
                                    "
                                >
                                    <MissionIcon />

                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.17em]
                                                text-[#D71920]
                                            "
                                        >
                                            Mission
                                        </p>

                                        <h3
                                            className="
                                                mt-2
                                                max-w-md
                                                text-2xl
                                                font-extrabold
                                                leading-tight
                                                tracking-[-0.03em]
                                                text-[#0B2D4D]

                                                sm:text-[30px]
                                            "
                                        >
                                            {missionTitle}
                                        </h3>
                                    </div>
                                </div>

                                <span
                                    className="
                                        hidden
                                        text-[42px]
                                        font-black
                                        leading-none
                                        tracking-[-0.06em]
                                        text-[#F2E4E5]

                                        sm:block
                                    "
                                >
                                    01
                                </span>
                            </div>


                            {content.mission && (
                                <p
                                    className="
                                        relative
                                        mt-8
                                        max-w-2xl
                                        text-base
                                        leading-8
                                        text-[#5C6F82]
                                    "
                                >
                                    {content.mission}
                                </p>
                            )}


                            <div
                                className="
                                    relative
                                    mt-9
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    border-t
                                    border-[#EDF1F5]
                                    pt-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#FFF0F1]
                                            text-[#D71920]
                                        "
                                    >
                                        <CheckIcon />
                                    </span>

                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.13em]
                                            text-[#7A8D9E]
                                        "
                                    >
                                        Purpose & Direction
                                    </span>
                                </div>

                                <span
                                    className="
                                        hidden
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#B4C0CA]

                                        sm:block
                                    "
                                >
                                    Today
                                </span>
                            </div>
                        </article>


                        {/* =====================================
                            VISION
                        ====================================== */}

                        <article
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[32px]
                                border
                                border-[#144E78]
                                bg-[linear-gradient(145deg,#071D31_0%,#0B2D4D_45%,#0A5F9E_100%)]
                                p-7
                                text-white
                                shadow-[0_24px_70px_rgba(11,45,77,0.20)]
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:shadow-[0_30px_80px_rgba(11,45,77,0.26)]

                                sm:p-9

                                lg:p-10
                            "
                        >
                            <div
                                className="
                                    absolute
                                    inset-x-0
                                    top-0
                                    h-[4px]
                                    bg-[linear-gradient(90deg,#52A8DF_0%,#9ED7F8_100%)]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -right-20
                                    -top-20
                                    h-64
                                    w-64
                                    rounded-full
                                    bg-white/10
                                    blur-3xl
                                    transition
                                    duration-500

                                    group-hover:scale-110
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -bottom-20
                                    left-10
                                    h-52
                                    w-52
                                    rounded-full
                                    bg-[#52A8DF]/12
                                    blur-3xl
                                "
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    opacity-[0.045]
                                    [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]
                                    [background-size:42px_42px]
                                "
                            />


                            <div
                                className="
                                    relative
                                    flex
                                    items-start
                                    justify-between
                                    gap-6
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-4
                                    "
                                >
                                    <VisionIcon />

                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.17em]
                                                text-[#9ED7F8]
                                            "
                                        >
                                            Vision
                                        </p>

                                        <h3
                                            className="
                                                mt-2
                                                max-w-md
                                                text-2xl
                                                font-extrabold
                                                leading-tight
                                                tracking-[-0.03em]
                                                text-white

                                                sm:text-[30px]
                                            "
                                        >
                                            {visionTitle}
                                        </h3>
                                    </div>
                                </div>

                                <span
                                    className="
                                        hidden
                                        text-[42px]
                                        font-black
                                        leading-none
                                        tracking-[-0.06em]
                                        text-white/10

                                        sm:block
                                    "
                                >
                                    02
                                </span>
                            </div>


                            {content.vision && (
                                <p
                                    className="
                                        relative
                                        mt-8
                                        max-w-2xl
                                        text-base
                                        leading-8
                                        text-white/72
                                    "
                                >
                                    {content.vision}
                                </p>
                            )}


                            <div
                                className="
                                    relative
                                    mt-9
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    border-t
                                    border-white/10
                                    pt-5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-white/10
                                            text-[#9ED7F8]
                                        "
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="h-3.5 w-3.5"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M5 12h14M13 6l6 6-6 6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>

                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.13em]
                                            text-white/55
                                        "
                                    >
                                        Future & Growth
                                    </span>
                                </div>

                                <span
                                    className="
                                        hidden
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-white/30

                                        sm:block
                                    "
                                >
                                    Tomorrow
                                </span>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        );
    }


    /* =====================================================
       VALUES VARIANT
       MISSION + VISION + VALUE SYSTEM
       ===================================================== */

    if (
        variant === 'values'
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
                            -left-24
                            top-28
                            h-[280px]
                            w-[280px]
                            rounded-full
                            bg-[#0A5F9E]/5
                            blur-[110px]
                        "
                    />

                    <div
                        className="
                            absolute
                            -right-24
                            bottom-0
                            h-[280px]
                            w-[280px]
                            rounded-full
                            bg-[#D71920]/4
                            blur-[110px]
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
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />


                    {/* Mission + Vision summary */}

                    <div
                        className="
                            grid
                            gap-6

                            lg:grid-cols-2
                        "
                    >
                        <article
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-[#E3EAF0]
                                bg-white
                                p-7
                                shadow-[0_14px_38px_rgba(11,45,77,0.065)]
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-[#D9C6C8]
                                hover:shadow-[0_22px_50px_rgba(11,45,77,0.10)]

                                sm:p-8
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -right-16
                                    -top-16
                                    h-44
                                    w-44
                                    rounded-full
                                    bg-[#D71920]/5
                                    blur-2xl
                                "
                            />

                            <div className="relative">
                                <MissionIcon />

                                <p
                                    className="
                                        mt-6
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#D71920]
                                    "
                                >
                                    Mission
                                </p>

                                <h3
                                    className="
                                        mt-2
                                        text-2xl
                                        font-extrabold
                                        tracking-[-0.025em]
                                        text-[#0B2D4D]
                                    "
                                >
                                    {missionTitle}
                                </h3>

                                {content.mission && (
                                    <p
                                        className="
                                            mt-4
                                            text-base
                                            leading-8
                                            text-[#5C6F82]
                                        "
                                    >
                                        {content.mission}
                                    </p>
                                )}
                            </div>
                        </article>


                        <article
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[28px]
                                border
                                border-[#C9DDEC]
                                bg-[linear-gradient(145deg,#EAF5FB_0%,#F6FBFE_100%)]
                                p-7
                                shadow-[0_14px_38px_rgba(11,45,77,0.055)]
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-[#9FC6E1]
                                hover:shadow-[0_22px_50px_rgba(11,45,77,0.10)]

                                sm:p-8
                            "
                        >
                            <div
                                className="
                                    absolute
                                    -right-14
                                    -top-14
                                    h-40
                                    w-40
                                    rounded-full
                                    bg-[#0A5F9E]/7
                                    blur-2xl
                                "
                            />

                            <div className="relative">
                                <div
                                    className="
                                        flex
                                        h-14
                                        w-14
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[#0A5F9E]
                                        text-white
                                        shadow-[0_10px_24px_rgba(10,95,158,0.18)]
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-7 w-7"
                                        aria-hidden="true"
                                    >
                                        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="2.5"
                                        />
                                    </svg>
                                </div>

                                <p
                                    className="
                                        mt-6
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-[#0A5F9E]
                                    "
                                >
                                    Vision
                                </p>

                                <h3
                                    className="
                                        mt-2
                                        text-2xl
                                        font-extrabold
                                        tracking-[-0.025em]
                                        text-[#0B2D4D]
                                    "
                                >
                                    {visionTitle}
                                </h3>

                                {content.vision && (
                                    <p
                                        className="
                                            mt-4
                                            text-base
                                            leading-8
                                            text-[#5C6F82]
                                        "
                                    >
                                        {content.vision}
                                    </p>
                                )}
                            </div>
                        </article>
                    </div>


                    {/* Values matrix */}

                    {values.length > 0 ? (
                        <div
                            className="
                                mt-10
                                overflow-hidden
                                rounded-[30px]
                                border
                                border-[#DCE7EF]
                                bg-white
                                shadow-[0_18px_55px_rgba(11,45,77,0.07)]
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    border-b
                                    border-[#E8EFF4]
                                    bg-[#F8FBFD]
                                    px-6
                                    py-5

                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.15em]
                                            text-[#0A5F9E]
                                        "
                                    >
                                        Our Values
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-[#42576B]
                                        "
                                    >
                                        Principles that shape how we work and deliver.
                                    </p>
                                </div>

                                <span
                                    className="
                                        inline-flex
                                        w-fit
                                        rounded-full
                                        bg-white
                                        px-3
                                        py-1.5
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.12em]
                                        text-[#718395]
                                        shadow-sm
                                    "
                                >
                                    {values.length} Values
                                </span>
                            </div>


                            <div
                                className="
                                    grid

                                    sm:grid-cols-2

                                    lg:grid-cols-3
                                "
                            >
                                {values.map(
                                    (
                                        value,
                                        index,
                                    ) => (
                                        <article
                                            key={
                                                index
                                            }
                                            className="
                                                group
                                                relative
                                                min-h-[190px]
                                                border-b
                                                border-r
                                                border-[#E7EEF3]
                                                p-6
                                                transition
                                                duration-300

                                                hover:z-10
                                                hover:bg-[#F9FCFE]
                                                hover:shadow-[0_14px_34px_rgba(11,45,77,0.08)]
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
                                                        h-10
                                                        w-10
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        bg-[#EAF4FC]
                                                        text-sm
                                                        font-bold
                                                        text-[#0A5F9E]
                                                        transition
                                                        duration-300

                                                        group-hover:bg-[#0A5F9E]
                                                        group-hover:text-white
                                                    "
                                                >
                                                    {String(
                                                        index +
                                                            1,
                                                    ).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </div>

                                                <span
                                                    className="
                                                        text-[9px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.14em]
                                                        text-[#A1B0BC]
                                                    "
                                                >
                                                    Value
                                                </span>
                                            </div>

                                            <p
                                                className="
                                                    mt-5
                                                    text-sm
                                                    font-semibold
                                                    leading-7
                                                    text-[#42576B]
                                                "
                                            >
                                                {value}
                                            </p>

                                            <div
                                                className="
                                                    absolute
                                                    bottom-0
                                                    left-0
                                                    h-[3px]
                                                    w-0
                                                    bg-[linear-gradient(90deg,#0A5F9E,#D71920)]
                                                    transition-all
                                                    duration-300

                                                    group-hover:w-full
                                                "
                                            />
                                        </article>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : (
                        <div
                            className="
                                mt-10
                                rounded-[28px]
                                border
                                border-dashed
                                border-[#BCD0DF]
                                bg-white
                                px-6
                                py-14
                                text-center
                                shadow-[0_12px_40px_rgba(11,45,77,0.05)]
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-[#718395]
                                "
                            >
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
       DARK STRATEGIC FRAMEWORK
       ===================================================== */

    if (
        variant === 'principles'
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
                        mx-auto
                        max-w-[1400px]
                    "
                >
                    <SectionHeader
                        title={title}
                        heading={heading}
                        description={
                            content.description
                        }
                    />


                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[38px]
                            border
                            border-[#174E77]
                            bg-[linear-gradient(145deg,#061B2C_0%,#0B2D4D_45%,#0A5F9E_100%)]
                            p-6
                            shadow-[0_30px_85px_rgba(11,45,77,0.24)]

                            sm:p-8

                            lg:p-10
                        "
                    >
                        {/* Dark canvas decoration */}

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
                                    -left-24
                                    -top-24
                                    h-80
                                    w-80
                                    rounded-full
                                    bg-[#52A8DF]/14
                                    blur-[120px]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    -bottom-28
                                    right-[-30px]
                                    h-80
                                    w-80
                                    rounded-full
                                    bg-[#D71920]/13
                                    blur-[120px]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    opacity-[0.05]
                                    [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)]
                                    [background-size:44px_44px]
                                "
                            />
                        </div>


                        <div
                            className="
                                relative
                                z-10
                                grid
                                gap-6

                                lg:grid-cols-[0.88fr_1.12fr]
                            "
                        >
                            {/* Mission / Vision strategic anchors */}

                            <div
                                className="
                                    space-y-5
                                "
                            >
                                <article
                                    className="
                                        group
                                        rounded-[24px]
                                        border
                                        border-white/10
                                        bg-white/[0.07]
                                        p-7
                                        backdrop-blur-sm
                                        transition
                                        duration-300

                                        hover:-translate-y-1
                                        hover:border-white/20
                                        hover:bg-white/[0.10]

                                        sm:p-8
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
                                        <div>
                                            <p
                                                className="
                                                    text-xs
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-[#FF9DA1]
                                                "
                                            >
                                                Mission
                                            </p>

                                            <h3
                                                className="
                                                    mt-2
                                                    text-2xl
                                                    font-extrabold
                                                    tracking-[-0.025em]
                                                    text-white
                                                "
                                            >
                                                {missionTitle}
                                            </h3>
                                        </div>

                                        <span
                                            className="
                                                text-3xl
                                                font-black
                                                text-white/10
                                            "
                                        >
                                            01
                                        </span>
                                    </div>

                                    {content.mission && (
                                        <p
                                            className="
                                                mt-5
                                                text-base
                                                leading-8
                                                text-white/70
                                            "
                                        >
                                            {content.mission}
                                        </p>
                                    )}
                                </article>


                                <article
                                    className="
                                        group
                                        rounded-[24px]
                                        border
                                        border-white/10
                                        bg-white/[0.07]
                                        p-7
                                        backdrop-blur-sm
                                        transition
                                        duration-300

                                        hover:-translate-y-1
                                        hover:border-white/20
                                        hover:bg-white/[0.10]

                                        sm:p-8
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
                                        <div>
                                            <p
                                                className="
                                                    text-xs
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-[#9ED7F8]
                                                "
                                            >
                                                Vision
                                            </p>

                                            <h3
                                                className="
                                                    mt-2
                                                    text-2xl
                                                    font-extrabold
                                                    tracking-[-0.025em]
                                                    text-white
                                                "
                                            >
                                                {visionTitle}
                                            </h3>
                                        </div>

                                        <span
                                            className="
                                                text-3xl
                                                font-black
                                                text-white/10
                                            "
                                        >
                                            02
                                        </span>
                                    </div>

                                    {content.vision && (
                                        <p
                                            className="
                                                mt-5
                                                text-base
                                                leading-8
                                                text-white/70
                                            "
                                        >
                                            {content.vision}
                                        </p>
                                    )}
                                </article>
                            </div>


                            {/* Principles grid */}

                            {values.length > 0 ? (
                                <div
                                    className="
                                        grid
                                        gap-4

                                        sm:grid-cols-2
                                    "
                                >
                                    {values.map(
                                        (
                                            value,
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
                                                    rounded-[24px]
                                                    border
                                                    border-white/10
                                                    bg-white/[0.06]
                                                    p-6
                                                    backdrop-blur-sm
                                                    transition
                                                    duration-300

                                                    hover:-translate-y-1
                                                    hover:border-white/22
                                                    hover:bg-white/[0.10]
                                                "
                                            >
                                                <div
                                                    className="
                                                        absolute
                                                        right-[-42px]
                                                        top-[-42px]
                                                        h-28
                                                        w-28
                                                        rounded-full
                                                        bg-white/5
                                                        transition
                                                        duration-500

                                                        group-hover:scale-150
                                                    "
                                                />

                                                <div
                                                    className="
                                                        relative
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
                                                            rounded-xl
                                                            border
                                                            border-white/10
                                                            bg-white/10
                                                            text-sm
                                                            font-bold
                                                            text-white
                                                        "
                                                    >
                                                        {String(
                                                            index +
                                                                1,
                                                        ).padStart(
                                                            2,
                                                            '0',
                                                        )}
                                                    </div>

                                                    <span
                                                        className="
                                                            text-[9px]
                                                            font-bold
                                                            uppercase
                                                            tracking-[0.14em]
                                                            text-white/35
                                                        "
                                                    >
                                                        Principle
                                                    </span>
                                                </div>

                                                <p
                                                    className="
                                                        relative
                                                        mt-6
                                                        text-sm
                                                        font-semibold
                                                        leading-7
                                                        text-white/85
                                                    "
                                                >
                                                    {value}
                                                </p>

                                                <div
                                                    className="
                                                        relative
                                                        mt-6
                                                        h-[2px]
                                                        w-8
                                                        rounded-full
                                                        bg-[#FF7B80]
                                                        transition-all
                                                        duration-300

                                                        group-hover:w-14
                                                    "
                                                />
                                            </article>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        rounded-[24px]
                                        border
                                        border-dashed
                                        border-white/20
                                        bg-white/[0.04]
                                        px-6
                                        py-12
                                        text-center
                                    "
                                >
                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            text-white/70
                                        "
                                    >
                                        Add principles from the CMS.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
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
