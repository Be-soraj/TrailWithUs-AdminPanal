import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaExclamationTriangle } from "react-icons/fa";
import { RxInfoCircled } from "react-icons/rx";
import { Skeleton } from "@/components/ui/skeleton";
import { type Tour } from "@/types/tour";

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: response,
    isLoading,
    error,
  } = useFetch<{ success: boolean; data: Tour }>(`/services/${id}`, [
    `service-${id}`,
  ]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <Skeleton className="h-64 w-full rounded-t-lg" />
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <FaExclamationTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load service details. Please try again later.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!response?.data) {
    return (
      <div className="container py-8">
        <Alert>
          <RxInfoCircled className="h-4 w-4" />
          <AlertTitle>Service not found</AlertTitle>
          <AlertDescription>
            The requested service could not be found.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate("/services")}>
          Browse All Services
        </Button>
      </div>
    );
  }

  const tour = response.data;

  return (
    <div className="container py-8">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        &larr; Back to Services
      </Button>

      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={tour.image || "/placeholder-image.jpg"}
            alt={tour.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.jpg";
            }}
          />
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 flex items-center gap-1"
          >
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            {tour.rating || 0}
            <span className="text-muted-foreground text-xs">
              ({tour.reviewCount || 0})
            </span>
          </Badge>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl">{tour.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{tour.destination}</Badge>
            <Badge variant="outline">
              {tour.participants} {tour.participantType || "person"}
            </Badge>
            {tour.departure_date && (
              <Badge variant="outline">
                Departure: {new Date(tour.departure_date).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{tour.description}</p>

          <div className="flex items-center">
            <span className="text-xl font-semibold">${tour.price}</span>
            {tour.priceUnit && (
              <span className="text-sm text-muted-foreground ml-1">
                /{tour.priceUnit}
              </span>
            )}
          </div>

          {tour.information?.highlights?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tour Highlights</h3>
              <ul className="space-y-2">
                {tour.information.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <div>
                      <p className="font-medium">{highlight.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {highlight.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tour.tourPlan?.itinerary?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Itinerary</h3>
              <div className="space-y-6">
                {tour.tourPlan.itinerary.map((day) => (
                  <div key={day.day} className="border rounded-lg p-4">
                    <h4 className="font-medium">
                      Day {day.day}: {day.title}
                    </h4>
                    <div className="mt-2 space-y-2">
                      {day.description?.map((paragraph, i) => (
                        <p key={i} className="text-muted-foreground text-sm">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {day.amenities?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Amenities:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {day.amenities.map((amenity, i) => (
                            <Badge key={i} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tour.location && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              {tour.location.first_description && (
                <p className="text-muted-foreground">
                  {tour.location.first_description}
                </p>
              )}
              {tour.location.mapEmbed && (
                <div className="aspect-video w-full">
                  <iframe
                    src={tour.location.mapEmbed}
                    className="w-full h-full rounded-lg"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              )}
              {tour.location.second_description && (
                <p className="text-muted-foreground">
                  {tour.location.second_description}
                </p>
              )}
            </div>
          )}

          {tour.gallery?.images?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gallery</h3>
              {tour.gallery.galleryDescription && (
                <p className="text-muted-foreground">
                  {tour.gallery.galleryDescription}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tour.gallery.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img
                      src={image.image || "/placeholder-image.jpg"}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/services")}>
            View All Tours
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceDetails;
