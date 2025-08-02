import { useTourForm } from '@/context/TourFormContext';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from 'lucide-react';
import Text from '@/components/common/text';

const InformationForm = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  const { register, handleSubmit, control } = useForm({
    defaultValues: tourData.information || {
      infoDescription: '',
      highlights: [{ title: '', description: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights'
  });

  const onSubmit = (data: any) => {
    setTourData({ 
      ...tourData, 
      information: data 
    });
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Tour Information</Text>
      
      <div>
        <Label>Information Description*</Label>
        <Textarea 
          rows={4} 
          {...register('infoDescription', { required: true })} 
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text type="heading">Highlights</Text>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => append({ title: '', description: '' })}
          >
            <Plus size={16} className="mr-2" /> Add Highlight
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between">
              <Text type="subTitle">Highlight {index + 1}</Text>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => remove(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div>
              <Label>Title*</Label>
              <Input 
                {...register(`highlights.${index}.title`, { required: true })} 
              />
            </div>
            
            <div>
              <Label>Description*</Label>
              <Textarea 
                rows={2} 
                {...register(`highlights.${index}.description`, { required: true })} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default InformationForm;