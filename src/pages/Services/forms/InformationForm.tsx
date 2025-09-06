import { useTourForm } from "@/context/TourFormContext";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import Text from "@/components/common/text";
import usePut from "@/hooks/usePut";
import type { Tour } from "@/types/tour";

const InformationForm = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();

  if (!tourData._id) {
    return (
      <div className="p-6 space-y-6">
        <Text type="heading">Error</Text>
        <p>
          No tour ID found. Please complete the basic information step first.
        </p>
        <Button variant="outline" onClick={() => setCurrentStep(0)}>
          Go Back to Basic Information
        </Button>
      </div>
    );
  }

  const { register, handleSubmit, control } = useForm({
    defaultValues: tourData.information || {
      infoDescription: "",
      highlights: [{ title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "highlights",
  });

  const { mutate: updateTour, isPending } = usePut<{
    success: boolean;
    data: Tour;
  }>(
    `/services/${tourData._id}`,
    {},
    {
      onSuccess: (result) => {
        setTourData(result.data); // Use full updated data
        setCurrentStep(2);
      },
      onError: (error) => {
        alert(`Failed to update information: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: any) => {
    // Merge the updated information with the existing tourData
    const updatedTourData = {
      ...tourData, // Spread the existing tourData to retain all fields
      information: data, // Update only the information field
    };

    updateTour(updatedTourData); // Send the full data to the API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Tour Information</Text>
      <div>
        <Label>Information Description*</Label>
        <Textarea
          className="mt-2"
          rows={4}
          {...register("infoDescription", { required: true })}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text type="subTitle">Highlights</Text>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ title: "", description: "" })}
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
                className="mt-2"
                {...register(`highlights.${index}.title`, { required: true })}
              />
            </div>
            <div>
              <Label>Description*</Label>
              <Textarea
                rows={2}
                className="mt-2"
                {...register(`highlights.${index}.description`, {
                  required: true,
                })}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={() => setCurrentStep(0)}
        >
          Back
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Next"}
        </Button>
      </div>
    </form>
  );
};

export default InformationForm;
