interface ContentSectionContent {
    variant?:
        | 'standard'
        | 'image_left'
        | 'image_right'
        | 'highlight'
        | 'two_column'
        | string;

    heading?: string;
    description?: string;

    button_text?: string;
    button_url?: string;

    /*
    |--------------------------------------------------------------------------
    | Backward-Compatible Content Fields
    |--------------------------------------------------------------------------
    */

    text?: string;
    content?: string;
}


interface ContentSectionProps {
    title?: string | null;
    content?: ContentSectionContent;
    imageUrl?: string | null;
}


/* =========================================================
   ACTION BUTTON
   ========================================================= */

function ContentButton({
    text,
    url,
}: {
    text: string;
    url: string;
}) {
    return (
        <a
            href={url}
            className="
                group
                inline-flex
                min-h-[48px]
                items-center
                justify-center
                gap-2.5
                rounded-lg
                bg-[#0A5F9E]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                shadow-[0_10px_28px_rgba(10,95,158,0.25)]
                transition
                duration-200

                hover:-translate-y-0.5
                hover:bg-[#0C6FB8]
                hover:shadow-[0_16px_36px_rgba(10,95,158,0.35)]

                focus:outline-none
                focus:ring-2
                focus:ring-[#4EA3D8]
                focus:ring-offset-2
                focus:ring-offset-white
            "
        >
            {text}

            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="
                    h-4
                    w-4
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                "
                aria-hidden="true"
            >
                <path
                    d="M5 12h14"
                    strokeLinecap="round"
                />

                <path
                    d="m13 6 6 6-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </a>
    );
}


/* =========================================================
   SECTION LABEL
   ========================================================= */

function SectionLabel({
    title,
}: {
    title: string;
}) {
    return (
        <div className="inline-flex items-center gap-3">
            <span className="h-[2px] w-7 bg-[#D71920]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#0A5F9E] sm:text-xs">
                {title}
            </span>
        </div>
    );
}


/* =========================================================
   IMAGE PLACEHOLDER
   ========================================================= */

function ImagePlaceholder() {
    return (
        <div
            className="
                flex
                min-h-[340px]
                items-center
                justify-center
                rounded-[26px]
                border
                border-dashed
                border-[#C8D6E3]
                bg-white
                px-8
                text-center
                
            "
        >
            <div>

                <div
                    className="
                        mx-auto
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-[#DDE7EF]
                        bg-[#EAF4FC]
                        text-[#0A5F9E]
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-7 w-7"
                        aria-hidden="true"
                    >
                        <path d="M4 5h16v14H4z" />

                        <path d="m4 15 4-4 4 4 3-3 5 5" />

                        <circle
                            cx="16"
                            cy="9"
                            r="1.5"
                        />
                    </svg>
                </div>


                <p
                    className="
                        mt-5
                        text-sm
                        font-semibold
                        text-[#0B2D4D]
                    "
                >
                    Add an image from the CMS
                </p>


                <p
                    className="
                        mt-2
                        text-xs
                        leading-5
                        text-[#6E8192]
                    "
                >
                    Choose an image for this content section.
                </p>

            </div>
        </div>
    );
}


/* =========================================================
   CONTENT SECTION
   ========================================================= */

export default function ContentSection({
    title,
    content = {},
    imageUrl = null,
}: ContentSectionProps) {
    const variant =
        content.variant
        ??
        'standard';


    const heading =
        content.heading
        ||
        title
        ||
        'Content Section';


    const description =
        content.description
        ||
        '';


    /*
    |--------------------------------------------------------------------------
    | Supports Both New + Existing CMS Records
    |--------------------------------------------------------------------------
    */

    const bodyText =
        content.text
        ||
        content.content
        ||
        '';


    const buttonText =
        content.button_text
        ||
        '';


    const buttonUrl =
        content.button_url
        ||
        '#';


    /* =====================================================
       STANDARD
       ===================================================== */

    if (
        variant ===
        'standard'
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
                {/* BACKGROUND */}

                <div className="pointer-events-none absolute inset-0">

                    <div
                        className="
                            absolute
                            -left-40
                            top-10
                            h-[360px]
                            w-[360px]
                            rounded-full
                            bg-[#0A5F9E]/6
                            blur-[110px]
                        "
                    />

                    <div
                        className="
                            absolute
                            -right-40
                            bottom-0
                            h-[340px]
                            w-[340px]
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
                        max-w-6xl
                    "
                >

                    <div
                        className="
                            mx-auto
                            max-w-3xl
                            text-center
                        "
                    >

                        {title && (
                            <SectionLabel
                                title={title}
                            />
                        )}


                        <h2
                            className="
                                mt-6
                                text-3xl
                                font-extrabold
                                leading-tight
                                tracking-[-0.03em]
                                text-[#0B2D4D]

                                sm:text-4xl
                                lg:text-[46px]
                            "
                        >
                            {heading}
                        </h2>


                        <div
                            className="
                                mx-auto
                                mt-6
                                h-[3px]
                                w-14
                                rounded-full
                                bg-gradient-to-r
                                from-[#D71920]
                                to-[#0A5F9E]
                            "
                        />


                        {description && (
                            <p
                                className="
                                    mt-7
                                    text-base
                                    leading-8
                                    text-[#5C6F82]

                                    sm:text-lg
                                "
                            >
                                {description}
                            </p>
                        )}

                    </div>


                    {bodyText && (
                        <div
                            className="
                                mx-auto
                                mt-10
                                max-w-5xl
                                px-1

                                sm:px-4
                                lg:px-8
                            "
                        >
                            <div
                                className="
                                    whitespace-pre-line
                                    text-[15px]
                                    leading-8
                                    text-[#536779]

                                    sm:text-base
                                "
                            >
                                {bodyText}
                            </div>
                        </div>
                    )}


                    {buttonText && (
                        <div className="mt-9 text-center">

                            <ContentButton
                                text={
                                    buttonText
                                }
                                url={
                                    buttonUrl
                                }
                            />

                        </div>
                    )}

                </div>
            </section>
        );
    }


    /* =====================================================
       IMAGE LEFT / IMAGE RIGHT
       ===================================================== */

    if (
        variant ===
            'image_left'
        ||
        variant ===
            'image_right'
    ) {
        const imageOnRight =
            variant ===
            'image_right';


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
                    lg:py-24
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_50%_40%,rgba(10,95,158,0.055),transparent_48%)]
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        max-w-[1400px]
                    "
                >

                    <div
                        className="
                            grid
                            items-center
                            gap-14

                            lg:grid-cols-2
                            lg:gap-20
                        "
                    >

                        {/* IMAGE */}

                        <div
                            className={
                                imageOnRight
                                    ? 'lg:order-2'
                                    : 'lg:order-1'
                            }
                        >

                            {imageUrl ? (
                                <div
                                    className="
                                        relative
                                        mx-auto
                                        max-w-[650px]
                                    "
                                >

                                    <div
                                        className="
                                            absolute
                                            -inset-5
                                            rounded-[34px]
                                            bg-gradient-to-br
                                            from-[#0A5F9E]/10
                                            via-transparent
                                            to-[#D71920]/8
                                            blur-2xl
                                        "
                                    />


                                    <div
                                        className="
                                            relative
                                            overflow-hidden
                                            rounded-[28px]
                                            border
                                            border-[#DDE7EF]
                                            bg-white
                                            p-2
                                            shadow-[0_24px_65px_rgba(11,45,77,0.14)]
                                        "
                                    >

                                        <img
                                            src={
                                                imageUrl
                                            }
                                            alt={
                                                heading
                                            }
                                            className="
                                                h-[320px]
                                                w-full
                                                rounded-[22px]
                                                object-cover

                                                sm:h-[390px]
                                                lg:h-[460px]
                                            "
                                        />


                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                inset-2
                                                rounded-[22px]
                                                bg-gradient-to-t
                                                from-[#0B2D4D]/18
                                                via-transparent
                                                to-transparent
                                            "
                                        />

                                    </div>

                                </div>
                            ) : (
                                <ImagePlaceholder />
                            )}

                        </div>


                        {/* CONTENT */}

                        <div
                            className={
                                imageOnRight
                                    ? 'lg:order-1'
                                    : 'lg:order-2'
                            }
                        >

                            {title && (
                                <SectionLabel
                                    title={title}
                                />
                            )}


                            <h2
                                className="
                                    mt-6
                                    text-3xl
                                    font-extrabold
                                    leading-tight
                                    tracking-[-0.035em]
                                    text-[#0B2D4D]

                                    sm:text-4xl
                                    lg:text-[46px]
                                "
                            >
                                {heading}
                            </h2>


                            <div
                                className="
                                    mt-6
                                    h-[3px]
                                    w-14
                                    rounded-full
                                    bg-gradient-to-r
                                    from-[#0A5F9E]
                                    via-[#F4B942]
                                    to-[#C90000]
                                "
                            />


                            {description && (
                                <p
                                    className="
                                        mt-7
                                        text-base
                                        leading-8
                                        text-[#5C6F82]

                                        sm:text-lg
                                    "
                                >
                                    {description}
                                </p>
                            )}


                            {bodyText && (
                                <div
                                    className="
                                        mt-6
                                        whitespace-pre-line
                                        text-base
                                        leading-8
                                        text-[#6E8192]
                                    "
                                >
                                    {bodyText}
                                </div>
                            )}


                            {buttonText && (
                                <div className="mt-9">

                                    <ContentButton
                                        text={
                                            buttonText
                                        }
                                        url={
                                            buttonUrl
                                        }
                                    />

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </section>
        );
    }


    /* =====================================================
       HIGHLIGHT
       ===================================================== */

    if (
        variant ===
        'highlight'
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
                    lg:py-24
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-[1400px]
                    "
                >

                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-[30px]
                            border
                            border-white/10
                            bg-[linear-gradient(135deg,#0B2D4D_0%,#0A5F9E_55%,#08375B_100%)]
                            px-7
                            py-12
                            shadow-[0_24px_70px_rgba(11,45,77,0.20)]

                            sm:px-10

                            lg:px-14
                            lg:py-16
                        "
                    >

                        {/* DECORATION */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-28
                                -top-28
                                h-[320px]
                                w-[320px]
                                rounded-full
                                bg-white/10
                                blur-[95px]
                            "
                        />

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -bottom-28
                                -left-24
                                h-[280px]
                                w-[280px]
                                rounded-full
                                bg-[#D71920]/10
                                blur-[95px]
                            "
                        />


                        <div
                            className="
                                relative
                                z-10
                                grid
                                gap-10

                                lg:grid-cols-[0.9fr_1.1fr]
                                lg:items-center
                                lg:gap-16
                            "
                        >

                            <div>

                                {title && (
                                    <SectionLabel
                                        title={
                                            title
                                        }
                                    />
                                )}


                                <h2
                                    className="
                                        mt-6
                                        text-3xl
                                        font-bold
                                        leading-tight
                                        tracking-[-0.03em]
                                        text-white

                                        sm:text-4xl
                                        lg:text-[44px]
                                    "
                                >
                                    {heading}
                                </h2>


                                <div
                                    className="
                                        mt-6
                                        h-[3px]
                                        w-14
                                        rounded-full
                                        bg-gradient-to-r
                                        from-[#0A5F9E]
                                        via-[#F4B942]
                                        to-[#C90000]
                                    "
                                />

                            </div>


                            <div>

                                {description && (
                                    <p
                                        className="
                                            text-base
                                            leading-8
                                            text-white/75

                                            sm:text-lg
                                        "
                                    >
                                        {
                                            description
                                        }
                                    </p>
                                )}


                                {bodyText && (
                                    <div
                                        className="
                                            mt-6
                                            whitespace-pre-line
                                            border-l-[3px]
                                            border-[#4EA3D8]
                                            pl-6
                                            text-base
                                            leading-8
                                            text-white/75
                                        "
                                    >
                                        {bodyText}
                                    </div>
                                )}


                                {buttonText && (
                                    <div className="mt-8">

                                        <ContentButton
                                            text={
                                                buttonText
                                            }
                                            url={
                                                buttonUrl
                                            }
                                        />

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </section>
        );
    }


    /* =====================================================
       TWO COLUMN
       ===================================================== */

    if (
        variant ===
        'two_column'
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
                    lg:py-24
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

                    {/* HEADER */}

                    <div
                        className="
                            mx-auto
                            mb-12
                            max-w-3xl
                            text-center
                        "
                    >

                        {title && (
                            <SectionLabel
                                title={title}
                            />
                        )}


                        <h2
                            className="
                                mt-6
                                text-3xl
                                font-bold
                                tracking-[-0.03em]
                                text-[#0B2D4D]

                                sm:text-4xl
                                lg:text-[46px]
                            "
                        >
                            {heading}
                        </h2>


                        <div
                            className="
                                mx-auto
                                mt-6
                                h-[3px]
                                w-14
                                rounded-full
                                bg-gradient-to-r
                                from-[#D71920]
                                to-[#0A5F9E]
                            "
                        />

                    </div>


                    {/* COLUMNS */}

                    <div
                        className="
                            grid
                            gap-6

                            lg:grid-cols-2
                        "
                    >

                        {/* LEFT */}

                        <div
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[24px]
                                border
                                border-[#DDE7EF]
                                bg-white
                                p-7
                                
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-[#A9CDE7]
                                hover:bg-white

                                sm:p-9
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
                                    border-[#C8DDEC]
                                    bg-[#EAF4FC]
                                    text-[#0A5F9E]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M5 6h14M5 12h9M5 18h11"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>


                            {description ? (
                                <p
                                    className="
                                        mt-6
                                        text-base
                                        leading-8
                                        text-[#5C6F82]
                                    "
                                >
                                    {description}
                                </p>
                            ) : (
                                <p
                                    className="
                                        mt-6
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Add a description from the CMS.
                                </p>
                            )}

                        </div>


                        {/* RIGHT */}

                        <div
                            className="
                                group
                                relative
                                overflow-hidden
                                rounded-[24px]
                                border
                                border-[#DDE7EF]
                                bg-white
                                p-7
                                
                                transition
                                duration-300

                                hover:-translate-y-1
                                hover:border-[#D8B5B8]
                                hover:bg-white

                                sm:p-9
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
                                    border-[#F1C8CB]
                                    bg-[#FFF0F1]
                                    text-[#D71920]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 5h16v14H4z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <path
                                        d="M8 9h8M8 13h8M8 17h5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>


                            {bodyText ? (
                                <div
                                    className="
                                        mt-6
                                        whitespace-pre-line
                                        text-base
                                        leading-8
                                        text-[#5C6F82]
                                    "
                                >
                                    {bodyText}
                                </div>
                            ) : (
                                <p
                                    className="
                                        mt-6
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Add body content from the CMS.
                                </p>
                            )}

                        </div>

                    </div>


                    {buttonText && (
                        <div className="mt-10 text-center">

                            <ContentButton
                                text={
                                    buttonText
                                }
                                url={
                                    buttonUrl
                                }
                            />

                        </div>
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
                relative
                overflow-hidden
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
                    max-w-5xl
                "
            >

                <div
                    className="
                        rounded-[24px]
                        border
                        border-[#DDE7EF]
                        bg-white
                        p-7
                        shadow-[0_14px_38px_rgba(11,45,77,0.07)]
                        

                        sm:p-9
                    "
                >

                    {title && (
                        <SectionLabel
                            title={title}
                        />
                    )}


                    <h2
                        className="
                            mt-5
                            text-3xl
                            font-bold
                            tracking-[-0.03em]
                            text-[#0B2D4D]

                            sm:text-4xl
                        "
                    >
                        {heading}
                    </h2>


                    {description && (
                        <p
                            className="
                                mt-6
                                text-base
                                leading-8
                                text-[#5C6F82]
                            "
                        >
                            {description}
                        </p>
                    )}


                    {bodyText && (
                        <div
                            className="
                                mt-6
                                whitespace-pre-line
                                text-base
                                leading-8
                                text-[#6E8192]
                            "
                        >
                            {bodyText}
                        </div>
                    )}


                    {buttonText && (
                        <div className="mt-8">

                            <ContentButton
                                text={
                                    buttonText
                                }
                                url={
                                    buttonUrl
                                }
                            />

                        </div>
                    )}

                </div>

            </div>

        </section>
    );
}