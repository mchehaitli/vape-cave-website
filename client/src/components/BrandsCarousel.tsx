import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ApiBrand {
  id: number;
  categoryId: number;
  name: string;
  image: string;
  description: string;
  displayOrder?: number;
  createdAt?: string;
}

interface Brand {
  name: string;
  image: string;
  description: string;
}

interface BrandsCarouselProps {
  category: string;
  brands: Brand[] | ApiBrand[];
  intervalMs?: number;
  bgClass?: string;
}

const BrandsCarousel = ({ 
  category, 
  brands, 
  intervalMs = 5000, 
  bgClass = "bg-gray-800" 
}: BrandsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only autoplay when not hovered
    if (!isHovered && brands.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
      }, intervalMs);
      
      return () => clearInterval(interval);
    }
    return () => {};
  }, [brands.length, intervalMs, isHovered]);

  if (brands.length === 0) {
    return null;
  }

  const currentBrand = brands[currentIndex];

  return (
    <div 
      className={`rounded-xl overflow-hidden shadow-lg h-full flex flex-col ${bgClass} transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-2 flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <h3 className="text-base font-bold text-white">{category}</h3>
      </div>
      
      <div className="p-0 flex-grow flex flex-col">
        <div className="relative min-h-[550px] flex-grow overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-between text-center px-2 py-2"
            >
              <div className="h-[480px] sm:h-[500px] md:h-[520px] w-full flex items-center justify-center p-0">
                <img 
                  src={currentBrand.image} 
                  alt={currentBrand.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="mt-1 min-h-[40px] w-full flex flex-col justify-start">
                <div className="bg-black/50 px-2 py-0.5 rounded mb-0.5 w-full">
                  <h4 className="text-base font-semibold text-primary line-clamp-1">{currentBrand.name}</h4>
                </div>
                <p className="text-xs text-gray-300 line-clamp-1 px-1">{currentBrand.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {brands.length > 1 && (
        <div className="flex justify-center p-1 space-x-1.5 bg-black/30">
          {brands.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary scale-125' : 'bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsCarousel;