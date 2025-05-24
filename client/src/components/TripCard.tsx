import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency, getInitials, getRatingStars } from "@/lib/utils";
import { Plane, Calendar, Briefcase, Star, StarHalf, CheckCircle } from "lucide-react";

interface TripCardProps {
  trip: {
    id: number;
    originCity: string;
    originCountry: string;
    destinationCity: string;
    destinationCountry: string;
    departureDate: string;
    availableWeight: string | number;
    baseFee: string | number;
    user: {
      id: number;
      username: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
      isVerified: boolean;
      rating: number;
      reviewCount: number;
    };
  };
  onContactClick?: (tripId: number, userId: number) => void;
}

export default function TripCard({ trip, onContactClick }: TripCardProps) {
  const { filled, half, empty } = getRatingStars(trip.user.rating);

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={trip.user.profileImage} alt={trip.user.username} />
            <AvatarFallback>{getInitials(trip.user.firstName, trip.user.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {trip.user.firstName} {trip.user.lastName.charAt(0)}.
            </h3>
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(filled)].map((_, i) => (
                  <Star key={`filled-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                {half ? <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : null}
                {[...Array(empty)].map((_, i) => (
                  <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-500 text-sm ml-1">
                {trip.user.rating} ({trip.user.reviewCount})
              </span>
            </div>
          </div>
          <div className="ml-auto">
            {trip.user.isVerified && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-transparent">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <Plane className="mr-2 h-4 w-4" />
          <span>{trip.originCity}, {trip.originCountry}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mx-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <span>{trip.destinationCity}, {trip.destinationCountry}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formatDate(trip.departureDate)}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-4">
          <Briefcase className="mr-2 h-4 w-4" />
          <span>{trip.availableWeight}kg available space</span>
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Starting fee</span>
            <p className="text-lg font-semibold">{formatCurrency(trip.baseFee)}</p>
          </div>
          {onContactClick ? (
            <Button
              onClick={() => onContactClick(trip.id, trip.user.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact
            </Button>
          ) : (
            <Link href={`/messages/${trip.user.id}`}>
              <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Contact
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
