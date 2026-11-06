import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import useBlogAnimations from '../../hooks/useBlogAnimations';
import styles from './Blog.module.css';

// Import the specific CTA image
import ctaOtherImg from '../../assets/common/cta.png';

const CATEGORIES = ['View All', 'Engineering', 'Design', 'Security', 'Workflows', 'Legal & Compliance', 'Sustainability'];

const FEATURED_POST = {
  id: 'feat-1',
  title: 'Building Trust at Scale: The Architecture Behind Secure Document Signing',
  excerpt: 'Building trust at scale requires more than just digital signatures. It is an evolving process to reduce friction while ensuring document integrity and standardizing legal frameworks. Discover how getting the architecture right is critical.',
  author: 'Megan Allen',
  date: '5d ago',
  readTime: '5 min read',
  category: 'Engineering',
  slug: 'building-trust-at-scale',
  image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
};

const POSTS = [
  {
    id: 1,
    title: 'Building Trust at Scale: The Architecture Behind Secure Document Signing',
    excerpt: 'Building trust at scale requires more than just digital signatures. Discover how getting the architecture right is critical.',
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
    category: 'Legal & Compliance',
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
    category: 'Engineering',
    slug: 'webhooks-vs-polling',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'Sustainable Code: Reducing Data Center Emissions',
    excerpt: 'We measure everything from node process memory to payload reduction to lower our cloud footprint.',
    author: 'Yash Sharma',
    date: '28 Sep 2026',
    category: 'Sustainability',
    slug: 'sustainable-code-reductions',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: 'Automating Legal Reviews with AI Models',
    excerpt: 'How to safely integrate LLMs into legal drafting without compromising enterprise data borders.',
    author: 'Divyanshu Rai',
    date: '14 Sep 2026',
    category: 'Workflows',
    slug: 'automating-legal-reviews',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const TEAM = [
  { name: 'Odin O.', role: 'Founder, Product Lead & Chief Executive Officer (CEO)', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
  { name: 'Noar Z.', role: 'Chief Technology Officer (CTO) | Vice President, Engineering', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Robert Y.', role: 'Chief Design Officer (CDO) | Head of Design', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
  { name: 'Nia P.', role: 'Chief Strategy & Sustainability Officer | Strategy & Innovation Lead', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' }
];

const PRESS_RELEASES = [
  { id: 1, title: 'Nexgn Announces $10M Series A Funding to scale AI', date: 'November 1, 2026', img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&q=80' },
  { id: 2, title: 'Nexgn Public Beta Launched Globally', date: 'September 20, 2026', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  { id: 3, title: 'Nexgn Introduces Zero-Trust Updates', date: 'August 14, 2026', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80' },
];

const Blog = () => {
  const { t } = useTranslation();
  const { lng } = useParams();
  const [activeCategory, setActiveCategory] = useState('View All');
  const [email, setEmail] = useState('');
  const rootRef = useRef(null);

  useBlogAnimations(rootRef, { lng });

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  const filteredPosts = activeCategory === 'View All' 
    ? POSTS 
    : POSTS.filter(post => post.category === activeCategory);

  const seoTitle = 'Blog & Press | Nexgn';
  const seoDescription = 'Read the latest insights from the Nexgn engineering and legal teams regarding secure infrastructure, eSignature compliance, and company press releases.';

  return (
    <div className={styles.page} ref={rootRef}>
      <SEOHead title={seoTitle} description={seoDescription} url="/blog" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero} data-b="hero">
        <div className={styles.heroBg} data-b="photo" aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow} data-b="hr">YOUR UPDATES</p>
            <h1 className={styles.heroTitle} data-b="hr">
              Blog & <span className={styles.red}>Press</span>
            </h1>
            <p className={styles.heroLead} data-b="hr">
              Insights on digital trust, secure infrastructure, and<br/>the future of document automation.
            </p>

            <form onSubmit={handleSubscribe} className={styles.subscribeForm} data-b="hr">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.subscribeInput}
                aria-label="Email address"
              />
              <button type="submit" className={styles.subscribeBtn} data-hv="btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ 2. FEATURED BLOG ============ */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle} data-b="head">Feature Blog</h2>
          
          <div className={styles.featuredCard} data-b="item" data-hv="card">
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
                Read Post <FiArrowRight data-hv="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 3. CATEGORY TABS & GRID ============ */}
      <section className={styles.gridSection}>
        <div className={styles.container}>
          
          {/* Tabs */}
          <div className={styles.tabsWrapper} data-b="head">
            <ul className={styles.tabs}>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button 
                    type="button"
                    className={`${styles.tabBtn} ${activeCategory === cat ? styles.tabActive : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Grid */}
          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <div key={post.id} className={styles.postCard} data-b="item" data-hv="card">
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
                    Read Post <FiArrowRight data-hv="arrow" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className={styles.loadMoreWrapper} data-b="head">
              <button type="button" className={styles.loadMoreBtn} data-hv="btn">
                Load more
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ============ 4. NEXGN IN THE NEWS ============ */}
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter} data-b="head">Nexgn in the News</h2>
          <div className={styles.newsCard} data-b="item">
            <div className={styles.newsContent}>
              <h3 className={styles.newsTitle}>To find out more about Nexgn in the news or press releases</h3>
              <p className={styles.newsText}>Drop us a note at hello@nexgn.cloud</p>
              <a href="mailto:hello@nexgn.cloud" className={styles.newsBtn} data-hv="btn">Reach out</a>
            </div>
            <div className={styles.newsImgWrapper}>
              <img 
                src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Nexgn News" 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. MEET OUR TEAM ============ */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2 className={styles.subSectionTitle} data-b="head">Meet Our Team</h2>
          <div className={styles.teamGrid}>
            {TEAM.map((member) => (
              <div key={member.name} className={styles.teamCard} data-b="item">
                <div className={styles.teamImgWrapper}>
                  <img src={member.img} alt={member.name} loading="lazy" />
                </div>
                <h4 className={styles.teamName}>{member.name}</h4>
                <p className={styles.teamRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. PRESS RELEASE ============ */}
      <section className={styles.pressSection}>
        <div className={styles.container}>
          <h2 className={styles.subSectionTitle} data-b="head">Press Release</h2>
          <div className={styles.pressGrid}>
            {PRESS_RELEASES.map((press) => (
              <div key={press.id} className={styles.pressCard} data-b="item" data-hv="card">
                <Link to={`/blog/press-${press.id}`} className={styles.pressImgLink}>
                  <div className={styles.pressImgWrapper}>
                    <img src={press.img} alt={press.title} loading="lazy" />
                  </div>
                </Link>
                <h4 className={styles.pressTitle}>
                  <Link to={`/blog/press-${press.id}`}>{press.title}</Link>
                </h4>
                <p className={styles.pressDate}>{press.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. CTA BANNER ============ */}
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