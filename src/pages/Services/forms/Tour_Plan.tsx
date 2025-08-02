import { useTourForm } from '@/context/TourFormContext';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from 'lucide-react';
import Text from '@/components/common/text';

const TourPlanStep = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  
  const { 
    register, 
    handleSubmit, 
    control,
    setValue, 
  } = useForm({
    defaultValues: tourData.tourPlan || {
      title: '',
      itinerary: [{
        day: 1,
        title: '',
        description: [''],
        amenities: ['']
      }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary'
  });

  const onSubmit = (data: any) => {
    setTourData({ 
      ...tourData, 
      tourPlan: data 
    });
    setCurrentStep(3);
  };

  const addDay = () => {
    append({
      day: fields.length + 1,
      title: '',
      description: [''],
      amenities: ['']
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Tour Plan</Text>
      
      <div>
        <Label>Tour Plan Title*</Label>
        <Input 
          {...register('title', { required: true })} 
          placeholder="Enter tour plan title"
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text type="subTitle">Itinerary Days</Text>
          <Button 
            type="button" 
            variant="outline"
            onClick={addDay}
          >
            <Plus size={16} className="mr-2" /> Add Day
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between">
              <Text type="subTitle">Day {field.day}</Text>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => remove(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div>
              <Label>Day Title*</Label>
              <Input 
                {...register(`itinerary.${index}.title`, { required: true })} 
                placeholder="Enter day title"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description Points*</Label>
              {field.description.map((_, descIndex) => (
                <div key={descIndex} className="flex items-center gap-2">
                  <Textarea
                    placeholder="Enter description point"
                    {...register(`itinerary.${index}.description.${descIndex}`, { 
                      required: true 
                    })}
                  />
                  {field.description.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => {
                        const newDesc = [...field.description];
                        newDesc.splice(descIndex, 1);
                        // FIXED: Use setValue directly
                        setValue(`itinerary.${index}.description`, newDesc);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDesc = [...field.description, ''];
                  // FIXED: Use setValue directly
                  setValue(`itinerary.${index}.description`, newDesc);
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Description Point
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Amenities*</Label>
              {field.amenities.map((_, amenityIndex) => (
                <div key={amenityIndex} className="flex items-center gap-2">
                  <Input
                    placeholder="Enter amenity"
                    {...register(`itinerary.${index}.amenities.${amenityIndex}`, { 
                      required: true 
                    })}
                  />
                  {field.amenities.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => {
                        const newAmenities = [...field.amenities];
                        newAmenities.splice(amenityIndex, 1);
                        // FIXED: Use setValue directly
                        setValue(`itinerary.${index}.amenities`, newAmenities);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newAmenities = [...field.amenities, ''];
                  // FIXED: Use setValue directly
                  setValue(`itinerary.${index}.amenities`, newAmenities);
                }}
              >
                <Plus size={16} className="mr-2" />
                Add Amenity
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => setCurrentStep(1)}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default TourPlanStep;