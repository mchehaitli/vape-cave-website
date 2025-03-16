import { useState, useEffect, useMemo } from 'react';
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
  debug?: boolean; // Show auto-sizing parameters for testing
}

const BrandsCarousel = ({ 
  category, 
  brands, 
  intervalMs = 5000, 
  bgClass = "bg-gray-800",
  debug = false
}: BrandsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, sizeClass: '' });

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
  
  // Dynamically calculate text size and layout based on description length and word count
  // For debug mode - capture metrics about the description text
  const descriptionMetrics = useMemo(() => {
    if (!currentBrand.description) {
      return { 
        length: 0, 
        wordCount: 0, 
        sizeCategory: "none"
      };
    }
    const description = currentBrand.description.trim();
    const length = description.length;
    const wordCount = description.split(/\s+/).length;
    
    let sizeCategory = "very short";
    if (length === 0) sizeCategory = "empty";
    else if (length < 40 || wordCount < 6) sizeCategory = "very short";
    else if (length < 80 || wordCount < 12) sizeCategory = "short";
    else if (length < 160 || wordCount < 25) sizeCategory = "medium";
    else if (length < 250 || wordCount < 40) sizeCategory = "long";
    else sizeCategory = "very long";
    
    return { length, wordCount, sizeCategory };
  }, [currentBrand.description]);
    
  const textStyles = useMemo(() => {
    if (!currentBrand.description) {
      return {
        containerHeight: "min-h-[30px]",
        imageHeight: "h-[520px] sm:h-[540px] md:h-[560px]",
        fontSize: "text-sm",
        lineClamp: "line-clamp-1",
        padding: "py-2"
      };
    }
    
    const description = currentBrand.description.trim();
    const descLength = description.length;
    const wordCount = description.split(/\s+/).length;
    
    // No description text
    if (descLength === 0) {
      return {
        containerHeight: "min-h-[30px]",
        imageHeight: "h-[520px] sm:h-[540px] md:h-[560px]",
        fontSize: "text-sm",
        lineClamp: "line-clamp-1",
        padding: "py-2"
      };
    }
    
    // Very short description (< 40 chars or < 6 words)
    if (descLength < 40 || wordCount < 6) {
      return {
        containerHeight: "min-h-[50px]",
        imageHeight: "h-[490px] sm:h-[510px] md:h-[530px]",
        fontSize: "text-base",
        lineClamp: "line-clamp-1",
        padding: "py-2"
      };
    }
    // Short description (< 80 chars or < 12 words)
    else if (descLength < 80 || wordCount < 12) {
      return {
        containerHeight: "min-h-[70px]",
        imageHeight: "h-[470px] sm:h-[490px] md:h-[510px]",
        fontSize: "text-sm",
        lineClamp: "line-clamp-2",
        padding: "py-2"
      };
    }
    // Medium description (< 160 chars or < 25 words)
    else if (descLength < 160 || wordCount < 25) {
      return {
        containerHeight: "min-h-[90px]",
        imageHeight: "h-[450px] sm:h-[470px] md:h-[490px]",
        fontSize: "text-sm",
        lineClamp: "line-clamp-3",
        padding: "py-2"
      };
    }
    // Long description (< 250 chars or < 40 words)
    else if (descLength < 250 || wordCount < 40) {
      return {
        containerHeight: "min-h-[110px]",
        imageHeight: "h-[430px] sm:h-[450px] md:h-[470px]",
        fontSize: "text-xs",
        lineClamp: "line-clamp-4",
        padding: "py-2"
      };
    }
    // Very long description
    else {
      return {
        containerHeight: "min-h-[130px]",
        imageHeight: "h-[410px] sm:h-[430px] md:h-[450px]",
        fontSize: "text-xs",
        lineClamp: "line-clamp-5",
        padding: "py-2"
      };
    }
  }, [currentBrand.description]);

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
        <div className="relative min-h-[600px] flex-grow overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-between text-center px-2 py-2"
            >
              <div 
                className={`${textStyles.imageHeight} w-full flex items-center justify-center p-0 transition-all duration-300`}
                style={{ minHeight: "350px" }}
              >
                <img 
                  src={currentBrand.image} 
                  alt={currentBrand.name} 
                  className="brand-image w-auto h-auto max-w-full max-h-full object-contain brand-image-medium"
                  style={{ 
                    minWidth: "200px", 
                    minHeight: "200px"
                  }}
                  onLoad={(e) => {
                    // Dynamically detect image size and apply appropriate scaling class
                    const img = e.target as HTMLImageElement;
                    let sizeClass = '';
                    
                    if (img.naturalWidth < 300 || img.naturalHeight < 300) {
                      sizeClass = 'brand-image-small';
                      img.classList.add('brand-image-small');
                      img.classList.remove('brand-image-medium', 'brand-image-large');
                    } else if (img.naturalWidth < 600 || img.naturalHeight < 600) {
                      sizeClass = 'brand-image-medium';
                      img.classList.add('brand-image-medium');
                      img.classList.remove('brand-image-small', 'brand-image-large');
                    } else {
                      sizeClass = 'brand-image-large';
                      img.classList.add('brand-image-large');
                      img.classList.remove('brand-image-small', 'brand-image-medium');
                    }
                    
                    // Store dimensions for debug panel
                    setImageDimensions({
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                      sizeClass
                    });
                  }}
                />
              </div>
              <div className={`mt-1 ${textStyles.containerHeight} w-full flex flex-col justify-start transition-all duration-300`}>
                <div className="bg-black/70 px-3 py-2 rounded-t w-full">
                  <h4 className="text-lg md:text-xl font-bold text-primary line-clamp-1">{currentBrand.name}</h4>
                </div>
                {currentBrand.description && (
                  <div className={`bg-black/50 px-3 ${textStyles.padding} rounded-b w-full transition-all duration-300`}>
                    <p className={`${textStyles.fontSize} text-white ${textStyles.lineClamp} transition-all duration-300`}>
                      {currentBrand.description}
                    </p>
                  </div>
                )}
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
      
      {/* Debug panel showing auto-sizing metrics */}
      {debug && (
        <div className="bg-black/80 text-white text-xs p-2 absolute top-0 right-0 z-50 rounded-bl overflow-auto max-w-[250px] text-left">
          <div className="font-bold mb-1">Auto-sizing Debug:</div>
          <div className="mt-1 font-semibold">Image:</div>
          <div>Dimensions: {imageDimensions.width}×{imageDimensions.height}px</div>
          <div>Size Class: {imageDimensions.sizeClass}</div>
          <div>Scale: {imageDimensions.sizeClass === 'brand-image-small' ? '1.4x' : 
                       imageDimensions.sizeClass === 'brand-image-medium' ? '1.2x' : '1.05x'}</div>
          
          <div className="mt-1 font-semibold">Description:</div>
          <div>Length: {descriptionMetrics.length} chars</div>
          <div>Words: {descriptionMetrics.wordCount}</div>
          <div>Size: {descriptionMetrics.sizeCategory}</div>
          
          <div className="mt-1 font-semibold">Styles applied:</div>
          <div>Container: {textStyles.containerHeight}</div>
          <div>Image: {textStyles.imageHeight}</div>
          <div>Font: {textStyles.fontSize}</div>
          <div>Lines: {textStyles.lineClamp}</div>
        </div>
      )}
    </div>
  );
};

export default BrandsCarousel;