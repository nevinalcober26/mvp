'use client';

import { useEffect } from 'react';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { NutritionItem } from './types';

const nutritionItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  unit: z.enum(['g', 'mg', 'kcal'], { required_error: 'A unit is required.' }),
  enabled: z.boolean().default(true),
});

type NutritionItemFormValues = z.infer<typeof nutritionItemSchema>;

interface NutritionItemSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: NutritionItem | null;
  onSave: (data: NutritionItem) => void;
}

export function NutritionItemSheet({ open, onOpenChange, item, onSave }: NutritionItemSheetProps) {
  const { toast } = useToast();

  const form = useForm<NutritionItemFormValues>({
    resolver: zodResolver(nutritionItemSchema),
    defaultValues: {
      name: '',
      unit: 'g',
      enabled: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (item) {
        form.reset({
          name: item.name,
          unit: item.unit,
          enabled: item.enabled,
        });
      } else {
        form.reset({
          name: '',
          unit: 'g',
          enabled: true,
        });
      }
    }
  }, [item, open, form]);

  const onSubmit = (data: NutritionItemFormValues) => {
    const finalData: NutritionItem = {
      id: item?.id || `nutri_${Date.now()}`,
      ...data,
    };

    onSave(finalData);
    toast({
      title: item ? 'Item Updated' : 'Item Created',
      description: `Nutrition item "${finalData.name}" has been saved.`,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{item ? 'Edit' : 'Add'} Nutrition Item</SheetTitle>
          <SheetDescription>
            Manage a nutrition component and its unit of measurement.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Protein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measurement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          <SelectItem value="g">Grams (g)</SelectItem>
                          <SelectItem value="mg">Milligrams (mg)</SelectItem>
                          <SelectItem value="kcal">Calories (kcal)</SelectItem>
                      </SelectContent>
                  </Select>
                  <FormDescription>How this value will be measured.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enabled</FormLabel>
                    <FormDescription>
                      If disabled, this item won't be available for products.
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

            <SheetFooter>
              <SheetClose asChild><Button type="button" variant="ghost">Cancel</Button></SheetClose>
              <Button type="submit">Save Item</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
