import { useTourForm } from '@/context/TourFormContext';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Text from '@/components/common/text';

const CreateTour = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: tourData
  });

  const onSubmit = (data: any) => {
    setTourData(data);
    setCurrentStep(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Basic Information</Text>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Tour Name*</Label>
          <Input {...register('name', { required: true })} />
          {errors.name && <p className="text-red-500 mt-1">Required</p>}
        </div>
        
        <div>
          <Label>Destination*</Label>
          <Input {...register('destination', { required: true })} />
        </div>
        
        <div>
          <Label>Price*</Label>
          <Input type="number" {...register('price', { required: true, valueAsNumber: true })} />
        </div>
        
        <div>
          <Label>Price Unit*</Label>
          <Input {...register('priceUnit', { required: true })} />
        </div>
        
        <div>
          <Label>Participants*</Label>
          <Input 
            type="number" 
            {...register('participants', { required: true, valueAsNumber: true })} 
          />
        </div>
        
        <div>
          <Label>Rating*</Label>
          <Input 
            type="number" 
            step="0.1"
            min="0"
            max="5"
            {...register('rating', { required: true, valueAsNumber: true })} 
          />
        </div>
      </div>
      
      <div>
        <Label>Description*</Label>
        <Textarea 
          rows={4} 
          {...register('description', { required: true })} 
        />
      </div>
      
      <div>
        <Label>Image URL*</Label>
        <Input {...register('image', { required: true })} />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default CreateTour;