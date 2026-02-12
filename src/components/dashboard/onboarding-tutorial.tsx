
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = {
  targetId: string;
  title: string;
  content: string;
  placement: 'right' | 'left' | 'top' | 'bottom';
};

const TUTORIAL_STEPS: Step[] = [
  {
    targetId: 'sidebar-nav',
    title: 'Navigation',
    content: 'Manage your modules from Settings to Integrations.',
    placement: 'right',
  },
  {
    targetId: 'branch-switcher',
    title: 'Outlet Control',
    content: 'Switch between your branches instantly.',
    placement: 'right',
  },
  {
    targetId: 'global-search',
    title: 'Quick Search',
    content: 'Find orders or items across your workspace.',
    placement: 'bottom',
  },
  {
    targetId: 'header-actions',
    title: 'Alerts & Profile',
    content: 'Manage notifications and account settings.',
    placement: 'left',
  },
  {
    targetId: 'welcome-banner',
    title: 'AI Pulse',
    content: 'Daily automated summaries of your outlet health.',
    placement: 'bottom',
  },
  {
    targetId: 'stat-cards',
    title: 'Live Metrics',
    content: 'Monitor sales and key performance trends.',
    placement: 'top',
  },
  {
    targetId: 'popular-items',
    title: 'Best Sellers',
    content: 'See which items are driving revenue today.',
    placement: 'left',
  },
  {
    targetId: 'recent-activity',
    title: 'Operations',
    content: 'Track live orders and tickets in progress.',
    placement: 'top',
  },
];

export function OnboardingTutorial() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1); // -1 is welcome dialog
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get('tutorial') === 'true') {
      setIsOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < TUTORIAL_STEPS.length) {
      updatePopoverPosition();
      window.addEventListener('resize', updatePopoverPosition);
      return () => window.removeEventListener('resize', updatePopoverPosition);
    }
  }, [currentStep]);

  const updatePopoverPosition = () => {
    if (currentStep < 0) return;
    const step = TUTORIAL_STEPS[currentStep];
    const element = document.getElementById(step.targetId);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const popoverWidth = 256; // w-64
      const viewportWidth = window.innerWidth;
      const padding = 16;

      let top = 0;
      let left = 0;
      let transform = '';
      const offset = 12;

      switch (step.placement) {
        case 'right':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX + offset;
          transform = 'translateY(-50%)';
          // Bound check
          if (left + popoverWidth > viewportWidth - padding) {
            left = rect.left + scrollX - offset;
            transform = 'translate(-100%, -50%)';
          }
          break;
        case 'left':
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX - offset;
          transform = 'translate(-100%, -50%)';
          break;
        case 'bottom':
          top = rect.bottom + scrollY + offset;
          left = rect.left + scrollX + rect.width / 2;
          transform = 'translateX(-50%)';
          
          if (left + (popoverWidth / 2) > viewportWidth - padding) {
            left = viewportWidth - padding - (popoverWidth / 2);
          }
          if (left - (popoverWidth / 2) < padding) {
            left = padding + (popoverWidth / 2);
          }
          break;
        case 'top':
          top = rect.top + scrollY - offset;
          left = rect.left + scrollX + rect.width / 2;
          transform = 'translate(-50%, -100%)';

          if (left + (popoverWidth / 2) > viewportWidth - padding) {
            left = viewportWidth - padding - (popoverWidth / 2);
          }
          if (left - (popoverWidth / 2) < padding) {
            left = padding + (popoverWidth / 2);
          }
          break;
      }

      setPopoverStyle({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        transform,
        zIndex: 100,
      });

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsOpen(false);
    setCurrentStep(-1);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('tutorial');
    router.replace(`/dashboard?${newParams.toString()}`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={isOpen && currentStep === -1} onOpenChange={handleSkip}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-[24px] bg-white text-center">
          <div className="bg-primary/5 p-8 flex flex-col items-center space-y-4">
            <div className="h-16 w-16 rounded-[20px] bg-primary flex items-center justify-center shadow-lg transform rotate-3">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground leading-tight">
                Welcome to eMenu
              </DialogTitle>
              <p className="text-sm font-medium text-gray-400">
                Quick 1-minute tour of your workspace.
              </p>
            </div>
          </div>

          <div className="p-8 space-y-3">
            <Button 
              className="w-full h-12 font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 shadow-xl rounded-xl text-sm group"
              onClick={() => setCurrentStep(0)}
            >
              Start Tour
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" className="w-full font-bold text-muted-foreground text-sm h-10" onClick={handleSkip}>
              Skip Guide
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tutorial Popover */}
      {currentStep >= 0 && currentStep < TUTORIAL_STEPS.length && (
        <div style={popoverStyle} ref={popoverRef} className="animate-in fade-in zoom-in duration-300">
          <div className="w-64 bg-[#142424] text-white p-4 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative">
            <div className={cn(
              "absolute w-3 h-3 bg-[#142424] rotate-45 border-white/10",
              TUTORIAL_STEPS[currentStep].placement === 'right' && "-left-1.5 top-1/2 -translate-y-1/2 border-l border-b",
              TUTORIAL_STEPS[currentStep].placement === 'left' && "-right-1.5 top-1/2 -translate-y-1/2 border-r border-t",
              TUTORIAL_STEPS[currentStep].placement === 'bottom' && "-top-1.5 left-1/2 -translate-x-1/2 border-l border-t",
              TUTORIAL_STEPS[currentStep].placement === 'top' && "-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b",
            )} />
            
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#18B4A6]">
                {currentStep + 1} / {TUTORIAL_STEPS.length}
              </span>
              <button onClick={handleSkip} className="text-white/40 hover:text-white transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <h3 className="text-base font-bold mb-1.5 tracking-tight">
              {TUTORIAL_STEPS[currentStep].title}
            </h3>
            <p className="text-[13px] text-gray-400 font-medium leading-relaxed mb-5">
              {TUTORIAL_STEPS[currentStep].content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-0.5 rounded-full transition-all", 
                      i === currentStep ? "w-3 bg-[#18B4A6]" : "w-1 bg-white/20"
                    )} 
                  />
                ))}
              </div>
              <Button 
                size="sm" 
                className="bg-[#18B4A6] hover:bg-[#149d94] text-white font-bold rounded-lg px-3 h-8 text-xs"
                onClick={handleNext}
              >
                {currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for tutorial */}
      {currentStep >= 0 && (
        <div className="fixed inset-0 z-[90] bg-black/10 pointer-events-none" />
      )}
    </>
  );
}
