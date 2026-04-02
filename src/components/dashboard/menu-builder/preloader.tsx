'use client';
import { EMenuIcon } from '@/components/dashboard/app-sidebar';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function MenuBuilderPreloader({ onLoaded }: { onLoaded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: onLoaded,
        });
      },
    });

    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    ).to(contentRef.current, {
      delay: 1.2,
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in',
    });
  }, [onLoaded]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center"
    >
      <div ref={contentRef} className="flex flex-col items-center gap-6">
        <EMenuIcon />
        <div className="w-56 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-primary animate-loading-bar rounded-full" />
        </div>
      </div>
    </div>
  );
}
