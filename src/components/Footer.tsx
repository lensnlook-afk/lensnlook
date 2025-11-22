import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Lens&Look</h3>
                        <p className="text-gray-400 text-sm">
                            Your premium eyewear destination.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">About</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="/our-story" className="hover:text-white transition-colors">
                                    Our Story
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Social</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/lens_n_look_badami/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="https://www.facebook.com/people/Lens-n-Look/61576364800475/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Lens&Look. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
