'use client';

import {
  HelpCircle,
  UserPlus,
  Settings,
  Users,
  Plus,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export const AppSwitcher = () => (
  <div className="w-80 rounded-lg bg-gray-800 text-white p-4">
    <h3 className="text-sm font-semibold text-gray-400 mb-4 px-2">
      Current Active Product
    </h3>
    <div className="grid grid-cols-2 gap-4 text-center mb-4">
      <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/50 cursor-pointer">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-teal-500">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M8 6H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 6H3.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12H3.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 18H3.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sm font-medium">eMenu QR</span>
      </div>
      <div className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-600">
          <Plus className="h-6 w-6" />
        </div>
        <span className="text-sm font-medium text-gray-300">
          Explore Suite
        </span>
      </div>
    </div>
    <Separator className="bg-gray-600 my-4" />
    <div className="grid grid-cols-4 gap-2 text-center">
      <Button
        variant="ghost"
        className="flex flex-col items-center h-auto text-gray-300 hover:bg-gray-700 hover:text-white p-2"
      >
        <HelpCircle className="h-6 w-6 mb-1" />
        <span className="text-xs">Help</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-col items-center h-auto text-gray-300 hover:bg-gray-700 hover:text-white p-2"
      >
        <UserPlus className="h-6 w-6 mb-1" />
        <span className="text-xs">Invite</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-col items-center h-auto text-gray-300 hover:bg-gray-700 hover:text-white p-2"
      >
        <Settings className="h-6 w-6 mb-1" />
        <span className="text-xs">Admin</span>
      </Button>
      <Button
        variant="ghost"
        className="flex flex-col items-center h-auto text-gray-300 hover:bg-gray-700 hover:text-white p-2"
      >
        <Users className="h-6 w-6 mb-1" />
        <span className="text-xs">Teams</span>
      </Button>
    </div>
  </div>
);
