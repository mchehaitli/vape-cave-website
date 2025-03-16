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
      <div className="p-5 flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <h3 className="text-xl font-bold text-white">{category}</h3>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="relative h-32 flex-grow overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <div className="h-16 flex items-center justify-center mb-2">
                <img 
                  src={currentBrand.image} 
                  alt={currentBrand.name} 
                  className="h-full object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-primary mb-1">{currentBrand.name}</h4>
              <p className="text-sm text-gray-300">{currentBrand.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {brands.length > 1 && (
        <div className="flex justify-center p-2 space-x-2 bg-black/30">
          {brands.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
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