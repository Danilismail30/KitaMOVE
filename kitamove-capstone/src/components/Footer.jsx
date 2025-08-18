import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 text-gray-800">
            <div className="container mx-auto px-6 py-8 max-w-5xl">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-gray-600 mb-4 sm:mb-0">
                        &copy; 2024 KitaMOVE. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Facebook</a>
                        <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Instagram</a>
                        <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;