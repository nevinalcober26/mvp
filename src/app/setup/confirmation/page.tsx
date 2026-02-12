'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EMenuIcon } from '@/components/dashboard/app-sidebar';
import { 
  CheckCircle2, 
  Store, 
  Users, 
  LayoutGrid, 
  ArrowRight, 
  ExternalLink, 
  PlayCircle, 
  BookOpen, 
  Loader2,
  Crown,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function ActivationConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [activationDate, setActivationDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('selectedPlan');
    if (data) {
      setPlanData(JSON.parse(data));
    }
    
    // Generate realistic license dates
    const now = new Date();
    setActivationDate(now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    
    const exp = new Date();
    exp.setFullYear(now.getFullYear() + 1);
    setExpirationDate(exp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  const handleGoToDashboard = async () => {
    setIsLoading(true);
    
    // Animate transition to dashboard
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    toast({
      title: "Welcome to eMenu!",
      description: "Redirecting to your personalized workspace...",
    });
    
    router.push('/dashboard');
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#fafbfc]">
      <header className="relative z-20 w-full bg-white border-b border-gray-100 py-4 flex justify-center shrink-0">
        <EMenuIcon />
      </header>

      <main className="relative flex-1 flex flex-col items-center p-4 pt-12 pb-24 overflow-auto">
        <div className="absolute inset-0 z-0 pointer-events-none fixed">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#e6f7f6] blur-[120px] opacity-60" />
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#fffcf0] blur-[120px] opacity-60" />
        </div>

        <div className="relative z-10 w-full max-w-[800px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Success Banner */}
          <div className="animated-gradient-border relative rounded-[24px] bg-white p-8 shadow-xl flex items-start gap-6 border border-[#18B4A6]/20">
            <div className="h-14 w-14 rounded-full bg-[#18B4A6] flex items-center justify-center shrink-0 shadow-lg shadow-[#18B4A6]/20">
              <Check className="h-8 w-8 text-white" strokeWidth={4} />
            </div>
            <div className="space-y-3">
              <h1 className="text-[28px] font-black tracking-tight text-[#142424]">License Successfully Activated!</h1>
              <p className="text-[15px] font-medium text-gray-500 leading-relaxed max-w-[500px]">
                Your {planData?.plan || 'Standard'} license has been successfully provisioned and is now active for your business.
              </p>
              {planData?.plan !== 'Free' && (
                <Badge className="bg-[#4ade80]/10 text-[#064e3b] font-black text-[10px] uppercase px-3 py-1 border-0 flex items-center gap-2 w-fit">
                  <CheckCircle2 className="h-3 w-3" />
                  Payment Processed
                </Badge>
              )}
            </div>
          </div>

          {/* License Details */}
          <Card className="border-0 shadow-xl rounded-[32px] overflow-hidden bg-white/90 backdrop-blur-xl">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-black text-[#142424]">License Details</h2>
              <p className="text-[13px] font-medium text-gray-400 mt-1">Review your subscription details below</p>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-[#18B4A6]" />
                      <span className="text-[13px] font-black text-[#18B4A6] uppercase tracking-widest">{planData?.plan || 'Standard'} Plan</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#142424]">${planData?.price || 0}</span>
                      <span className="text-sm font-bold text-gray-400">/month</span>
                    </div>
                    <p className="text-[12px] font-bold text-gray-400 italic">Billed {planData?.cycle === 'annual' ? 'annually' : 'monthly'}</p>
                  </div>
                  
                  <ul className="space-y-3">
                    {[
                      'Up to 5 restaurant locations',
                      'Up to 20 staff users',
                      'Up to 100 tables per restaurant',
                      'Advanced features: Tags, Notes, Analytics',
                      'Email & chat support'
                    ].map(feat => (
                      <li key={feat} className="flex items-center gap-3 text-[13px] font-bold text-gray-600">
                        <Check className="h-4 w-4 text-[#18B4A6]" strokeWidth={3} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-400">License Status</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold">License ID:</span>
                        <span className="font-black text-[#142424] font-mono">PRO-2023-06158942</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold">Status:</span>
                        <Badge className="bg-[#18B4A6] text-white font-black text-[10px] px-3 border-0">Active</Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold">Activation Date:</span>
                        <span className="font-bold text-[#142424]">{activationDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold">Expiration Date:</span>
                        <span className="font-bold text-[#142424]">{expirationDate}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold">Billing Cycle:</span>
                        <span className="font-bold text-[#142424] capitalize">{planData?.cycle || 'Monthly'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-bold">Auto-renewal:</span>
                        <span className="font-bold text-[#142424]">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-6 pt-4">
            <div className="space-y-1">
              <h2 className="text-[22px] font-black text-[#142424]">Next Steps</h2>
              <p className="text-[14px] font-medium text-gray-400">Get started with setting up your Digital Hub dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Add Restaurant Branches', icon: Store, step: 'Step 1', desc: 'Set up multiple locations for your business with unique settings.' },
                { title: 'Invite Staff Users', icon: Users, step: 'Step 2', desc: 'Add team members and assign roles with specific permissions.' },
                { title: 'Configure Floor Plans', icon: LayoutGrid, step: 'Step 3', desc: 'Create floors and add tables to manage your restaurant layout.' },
              ].map((item, i) => (
                <Card key={i} className="border-0 shadow-md rounded-[24px] bg-white group hover:scale-[1.05] transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-[#18B4A6]/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-[#18B4A6]" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[15px] font-black text-[#142424] leading-tight">{item.title}</h4>
                      <p className="text-[12px] font-medium text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                    <p className="text-[11px] font-black text-[#18B4A6] uppercase tracking-widest pt-2 cursor-pointer group-hover:underline">{item.step}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Primary Action */}
          <div className="pt-8 flex flex-col items-center space-y-6">
            <Button 
              onClick={handleGoToDashboard}
              disabled={isLoading}
              className="h-14 px-12 bg-[#18B4A6] hover:bg-[#149d94] text-white font-black text-[16px] rounded-2xl shadow-2xl shadow-[#18B4A6]/30 transition-all active:scale-[0.98] group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Finalizing Workspace...
                </>
              ) : (
                <>
                  Go to Dashboard <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <div className="p-4 bg-[#18B4A6]/5 border border-[#18B4A6]/10 rounded-2xl flex items-center gap-3 text-[13px] font-bold text-gray-500">
              Need help getting started? 
              <span className="text-[#18B4A6] underline cursor-pointer">Watch our tutorial videos</span>
              <span className="text-gray-300">or</span>
              <span className="text-[#18B4A6] underline cursor-pointer">contact support</span>
            </div>
          </div>

          {/* Footer Resources */}
          <div className="pt-16 space-y-8">
            <h3 className="text-[20px] font-black text-center text-[#142424]">Resources to Help You Get Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg rounded-[24px] bg-white overflow-hidden group">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-[#142424]">Knowledge Base</h4>
                    <p className="text-[13px] font-medium text-gray-400 leading-relaxed">
                      Explore our comprehensive guides and documentation to learn how to use Digital Hub effectively.
                    </p>
                    <div className="flex items-center gap-2 text-[12px] font-black text-blue-500 uppercase tracking-widest pt-2 cursor-pointer group-hover:underline">
                      Browse Knowledge Base <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg rounded-[24px] bg-white overflow-hidden group">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <PlayCircle className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-[#142424]">Video Tutorials</h4>
                    <p className="text-[13px] font-medium text-gray-400 leading-relaxed">
                      Watch step-by-step tutorials to help you set up your restaurant management system quickly.
                    </p>
                    <div className="flex items-center gap-2 text-[12px] font-black text-orange-500 uppercase tracking-widest pt-2 cursor-pointer group-hover:underline">
                      Watch Tutorials <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
