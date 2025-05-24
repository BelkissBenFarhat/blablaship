import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency, getInitials, getRatingStars } from "@/lib/utils";
import { MapPin, Calendar, Package, Star, StarHalf, CheckCircle } from "lucide-react";

interface PackageCardProps {
  pkg: {
    id: number;
    originCity: string;
    originCountry: string;
    destinationCity: string;
    destinationCountry: string;
    packageType: string;
    weight: string | number;
    neededBy: string;
    description: string;
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
  onContactClick?: (packageId: number, userId: number) => void;
}

export default function PackageCard({ pkg, onContactClick }: PackageCardProps) {
  const { filled, half, empty } = getRatingStars(pkg.user.rating);

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={pkg.user.profileImage} alt={pkg.user.username} />
            <AvatarFallback>{getInitials(pkg.user.firstName, pkg.user.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {pkg.user.firstName} {pkg.user.lastName.charAt(0)}.
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
                {pkg.user.rating} ({pkg.user.reviewCount})
              </span>
            </div>
          </div>
          <div className="ml-auto">
            {pkg.user.isVerified && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-transparent">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{pkg.originCity}, {pkg.originCountry}</span>
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
          <span>{pkg.destinationCity}, {pkg.destinationCountry}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Needed by {formatDate(pkg.neededBy)}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-2">
          <Package className="mr-2 h-4 w-4" />
          <span>{pkg.packageType} - {pkg.weight}kg</span>
        </div>

        <div className="text-gray-500 mb-4 text-sm">
          <p className="line-clamp-2">{pkg.description}</p>
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-end">
          {onContactClick ? (
            <Button
              onClick={() => onContactClick(pkg.id, pkg.user.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Contact Sender
            </Button>
          ) : (
            <Link href={`/messages/${pkg.user.id}`}>
              <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Contact Sender
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
