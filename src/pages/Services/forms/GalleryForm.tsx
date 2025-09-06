import { useTourForm } from "@/context/TourFormContext";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, AlertCircle } from "lucide-react";
import Text from "@/components/common/text";
import usePut from "@/hooks/usePut";
import { useState, useRef } from "react";
import type { Tour } from "@/types/tour";

interface ImageFile {
  file: File;
  preview: string;
  colSpan: number;
  rowSpan: number;
}

interface GalleryFormData {
  galleryDescription: string;
  images: Array<{
    image?: string;
    colSpan: number;
    rowSpan: number;
  }>;
  removeImages: string[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per image
const MAX_TOTAL_FILES = 10; // Maximum number of gallery images

const GalleryForm = () => {
  const { tourData, setTourData, setCurrentStep } = useTourForm();
  const [uploadingImages, setUploadingImages] = useState<ImageFile[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const galleryRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, watch, setValue } =
    useForm<GalleryFormData>({
      defaultValues: {
        galleryDescription: tourData.gallery?.galleryDescription || "",
        images: tourData.gallery?.images || [],
        removeImages: [],
      },
    });

  const { fields, remove } = useFieldArray({
    control,
    name: "images",
  });

  const { mutate: updateTour, isPending } = usePut<{
    success: boolean;
    data: Tour;
  }>(
    `/services/${tourData._id}`,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    {
      onSuccess: (result: { success: boolean; data: Tour }) => {
        setTourData(result.data);
        setUploadingImages([]);
        setCurrentStep(5);
      },
      onError: (error: Error) => {
        alert(`Failed to update gallery: ${error.message}`);
        setUploadingImages([]);
      },
    }
  );

  const handleOpenUpload = () => {
    if (galleryRef.current) {
      galleryRef.current.click();
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageFile[] = [];
    let hasError = false;

    // Check total count
    const totalImages = fields.length + uploadingImages.length + files.length;
    if (totalImages > MAX_TOTAL_FILES) {
      setUploadError(`Maximum ${MAX_TOTAL_FILES} images allowed`);
      hasError = true;
    }

    Array.from(files).forEach((file) => {
      if (hasError) return;

      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        hasError = true;
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setUploadError("Each file must be less than 10MB");
        hasError = true;
        return;
      }

      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        colSpan: 1,
        rowSpan: 1,
      });
    });

    if (!hasError && newImages.length > 0) {
      setUploadingImages((prev) => [...prev, ...newImages]);
      setUploadError("");
    }

    if (galleryRef.current) {
      galleryRef.current.value = "";
    }
  };

  const removeUploadingImage = (index: number) => {
    const newImages = [...uploadingImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setUploadingImages(newImages);
  };

  const updateImageSpan = (
    index: number,
    type: "colSpan" | "rowSpan",
    value: number
  ) => {
    const updatedImages = [...uploadingImages];
    updatedImages[index][type] = value;
    setUploadingImages(updatedImages);
  };

  const removeExistingImage = (index: number) => {
    const imageToRemove = fields[index];
    remove(index);

    // Add to removeImages list
    if (imageToRemove.image) {
      const currentRemoveImages = watch("removeImages") || [];
      const updatedRemoveImages = [...currentRemoveImages, imageToRemove.image];
      setValue("removeImages", updatedRemoveImages);
    }
  };

  const onSubmit = async (data: GalleryFormData) => {
    if (uploadingImages.length === 0 && data.images.length === 0) {
      alert("Please upload at least one gallery image");
      return;
    }

    const formData = new FormData();

    // Append all non-file data first
    formData.append("galleryDescription", data.galleryDescription);

    // Create the gallery JSON structure that includes both existing and new images
    const galleryData = {
      galleryDescription: data.galleryDescription,
      images: [
        // Existing images
        ...(data.images || []),
        // New images with their metadata (will be uploaded separately)
        ...uploadingImages.map((img) => ({
          colSpan: img.colSpan,
          rowSpan: img.rowSpan,
          // The image URL will be added by the backend after upload
        })),
      ],
    };

    // Append the gallery JSON data
    formData.append("gallery", JSON.stringify(galleryData));

    // Append removeImages if any
    if (data.removeImages && data.removeImages.length > 0) {
      formData.append("removeImages", JSON.stringify(data.removeImages));
    }

    // Append new gallery images with a different field name
    uploadingImages.forEach((imageFile) => {
      formData.append("galleryFiles", imageFile.file); // Changed to "galleryFiles"
    });

    updateTour(formData);
    console.log("data", formData)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
      <Text type="heading">Gallery</Text>

      <div>
        <Label>Gallery Description*</Label>
        <Textarea
          className="mt-2"
          rows={3}
          {...register("galleryDescription", { required: true })}
          placeholder="Describe your gallery..."
        />
      </div>

      {/* Upload Section */}
      <div className="space-y-2">
        <Label>Upload Gallery Images*</Label>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <AlertCircle size={16} />
          <span>Max 10MB per image, up to {MAX_TOTAL_FILES} images total</span>
        </div>

        <input
          ref={galleryRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryChange}
          className="hidden"
        />

        <div
          onClick={handleOpenUpload}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <Upload className="mx-auto text-gray-400" size={30} />
          <p className="text-sm text-gray-600 mt-2">
            Click to upload images or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
        </div>

        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
      </div>

      {/* Uploading Images Preview */}
      {uploadingImages.length > 0 && (
        <div className="space-y-4">
          <Text type="subTitle">New Images to Upload</Text>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadingImages.map((image, index) => (
              <div key={index} className="relative border rounded-lg p-2">
                <X
                  size={16}
                  className="absolute top-1 right-1 cursor-pointer bg-white rounded-full p-1 hover:bg-gray-100"
                  onClick={() => removeUploadingImage(index)}
                />
                <img
                  src={image.preview}
                  alt={`Uploading ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="mt-2 space-y-2">
                  <div>
                    <Label className="text-xs">Column Span</Label>
                    <select
                      className="w-full p-1 border rounded text-xs"
                      value={image.colSpan}
                      onChange={(e) =>
                        updateImageSpan(
                          index,
                          "colSpan",
                          parseInt(e.target.value)
                        )
                      }
                    >
                      <option value={1}>1 column</option>
                      <option value={2}>2 columns</option>
                      <option value={3}>3 columns</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Row Span</Label>
                    <select
                      className="w-full p-1 border rounded text-xs"
                      value={image.rowSpan}
                      onChange={(e) =>
                        updateImageSpan(
                          index,
                          "rowSpan",
                          parseInt(e.target.value)
                        )
                      }
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
        </div>
      )}

      {/* Existing Images */}
      {fields.length > 0 && (
        <div className="space-y-4">
          <Text type="subTitle">Existing Gallery Images</Text>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative border rounded-lg p-2">
                <X
                  size={16}
                  className="absolute top-1 right-1 cursor-pointer bg-white rounded-full p-1 hover:bg-gray-100"
                  onClick={() => removeExistingImage(index)}
                />
                <img
                  src={field.image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="mt-2 space-y-2">
                  <div>
                    <Label className="text-xs">Column Span</Label>
                    <select
                      {...register(`images.${index}.colSpan`, {
                        valueAsNumber: true,
                      })}
                      className="w-full p-1 border rounded text-xs"
                      defaultValue={field.colSpan || 1}
                    >
                      <option value={1}>1 column</option>
                      <option value={2}>2 columns</option>
                      <option value={3}>3 columns</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Row Span</Label>
                    <select
                      {...register(`images.${index}.rowSpan`, {
                        valueAsNumber: true,
                      })}
                      className="w-full p-1 border rounded text-xs"
                      defaultValue={field.rowSpan || 1}
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
        </div>
      )}

      {/* Hidden field for removeImages */}
      <input type="hidden" {...register("removeImages")} />

      <div className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={() => setCurrentStep(3)}
          disabled={isPending}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={
            isPending || (uploadingImages.length === 0 && fields.length === 0)
          }
        >
          {isPending ? "Uploading..." : "Next"}
        </Button>
      </div>
    </form>
  );
};

export default GalleryForm;
