export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen pt-4">
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}
