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
    value: string;
    label: string;
    description: string;
}

export interface SectionDefinition {
    value: SectionType;
    label: string;
    description: string;
    variants: SectionVariant[];
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
    {
        value: 'hero',
        label: 'Hero',
        description:
            'Large visual introduction for the page.',
        variants: [
            {
                value: 'standard',
                label: 'Standard Hero',
                description:
                    'Heading, description, CTA and image.',
            },
            {
                value: 'carousel',
                label: 'Dynamic Hero Carousel',
                description:
                    'Multiple slides with navigation arrows and dots.',
            },
            {
                value: 'video',
                label: 'Video Hero',
                description:
                    'Background or foreground video with overlay content.',
            },
            {
                value: 'split',
                label: 'Split Hero',
                description:
                    'Content and visual arranged side-by-side.',
            },
            {
                value: 'fullscreen',
                label: 'Fullscreen Hero',
                description:
                    'Large immersive visual experience.',
            },
            {
                value: 'announcement',
                label: 'Announcement Hero',
                description:
                    'Promote events, launches, news or important announcements.',
            },
        ],
    },

    {
        value: 'content',
        label: 'Content',
        description:
            'Flexible informational content section.',
        variants: [
            {
                value: 'standard',
                label: 'Standard Content',
                description:
                    'Heading, text and supporting media.',
            },
            {
                value: 'split',
                label: 'Split Content',
                description:
                    'Text and image/video side-by-side.',
            },
            {
                value: 'timeline',
                label: 'Timeline',
                description:
                    'Display milestones or company history.',
            },
            {
                value: 'accordion',
                label: 'Accordion',
                description:
                    'Expandable questions or information.',
            },
            {
                value: 'tabs',
                label: 'Tabbed Content',
                description:
                    'Multiple content groups using tabs.',
            },
        ],
    },

    {
        value: 'cards',
        label: 'Cards',
        description:
            'Reusable visual content cards.',
        variants: [
            {
                value: 'standard',
                label: 'Standard Cards',
                description:
                    'Traditional card grid.',
            },
            {
                value: 'featured',
                label: 'Featured Cards',
                description:
                    'Highlight selected content.',
            },
            {
                value: 'horizontal',
                label: 'Horizontal Cards',
                description:
                    'Cards with horizontal media and content.',
            },
            {
                value: 'carousel',
                label: 'Card Carousel',
                description:
                    'Scrollable cards with navigation.',
            },
            {
                value: 'flip',
                label: 'Flip Cards',
                description:
                    'Interactive front and back card design.',
            },
            {
                value: 'hover',
                label: 'Interactive Hover Cards',
                description:
                    'Cards reveal additional information on hover.',
            },
        ],
    },

    {
        value: 'grid',
        label: 'Grid',
        description:
            'Flexible visual grid layouts.',
        variants: [
            {
                value: 'standard',
                label: 'Standard Grid',
                description:
                    'Simple responsive grid.',
            },
            {
                value: 'logos',
                label: 'Logo Grid',
                description:
                    'Partners, clients or certifications.',
            },
            {
                value: 'portfolio',
                label: 'Portfolio Grid',
                description:
                    'Projects or case studies.',
            },
            {
                value: 'masonry',
                label: 'Masonry Grid',
                description:
                    'Dynamic masonry-style layout.',
            },
            {
                value: 'interactive',
                label: 'Interactive Grid',
                description:
                    'Hover and interactive grid elements.',
            },
        ],
    },

    {
        value: 'stats',
        label: 'Statistics',
        description:
            'Numbers, KPIs and achievements.',
        variants: [
            {
                value: 'standard',
                label: 'Statistics Cards',
                description:
                    'Traditional number cards.',
            },
            {
                value: 'animated',
                label: 'Animated Counters',
                description:
                    'Numbers animate when entering the viewport.',
            },
            {
                value: 'progress',
                label: 'Progress Statistics',
                description:
                    'Progress bars or achievement indicators.',
            },
            {
                value: 'timeline',
                label: 'Statistics Timeline',
                description:
                    'Statistics presented chronologically.',
            },
        ],
    },

    {
        value: 'about',
        label: 'About',
        description:
            'Company or organization introduction.',
        variants: [
            {
                value: 'standard',
                label: 'Standard About',
                description:
                    'Traditional company introduction.',
            },
            {
                value: 'story',
                label: 'Company Story',
                description:
                    'Narrative company history.',
            },
            {
                value: 'split',
                label: 'Image + Story',
                description:
                    'Visual storytelling layout.',
            },
            {
                value: 'timeline',
                label: 'Company Timeline',
                description:
                    'Company milestones and history.',
            },
        ],
    },

    {
        value: 'vision_mission',
        label: 'Vision & Mission',
        description:
            'Mission, vision and organizational values.',
        variants: [
            {
                value: 'cards',
                label: 'Vision & Mission Cards',
                description:
                    'Separate visual cards.',
            },
            {
                value: 'split',
                label: 'Split Vision & Mission',
                description:
                    'Two-column presentation.',
            },
            {
                value: 'interactive',
                label: 'Interactive Vision & Mission',
                description:
                    'Interactive content presentation.',
            },
        ],
    },

    {
        value: 'certifications',
        label: 'Certifications',
        description:
            'Certifications, awards and accreditations.',
        variants: [
            {
                value: 'cards',
                label: 'Certification Cards',
                description:
                    'Visual certification cards.',
            },
            {
                value: 'logos',
                label: 'Certification Logos',
                description:
                    'Logo-based certification display.',
            },
            {
                value: 'carousel',
                label: 'Certification Carousel',
                description:
                    'Scrollable certification showcase.',
            },
        ],
    },

    {
        value: 'global_presence',
        label: 'Global Presence',
        description:
            'Offices and geographical presence.',
        variants: [
            {
                value: 'map',
                label: 'Interactive Map',
                description:
                    'Map with location markers.',
            },
            {
                value: 'locations',
                label: 'Location Cards',
                description:
                    'Detailed office cards.',
            },
            {
                value: 'map_locations',
                label: 'Map + Locations',
                description:
                    'Map combined with office information.',
            },
            {
                value: 'carousel',
                label: 'Location Carousel',
                description:
                    'Scrollable global locations.',
            },
        ],
    },

    {
        value: 'cta',
        label: 'Call to Action',
        description:
            'Conversion-focused action section.',
        variants: [
            {
                value: 'standard',
                label: 'Standard CTA',
                description:
                    'Heading, description and action button.',
            },
            {
                value: 'banner',
                label: 'CTA Banner',
                description:
                    'Full-width promotional banner.',
            },
            {
                value: 'split',
                label: 'Split CTA',
                description:
                    'CTA combined with image or visual.',
            },
            {
                value: 'contact',
                label: 'Contact CTA',
                description:
                    'Action section focused on contact.',
            },
        ],
    },
];