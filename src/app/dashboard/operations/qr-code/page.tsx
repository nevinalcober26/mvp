'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QrCode, Download, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QrCodePage() {
  const [qrColor, setQrColor] = useState('#000000');
  const [isCustomUrl, setIsCustomUrl] = useState(false);
  const [fileType, setFileType] = useState('PNG');
  const [qrType, setQrType] = useState('NORMAL QR');
  const [isHighErrorCorrection, setIsHighErrorCorrection] = useState(false);

  const breadcrumbItems = [
    { label: 'Operations' },
    { label: 'QR Code' }
  ];

  return (
    <>
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Breadcrumbs items={breadcrumbItems} />
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">QR Code Management</h1>
              <p className="text-muted-foreground mt-1">
                Generate and manage QR codes for tables and digital menus.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 font-semibold">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
              <Button className="gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-5 w-5" />
                Generate New Code
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border-0 shadow-smooth">
            <CardContent className="p-0">
              {/* Header Badge */}
              <div className="p-6 pb-0">
                <div className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm">
                  QR Code Generator
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 pt-6">
                {/* Form Section */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="custom-url" 
                        checked={isCustomUrl}
                        onCheckedChange={(checked) => setIsCustomUrl(!!checked)}
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label 
                          htmlFor="custom-url" 
                          className={cn("text-sm font-bold cursor-pointer", !isCustomUrl && "text-muted-foreground")}
                        >
                          Generate Custom URL QR
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Use this to generate generic QR codes with custom URLs
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">File Type*</Label>
                        <Select value={fileType} onValueChange={setFileType}>
                          <SelectTrigger className="w-full border-0 border-b rounded-none px-0 shadow-none focus:ring-0">
                            <SelectValue placeholder="Select file type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PNG">PNG</SelectItem>
                            <SelectItem value="JPG">JPG</SelectItem>
                            <SelectItem value="SVG">SVG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">QR Type*</Label>
                        <Select value={qrType} onValueChange={setQrType}>
                          <SelectTrigger className="w-full border-0 border-b rounded-none px-0 shadow-none focus:ring-0">
                            <SelectValue placeholder="Select QR type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NORMAL QR">NORMAL QR</SelectItem>
                            <SelectItem value="TABLE QR">TABLE QR</SelectItem>
                            <SelectItem value="MENU QR">MENU QR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Color*</Label>
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-8 w-8 rounded border shadow-sm shrink-0" 
                            style={{ backgroundColor: qrColor }}
                          />
                          <Input 
                            value={qrColor} 
                            onChange={(e) => setQrColor(e.target.value)}
                            className="border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0 font-mono"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pt-2">
                        <Checkbox 
                          id="error-correction" 
                          checked={isHighErrorCorrection}
                          onCheckedChange={(checked) => setIsHighErrorCorrection(!!checked)}
                        />
                        <Label 
                          htmlFor="error-correction" 
                          className={cn("text-sm font-bold cursor-pointer", !isHighErrorCorrection && "text-muted-foreground")}
                        >
                          Enable High Error Correction
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Auto Apply Coupon</Label>
                        <Select>
                          <SelectTrigger className="w-full border-0 border-b rounded-none px-0 shadow-none focus:ring-0">
                            <SelectValue placeholder="----------" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="WELCOME10">WELCOME10 (10% Off)</SelectItem>
                            <SelectItem value="FREEDRINK">FREEDRINK (Free Beverage)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground">
                          Select a coupon that you'd like to auto apply when using the QR code.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest px-8">
                    Download
                  </Button>
                </div>

                {/* Preview Section */}
                <div className="flex flex-col items-center justify-center space-y-8 bg-gray-50/30 rounded-2xl p-12 border border-dashed">
                  <div className="relative p-4 bg-white rounded-3xl shadow-2xl transition-all hover:scale-[1.02]">
                    <QrCode 
                      className="h-64 w-64 transition-colors duration-300" 
                      style={{ color: qrColor }}
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Preview</p>
                    <button className="text-xs font-bold text-primary underline-offset-4 hover:underline">
                      Link
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
