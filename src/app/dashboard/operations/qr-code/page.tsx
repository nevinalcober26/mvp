'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  QrCode, 
  Download, 
  ExternalLink, 
  CheckCircle2,
  Printer,
  FileText,
  Upload,
  X,
  FileImage,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const BRAND_COLORS = [
  { name: 'Classic Black', value: '#000000' },
  { name: 'Ocean Teal', value: '#18B4A6' },
  { name: 'Midnight', value: '#142424' },
  { name: 'Sunrise Orange', value: '#fb923c' },
  { name: 'Royal Purple', value: '#9333ea' },
];

export default function QrCodePage() {
  const { toast } = useToast();
  const [qrColor, setQrColor] = useState('#000000');
  const [qrType, setQrType] = useState('NORMAL QR');
  const [isHighErrorCorrection, setIsHighErrorCorrection] = useState(false);
  const [isBrandingEnabled, setIsBrandingEnabled] = useState(true);
  const [coupon, setCoupon] = useState('none');
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const breadcrumbItems = [
    { label: 'Operations' },
    { label: 'QR Studio' }
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const clearLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (format: string) => {
    setIsDownloadModalOpen(false);
    toast({
      title: "Creating your QR Code",
      description: `Your ${format} file is being prepared for download.`,
    });
  };

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-muted/20 min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Friendly Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="text-4xl font-black tracking-tight text-foreground">QR Studio</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Create and customize high-quality QR codes for your tables, menus, or rooms in three simple steps.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border shadow-sm self-start">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Studio Mode Live
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Control Panel (7 Columns) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Destination */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20">
                    1
                  </div>
                  <h2 className="text-2xl font-bold">Where does it lead?</h2>
                </div>
                
                <Card className="border shadow-sm overflow-hidden">
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Purpose</Label>
                        <Select value={qrType} onValueChange={setQrType}>
                          <SelectTrigger className="h-12 text-base font-medium bg-muted/30 border-none shadow-none focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NORMAL QR">Normal (Menu Link)</SelectItem>
                            <SelectItem value="TABLE QR">Specific Table</SelectItem>
                            <SelectItem value="ROOM QR">Specific Room</SelectItem>
                            <SelectItem value="ALPHANUMERIC QR">Custom Alphanumeric</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground font-medium">Choose how your customers will use this code.</p>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Welcome Gift</Label>
                        <Select value={coupon} onValueChange={setCoupon}>
                          <SelectTrigger className="h-12 text-base font-medium bg-muted/30 border-none shadow-none focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select a coupon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Offer Applied</SelectItem>
                            <SelectItem value="welcome10">WELCOME10 (10% Off)</SelectItem>
                            <SelectItem value="summer25">SUMMER25 (25% Off)</SelectItem>
                            <SelectItem value="free_drink">FREEDRINK (Free Beverage)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground font-medium">Auto-apply a discount when customers scan.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2: Styling */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20">
                    2
                  </div>
                  <h2 className="text-2xl font-bold">Make it your own</h2>
                </div>

                <Card className="border shadow-sm overflow-hidden">
                  <CardContent className="p-8 space-y-10">
                    {/* Color Section */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Brand Colors</Label>
                      <div className="flex flex-wrap items-center gap-4">
                        {BRAND_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setQrColor(color.value)}
                            title={color.name}
                            className={cn(
                              "group relative h-12 w-12 rounded-2xl transition-all border-4",
                              qrColor === color.value ? "border-primary scale-110 shadow-lg" : "border-transparent hover:border-muted-foreground/20"
                            )}
                            style={{ backgroundColor: color.value }}
                          >
                            {qrColor === color.value && <CheckCircle2 className="mx-auto h-5 w-5 text-white" />}
                          </button>
                        ))}
                        
                        <div className="h-10 w-px bg-border mx-2" />
                        
                        <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-2xl border">
                          <div className="relative h-8 w-8 rounded-xl overflow-hidden border shadow-sm">
                            <input 
                              type="color" 
                              value={qrColor}
                              onChange={(e) => setQrColor(e.target.value)}
                              className="absolute inset-[-50%] h-[200%] w-[200%] cursor-pointer"
                            />
                          </div>
                          <span className="font-mono text-sm font-bold uppercase">{qrColor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <button 
                        className={cn(
                          "flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all",
                          isHighErrorCorrection ? "bg-primary/5 border-primary shadow-inner" : "bg-background border-border hover:border-primary/30"
                        )}
                        onClick={() => setIsHighErrorCorrection(!isHighErrorCorrection)}
                      >
                        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors", isHighErrorCorrection ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                          <Printer className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold">High Durability</p>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium">Use for physical prints like stickers or table cards.</p>
                        </div>
                      </button>

                      <div 
                        className={cn(
                          "flex flex-col gap-4 p-5 rounded-2xl border-2 transition-all",
                          isBrandingEnabled ? "bg-primary/5 border-primary shadow-inner" : "bg-background border-border hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-start gap-4 w-full cursor-pointer" onClick={() => setIsBrandingEnabled(!isBrandingEnabled)}>
                          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors", isBrandingEnabled ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                            <Sparkles className="h-6 w-6" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold">Add Branding</p>
                              <Switch checked={isBrandingEnabled} onCheckedChange={setIsBrandingEnabled} />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">Overlay your logo in the center of the code.</p>
                          </div>
                        </div>

                        {isBrandingEnabled && (
                          <div className="pt-4 border-t border-primary/10 flex items-center justify-between animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-xl border bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                {customLogo ? (
                                  <Image src={customLogo} alt="Custom Logo" width={48} height={48} className="object-contain" />
                                ) : (
                                  <Upload className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <p className="text-sm font-bold">
                                {customLogo ? 'Logo Ready' : 'No Logo Uploaded'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleLogoUpload} 
                              />
                              <Button variant="outline" size="sm" className="h-9 font-bold px-4 rounded-xl" onClick={triggerUpload}>
                                {customLogo ? 'Change' : 'Choose File'}
                              </Button>
                              {customLogo && (
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={clearLogo}>
                                  <X className="h-5 w-5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3: Action */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20">
                    3
                  </div>
                  <h2 className="text-2xl font-bold">All done?</h2>
                </div>
                <Button 
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="h-16 px-10 rounded-2xl font-black text-xl transition-all shadow-xl shadow-primary/20 w-full hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="mr-3 h-6 w-6" />
                  Download Your QR Code
                </Button>
              </div>

            </div>

            {/* Preview (5 Columns) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-6">
                <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2rem]">
                  <div className="bg-primary px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-white/80" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Live Preview</span>
                    </div>
                    <span className="text-[10px] font-black text-white/90 bg-white/20 px-2 py-1 rounded-lg">
                      {isHighErrorCorrection ? '300 DPI (MAX)' : '72 DPI'}
                    </span>
                  </div>
                  
                  <CardContent className="p-12 flex flex-col items-center gap-10">
                    
                    <div className="relative p-10 bg-white rounded-[2.5rem] border-2 border-dashed border-primary/20 group transition-all">
                      <QrCode 
                        className="h-64 w-64 transition-colors duration-500" 
                        style={{ color: qrColor }}
                        strokeWidth={1.2}
                      />
                      {/* Logo Branding Overlay */}
                      {isBrandingEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white p-1.5 rounded-[1.2rem] shadow-xl border-2 border-muted animate-in fade-in zoom-in duration-500">
                            <div className="h-14 w-14 rounded-xl overflow-hidden relative bg-white flex items-center justify-center">
                              <Image
                                src={customLogo || "https://picsum.photos/seed/brand/100/100"}
                                fill
                                alt="Brand logo"
                                className={cn("object-cover", !customLogo && "grayscale brightness-110 opacity-50")}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full space-y-4">
                      <div className="flex items-center gap-2 px-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-foreground">Active Destination</span>
                      </div>
                      <div className="flex items-center bg-muted/40 rounded-[1.2rem] border-2 border-transparent px-5 h-14 transition-all hover:bg-muted/60">
                        <ExternalLink className="h-5 w-5 text-primary shrink-0 mr-4" />
                        <p className="text-sm font-bold truncate text-muted-foreground/80">
                          bloomsburys.menu/table/rak-05{coupon !== 'none' ? `?c=${coupon}` : ''}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 rounded-2xl border-2 border-primary/10 bg-primary/5 flex items-start gap-4 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-primary uppercase tracking-wide">Pro Tip</p>
                    <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                      Adding your **logo** increases customer trust and makes your table displays look much more professional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern 3-Column Download Modal */}
      <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[2rem]">
          <div className="p-10 space-y-8">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-3xl font-black tracking-tight">Choose Your Format</DialogTitle>
              <DialogDescription className="text-base font-medium">
                Select the file type that best suits your needs. For printing large menus, we recommend SVG or PDF.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { id: 'PNG', label: 'Image', type: 'BEST FOR WEB', icon: FileImage, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 'SVG', label: 'Vector', type: 'BEST FOR PRINT', icon: Layers, color: 'text-teal-600', bg: 'bg-teal-50' },
                { id: 'PDF', label: 'Document', type: 'EASY TO SHARE', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleDownload(item.id)}
                  className="flex flex-col items-center gap-6 p-8 rounded-[2rem] border-2 bg-card hover:border-primary hover:bg-primary/5 transition-all group outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  <div className={cn("h-20 w-20 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", item.bg, item.color)}>
                    <item.icon className="h-10 w-10" strokeWidth={2.5} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-black text-foreground">{item.id}</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground opacity-60">{item.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-muted/30 border-t flex justify-center">
            <Button variant="ghost" className="font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl" onClick={() => setIsDownloadModalOpen(false)}>
              Back to Studio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
