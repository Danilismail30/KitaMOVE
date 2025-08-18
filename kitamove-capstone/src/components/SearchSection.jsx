import React from 'react';

const SearchSection = () => {
    return (
        <section className="bg-brand-background py-20 md:py-24">
            <div className="container mx-auto px-6 text-center max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Find Your Next Home
                </h2>
                <p className="text-gray-600 mb-8">
                    Search for houses and apartments for rent in Kota Kinabalu.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search for townships, locations, or property types..."
                        className="flex-grow text-lg px-6 py-4 rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-shadow"
                    />
                    <button
                        type="submit"
                        className="bg-brand-orange text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg hover:bg-brand-orange-dark transition-all transform hover:scale-105"
                    >
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
};

export default SearchSection;