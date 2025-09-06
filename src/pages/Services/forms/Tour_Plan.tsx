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

const TourPlanStep = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();

  if (!tourData._id) {
    return (
      <div className="p-6 space-y-6">
        <Text type="heading">Error</Text>
        <p>No tour ID found. Please complete the previous steps first.</p>
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Go Back to Information
        </Button>
      </div>
    );
  }

  const { register, handleSubmit, control, setValue, getValues } = useForm({
    defaultValues: tourData.tourPlan || {
      title: "",
      itinerary: [
        {
          day: 1,
          title: "",
          description: [""],
          amenities: [""],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary",
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
        setCurrentStep(3);
      },
      onError: (error) => {
        alert(`Failed to update tour plan: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: any) => {
    // Merge the updated tourPlan with the existing tourData
    const updatedTourData = {
      ...tourData, // Spread the existing tourData to retain all fields
      tourPlan: data, // Update only the tourPlan field
    };

    updateTour(updatedTourData); // Send the full data to the API
  };

  const addDay = () => {
    append({
      day: fields.length + 1,
      title: "",
      description: [""],
      amenities: [""],
    });
  };

  const addDescription = (index: number) => {
    const currentDescriptions = getValues(
      `itinerary.${index}.description`
    ) as string[];
    setValue(`itinerary.${index}.description`, [...currentDescriptions, ""]);
  };

  const removeDescription = (dayIndex: number, descIndex: number) => {
    const currentDescriptions = getValues(
      `itinerary.${dayIndex}.description`
    ) as string[];
    const newDescriptions = currentDescriptions.filter(
      (_: string, i: number) => i !== descIndex
    );
    setValue(`itinerary.${dayIndex}.description`, newDescriptions);
  };

  const addAmenity = (index: number) => {
    const currentAmenities = getValues(
      `itinerary.${index}.amenities`
    ) as string[];
    setValue(`itinerary.${index}.amenities`, [...currentAmenities, ""]);
  };

  const removeAmenity = (dayIndex: number, amenityIndex: number) => {
    const currentAmenities = getValues(
      `itinerary.${dayIndex}.amenities`
    ) as string[];
    const newAmenities = currentAmenities.filter(
      (_: string, i: number) => i !== amenityIndex
    );
    setValue(`itinerary.${dayIndex}.amenities`, newAmenities);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Tour Plan</Text>

      <div>
        <Label>Tour Plan Title*</Label>
        <Input
          className="mt-2"
          {...register("title", { required: true })}
          placeholder="Enter tour plan title"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Text type="subTitle">Itinerary Days</Text>
          <Button type="button" variant="outline" onClick={addDay}>
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
                className="mt-2"
                {...register(`itinerary.${index}.title`, { required: true })}
                placeholder="Enter day title"
              />
            </div>

            <div className="space-y-2">
              <Label>Description Points*</Label>
              {field.description.map((_, descIndex) => (
                <div key={descIndex} className="flex items-center gap-2">
                  <Textarea
                    className="mt-1"
                    placeholder="Enter description point"
                    {...register(
                      `itinerary.${index}.description.${descIndex}`,
                      {
                        required: true,
                      }
                    )}
                  />
                  {field.description.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeDescription(index, descIndex)}
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
                onClick={() => addDescription(index)}
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
                    className="mt-1"
                    placeholder="Enter amenity"
                    {...register(
                      `itinerary.${index}.amenities.${amenityIndex}`,
                      {
                        required: true,
                      }
                    )}
                  />
                  {field.amenities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeAmenity(index, amenityIndex)}
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
                onClick={() => addAmenity(index)}
              >
                <Plus size={16} className="mr-2" />
                Add Amenity
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={() => setCurrentStep(1)}
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

export default TourPlanStep;
