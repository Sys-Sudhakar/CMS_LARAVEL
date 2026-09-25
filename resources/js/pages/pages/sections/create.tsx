import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import { useState } from 'react';

import CMSLayout from '@/layouts/CMSLayout';


/* =========================================================
   TYPES
   ========================================================= */

interface Page {
    id: number;
    title: string;
    slug: string;
}


interface Media {
    id: number;
    name: string;
    file_name: string;
    file_path: string;
    mime_type: string | null;
    alt_text: string | null;
}


interface CreateSectionProps {
    page: Page;
    media: Media[];
}


type ContactVariant =
    | 'split'
    | 'form_only'
    | 'contact_details';


interface ContactContent {
    variant: ContactVariant;

    heading: string;
    description: string;

    office_address: string;
    phone: string;
    email: string;
    business_hours: string;

    whatsapp: string;
    whatsapp_text: string;

    form_title: string;
    form_description: string;

    show_full_name: boolean;
    show_email: boolean;
    show_company: boolean;
    show_phone: boolean;
    show_service_category: boolean;
    show_message: boolean;

    full_name_label: string;
    full_name_placeholder: string;

    email_label: string;
    email_placeholder: string;

    company_label: string;
    company_placeholder: string;

    phone_label: string;
    phone_placeholder: string;

    service_category_label: string;
    service_category_placeholder: string;

    message_label: string;
    message_placeholder: string;

    verification_label: string;
    privacy_text: string;

    button_text: string;
    success_message: string;

    service_options: string[];
}


type SectionTheme =
    | 'light'
    | 'dark';


type SectionType =
    | 'hero'
    | 'content'
    | 'cards'
    | 'grid'
    | 'about'
    | 'stats'
    | 'vision_mission'
    | 'certifications'
    | 'global_presence'
    | 'cta'
    | 'faq'
    | 'contact_form';


/* =========================================================
   HERO TYPES
   ========================================================= */

type HeroVariant =
    | 'simple'
    | 'carousel'
    | 'image'
    | 'video';


interface HeroSlide {
    heading: string;

    subheading: string;

    description: string;

    button_text: string;

    button_url: string;

    secondary_button_text: string;

    secondary_button_url: string;

    image: string;
}


interface HeroFormContent {
    variant: HeroVariant;

    heading: string;

    subheading: string;

    description: string;

    button_text: string;

    button_url: string;

    secondary_button_text: string;

    secondary_button_url: string;

    autoplay: boolean;

    interval: number;

    slides: HeroSlide[];
}


/* =========================================================
   DEFAULT HERO
   ========================================================= */

const defaultHeroContent: HeroFormContent = {
    variant: 'simple',

    heading: '',

    subheading: '',

    description: '',

    button_text: 'Learn More',

    button_url: '/contact',

    secondary_button_text: '',

    secondary_button_url: '',

    autoplay: true,

    interval: 5000,

    slides: [],
};


/* =========================================================
   DEFAULT HERO SLIDE
   ========================================================= */

const createEmptyHeroSlide = (): HeroSlide => ({
    heading: '',

    subheading: '',

    description: '',

    button_text: 'Learn More',

    button_url: '/contact',

    secondary_button_text: '',

    secondary_button_url: '',

    image: '',
});


/* =========================================================
   OTHER SECTION TYPES
   ========================================================= */

type StatsVariant =
    | 'cards'
    | 'counter'
    | 'highlight'
    | 'benefits'
    | 'kpi';

interface StatItem {
    value: string;
    label: string;
    suffix: string;
    icon: string;
    description: string;
    trend: string;
}

interface StatsContent {
    variant: StatsVariant;
    heading: string;
    description: string;
    items: StatItem[];
}


type AboutVariant =
    | 'image_left'
    | 'image_right'
    | 'carousel'
    | 'video'
    | 'highlights'
    | 'why_choose_us'
    | 'core_values';


interface AboutSlide {
    label: string;
    heading: string;
    description: string;

    image: string;

    button_text: string;
    button_url: string;

    highlights: string[];
}


interface AboutContent {
    variant: AboutVariant;

    label: string;
    heading: string;
    description: string;

    button_text: string;
    button_url: string;

    highlights: string[];

    autoplay: boolean;
    interval: number;

    slides: AboutSlide[];
}


type VisionVariant =
    | 'cards'
    | 'values'
    | 'principles';

interface VisionContent {
    variant: VisionVariant;
    heading: string;
    description: string;
    mission_title: string;
    mission: string;
    vision_title: string;
    vision: string;
    values: string[];
}


type CertificationsVariant =
    | 'grid'
    | 'carousel'
    | 'gallery';

interface CertificationItem {
    name: string;
    description: string;
    image: string;
    url: string;
    issuer: string;
    certificate_number: string;
    issued_date: string;
    document_url: string;
}

interface CertificationsContent {
    variant: CertificationsVariant;
    heading: string;
    description: string;
    items: CertificationItem[];
}


type GlobalPresenceVariant =
    | 'map'
    | 'offices'
    | 'map_offices';

interface OfficeItem {
    country: string;
    city: string;
    company: string;
    type: 'headquarters' | 'regional_office';
    latitude: string;
    longitude: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    map_url: string;
}

interface GlobalPresenceContent {
    variant: GlobalPresenceVariant;
    heading: string;
    description: string;
    offices: OfficeItem[];
}


type CtaVariant =
    | 'simple'
    | 'split'
    | 'background'
    | 'support'
    | 'contact';

interface CtaContent {
    variant: CtaVariant;
    heading: string;
    description: string;
    button_text: string;
    button_url: string;
    secondary_button_text: string;
    secondary_button_url: string;
}


type ContentVariant =
    | 'standard'
    | 'image_left'
    | 'image_right'
    | 'highlight'
    | 'two_column';

interface ContentSectionContent {
    variant: ContentVariant;
    heading: string;
    description: string;
    text: string;
    button_text: string;
    button_url: string;
}


type CardsVariant =
    | 'services'
    | 'solutions'
    | 'products'
    | 'features'
    | 'ai_solutions'
    | 'why_choose_us'
    | 'testimonials';

interface CardItem {
    title: string;
    description: string;
    image: string;
    icon: string;
    url: string;
    button_text: string;
    features: string[];
    badge: string;
    company: string;
    person_name: string;
    designation: string;
    logo: string;
    metric_value: string;
    metric_label: string;
}

interface CardsContent {
    variant: CardsVariant;
    heading: string;
    description: string;
    items: CardItem[];
}


type GridVariant =
    | 'images'
    | 'icons'
    | 'logos'
    | 'partners'
    | 'clients'
    | 'technology_partners';


interface GridItem {
    title: string;
    description: string;

    // CMS media-library image path
    image: string;

    // Optional direct/external image URL
    image_url: string;

    icon: string;

    // Website / destination URL
    url: string;

    category: string;
    badge: string;

    // Show / hide this individual grid item on the public website
    is_visible: boolean;
}



interface GridContent {
    variant: GridVariant;
    heading: string;
    description: string;
    items: GridItem[];
}


interface FaqItem {
    question: string;
    answer: string;
}

interface FaqContent {
    heading: string;
    description: string;
    items: FaqItem[];
}


/* =========================================================
   DEFAULT OTHER SECTION CONTENT
   ========================================================= */

const defaultStatsContent: StatsContent = {
    variant: 'counter',
    heading: 'Our Numbers',
    description: '',
    items: [],
};

const defaultAboutContent: AboutContent = {
    variant: 'image_left',

    label: 'About Us',
    heading: '',
    description: '',

    button_text: 'Learn More',
    button_url: '/about',

    highlights: [],

    autoplay: true,
    interval: 5200,

    slides: [],
};


/* =========================================================
   DEFAULT ABOUT CAROUSEL SLIDE
   ========================================================= */

const createEmptyAboutSlide = (): AboutSlide => ({
    label: 'Our Story',
    heading: '',
    description: '',

    image: '',

    button_text: 'Learn More',
    button_url: '/about',

    highlights: [],
});

const defaultVisionContent: VisionContent = {
    variant: 'cards',
    heading: 'Our Vision & Mission',
    description: '',
    mission_title: 'Our Mission',
    mission: '',
    vision_title: 'Our Vision',
    vision: '',
    values: [],
};

const defaultCertificationsContent: CertificationsContent = {
    variant: 'grid',
    heading: 'Certifications & Standards',
    description: '',
    items: [],
};

const defaultGlobalPresenceContent: GlobalPresenceContent = {
    variant: 'map_offices',
    heading: 'Our Global Presence',
    description: '',
    offices: [],
};

const defaultCtaContent: CtaContent = {
    variant: 'simple',
    heading: '',
    description: '',
    button_text: 'Contact Us',
    button_url: '/contact',
    secondary_button_text: '',
    secondary_button_url: '',
};

const defaultContentSection: ContentSectionContent = {
    variant: 'standard',
    heading: '',
    description: '',
    text: '',
    button_text: '',
    button_url: '',
};

const defaultCardsContent: CardsContent = {
    variant: 'services',
    heading: '',
    description: '',
    items: [],
};

const defaultGridContent: GridContent = {
    variant: 'images',
    heading: '',
    description: '',
    items: [],
};


const defaultFaqContent: FaqContent = {
    heading: 'Frequently Asked Questions',
    description: '',
    items: [],
};


const defaultContactContent: ContactContent = {
    variant: 'split',

    heading: "Let's Discuss Your IT Needs",
    description: '',

    office_address: '',
    phone: '',
    email: '',
    business_hours: '',

    whatsapp: '',
    whatsapp_text: 'Chat on WhatsApp',

    form_title: 'Send us a message',
    form_description: '',

    show_full_name: true,
    show_email: true,
    show_company: true,
    show_phone: true,
    show_service_category: true,
    show_message: true,

    full_name_label: 'Full Name',
    full_name_placeholder: 'Enter your full name',

    email_label: 'Email Address',
    email_placeholder: 'name@company.com',

    company_label: 'Company',
    company_placeholder: 'Company name',

    phone_label: 'Phone Number',
    phone_placeholder: '+65 1234 5678',

    service_category_label: 'Service Category',
    service_category_placeholder: 'Select a service',

    message_label: 'Message',
    message_placeholder: 'Tell us about your requirements...',

    verification_label: 'Human Verification',
    privacy_text:
        'By submitting this form, you agree to our privacy policy.',

    button_text: 'Send Message',
    success_message: '',

    service_options: [
        'IT Infrastructure',
        'Cybersecurity',
        'Cloud Services',
        'Managed Services',
        'Software Development',
        'Other',
    ],
};


/* =========================================================
   COMPONENT
   ========================================================= */








/* =========================================================
   COMPONENT
   ========================================================= */



/* =========================================================
   CONTACT TEXT INPUT
   ========================================================= */

function ContactTextInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {

    return (

        <div>

            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type="text"
                value={value}
                onChange={(e) =>
                    onChange(
                        e.target.value
                    )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
            />

        </div>

    );
}


export default function Create({
    page,
    media,
}: CreateSectionProps) {

    /* =====================================================
       NORMAL SECTION FORM
       ===================================================== */

    const {
        data,
        setData,
        post,
        transform,
        processing,
        errors,
    } = useForm<{
        type: SectionType;

        title: string;

        content: string;

        image: string;

        video_url: string;

        sort_order: number;

        status: 'active' | 'inactive';
    }>({
        type: 'hero',

        title: '',

        content: '',

        image: '',

        video_url: '',

        sort_order: 0,

        status: 'active',
    });


    /* =====================================================
       SECTION THEME
       ===================================================== */

    const [
        sectionTheme,
        setSectionTheme,
    ] = useState<SectionTheme>('dark');


    /* =====================================================
       HERO FORM STATE
       ===================================================== */

    const [
        heroContent,
        setHeroContent,
    ] = useState<HeroFormContent>(
        defaultHeroContent
    );


    /* =====================================================
    OTHER SECTION STATES
    ===================================================== */

    const [statsContent, setStatsContent] =
        useState<StatsContent>(
            defaultStatsContent
        );

    const [aboutContent, setAboutContent] =
        useState<AboutContent>(
            defaultAboutContent
        );

    const [visionContent, setVisionContent] =
        useState<VisionContent>(
            defaultVisionContent
        );

    const [
        certificationsContent,
        setCertificationsContent,
    ] = useState<CertificationsContent>(
        defaultCertificationsContent
    );

    const [
        globalPresenceContent,
        setGlobalPresenceContent,
    ] = useState<GlobalPresenceContent>(
        defaultGlobalPresenceContent
    );

    const [ctaContent, setCtaContent] =
        useState<CtaContent>(
            defaultCtaContent
        );

    const [
        contentSection,
        setContentSection,
    ] = useState<ContentSectionContent>(
        defaultContentSection
    );

    const [cardsContent, setCardsContent] =
        useState<CardsContent>(
            defaultCardsContent
        );

    const [gridContent, setGridContent] =
        useState<GridContent>(
            defaultGridContent
        );


    const [faqContent, setFaqContent] =
        useState<FaqContent>(
            defaultFaqContent
        );


    const [contactContent, setContactContent] =
        useState<ContactContent>(
            defaultContactContent
        );





    /* =====================================================
       UPDATE HERO FIELD
       ===================================================== */

    const updateHeroField = <
        K extends keyof HeroFormContent
    >(
        field: K,
        value: HeroFormContent[K]
    ) => {

        setHeroContent((previous) => ({
            ...previous,
            [field]: value,
        }));

    };


    /* =====================================================
       ADD HERO SLIDE
       ===================================================== */

    const addHeroSlide = () => {

        setHeroContent((previous) => ({
            ...previous,

            slides: [
                ...previous.slides,
                createEmptyHeroSlide(),
            ],
        }));

    };


    /* =====================================================
       UPDATE HERO SLIDE
       ===================================================== */

    const updateHeroSlide = (
        index: number,
        field: keyof HeroSlide,
        value: string
    ) => {

        setHeroContent((previous) => {

            const slides = [
                ...previous.slides,
            ];


            slides[index] = {
                ...slides[index],

                [field]: value,
            };


            return {
                ...previous,
                slides,
            };

        });

    };


    /* =====================================================
       REMOVE HERO SLIDE
       ===================================================== */

    const removeHeroSlide = (
        index: number
    ) => {

        setHeroContent((previous) => ({
            ...previous,

            slides:
                previous.slides.filter(
                    (_, slideIndex) =>
                        slideIndex !== index
                ),
        }));

    };


    /* =====================================================
       MOVE HERO SLIDE
       ===================================================== */

    const moveHeroSlide = (
        index: number,
        direction: 'up' | 'down'
    ) => {

        setHeroContent((previous) => {

            const slides = [
                ...previous.slides,
            ];


            const newIndex =
                direction === 'up'
                    ? index - 1
                    : index + 1;


            if (
                newIndex < 0 ||
                newIndex >= slides.length
            ) {
                return previous;
            }


            [
                slides[index],
                slides[newIndex],
            ] = [
                slides[newIndex],
                slides[index],
            ];


            return {
                ...previous,
                slides,
            };

        });

    };


    /* =====================================================
    STATISTICS HELPERS
    ===================================================== */

    const addStat = () => {

        setStatsContent((previous) => ({
            ...previous,

            items: [
                ...previous.items,

                {
                    value: '',
                    label: '',
                    suffix: '',
                    icon: '',
                    description: '',
                    trend: '',
                },
            ],
        }));

    };


    const updateStat = (
        index: number,
        field: keyof StatItem,
        value: string
    ) => {

        setStatsContent((previous) => {

            const items = [
                ...previous.items,
            ];

            items[index] = {
                ...items[index],
                [field]: value,
            };

            return {
                ...previous,
                items,
            };

        });

    };


    const removeStat = (
        index: number
    ) => {

        setStatsContent((previous) => ({
            ...previous,

            items:
                previous.items.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                ),
        }));

    };


    /* =====================================================
    ABOUT HELPERS
    ===================================================== */

    const addAboutHighlight = () => {

        setAboutContent((previous) => ({
            ...previous,

            highlights: [
                ...previous.highlights,
                '',
            ],
        }));

    };


    const updateAboutHighlight = (
        index: number,
        value: string
    ) => {

        setAboutContent((previous) => {

            const highlights = [
                ...previous.highlights,
            ];

            highlights[index] = value;

            return {
                ...previous,
                highlights,
            };

        });

    };


    const removeAboutHighlight = (
        index: number
    ) => {

        setAboutContent((previous) => ({
            ...previous,

            highlights:
                previous.highlights.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                ),
        }));

    };



    /* =====================================================
       ABOUT CAROUSEL HELPERS
       ===================================================== */

    const addAboutSlide = () => {

        setAboutContent((previous) => ({
            ...previous,

            slides: [
                ...previous.slides,
                createEmptyAboutSlide(),
            ],
        }));

    };


    const updateAboutSlide = (
        index: number,
        field: keyof AboutSlide,
        value: string | string[]
    ) => {

        setAboutContent((previous) => {

            const slides = [
                ...previous.slides,
            ];


            slides[index] = {
                ...slides[index],
                [field]: value,
            };


            return {
                ...previous,
                slides,
            };

        });

    };


    const removeAboutSlide = (
        index: number
    ) => {

        setAboutContent((previous) => ({
            ...previous,

            slides:
                previous.slides.filter(
                    (_, slideIndex) =>
                        slideIndex !== index
                ),
        }));

    };


    const moveAboutSlide = (
        index: number,
        direction: 'up' | 'down'
    ) => {

        setAboutContent((previous) => {

            const slides = [
                ...previous.slides,
            ];


            const newIndex =
                direction === 'up'
                    ? index - 1
                    : index + 1;


            if (
                newIndex < 0 ||
                newIndex >= slides.length
            ) {
                return previous;
            }


            [
                slides[index],
                slides[newIndex],
            ] = [
                slides[newIndex],
                slides[index],
            ];


            return {
                ...previous,
                slides,
            };

        });

    };


    /* =====================================================
    VISION / VALUES HELPERS
    ===================================================== */

    const addValue = () => {

        setVisionContent((previous) => ({
            ...previous,

            values: [
                ...previous.values,
                '',
            ],
        }));

    };


    const updateValue = (
        index: number,
        value: string
    ) => {

        setVisionContent((previous) => {

            const values = [
                ...previous.values,
            ];

            values[index] = value;

            return {
                ...previous,
                values,
            };

        });

    };


    const removeValue = (
        index: number
    ) => {

        setVisionContent((previous) => ({
            ...previous,

            values:
                previous.values.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                ),
        }));

    };


    /* =====================================================
    CERTIFICATION HELPERS
    ===================================================== */

    const addCertification = () => {

        setCertificationsContent(
            (previous) => ({
                ...previous,

                items: [
                    ...previous.items,

                    {
                        name: '',
                        description: '',
                        image: '',
                        url: '',
                        issuer: '',
                        certificate_number: '',
                        issued_date: '',
                        document_url: '',
                    },
                ],
            })
        );

    };


    const updateCertification = (
        index: number,
        field: keyof CertificationItem,
        value: string
    ) => {

        setCertificationsContent(
            (previous) => {

                const items = [
                    ...previous.items,
                ];

                items[index] = {
                    ...items[index],
                    [field]: value,
                };

                return {
                    ...previous,
                    items,
                };

            }
        );

    };


    const removeCertification = (
        index: number
    ) => {

        setCertificationsContent(
            (previous) => ({
                ...previous,

                items:
                    previous.items.filter(
                        (_, itemIndex) =>
                            itemIndex !== index
                    ),
            })
        );

    };


    /* =====================================================
    GLOBAL PRESENCE HELPERS
    ===================================================== */

    const addOffice = () => {

        setGlobalPresenceContent(
            (previous) => ({
                ...previous,

                offices: [
                    ...previous.offices,

                    {
                        country: '',
                        city: '',
                        company: '',
                        type: 'regional_office',
                        latitude: '',
                        longitude: '',
                        address: '',
                        phone: '',
                        email: '',
                        website: '',
                        map_url: '',
                    },
                ],
            })
        );

    };


    const updateOffice = (
        index: number,
        field: keyof OfficeItem,
        value: string
    ) => {

        setGlobalPresenceContent(
            (previous) => {

                const offices = [
                    ...previous.offices,
                ];

                offices[index] = {
                    ...offices[index],
                    [field]: value,
                };

                return {
                    ...previous,
                    offices,
                };

            }
        );

    };


    const removeOffice = (
        index: number
    ) => {

        setGlobalPresenceContent(
            (previous) => ({
                ...previous,

                offices:
                    previous.offices.filter(
                        (_, officeIndex) =>
                            officeIndex !== index
                    ),
            })
        );

    };


    /* =====================================================
    CARDS HELPERS
    ===================================================== */

    const addCard = () => {

        setCardsContent((previous) => ({
            ...previous,

            items: [
                ...previous.items,

                {
                    title: '',
                    description: '',
                    image: '',
                    icon: '',
                    url: '',
                    button_text:
                        'Learn More',
                    features: [],
                    badge: '',
                    company: '',
                    person_name: '',
                    designation: '',
                    logo: '',
                    metric_value: '',
                    metric_label: '',
                },
            ],
        }));

    };


    const updateCard = (
        index: number,
        field: keyof CardItem,
        value: string | string[]
    ) => {

        setCardsContent((previous) => {

            const items = [
                ...previous.items,
            ];

            items[index] = {
                ...items[index],
                [field]: value,
            };

            return {
                ...previous,
                items,
            };

        });

    };


    const removeCard = (
        index: number
    ) => {

        setCardsContent((previous) => ({
            ...previous,

            items:
                previous.items.filter(
                    (_, cardIndex) =>
                        cardIndex !== index
                ),
        }));

    };


    /* =====================================================
    GRID HELPERS
    ===================================================== */

    const addGridItem = () => {
        setGridContent((previous) => ({
            ...previous,

            items: [
                ...previous.items,

                {
                    title: '',
                    description: '',
                    image: '',
                    image_url: '',
                    icon: '',
                    url: '',
                    category: '',
                    badge: '',

                    // New items are shown by default
                    is_visible: true,
                },
            ],
        }));
    };


    const updateGridItem = (
        index: number,
        field: keyof GridItem,
        value: string | boolean
    ) => {
        setGridContent((previous) => {
            const items = [
                ...previous.items,
            ];

            items[index] = {
                ...items[index],
                [field]: value,
            };

            return {
                ...previous,
                items,
            };
        });
    };


    const removeGridItem = (
        index: number
    ) => {

        setGridContent((previous) => ({
            ...previous,

            items:
                previous.items.filter(
                    (_, gridIndex) =>
                        gridIndex !== index
                ),
        }));

    };


    /* =====================================================
       FAQ HELPERS
       ===================================================== */

    const addFaqItem = () => {

        setFaqContent((previous) => ({
            ...previous,

            items: [
                ...previous.items,
                {
                    question: '',
                    answer: '',
                },
            ],
        }));

    };


    const updateFaqItem = (
        index: number,
        field: keyof FaqItem,
        value: string
    ) => {

        setFaqContent((previous) => {

            const items = [
                ...previous.items,
            ];

            items[index] = {
                ...items[index],
                [field]: value,
            };

            return {
                ...previous,
                items,
            };

        });

    };


    const removeFaqItem = (
        index: number
    ) => {

        setFaqContent((previous) => ({
            ...previous,

            items:
                previous.items.filter(
                    (_, faqIndex) =>
                        faqIndex !== index
                ),
        }));

    };





    /* =====================================================
       SUBMIT
       ===================================================== */

    const submit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        let parsedContent: Record<
            string,
            unknown
        > = {};


        /* =================================================
        BUILD SECTION CONTENT
        ================================================= */

        switch (data.type) {

            case 'hero':

                parsedContent = {
                    ...heroContent,
                };

                break;


            case 'stats':

                parsedContent = {
                    ...statsContent,
                };

                break;


            case 'about':

                parsedContent = {
                    ...aboutContent,
                };

                break;


            case 'vision_mission':

                parsedContent = {
                    ...visionContent,
                };

                break;


            case 'certifications':

                parsedContent = {
                    ...certificationsContent,
                };

                break;


            case 'global_presence':

                parsedContent = {
                    ...globalPresenceContent,
                };

                break;


            case 'cta':

                parsedContent = {
                    ...ctaContent,
                };

                break;


            case 'content':

                parsedContent = {
                    ...contentSection,
                };

                break;


            case 'cards':

                parsedContent = {
                    ...cardsContent,
                };

                break;


            case 'grid':

                parsedContent = {
                    ...gridContent,
                };

                break;


            case 'faq':

                parsedContent = {
                    ...faqContent,
                };

                break;


            case 'contact_form':

                parsedContent = {
                    ...contactContent,
                    service_options:
                        contactContent.service_options
                            .map((item) => item.trim())
                            .filter(Boolean),
                };

                break;

        }


        


        /* =================================================
           VALIDATE CAROUSEL
           ================================================= */

        if (
            data.type === 'hero' &&
            heroContent.variant ===
                'carousel' &&
            heroContent.slides.length === 0
        ) {

            alert(
                'Please add at least one carousel slide.'
            );

            return;

        }


        /* =================================================
           VALIDATE ABOUT CAROUSEL
           ================================================= */

        if (
            data.type === 'about' &&
            aboutContent.variant ===
                'carousel'
        ) {

            const validAboutSlides =
                aboutContent.slides.filter(
                    (slide) =>
                        slide.heading.trim() !== '' ||
                        slide.description.trim() !== '' ||
                        slide.image.trim() !== ''
                );


            if (
                validAboutSlides.length === 0
            ) {

                alert(
                    'Please add at least one About carousel slide.'
                );

                return;

            }


            parsedContent = {
                ...aboutContent,

                slides:
                    validAboutSlides.map(
                        (slide) => ({
                            ...slide,

                            highlights:
                                slide.highlights
                                    .map(
                                        (item) =>
                                            item.trim()
                                    )
                                    .filter(Boolean),
                        })
                    ),
            };

        }


        /* =================================================
           VALIDATE FAQ
           ================================================= */

        if (data.type === 'faq') {

            const validFaqItems =
                faqContent.items.filter(
                    (item) =>
                        item.question.trim() !== '' &&
                        item.answer.trim() !== ''
                );

            if (validFaqItems.length === 0) {

                alert(
                    'Please add at least one complete FAQ question and answer.'
                );

                return;

            }

            parsedContent = {
                ...faqContent,
                items: validFaqItems,
            };

        }


        /* =================================================
           APPLY SECTION THEME
           -------------------------------------------------
           Stored inside the existing content JSON so no
           database migration / new column is required.
           ================================================= */

        parsedContent = {
            ...parsedContent,
            section_theme: sectionTheme,
        };


        /* =================================================
           TRANSFORM DATA
           ================================================= */

        transform((formData) => ({
            ...formData,

            content: parsedContent,

            image:
                formData.image ||
                null,

            video_url:
                formData.video_url ||
                null,
        }));


        post(
            `/admin/pages/${page.id}/sections`
        );

    };


    /* =====================================================
       SELECTED MAIN MEDIA
       ===================================================== */

    const selectedMedia =
        media.find(
            (item) =>
                item.file_path ===
                data.image
        );


    /* =====================================================
       UI
       ===================================================== */

    return (

        <CMSLayout>

            <Head
                title={`Add Section - ${page.title}`}
            />


            <div className="max-w-5xl space-y-6">


                {/* =================================================
                    HEADER
                ================================================== */}

                <div>

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Add Page Section
                    </h1>


                    <p className="mt-1 text-sm text-gray-600">

                        Add a new section to{' '}

                        <span className="font-medium">
                            {page.title}
                        </span>

                        .

                    </p>

                </div>


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
                >


                    {/* =================================================
                        SECTION TYPE
                    ================================================== */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700">
                            Section Type
                        </label>


                        <select
                            value={data.type}
                            onChange={(e) =>
                                setData(
                                    'type',
                                    e.target
                                        .value as SectionType
                                )
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >

                            <option value="hero">
                                Hero
                            </option>

                            <option value="stats">
                                Statistics
                            </option>

                            <option value="about">
                                About
                            </option>

                            <option value="vision_mission">
                                Vision & Mission
                            </option>

                            <option value="certifications">
                                Certifications
                            </option>

                            <option value="global_presence">
                                Global Presence
                            </option>

                            <option value="cta">
                                Call to Action
                            </option>

                            <option value="content">
                                Content
                            </option>

                            <option value="cards">
                                Cards
                            </option>

                            <option value="grid">
                                Grid
                            </option>

                            <option value="faq">
                                FAQ
                            </option>

                            <option value="contact_form">
                                Contact Form
                            </option>

                        </select>


                        {errors.type && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.type}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        SECTION THEME
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">

                        <div>

                            <label className="block text-sm font-semibold text-gray-900">
                                Section Theme
                            </label>

                            <p className="mt-1 text-sm text-gray-600">
                                Choose the background appearance for this individual public section.
                            </p>

                        </div>


                        <div className="mt-4 grid gap-4 md:grid-cols-2">

                            <button
                                type="button"
                                onClick={() =>
                                    setSectionTheme('light')
                                }
                                className={`
                                    relative
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    p-4
                                    text-left
                                    transition
                                    duration-200

                                    ${
                                        sectionTheme === 'light'
                                            ? 'border-blue-500 bg-white shadow-[0_8px_24px_rgba(37,99,235,0.10)] ring-2 ring-blue-100'
                                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`
                                            mt-0.5
                                            flex
                                            h-5
                                            w-5
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border

                                            ${
                                                sectionTheme === 'light'
                                                    ? 'border-blue-600 bg-blue-600'
                                                    : 'border-gray-300 bg-white'
                                            }
                                        `}
                                    >
                                        {sectionTheme === 'light' && (
                                            <span className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </span>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Light Theme
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-gray-500">
                                            Clean white / light background for bright content sections.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
                                    <div className="h-2 bg-blue-600" />

                                    <div className="space-y-2 p-4">
                                        <div className="h-2 w-24 rounded-full bg-slate-800" />
                                        <div className="h-1.5 w-full rounded-full bg-slate-200" />
                                        <div className="h-1.5 w-4/5 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    setSectionTheme('dark')
                                }
                                className={`
                                    relative
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    p-4
                                    text-left
                                    transition
                                    duration-200

                                    ${
                                        sectionTheme === 'dark'
                                            ? 'border-blue-500 bg-white shadow-[0_8px_24px_rgba(37,99,235,0.10)] ring-2 ring-blue-100'
                                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`
                                            mt-0.5
                                            flex
                                            h-5
                                            w-5
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border

                                            ${
                                                sectionTheme === 'dark'
                                                    ? 'border-blue-600 bg-blue-600'
                                                    : 'border-gray-300 bg-white'
                                            }
                                        `}
                                    >
                                        {sectionTheme === 'dark' && (
                                            <span className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </span>

                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Dark Animated Theme
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-gray-500">
                                            Uses the current SYSNET animated technology background.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative mt-4 overflow-hidden rounded-lg border border-slate-700 bg-[#04111C]">
                                    <div className="absolute -left-6 top-2 h-16 w-16 rounded-full bg-blue-500/20 blur-xl" />
                                    <div className="absolute -right-4 bottom-0 h-14 w-14 rounded-full bg-red-500/15 blur-xl" />

                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            opacity-25
                                            [background-image:linear-gradient(rgba(96,165,250,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.18)_1px,transparent_1px)]
                                            [background-size:18px_18px]
                                        "
                                    />

                                    <div className="relative space-y-2 p-4">
                                        <div className="h-2 w-24 rounded-full bg-white/90" />
                                        <div className="h-1.5 w-full rounded-full bg-white/20" />
                                        <div className="h-1.5 w-4/5 rounded-full bg-white/15" />
                                    </div>
                                </div>
                            </button>

                        </div>


                        <p className="mt-3 text-xs text-gray-500">
                            This setting affects only this section. The public header and CMS theme are not changed.
                        </p>

                    </div>


                    {/* =================================================
                        SECTION TITLE
                    ================================================== */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700">
                            Section Title
                        </label>


                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) =>
                                setData(
                                    'title',
                                    e.target.value
                                )
                            }
                            placeholder="Enter section title"
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        />


                        {errors.title && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        HERO CONFIGURATION
                    ================================================== */}

                    {data.type === 'hero' && (

                        <div className="space-y-6 rounded-xl border border-blue-200 bg-blue-50/40 p-5">


                            <div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Hero Configuration
                                </h2>


                                <p className="mt-1 text-sm text-gray-600">
                                    Select how this hero section should appear on the public website.
                                </p>

                            </div>


                            {/* Hero Style */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Hero Style
                                </label>


                                <select
                                    value={
                                        heroContent.variant
                                    }
                                    onChange={(e) =>
                                        updateHeroField(
                                            'variant',
                                            e.target
                                                .value as HeroVariant
                                        )
                                    }
                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                >

                                    <option value="simple">
                                        Simple Hero
                                    </option>

                                    <option value="carousel">
                                        Hero Carousel
                                    </option>

                                    <option value="image">
                                        Hero With Image
                                    </option>

                                    <option value="video">
                                        Hero With Video
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                NON-CAROUSEL HERO
                            ================================================== */}

                            {heroContent.variant !==
                                'carousel' && (

                                <div className="space-y-5">


                                    {/* Subheading */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700">
                                            Small Heading / Label
                                        </label>


                                        <input
                                            type="text"
                                            value={
                                                heroContent.subheading
                                            }
                                            onChange={(e) =>
                                                updateHeroField(
                                                    'subheading',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Technology Solutions"
                                            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                        />

                                    </div>


                                    {/* Main Heading */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700">
                                            Hero Heading
                                        </label>


                                        <input
                                            type="text"
                                            value={
                                                heroContent.heading
                                            }
                                            onChange={(e) =>
                                                updateHeroField(
                                                    'heading',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Empowering Businesses Since 2004"
                                            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                        />

                                    </div>


                                    {/* Description */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700">
                                            Hero Description
                                        </label>


                                        <textarea
                                            rows={4}
                                            value={
                                                heroContent.description
                                            }
                                            onChange={(e) =>
                                                updateHeroField(
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter hero description..."
                                            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                                        />

                                    </div>


                                    {/* Primary Button */}

                                    <div className="grid gap-5 md:grid-cols-2">

                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Primary Button Text
                                            </label>


                                            <input
                                                type="text"
                                                value={
                                                    heroContent.button_text
                                                }
                                                onChange={(e) =>
                                                    updateHeroField(
                                                        'button_text',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Learn More"
                                                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Primary Button URL
                                            </label>


                                            <input
                                                type="text"
                                                value={
                                                    heroContent.button_url
                                                }
                                                onChange={(e) =>
                                                    updateHeroField(
                                                        'button_url',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="/contact"
                                                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                            />

                                        </div>

                                    </div>


                                    {/* Secondary Button */}

                                    <div className="grid gap-5 md:grid-cols-2">

                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Secondary Button Text
                                            </label>


                                            <input
                                                type="text"
                                                value={
                                                    heroContent.secondary_button_text
                                                }
                                                onChange={(e) =>
                                                    updateHeroField(
                                                        'secondary_button_text',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Our Solutions"
                                                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Secondary Button URL
                                            </label>


                                            <input
                                                type="text"
                                                value={
                                                    heroContent.secondary_button_url
                                                }
                                                onChange={(e) =>
                                                    updateHeroField(
                                                        'secondary_button_url',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="/solutions"
                                                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                CAROUSEL
                            ================================================== */}

                            {heroContent.variant ===
                                'carousel' && (

                                <div className="space-y-6">


                                    {/* Carousel Settings */}

                                    <div className="rounded-lg border border-gray-200 bg-white p-4">

                                        <h3 className="font-semibold text-gray-900">
                                            Carousel Settings
                                        </h3>


                                        <div className="mt-4 grid gap-5 md:grid-cols-2">


                                            <div>

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Slide Interval
                                                </label>


                                                <select
                                                    value={
                                                        heroContent.interval
                                                    }
                                                    onChange={(e) =>
                                                        updateHeroField(
                                                            'interval',
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                >

                                                    <option value={3000}>
                                                        3 Seconds
                                                    </option>

                                                    <option value={5000}>
                                                        5 Seconds
                                                    </option>

                                                    <option value={7000}>
                                                        7 Seconds
                                                    </option>

                                                    <option value={10000}>
                                                        10 Seconds
                                                    </option>

                                                </select>

                                            </div>


                                            <div>

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Autoplay
                                                </label>


                                                <select
                                                    value={
                                                        heroContent.autoplay
                                                            ? 'yes'
                                                            : 'no'
                                                    }
                                                    onChange={(e) =>
                                                        updateHeroField(
                                                            'autoplay',
                                                            e.target.value ===
                                                                'yes'
                                                        )
                                                    }
                                                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                >

                                                    <option value="yes">
                                                        Yes
                                                    </option>

                                                    <option value="no">
                                                        No
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Add Slide */}

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <h3 className="font-semibold text-gray-900">
                                                Carousel Slides
                                            </h3>


                                            <p className="mt-1 text-sm text-gray-500">
                                                Add multiple hero slides with different images and content.
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={
                                                addHeroSlide
                                            }
                                            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                                        >
                                            + Add Slide
                                        </button>

                                    </div>


                                    {/* Slides */}

                                    {heroContent.slides.length ===
                                        0 && (

                                        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 text-center">

                                            <p className="text-sm font-medium text-gray-700">
                                                No carousel slides added yet.
                                            </p>


                                            <p className="mt-1 text-xs text-gray-500">
                                                Click "Add Slide" to create your first slide.
                                            </p>

                                        </div>

                                    )}


                                    {heroContent.slides.map(
                                        (
                                            slide,
                                            index
                                        ) => {

                                            const selectedSlideMedia =
                                                media.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item.file_path ===
                                                        slide.image
                                                );


                                            return (

                                                <div
                                                    key={
                                                        index
                                                    }
                                                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                                >


                                                    {/* Slide Header */}

                                                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                                                        <h4 className="font-semibold text-gray-900">
                                                            Slide{' '}
                                                            {index +
                                                                1}
                                                        </h4>


                                                        <div className="flex gap-2">

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    index ===
                                                                    0
                                                                }
                                                                onClick={() =>
                                                                    moveHeroSlide(
                                                                        index,
                                                                        'up'
                                                                    )
                                                                }
                                                                className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-40"
                                                            >
                                                                ↑ Up
                                                            </button>


                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    index ===
                                                                    heroContent
                                                                        .slides
                                                                        .length -
                                                                        1
                                                                }
                                                                onClick={() =>
                                                                    moveHeroSlide(
                                                                        index,
                                                                        'down'
                                                                    )
                                                                }
                                                                className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-40"
                                                            >
                                                                ↓ Down
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeHeroSlide(
                                                                        index
                                                                    )
                                                                }
                                                                className="rounded border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>


                                                    {/* Subheading */}

                                                    <div>

                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Small Heading / Label
                                                        </label>


                                                        <input
                                                            type="text"
                                                            value={
                                                                slide.subheading
                                                            }
                                                            onChange={(e) =>
                                                                updateHeroSlide(
                                                                    index,
                                                                    'subheading',
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Enterprise Technology Solutions"
                                                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                        />

                                                    </div>


                                                    {/* Heading */}

                                                    <div className="mt-4">

                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Slide Heading
                                                        </label>


                                                        <input
                                                            type="text"
                                                            value={
                                                                slide.heading
                                                            }
                                                            onChange={(e) =>
                                                                updateHeroSlide(
                                                                    index,
                                                                    'heading',
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Transform Your Business With Technology"
                                                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                        />

                                                    </div>


                                                    {/* Description */}

                                                    <div className="mt-4">

                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Description
                                                        </label>


                                                        <textarea
                                                            rows={
                                                                3
                                                            }
                                                            value={
                                                                slide.description
                                                            }
                                                            onChange={(e) =>
                                                                updateHeroSlide(
                                                                    index,
                                                                    'description',
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Enter slide description..."
                                                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                                        />

                                                    </div>


                                                    {/* Image */}

                                                    <div className="mt-4">

                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Background Image
                                                        </label>


                                                        <select
                                                            value={
                                                                slide.image
                                                            }
                                                            onChange={(e) =>
                                                                updateHeroSlide(
                                                                    index,
                                                                    'image',
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                        >

                                                            <option value="">
                                                                No Image
                                                            </option>


                                                            {media.map(
                                                                (
                                                                    item
                                                                ) => (

                                                                    <option
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={
                                                                            item.file_path
                                                                        }
                                                                    >
                                                                        {
                                                                            item.file_name
                                                                        }
                                                                    </option>

                                                                )
                                                            )}

                                                        </select>


                                                        {selectedSlideMedia && (

                                                            <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">

                                                                <img
                                                                    src={`/storage/${selectedSlideMedia.file_path}`}
                                                                    alt={
                                                                        selectedSlideMedia.alt_text ||
                                                                        selectedSlideMedia.file_name
                                                                    }
                                                                    className="max-h-52 w-full rounded-md object-cover"
                                                                />

                                                            </div>

                                                        )}

                                                    </div>


                                                    {/* Primary Button */}

                                                    <div className="mt-4 grid gap-4 md:grid-cols-2">

                                                        <div>

                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Primary Button Text
                                                            </label>


                                                            <input
                                                                type="text"
                                                                value={
                                                                    slide.button_text
                                                                }
                                                                onChange={(e) =>
                                                                    updateHeroSlide(
                                                                        index,
                                                                        'button_text',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Learn More"
                                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                            />

                                                        </div>


                                                        <div>

                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Primary Button URL
                                                            </label>


                                                            <input
                                                                type="text"
                                                                value={
                                                                    slide.button_url
                                                                }
                                                                onChange={(e) =>
                                                                    updateHeroSlide(
                                                                        index,
                                                                        'button_url',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="/contact"
                                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                            />

                                                        </div>

                                                    </div>


                                                    {/* Secondary Button */}

                                                    <div className="mt-4 grid gap-4 md:grid-cols-2">

                                                        <div>

                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Secondary Button Text
                                                            </label>


                                                            <input
                                                                type="text"
                                                                value={
                                                                    slide.secondary_button_text
                                                                }
                                                                onChange={(e) =>
                                                                    updateHeroSlide(
                                                                        index,
                                                                        'secondary_button_text',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Our Solutions"
                                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                            />

                                                        </div>


                                                        <div>

                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Secondary Button URL
                                                            </label>


                                                            <input
                                                                type="text"
                                                                value={
                                                                    slide.secondary_button_url
                                                                }
                                                                onChange={(e) =>
                                                                    updateHeroSlide(
                                                                        index,
                                                                        'secondary_button_url',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="/solutions"
                                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                            />

                                                        </div>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        NORMAL CONTENT JSON
                        HIDE FOR HERO
                    ================================================== */}

                    {/* =================================================
                        STATISTICS CONFIGURATION
                    ================================================== */}

                    {data.type === 'stats' && (

                        <div className="space-y-6 rounded-xl border border-purple-200 bg-purple-50/30 p-5">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    Statistics Configuration
                                </h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Configure counters and company statistics.
                                </p>

                            </div>


                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Statistics Style
                                </label>

                                <select
                                    value={statsContent.variant}
                                    onChange={(e) =>
                                        setStatsContent({
                                            ...statsContent,

                                            variant:
                                                e.target
                                                    .value as StatsVariant,
                                        })
                                    }
                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                >

                                    <option value="counter">
                                        Counter Statistics
                                    </option>

                                    <option value="cards">
                                        Statistics Cards
                                    </option>

                                    <option value="highlight">
                                        Highlight Statistics
                                    </option>

                                    <option value="benefits">
                                        Benefits / Improvement Metrics
                                    </option>

                                    <option value="kpi">
                                        KPI Metrics
                                    </option>

                                </select>

                            </div>


                            <input
                                type="text"
                                value={statsContent.heading}
                                onChange={(e) =>
                                    setStatsContent({
                                        ...statsContent,
                                        heading:
                                            e.target.value,
                                    })
                                }
                                placeholder="Our Numbers"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            />


                            <textarea
                                rows={3}
                                value={statsContent.description}
                                onChange={(e) =>
                                    setStatsContent({
                                        ...statsContent,

                                        description:
                                            e.target.value,
                                    })
                                }
                                placeholder="Statistics description..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />


                            <div className="flex items-center justify-between">

                                <h3 className="font-semibold text-gray-900">
                                    Statistics
                                </h3>

                                <button
                                    type="button"
                                    onClick={addStat}
                                    className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                                >
                                    + Add Statistic
                                </button>

                            </div>


                            {statsContent.items.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="rounded-lg border border-gray-200 bg-white p-4"
                                    >

                                        <div className="grid gap-4 md:grid-cols-4">

                                            <input
                                                value={item.value}
                                                onChange={(e) =>
                                                    updateStat(
                                                        index,
                                                        'value',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="20"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.suffix}
                                                onChange={(e) =>
                                                    updateStat(
                                                        index,
                                                        'suffix',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="+"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.label}
                                                onChange={(e) =>
                                                    updateStat(
                                                        index,
                                                        'label',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Years Experience"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.icon}
                                                onChange={(e) =>
                                                    updateStat(
                                                        index,
                                                        'icon',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Icon / Emoji e.g. 🌐"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                        </div>

                                        <div className="mt-4 grid gap-4 md:grid-cols-2">

                                            <input
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateStat(
                                                        index,
                                                        'description',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Optional metric description"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.trend}
                                                onChange={(e) =>
                                                    updateStat(
                                                        index,
                                                        'trend',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Optional trend e.g. Improved"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeStat(index)
                                            }
                                            className="mt-3 text-sm font-medium text-red-600"
                                        >
                                            Delete Statistic
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                    {/* =================================================
                        ABOUT CONFIGURATION
                    ================================================== */}

                    {data.type === 'about' && (

                        <div className="space-y-6 rounded-xl border border-blue-200 bg-blue-50/30 p-5">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    About Configuration
                                </h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Configure a static About section or create a unique editorial About carousel.
                                </p>

                            </div>


                            {/* =================================================
                                ABOUT STYLE
                            ================================================== */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700">
                                    About Style
                                </label>

                                <select
                                    value={aboutContent.variant}
                                    onChange={(e) =>
                                        setAboutContent({
                                            ...aboutContent,

                                            variant:
                                                e.target
                                                    .value as AboutVariant,
                                        })
                                    }
                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                >

                                    <option value="image_left">
                                        Image Left
                                    </option>

                                    <option value="image_right">
                                        Image Right
                                    </option>

                                    <option value="carousel">
                                        About Story Carousel
                                    </option>

                                    <option value="video">
                                        Video
                                    </option>

                                    <option value="highlights">
                                        About + Highlights
                                    </option>

                                    <option value="why_choose_us">
                                        Why Choose Us
                                    </option>

                                    <option value="core_values">
                                        Core Values
                                    </option>

                                </select>

                                <p className="mt-2 text-xs text-gray-500">
                                    About Story Carousel creates a rotating company-story section with independent content, images, highlights and buttons for every slide.
                                </p>

                            </div>


                            {/* =================================================
                                ABOUT CAROUSEL
                            ================================================== */}

                            {aboutContent.variant === 'carousel' ? (

                                <div className="space-y-6">

                                    {/* Carousel settings */}

                                    <div className="rounded-xl border border-blue-200 bg-white p-5">

                                        <div>

                                            <h3 className="font-semibold text-gray-900">
                                                About Carousel Settings
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Configure how the company-story carousel moves on the public website.
                                            </p>

                                        </div>


                                        <div className="mt-5 grid gap-5 md:grid-cols-2">

                                            <div>

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Autoplay
                                                </label>

                                                <select
                                                    value={
                                                        aboutContent.autoplay
                                                            ? 'yes'
                                                            : 'no'
                                                    }
                                                    onChange={(e) =>
                                                        setAboutContent({
                                                            ...aboutContent,

                                                            autoplay:
                                                                e.target.value ===
                                                                'yes',
                                                        })
                                                    }
                                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                                >

                                                    <option value="yes">
                                                        Yes
                                                    </option>

                                                    <option value="no">
                                                        No
                                                    </option>

                                                </select>

                                            </div>


                                            <div>

                                                <label className="block text-sm font-medium text-gray-700">
                                                    Slide Interval
                                                </label>

                                                <select
                                                    value={
                                                        aboutContent.interval
                                                    }
                                                    onChange={(e) =>
                                                        setAboutContent({
                                                            ...aboutContent,

                                                            interval:
                                                                Number(
                                                                    e.target.value
                                                                ),
                                                        })
                                                    }
                                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                                >

                                                    <option value={3500}>
                                                        3.5 Seconds
                                                    </option>

                                                    <option value={5200}>
                                                        5.2 Seconds
                                                    </option>

                                                    <option value={7000}>
                                                        7 Seconds
                                                    </option>

                                                    <option value={10000}>
                                                        10 Seconds
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Slides heading */}

                                    <div className="flex flex-wrap items-center justify-between gap-3">

                                        <div>

                                            <h3 className="font-semibold text-gray-900">
                                                About Carousel Slides
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Each slide can tell a separate part of the Sysnet story.
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            onClick={addAboutSlide}
                                            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                                        >
                                            + Add About Slide
                                        </button>

                                    </div>


                                    {/* Empty state */}

                                    {aboutContent.slides.length === 0 && (

                                        <div className="rounded-xl border border-dashed border-blue-200 bg-white px-6 py-10 text-center">

                                            <p className="text-sm font-semibold text-gray-700">
                                                No About carousel slides added yet.
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Click "Add About Slide" to create your first company-story slide.
                                            </p>

                                        </div>

                                    )}


                                    {/* Slides */}

                                    {aboutContent.slides.map(
                                        (
                                            slide,
                                            index
                                        ) => {

                                            const selectedAboutSlideMedia =
                                                media.find(
                                                    (
                                                        item
                                                    ) =>
                                                        item.file_path ===
                                                        slide.image
                                                );


                                            return (

                                                <div
                                                    key={index}
                                                    className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm"
                                                >

                                                    {/* Slide header */}

                                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4">

                                                        <div>

                                                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                                                About Story
                                                            </p>

                                                            <h4 className="mt-1 font-semibold text-gray-900">
                                                                Slide{' '}
                                                                {index + 1}
                                                            </h4>

                                                        </div>


                                                        <div className="flex flex-wrap gap-2">

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    index ===
                                                                    0
                                                                }
                                                                onClick={() =>
                                                                    moveAboutSlide(
                                                                        index,
                                                                        'up'
                                                                    )
                                                                }
                                                                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs disabled:opacity-40"
                                                            >
                                                                ↑ Up
                                                            </button>


                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    index ===
                                                                    aboutContent
                                                                        .slides
                                                                        .length -
                                                                        1
                                                                }
                                                                onClick={() =>
                                                                    moveAboutSlide(
                                                                        index,
                                                                        'down'
                                                                    )
                                                                }
                                                                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs disabled:opacity-40"
                                                            >
                                                                ↓ Down
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeAboutSlide(
                                                                        index
                                                                    )
                                                                }
                                                                className="rounded border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>


                                                    <div className="space-y-5 p-5">

                                                        {/* Label + heading */}

                                                        <div className="grid gap-5 md:grid-cols-2">

                                                            <div>

                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Slide Label / Chapter
                                                                </label>

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        slide.label
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateAboutSlide(
                                                                            index,
                                                                            'label',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Our Story"
                                                                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                                />

                                                            </div>


                                                            <div>

                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Slide Heading
                                                                </label>

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        slide.heading
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateAboutSlide(
                                                                            index,
                                                                            'heading',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Singapore's Technology Partner"
                                                                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                                />

                                                            </div>

                                                        </div>


                                                        {/* Description */}

                                                        <div>

                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Description
                                                            </label>

                                                            <textarea
                                                                rows={4}
                                                                value={
                                                                    slide.description
                                                                }
                                                                onChange={(e) =>
                                                                    updateAboutSlide(
                                                                        index,
                                                                        'description',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Tell this chapter of your company story..."
                                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                                            />

                                                        </div>


                                                        {/* Image */}

                                                        <div>

                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Slide Image
                                                            </label>

                                                            <select
                                                                value={
                                                                    slide.image
                                                                }
                                                                onChange={(e) =>
                                                                    updateAboutSlide(
                                                                        index,
                                                                        'image',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                            >

                                                                <option value="">
                                                                    No Image
                                                                </option>


                                                                {media.map(
                                                                    (
                                                                        item
                                                                    ) => (

                                                                        <option
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            value={
                                                                                item.file_path
                                                                            }
                                                                        >
                                                                            {
                                                                                item.file_name
                                                                            }
                                                                        </option>

                                                                    )
                                                                )}

                                                            </select>


                                                            {selectedAboutSlideMedia && (

                                                                <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">

                                                                    <img
                                                                        src={`/storage/${selectedAboutSlideMedia.file_path}`}
                                                                        alt={
                                                                            selectedAboutSlideMedia.alt_text ||
                                                                            selectedAboutSlideMedia.file_name
                                                                        }
                                                                        className="max-h-56 w-full rounded-lg object-cover"
                                                                    />

                                                                </div>

                                                            )}

                                                        </div>


                                                        {/* Highlights */}

                                                        <div>

                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Slide Highlights
                                                            </label>

                                                            <textarea
                                                                rows={4}
                                                                value={
                                                                    slide.highlights.join(
                                                                        '\n'
                                                                    )
                                                                }
                                                                onChange={(e) =>
                                                                    updateAboutSlide(
                                                                        index,
                                                                        'highlights',
                                                                        e.target.value
                                                                            .split(
                                                                                '\n'
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    item
                                                                                ) =>
                                                                                    item.trim()
                                                                            )
                                                                            .filter(
                                                                                Boolean
                                                                            )
                                                                    )
                                                                }
                                                                placeholder={`Enterprise technology expertise
Regional delivery capabilities
Long-term customer relationships`}
                                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                                            />

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Enter one highlight per line.
                                                            </p>

                                                        </div>


                                                        {/* Button */}

                                                        <div className="grid gap-5 md:grid-cols-2">

                                                            <div>

                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Button Text
                                                                </label>

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        slide.button_text
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateAboutSlide(
                                                                            index,
                                                                            'button_text',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Learn More"
                                                                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                                />

                                                            </div>


                                                            <div>

                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Button URL
                                                                </label>

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        slide.button_url
                                                                    }
                                                                    onChange={(e) =>
                                                                        updateAboutSlide(
                                                                            index,
                                                                            'button_url',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="/about"
                                                                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                                                />

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            ) : (

                                /* =================================================
                                    NON-CAROUSEL ABOUT
                                ================================================== */

                                <div className="space-y-6">

                                    <input
                                        value={aboutContent.label}
                                        onChange={(e) =>
                                            setAboutContent({
                                                ...aboutContent,
                                                label: e.target.value,
                                            })
                                        }
                                        placeholder="ABOUT SYSNET"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                    />


                                    <input
                                        value={aboutContent.heading}
                                        onChange={(e) =>
                                            setAboutContent({
                                                ...aboutContent,

                                                heading:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="About Sysnet"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                    />


                                    <textarea
                                        rows={5}
                                        value={aboutContent.description}
                                        onChange={(e) =>
                                            setAboutContent({
                                                ...aboutContent,

                                                description:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="About description..."
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                                    />


                                    <div className="grid gap-4 md:grid-cols-2">

                                        <input
                                            value={aboutContent.button_text}
                                            onChange={(e) =>
                                                setAboutContent({
                                                    ...aboutContent,

                                                    button_text:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="Learn More"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                        />


                                        <input
                                            value={aboutContent.button_url}
                                            onChange={(e) =>
                                                setAboutContent({
                                                    ...aboutContent,

                                                    button_url:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="/about"
                                            className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                        />

                                    </div>


                                    <div className="flex items-center justify-between">

                                        <h3 className="font-semibold">
                                            Highlights
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={
                                                addAboutHighlight
                                            }
                                            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                                        >
                                            + Add Highlight
                                        </button>

                                    </div>


                                    {aboutContent.highlights.map(
                                        (highlight, index) => (

                                            <div
                                                key={index}
                                                className="flex gap-3"
                                            >

                                                <input
                                                    value={highlight}
                                                    onChange={(e) =>
                                                        updateAboutHighlight(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="24/7 Support"
                                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                                                />


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAboutHighlight(
                                                            index
                                                        )
                                                    }
                                                    className="text-sm text-red-600"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        VISION & MISSION CONFIGURATION
                    ================================================== */}

                    {data.type === 'vision_mission' && (

                        <div className="space-y-6 rounded-xl border border-amber-200 bg-amber-50/30 p-5">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Vision & Mission Configuration
                            </h2>


                            <select
                                value={visionContent.variant}
                                onChange={(e) =>
                                    setVisionContent({
                                        ...visionContent,

                                        variant:
                                            e.target
                                                .value as VisionVariant,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            >

                                <option value="cards">
                                    Vision & Mission Cards
                                </option>

                                <option value="values">
                                    Vision + Mission + Values
                                </option>

                                <option value="principles">
                                    Principles / Core Values
                                </option>

                            </select>


                            <input
                                value={visionContent.heading}
                                onChange={(e) =>
                                    setVisionContent({
                                        ...visionContent,

                                        heading:
                                            e.target.value,
                                    })
                                }
                                placeholder="Our Vision & Mission"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            />


                            <textarea
                                rows={3}
                                value={visionContent.description}
                                onChange={(e) =>
                                    setVisionContent({
                                        ...visionContent,

                                        description:
                                            e.target.value,
                                    })
                                }
                                placeholder="Section description..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />


                            <div className="grid gap-6 md:grid-cols-2">

                                <div>

                                    <label className="text-sm font-medium">
                                        Mission
                                    </label>

                                    <input
                                        value={
                                            visionContent.mission_title
                                        }
                                        onChange={(e) =>
                                            setVisionContent({
                                                ...visionContent,

                                                mission_title:
                                                    e.target.value,
                                            })
                                        }
                                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />

                                    <textarea
                                        rows={5}
                                        value={visionContent.mission}
                                        onChange={(e) =>
                                            setVisionContent({
                                                ...visionContent,

                                                mission:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="Mission description..."
                                        className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3"
                                    />

                                </div>


                                <div>

                                    <label className="text-sm font-medium">
                                        Vision
                                    </label>

                                    <input
                                        value={
                                            visionContent.vision_title
                                        }
                                        onChange={(e) =>
                                            setVisionContent({
                                                ...visionContent,

                                                vision_title:
                                                    e.target.value,
                                            })
                                        }
                                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />

                                    <textarea
                                        rows={5}
                                        value={visionContent.vision}
                                        onChange={(e) =>
                                            setVisionContent({
                                                ...visionContent,

                                                vision:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="Vision description..."
                                        className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3"
                                    />

                                </div>

                            </div>


                            {(visionContent.variant ===
                                'values' ||
                                visionContent.variant ===
                                    'principles') && (

                                <div className="space-y-3">

                                    <div className="flex justify-between">

                                        <h3 className="font-semibold">
                                            Core Values
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={addValue}
                                            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                                        >
                                            + Add Value
                                        </button>

                                    </div>


                                    {visionContent.values.map(
                                        (value, index) => (

                                            <div
                                                key={index}
                                                className="flex gap-3"
                                            >

                                                <input
                                                    value={value}
                                                    onChange={(e) =>
                                                        updateValue(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Innovation"
                                                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeValue(index)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        CERTIFICATIONS CONFIGURATION
                    ================================================== */}

                    {data.type === 'certifications' && (

                        <div className="space-y-6 rounded-xl border border-green-200 bg-green-50/30 p-5">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Certifications Configuration
                            </h2>


                            <select
                                value={
                                    certificationsContent.variant
                                }
                                onChange={(e) =>
                                    setCertificationsContent({
                                        ...certificationsContent,

                                        variant:
                                            e.target
                                                .value as CertificationsVariant,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            >

                                <option value="grid">
                                    Certification Grid
                                </option>

                                <option value="carousel">
                                    Certification Carousel
                                </option>

                                <option value="gallery">
                                    Certificate Gallery / Lightbox
                                </option>

                            </select>


                            <input
                                value={
                                    certificationsContent.heading
                                }
                                onChange={(e) =>
                                    setCertificationsContent({
                                        ...certificationsContent,

                                        heading:
                                            e.target.value,
                                    })
                                }
                                placeholder="Certifications & Standards"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            />


                            <textarea
                                value={
                                    certificationsContent.description
                                }
                                onChange={(e) =>
                                    setCertificationsContent({
                                        ...certificationsContent,

                                        description:
                                            e.target.value,
                                    })
                                }
                                placeholder="Section description..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />


                            <button
                                type="button"
                                onClick={addCertification}
                                className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                            >
                                + Add Certification
                            </button>


                            {certificationsContent.items.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="space-y-4 rounded-lg border border-gray-200 bg-white p-4"
                                    >

                                        <input
                                            value={item.name}
                                            onChange={(e) =>
                                                updateCertification(
                                                    index,
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="ISO 27001"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                        />


                                        <div className="grid gap-4 md:grid-cols-2">

                                            <input
                                                value={item.issuer}
                                                onChange={(e) =>
                                                    updateCertification(
                                                        index,
                                                        'issuer',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Issuer e.g. ISO / TÜV / BSI"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.certificate_number}
                                                onChange={(e) =>
                                                    updateCertification(
                                                        index,
                                                        'certificate_number',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Certificate Number"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                type="date"
                                                value={item.issued_date}
                                                onChange={(e) =>
                                                    updateCertification(
                                                        index,
                                                        'issued_date',
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.document_url}
                                                onChange={(e) =>
                                                    updateCertification(
                                                        index,
                                                        'document_url',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Certificate Document / PDF URL"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                        </div>


                                        <textarea
                                            rows={3}
                                            value={item.description}
                                            onChange={(e) =>
                                                updateCertification(
                                                    index,
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Certification description..."
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />


                                        <select
                                            value={item.image}
                                            onChange={(e) =>
                                                updateCertification(
                                                    index,
                                                    'image',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                        >

                                            <option value="">
                                                Select Certificate Image
                                            </option>

                                            {media.map(
                                                (mediaItem) => (

                                                    <option
                                                        key={
                                                            mediaItem.id
                                                        }
                                                        value={
                                                            mediaItem.file_path
                                                        }
                                                    >
                                                        {
                                                            mediaItem.file_name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        <input
                                            value={item.url}
                                            onChange={(e) =>
                                                updateCertification(
                                                    index,
                                                    'url',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Optional Certification URL"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCertification(
                                                    index
                                                )
                                            }
                                            className="text-sm font-medium text-red-600"
                                        >
                                            Delete Certification
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                    {/* =================================================
                        GLOBAL PRESENCE CONFIGURATION
                    ================================================== */}

                    {data.type === 'global_presence' && (

                        <div className="space-y-6 rounded-xl border border-cyan-200 bg-cyan-50/30 p-5">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Global Presence Configuration
                                </h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Add office locations and map coordinates. These values are used to place interactive markers on the public world map.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Display Style
                                </label>

                                <select
                                    value={globalPresenceContent.variant}
                                    onChange={(e) =>
                                        setGlobalPresenceContent({
                                            ...globalPresenceContent,
                                            variant:
                                                e.target.value as GlobalPresenceVariant,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                >
                                    <option value="map">
                                        Interactive Map Only
                                    </option>

                                    <option value="offices">
                                        Office Cards Only
                                    </option>

                                    <option value="map_offices">
                                        Interactive Map + Office Cards
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Section Heading
                                </label>

                                <input
                                    value={globalPresenceContent.heading}
                                    onChange={(e) =>
                                        setGlobalPresenceContent({
                                            ...globalPresenceContent,
                                            heading: e.target.value,
                                        })
                                    }
                                    placeholder="Our Global Presence"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Section Description
                                </label>

                                <textarea
                                    rows={3}
                                    value={globalPresenceContent.description}
                                    onChange={(e) =>
                                        setGlobalPresenceContent({
                                            ...globalPresenceContent,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Serving businesses across multiple locations..."
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                                />
                            </div>

                            <div className="space-y-4">

                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">
                                            Office Locations
                                        </h3>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Latitude and longitude determine the exact marker position on the world map.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addOffice}
                                        className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                                    >
                                        + Add Office
                                    </button>
                                </div>

                                {globalPresenceContent.offices.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-8 text-center text-sm text-gray-500">
                                        No office locations added yet.
                                    </div>
                                )}

                                {globalPresenceContent.offices.map(
                                    (office, index) => (

                                        <div
                                            key={index}
                                            className="space-y-4 rounded-xl border border-gray-200 bg-white p-5"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <h4 className="font-semibold text-gray-900">
                                                    Office {index + 1}
                                                    {office.country
                                                        ? ` - ${office.country}`
                                                        : ''}
                                                </h4>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeOffice(index)
                                                    }
                                                    className="text-sm font-medium text-red-600"
                                                >
                                                    Delete Office
                                                </button>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Country
                                                    </label>

                                                    <input
                                                        value={office.country}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'country',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Singapore"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        City
                                                    </label>

                                                    <input
                                                        value={office.city}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'city',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Singapore"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Company / Office Name
                                                    </label>

                                                    <input
                                                        value={office.company}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'company',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Sysnet System and Solutions Pte Ltd"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Office Type
                                                    </label>

                                                    <select
                                                        value={office.type}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'type',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                                    >
                                                        <option value="headquarters">
                                                            Headquarters
                                                        </option>

                                                        <option value="regional_office">
                                                            Regional Office
                                                        </option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Latitude
                                                    </label>

                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={office.latitude}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'latitude',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="1.3521"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Example: Singapore = 1.3521
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Longitude
                                                    </label>

                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={office.longitude}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'longitude',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="103.8198"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Example: Singapore = 103.8198
                                                    </p>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Office Address
                                                    </label>

                                                    <textarea
                                                        rows={2}
                                                        value={office.address}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'address',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Full office address"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Phone
                                                    </label>

                                                    <input
                                                        value={office.phone}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'phone',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="+65 6773 0273"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Email
                                                    </label>

                                                    <input
                                                        type="email"
                                                        value={office.email}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'email',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="sales@example.com"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Website URL
                                                    </label>

                                                    <input
                                                        value={office.website}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'website',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="https://www.example.com"
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-xs font-medium text-gray-600">
                                                        Google Maps URL
                                                    </label>

                                                    <input
                                                        value={office.map_url}
                                                        onChange={(e) =>
                                                            updateOffice(
                                                                index,
                                                                'map_url',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="https://maps.google.com/..."
                                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    )}



                    {/* =================================================
                        CTA CONFIGURATION
                    ================================================== */}

                    {data.type === 'cta' && (

                        <div className="space-y-5 rounded-xl border border-orange-200 bg-orange-50/30 p-5">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Call To Action Configuration
                            </h2>


                            <select
                                value={ctaContent.variant}
                                onChange={(e) =>
                                    setCtaContent({
                                        ...ctaContent,

                                        variant:
                                            e.target
                                                .value as CtaVariant,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            >

                                <option value="simple">
                                    Simple CTA
                                </option>

                                <option value="split">
                                    Split CTA
                                </option>

                                <option value="background">
                                    Background Image CTA
                                </option>

                                <option value="support">
                                    Support CTA
                                </option>

                                <option value="contact">
                                    Contact / Consultation CTA
                                </option>

                            </select>


                            <input
                                value={ctaContent.heading}
                                onChange={(e) =>
                                    setCtaContent({
                                        ...ctaContent,

                                        heading:
                                            e.target.value,
                                    })
                                }
                                placeholder="Ready to Transform Your Business?"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            />


                            <textarea
                                rows={4}
                                value={ctaContent.description}
                                onChange={(e) =>
                                    setCtaContent({
                                        ...ctaContent,

                                        description:
                                            e.target.value,
                                    })
                                }
                                placeholder="CTA description..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />


                            <div className="grid gap-4 md:grid-cols-2">

                                <input
                                    value={ctaContent.button_text}
                                    onChange={(e) =>
                                        setCtaContent({
                                            ...ctaContent,

                                            button_text:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Contact Us"
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                />

                                <input
                                    value={ctaContent.button_url}
                                    onChange={(e) =>
                                        setCtaContent({
                                            ...ctaContent,

                                            button_url:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="/contact"
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                />

                            </div>


                            <div className="grid gap-4 md:grid-cols-2">

                                <input
                                    value={
                                        ctaContent.secondary_button_text
                                    }
                                    onChange={(e) =>
                                        setCtaContent({
                                            ...ctaContent,

                                            secondary_button_text:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Secondary Button"
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                />

                                <input
                                    value={
                                        ctaContent.secondary_button_url
                                    }
                                    onChange={(e) =>
                                        setCtaContent({
                                            ...ctaContent,

                                            secondary_button_url:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="/solutions"
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                />

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        CONTENT CONFIGURATION
                    ================================================== */}

                    {data.type === 'content' && (

                        <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-5">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Content Configuration
                            </h2>


                            <select
                                value={contentSection.variant}
                                onChange={(e) =>
                                    setContentSection({
                                        ...contentSection,

                                        variant:
                                            e.target
                                                .value as ContentVariant,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            >

                                <option value="standard">
                                    Standard Content
                                </option>

                                <option value="image_left">
                                    Image Left
                                </option>

                                <option value="image_right">
                                    Image Right
                                </option>

                                <option value="highlight">
                                    Highlight Content
                                </option>

                                <option value="two_column">
                                    Two Column Content
                                </option>

                            </select>


                            <input
                                value={contentSection.heading}
                                onChange={(e) =>
                                    setContentSection({
                                        ...contentSection,

                                        heading:
                                            e.target.value,
                                    })
                                }
                                placeholder="Section Heading"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            />


                            <textarea
                                rows={6}
                                value={contentSection.description}
                                onChange={(e) =>
                                    setContentSection({
                                        ...contentSection,

                                        description:
                                            e.target.value,
                                    })
                                }
                                placeholder="Short section description..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />

                            <textarea
                                rows={7}
                                value={contentSection.text}
                                onChange={(e) =>
                                    setContentSection({
                                        ...contentSection,
                                        text: e.target.value,
                                    })
                                }
                                placeholder="Main body content / long-form text..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />


                            <div className="grid gap-4 md:grid-cols-2">

                                <input
                                    value={
                                        contentSection.button_text
                                    }
                                    onChange={(e) =>
                                        setContentSection({
                                            ...contentSection,

                                            button_text:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Optional Button Text"
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                />


                                <input
                                    value={
                                        contentSection.button_url
                                    }
                                    onChange={(e) =>
                                        setContentSection({
                                            ...contentSection,

                                            button_url:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="/about"
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2"
                                />

                            </div>

                        </div>

                    )}



                    {/* =================================================
                        CARDS CONFIGURATION
                    ================================================== */}

                    {data.type === 'cards' && (

                        <div className="space-y-6 rounded-xl border border-indigo-200 bg-indigo-50/30 p-5">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Cards Configuration
                                </h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Use the Cards section for services, solutions, products, AI solutions, features, Why Choose Us, or testimonials.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Cards Style
                                </label>

                                <select
                                    value={cardsContent.variant}
                                    onChange={(e) =>
                                        setCardsContent({
                                            ...cardsContent,
                                            variant:
                                                e.target
                                                    .value as CardsVariant,
                                        })
                                    }
                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                                >
                                    <option value="services">
                                        Services
                                    </option>

                                    <option value="solutions">
                                        Solutions
                                    </option>

                                    <option value="products">
                                        Products
                                    </option>

                                    <option value="features">
                                        Features
                                    </option>

                                    <option value="ai_solutions">
                                        AI Solutions
                                    </option>

                                    <option value="why_choose_us">
                                        Why Choose Us
                                    </option>

                                    <option value="testimonials">
                                        Testimonials
                                    </option>
                                </select>
                            </div>

                            <input
                                value={cardsContent.heading}
                                onChange={(e) =>
                                    setCardsContent({
                                        ...cardsContent,
                                        heading:
                                            e.target.value,
                                    })
                                }
                                placeholder="Section Heading"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2"
                            />

                            <textarea
                                rows={3}
                                value={cardsContent.description}
                                onChange={(e) =>
                                    setCardsContent({
                                        ...cardsContent,
                                        description:
                                            e.target.value,
                                    })
                                }
                                placeholder="Section description..."
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Card Items
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Fields that are not required for the selected style can be left empty.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addCard}
                                    className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                                >
                                    + Add Card
                                </button>
                            </div>

                            {cardsContent.items.length === 0 && (
                                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-8 text-center text-sm text-gray-500">
                                    No card items added yet.
                                </div>
                            )}

                            {cardsContent.items.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <h4 className="font-semibold text-gray-900">
                                                Card {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCard(index)
                                                }
                                                className="text-sm font-medium text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">

                                            <input
                                                value={item.title}
                                                onChange={(e) =>
                                                    updateCard(
                                                        index,
                                                        'title',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={
                                                    cardsContent.variant ===
                                                    'testimonials'
                                                        ? 'Testimonial title / client name'
                                                        : 'Card Title'
                                                }
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.icon}
                                                onChange={(e) =>
                                                    updateCard(
                                                        index,
                                                        'icon',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Icon / Emoji"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <select
                                                value={item.image}
                                                onChange={(e) =>
                                                    updateCard(
                                                        index,
                                                        'image',
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            >
                                                <option value="">
                                                    Select Image
                                                </option>

                                                {media.map(
                                                    (mediaItem) => (
                                                        <option
                                                            key={
                                                                mediaItem.id
                                                            }
                                                            value={
                                                                mediaItem.file_path
                                                            }
                                                        >
                                                            {
                                                                mediaItem.file_name
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <input
                                                value={item.badge}
                                                onChange={(e) =>
                                                    updateCard(
                                                        index,
                                                        'badge',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Optional Badge e.g. New / AI"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />
                                        </div>

                                        <textarea
                                            rows={4}
                                            value={item.description}
                                            onChange={(e) =>
                                                updateCard(
                                                    index,
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            placeholder={
                                                cardsContent.variant ===
                                                'testimonials'
                                                    ? 'Customer testimonial / quote'
                                                    : 'Card description'
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                        />

                                        {cardsContent.variant ===
                                            'testimonials' && (

                                            <div className="grid gap-4 md:grid-cols-3">

                                                <input
                                                    value={item.person_name}
                                                    onChange={(e) =>
                                                        updateCard(
                                                            index,
                                                            'person_name',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Person Name"
                                                    className="rounded-lg border border-gray-300 px-4 py-2"
                                                />

                                                <input
                                                    value={item.designation}
                                                    onChange={(e) =>
                                                        updateCard(
                                                            index,
                                                            'designation',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Designation"
                                                    className="rounded-lg border border-gray-300 px-4 py-2"
                                                />

                                                <input
                                                    value={item.company}
                                                    onChange={(e) =>
                                                        updateCard(
                                                            index,
                                                            'company',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Company"
                                                    className="rounded-lg border border-gray-300 px-4 py-2"
                                                />
                                            </div>
                                        )}

                                        <div className="grid gap-4 md:grid-cols-2">

                                            <input
                                                value={item.url}
                                                onChange={(e) =>
                                                    updateCard(
                                                        index,
                                                        'url',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Optional URL"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />

                                            <input
                                                value={item.button_text}
                                                onChange={(e) =>
                                                    updateCard(
                                                        index,
                                                        'button_text',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Button Text"
                                                className="rounded-lg border border-gray-300 px-4 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-gray-600">
                                                Features
                                            </label>

                                            <textarea
                                                rows={3}
                                                value={item.features.join('\n')}
                                                onChange={(e) =>
                                                    updateCard(
                                                        index,
                                                        'features',
                                                        e.target.value
                                                            .split('\n')
                                                    )
                                                }
                                                placeholder={'One feature per line\n24/7 Support\nCloud Ready'}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                            />
                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    )}

                    {/* =================================================
                        GRID CONFIGURATION
                    ================================================== */}

                    {data.type === 'grid' && (
                        <div className="space-y-6 rounded-xl border border-pink-200 bg-pink-50/30 p-5">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Grid Configuration
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Create image, logo, client and partner grids. For each item you can select an image from the Media Library or paste a direct image URL, then optionally link the entire grid item to the company website.
                                </p>
                            </div>

                            {/* Grid style */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Grid Style
                                </label>

                                <select
                                    value={gridContent.variant}
                                    onChange={(e) =>
                                        setGridContent({
                                            ...gridContent,
                                            variant:
                                                e.target
                                                    .value as GridVariant,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm"
                                >
                                    <option value="images">
                                        Image Grid
                                    </option>

                                    <option value="icons">
                                        Icon Grid
                                    </option>

                                    <option value="logos">
                                        Logo Grid
                                    </option>

                                    <option value="partners">
                                        Partners
                                    </option>

                                    <option value="clients">
                                        Client Logos
                                    </option>

                                    <option value="technology_partners">
                                        Technology Partners
                                    </option>
                                </select>
                            </div>

                            {/* Heading */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Section Heading
                                </label>

                                <input
                                    value={gridContent.heading}
                                    onChange={(e) =>
                                        setGridContent({
                                            ...gridContent,
                                            heading:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Technology Partners"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Section Description
                                </label>

                                <textarea
                                    rows={3}
                                    value={gridContent.description}
                                    onChange={(e) =>
                                        setGridContent({
                                            ...gridContent,
                                            description:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Describe your partners, clients, technologies or grid content..."
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                                />
                            </div>

                            {/* Items header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-pink-100 pt-5">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Grid Items
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Add a logo/image and an optional website link for each item.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addGridItem}
                                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                >
                                    + Add Grid Item
                                </button>
                            </div>

                            {gridContent.items.length === 0 && (
                                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center">
                                    <p className="text-sm font-medium text-gray-700">
                                        No grid items added yet.
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Click “Add Grid Item” to add your first logo, client or partner.
                                    </p>
                                </div>
                            )}

                            {/* Grid items */}
                            <div className="space-y-5">
                                {gridContent.items.map(
                                    (item, index) => {
                                        const selectedGridMedia =
                                            media.find(
                                                (mediaItem) =>
                                                    mediaItem.file_path ===
                                                    item.image,
                                            );

                                        const previewUrl =
                                            item.image_url.trim() !== ''
                                                ? item.image_url.trim()
                                                : selectedGridMedia
                                                  ? `/storage/${selectedGridMedia.file_path}`
                                                  : item.image
                                                    ? item.image.startsWith(
                                                          'http://',
                                                      ) ||
                                                      item.image.startsWith(
                                                          'https://',
                                                      ) ||
                                                      item.image.startsWith(
                                                          '/',
                                                      )
                                                        ? item.image
                                                        : `/storage/${item.image}`
                                                    : '';

                                        return (
                                            <div
                                                key={index}
                                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                                            >
                                                {/* Item header */}
                                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-3">

                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            Grid Item {index + 1}
                                                            {item.title
                                                                ? ` — ${item.title}`
                                                                : ''}
                                                        </h4>

                                                        <p className="mt-0.5 text-xs text-gray-500">
                                                            Configure the display image/logo and destination website.
                                                        </p>
                                                    </div>


                                                    {/* =====================================================
                                                        ITEM ACTIONS
                                                    ===================================================== */}

                                                    <div className="flex items-center gap-4">

                                                        {/* Show / Hide Toggle */}

                                                        <div className="flex items-center gap-2">

                                                            <span
                                                                className={`text-xs font-semibold ${
                                                                    item.is_visible
                                                                        ? 'text-green-600'
                                                                        : 'text-gray-500'
                                                                }`}
                                                            >
                                                                {item.is_visible
                                                                    ? 'Visible'
                                                                    : 'Hidden'}
                                                            </span>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'is_visible',
                                                                        !item.is_visible
                                                                    )
                                                                }
                                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                                                    item.is_visible
                                                                        ? 'bg-green-500'
                                                                        : 'bg-gray-300'
                                                                }`}
                                                                title={
                                                                    item.is_visible
                                                                        ? 'Hide this item'
                                                                        : 'Show this item'
                                                                }
                                                            >

                                                                <span
                                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                                                        item.is_visible
                                                                            ? 'translate-x-6'
                                                                            : 'translate-x-1'
                                                                    }`}
                                                                />

                                                            </button>

                                                        </div>


                                                        {/* Delete */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeGridItem(index)
                                                            }
                                                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </div>

                                                <div className="grid gap-5 p-5 lg:grid-cols-[220px_1fr]">
                                                    {/* Preview */}
                                                    <div>
                                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                            Preview
                                                        </label>

                                                        <div className="flex h-[150px] w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
                                                            {previewUrl ? (
                                                                <img
                                                                    src={
                                                                        previewUrl
                                                                    }
                                                                    alt={
                                                                        item.title ||
                                                                        `Grid item ${index + 1}`
                                                                    }
                                                                    className="h-full w-full object-contain object-center"
                                                                    onError={(
                                                                        event,
                                                                    ) => {
                                                                        event.currentTarget.style.display =
                                                                            'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="px-4 text-center">
                                                                    <p className="text-sm font-medium text-gray-500">
                                                                        No image selected
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-gray-400">
                                                                        Select Media Library image or paste an Image URL.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Fields */}
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div>
                                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                                Name / Title
                                                            </label>

                                                            <input
                                                                value={
                                                                    item.title
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'title',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="VMware"
                                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                                Media Library Image / Logo
                                                            </label>

                                                            <select
                                                                value={
                                                                    item.image
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'image',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm"
                                                            >
                                                                <option value="">
                                                                    Select Image / Logo
                                                                </option>

                                                                {media.map(
                                                                    (
                                                                        mediaItem,
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                mediaItem.id
                                                                            }
                                                                            value={
                                                                                mediaItem.file_path
                                                                            }
                                                                        >
                                                                            {
                                                                                mediaItem.file_name
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <div className="mb-1.5 flex items-center justify-between gap-3">
                                                                <label className="block text-sm font-medium text-gray-700">
                                                                    Direct Image URL
                                                                </label>

                                                                <span className="text-xs text-gray-400">
                                                                    Optional — overrides Media Library image
                                                                </span>
                                                            </div>

                                                            <input
                                                                type="url"
                                                                value={
                                                                    item.image_url
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'image_url',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="https://example.com/logo.png"
                                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                                            />

                                                            <p className="mt-1.5 text-xs leading-5 text-gray-500">
                                                                Paste a direct public image URL ending in .png, .jpg, .jpeg, .webp, .svg, etc.
                                                            </p>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                                Website URL / Link
                                                            </label>

                                                            <input
                                                                type="url"
                                                                value={
                                                                    item.url
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'url',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="https://www.vmware.com/"
                                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                                            />

                                                            <p className="mt-1.5 text-xs leading-5 text-gray-500">
                                                                When provided, visitors can click the complete logo/card to open this website.
                                                            </p>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                                Description
                                                            </label>

                                                            <textarea
                                                                rows={2}
                                                                value={
                                                                    item.description
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'description',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Optional short description..."
                                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                                Icon / Emoji
                                                            </label>

                                                            <input
                                                                value={
                                                                    item.icon
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'icon',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="☁️"
                                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                                Category
                                                            </label>

                                                            <input
                                                                value={
                                                                    item.category
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'category',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Cloud Provider"
                                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                                            />
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                                Optional Badge
                                                            </label>

                                                            <input
                                                                value={
                                                                    item.badge
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateGridItem(
                                                                        index,
                                                                        'badge',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Technology Partner"
                                                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        FAQ CONFIGURATION
                    ================================================== */}

                    {data.type === 'faq' && (

                        <div className="space-y-6 rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    FAQ Configuration
                                </h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    Add frequently asked questions and answers. These items can also be used automatically for FAQPage Schema.org structured data.
                                </p>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    FAQ Heading
                                </label>

                                <input
                                    type="text"
                                    value={faqContent.heading}
                                    onChange={(e) =>
                                        setFaqContent({
                                            ...faqContent,
                                            heading: e.target.value,
                                        })
                                    }
                                    placeholder="Frequently Asked Questions"
                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    FAQ Description
                                </label>

                                <textarea
                                    rows={3}
                                    value={faqContent.description}
                                    onChange={(e) =>
                                        setFaqContent({
                                            ...faqContent,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Find answers to common questions about our services."
                                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                                />
                            </div>


                            <div className="flex flex-wrap items-center justify-between gap-3">

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Questions & Answers
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Add at least one complete question and answer.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addFaqItem}
                                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                >
                                    + Add FAQ
                                </button>

                            </div>


                            {faqContent.items.length === 0 && (

                                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-8 text-center">

                                    <p className="text-sm font-medium text-gray-700">
                                        No FAQ items added yet.
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Click "Add FAQ" to create your first question and answer.
                                    </p>

                                </div>

                            )}


                            {faqContent.items.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                                    >

                                        <div className="mb-4 flex items-center justify-between gap-3">

                                            <h4 className="font-semibold text-gray-900">
                                                FAQ {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFaqItem(index)
                                                }
                                                className="text-sm font-medium text-red-600 hover:text-red-700"
                                            >
                                                Delete
                                            </button>

                                        </div>


                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Question
                                            </label>

                                            <input
                                                type="text"
                                                value={item.question}
                                                onChange={(e) =>
                                                    updateFaqItem(
                                                        index,
                                                        'question',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="What services do you provide?"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                                            />
                                        </div>


                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Answer
                                            </label>

                                            <textarea
                                                rows={4}
                                                value={item.answer}
                                                onChange={(e) =>
                                                    updateFaqItem(
                                                        index,
                                                        'answer',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter the answer to this question..."
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                            />
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}


                    {/* =================================================
                        CONTACT FORM CONTENT
                    ================================================== */}

                    {data.type === 'contact_form' && (

                        <div className="space-y-8">

                            {/* =================================================
                                LAYOUT + MAIN CONTENT
                            ================================================== */}

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

                                <div className="mb-5">

                                    <h3 className="text-base font-semibold text-gray-900">
                                        Contact Section Layout
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Choose how the contact section should appear on the public website.
                                    </p>

                                </div>


                                <div className="grid gap-5 md:grid-cols-2">

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700">
                                            Layout Variant
                                        </label>

                                        <select
                                            value={contactContent.variant}
                                            onChange={(e) =>
                                                setContactContent(
                                                    (previous) => ({
                                                        ...previous,
                                                        variant:
                                                            e.target.value as ContactVariant,
                                                    })
                                                )
                                            }
                                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                        >
                                            <option value="split">
                                                Split - Contact Details + Form
                                            </option>

                                            <option value="form_only">
                                                Form Only
                                            </option>

                                            <option value="contact_details">
                                                Contact Details Only
                                            </option>

                                        </select>

                                    </div>


                                    <div>

                                        <label className="block text-sm font-medium text-gray-700">
                                            Section Heading
                                        </label>

                                        <input
                                            type="text"
                                            value={contactContent.heading}
                                            onChange={(e) =>
                                                setContactContent(
                                                    (previous) => ({
                                                        ...previous,
                                                        heading:
                                                            e.target.value,
                                                    })
                                                )
                                            }
                                            placeholder="Let's Discuss Your IT Needs"
                                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                        />

                                    </div>

                                </div>


                                <div className="mt-5">

                                    <label className="block text-sm font-medium text-gray-700">
                                        Section Description
                                    </label>

                                    <textarea
                                        value={contactContent.description}
                                        onChange={(e) =>
                                            setContactContent(
                                                (previous) => ({
                                                    ...previous,
                                                    description:
                                                        e.target.value,
                                                })
                                            )
                                        }
                                        rows={3}
                                        placeholder="Tell visitors how your team can help."
                                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                CONTACT DETAILS
                            ================================================== */}

                            {contactContent.variant !== 'form_only' && (

                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                    <div className="mb-5">

                                        <h3 className="text-base font-semibold text-gray-900">
                                            Contact Details Panel
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            These values are shown in the contact information panel.
                                        </p>

                                    </div>


                                    <div className="grid gap-5 md:grid-cols-2">

                                        <div className="md:col-span-2">

                                            <label className="block text-sm font-medium text-gray-700">
                                                Office Address
                                            </label>

                                            <textarea
                                                value={contactContent.office_address}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            office_address:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                rows={3}
                                                placeholder="Enter office address"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Phone
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.phone}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            phone:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="+65 6773 0273"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>

                                            <input
                                                type="email"
                                                value={contactContent.email}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            email:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="sales@example.com"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Business Hours
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.business_hours}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            business_hours:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="Monday - Friday, 9:00 AM - 6:00 PM"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                WhatsApp Number / URL
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.whatsapp}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            whatsapp:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="+6567730273 or https://wa.me/..."
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                WhatsApp Button Text
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.whatsapp_text}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            whatsapp_text:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="Chat on WhatsApp"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                FORM CONTENT
                            ================================================== */}

                            {contactContent.variant !== 'contact_details' && (

                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                    <div className="mb-5">

                                        <h3 className="text-base font-semibold text-gray-900">
                                            Form Content
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Customize the form heading, helper text, button and privacy message.
                                        </p>

                                    </div>


                                    <div className="grid gap-5 md:grid-cols-2">

                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Form Title
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.form_title}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            form_title:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="Send us a message"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Submit Button Text
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.button_text}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            button_text:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="Send Message"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div className="md:col-span-2">

                                            <label className="block text-sm font-medium text-gray-700">
                                                Form Description
                                            </label>

                                            <textarea
                                                value={contactContent.form_description}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            form_description:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                rows={3}
                                                placeholder="Tell us about your requirements and our team will get back to you."
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Success Message
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.success_message}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            success_message:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="Thank you. We will contact you soon."
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div>

                                            <label className="block text-sm font-medium text-gray-700">
                                                Verification Label
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.verification_label}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            verification_label:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="Human Verification"
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>


                                        <div className="md:col-span-2">

                                            <label className="block text-sm font-medium text-gray-700">
                                                Privacy Text
                                            </label>

                                            <input
                                                type="text"
                                                value={contactContent.privacy_text}
                                                onChange={(e) =>
                                                    setContactContent(
                                                        (previous) => ({
                                                            ...previous,
                                                            privacy_text:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                placeholder="By submitting this form, you agree to our privacy policy."
                                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                                            />

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                FIELD VISIBILITY
                            ================================================== */}

                            {contactContent.variant !== 'contact_details' && (

                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

                                    <div className="mb-5">

                                        <h3 className="text-base font-semibold text-gray-900">
                                            Form Fields
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Enable or disable the fields that should appear on the public form.
                                        </p>

                                    </div>


                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                        {[
                                            {
                                                key: 'show_full_name',
                                                label: 'Full Name',
                                            },
                                            {
                                                key: 'show_email',
                                                label: 'Email',
                                            },
                                            {
                                                key: 'show_company',
                                                label: 'Company',
                                            },
                                            {
                                                key: 'show_phone',
                                                label: 'Phone',
                                            },
                                            {
                                                key: 'show_service_category',
                                                label: 'Service Category',
                                            },
                                            {
                                                key: 'show_message',
                                                label: 'Message',
                                            },
                                        ].map((field) => {

                                            const key =
                                                field.key as
                                                    | 'show_full_name'
                                                    | 'show_email'
                                                    | 'show_company'
                                                    | 'show_phone'
                                                    | 'show_service_category'
                                                    | 'show_message';

                                            return (

                                                <label
                                                    key={key}
                                                    className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3"
                                                >

                                                    <span className="text-sm font-medium text-gray-700">
                                                        {field.label}
                                                    </span>

                                                    <input
                                                        type="checkbox"
                                                        checked={contactContent[key]}
                                                        onChange={(e) =>
                                                            setContactContent(
                                                                (previous) => ({
                                                                    ...previous,
                                                                    [key]:
                                                                        e.target.checked,
                                                                })
                                                            )
                                                        }
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />

                                                </label>

                                            );

                                        })}

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                FIELD LABELS + PLACEHOLDERS
                            ================================================== */}

                            {contactContent.variant !== 'contact_details' && (

                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                    <div className="mb-5">

                                        <h3 className="text-base font-semibold text-gray-900">
                                            Field Labels & Placeholders
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Customize the text visitors see for each enabled form field.
                                        </p>

                                    </div>


                                    <div className="grid gap-5 md:grid-cols-2">

                                        {contactContent.show_full_name && (
                                            <>
                                                <ContactTextInput
                                                    label="Full Name Label"
                                                    value={contactContent.full_name_label}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                full_name_label:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />

                                                <ContactTextInput
                                                    label="Full Name Placeholder"
                                                    value={contactContent.full_name_placeholder}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                full_name_placeholder:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </>
                                        )}


                                        {contactContent.show_email && (
                                            <>
                                                <ContactTextInput
                                                    label="Email Label"
                                                    value={contactContent.email_label}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                email_label:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />

                                                <ContactTextInput
                                                    label="Email Placeholder"
                                                    value={contactContent.email_placeholder}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                email_placeholder:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </>
                                        )}


                                        {contactContent.show_company && (
                                            <>
                                                <ContactTextInput
                                                    label="Company Label"
                                                    value={contactContent.company_label}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                company_label:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />

                                                <ContactTextInput
                                                    label="Company Placeholder"
                                                    value={contactContent.company_placeholder}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                company_placeholder:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </>
                                        )}


                                        {contactContent.show_phone && (
                                            <>
                                                <ContactTextInput
                                                    label="Phone Label"
                                                    value={contactContent.phone_label}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                phone_label:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />

                                                <ContactTextInput
                                                    label="Phone Placeholder"
                                                    value={contactContent.phone_placeholder}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                phone_placeholder:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </>
                                        )}


                                        {contactContent.show_service_category && (
                                            <>
                                                <ContactTextInput
                                                    label="Service Category Label"
                                                    value={contactContent.service_category_label}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                service_category_label:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />

                                                <ContactTextInput
                                                    label="Service Category Placeholder"
                                                    value={contactContent.service_category_placeholder}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                service_category_placeholder:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </>
                                        )}


                                        {contactContent.show_message && (
                                            <>
                                                <ContactTextInput
                                                    label="Message Label"
                                                    value={contactContent.message_label}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                message_label:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />

                                                <ContactTextInput
                                                    label="Message Placeholder"
                                                    value={contactContent.message_placeholder}
                                                    onChange={(value) =>
                                                        setContactContent(
                                                            (previous) => ({
                                                                ...previous,
                                                                message_placeholder:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </>
                                        )}

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                FALLBACK SERVICE OPTIONS
                            ================================================== */}

                            {contactContent.variant !== 'contact_details' &&
                                contactContent.show_service_category && (

                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                    <label className="block text-sm font-medium text-gray-700">
                                        Fallback Service Options
                                    </label>

                                    <textarea
                                        value={contactContent.service_options.join(
                                            '\n'
                                        )}
                                        onChange={(e) =>
                                            setContactContent(
                                                (previous) => ({
                                                    ...previous,
                                                    service_options:
                                                        e.target.value
                                                            .split('\n'),
                                                })
                                            )
                                        }
                                        rows={7}
                                        placeholder={`IT Infrastructure
Cybersecurity
Cloud Services
Managed Services`}
                                        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                                    />

                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter one service per line. These are used only when the main menu does not provide service categories.
                                    </p>

                                </div>

                            )}


                            {errors.content && (

                                <p className="text-sm text-red-600">
                                    {errors.content}
                                </p>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        MAIN IMAGE

                        Carousel uses per-slide images,
                        therefore hide this for carousel.
                    ================================================== */}

                    {!(
                        data.type === 'hero' &&
                        heroContent.variant ===
                            'carousel'
                    ) && (

                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Image
                            </label>


                            <select
                                value={
                                    data.image
                                }
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.value
                                    )
                                }
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                            >

                                <option value="">
                                    No Image
                                </option>


                                {media.map(
                                    (item) => (

                                        <option
                                            key={
                                                item.id
                                            }
                                            value={
                                                item.file_path
                                            }
                                        >
                                            {
                                                item.file_name
                                            }
                                        </option>

                                    )
                                )}

                            </select>


                            <p className="mt-1 text-xs text-gray-500">
                                Select an image from the Media Library.
                            </p>


                            {errors.image && (

                                <p className="mt-1 text-sm text-red-600">
                                    {errors.image}
                                </p>

                            )}


                            {/* Preview */}

                            {selectedMedia && (

                                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">

                                    <p className="mb-3 text-sm font-medium text-gray-700">
                                        Image Preview
                                    </p>


                                    <img
                                        src={`/storage/${selectedMedia.file_path}`}
                                        alt={
                                            selectedMedia.alt_text ||
                                            selectedMedia.file_name
                                        }
                                        className="max-h-64 max-w-full rounded-lg border border-gray-200 object-contain"
                                    />


                                    <p className="mt-2 text-xs text-gray-500">
                                        {
                                            selectedMedia.file_name
                                        }
                                    </p>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        VIDEO URL

                        Show for normal sections and Video Hero.
                        Hide for carousel.
                    ================================================== */}

                    {!(
                        data.type === 'hero' &&
                        heroContent.variant ===
                            'carousel'
                    ) && (

                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Video URL
                            </label>


                            <input
                                type="url"
                                value={
                                    data.video_url
                                }
                                onChange={(e) =>
                                    setData(
                                        'video_url',
                                        e.target.value
                                    )
                                }
                                placeholder="https://example.com/video.mp4"
                                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                            />


                            <p className="mt-1 text-xs text-gray-500">

                                {data.type ===
                                    'hero' &&
                                heroContent.variant ===
                                    'video'
                                    ? 'Enter the background video URL for this hero.'
                                    : 'Enter a direct video URL to stream the video without uploading it.'}

                            </p>


                            {errors.video_url && (

                                <p className="mt-1 text-sm text-red-600">
                                    {
                                        errors.video_url
                                    }
                                </p>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        SORT ORDER
                    ================================================== */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700">
                            Sort Order
                        </label>


                        <input
                            type="number"
                            min="0"
                            value={
                                data.sort_order
                            }
                            onChange={(e) =>
                                setData(
                                    'sort_order',
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        />


                        <p className="mt-1 text-xs text-gray-500">
                            Lower numbers appear first.
                        </p>


                        {errors.sort_order && (

                            <p className="mt-1 text-sm text-red-600">
                                {
                                    errors.sort_order
                                }
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================== */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700">
                            Status
                        </label>


                        <select
                            value={
                                data.status
                            }
                            onChange={(e) =>
                                setData(
                                    'status',
                                    e.target
                                        .value as
                                        | 'active'
                                        | 'inactive'
                                )
                            }
                            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>


                        {errors.status && (

                            <p className="mt-1 text-sm text-red-600">
                                {errors.status}
                            </p>

                        )}

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================== */}

                    <div className="flex items-center gap-3 border-t border-gray-200 pt-6">

                        <Link
                            href={`/admin/pages/${page.id}/sections`}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>


                        <button
                            type="submit"
                            disabled={
                                processing
                            }
                            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                        >

                            {processing
                                ? 'Creating...'
                                : 'Create Section'}

                        </button>

                    </div>

                </form>

            </div>

        </CMSLayout>

    );
}