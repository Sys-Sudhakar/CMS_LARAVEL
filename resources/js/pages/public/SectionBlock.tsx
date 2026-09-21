import type { ReactNode } from 'react';

interface SectionBlockProps {
    eyebrow?: string;
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}

export default function SectionBlock({
    eyebrow,
    title,
    description,
    children,
    className = '',
    contentClassName = '',
}: SectionBlockProps) {
    return (
        <section className={`public-page-section ${className}`}>
            <div className="public-section-container">
                <div className="public-content-block">
                    <div className={`public-content-block-inner ${contentClassName}`}>
                        {(eyebrow || title || description) && (
                            <div className="public-section-heading mb-10">
                                {eyebrow && (
                                    <span className="public-section-eyebrow">
                                        {eyebrow}
                                    </span>
                                )}

                                {title && (
                                    <h2 className="public-section-title">
                                        {title}
                                    </h2>
                                )}

                                {description && (
                                    <p className="public-section-description">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}