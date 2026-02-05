'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Upload, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { getCategoryOptions } from './utils';
import type { Column } from './types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentId: z.string().default('none'),
  // display
  displayFullwidth: z.boolean().default(false),
  hiddenTitle: z.boolean().default(false),
  hiddenImage: z.boolean().default(false),
  cardShadow: z.boolean().default(true),
  // advanced
  hidden: z.boolean().default(false),
  disableLink: z.boolean().default(false),
  externalLink: z.string().url().optional().or(z.literal('')),
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

export function AddCategorySheet({
  open,
  onOpenChange,
  onAddCategory,
  board,
  initialParentId = 'none',
}: AddCategorySheetProps) {
  const [activeTab, setActiveTab] = useState('general');
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
      hidden: false,
      disableLink: false,
      externalLink: '',
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
        hidden: false,
        disableLink: false,
        externalLink: '',
        enableSpecial: false,
        displaySeparate: false,
      });
      setActiveTab('general');
    }
  }, [open, initialParentId, form]);

  const onSubmit = (data: CategoryFormValues) => {
    onAddCategory(data);
    onOpenChange(false);
  };
  
  const { errors } = form.formState;

  const isGeneralComplete = !errors.name && form.getValues('name');
  
  const tabsConfig = [
    { value: 'general', label: 'General', isComplete: isGeneralComplete },
    { value: 'display', label: 'Display', isComplete: true },
    { value: 'advanced', label: 'Advanced', isComplete: true },
  ];
  
  const handleNext = () => {
    const currentIndex = tabsConfig.findIndex(tab => tab.value === activeTab);
    if (currentIndex < tabsConfig.length - 1) {
        setActiveTab(tabsConfig[currentIndex + 1].value);
    }
  };

  const isLastTab = activeTab === tabsConfig[tabsConfig.length - 1].value;
  
  const disableLink = form.watch('disableLink');
  const enableSpecial = form.watch('enableSpecial');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-xl">Add New Category</SheetTitle>
              <SheetDescription>
                Enter the details for your new category.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-grow overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="w-full justify-start rounded-none border-b px-6 py-2 h-auto bg-background sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                          {tabsConfig.map((tab, index) => {
                              const isActive = activeTab === tab.value;
                              const isComplete = tab.isComplete;
                              return (
                                <TabsTrigger
                                  key={tab.value}
                                  value={tab.value}
                                  className={cn(
                                    "relative flex items-center gap-3 p-2 transition-colors",
                                    isActive ? "" : "rounded-lg hover:bg-muted/50"
                                  )}
                                >
                                  {isComplete && !isActive ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <div
                                        className={cn(
                                        'flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold',
                                        'transition-colors',
                                        isActive
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-background text-muted-foreground',
                                        !isComplete && !isActive && 'border-destructive text-destructive'
                                        )}
                                    >
                                        {index + 1}
                                    </div>
                                  )}
                                  <span
                                    className={cn(
                                      'font-medium transition-colors',
                                      isActive ? 'text-foreground' : 'text-muted-foreground',
                                      isComplete && !isActive && 'text-foreground'
                                    )}
                                  >
                                    {tab.label}
                                  </span>
                                  {isActive && (
                                    <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-primary" />
                                  )}
                                </TabsTrigger>
                              );
                          })}
                    </div>
                </TabsList>

                <TabsContent value="general" className="p-6 space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Category Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Desserts" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} placeholder="A short description for this category." /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <FormField control={form.control} name="parentId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parent</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a parent category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="none">None (New Top-level Column)</SelectItem>
                                    {categoryOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <span style={{ paddingLeft: `${option.depth * 1.5}rem` }}>
                                                {option.depth > 0 && '↳ '}
                                                {option.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <Button variant="outline" asChild>
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                    <Input id="image-upload" type="file" className="sr-only" />
                                </label>
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="display" className="p-6 space-y-6">
                    <h3 className="font-medium text-lg">Display Settings</h3>
                    <FormField control={form.control} name="displayFullwidth" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5"><FormLabel>Display Fullwidth</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="hiddenTitle" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5"><FormLabel>Hidden Title</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="hiddenImage" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5"><FormLabel>Hidden Image</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="cardShadow" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5"><FormLabel>Card Shadow</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                </TabsContent>

                 <TabsContent value="advanced" className="p-6 space-y-6">
                    <h3 className="font-medium text-lg">Visibility</h3>
                    <FormField control={form.control} name="hidden" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5"><FormLabel>Hidden</FormLabel></div>
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        </FormItem>
                    )} />
                    
                    <div className="rounded-lg border p-4 space-y-4">
                         <FormField control={form.control} name="disableLink" render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5"><FormLabel>Disable Link</FormLabel></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )} />
                        {disableLink && (
                            <FormField control={form.control} name="externalLink" render={({ field }) => (
                                <FormItem className="pt-4 border-t"><FormLabel>External Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}
                    </div>

                    <h3 className="font-medium text-lg mt-6">Special Category Settings</h3>
                     <div className="rounded-lg border p-4 space-y-4">
                         <FormField control={form.control} name="enableSpecial" render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <div className="space-y-0.5"><FormLabel>Enable Special Category</FormLabel></div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )} />
                        {enableSpecial && (
                            <div className="pt-4 border-t space-y-6">
                                <FormField control={form.control} name="specialType" render={({ field }) => (
                                    <FormItem><FormLabel>Special Category Type</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="popular">Popular</SelectItem><SelectItem value="new">New</SelectItem><SelectItem value="featured">Featured</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="displaySeparate" render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5"><FormLabel>Display products in separate categories</FormLabel></div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        )}
                    </div>
                </TabsContent>

              </Tabs>
            </div>
            <SheetFooter className="p-6 border-t bg-background">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              {isLastTab ? (
                <Button type="submit">Save Category</Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
