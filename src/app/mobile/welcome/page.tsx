'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Crown, MapPin, Utensils, Receipt } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

// Custom icon for the main circular button, matching the design.
const WelcomeMenuIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 6H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 18H12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 6V6.01" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12V12.01" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 18V18.01" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// Custom component for the footer logo
const PoweredByEMenu = () => (
  <div className="flex flex-col items-center gap-1">
    <p className="text-xs text-gray-400 font-semibold">Powered by</p>
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 6H20" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M9 12H16" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M9 18H12" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M4 6V6.01" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 12V12.01" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
        <path d="M4 18V18.01" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <span className="text-2xl font-bold text-primary">eMenu</span>
    </div>
  </div>
)

export default function MobileWelcomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-md mx-auto bg-[#F7F9FB] font-sans">
      <header className="p-4 flex justify-between items-center w-full z-10">
        <Button variant="outline" className="rounded-full bg-white shadow-sm h-10 px-4 border-gray-200/80">
          <Globe className="h-4 w-4 mr-2 text-gray-600" />
          <span className="font-bold text-gray-800">EN</span>
        </Button>
        <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm relative h-10 w-10 border-gray-200/80">
          <Crown className="h-4 w-4 text-gray-600" />
          <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
        <div className="relative w-full max-w-sm">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-[#F7F9FB]">
              <WelcomeMenuIcon />
            </div>
          </div>
          
          <Card className="w-full rounded-3xl shadow-lg pt-16 bg-white/90 backdrop-blur-2xl border-gray-200/50">
            <CardContent className="text-center flex flex-col items-center gap-6 px-6 pb-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Blue Plate</h1>
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Table 12
                </div>
              </div>

              <div className="w-full border-t border-dashed border-gray-200/80"></div>

              <p className="text-gray-500 leading-relaxed text-base">
                Welcome! We're <br /> delighted to have you.
              </p>

              <div className="w-full space-y-3 pt-2">
                <Button variant="outline" className="w-full h-14 rounded-xl text-lg font-bold border-2 border-primary/80 text-primary hover:bg-primary/5 hover:text-primary active:bg-primary/10" asChild>
                  <Link href="/mobile/menu">
                    <Utensils className="h-5 w-5 mr-3" />
                    View Menu
                  </Link>
                </Button>
                <Button className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 active:bg-primary/80 shadow-lg shadow-primary/20">
                  <Receipt className="h-5 w-5 mr-3" />
                  Pay my Bill
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="py-10 flex justify-center">
        <PoweredByEMenu />
      </footer>
    </div>
  );
}
