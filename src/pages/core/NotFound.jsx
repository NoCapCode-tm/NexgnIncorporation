import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';
import useNotFoundAnimations from '../../hooks/useNotFoundAnimations';
import styles from './NotFound.module.css';

// Ensure you export the line-art illustration from Figma to this path
import illustration404 from '../../assets/core/404-illustration.svg';

const NotFound = () => {
  const { t } = useTranslation();
  const rootRef = useRef(null);

  // Initialize GSAP animations
  useNotFoundAnimations(rootRef);

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead 
        title="Page Not Found | Nexgn" 
        description="The page you are looking for does not exist or has been moved." 
      />
      
      <div className={styles.container}>
        <img 
          src={illustration404} 
          alt="404 Page Not Found" 
          className={styles.illustration} 
          data-nf="img" 
        />
        
        <h1 className={styles.title} data-nf="text">
          {t('notfound.title', 'Page Not Found')}
        </h1>
        
        <p className={styles.desc} data-nf="text">
          {t('notfound.desc1', 'Sorry we are having some technical issue.')}
          <br />
          {t('notfound.desc2', 'Try to refresh the page, after a while.')}
        </p>
        
        {/* Navigates back to the current language's homepage root */}
        <Link to="/" className={styles.btn} data-nf="text">
          {t('notfound.button', 'Try again')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;