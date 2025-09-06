import { useTourForm } from "@/context/TourFormContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Text from "@/components/common/text";
import usePut from "@/hooks/usePut";
import type { Tour } from "@/types/tour";

const LocationStep = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();

  if (!tourData._id) {
    return (
      <div className="p-6 space-y-6">
        <Text type="heading">Error</Text>
        <p>No tour ID found. Please complete the previous steps first.</p>
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Go Back to Tour Plan
        </Button>
      </div>
    );
  }

  const { register, handleSubmit } = useForm({
    defaultValues: tourData.location || {
      title: "",
      first_description: "",
      mapEmbed: "",
      second_description: "",
    },
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
        setCurrentStep(4);
      },
      onError: (error) => {
        alert(`Failed to update location: ${error.message}`);
      },
    }
  );

  const onSubmit = (data: any) => {
    // Merge the updated location with the existing tourData
    const updatedTourData = {
      ...tourData, // Spread the existing tourData to retain all fields
      location: data, // Update only the location field
    };

    updateTour(updatedTourData); // Send the full data to the API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Location Information</Text>

      <div>
        <Label>Location Title*</Label>
        <Input
          className="mt-2"
          {...register("title", { required: true })}
          placeholder="Enter location title"
        />
      </div>

      <div>
        <Label>First Description*</Label>
        <Textarea
          className="mt-2"
          rows={3}
          {...register("first_description", { required: true })}
          placeholder="Describe the location..."
        />
      </div>

      <div>
        <Label>Map Embed URL*</Label>
        <Input
          className="mt-2"
          {...register("mapEmbed", { required: true })}
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Use Google Maps embed URL format
        </p>
      </div>

      <div>
        <Label>Second Description*</Label>
        <Textarea
          className="mt-2"
          rows={3}
          {...register("second_description", { required: true })}
          placeholder="Additional location details..."
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={() => setCurrentStep(2)}
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

export default LocationStep;
