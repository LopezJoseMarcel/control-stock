import './globals.css';

export const metadata = {
    title: 'Control de Stock',
    description: 'Aplicación de gestión de inventarios',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="bg-gray-100">
                <div className="max-w-7xl mx-auto p-4">
                    <nav className=" flex gap-4 mb-4">
                        <a href="/dashboard" className="text-xl font-bold text-blue-500">Dashboard</a>
                        <a href="/analytics" className="text-xl font-bold text-blue-500">Analytics</a>
                    </nav>
                    {children}
                </div>
            </body>
        </html>
    );
}
