'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Info,
  ChevronRight
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
      title: "Generating File",
      description: `Your ${format} file is being prepared for high-resolution download.`,
    });
  };

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-muted/20 min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1">
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">QR Studio</h1>
              <p className="text-muted-foreground text-sm">
                Create and manage high-resolution branded QR codes for your venue.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Destination */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-base font-bold uppercase tracking-wider">Target Destination</h2>
                </div>
                
                <Card className="border shadow-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">QR Type</Label>
                        <Select value={qrType} onValueChange={setQrType}>
                          <SelectTrigger className="bg-muted/30 border-muted font-medium h-11">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NORMAL QR" className="font-medium">Normal (Menu Link)</SelectItem>
                            <SelectItem value="TABLE QR" className="font-medium">Table QR</SelectItem>
                            <SelectItem value="ROOM QR" className="font-medium">Room QR</SelectItem>
                            <SelectItem value="ALPHANUMERIC QR" className="font-medium">Alphanumeric QR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Auto-Apply Coupon</Label>
                        <Select value={coupon} onValueChange={setCoupon}>
                          <SelectTrigger className="bg-muted/30 border-muted font-medium h-11">
                            <SelectValue placeholder="No coupon selected" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none" className="font-medium">None</SelectItem>
                            <SelectItem value="welcome10" className="font-medium">WELCOME10 (10% Off)</SelectItem>
                            <SelectItem value="summer25" className="font-medium">SUMMER25 (25% Off)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
                      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground leading-relaxed italic">
                        Select a coupon that you&apos;d like to auto apply when using the QR code.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2: Styling */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                    2
                  </div>
                  <h2 className="text-base font-bold uppercase tracking-wider">Style & Quality</h2>
                </div>

                <Card className="border shadow-sm">
                  <CardContent className="p-6 space-y-8">
                    {/* Color Section */}
                    <div className="space-y-4">
                      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visual Brand Color</Label>
                      <div className="flex flex-wrap items-center gap-4">
                        {BRAND_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setQrColor(color.value)}
                            className={cn(
                              "h-10 w-10 rounded-full transition-all border-2 flex items-center justify-center shadow-sm",
                              qrColor === color.value ? "border-primary scale-110" : "border-transparent hover:border-muted"
                            )}
                            style={{ backgroundColor: color.value }}
                          >
                            {qrColor === color.value && <CheckCircle2 className="h-5 w-5 text-white" />}
                          </button>
                        ))}
                        <div className="h-8 w-px bg-border mx-1" />
                        <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-full border shadow-inner">
                          <div className="relative h-6 w-6 rounded-full overflow-hidden border shadow-sm">
                            <input 
                              type="color" 
                              value={qrColor}
                              onChange={(e) => setQrColor(e.target.value)}
                              className="absolute inset-[-50%] h-[200%] w-[200%] cursor-pointer"
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-muted-foreground uppercase">{qrColor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* High Durability Card */}
                      <div className={cn(
                        "flex flex-col p-5 rounded-xl border transition-all duration-300",
                        isHighErrorCorrection ? "bg-primary/5 border-primary/30" : "bg-card border-border"
                      )}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", isHighErrorCorrection ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                            <Printer className="h-5 w-5" />
                          </div>
                          <Switch checked={isHighErrorCorrection} onCheckedChange={setIsHighErrorCorrection} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-sm">High Error Correction</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Ensures scannability for stickers or physical cards that may get damaged.
                          </p>
                        </div>
                      </div>

                      {/* Add Branding Card */}
                      <div className={cn(
                        "flex flex-col p-5 rounded-xl border transition-all duration-300",
                        isBrandingEnabled ? "bg-primary/5 border-primary/30" : "bg-card border-border"
                      )}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", isBrandingEnabled ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <Switch checked={isBrandingEnabled} onCheckedChange={setIsBrandingEnabled} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-sm">Add Branding</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Overlay your restaurant logo in the center of the QR code.
                          </p>
                        </div>

                        {isBrandingEnabled && (
                          <div className="mt-5 pt-5 border-t border-primary/10 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                {customLogo ? (
                                  <Image src={customLogo} alt="Logo" width={40} height={40} className="object-contain" />
                                ) : (
                                  <Upload className="h-4 w-4 text-muted-foreground opacity-40" />
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{customLogo ? 'Custom' : 'Default'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider px-3" onClick={triggerUpload}>
                                {customLogo ? 'Change' : 'Upload'}
                              </Button>
                              {customLogo && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={clearLogo}>
                                  <X className="h-4 w-4" />
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
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                    3
                  </div>
                  <h2 className="text-base font-bold uppercase tracking-wider">Export Asset</h2>
                </div>
                <Button 
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="h-14 px-8 rounded-xl font-semibold text-base shadow-sm hover:shadow-md transition-all w-full bg-primary text-primary-foreground"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download QR Code
                </Button>
              </div>

            </div>

            {/* Preview Area */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-6">
                <Card className="overflow-hidden border-0 shadow-xl bg-white rounded-2xl">
                  <div className="bg-muted/30 px-5 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Proof</span>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground bg-background px-2 py-0.5 rounded border">
                      VECTOR QUALITY
                    </span>
                  </div>
                  
                  <CardContent className="p-10 flex flex-col items-center gap-10">
                    <div className="relative p-8 bg-white rounded-2xl border border-dashed border-muted-foreground/20 transition-all">
                      <QrCode 
                        className="h-64 w-64 transition-colors duration-500" 
                        style={{ color: qrColor }}
                        strokeWidth={1.2}
                      />
                      {isBrandingEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white p-1.5 rounded-xl shadow-lg border border-muted/50 animate-in zoom-in duration-500">
                            <div className="h-14 w-14 rounded-lg overflow-hidden relative bg-white flex items-center justify-center">
                              <Image
                                src={customLogo || "https://picsum.photos/seed/brand/100/100"}
                                fill
                                alt="Logo"
                                className={cn("object-cover", !customLogo && "grayscale opacity-20")}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Destination Preview</span>
                      </div>
                      <div className="flex items-center bg-muted/20 rounded-xl border border-muted px-4 h-12 shadow-inner group cursor-default">
                        <ExternalLink className="h-4 w-4 text-primary shrink-0 mr-3 opacity-60" />
                        <p className="text-xs font-semibold truncate text-muted-foreground/80">
                          bloomsburys.menu/qr/rak-table-05{coupon !== 'none' ? `?c=${coupon}` : ''}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-5 rounded-2xl border bg-primary/5 border-primary/10 flex items-start gap-4">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Design Tip</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                      Ensure there is high contrast between your brand color and the background for the fastest possible customer scanning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Export Dialog */}
      <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
          <div className="p-8 space-y-8">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold tracking-tight">Export QR Asset</DialogTitle>
              <DialogDescription className="text-sm font-medium">
                Choose the professional format that best suits your production requirements.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { id: 'PNG', label: 'Image', type: 'WEB READY', icon: FileImage, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 'SVG', label: 'Vector', type: 'PRINT READY', icon: Layers, color: 'text-teal-600', bg: 'bg-teal-50' },
                { id: 'PDF', label: 'Document', type: 'SHAREABLE', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleDownload(item.id)}
                  className="flex flex-col items-center gap-5 p-8 rounded-2xl border-2 border-muted bg-card hover:border-primary hover:bg-primary/[0.02] transition-all group outline-none"
                >
                  <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm", item.bg, item.color)}>
                    <item.icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-bold text-foreground">{item.id}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{item.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-muted/30 border-t flex justify-center">
            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-[0.2em] h-10 px-8 rounded-full" onClick={() => setIsDownloadModalOpen(false)}>
              Back to Studio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
