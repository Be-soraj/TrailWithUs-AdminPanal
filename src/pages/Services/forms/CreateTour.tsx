import { useTourForm } from "@/context/TourFormContext";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Text from "@/components/common/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tour } from "@/types/tour";

const priceUnits = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CAD", label: "Canadian Dollar ($)" },
  { value: "AUD", label: "Australian Dollar ($)" },
];

const participantTypes = [
  { value: "person", label: "Per Person" },
  { value: "group", label: "Per Group" },
  { value: "couple", label: "Per Couple" },
];

const CreateTour = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Partial<Tour>>({
    defaultValues: {
      ...tourData,
      priceUnit: tourData?.priceUnit || "USD",
      participantType: tourData?.participantType || "person",
      participants: tourData?.participants || 1,
      rating: tourData?.rating || 0,
      reviewCount: tourData?.reviewCount || 0,
      date: tourData?.date || new Date().toISOString(),
    },
    mode: "onBlur",
  });

  const onSubmit = (data: Partial<Tour>) => {
    setTourData(data);
    setCurrentStep(1);
  };

  const descriptionValue = watch("description") || "";
  const priceUnitValue = watch("priceUnit") || "USD";
  const participantTypeValue = watch("participantType") || "person";

  return (
    <Card className="mx-auto rounded-none">
      <CardHeader>
        <Text type="heading" className="text-2xl font-bold">
          Create New Tour
        </Text>
        <Badge variant="outline" className="mt-2">
          Step 1: Basic Information
        </Badge>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Tour Name*</Label>
              <Input
                placeholder="Amazing Bali Adventure"
                {...register("name", {
                  required: "Tour name is required",
                  minLength: {
                    value: 3,
                    message: "Tour name must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Tour name must be less than 100 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Destination*</Label>
              <Input
                placeholder="Bali, Indonesia"
                {...register("destination", {
                  required: "Destination is required",
                  minLength: {
                    value: 3,
                    message: "Destination must be at least 3 characters",
                  },
                })}
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.destination.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Price*</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="299"
                  className="flex-1"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be positive",
                    },
                    valueAsNumber: true,
                  })}
                />

                {/* Currency Select */}
                <Select
                  value={priceUnitValue}
                  onValueChange={(value: string) =>
                    setValue("priceUnit", value)
                  }
                >
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Participant Type Select */}
                <Select
                  value={participantTypeValue}
                  onValueChange={(value: string) =>
                    setValue("participantType", value)
                  }
                >
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Per" />
                  </SelectTrigger>
                  <SelectContent>
                    {participantTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Participants*</Label>
              <Input
                type="number"
                placeholder="10"
                {...register("participants", {
                  required: "Participants number is required",
                  min: {
                    value: 1,
                    message: "Minimum 1 participant required",
                  },
                  max: {
                    value: 100,
                    message: "Maximum 100 participants allowed",
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.participants && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.participants.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Rating*</Label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  {...register("rating", {
                    required: "Rating is required",
                    min: {
                      value: 0,
                      message: "Rating must be at least 0",
                    },
                    max: {
                      value: 5,
                      message: "Rating cannot exceed 5",
                    },
                    valueAsNumber: true,
                  })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  /5
                </div>
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input type="date" {...register("departure_date")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description*</Label>
            <Textarea
              rows={4}
              placeholder="Describe your tour in detail..."
              className="min-h-[120px]"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description should be at least 20 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Description should be less than 1000 characters",
                },
              })}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Minimum 20 characters</span>
              <span>{descriptionValue.length}/1000</span>
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <Label>Image URL*</Label>
              <Input
                placeholder="Paste image URL or upload from Unsplash/Cloudinary"
                className="mt-2"
                {...register("image", {
                  required: "Image URL is required",
                  validate: {
                    validUrl: (value) =>
                      /^(https?:\/\/).+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(
                        value || ""
                      ) ||
                      /unsplash\.com|res\.cloudinary\.com/i.test(value || "") ||
                      "Please enter a valid image URL",
                  },
                })}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" type="button" size="lg">
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={Object.keys(errors).length > 0}
            >
              Next: Tour Details
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTour;
