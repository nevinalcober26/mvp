
export type VariationOptionOverride = {
  id: string; // from VariationOption
  value: string;
  priceMode: 'override' | 'add' | 'subtract';
  priceValue: number;
  hidden: boolean;
};

export type ProductVariationGroup = {
  id: string; // from VariationGroup
  name: string;
  multiple: boolean;
  required: boolean;
  options: VariationOptionOverride[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  properties?: string;
  branch: string;
  price: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived' | 'Out of Stock';
  smallDescription: string;
  description: string;
  discountedPrice?: number;
  recommend?: boolean;
  displayFullwidth?: boolean;
  hiddenTitle?: boolean;
  hiddenImage?: boolean;
  disableLink?: boolean;
  externalLink?: string;
  cardShadow?: boolean;
  hidden?: boolean;
  outOfStock?: boolean;
  upsell?: boolean;
  enableCombo?: boolean;
  comboGroup?: string;
  mainImage?: string;
  additionalImages?: string[];
  videoUrl?: string;
  variationGroups?: ProductVariationGroup[];
  nutrition?: Record<string, number>;
};

// This is the old variation type, kept for reference but should be deprecated.
export type Variation = {
  id: string;
  value: string;
  matrix?: string;
  priceMode: 'override' | 'add' | 'subtract';
  priceValue: number;
  hidden: boolean;
  categoryPage: boolean;
  productPage: boolean;
};
