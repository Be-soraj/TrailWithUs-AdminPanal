import { useTourForm } from '@/context/TourFormContext';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Text from '@/components/common/text';

const LocationStep = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  const { register, handleSubmit } = useForm({
    defaultValues: tourData.location || {
      title: '',
      first_description: '',
      mapEmbed: '',
      second_description: ''
    }
  });

  const onSubmit = (data: any) => {
    setTourData({ 
      ...tourData, 
      location: data 
    });
    setCurrentStep(4);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Location Information</Text>
      
      <div>
        <Label>Location Title*</Label>
        <Input 
          {...register('title', { required: true })} 
          placeholder="Enter location title"
        />
      </div>
      
      <div>
        <Label>First Description*</Label>
        <Textarea 
          rows={3} 
          {...register('first_description', { required: true })} 
          placeholder="Describe the location..."
        />
      </div>
      
      <div>
        <Label>Map Embed URL*</Label>
        <Input 
          {...register('mapEmbed', { required: true })} 
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Use Google Maps embed URL format
        </p>
      </div>
      
      <div>
        <Label>Second Description*</Label>
        <Textarea 
          rows={3} 
          {...register('second_description', { required: true })} 
          placeholder="Additional location details..."
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default LocationStep;