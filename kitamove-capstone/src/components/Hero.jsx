import React from 'react';
import { Link } from 'react-router-dom';

// Ini swiper gambar
import { Swiper, SwiperSlide } from 'swiper/react';

// Ini swiper css
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
 
// Ini component swiper
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Ini gambar-gambar yang akan ada di-slider
import movingImg1 from '../assets/moving.png';
import movingImg2 from '../assets/moving2.png'; 
import movingImg3 from '../assets/moving3.png';

const slideImages = [movingImg1, movingImg2, movingImg3];

const Hero = () => {
    return (
        <>
            {/* Ini swiper button custom codes */}
            <style>
                {`
                    .swiper-button-next::after,
                    .swiper-button-prev::after {
                        font-size: 24px; /* Make the arrow icon smaller */
                        font-weight: 900; /* Make the arrow icon bolder */
                    }
                `}
            </style>

            <section className="bg-brand-background pt-32 pb-20 md:pt-40 md:pb-32">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-5 gap-12 items-center">
                        
                        <div className="md:col-span-2 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-4">
                                Moving made <span className="text-brand-orange">SIMPLE</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Moving is just a breeze away...
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link to="/find-lorry" className="bg-brand-orange text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105">
                                    Find my Lorry
                                </Link>
                                <a href="#" className="bg-white text-gray-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                                    Rent A House Now
                                </a>
                            </div>
                        </div>

                        <div className="md:col-span-3 hidden md:block">
                            <Swiper
                                modules={[Pagination, Navigation, Autoplay]}
                                spaceBetween={30}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                pagination={{
                                    clickable: true,
                                }}
                                navigation={true}
                                className="w-full h-96 rounded-2xl shadow-xl"
                            >
                                {slideImages.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img 
                                            src={img} 
                                            alt={`Moving illustration ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;