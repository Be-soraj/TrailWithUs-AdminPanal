import { useTourForm } from '@/context/TourFormContext';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from 'lucide-react';
import Text from '@/components/common/text';

const GalleryStep = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: tourData.gallery || {
      galleryDescription: '',
      images: [{ image: '', colSpan: 1, rowSpan: 1 }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images'
  });

  const onSubmit = (data: any) => {
    setTourData({ 
      ...tourData, 
      gallery: data 
    });
    setCurrentStep(5);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Gallery</Text>
      
      <div>
        <Label>Gallery Description*</Label>
        <Textarea 
          rows={3} 
          {...register('galleryDescription', { required: true })} 
          placeholder="Describe your gallery..."
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text type="subTitle">Gallery Images</Text>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => append({ image: '', colSpan: 1, rowSpan: 1 })}
          >
            <Plus size={16} className="mr-2" /> Add Image
          </Button>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between">
              <Text type="subTitle">Image {index + 1}</Text>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => remove(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
            
            <div>
              <Label>Image URL*</Label>
              <div className="flex items-center gap-2">
                <Input 
                  {...register(`images.${index}.image`, { required: true })} 
                  placeholder="https://example.com/image.jpg"
                />
                {watch(`images.${index}.image`) && (
                  <div className="w-16 h-16 rounded-md overflow-hidden border">
                    <img 
                      src={watch(`images.${index}.image`)} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Column Span</Label>
                <select
                  {...register(`images.${index}.colSpan`, { valueAsNumber: true })}
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>1 column</option>
                  <option value={2}>2 columns</option>
                  <option value={3}>3 columns</option>
                </select>
              </div>
              
              <div>
                <Label>Row Span</Label>
                <select
                  {...register(`images.${index}.rowSpan`, { valueAsNumber: true })}
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>1 row</option>
                  <option value={2}>2 rows</option>
                  <option value={3}>3 rows</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => setCurrentStep(3)}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};

export default GalleryStep;