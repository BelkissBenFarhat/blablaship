import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getInitials, calculateTimeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewListProps {
  userId: number;
}

export default function ReviewList({ userId }: ReviewListProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/reviews`],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No reviews yet.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review: any) => (
          <Card key={review.id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={review.reviewer?.profileImage}
                    alt={review.reviewer?.username}
                  />
                  <AvatarFallback>
                    {getInitials(
                      review.reviewer?.firstName || "",
                      review.reviewer?.lastName || ""
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h4 className="font-medium">
                        {review.reviewer?.firstName} {review.reviewer?.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {calculateTimeAgo(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex mt-1 sm:mt-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
