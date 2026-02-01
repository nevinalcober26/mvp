'use client';

import { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';
import { format } from 'date-fns';

export function WelcomeBanner() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  return (
    <div className="animated-gradient-border relative rounded-lg bg-gradient-to-r from-teal-50/60 to-blue-100/60 p-6 shadow-sm">
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        {/* Left Section */}
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-gray-800">
            {getGreeting()}, Marice! 😊
          </h2>
          <p className="mt-1 max-w-md text-gray-600">
            Welcome back to your dashboard. Today looks promising with clear
            skies ahead!🚀
          </p>
          <div className="mt-6 flex items-center">
            <div className="mr-4 h-2 w-2 rounded-full bg-teal-400"></div>
            <div className="flex items-baseline">
              <p className="text-6xl font-bold tracking-tighter text-gray-900">
                {format(currentTime, 'hh:mm')}
              </p>
              <p className="ml-2 text-2xl font-medium text-gray-500">
                {format(currentTime, 'a')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center justify-end">
            <Sun className="h-16 w-16 text-yellow-400" />
            <p className="ml-2 text-6xl font-bold text-gray-900">24°C</p>
          </div>
          <p className="mt-1 font-semibold text-gray-700">Sunny</p>
          <p className="text-muted-foreground">Dubai</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
}
