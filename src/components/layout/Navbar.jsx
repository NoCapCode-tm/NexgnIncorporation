import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { FileSignature, FileEdit, Files, Bot, ShieldCheck, Fingerprint, Users, HardDrive } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const timeoutRef = useRef(null);

  // Helper to get the correct URL prefix based on language
  const langPrefix = i18n.resolvedLanguage === 'en' ? '' : `/${i18n.resolvedLanguage}`;

  // 150ms delay logic to prevent accidental hover flashes
  const handleMouseEnter = (menuName) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(menuName);
    }, 150);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  // Close menu when route changes
  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        
        {/* Logo */}
        <Link to={`${langPrefix}/`} className={styles.logo}>
          Nexgn<span className={styles.logoDot}>.</span>
        </Link>

        {/* Main Navigation Links */}
        <ul className={styles.navLinks}>
          
          {/* =========================================
              PRODUCT MEGA MENU
              ========================================= */}
          <li 
            className={styles.navItem}
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            {t('navbar.products', 'Products')}
            
            <AnimatePresence>
              {activeMenu === 'products' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={styles.megaMenu}
                >
                  {/* Column 1: Core */}
                  <div className={styles.menuColumn}>
                    <h4>Core Agreement</h4>
                    <Link to={`${langPrefix}/products/esignature`} className={styles.menuLink}>
                      <FileSignature size={24} className={styles.menuIcon} />
                      <div>
                        <div className={styles.menuTitle}>eSignature</div>
                        <div className={styles.menuDesc}>Sign agreements without friction or accounts.</div>
                      </div>
                    </Link>
                    <Link to={`${langPrefix}/products/document-editor`} className={styles.menuLink}>
                      <FileEdit size={24} className={styles.menuIcon} />
                      <div>
                        <div className={styles.menuTitle}>Document Editor</div>
                        <div className={styles.menuDesc}>Drag and drop fields onto any PDF.</div>
                      </div>
                    </Link>
                    <Link to={`${langPrefix}/products/templates`} className={styles.menuLink}>
                      <Files size={24} className={styles.menuIcon} />
                      <div>
                        <div className={styles.menuTitle}>Templates</div>
                        <div className={styles.menuDesc}>Stop rebuilding the same contracts.</div>
                      </div>
                    </Link>
                  </div>

                  {/* Column 2: Intelligence */}
                  <div className={styles.menuColumn}>
                    <h4>Intelligence</h4>
                    <Link to={`${langPrefix}/products/ai-summary`} className={styles.menuLink}>
                      <Bot size={24} className={styles.menuIcon} />
                      <div>
                        <div className={styles.menuTitle}>AI Summary</div>
                        <div className={styles.menuDesc}>Turn 50-page contracts into 5 bullet points.</div>
                      </div>
                    </Link>
                  </div>

                  {/* Column 3: Trust & Workspace */}
                  <div className={styles.menuColumn}>
                    <h4>Trust & Ops</h4>
                    <Link to={`${langPrefix}/trust/security`} className={styles.menuLink}>
                      <ShieldCheck size={24} className={styles.menuIcon} />
                      <div>
                        <div className={styles.menuTitle}>Audit Trail</div>
                        <div className={styles.menuDesc}>Cryptographic proof for every signature.</div>
                      </div>
                    </Link>
                    <Link to={`${langPrefix}/products/workspace`} className={styles.menuLink}>
                      <Users size={24} className={styles.menuIcon} />
                      <div>
                        <div className={styles.menuTitle}>Team Workspace</div>
                        <div className={styles.menuDesc}>Granular RBAC and admin controls.</div>
                      </div>
                    </Link>
                    <Link to={`${langPrefix}/products/storage`} className={styles.menuLink}>
                      <HardDrive size={24} className={styles.menuIcon} />
                      <div>
                        <div className={styles.menuTitle}>Cloud Storage</div>
                        <div className={styles.menuDesc}>Directly sync to your Google Drive.</div>
                      </div>
                    </Link>
                  </div>

                  {/* Column 4: Featured Promo */}
                  <div className={styles.featuredCard}>
                    <h4>What's New</h4>
                    <div style={{ marginTop: '12px' }}>
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>Nexgn AI is here.</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: '16px' }}>
                        Discover how our new AI Clause Assistant is changing legal review.
                      </p>
                      <Link to={`${langPrefix}/products/ai-clause-assistant`} style={{ color: 'var(--nexgn-red)', fontWeight: '600', fontSize: '0.9rem' }}>
                        Read Announcement &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* You would duplicate the <li> structure above for Solutions, Developers, Trust, etc. */}
          <li className={styles.navItem}>
             <Link to={`${langPrefix}/pricing`}>{t('navbar.pricing', 'Pricing')}</Link>
          </li>
        </ul>

        {/* Call to Actions & Auth */}
        <div className={styles.navActions}>
          {/* Example Language Switcher (Optional, just to show i18n usage) */}
          <select 
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.resolvedLanguage}
            style={{ border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginRight: '16px' }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="hi">HI</option>
          </select>

          <Link to="/login" className={styles.loginBtn}>
            {t('navbar.login', 'Log In')}
          </Link>
          <Link to="/register">
            <button className={styles.signupBtn}>
              {t('navbar.signup', 'Start Free')}
            </button>
          </Link>
        </div>
        
      </div>
    </nav>
  );
}