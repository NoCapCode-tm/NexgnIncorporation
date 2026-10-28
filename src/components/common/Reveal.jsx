import React from 'react';
import { useInView } from '../../hooks/useInView';
import styles from './Reveal.module.css';

// Fade + rise when scrolled into view.  <Reveal as="li" delay={100} className="...">
const Reveal = ({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) => {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${className}`}
      data-in={inView}
      style={{ '--d': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;