import type { ReactNode } from 'react';
import Footer from '@/components/theme/Footer';
import Header from '@/components/theme/Header';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({
    children,
}: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-white text-slate-800">

            {/* Public Website Header */}
            <Header />

            {/* Public Website Content */}
            <main className="min-h-[60vh]">
                {children}
            </main>

            {/* Public Website Footer */}
            <Footer />

        </div>
    );
}