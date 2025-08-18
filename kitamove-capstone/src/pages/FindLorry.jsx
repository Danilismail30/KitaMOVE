import React from 'react';

// Using placeholder text for icons. You can replace these with an icon library like react-icons.
const LocationIcon = () => <span className="text-gray-400">📍</span>;
const SendIcon = () => <span className="text-gray-400">➢</span>;
const CalendarIcon = () => <span className="text-gray-400">📅</span>;
const CameraIcon = () => <span className="text-gray-400">📷</span>;
const PeopleIcon = () => <span className="text-gray-400">👥</span>;
const KitaMoveLogo = () => <h1 className="text-2xl font-bold text-gray-800">KitaMove</h1>;


const FindLorry = () => {
    return (
        <div className="bg-blue-50 min-h-screen flex flex-col items-center justify-center p-4">
            <header className="text-center mb-8">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <KitaMoveLogo />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Smart Lorry Size Estimator</h2>
                <p className="text-gray-600">Enter your moving locations to get started</p>
            </header>

            {/* Stepper */}
            <div className="flex items-center justify-center w-full max-w-md mb-8">
                <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                        <LocationIcon />
                    </div>
                    <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
                    <div className="bg-white border-2 border-gray-300 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
                        <CameraIcon />
                    </div>
                    <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>
                    <div className="bg-white border-2 border-gray-300 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
                        <PeopleIcon />
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <main className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <LocationIcon /> Moving Locations
                </h3>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">Moving From</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LocationIcon />
                            </div>
                            <input type="text" id="from" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="c" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">Moving To</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SendIcon />
                            </div>
                            <input type="text" id="to" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Enter destination address (e.g., Penampang, Sabah)" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Moving Date</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon />
                            </div>
                            <input type="text" id="date" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="dd/mm/yyyy" />
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:opacity-90 transition-opacity">
                            Calculate Distance & Continue
                        </button>
                        <p className="text-xs text-gray-500 mt-3">Please fill in all fields to continue</p>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default FindLorry;