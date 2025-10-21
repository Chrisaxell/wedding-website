'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  /**
   * Threshold percentage of element visibility before triggering animation (0-1)
   * @default 0.15 (15% visible)
   */
  threshold?: number;
  /**
   * Distance to translate from (in pixels)
   * @default 30
   */
  translateY?: number;
  /**
   * Animation duration in milliseconds
   * @default 600
   */
  duration?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Delay before animation starts (in milliseconds)
   * @default 0
   */
  delay?: number;
}

/**
 * ScrollReveal - Wraps content and reveals it with fade-in + slide-up animation
 * when scrolled into view. Prevents showing small bits of content at bottom of viewport.
 * Once revealed, stays visible.
 *
 * @example
 * <ScrollReveal>
 *   <div>Your content here</div>
 * </ScrollReveal>
 */
export function ScrollReveal({
  children,
  threshold = 0.2,
  translateY = 30,
  duration = 600,
  className = '',
  delay = 0,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only trigger once when scrolled into view
          if (entry.isIntersecting && !isVisible) {
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true);
              }, delay);
            } else {
              setIsVisible(true);
            }
          }
        });
      },
      {
        threshold,
        rootMargin: '0px',
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, delay, isVisible]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0px, 0px)' : `translate(0px, ${translateY}px)`,
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
