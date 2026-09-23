import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
    fullScreen = false,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
    fullScreen?: boolean;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            fullScreen={fullScreen}
        >
            {children}
        </AuthLayoutTemplate>
    );
}