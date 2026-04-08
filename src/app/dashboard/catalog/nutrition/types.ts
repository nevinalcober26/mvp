export interface NutritionItem {
  id: string;
  name: string;
  unit: 'g' | 'mg' | 'kcal';
  enabled: boolean;
}
