
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Upload,
  PlusCircle,
  Trash,
  Video,
  HelpCircle,
  Wand,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  Image as ImageIcon,
  GalleryHorizontal,
  X,
  Leaf,
} from 'lucide-react';
import type { Product, ProductVariationGroup } from './types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateProductDescription } from '@/ai/flows/generate-product-description-flow';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCategories, mockVariationGroups, mockComboGroupNames } from '@/lib/mock-data-store';
import { getCategoryNameOptions } from '@/app/dashboard/categories/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';

const productSchema = z
  .object({
    name: z.string().min(1, 'Product name is required'),
    category: z.string().min(1, 'Category is required'),
    properties: z.array(z.string()).default([]),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    smallDescription: z.string().optional(),
    description: z.string().optional(),
    discountType: z.enum(['none', 'percentage', 'fixed']).default('none'),
    discountValue: z.coerce.number().positive('Discount must be a positive number.').optional(),
    recommend: z.boolean().default(false),
    displayFullwidth: z.boolean().default(false),
    hiddenTitle: z.boolean().default(false),
    hiddenImage: z.boolean().default(false),
    disableLink: z.boolean().default(false),
    cardShadow: z.boolean().default(true),
    hidden: z.boolean().default(false),
    outOfStock: z.boolean().default(false),
    upsell: z.boolean().default(false),
    enableCombo: z.boolean().default(false),
    comboGroup: z.string().optional(),
    videoUrl: z.string().url().optional().or(z.literal('')),
    externalLink: z.string().url().optional().or(z.literal('')),
    variationGroups: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        multiple: z.boolean(),
        required: z.boolean(),
        options: z.array(
          z.object({
            id: z.string(),
            value: z.string(),
            priceMode: z.enum(['override', 'add', 'subtract']),
            priceValue: z.coerce.number().min(0),
            hidden: z.boolean(),
          })
        )
      })
    ).optional(),
    enableNutrition: z.boolean().default(true),
    nutrition: z.array(z.object({
      name: z.string(), // This will be the key like 'protein'
      value: z.coerce.number().min(0, "Value cannot be negative.").optional(),
    })).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === 'percentage') {
      if (!data.discountValue) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Percentage value is required.', path: ['discountValue'] });
      } else if (data.discountValue > 100) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Percentage cannot be over 100.', path: ['discountValue'] });
      }
    }
    if (data.discountType === 'fixed') {
      if (!data.discountValue) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Discount amount is required.', path: ['discountValue'] });
      } else if (data.discountValue >= data.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Fixed discount must be less than the product price.',
          path: ['discountValue'],
        });
      }
    }
    if (data.discountType !== 'none' && !data.discountValue) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'A discount value is required.', path: ['discountValue'] });
    }
  });

type ProductFormValues = z.infer<typeof productSchema>;

const mockProperties = ['Spicy', 'Vegetarian', 'Gluten-Free', 'New'];

const initialNutritionItems: { id: string; name: string; unit: 'g' | 'mg' | 'kcal'; enabled: boolean; }[] = [
  { id: '2', name: 'Protein', unit: 'g', enabled: true },
  { id: '3', name: 'Fat', unit: 'g', enabled: true },
  { id: '4', name: 'Carbohydrates', unit: 'g', enabled: true },
  { id: '5', name: 'Sugar', unit: 'g', enabled: true },
  { id: '6', name: 'Sodium', unit: 'mg', enabled: true },
  { id: '7', name: 'Fiber', unit: 'g', enabled: true },
];

export function ProductSheet({
  open,
  onOpenChange,
  product,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (data: Product) => void;
}) {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState<'short' | 'long' | null>(
    null
  );
  const [showNewComboInput, setShowNewComboInput] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const categoryOptions = useMemo(() => getCategoryNameOptions(mockCategories), []);

  const defaultValues = useMemo(() => {
    let discountType: 'none' | 'percentage' | 'fixed' = 'none';
    let discountValue: number | undefined;

    if (product?.price && product.discountedPrice && product.discountedPrice < product.price) {
        discountType = 'fixed';
        discountValue = product.price - product.discountedPrice;
    }
    
    const nutritionArray = product?.nutrition 
        ? Object.entries(product.nutrition).map(([key, value]) => ({ name: key, value: value as number })) 
        : [];

    return {
      name: product?.name || '',
      category: product?.category || '',
      properties: product?.properties ? product.properties.split(',').map(s => s.trim()).filter(Boolean) : [],
      price: product?.price || 0,
      smallDescription: product?.smallDescription || '',
      description: product?.description || '',
      discountType,
      discountValue,
      recommend: product?.recommend || false,
      displayFullwidth: product?.displayFullwidth || false,
      hiddenTitle: product?.hiddenTitle || false,
      hiddenImage: product?.hiddenImage || false,
      disableLink: product?.disableLink || false,
      cardShadow: product?.cardShadow ?? true,
      hidden: product?.hidden || false,
      outOfStock: product?.outOfStock || false,
      upsell: product?.upsell || false,
      enableCombo: product?.enableCombo || false,
      comboGroup: product?.comboGroup || '',
      videoUrl: product?.videoUrl || '',
      externalLink: product?.externalLink || '',
      variationGroups: product?.variationGroups || [],
      enableNutrition: !!(product?.nutrition && Object.keys(product.nutrition).length > 0) || !product,
      nutrition: nutritionArray,
    };
  }, [product]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    fields: variationGroupFields,
    append: appendVariationGroup,
    remove: removeVariationGroup,
  } = useFieldArray({
    control: form.control,
    name: "variationGroups",
  });
  
   const {
    fields: nutritionFields,
    append: appendNutrition,
    remove: removeNutrition,
  } = useFieldArray({
    control: form.control,
    name: 'nutrition',
  });

  const toast = useToast();
  const { isDirty, isValid, errors } = form.formState;
  const productName = form.watch('name');
  const productCategory = form.watch('category');

  const price = form.watch('price');
  const discountType = form.watch('discountType');
  const discountValue = form.watch('discountValue');

  const { finalPrice, finalDiscountPercent } = useMemo(() => {
    let calculatedPrice: number | undefined;
    let calculatedPercent: number | undefined;

    if (price > 0 && discountValue && discountValue > 0) {
      if (discountType === 'percentage' && discountValue <= 100) {
        calculatedPrice = price * (1 - discountValue / 100);
        calculatedPercent = discountValue;
      } else if (discountType === 'fixed' && discountValue < price) {
        calculatedPrice = price - discountValue;
        calculatedPercent = (discountValue / price) * 100;
      }
    }
    return { finalPrice: calculatedPrice, finalDiscountPercent: calculatedPercent };
  }, [price, discountType, discountValue]);

  useEffect(() => {
    form.reset(defaultValues);
    setMainImagePreview(product?.mainImage || null);
    setGalleryPreviews(product?.additionalImages || []);
    setShowNewComboInput(false);
  }, [defaultValues, form, product]);

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      onOpenChange(false);
      form.reset(defaultValues);
    }
  };

  const handleConfirmClose = () => {
    setShowUnsavedDialog(false);
    onOpenChange(false);
    form.reset(defaultValues);
  };

  const handleGenerateDescription = async (type: 'short' | 'long') => {
    setIsGenerating(type);

    if (!productName || !productCategory) {
      toast({
        variant: 'destructive',
        title: 'Product Name and Category Required',
        description:
          'Please enter a product name and select a category first.',
      });
      setIsGenerating(null);
      return;
    }

    try {
      const result = await generateProductDescription({
        productName,
        productCategory,
        descriptionType: type,
      });

      if (type === 'short') {
        form.setValue('smallDescription', result.description, { shouldDirty: true, shouldValidate: true });
      } else {
        form.setValue('description', result.description, { shouldDirty: true, shouldValidate: true });
      }

      toast({
        title: 'AI Description Generated',
        description: `Your ${type} description has been filled in.`,
      });
    } catch (error) {
      console.error('AI Description Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description:
          'Could not generate a description at this time. Please try again later.',
      });
    } finally {
      setIsGenerating(null);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMain) {
            setMainImagePreview(reader.result as string);
          } else {
            setGalleryPreviews(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      })
    }
  };
  
  const removeGalleryImage = (index: number) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const onSubmit = (data: ProductFormValues, statusOverride?: Product['status']) => {
    let discountedPrice: number | undefined;
    if (data.discountType === 'percentage' && data.discountValue) {
      discountedPrice = data.price * (1 - data.discountValue / 100);
    } else if (data.discountType === 'fixed' && data.discountValue) {
      discountedPrice = data.price - data.discountValue;
    }

    const { discountType: dt, discountValue: dv, properties: formProperties, enableNutrition, nutrition: nutritionArray, ...restOfData } = data;

    let finalStatus: Product['status'];
    if (product) { // Editing
        finalStatus = product.status;
        if (data.hidden) {
            finalStatus = 'Archived';
        } else if (data.outOfStock) {
            finalStatus = 'Out of Stock';
        } else if (finalStatus === 'Archived' || finalStatus === 'Out of Stock') {
            finalStatus = 'Active'; 
        }
    } else { // Creating
        finalStatus = statusOverride || 'Active';
    }

    const nutritionObject = data.enableNutrition && data.nutrition && data.nutrition.length > 0
        ? data.nutrition.reduce((acc, curr) => {
            if (curr.name && curr.value !== undefined && curr.value !== null) {
                acc[curr.name] = curr.value;
            }
            return acc;
        }, {} as Record<string, number>) 
        : undefined;


    const fullProductData: Product = {
      ...(product || {
        id: `new_${Date.now()}`,
        stock: 0,
      }),
      ...restOfData,
      properties: formProperties?.length ? formProperties.join(', ') : undefined,
      status: finalStatus,
      branch: 'Ras Al Khaimah',
      discountedPrice,
      smallDescription: data.smallDescription || '',
      description: data.description || '',
      mainImage: mainImagePreview || undefined,
      additionalImages: galleryPreviews,
      nutrition: nutritionObject,
      variationGroups: data.variationGroups,
    };
    
    onSave(fullProductData as Product);
    onOpenChange(false);
    form.reset();
  };

  const onInvalid = () => {
    const errorKeys = Object.keys(errors) as Array<keyof ProductFormValues>;
    const tabMap: Record<string, string> = {
      name: 'basic-info',
      category: 'basic-info',
      price: 'pricing',
      discountValue: 'pricing',
      variationGroups: 'variations',
      nutrition: 'nutrition',
    };

    for (const key of errorKeys) {
      if (tabMap[key]) {
        setActiveTab(tabMap[key]);
        setTimeout(() => {
          const fieldElement = document.getElementsByName(key)[0];
          fieldElement?.focus();
        }, 100);
        return;
      }
    }
  };

  const isBasicInfoComplete =
    !errors.name &&
    !errors.category &&
    form.getValues('name') &&
    form.getValues('category');
  const isPricingComplete = !errors.price && !errors.discountValue && form.getValues('price') > 0;
  const areVariationsComplete = !errors.variationGroups;
  
  const tabsConfig = [
    { value: 'basic-info', label: 'Basic Info', isComplete: isBasicInfoComplete },
    { value: 'pricing', label: 'Pricing', isComplete: isPricingComplete },
    { value: 'display', label: 'Display & Options', isComplete: true },
    { value: 'media', label: 'Media', isComplete: true },
    { value: 'variations', label: 'Variations', isComplete: areVariationsComplete },
    { value: 'nutrition', label: 'Nutrition', isComplete: true },
  ];
  
  const addedNutritionNames = nutritionFields.map(field => field.name);
  const availableNutritionItems = initialNutritionItems.filter(
    item => item.enabled && !addedNutritionNames.includes(item.name.toLowerCase().replace(/\s/g, '_'))
  );

  const availableVariationGroups = useMemo(() => {
    const addedGroupIds = new Set(variationGroupFields.map(field => field.id));
    return mockVariationGroups.filter(group => !addedGroupIds.has(group.id));
  }, [variationGroupFields]);

  return (
    <>
      <Sheet open={open} onOpenChange={handleAttemptClose}>
        <SheetContent className="sm:max-w-4xl w-full p-0 bg-card">
          <TooltipProvider>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => onSubmit(data, 'Active'), onInvalid)}
                className="flex flex-col h-full"
              >
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-xl">
                    {product ? 'Edit Product' : 'Add Product'}
                  </SheetTitle>
                  <SheetDescription>
                    Fill in the details for your product across the tabs.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="h-full flex flex-col"
                  >
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
                                        'flex h-5 w-5 items-center justify-center rounded-md border text-xs font-bold',
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
                    <div className="p-6 space-y-6 flex-grow">
                      <TabsContent value="basic-info" className="mt-0">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>This is the core information for your product.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name*</FormLabel>
                                            <FormControl>
                                            <Input
                                                placeholder="e.g., Classic Cheeseburger"
                                                {...field}
                                            />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category*</FormLabel>
                                                <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                >
                                                <FormControl>
                                                    <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categoryOptions.map((cat) => (
                                                        <SelectItem key={cat.value} value={cat.value}>
                                                            <span style={{ paddingLeft: `${cat.depth * 1.5}rem` }}>
                                                                {cat.depth > 0 && '↳ '}
                                                                {cat.label}
                                                            </span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name="properties"
                                            render={({ field }) => (
                                            <FormItem className="flex flex-col gap-2 mt-1.5">
                                                <FormLabel>Properties</FormLabel>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                className={cn(
                                                                    "w-full justify-between font-normal",
                                                                    !field.value?.length && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value?.length > 0
                                                                    ? field.value.join(', ')
                                                                    : "Select properties"}
                                                                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[200px]" align="start">
                                                        {mockProperties.map((prop) => (
                                                            <DropdownMenuCheckboxItem
                                                                key={prop}
                                                                checked={field.value?.includes(prop)}
                                                                onSelect={(e) => e.preventDefault()}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...(field.value || []), prop])
                                                                        : field.onChange((field.value || []).filter((value) => value !== prop))
                                                                }}
                                                            >
                                                                {prop}
                                                            </DropdownMenuCheckboxItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Marketing Copy</CardTitle>
                                    <CardDescription>Write compelling descriptions to attract customers. Use our AI assistant to help!</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="smallDescription"
                                        render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel className="flex items-center gap-1.5">
                                                    Small Description
                                                    <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                        type="button"
                                                        onClick={(e) => e.preventDefault()}
                                                        >
                                                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                        A short, catchy description for product
                                                        cards and list views.
                                                        </p>
                                                    </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                    <div>
                                                        <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleGenerateDescription('short')
                                                        }
                                                        disabled={
                                                            isGenerating !== null ||
                                                            !productName ||
                                                            !productCategory
                                                        }
                                                        className="gap-1.5"
                                                        >
                                                        {isGenerating === 'short' ? (
                                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Wand className="h-4 w-4" />
                                                        )}
                                                        Generate
                                                        </Button>
                                                    </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                    <p>
                                                        {!productName || !productCategory
                                                        ? 'Enter name and category first'
                                                        : 'Generate with AI'}
                                                    </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                            <Input
                                                placeholder="A short, catchy line for your product."
                                                {...field}
                                            />
                                            </FormControl>
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel>Description</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                    <div>
                                                        <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleGenerateDescription('long')
                                                        }
                                                        disabled={
                                                            isGenerating !== null ||
                                                            !productName ||
                                                            !productCategory
                                                        }
                                                        className="gap-1.5"
                                                        >
                                                        {isGenerating === 'long' ? (
                                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Wand className="h-4 w-4" />
                                                        )}
                                                        Generate
                                                        </Button>
                                                    </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                    <p>
                                                        {!productName || !productCategory
                                                        ? 'Enter name and category first'
                                                        : 'Generate with AI'}
                                                    </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                              <Textarea
                                                placeholder="Detailed description including ingredients, allergens, etc."
                                                rows={5}
                                                {...field}
                                              />
                                            </FormControl>
                                        </FormItem>
                                        )}
                                    />
                                </CardContent>
                             </Card>
                        </div>
                      </TabsContent>
                      <TabsContent value="pricing">
                        <Card className="max-w-2xl">
                          <CardHeader>
                            <CardTitle>Pricing Strategy</CardTitle>
                            <CardDescription>
                              Set the price for your product and an optional
                              discount.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price (AED)*</FormLabel>
                                        <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="discountType"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Type</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                form.setValue('discountValue', undefined);
                                                form.clearErrors('discountValue');
                                            }}
                                            value={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select discount type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">No Discount</SelectItem>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                {discountType !== 'none' && (
                                    <FormField
                                        control={form.control}
                                        name="discountValue"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                            {discountType === 'percentage'
                                                ? 'Discount Percentage'
                                                : 'Discount Amount (AED)'}
                                            </FormLabel>
                                            <FormControl>
                                            <Input
                                                type="number"
                                                placeholder={
                                                discountType === 'percentage'
                                                    ? 'e.g. 15'
                                                    : 'e.g. 5.00'
                                                }
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                                            />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            <Card className="bg-muted/50 p-6 space-y-4">
                                <h4 className="font-semibold text-center">Summary</h4>
                                <div>
                                    <p className="text-sm text-muted-foreground">Original Price</p>
                                    <p className="text-lg font-mono font-semibold">{price > 0 ? `$${price.toFixed(2)}` : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Discount</p>
                                    <p className="text-lg font-mono font-semibold text-red-600">
                                        {finalDiscountPercent ? `-${finalDiscountPercent.toFixed(1)}%` : '-'}
                                    </p>
                                </div>
                                <div className="border-t pt-4">
                                     <p className="text-sm text-muted-foreground">Final Price</p>
                                    <p className="text-2xl font-mono font-bold text-green-600">
                                        {finalPrice ? `$${finalPrice.toFixed(2)}` : (price > 0 ? `$${price.toFixed(2)}` : '-')}
                                    </p>
                                </div>
                            </Card>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="display">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Menu Display</CardTitle>
                              <CardDescription>How the product card looks on the menu.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <FormField control={form.control} name="hiddenTitle" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Hidden Title</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                                <FormField control={form.control} name="hiddenImage" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Hidden Image</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                                <FormField control={form.control} name="cardShadow" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Card Shadow</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                                <FormField control={form.control} name="displayFullwidth" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Display Fullwidth</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                            </CardContent>
                          </Card>
                          <Card>
                             <CardHeader>
                              <CardTitle>Behavior & Visibility</CardTitle>
                              <CardDescription>Control stock and menu visibility.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <FormField control={form.control} name="hidden" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Hidden</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                                <FormField control={form.control} name="outOfStock" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Out of Stock</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                                <FormField control={form.control} name="disableLink" render={({ field }) => (<FormItem className="flex items-center justify-between rounded-lg border p-3"><div className="space-y-0.5"><FormLabel>Disable Link</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl></FormItem>)} />
                                 {form.watch('disableLink') && <FormField control={form.control} name="externalLink" render={({ field }) => (<FormItem className="p-3 border rounded-lg"><FormLabel>External Link</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormDescription>If provided, this product will link to this URL.</FormDescription><FormMessage /></FormItem>)} />}
                            </CardContent>
                          </Card>
                          <Card className="md:col-span-2">
                            <CardHeader>
                              <CardTitle>Advanced Options</CardTitle>
                              <CardDescription>
                                Special features like upselling and combos.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <FormField
                                control={form.control}
                                name="recommend"
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Recommend</FormLabel>
                                      <FormDescription>
                                        Feature this product on your menu.
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="upsell"
                                render={({ field }) => (
                                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                      <FormLabel>Enable Upsell</FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <div className="rounded-lg border">
                                <FormField
                                  control={form.control}
                                  name="enableCombo"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center justify-between p-3">
                                      <div className="space-y-0.5">
                                        <FormLabel>Enable Combo</FormLabel>
                                        <FormDescription>
                                          Group this product with others as a combo deal.
                                        </FormDescription>
                                      </div>
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            if (!checked) {
                                              form.setValue('comboGroup', '');
                                              setShowNewComboInput(false);
                                            }
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                {form.watch('enableCombo') && (
                                  <div className="p-3 pt-4 border-t">
                                    {!showNewComboInput ? (
                                      <FormField
                                        control={form.control}
                                        name="comboGroup"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Combo Group</FormLabel>
                                            <Select
                                              onValueChange={(value) => {
                                                if (value === '__CREATE_NEW__') {
                                                  setShowNewComboInput(true);
                                                  field.onChange('');
                                                } else {
                                                  field.onChange(value);
                                                }
                                              }}
                                              value={field.value}
                                            >
                                              <FormControl>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Select a combo group" />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                {mockComboGroupNames.map((group) => (
                                                  <SelectItem key={group} value={group}>
                                                    {group}
                                                  </SelectItem>
                                                ))}
                                                <SelectSeparator />
                                                <SelectItem value="__CREATE_NEW__">
                                                  <div className="flex items-center gap-2">
                                                    <PlusCircle className="h-4 w-4" />
                                                    <span>Create new combo group</span>
                                                  </div>
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <FormDescription>Select an existing group or create a new one.</FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    ) : (
                                      <FormField
                                        control={form.control}
                                        name="comboGroup"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>New Combo Group Name</FormLabel>
                                            <div className="flex items-center gap-2">
                                              <FormControl>
                                                <Input placeholder="e.g. Weekend Specials" {...field} autoFocus />
                                              </FormControl>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => {
                                                  setShowNewComboInput(false);
                                                  form.setValue('comboGroup', '');
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                            <FormDescription>Enter a unique name for your new combo group.</FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    )}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      <TabsContent value="media">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Main Image</CardTitle>
                                    <CardDescription>This is the primary image shown for the product.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="w-full aspect-video rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                                        {mainImagePreview ? (
                                            <Image src={mainImagePreview} alt="Main product" width={320} height={180} className="object-cover w-full h-full" />
                                        ) : (
                                            <ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" asChild className="w-full">
                                            <label htmlFor="main-image-upload" className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Image
                                            </label>
                                        </Button>
                                        <Input id="main-image-upload" type="file" className="sr-only" onChange={(e) => handleImageUpload(e, true)} />
                                        {mainImagePreview && (
                                            <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setMainImagePreview(null)}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Image Gallery</CardTitle>
                                        <CardDescription>Add up to 5 additional images.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {galleryPreviews.map((src, index) => (
                                                <div key={index} className="relative aspect-square group">
                                                    <Image src={src} alt={`Gallery image ${index + 1}`} fill className="object-cover rounded-md" />
                                                    <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeGalleryImage(index)}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {galleryPreviews.length < 5 && (
                                                <label htmlFor="gallery-upload" className="aspect-square flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted hover:bg-muted/80 cursor-pointer">
                                                    <GalleryHorizontal className="h-8 w-8 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                                                </label>
                                            )}
                                        </div>
                                        <Input id="gallery-upload" type="file" multiple className="sr-only" onChange={(e) => handleImageUpload(e, false)} accept="image/*" />
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Video /> Video
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="videoUrl"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>YouTube or Vimeo URL</FormLabel>
                                                <FormControl>
                                                <Input
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    {...field}
                                                />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="variations">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Variation Groups</CardTitle>
                                <CardDescription>
                                    Offer different options for this product, like size or type. Each variation can have its own price.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    {variationGroupFields.map((groupField, groupIndex) => (
                                        <Card key={groupField.id} className="bg-muted/30">
                                            <CardHeader className="flex flex-row items-center justify-between py-3">
                                                <CardTitle className="text-base">{groupField.name}</CardTitle>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeVariationGroup(groupIndex)}
                                                >
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {groupField.options.map((option, optionIndex) => (
                                                  <div key={option.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border-t pt-4">
                                                    <div className="md:col-span-1">
                                                        <Label>Option</Label>
                                                        <Input value={option.value} readOnly className="bg-background border-dashed"/>
                                                    </div>
                                                    <FormField control={form.control} name={`variationGroups.${groupIndex}.options.${optionIndex}.priceMode`}
                                                      render={({ field }) => (
                                                          <FormItem>
                                                              <FormLabel>Price Rule</FormLabel>
                                                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                                  <SelectContent>
                                                                      <SelectItem value="override">Override</SelectItem>
                                                                      <SelectItem value="add">Add</SelectItem>
                                                                      <SelectItem value="subtract">Subtract</SelectItem>
                                                                  </SelectContent>
                                                              </Select>
                                                          </FormItem>
                                                      )}
                                                    />
                                                    <FormField control={form.control} name={`variationGroups.${groupIndex}.options.${optionIndex}.priceValue`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Value (AED)</FormLabel>
                                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField control={form.control} name={`variationGroups.${groupIndex}.options.${optionIndex}.hidden`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col items-center justify-center gap-2">
                                                                <FormLabel>Hidden</FormLabel>
                                                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                  </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={availableVariationGroups.length === 0}
                                        >
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Add Variation Group
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {availableVariationGroups.map((group) => (
                                            <DropdownMenuItem
                                                key={group.id}
                                                onSelect={() => {
                                                    appendVariationGroup({
                                                        id: group.id,
                                                        name: group.name,
                                                        multiple: group.multiple,
                                                        required: group.required,
                                                        options: group.options.map(opt => ({
                                                            id: opt.id,
                                                            value: opt.value,
                                                            priceMode: 'override',
                                                            priceValue: opt.regularPrice || 0,
                                                            hidden: false,
                                                        }))
                                                    });
                                                }}
                                            >
                                                {group.name}
                                            </DropdownMenuItem>
                                        ))}
                                        {availableVariationGroups.length === 0 && <DropdownMenuItem disabled>All groups added</DropdownMenuItem>}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="nutrition">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Leaf className="h-5 w-5" /> Nutritional Facts</CardTitle>
                                <CardDescription>
                                Provide nutritional information for this product. Values are per serving.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="enableNutrition"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                        <FormLabel className="text-base">Enable Nutritional Info</FormLabel>
                                        <FormDescription>
                                            When enabled, you can add nutritional facts to this product.
                                        </FormDescription>
                                        </div>
                                        <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        </FormControl>
                                    </FormItem>
                                    )}
                                />
                                {form.watch('enableNutrition') && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                                            {nutritionFields.map((field, index) => {
                                                const nutritionItem = initialNutritionItems.find(item => item.name.toLowerCase().replace(/\s/g, '_') === field.name);
                                                return (
                                                <div key={field.id} className="flex items-end gap-2">
                                                    <FormField
                                                    control={form.control}
                                                    name={`nutrition.${index}.value`}
                                                    render={({ field: valueField }) => (
                                                        <FormItem className="flex-1">
                                                        <FormLabel>{nutritionItem?.name || field.name}</FormLabel>
                                                        <div className="relative">
                                                            <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                placeholder="0.0"
                                                                {...valueField}
                                                                value={valueField.value ?? ''}
                                                                onChange={e => valueField.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)}
                                                                className="pr-12"
                                                            />
                                                            </FormControl>
                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                            <span className="text-muted-foreground text-sm uppercase">{nutritionItem?.unit}</span>
                                                            </div>
                                                        </div>
                                                         <FormMessage />
                                                        </FormItem>
                                                    )}
                                                    />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeNutrition(index)}>
                                                        <Trash className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    
                                        {availableNutritionItems.length > 0 && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="mt-4">
                                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Fact
                                                </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {availableNutritionItems.map(item => (
                                                        <DropdownMenuItem key={item.id} onSelect={() => appendNutrition({ name: item.name.toLowerCase().replace(/\s/g, '_'), value: undefined })}>
                                                            {item.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
                <SheetFooter className="p-6 border-t bg-background flex-row justify-between w-full">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleAttemptClose}
                    >
                        Cancel
                    </Button>
                    <div className="flex items-center gap-2">
                        {product ? (
                            // Edit mode: keep original single button
                            <Tooltip delayDuration={100} open={!isValid ? undefined : false}>
                                <TooltipTrigger asChild>
                                    <div tabIndex={0}>
                                        <Button type="submit" disabled={!isValid}>
                                            Update Product
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Please complete all required fields.</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (() => {
                            const currentIndex = tabsConfig.findIndex(t => t.value === activeTab);
                            const isFirst = currentIndex === 0;
                            const isLast = currentIndex === tabsConfig.length - 1;
                            const goNext = () => setActiveTab(tabsConfig[currentIndex + 1].value);
                            const goBack = () => setActiveTab(tabsConfig[currentIndex - 1].value);

                            return (
                                <>
                                    {!isFirst && (
                                        <Button type="button" variant="outline" onClick={goBack}>
                                            Back
                                        </Button>
                                    )}
                                    {!isLast ? (
                                        <Button type="button" onClick={goNext}>
                                            Next
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={form.handleSubmit((data) => onSubmit(data, 'Draft'), onInvalid)}
                                            >
                                                Save as Draft
                                            </Button>
                                            <Tooltip delayDuration={100} open={!isValid ? undefined : false}>
                                                <TooltipTrigger asChild>
                                                    <div tabIndex={0}>
                                                        <Button type="submit" disabled={!isValid}>
                                                            Publish
                                                        </Button>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Please complete all required fields to publish.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </SheetFooter>
              </form>
            </Form>
          </TooltipProvider>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard your changes? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
