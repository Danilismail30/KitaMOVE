import React from 'react';
import { Link } from 'react-router-dom';
import './Services.css'; // Import the custom CSS

// Import icons/images for services
import houseMovingIcon from '../assets/moving.png';
import lorryRentalIcon from '../assets/moving2.png';
import houseSearchIcon from '../assets/moving3.png';

const Services = () => {
    return (
        <section className="bg-white py-20 md:py-24">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Core Services</h2>
                    <p className="text-gray-600 mt-2">Everything you need for a smooth move.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Service Card 1 - House Moving */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden service-card">
                        <div className="p-6 flex flex-col h-full">
                            <div className="service-image-container">
                                <img 
                                    src={houseMovingIcon} 
                                    alt="House Moving Service" 
                                    className="service-image"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">House Moving</h3>
                            <p className="text-gray-600 mb-6">Complete house moving packages to make your relocation easy and stress-free.</p>
                            <Link to="/services/moving" className="font-bold text-brand-orange hover:text-brand-orange-dark transition-colors mt-auto flex items-center">
                                Learn More <span className="ml-1">→</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Service Card 2 - Lorry Rental */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden service-card">
                        <div className="p-6 flex flex-col h-full">
                            <div className="service-image-container">
                                <img 
                                    src={lorryRentalIcon} 
                                    alt="Lorry Rental Service" 
                                    className="service-image"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Lorry Rental</h3>
                            <p className="text-gray-600 mb-6">Rent a lorry with a driver for your moving needs. Various sizes available.</p>
                            <Link to="/services/lorry" className="font-bold text-brand-orange hover:text-brand-orange-dark transition-colors mt-auto flex items-center">
                                Learn More <span className="ml-1">→</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Service Card 3 - House Rental Search */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden service-card">
                        <div className="p-6 flex flex-col h-full">
                            <div className="service-image-container">
                                <img 
                                    src={houseSearchIcon} 
                                    alt="House Rental Search Service" 
                                    className="service-image"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">House Rental Search</h3>
                            <p className="text-gray-600 mb-6">Find your next home in Kota Kinabalu. Search listings for houses and apartments.</p>
                            <Link to="/services/rental" className="font-bold text-brand-orange hover:text-brand-orange-dark transition-colors mt-auto flex items-center">
                                Learn More <span className="ml-1">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;