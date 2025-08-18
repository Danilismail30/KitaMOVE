import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Hero from '../components/Hero';
import Services from '../components/Services';
import SearchSection from '../components/SearchSection';
import HandpickedListings from '../components/HandpickedListings';

const Home = () => {
    // We need to modify the Hero component to accept a Link
    // For now, let's update the Hero component directly.
    return (
        <>
            <Hero />
            <Services />
            <HandpickedListings />
            <SearchSection />
        </>
    );
};

export default Home;