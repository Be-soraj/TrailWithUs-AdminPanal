import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaExclamationTriangle } from "react-icons/fa";
import { RxInfoCircled } from "react-icons/rx";
import useFetch from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export interface Booking {
  _id: string;
  serviceId: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  NumberOfTicket: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithService extends Booking {
  serviceDetails?: {
    _id: string;
    name: string;
    price: number;
  };
}
export const BookedTour = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useFetch(`/booking`, ["booking"]);
  const navigate = useNavigate();
  console.log(response);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
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
            Failed to load bookings. Please try again later.
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
          <AlertTitle>No bookings found</AlertTitle>
          <AlertDescription>
            There are currently no tour bookings. Check back later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center mx-2">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Tour Bookings <Badge variant="secondary">{response.count}</Badge>
          </h1>
          <p className="text-muted-foreground">
            View all tour bookings and customer details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {response.data.map((booking: Booking) => (
          <Card key={booking._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>Booking for: {booking.customerName}</span>
                <Badge variant="outline" className="ml-2">
                  {booking.NumberOfTicket} ticket
                  {booking.NumberOfTicket > 1 ? "s" : ""}
                </Badge>
              </CardTitle>
              <CardDescription>Service ID: {booking.serviceId}</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Customer Email</p>
                <p className="text-sm text-muted-foreground">
                  {booking.customerEmail}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Customer Phone</p>
                <p className="text-sm text-muted-foreground">
                  {booking.customerPhone}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(`/services/${booking.serviceId}`)}
              >
                View Tour Details
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/bookings/${booking._id}`)}
              >
                Manage Booking
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
