import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials, getRatingStars } from "@/lib/utils";
import { useLocation } from "wouter";
import { CheckCircle, Mail, MapPin, Star, StarHalf } from "lucide-react";
import { User } from "@shared/schema";

interface UserProfileProps {
  user: User & {
    rating: number;
    reviewCount: number;
  };
  isCurrentUser?: boolean;
}

export default function UserProfile({ user, isCurrentUser = false }: UserProfileProps) {
  const [, navigate] = useLocation();
  const { filled, half, empty } = getRatingStars(user.rating);

  return (
    <Card className="bg-white shadow-md rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24 mb-4 sm:mb-0 sm:mr-6">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback className="text-xl">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500">@{user.username}</p>
              </div>
              {user.isVerified && (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-transparent self-center sm:self-start mt-2 sm:mt-0">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Verified User
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-center sm:justify-start mb-4">
              <div className="flex items-center">
                {[...Array(filled)].map((_, i) => (
                  <Star key={`filled-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                {half ? <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : null}
                {[...Array(empty)].map((_, i) => (
                  <Star key={`empty-${i}`} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {user.rating} ({user.reviewCount} reviews)
              </span>
            </div>
            
            {user.phoneNumber && (
              <div className="flex items-center justify-center sm:justify-start text-gray-600 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user.email}</span>
              </div>
            )}
            
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              {!isCurrentUser && (
                <Button 
                  onClick={() => navigate(`/messages/${user.id}`)}
                  className="w-full sm:w-auto"
                >
                  Send Message
                </Button>
              )}
              {isCurrentUser && (
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/profile/edit")}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
