import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import UserProfile from "@/components/UserProfile";
import TripCard from "@/components/TripCard";
import PackageCard from "@/components/PackageCard";
import { Package, Plane, Users, Map } from "lucide-react";
import { getTravelersCount, getSuccessfulDeliveriesCount, getUniqueLocationCount, formatDate } from "@/lib/utils";
import { Helmet } from 'react-helmet';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const { data: userTrips, isLoading: tripsLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/trips`],
    enabled: !!user,
  });

  const { data: userPackages, isLoading: packagesLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/packages`],
    enabled: !!user,
  });

  const { data: userDeliveries, isLoading: deliveriesLoading } = useQuery({
    queryKey: [`/api/users/me/deliveries`],
    enabled: !!user,
  });

  if (authLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | BlaBlaShip</title>
        <meta name="description" content="Manage your BlaBlaShip trips and packages." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6">
          <UserProfile user={user} isCurrentUser={true} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Plane className="h-10 w-10 text-primary p-2 bg-blue-100 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-500">My Trips</p>
                    <p className="text-2xl font-bold">{userTrips?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-10 w-10 text-red-500 p-2 bg-red-100 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-500">My Packages</p>
                    <p className="text-2xl font-bold">{userPackages?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-10 w-10 text-green-500 p-2 bg-green-100 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-500">Successful Deliveries</p>
                    <p className="text-2xl font-bold">
                      {userDeliveries ? getSuccessfulDeliveriesCount(userDeliveries) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Map className="h-10 w-10 text-purple-500 p-2 bg-purple-100 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-500">Connected Locations</p>
                    <p className="text-2xl font-bold">
                      {userTrips ? getUniqueLocationCount(userTrips) : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trips" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="packages">My Packages</TabsTrigger>
            </TabsList>
            <TabsContent value="trips" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Trips</h2>
                <Button asChild>
                  <Link href="/trips/new">Create New Trip</Link>
                </Button>
              </div>
              <Separator />
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
              ) : userTrips?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userTrips.map((trip: any) => (
                    <TripCard key={trip.id} trip={{ ...trip, user }} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any trips yet.</p>
                    <Button asChild>
                      <Link href="/trips/new">Create Your First Trip</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="packages" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Packages</h2>
                <Button asChild>
                  <Link href="/packages/new">Create New Package</Link>
                </Button>
              </div>
              <Separator />
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
              ) : userPackages?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userPackages.map((pkg: any) => (
                    <PackageCard key={pkg.id} pkg={{ ...pkg, user }} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500 mb-4">You haven't created any package requests yet.</p>
                    <Button asChild>
                      <Link href="/packages/new">Create Your First Package Request</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {userDeliveries && userDeliveries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Deliveries</h2>
              <Separator />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">Trip</th>
                      <th className="text-left py-3 px-2">Package</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-left py-3 px-2">Fee</th>
                      <th className="text-left py-3 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDeliveries.map((delivery: any) => (
                      <tr key={delivery.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">#{delivery.id}</td>
                        <td className="py-3 px-2">
                          {delivery.trip.originCity} → {delivery.trip.destinationCity}
                        </td>
                        <td className="py-3 px-2">{delivery.package.packageType}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              delivery.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : delivery.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : delivery.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-2">€{delivery.fee}</td>
                        <td className="py-3 px-2">{formatDate(delivery.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
