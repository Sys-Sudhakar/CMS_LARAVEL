export type SectionType =
    | 'hero'
    | 'content'
    | 'cards'
    | 'grid'
    | 'stats'
    | 'about'
    | 'vision_mission'
    | 'certifications'
    | 'global_presence'
    | 'cta';

export interface SectionVariant {
    id: string;
    name: string;
    description: string;
}

export interface SectionDefinition {
    type: SectionType;
    name: string;
    description: string;
    variants: SectionVariant[];
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
    {
        type: 'hero',
        name: 'Hero',
        description:
            'Large visual introduction section for the page.',
        variants: [
            {
                id: 'standard',
                name: 'Standard Hero',
                description:
                    'Clean hero with heading, description, image and CTA.',
            },
            {
                id: 'carousel',
                name: 'Dynamic Hero Carousel',
                description:
                    'Multiple slides for announcements, products or featured content.',
            },
            {
                id: 'video',
                name: 'Video Hero',
                description:
                    'Full-width hero with background video.',
            },
            {
                id: 'split',
                name: 'Split Hero',
                description:
                    'Modern two-column hero with content and visual.',
            },
            {
                id: 'floating_cards',
                name: 'Hero with Floating Cards',
                description:
                    'Hero area enhanced with floating information cards.',
            },
            {
                id: 'statistics',
                name: 'Hero with Statistics',
                description:
                    'Hero combined with key business statistics.',
            },
        ],
    },

    {
        type: 'content',
        name: 'Content',
        description:
            'Flexible content section for text, images and media.',
        variants: [
            {
                id: 'standard',
                name: 'Standard Content',
                description:
                    'Simple text-based content section.',
            },
            {
                id: 'image_text',
                name: 'Image + Content',
                description:
                    'Content paired with an image.',
            },
            {
                id: 'split',
                name: 'Split Content',
                description:
                    'Modern two-column content layout.',
            },
            {
                id: 'media_content',
                name: 'Media + Content',
                description:
                    'Content combined with video or other media.',
            },
            {
                id: 'editorial',
                name: 'Editorial Layout',
                description:
                    'Large typography-focused editorial design.',
            },
        ],
    },

    {
        type: 'cards',
        name: 'Cards',
        description:
            'Flexible card-based content presentation.',
        variants: [
            {
                id: 'standard',
                name: 'Standard Cards',
                description:
                    'Classic responsive card layout.',
            },
            {
                id: 'feature',
                name: 'Feature Cards',
                description:
                    'Cards focused on important features.',
            },
            {
                id: 'image',
                name: 'Image Cards',
                description:
                    'Cards with large visual imagery.',
            },
            {
                id: 'icon',
                name: 'Icon Cards',
                description:
                    'Cards with prominent icons.',
            },
            {
                id: 'hover',
                name: 'Interactive Hover Cards',
                description:
                    'Cards with animated hover interactions.',
            },
            {
                id: 'horizontal',
                name: 'Horizontal Cards',
                description:
                    'Wide horizontal content cards.',
            },
        ],
    },

    {
        type: 'grid',
        name: 'Grid',
        description:
            'Flexible grid for logos, products, services or content.',
        variants: [
            {
                id: 'standard',
                name: 'Standard Grid',
                description:
                    'Simple responsive grid.',
            },
            {
                id: 'masonry',
                name: 'Masonry Grid',
                description:
                    'Dynamic masonry-style layout.',
            },
            {
                id: 'logo',
                name: 'Logo Grid',
                description:
                    'Grid designed for company or partner logos.',
            },
            {
                id: 'portfolio',
                name: 'Portfolio Grid',
                description:
                    'Visual portfolio-style presentation.',
            },
            {
                id: 'interactive',
                name: 'Interactive Grid',
                description:
                    'Grid with hover and interaction effects.',
            },
        ],
    },

    {
        type: 'stats',
        name: 'Statistics',
        description:
            'Display important business numbers and achievements.',
        variants: [
            {
                id: 'standard',
                name: 'Statistics Cards',
                description:
                    'Clean statistics card layout.',
            },
            {
                id: 'counter',
                name: 'Animated Counters',
                description:
                    'Numbers animate when entering the viewport.',
            },
            {
                id: 'icons',
                name: 'Statistics with Icons',
                description:
                    'Statistics combined with visual icons.',
            },
            {
                id: 'highlight',
                name: 'Highlight Statistics',
                description:
                    'Large featured business metrics.',
            },
        ],
    },

    {
        type: 'about',
        name: 'About',
        description:
            'Company introduction and information.',
        variants: [
            {
                id: 'standard',
                name: 'Standard About',
                description:
                    'Traditional company introduction.',
            },
            {
                id: 'story',
                name: 'Company Story',
                description:
                    'Story-driven company presentation.',
            },
            {
                id: 'timeline',
                name: 'Company Timeline',
                description:
                    'Company history displayed chronologically.',
            },
            {
                id: 'image_split',
                name: 'Image + About',
                description:
                    'Visual company introduction.',
            },
        ],
    },

    {
        type: 'vision_mission',
        name: 'Vision & Mission',
        description:
            'Present organizational vision and mission.',
        variants: [
            {
                id: 'cards',
                name: 'Vision & Mission Cards',
                description:
                    'Two-card presentation.',
            },
            {
                id: 'split',
                name: 'Split Vision & Mission',
                description:
                    'Modern split layout.',
            },
            {
                id: 'statement',
                name: 'Statement Layout',
                description:
                    'Large typography-focused presentation.',
            },
        ],
    },

    {
        type: 'certifications',
        name: 'Certifications',
        description:
            'Display certifications, standards and achievements.',
        variants: [
            {
                id: 'cards',
                name: 'Certification Cards',
                description:
                    'Certification information in cards.',
            },
            {
                id: 'logos',
                name: 'Certification Logos',
                description:
                    'Visual certification logo display.',
            },
            {
                id: 'timeline',
                name: 'Certification Timeline',
                description:
                    'Certification history over time.',
            },
        ],
    },

    {
        type: 'global_presence',
        name: 'Global Presence',
        description:
            'Show worldwide offices and locations.',
        variants: [
            {
                id: 'map',
                name: 'Interactive World Map',
                description:
                    'Map-based global office presentation.',
            },
            {
                id: 'locations',
                name: 'Location Cards',
                description:
                    'Office locations displayed as cards.',
            },
            {
                id: 'map_locations',
                name: 'Map + Locations',
                description:
                    'Interactive map combined with office information.',
            },
        ],
    },

    {
        type: 'cta',
        name: 'Call to Action',
        description:
            'Encourage visitors to take an action.',
        variants: [
            {
                id: 'standard',
                name: 'Standard CTA',
                description:
                    'Simple CTA with heading and button.',
            },
            {
                id: 'banner',
                name: 'CTA Banner',
                description:
                    'Full-width promotional CTA.',
            },
            {
                id: 'split',
                name: 'Split CTA',
                description:
                    'CTA with content and visual.',
            },
            {
                id: 'newsletter',
                name: 'Newsletter CTA',
                description:
                    'CTA designed for newsletter subscriptions.',
            },
        ],
    },
];