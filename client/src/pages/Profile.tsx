import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import UserProfile from "@/components/UserProfile";
import ReviewList from "@/components/ReviewList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TripCard from "@/components/TripCard";
import PackageCard from "@/components/PackageCard";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from 'react-helmet';

export default function Profile() {
  const { id } = useParams();
  const userId = parseInt(id);
  const { toast } = useToast();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  const {
    data: trips,
    isLoading: tripsLoading,
  } = useQuery({
    queryKey: [`/api/users/${userId}/trips`],
    enabled: !!userId,
  });

  const {
    data: packages,
    isLoading: packagesLoading,
  } = useQuery({
    queryKey: [`/api/users/${userId}/packages`],
    enabled: !!userId,
  });

  useEffect(() => {
    if (userError) {
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    }
  }, [userError, toast]);

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-xl"></div>
          <div className="h-12 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
            <p className="text-gray-500">The user profile you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${user.firstName} ${user.lastName}'s Profile | BlaBlaShip`}</title>
        <meta name="description" content={`View ${user.firstName} ${user.lastName}'s profile, trips, and reviews on BlaBlaShip.`} />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <UserProfile user={user} />

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="trips">Trips</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="mt-6">
              <ReviewList userId={userId} />
            </TabsContent>
            <TabsContent value="trips" className="mt-6">
              {tripsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-24 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : trips?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trips.map((trip: any) => (
                    <TripCard key={trip.id} trip={{ ...trip, user }} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">This user hasn't posted any trips yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="packages" className="mt-6">
              {packagesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-24 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : packages?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packages.map((pkg: any) => (
                    <PackageCard key={pkg.id} pkg={{ ...pkg, user }} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">This user hasn't posted any package requests yet.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
