// src/pages/core/Home.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/seo/SEOHead';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* We keep SEO tags in English for global ranking, or dynamic based on language state */}
      <SEOHead 
        title="Home" 
        description={t('home.hero_subtitle')} 
        url="/" 
      />
      
      <header className="hero-section">
        <h1>{t('home.hero_title')}</h1>
        <p>{t('home.hero_subtitle')}</p>
        
        <div className="hero-buttons">
          <button className="btn-primary">{t('home.cta_primary')}</button>
          <button className="btn-ghost">{t('home.cta_secondary')}</button>
        </div>
      </header>
    </div>
  );
};

export default Home;