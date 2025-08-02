import { useTourForm } from '@/context/TourFormContext';
import { Button } from "@/components/ui/button";
import Text from '@/components/common/text';
import { useNavigate } from 'react-router-dom';
import usePost from '@/hooks/usePost';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Review = () => {
  const { tourData, setCurrentStep } = useTourForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createTourMutation = usePost('/api/services');
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const completeTour = {
        ...tourData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Submit using the mutation function
      const response = await createTourMutation.mutateAsync(completeTour);
      
      if (response && response.success) {
        toast.success('Tour created successfully!');
        navigate('/services');
      } else {
        throw new Error(response?.message || 'Failed to create tour');
      }
    } catch (error: any) {
      console.error('Tour creation error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create tour. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Text type="heading">Review Your Tour</Text>
      
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="border rounded-lg p-4">
          <Text type="subTitle" className="mb-3">Basic Information</Text>
          <p><strong>Name:</strong> {tourData.name}</p>
          <p><strong>Destination:</strong> {tourData.destination}</p>
          <p><strong>Price:</strong> {tourData.price} {tourData.priceUnit}</p>
          <p><strong>Participants:</strong> {tourData.participants}</p>
          <p><strong>Description:</strong> {tourData.description}</p>
        </div>
        
        {/* Information Section */}
        {tourData.information && (
          <div className="border rounded-lg p-4">
            <Text type="subTitle" className="mb-3">Information</Text>
            <p><strong>Description:</strong> {tourData.information.infoDescription}</p>
            <div className="mt-2">
              <strong>Highlights:</strong>
              <ul className="list-disc pl-5 mt-1">
                {tourData.information.highlights?.map((h, i) => (
                  <li key={i} className="mb-2">
                    <strong>{h.title}:</strong> {h.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Tour Plan */}
        {tourData.tourPlan && (
          <div className="border rounded-lg p-4">
            <Text type="subTitle" className="mb-3">Tour Plan</Text>
            <p><strong>Title:</strong> {tourData.tourPlan.title}</p>
            <div className="mt-3">
              <strong>Itinerary:</strong>
              {tourData.tourPlan.itinerary?.map((day, index) => (
                <div key={index} className="mt-3 p-3 border rounded">
                  <Text type="heading">Day {day.day}: {day.title}</Text>
                  <div className="mt-2">
                    <strong>Description:</strong>
                    <ul className="list-disc pl-5">
                      {day.description?.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <strong>Amenities:</strong>
                    <ul className="list-disc pl-5">
                      {day.amenities?.map((amenity, i) => (
                        <li key={i}>{amenity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Location */}
        {tourData.location && (
          <div className="border rounded-lg p-4">
            <Text type="subTitle" className="mb-3">Location</Text>
            <p><strong>Title:</strong> {tourData.location.title}</p>
            <p><strong>First Description:</strong> {tourData.location.first_description}</p>
            <p><strong>Map Embed:</strong> 
              <a href={tourData.location.mapEmbed} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-2">
                View Map
              </a>
            </p>
            <p><strong>Second Description:</strong> {tourData.location.second_description}</p>
          </div>
        )}
        
        {/* Gallery */}
        {tourData.gallery && (
          <div className="border rounded-lg p-4">
            <Text type="subTitle" className="mb-3">Gallery</Text>
            <p><strong>Description:</strong> {tourData.gallery.galleryDescription}</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {tourData.gallery.images?.map((img, index) => (
                <div key={index} className="border rounded p-2">
                  <img 
                    src={img.image} 
                    alt={`Gallery ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                  <p className="text-xs mt-1">
                    Grid: {img.colSpan || 1}×{img.rowSpan || 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(4)}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Tour...' : 'Create Tour'}
        </Button>
      </div>
    </div>
  );
};

export default Review;