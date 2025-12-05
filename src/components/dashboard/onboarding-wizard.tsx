'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Zap,
  Edit,
  Clock,
  HelpCircle,
  ArrowRight,
  Building,
  Upload,
  Palette,
  GripVertical,
  Plus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import Image from 'next/image';

const steps = [
  'Welcome',
  'Business',
  'Branch',
  'Menu',
  'Design',
  'Publish',
  'QR',
];

const BusinessProfileStep = ({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) => (
  <>
    <DialogHeader className="text-left">
      <DialogTitle className="text-2xl font-bold">
        Tell us about your business
      </DialogTitle>
      <DialogDescription>
        This information will be used to create your public profile and legal
        documents.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input id="business-name" placeholder="e.g., The Gourmet Place" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business-category">Business Category</Label>
          <Select>
            <SelectTrigger id="business-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="cafe">Cafe</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="gb">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City or Area</Label>
          <Input id="city" placeholder="e.g., New York" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <Label htmlFor="logo">Business Logo (Optional)</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-24 h-24 bg-muted rounded-lg">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <Button variant="outline" asChild>
              <label htmlFor="logo-upload" className="cursor-pointer">
                Upload Logo
                <Input id="logo-upload" type="file" className="sr-only" />
              </label>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand-color">Brand Primary Color (Optional)</Label>
          <div className="flex items-center gap-2">
            <Input type="color" id="brand-color" className="w-12 h-12 p-1" defaultValue="#18B4A6" />
             <p className="text-sm text-muted-foreground">
              This will be used for buttons and highlights.
            </p>
          </div>
        </div>
      </div>
    </div>
    <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onSkip}>
          Save & Exit
        </Button>
        <Button onClick={onNext}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </DialogFooter>
  </>
);

const MenuStep = ({
  onNext,
  onBack,
  onSkip,
}: {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}) => {
  const categories = [
    { name: 'Starters', items: 5 },
    { name: 'Main Courses', items: 12 },
    { name: 'Desserts', items: 4 },
    { name: 'Drinks', items: 8 },
  ];
  const products = [
    {
      name: 'Margherita Pizza',
      price: '$12.50',
      image: 'https://picsum.photos/seed/1/100/100',
    },
    {
      name: 'Spaghetti Carbonara',
      price: '$14.00',
      image: 'https://picsum.photos/seed/2/100/100',
    },
    {
      name: 'Caesar Salad',
      price: '$9.00',
      image: 'https://picsum.photos/seed/3/100/100',
    },
    {
      name: 'Tiramisu',
      price: '$7.50',
      image: 'https://picsum.photos/seed/4/100/100',
    },
  ];

  return (
    <>
      <DialogHeader className="text-left">
        <DialogTitle className="text-2xl font-bold">
          Build Your Menu
        </DialogTitle>
        <DialogDescription>
          Add categories and items to your menu. You can drag and drop to reorder them.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 min-h-[400px]">
        {/* Categories Column */}
        <div className="md:col-span-1 bg-muted/50 rounded-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Categories</h3>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {categories.map((cat, index) => (
              <Card key={cat.name} className={`p-3 flex items-center justify-between cursor-pointer ${index === 1 ? 'bg-primary/20 border-primary' : 'bg-card'}`}>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div>
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.items} items</p>
                  </div>
                </div>
                <Badge variant="secondary">{cat.items}</Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Products Column */}
        <div className="md:col-span-2 p-4 rounded-lg border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">Main Courses</h3>
              <p className="text-sm text-muted-foreground">Add or reorder items in this category.</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
          <div className="space-y-2">
            {products.map((product) => (
              <Card key={product.name} className="p-3 flex items-center gap-4 cursor-pointer hover:bg-muted/50">
                 <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="rounded-md"
                />
                <div className="flex-grow">
                  <p className="font-medium">{product.name}</p>
                </div>
                <p className="font-semibold">{product.price}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between w-full">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="flex items-center gap-4">
          <Button variant="link" onClick={onSkip}>
            I'll do this later
          </Button>
          <Button onClick={onNext}>
            Continue to Design <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};


export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push('/dashboard');
  };

  if (!isOpen) {
    return null;
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const WelcomeStep = () => (
    <>
      <DialogHeader className="text-center">
        <DialogTitle className="text-3xl font-bold">
          Welcome to eMenu!
        </DialogTitle>
        <DialogDescription className="text-lg text-muted-foreground">
          Let&apos;s get your digital menu set up in just a few minutes.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
          <CardContent className="p-6 text-center">
            <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Connect POS (Recommended)
            </h3>
            <p className="text-muted-foreground mb-4">
              Automatically sync your menu by connecting your existing Point of
              Sale system.
            </p>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>Estimated time: 5-15 minutes</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary">
          <CardContent className="p-6 text-center">
            <Edit className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Build Menu Manually
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your categories and items from scratch using our menu
              builder.
            </p>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>Estimated time: 30-90 minutes</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between w-full">
        <Button variant="ghost" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Need Help?
        </Button>
        <div className="flex items-center gap-4">
          <Button variant="link" onClick={handleClose}>
            I&apos;ll do this later
          </Button>
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            Let&apos;s Go <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogFooter>
    </>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return (
          <BusinessProfileStep
            onNext={() => setCurrentStep(currentStep + 1)}
            onSkip={handleClose}
          />
        );
      case 3:
        return (
          <MenuStep
            onNext={() => setCurrentStep(currentStep + 1)}
            onBack={() => setCurrentStep(currentStep - 1)}
            onSkip={handleClose}
          />
        );
      default:
        return (
          <div className="text-center p-8">
            <p className="text-lg">Step {currentStep + 1} ({steps[currentStep]}) placeholder.</p>
            <div className="flex justify-center gap-4 mt-4">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </Button>
              )}
              <Button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    handleClose();
                  }
                }}
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full p-8 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Stepper */}
          <div className="w-full mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step} className="text-center w-full">
                  <div
                    className={`text-xs md:text-sm font-medium ${
                      index <= currentStep
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step}
                  </div>
                </div>
              ))}
            </div>
            <Progress value={progressPercentage} className="w-full h-2" />
            <div className="text-center text-sm text-muted-foreground mt-2">
              You&apos;re {Math.round(progressPercentage)}% done!
            </div>
          </div>

          <div className="flex-grow">{renderStep()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

    