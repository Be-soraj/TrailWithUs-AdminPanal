import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaExclamationTriangle } from "react-icons/fa";
import { RxInfoCircled } from "react-icons/rx";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Tour } from "@/types/tour";
import useFetch from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ApiResponse {
  success: boolean;
  count: number;
  data: Tour[];
  message: string;
}

export const Services = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useFetch<ApiResponse>(`/services`, ["services"]);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardHeader>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
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
            Failed to load services. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!response?.data?.length) {
    return (
      <div className="container py-8">
        <Alert>
          <RxInfoCircled className="h-4 w-4" />
          <AlertTitle>No services available</AlertTitle>
          <AlertDescription>
            There are currently no tours available. Please check back later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center mx-2 " >
        <div className="text-right space-y-2 w-[55%]">
          <h1 className="text-3xl pr-4 font-bold tracking-tight">
            Our Tours <span className="text-primary">({response.count})</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {response.message}
          </p>
        </div>
        <Button onClick={() => navigate("/services/create-tour")}>
          + Create Tour
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {response.data.map((tour) => (
          <Card
            key={tour._id}
            className="hover:shadow-md transition-shadow overflow-hidden m-0 pt-0"
          >
            <div className="relative group">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 flex items-center gap-1"
              >
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {tour.rating}
                <span className="text-muted-foreground text-xs">
                  ({tour.reviewCount})
                </span>
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-1">{tour.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {tour.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-between items-center">
              <div>
                <span className="text-lg font-semibold">${tour.price}</span>
                {tour.priceUnit && (
                  <span className="text-sm text-muted-foreground ml-1">
                    /{tour.priceUnit}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
