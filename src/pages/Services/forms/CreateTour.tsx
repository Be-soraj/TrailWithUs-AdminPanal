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
import { Upload, X, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import type { Tour } from "@/types/tour";
import usePost from "@/hooks/usePost";

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

interface ImageFile {
  file: File;
  preview: string;
}

interface ApiError extends Error {
  code?: string;
  response?: {
    status: number;
    data: any;
  };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for single image

const CreateTour = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const imageRef = useRef<HTMLInputElement>(null);

  const { mutate: createTour, isPending } = usePost<
    { success: boolean; data: Tour },
    FormData
  >(
    "/services",
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      },
    },
    {
      onSuccess: (result) => {
        setTourData(result.data); // Use full API response data
        setUploadProgress(0);
        setCurrentStep(1);
      },
      onError: (error: unknown) => {
        console.error("Failed to create service:", error);
        setUploadProgress(0);
        const apiError = error as ApiError;
        let message = apiError.message || "Please try again.";
        if (apiError.code === "ECONNABORTED") {
          message = "Request timed out. Please try with a smaller image.";
        } else if (apiError.response?.status === 413) {
          message = "File too large. Max 10MB.";
        } else if (apiError.response?.data?.message) {
          message = apiError.response.data.message;
        }
        alert(`Failed to create service: ${message}`);
      },
    }
  );

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

  const descriptionValue = watch("description") || "";

  const handleOpenUpload = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError("File size must be less than 10MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setImageFile({ file, preview });
    setImageError("");

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  const removeImage = () => {
    if (imageFile) {
      URL.revokeObjectURL(imageFile.preview);
    }
    setImageFile(null);
    setImageError("");
  };

  const onSubmit = async (data: Partial<Tour>) => {
    if (!imageFile) {
      alert("Please upload a main image");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    formData.append("image", imageFile.file);

    createTour(formData);
  };

  return (
    <Card>
      <CardHeader>
        <Text type="heading">Create Tour</Text>
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
              <div className="relative">
                <Input
                  type="number"
                  placeholder="500"
                  {...register("price", {
                    required: "Price is required",
                    min: {
                      value: 0,
                      message: "Price must be non-negative",
                    },
                    valueAsNumber: true,
                  })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Select
                    onValueChange={(value) => setValue("priceUnit", value)}
                    defaultValue={watch("priceUnit") || "USD"}
                  >
                    <SelectTrigger className="h-6 w-24 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Participant Type*</Label>
              <Select
                onValueChange={(value) => setValue("participantType", value)}
                defaultValue={watch("participantType") || "person"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {participantTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.participantType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.participantType.message}
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
            <Label htmlFor="uploadPic" className="text-black">
              Upload Main Image*
            </Label>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <AlertCircle size={16} />
              <span>Max 10MB, one image only</span>
            </div>
            {imageFile ? (
              <div className="relative border rounded-md p-2 w-48">
                <X
                  onClick={removeImage}
                  size={20}
                  className="absolute top-1 right-1 cursor-pointer bg-white rounded-full p-1 hover:bg-gray-100"
                />
                <img
                  src={imageFile.preview}
                  className="w-full h-32 object-cover rounded"
                  alt="Main preview"
                />
                {imageError && (
                  <p className="text-xs text-red-500 mt-1">{imageError}</p>
                )}
              </div>
            ) : (
              <div
                onClick={handleOpenUpload}
                className={`border-2 ${
                  imageError ? "border-red-300" : "border-gray-200"
                } rounded-sm min-h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors`}
              >
                <Input
                  onChange={handleImageChange}
                  ref={imageRef}
                  className="hidden"
                  type="file"
                  accept="image/*"
                />
                <Upload className="text-gray-400" size={30} />
                <span className="text-xs md:text-sm text-gray-400">
                  Upload Main Image
                </span>
                {imageError && (
                  <p className="text-xs text-red-500 mt-1">{imageError}</p>
                )}
              </div>
            )}
          </div>

          {isPending && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" type="button" size="lg">
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={
                Object.keys(errors).length > 0 ||
                !!imageError ||
                isPending ||
                !imageFile
              }
            >
              {isPending ? "Creating..." : "Next: Tour Details"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTour;
