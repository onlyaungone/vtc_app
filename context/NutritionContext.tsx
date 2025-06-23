import React, { createContext, useContext, useState } from 'react';

type NutritionItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: any;
  imageName: string;
};

type NutritionContextType = {
  nutritionData: NutritionItem[];
  addNutritionItem: (item: NutritionItem) => void;
  updateNutritionItem: (item: NutritionItem) => void;
};

const NutritionContext = createContext<NutritionContextType | null>(null);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nutritionData, setNutritionData] = useState<NutritionItem[]>([]);

  const addNutritionItem = (item: NutritionItem) => {
    setNutritionData(prev => [...prev, item]);
  };

  const updateNutritionItem = (item: NutritionItem) => {
    setNutritionData(prev =>
      prev.map(i => (i.id === item.id ? { ...i, ...item } : i))
    );
  };

  return (
    <NutritionContext.Provider value={{ nutritionData, addNutritionItem, updateNutritionItem }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
