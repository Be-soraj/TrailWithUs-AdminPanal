import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Tour } from '@/types/tour';

interface TourFormContextType {
  tourData: Partial<Tour>;
  setTourData: (data: Partial<Tour>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const TourFormContext = createContext<TourFormContextType | undefined>(undefined);

export const TourFormProvider = ({ children }: { children: ReactNode }) => {
  const [tourData, setTourData] = useState<Partial<Tour>>({});
  const [currentStep, setCurrentStep] = useState(0);
  
  const updateTourData = (data: Partial<Tour>) => {
    setTourData(prev => ({ ...prev, ...data }));
  };

  return (
    <TourFormContext.Provider value={{ 
      tourData, 
      setTourData: updateTourData,
      currentStep,
      setCurrentStep
    }}>
      {children}
    </TourFormContext.Provider>
  );
};

export const useTourForm = () => {
  const context = useContext(TourFormContext);
  if (!context) {
    throw new Error('useTourForm must be used within a TourFormProvider');
  }
  return context;
};