import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import styles from './Blog.module.css';

// Import the specific CTA image
import ctaOtherImg from '../../assets/home/cta_other.png';

/* =====================================================================
   Scroll Reveal Helpers
   ===================================================================== */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) => {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-in={inView}
      style={{ '--d': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/* =====================================================================
   Dummy Data (Replace with API/CMS data later)
   ===================================================================== */
const CATEGORIES = ['View All', 'Design', 'Security', 'Engineering', 'Operations', 'Customer Support', 'Development'];

const FEATURED_POST = {
  id: 'feat-1',
  title: 'Building Trust at Scale: The Architecture Behind Secure Document Signing',
  excerpt: 'Building trust at scale requires more than just digital signatures. It is an evolving process to reduce friction while ensuring document integrity and standardizing legal frameworks. Discover how getting the architecture right is critical.',
  author: 'Megan Allen',
  date: '5d ago',
  readTime: '5 min read',
  category: 'Engineering',
  slug: 'building-trust-at-scale',
  // Placeholder image from Unsplash
  image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
};

const POSTS = [
  {
    id: 1,
    title: 'The Shift to AES-256: Why Legacy Encryption is Failing',
    excerpt: 'Exploring the cryptographic standards necessary for modern enterprise contract lifecycle management.',
    author: 'Olivia John',
    date: '24 Oct 2026',
    category: 'Security',
    slug: 'shift-to-aes-256',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Navigating the Indian IT Act 2000 for SaaS Providers',
    excerpt: 'A comprehensive breakdown of Section 65B and how to ensure your digital signatures are court-admissible.',
    author: 'Olivia John',
    date: '18 Oct 2026',
    category: 'Legal',
    slug: 'navigating-it-act-2000',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Designing Frictionless Workflows for Enterprise HR',
    excerpt: 'How optimizing the onboarding document flow can increase employee retention and reduce admin overhead.',
    author: 'Sarah Chen',
    date: '12 Oct 2026',
    category: 'Design',
    slug: 'designing-frictionless-workflows',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Webhooks vs Polling: Building Real-Time Integrations',
    excerpt: 'Architectural patterns for syncing document statuses between Nexgn and your internal CRMs.',
    author: 'Michael Torres',
    date: '05 Oct 2026',
    category: 'Development',
    slug: 'webhooks-vs-polling',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

/* =====================================================================
   Page Component
   ===================================================================== */
const Blog = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('View All');
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  const filteredPosts = activeCategory === 'View All' 
    ? POSTS 
    : POSTS.filter(post => post.category === activeCategory);

  const seoTitle = 'Nexgn Blog | Insights on Digital Trust & Automation';
  const seoDescription = 'Read the latest insights from the Nexgn engineering and legal teams regarding secure infrastructure, eSignature compliance, and document automation.';

  return (
    <div className={styles.page}>
      <SEOHead title={seoTitle} description={seoDescription} url="/blog" />

      {/* ============ 1. HERO (Subscribe) ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.container}>
          <Reveal className={styles.heroContent}>
            <p className={styles.eyebrow}>YOUR UPDATES</p>
            <h1 className={styles.heroTitle}>
              Nexgn <span className={styles.red}>Blog</span>
            </h1>
            <p className={styles.heroLead}>
              Insights on digital trust, secure infrastructure, and<br/>the future of document automation.
            </p>

            <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.subscribeInput}
              />
              <button type="submit" className={styles.subscribeBtn}>
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ============ 2. FEATURED BLOG ============ */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <Reveal>
            <h2 className={styles.sectionTitle}>Feature Blog</h2>
          </Reveal>
          
          <Reveal className={styles.featuredCard} delay={100}>
            <div className={styles.featuredImgWrapper}>
              <img src={FEATURED_POST.image} alt={FEATURED_POST.title} className={styles.featuredImg} />
            </div>
            <div className={styles.featuredContent}>
              <h3 className={styles.featuredTitle}>{FEATURED_POST.title}</h3>
              <p className={styles.featuredExcerpt}>{FEATURED_POST.excerpt}</p>
              
              <div className={styles.featuredMeta}>
                <span className={styles.featuredAuthor}>{FEATURED_POST.author}.</span>
                <span className={styles.featuredDate}>{FEATURED_POST.date}.</span>
                <span className={styles.featuredTime}>{FEATURED_POST.readTime}</span>
              </div>
              
              <Link to={`/blog/${FEATURED_POST.slug}`} className={styles.readMoreLink}>
                Read Post <FiArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 3. CATEGORY TABS & GRID ============ */}
      <section className={styles.gridSection}>
        <div className={styles.container}>
          
          {/* Tabs */}
          <Reveal className={styles.tabsWrapper}>
            <ul className={styles.tabs}>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button 
                    className={`${styles.tabBtn} ${activeCategory === cat ? styles.tabActive : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Grid */}
          <div className={styles.postsGrid}>
            {filteredPosts.map((post, i) => (
              <Reveal key={post.id} className={styles.postCard} delay={(i % 2) * 100}>
                <Link to={`/blog/${post.slug}`} className={styles.postImgLink}>
                  <div className={styles.postImgWrapper}>
                    <img src={post.image} alt={post.title} className={styles.postImg} loading="lazy" />
                    
                    {/* Gradient Overlay for Author/Date & Category inside the image */}
                    <div className={styles.imgOverlay}>
                      <div className={styles.imgOverlayContent}>
                        <div className={styles.postAuthorDate}>
                          <span className={styles.author}>{post.author}</span>
                          <span className={styles.date}>{post.date}</span>
                        </div>
                        <span className={styles.postBadge}>{post.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className={styles.postContent}>
                  <h3 className={styles.postTitle}>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className={styles.readMoreLink}>
                    Read Post <FiArrowRight />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <Reveal className={styles.loadMoreWrapper} delay={200}>
              <button className={styles.loadMoreBtn}>
                <FiPlus /> Load more
              </button>
            </Reveal>
          )}

        </div>
      </section>

      {/* ============ 4. CTA BANNER ============ */}
      <CtaBanner
        image={ctaOtherImg}
        title={t('cta.title', 'Start signing documents')}
        highlight={t('cta.highlight', 'signing')}
        text={t('cta.text', 'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.')}
        primary={{ label: t('cta.primary', 'Create your free account'), href: 'https://sign.nexgn.cloud/signup' }}
        secondary={{ label: t('cta.secondary', 'Login'), href: 'https://sign.nexgn.cloud/login' }}
      />
    </div>
  );
};

export default Blog;