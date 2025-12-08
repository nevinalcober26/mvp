'use client';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import type { Column, Item } from './page';
import Image from 'next/image';

interface CategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Column | Item | null;
}

export function CategorySheet({
  open,
  onOpenChange,
  category,
}: CategorySheetProps) {
  const [disableLink, setDisableLink] = useState(false);
  const [enableSpecial, setEnableSpecial] = useState(false);

  useEffect(() => {
    // When the sheet opens or the category changes, reset the state
    // In a real app, you would set this based on the category's properties
    if (category) {
      setDisableLink(false);
      setEnableSpecial(false);
    }
  }, [category, open]);

  if (!category) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-xl">Update Category</SheetTitle>
            <SheetDescription>
              Edit the details for '{category.name}'.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-grow overflow-y-auto">
            <Tabs defaultValue="general" className="h-full">
              <TabsList className="w-full justify-start rounded-none border-b px-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input id="category-name" defaultValue={category.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter a description for your category."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent</Label>
                  <Select>
                    <SelectTrigger id="parent">
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-6">
                    <div className="w-40 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted">
                        <Image src="https://picsum.photos/seed/menu/160/96" width={160} height={96} alt="Category image" className="rounded-md object-cover"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild>
                           <label htmlFor="image-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Image
                                <Input id="image-upload" type="file" className="sr-only" />
                            </label>
                        </Button>
                        <Button variant="ghost" className="text-destructive hover:text-destructive">Clear</Button>
                        <p className="text-xs text-muted-foreground">Recommended: 900px x 500px</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="display" className="p-6 space-y-6">
                 <h3 className="font-medium text-lg">Display Settings</h3>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="display-fullwidth">Display Fullwidth</Label>
                      <p className="text-xs text-muted-foreground">If enabled, will display the category in fullwidth in the app.</p>
                    </div>
                    <Switch id="display-fullwidth" />
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="hidden-title">Hidden Title</Label>
                      <p className="text-xs text-muted-foreground">If enabled, category title will not be displayed.</p>
                    </div>
                    <Switch id="hidden-title" />
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="hidden-image">Hidden Image</Label>
                      <p className="text-xs text-muted-foreground">If enabled, category image will not be displayed.</p>
                    </div>
                    <Switch id="hidden-image" />
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="card-shadow">Card Shadow</Label>
                      <p className="text-xs text-muted-foreground">If enabled, the category card will display with shadow.</p>
                    </div>
                    <Switch id="card-shadow" />
                 </div>
              </TabsContent>
              <TabsContent value="advanced" className="p-6 space-y-6">
                <h3 className="font-medium text-lg">Visibility</h3>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="hidden">Hidden</Label>
                        <p className="text-xs text-muted-foreground">If enabled, this category will be hidden and not displayed in the app.</p>
                    </div>
                    <Switch id="hidden" />
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="disable-link">Disable Link</Label>
                            <p className="text-xs text-muted-foreground">If enabled, this category will not be clickable, and not shown in menu.</p>
                        </div>
                        <Switch 
                          id="disable-link" 
                          checked={disableLink}
                          onCheckedChange={setDisableLink}
                        />
                    </div>

                    {disableLink && (
                      <div className="space-y-2 pt-4 border-t">
                        <Label htmlFor="external-link">External Link</Label>
                        <Input id="external-link" placeholder="https://www.example.com" />
                        <p className="text-xs text-muted-foreground">If provided, this product will be a link to the external URL.</p>
                      </div>
                    )}
                </div>

                <h3 className="font-medium text-lg mt-6">Special Category Settings</h3>
                 <div className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="enable-special">Enable Special Category</Label>
                            <p className="text-xs text-muted-foreground">If enabled, this category will act as a special category.</p>
                        </div>
                        <Switch 
                          id="enable-special"
                          checked={enableSpecial}
                          onCheckedChange={setEnableSpecial}
                        />
                    </div>
                    
                    {enableSpecial && (
                      <div className="pt-4 border-t space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="special-type">Special Category Type</Label>
                          <Select>
                            <SelectTrigger id="special-type">
                              <SelectValue placeholder="Select type of products to display" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="popular">Popular</SelectItem>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="featured">Featured</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label htmlFor="display-separate">Display products in separate categories</Label>
                                <p className="text-xs text-muted-foreground">If enabled, products will be displayed in separate categories.</p>
                            </div>
                           <Switch id="display-separate" />
                        </div>
                      </div>
                    )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <SheetFooter className="p-6 border-t bg-background">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button>Save Category</Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
