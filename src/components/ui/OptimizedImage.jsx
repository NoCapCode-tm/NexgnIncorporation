import React, { useState } from 'react';

export const OptimizedImage = ({ 
  src,           // Fallback standard image (e.g., .png or .jpg)
  webpSrc,       // Next-Gen optimized image (e.g., .webp)
  alt,           // Mandatory for ADA compliance
  width,         // Mandatory to prevent CLS
  height,        // Mandatory to prevent CLS
  className = '', 
  loading = 'lazy' // 'eager' for hero images, 'lazy' for everything else
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      style={{ 
        width: width, 
        height: height, 
        overflow: 'hidden', 
        position: 'relative',
        backgroundColor: '#F3F4F6' // Subtle gray placeholder while loading
      }} 
      className={className}
    >
      <picture>
        {/* Browser will try to use the WebP image first (70% smaller file size) */}
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        
        {/* Fallback to standard PNG/JPG if on a very old browser (Safari 13 or older) */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out' // Smooth fade-in effect
          }}
        />
      </picture>
    </div>
  );
};