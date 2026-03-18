'use client';

import { useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Tag, Trash, Edit, X, Check, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialProperties = [
  'Algae', 'Celery', 'Cocoa', 'Dairy', 'Egg', 'Fish', 'Gluten', 
  'Legume', 'Milk', 'Mushroom', 'Nuts', 'Seeds', 'Shellfish', 'Soy',
  'Vegan', 'Vegetarian', 'Spicy', 'Halal'
].sort();


export default function PropertiesPage() {
  const [properties, setProperties] = useState<string[]>(initialProperties);
  const [newProperty, setNewProperty] = useState('');
  const [editingProperty, setEditingProperty] = useState<{ index: number; value: string } | null>(null);
  const { toast } = useToast();

  const handleAddProperty = () => {
    if (newProperty.trim() === '') return;
    if (properties.find(p => p.toLowerCase() === newProperty.trim().toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Property already exists',
        });
        return;
    }
    setProperties(prev => [...prev, newProperty.trim()].sort());
    setNewProperty('');
     toast({
        title: 'Property Added',
        description: `"${newProperty.trim()}" has been added to your properties list.`
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddProperty();
    }
  };
  
  const handleUpdateProperty = () => {
    if (!editingProperty) return;
    const updatedProperties = [...properties];
    const originalValue = updatedProperties[editingProperty.index];
    updatedProperties[editingProperty.index] = editingProperty.value;
    setProperties(updatedProperties.sort());
    toast({
        title: 'Property Updated',
        description: `"${originalValue}" has been changed to "${editingProperty.value}".`
    });
    setEditingProperty(null);
  };

  const handleDeleteProperty = (index: number) => {
    const propertyToDelete = properties[index];
    setProperties(prev => prev.filter((_, i) => i !== index));
    toast({
        variant: 'destructive',
        title: 'Property Deleted',
        description: `"${propertyToDelete}" has been removed.`
    });
  };

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-left">
                <h1 className="text-2xl font-bold">Product Properties</h1>
                <p className="text-muted-foreground">
                    Manage special tags for your products, like allergens or dietary needs.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        Allergens & Dietary Attributes
                    </CardTitle>
                    <CardDescription>
                        These properties can be assigned to your products to inform customers about ingredients, allergens (like "Nuts" or "Gluten"), or dietary choices (like "Vegan").
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-6">
                        <Input 
                            placeholder="Add a new property (e.g., Vegetarian)"
                            value={newProperty}
                            onChange={(e) => setNewProperty(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button onClick={handleAddProperty}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {properties.map((prop, index) => (
                           editingProperty?.index === index ? (
                             <div key={index} className="flex items-center gap-1 p-1 pl-3 rounded-full bg-primary/10 border border-primary/50">
                               <Input 
                                 value={editingProperty.value}
                                 onChange={(e) => setEditingProperty({ ...editingProperty, value: e.target.value })}
                                 onKeyDown={(e) => e.key === 'Enter' && handleUpdateProperty()}
                                 className="h-7 w-32 bg-white"
                                 autoFocus
                               />
                               <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={handleUpdateProperty}>
                                 <Check className="h-4 w-4 text-green-600" />
                               </Button>
                               <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setEditingProperty(null)}>
                                 <X className="h-4 w-4 text-red-600" />
                               </Button>
                             </div>
                           ) : (
                            <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-base py-2 px-4 font-medium group cursor-default bg-muted/50 border-muted-foreground/20 hover:bg-card transition-colors"
                            >
                                {prop}
                                <div className="ml-2 pl-2 border-l border-muted-foreground/20 hidden group-hover:flex items-center gap-1">
                                    <button onClick={() => setEditingProperty({ index, value: prop })}>
                                        <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
                                    </button>
                                    <button onClick={() => handleDeleteProperty(index)}>
                                        <Trash className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive transition-colors" />
                                    </button>
                                </div>
                            </Badge>
                           )
                        ))}
                    </div>
                </CardContent>
            </Card>

             <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="flex-row items-start gap-4">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Info className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg text-blue-900">How to Use Properties</CardTitle>
                        <CardDescription className="text-blue-800/80">
                            After creating properties here, you can assign them to your products from the "Products" page.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
      </main>
    </>
  );
}
