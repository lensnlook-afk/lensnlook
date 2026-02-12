import React from 'react';

export default function OurStoryPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
                        A Visionary's <span className="text-neon-blue">Journey</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        "It's not just about seeing the world clearly; it's about how the world sees you."
                    </p>
                </div>

                {/* Story Content */}
                <div className="space-y-12">
                    <section className="prose prose-lg max-w-none text-gray-700">
                        <p className="text-lg leading-loose">
                            In the bustling heart of Karnataka, a young visionary named <strong className="text-neon-lime">Rahul Reddy</strong> embarked on a remarkable journey. Driven by a passion for precision and an eye for aesthetics, Rahul saw a gap in the eyewear industry—a disconnect between clinical necessity and personal style.
                        </p>

                        <p className="text-lg leading-loose">
                            He believed that glasses shouldn't just be a medical device; they should be an extension of one's personality. With this philosophy, Rahul set out to create <strong className="text-gray-900">Lens&Look</strong>, a brand that marries cutting-edge optical technology with high-fashion design.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">The Mission</h3>
                            <p className="text-gray-600">
                                To empower individuals to express their unique story through frames that fit not just their face, but their character.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">The Promise</h3>
                            <p className="text-gray-600">
                                Uncompromising quality, personalized care, and a commitment to bringing the world's finest eyewear to your doorstep.
                            </p>
                        </div>
                    </div>

                    <section className="prose prose-lg max-w-none text-gray-700">
                        <p className="text-lg leading-loose">
                            Today, Rahul's journey continues to inspire. From a small idea to a growing movement, Lens&Look stands as a testament to what happens when passion meets purpose. Every pair of glasses we dispense carries a piece of that initial spark—a promise of clarity, confidence, and style.
                        </p>
                        <p className="text-xl font-bold text-center mt-12 text-neon-blue">
                            Welcome to the new era of vision.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
