'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuBuilderPreloader } from '@/components/dashboard/menu-builder/preloader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EMenuIcon } from '@/components/dashboard/app-sidebar';
import { List, LayoutGrid, X, Plus } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const TemplateCard = ({ name, imageHint }: { name: string; imageHint: string }) => {
    const image = PlaceHolderImages.find(img => img.imageHint === imageHint);
    return (
        <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="p-3 border-b">
                <p className="text-xs font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-primary transition-colors"/>
                    {name}
                </p>
            </CardHeader>
            <CardContent className="p-3">
                 <div className="aspect-[4/3] w-full bg-muted rounded-md overflow-hidden">
                    {image && <Image src={image.imageUrl} alt={name} width={600} height={400} className="object-cover h-full w-full" data-ai-hint={image.imageHint}/>}
                </div>
            </CardContent>
        </Card>
    )
};


const MenuBuilderMainPage = ({ onClose }: { onClose: () => void }) => {
    const templates = [
        { name: 'Template 1', imageHint: 'abstract red' },
        { name: 'Template 2', imageHint: 'dark theme' },
        { name: 'Template 3', imageHint: 'gray placeholder' },
    ];
    
    const userMenus = [
        { name: 'My Ramadan Menu', imageHint: 'abstract red' },
        { name: 'Main Dinner Menu', imageHint: 'dark theme' },
    ];

    return (
        <div className="fixed inset-0 z-40 bg-background flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex-shrink-0 h-16 border-b flex items-center px-4 justify-between bg-card">
                 <div className="flex items-center gap-4">
                    <EMenuIcon />
                 </div>
                 <div className="flex items-center gap-2">
                    <Button> <Plus className="h-4 w-4 mr-2"/> Add</Button>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5"/></Button>
                 </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-card border-r p-4 flex flex-col">
                    <Button variant="ghost" className="w-full justify-start font-semibold text-base bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
                        <List className="mr-3 h-5 w-5"/> Create a Menu
                    </Button>
                    
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-8 mb-2 px-3">CUSTOMIZATION</p>
                     <Button variant="ghost" className="w-full justify-start font-semibold text-base">
                        <LayoutGrid className="mr-3 h-5 w-5"/> Brand Management
                    </Button>
                </div>

                {/* Main Content */}
                <ScrollArea className="flex-1">
                    <div className="p-8 space-y-10">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Templates</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map(t => <TemplateCard key={t.name} name={t.name} imageHint={t.imageHint}/>)}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Your Menus</h2>
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {userMenus.map(m => <TemplateCard key={m.name} name={m.name} imageHint={m.imageHint}/>)}
                                <Card className="border-2 border-dashed bg-muted/50 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center min-h-[200px] cursor-pointer">
                                    <div className="text-center text-muted-foreground">
                                        <Plus className="mx-auto h-8 w-8 mb-2"/>
                                        <p className="font-semibold">Create New Menu</p>
                                    </div>
                                </Card>
                            </div>
                        </section>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default function MenuBuilderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLoaded = () => {
    setShowBuilder(true);
  };

  const handleClose = () => {
    router.back();
  };

  if (!showBuilder) {
    return <MenuBuilderPreloader onLoaded={handleLoaded} />;
  }

  return <MenuBuilderMainPage onClose={handleClose} />;
}