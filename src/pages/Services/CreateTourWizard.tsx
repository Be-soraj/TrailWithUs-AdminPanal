import TourContainer from '@/components/tour/TourContainer';
import CreateTourForm from "./forms/CreateTour";
import InformationForm from './forms/InformationForm';
import Tour_PlanForm from './forms/Tour_Plan';
import LocationForm from './forms/LocationForm';
import GalleryForm from './forms/GalleryForm';
import Review from './forms/Review';
import { useTourForm } from '@/context/TourFormContext';

const CreateTourWizard = () => {
  const { currentStep } = useTourForm();
  
  const steps = [
    <CreateTourForm key="basic" />,
    <InformationForm key="info" />,
    <Tour_PlanForm key="plan" />,
    <LocationForm key="location" />,
    <GalleryForm key="gallery" />,
    <Review key="review" />
  ];

  return (
    <TourContainer activeStep={currentStep}>
      {steps[currentStep]}
    </TourContainer>
  );
};

export default CreateTourWizard;

