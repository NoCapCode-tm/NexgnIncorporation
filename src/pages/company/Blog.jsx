import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { SEOHead } from '../../components/seo/SEOHead';
import CtaBanner from '../../components/common/CtaBanner';
import BlogPostTemplate from '../../components/blog/BlogPostTemplate';
import useBlogAnimations from '../../hooks/useBlogAnimations';
import blogsData from './blogsData.json';
import styles from './Blog.module.css';

import ctaOtherImg from '../../assets/common/cta-blog.png';

const LANGS = ['en', 'es', 'hi'];

const CATEGORIES = blogsData.categories || [];
const ARTICLES = blogsData.articles || [];
const TEAM = blogsData.team || [];
const PRESS_RELEASES = blogsData.pressReleases || [];

const FEATURED_POST = ARTICLES.find((a) => a.featured) || ARTICLES[0];
const GRID_POSTS = ARTICLES.filter((a) => a.slug !== FEATURED_POST?.slug);

const Blog = () => {
  const { t } = useTranslation();
  const { lng, slug } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path.startsWith('/') ? path : `/${path}`}`;

  const [activeCategory, setActiveCategory] = useState('View All');
  const [email, setEmail] = useState('');
  const rootRef = useRef(null);

  useBlogAnimations(rootRef, { lng: currentLng, slug });

  // When URL is /:lng/blog/:slug -> render the dynamic BlogPostTemplate
  if (slug) {
    return <BlogPostTemplate backTo="/blog" backLabel="Go To Blog Page" />;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail('');
  };

  const filteredPosts =
    activeCategory === 'View All'
      ? GRID_POSTS
      : GRID_POSTS.filter((post) => post.category === activeCategory);

  const seoTitle = 'Blog & Press | Nexgn';
  const seoDescription =
    'Read the latest insights from the Nexgn engineering and legal teams regarding secure infrastructure, eSignature compliance, and company press releases.';

  return (
    <div className={styles.page} ref={rootRef}>
      <div className={styles.progress} data-b="progress" aria-hidden="true" />
      <SEOHead title={seoTitle} description={seoDescription} url="/blog" />

      {/* ============ 1. HERO ============ */}
      <section className={styles.hero} data-b="hero">
        <div className={styles.heroBg} data-b="photo" aria-hidden="true" />
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow} data-b="hr">
              YOUR UPDATES
            </p>
            <h1 className={styles.heroTitle} data-b="hr">
              Blog & <span className={styles.red}>Press</span>
            </h1>
            <p className={styles.heroLead} data-b="hr">
              Insights on digital trust, secure infrastructure, and
              <br />
              the future of document automation.
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
      {FEATURED_POST && (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle} data-b="head">
              Feature Blog
            </h2>

            <div className={styles.featuredCard} data-b="item" data-hv="card">
              <Link
                to={withLng(`/blog/${FEATURED_POST.slug}`)}
                className={styles.featuredImgWrapper}
              >
                <img
                  src={FEATURED_POST.image}
                  alt={FEATURED_POST.title}
                  className={styles.featuredImg}
                />
              </Link>
              <div className={styles.featuredContent}>
                <h3 className={styles.featuredTitle}>
                  <Link to={withLng(`/blog/${FEATURED_POST.slug}`)}>
                    {FEATURED_POST.title}
                  </Link>
                </h3>
                <p className={styles.featuredExcerpt}>{FEATURED_POST.excerpt}</p>

                <div className={styles.featuredMeta}>
                  <span className={styles.featuredAuthor}>{FEATURED_POST.author}.</span>
                  <span className={styles.featuredDate}>
                    {FEATURED_POST.relativeDate || FEATURED_POST.date}.
                  </span>
                  <span className={styles.featuredTime}>{FEATURED_POST.readTime}</span>
                </div>

                <Link to={withLng(`/blog/${FEATURED_POST.slug}`)} className={styles.readMoreLink}>
                  Read Post <FiArrowRight data-hv="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ 3. CATEGORY TABS & GRID ============ */}
      <section className={styles.gridSection}>
        <div className={styles.container}>
          <div className={styles.tabsWrapper} data-b="head">
            <ul className={styles.tabs}>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    className={`${styles.tabBtn} ${
                      activeCategory === cat ? styles.tabActive : ''
                    }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <div key={post.id} className={styles.postCard} data-b="item" data-hv="card">
                <Link to={withLng(`/blog/${post.slug}`)} className={styles.postImgLink}>
                  <div className={styles.postImgWrapper}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className={styles.postImg}
                      loading="lazy"
                    />
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
                    <Link to={withLng(`/blog/${post.slug}`)}>{post.title}</Link>
                  </h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <Link to={withLng(`/blog/${post.slug}`)} className={styles.readMoreLink}>
                    Read Post <FiArrowRight data-hv="arrow" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length > 0 && FEATURED_POST && (
            <div className={styles.loadMoreWrapper} data-b="head">
              <Link
                to={withLng(`/blog/${FEATURED_POST.slug}`)}
                className={styles.loadMoreBtn}
                data-hv="btn"
              >
                Load more
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ============ 4. NEXGN IN THE NEWS ============ */}
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitleCenter} data-b="head">
            Nexgn in the News
          </h2>
          <div className={styles.newsCard} data-b="item">
            <div className={styles.newsContent}>
              <h3 className={styles.newsTitle}>
                To find out more about Nexgn in the news or press releases
              </h3>
              <p className={styles.newsText}>Drop us a note at hello@nexgn.cloud</p>
              <a href="mailto:hello@nexgn.cloud" className={styles.newsBtn} data-hv="btn">
                Reach out
              </a>
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
          <h2 className={styles.subSectionTitle} data-b="head">
            Meet Our Team
          </h2>
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
          <h2 className={styles.subSectionTitle} data-b="head">
            Press Release
          </h2>
          <div className={styles.pressGrid}>
            {PRESS_RELEASES.map((press) => (
              <div key={press.id} className={styles.pressCard} data-b="item" data-hv="card">
                <Link to={withLng(`/blog/${press.slug}`)} className={styles.pressImgLink}>
                  <div className={styles.pressImgWrapper}>
                    <img src={press.image} alt={press.title} loading="lazy" />
                  </div>
                </Link>
                <h4 className={styles.pressTitle}>
                  <Link to={withLng(`/blog/${press.slug}`)}>{press.title}</Link>
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
        text={t(
          'cta.text',
          'Start signing documents the simpler way. Join modern businesses sending and signing documents securely with Nexgn.'
        )}
        primary={{
          label: t('cta.primary', 'Create your free account'),
          href: 'https://sign.nexgn.cloud/signup',
        }}
        secondary={{
          label: t('cta.secondary', 'Login'),
          href: 'https://sign.nexgn.cloud/login',
        }}
      />
    </div>
  );
};

export default Blog;