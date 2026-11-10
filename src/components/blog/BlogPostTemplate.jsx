import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight, FiCheck, FiChevronLeft, FiLink2 } from 'react-icons/fi';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SEOHead } from '../seo/SEOHead';
import CtaBanner from '../common/CtaBanner';
import useBlogAnimations from '../../hooks/useBlogAnimations';
import blogsData from '../../pages/company/blogsData.json';
import ctaDefaultImg from '../../assets/common/cta.png';
import styles from './BlogPostTemplate.module.css';

const LANGS = ['en', 'es', 'hi'];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================================================================
   Reusable Blog Prose Primitives
   ===================================================================== */

export const BlogText = ({ children }) => (
  <p className={styles.proseParagraph}>{children}</p>
);

export const BlogSection = ({ id, title, sectionRef, children }) => (
  <section
    id={id}
    ref={sectionRef}
    className={styles.proseSection}
    data-b="prose-block"
  >
    {title && <h2 className={styles.proseSubHeading}>{title}</h2>}
    {children}
  </section>
);

/* =====================================================================
   Master Dynamic Particular Blog Page Template
   Fetches article by :slug directly from blogsData.json
   ===================================================================== */

const BlogPostTemplate = ({
  post: propPost = null,
  relatedPosts: propRelated = null,
  spotlightPost: propSpotlight = null,
  backTo = '/blog',
  backLabel = 'Go To Blog Page',
  ctaImage = ctaDefaultImg,
}) => {
  const { t } = useTranslation();
  const { lng, slug } = useParams();
  const currentLng = LANGS.includes(lng) ? lng : 'en';
  const withLng = (path) => `/${currentLng}${path.startsWith('/') ? path : `/${path}`}`;

  // 1. Dynamically resolve the active blog post or press release from blogsData.json
  const post = useMemo(() => {
    if (propPost) return propPost;
    const allArticles = blogsData.articles || [];
    const allPress = blogsData.pressReleases || [];

    const matchedArticle = allArticles.find((item) => item.slug === slug);
    if (matchedArticle) return matchedArticle;

    const matchedPress = allPress.find((item) => item.slug === slug);
    if (matchedPress) return matchedPress;

    // Fallback to featured article so any unknown slug still renders cleanly
    return allArticles.find((item) => item.featured) || allArticles[0] || null;
  }, [propPost, slug]);

  // 2. Dynamically resolve Related Blogs (excluding the currently open post)
  const relatedPosts = useMemo(() => {
    if (propRelated) return propRelated;
    const allArticles = blogsData.articles || [];
    return allArticles.filter((item) => item.slug !== post?.slug);
  }, [propRelated, post?.slug]);

  // 3. Dynamically resolve Sidebar Spotlight Card
  const featuredSidebarPost = useMemo(() => {
    if (propSpotlight) return propSpotlight;
    return relatedPosts[0] || (blogsData.articles || [])[0] || null;
  }, [propSpotlight, relatedPosts]);

  const sections = useMemo(() => post?.sections || [], [post]);

  const [activeToc, setActiveToc] = useState(sections[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [visibleRelated, setVisibleRelated] = useState(3);

  const rootRef = useRef(null);
  const sectionRefs = useRef({});
  const isClickScrolling = useRef(false);
  const clickTimer = useRef(null);
  const stopScrollWatch = useRef(null);

  // Run MNC-grade GSAP animations whenever language or slug changes
  useBlogAnimations(rootRef, { lng: currentLng, slug: post?.slug });

  // Reset active TOC item and related count when switching between posts
  useEffect(() => {
    if (sections.length) {
      setActiveToc(sections[0].id);
    }
    setVisibleRelated(3);
  }, [post?.slug, sections]);

  // Scroll-spy for Table of Contents
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveToc(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0.05 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections, post?.slug]);

  useEffect(
    () => () => {
      clearTimeout(clickTimer.current);
      stopScrollWatch.current?.();
    },
    []
  );

  // Smooth scroll to heading when clicking a Table of Contents item
  const scrollToSection = useCallback((id) => {
    const element = sectionRefs.current[id] || document.getElementById(id);
    if (!element) return;

    stopScrollWatch.current?.();
    isClickScrolling.current = true;
    setActiveToc(id);
    window.history.replaceState(null, '', `#${id}`);

    const offset =
      parseFloat(getComputedStyle(element).getPropertyValue('scroll-margin-top')) || 110;
    const y = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });

    const done = () => {
      clearTimeout(clickTimer.current);
      window.removeEventListener('scroll', onScroll);
      stopScrollWatch.current = null;
      isClickScrolling.current = false;
    };
    const onScroll = () => {
      clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(done, 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    stopScrollWatch.current = done;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(done, 450);
  }, []);

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) return null;

  const displayedRelated = relatedPosts.slice(0, visibleRelated);

  const shareUrl =
    typeof window !== 'undefined'
      ? encodeURIComponent(window.location.href)
      : encodeURIComponent(`https://nexgn.cloud/${currentLng}/blog/${post.slug}`);
  const shareTitle = encodeURIComponent(post.title);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.isoDate || '2026-10-24',
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nexgn',
      url: 'https://nexgn.cloud',
    },
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <div className={styles.progress} data-b="progress" aria-hidden="true" />
      <SEOHead
        title={`${post.title} | Nexgn Blog`}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        schema={schema}
      />

      {/* Dark top band behind transparent Navbar */}
      <div className={styles.navDarkBackdrop} aria-hidden="true" />

      {/* ============ 1. ARTICLE HEADER & COVER PHOTO ============ */}
      <article className={styles.articleWrap}>
        <header className={styles.postHero} data-b="post-hero">
          <div className={styles.container}>
            {/* Back to Blog Link */}
            <div className={styles.backRow} data-b="post-in">
              <Link to={withLng(backTo)} className={styles.backLink}>
                <FiChevronLeft aria-hidden="true" />
                <span>{t('blog.backToBlog', backLabel)}</span>
              </Link>
            </div>

            {/* Centered Read Time + Title */}
            <div className={styles.titleBlock}>
              <p className={styles.topMeta} data-b="post-in">
                <span>{post.readTime || '5 min read'}</span>
                <span className={styles.metaDivider} aria-hidden="true">
                  |
                </span>
                <span>{post.typeLabel || t('blog.label', 'Blog')}</span>
              </p>

              <h1 className={styles.mainTitle} data-b="post-in">
                {post.title}
              </h1>
            </div>

            {/* Author & Date Row */}
            <div className={styles.authorBar} data-b="post-in">
              <div className={styles.authorLeft}>
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className={styles.authorAvatar}
                  />
                )}
                <div className={styles.authorMeta}>
                  <span classNameName={styles.authorName}>{post.author}</span>
                  {post.authorRole && (
                    <span className={styles.authorRole}>{post.authorRole}</span>
                  )}
                </div>
              </div>

              <time className={styles.publishDate}>{post.date}</time>
            </div>

            {/* Rounded Hero Cover Photo */}
            <div className={styles.coverFrame} data-b="post-cover">
              <img
                src={post.image}
                alt={post.title}
                className={styles.coverImg}
              />
            </div>
          </div>
        </header>

        {/* ============ 2. TWO-COLUMN BODY + STICKY TOC SIDEBAR ============ */}
        <div className={styles.bodySection}>
          <div className={styles.container}>
            <div className={styles.layoutGrid}>
              {/* Left Column: Story Content */}
              <div className={styles.proseColumn}>
                {Array.isArray(post.intro) && post.intro.length > 0 && (
                  <div className={styles.introBlock} data-b="prose-block">
                    {post.intro.map((paragraph, i) => (
                      <BlogText key={i}>{paragraph}</BlogText>
                    ))}
                  </div>
                )}

                {sections.map((sec) => (
                  <BlogSection
                    key={sec.id}
                    id={sec.id}
                    title={sec.heading}
                    sectionRef={(el) => {
                      sectionRefs.current[sec.id] = el;
                    }}
                  >
                    {Array.isArray(sec.paragraphs) &&
                      sec.paragraphs.map((paragraph, i) => (
                        <BlogText key={i}>{paragraph}</BlogText>
                      ))}
                  </BlogSection>
                ))}
              </div>

              {/* Right Column: Sticky Table of Contents + Share + Spotlight Card */}
              <aside className={styles.sidebarColumn} data-b="sidebar">
                <div className={styles.stickyBox}>
                  {/* Table of Contents */}
                  {sections.length > 0 && (
                    <nav className={styles.tocCard} aria-label="Table of contents">
                      <h3 className={styles.tocHeading}>
                        {t('blog.toc', 'Table of contents')}
                      </h3>
                      <ul className={styles.tocList}>
                        {sections.map((sec) => {
                          const active = activeToc === sec.id;
                          return (
                            <li key={sec.id}>
                              <button
                                type="button"
                                onClick={() => scrollToSection(sec.id)}
                                className={`${styles.tocItem} ${
                                  active ? styles.tocItemActive : ''
                                }`}
                              >
                                {sec.tocLabel || sec.heading}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  )}

                  {/* Share This Article */}
                  <div className={styles.shareBlock}>
                    <p className={styles.shareHeading}>
                      {t('blog.share', 'Share this article')}
                    </p>
                    <div className={styles.shareRow}>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className={styles.shareBtn}
                        aria-label="Copy link"
                        title="Copy link"
                      >
                        {copied ? <FiCheck /> : <FiLink2 />}
                      </button>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shareBtn}
                        aria-label="Share on LinkedIn"
                      >
                        <FaLinkedinIn />
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shareBtn}
                        aria-label="Share on Facebook"
                      >
                        <FaFacebookF />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shareBtn}
                        aria-label="Share on X"
                      >
                        <FaXTwitter />
                      </a>
                    </div>
                  </div>

                  {/* Sidebar Spotlight Article Card */}
                  {featuredSidebarPost && (
                    <div className={styles.spotlightCard} data-hv="card">
                      <Link
                        to={withLng(`/blog/${featuredSidebarPost.slug}`)}
                        className={styles.spotlightImgLink}
                      >
                        <div className={styles.spotlightImgWrap}>
                          <img
                            src={featuredSidebarPost.image}
                            alt={featuredSidebarPost.title}
                            loading="lazy"
                          />
                          <div className={styles.cardOverlay}>
                            <div className={styles.cardOverlayInner}>
                              <div className={styles.cardAuthorDate}>
                                <span className={styles.cardAuthor}>
                                  {featuredSidebarPost.author}
                                </span>
                                <span className={styles.cardDate}>
                                  {featuredSidebarPost.date}
                                </span>
                              </div>
                              <span className={styles.cardCategory}>
                                {featuredSidebarPost.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <h4 className={styles.spotlightTitle}>
                        <Link to={withLng(`/blog/${featuredSidebarPost.slug}`)}>
                          {featuredSidebarPost.title}
                        </Link>
                      </h4>

                      <Link
                        to={withLng(`/blog/${featuredSidebarPost.slug}`)}
                        className={styles.readPostLink}
                      >
                        <span>Read Post</span>
                        <FiArrowRight data-hv="arrow" />
                      </Link>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {/* ============ 3. RELATED BLOGS ============ */}
      {displayedRelated.length > 0 && (
        <section className={styles.relatedSection} aria-labelledby="related-blogs-heading">
          <div className={styles.container}>
            <h2 id="related-blogs-heading" className={styles.relatedHeading} data-b="head">
              {t('blog.related', 'Related Blogs')}
            </h2>

            <div className={styles.relatedGrid}>
              {displayedRelated.map((item) => (
                <article
                  key={item.id || item.slug}
                  className={styles.relatedCard}
                  data-b="item"
                  data-hv="card"
                >
                  <Link
                    to={withLng(`/blog/${item.slug}`)}
                    className={styles.relatedImgLink}
                  >
                    <div className={styles.relatedImgWrap}>
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div className={styles.cardOverlay}>
                        <div className={styles.cardOverlayInner}>
                          <div className={styles.cardAuthorDate}>
                            <span className={styles.cardAuthor}>{item.author}</span>
                            <span className={styles.cardDate}>{item.date}</span>
                          </div>
                          <span className={styles.cardCategory}>{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className={styles.relatedBody}>
                    <h3 className={styles.relatedTitle}>
                      <Link to={withLng(`/blog/${item.slug}`)}>{item.title}</Link>
                    </h3>
                    <p className={styles.relatedExcerpt}>{item.excerpt}</p>
                    <Link
                      to={withLng(`/blog/${item.slug}`)}
                      className={styles.readPostLink}
                    >
                      <span>Read Post</span>
                      <FiArrowRight data-hv="arrow" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.loadMoreRow} data-b="head">
              {visibleRelated < relatedPosts.length ? (
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  data-hv="btn"
                  onClick={() => setVisibleRelated((v) => v + 3)}
                >
                  + Load more
                </button>
              ) : (
                <Link to={withLng(backTo)} className={styles.loadMoreBtn} data-hv="btn">
                  + Load more
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============ 4. FINAL CTA BANNER ============ */}
      <CtaBanner
        image={ctaImage}
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

export default BlogPostTemplate;