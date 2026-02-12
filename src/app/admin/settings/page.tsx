export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Database Connection</h2>
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-blue-800 text-sm font-medium">
                            Status: Safe Mode (Local Storage)
                        </p>
                        <p className="text-blue-600 text-xs mt-1">
                            The application is currently using local file systems for data storage. To sync with the cloud, please ensure your Supabase keys are correctly set in the .env.local file.
                        </p>
                    </div>

                    <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-medium">Automatic Backups</p>
                                <p className="text-sm text-gray-500">Keep local products.json in sync</p>
                            </div>
                            <div className="w-12 h-6 bg-teal-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
