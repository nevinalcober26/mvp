'use client';
import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
                 <div className="flex items-start space-x-3">
                    <Checkbox id="display-fullwidth" className="mt-1" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="display-fullwidth">Display Fullwidth</Label>
                      <p className="text-xs text-muted-foreground">If checked, will display the category in fullwidth in the app.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-3">
                    <Checkbox id="hidden-title" className="mt-1" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="hidden-title">Hidden Title</Label>
                      <p className="text-xs text-muted-foreground">If checked, category title will not be displayed.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-3">
                    <Checkbox id="hidden-image" className="mt-1" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="hidden-image">Hidden Image</Label>
                      <p className="text-xs text-muted-foreground">If checked, category image will not be displayed.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-3">
                    <Checkbox id="card-shadow" className="mt-1" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="card-shadow">Card Shadow</Label>
                      <p className="text-xs text-muted-foreground">If checked, the category card will display with shadow.</p>
                    </div>
                 </div>
              </TabsContent>
              <TabsContent value="advanced" className="p-6 space-y-6">
                <h3 className="font-medium text-lg">Visibility</h3>
                <div className="flex items-start space-x-3">
                    <Checkbox id="hidden" className="mt-1" />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="hidden">Hidden</Label>
                        <p className="text-xs text-muted-foreground">If checked, this category will be hidden and not displayed in the app.</p>
                    </div>
                </div>

                <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="disable-link" 
                      className="mt-1" 
                      checked={disableLink}
                      onCheckedChange={(checked) => setDisableLink(Boolean(checked))}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="disable-link">Disable Link</Label>
                        <p className="text-xs text-muted-foreground">If checked, this category will not be clickable, and not shown in menu.</p>
                    </div>
                </div>

                {disableLink && (
                  <div className="space-y-2 pl-6">
                    <Label htmlFor="external-link">External Link</Label>
                    <Input id="external-link" placeholder="https://www.example.com" />
                    <p className="text-xs text-muted-foreground">If provided, this product will be a link to the external URL.</p>
                  </div>
                )}

                <h3 className="font-medium text-lg mt-6">Special Category Settings</h3>
                <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="enable-special" 
                      className="mt-1"
                      checked={enableSpecial}
                      onCheckedChange={(checked) => setEnableSpecial(Boolean(checked))}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="enable-special">Enable Special Category</Label>
                        <p className="text-xs text-muted-foreground">If checked, this category will act as a special category.</p>
                    </div>
                </div>
                
                {enableSpecial && (
                  <div className="pl-6 space-y-6">
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
                    <div className="flex items-start space-x-3">
                        <Checkbox id="display-separate" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="display-separate">Display products in separate categories</Label>
                            <p className="text-xs text-muted-foreground">If checked, products will be displayed in separate categories.</p>
                        </div>
                    </div>
                  </div>
                )}
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