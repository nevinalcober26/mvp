'use client';

import { useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
import type { NutritionItem } from './types';
import { NutritionItemSheet } from './nutrition-item-sheet';

const initialNutritionItems: NutritionItem[] = [
  { id: '2', name: 'Protein', unit: 'g', enabled: true },
  { id: '3', name: 'Fat', unit: 'g', enabled: true },
  { id: '4', name: 'Carbohydrates', unit: 'g', enabled: true },
  { id: '5', name: 'Sugar', unit: 'g', enabled: false },
  { id: '6', name: 'Sodium', unit: 'mg', enabled: true },
  { id: '7', name: 'Fiber', unit: 'g', enabled: false },
];

export default function NutritionPage() {
  const [kcalCalculationEnabled, setKcalCalculationEnabled] = useState(false);
  const [nutritionItems, setNutritionItems] = useState<NutritionItem[]>(initialNutritionItems);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NutritionItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NutritionItem | null>(null);
  const { toast } = useToast();

  const handleAddItem = () => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  const handleEditItem = (item: NutritionItem) => {
    setEditingItem(item);
    setIsSheetOpen(true);
  };
  
  const handleSaveItem = (data: NutritionItem) => {
    setNutritionItems(prev => {
        const index = prev.findIndex(item => item.id === data.id);
        if (index > -1) {
            const newItems = [...prev];
            newItems[index] = data;
            return newItems;
        }
        return [data, ...prev].sort((a,b) => a.name.localeCompare(b.name));
    });
  };

  const handleDeleteItem = () => {
    if (!deleteTarget) return;
    setNutritionItems(items => items.filter(i => i.id !== deleteTarget.id));
    toast({
      variant: 'destructive',
      title: 'Item Deleted',
      description: `The "${deleteTarget.name}" nutrition item has been removed.`,
    });
    setDeleteTarget(null);
  };

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Nutrition Configuration</h1>
            <p className="text-muted-foreground">
              Define which nutritional components are tracked for your products.
            </p>
          </div>
          <Button onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Nutrition Item
          </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Global Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="kcal-toggle" className="text-base font-medium">Enable kcal Calculation</Label>
                        <p className="text-sm text-muted-foreground">
                            If enabled, the system will attempt to calculate total calories on the front-end menu.
                        </p>
                    </div>
                    <Switch
                        id="kcal-toggle"
                        checked={kcalCalculationEnabled}
                        onCheckedChange={setKcalCalculationEnabled}
                    />
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrition Components</CardTitle>
            <CardDescription>
              The list of all available nutritional data points you can assign to products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nutritionItems.length > 0 ? (
                  nutritionItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground uppercase">{item.unit}</TableCell>
                      <TableCell>
                        <Badge variant={item.enabled ? 'default' : 'outline'} className={item.enabled ? 'bg-green-100 text-green-700' : ''}>
                          {item.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(item)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No nutrition items defined. Add one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <NutritionItemSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        item={editingItem}
        onSave={handleSaveItem}
      />
      
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the <strong>{deleteTarget?.name}</strong> nutrition item.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
