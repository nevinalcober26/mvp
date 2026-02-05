
'use client';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Upload, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { getCategoryOptions } from './utils';
import type { Column } from './types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentId: z.string().default('none'),
  // display
  displayFullwidth: z.boolean().default(false),
  hiddenTitle: z.boolean().default(false),
  hiddenImage: z.boolean().default(false),
  cardShadow: z.boolean().default(true),
  viewFormat: z.string().optional(),
  // advanced
  hidden: z.boolean().default(false),
  disableLink: z.boolean().default(false),
  externalLink: z.string().url().optional().or(z.literal('')),
  promotions: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  // special
  enableSpecial: z.boolean().default(false),
  specialType: z.string().optional(),
  displaySeparate: z.boolean().default(false),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface AddCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (values: CategoryFormValues) => void;
  board: Column[];
  initialParentId?: UniqueIdentifier | 'none' | 'new-column';
}

const formTabs = [
    { id: 'general', label: 'General' },
    { id: 'display', label: 'Display' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'special', label: 'Special' },
]

export function AddCategorySheet({
  open,
  onOpenChange,
  onAddCategory,
  board,
  initialParentId = 'none',
}: AddCategorySheetProps) {
  const [activeTab, setActiveTab] = useState(formTabs[0].id);
  const categoryOptions = useMemo(() => getCategoryOptions(board), [board]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentId: initialParentId.toString(),
      displayFullwidth: false,
      hiddenTitle: false,
      hiddenImage: false,
      cardShadow: true,
      viewFormat: 'grid_with_images',
      hidden: false,
      disableLink: false,
      externalLink: '',
      promotions: 'none',
      sortOrder: 0,
      enableSpecial: false,
      displaySeparate: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        description: '',
        parentId: initialParentId.toString() === 'new-column' ? 'none' : initialParentId.toString(),
        displayFullwidth: false,
        hiddenTitle: false,
        hiddenImage: false,
        cardShadow: true,
        viewFormat: 'grid_with_images',
        hidden: false,
        disableLink: false,
        externalLink: '',
        promotions: 'none',
        sortOrder: 0,
        enableSpecial: false,
        displaySeparate: false,
      });
      setActiveTab(formTabs[0].id);
    }
  }, [open, initialParentId, form]);

  const onSubmit = (data: CategoryFormValues) => {
    onAddCategory(data);
    onOpenChange(false);
  };
  
  const disableLink = form.watch('disableLink');
  const enableSpecial = form.watch('enableSpecial');
  
  const currentTabIndex = formTabs.findIndex(tab => tab.id === activeTab);
  const handleNext = () => {
    if(currentTabIndex < formTabs.length - 1) {
        setActiveTab(formTabs[currentTabIndex + 1].id)
    }
  }
  const handleBack = () => {
    if(currentTabIndex > 0) {
        setActiveTab(formTabs[currentTabIndex - 1].id)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-xl">Add New Category</SheetTitle>
              <SheetDescription>
                Enter the details for your new category. All fields can be updated later.
              </SheetDescription>
            </SheetHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b px-6 py-2 h-auto bg-background sticky top-0 z-10">
                    {formTabs.map(tab => (
                        <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
                    ))}
                </TabsList>
                <ScrollArea className="flex-grow">
                    <div className="p-6 space-y-6">
                        <TabsContent value="general" className="mt-0">
                            <Card>
                                <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Category Name*</FormLabel><FormControl><Input {...field} placeholder="e.g., Desserts" /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} placeholder="A short description for this category." /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="parentId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parent</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a parent category" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None (New Top-level Column)</SelectItem>
                                                    {categoryOptions.map((option) => (<SelectItem key={option.value} value={option.value}><span style={{ paddingLeft: `${option.depth * 1.5}rem` }}>{option.depth > 0 && '↳ '}{option.label}</span></SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <div className="space-y-2">
                                        <FormLabel>Image</FormLabel>
                                        <div className="flex items-center gap-6">
                                            <div className="w-40 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>
                                            <Button variant="outline" asChild><label htmlFor="image-upload" className="cursor-pointer"><Upload className="mr-2 h-4 w-4" />Upload Image<Input id="image-upload" type="file" className="sr-only" /></label></Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="display">
                             <Card>
                                <CardHeader><CardTitle>Display Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-2 pt-6">
                                    <FormField control={form.control} name="displayFullwidth" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Display Fullwidth</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                    <FormField control={form.control} name="hiddenTitle" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Hidden Title</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                    <FormField control={form.control} name="hiddenImage" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Hidden Image</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                    <FormField control={form.control} name="cardShadow" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Card Shadow</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                    <FormField control={form.control} name="viewFormat" render={({ field }) => (<FormItem><FormLabel>View Format</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select view format" /></SelectTrigger></FormControl><SelectContent><SelectItem value="grid_with_images">Grid with Images</SelectItem><SelectItem value="list">List View</SelectItem></SelectContent></Select></FormItem>)} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="advanced">
                             <Card>
                                <CardHeader><CardTitle>Advanced Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <FormField control={form.control} name="hidden" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Hidden</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                    <div className="rounded-lg border p-3 space-y-4">
                                        <FormField control={form.control} name="disableLink" render={({ field }) => (<FormItem className="flex items-center justify-between"><div className="space-y-0.5"><FormLabel>Disable Link</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                        {disableLink && (<FormField control={form.control} name="externalLink" render={({ field }) => (<FormItem className="pt-3 border-t"><FormLabel>External Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                                    </div>
                                    <FormField control={form.control} name="promotions" render={({ field }) => (<FormItem><FormLabel>Promotions</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select promotions" /></SelectTrigger></FormControl><SelectContent><SelectItem value="none">No Promotions</SelectItem><SelectItem value="summer_sale">Summer Sale</SelectItem></SelectContent></Select></FormItem>)} />
                                    <FormField control={form.control} name="sortOrder" render={({ field }) => (<FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                                </CardContent>
                            </Card>
                         </TabsContent>
                         <TabsContent value="special">
                             <Card>
                                <CardHeader><CardTitle>Special Category Settings</CardTitle></CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <FormField control={form.control} name="enableSpecial" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Enable Special Category</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                    {enableSpecial && (
                                        <div className="pt-4 border-t space-y-6">
                                            <FormField control={form.control} name="specialType" render={({ field }) => (<FormItem><FormLabel>Special Category Type</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="popular">Popular</SelectItem><SelectItem value="new">New</SelectItem><SelectItem value="featured">Featured</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name="displaySeparate" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-4"><div className="space-y-0.5"><FormLabel>Display products in separate categories</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                         </TabsContent>
                    </div>
                </ScrollArea>
            </Tabs>
            <SheetFooter className="p-6 border-t bg-background flex justify-between">
                <div>
                     {currentTabIndex > 0 && (
                        <Button type="button" variant="outline" onClick={handleBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    )}
                </div>
                <div>
                    <SheetClose asChild>
                        <Button variant="ghost">Cancel</Button>
                    </SheetClose>
                    {currentTabIndex < formTabs.length - 1 ? (
                        <Button type="button" onClick={handleNext}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                         <Button type="submit">Save Category</Button>
                    )}
                </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

    