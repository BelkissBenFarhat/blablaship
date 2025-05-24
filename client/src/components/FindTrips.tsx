import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TripSearch from "@/components/TripSearch";
import TripCard from "@/components/TripCard";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function FindTrips() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    originCountry: "",
    destinationCountry: "",
    departureDate: "",
  });

  const { data: trips, isLoading } = useQuery({
    queryKey: ["/api/trips"],
    enabled: true,
  });

  const filteredTrips = trips?.filter((trip: any) => {
    if (filters.originCountry && trip.originCountry !== filters.originCountry) {
      return false;
    }
    if (filters.destinationCountry && trip.destinationCountry !== filters.destinationCountry) {
      return false;
    }
    if (filters.departureDate) {
      const filterDate = new Date(filters.departureDate).setHours(0, 0, 0, 0);
      const tripDate = new Date(trip.departureDate).setHours(0, 0, 0, 0);
      if (filterDate !== tripDate) {
        return false;
      }
    }
    return true;
  });

  const handleSearch = (searchFilters: any) => {
    setFilters(searchFilters);
  };

  const handleContactClick = (tripId: number, userId: number) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to contact travelers",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate(`/messages/${userId}`);
  };

  return (
    <div id="find-trips" className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Available Trips</h2>
          <p className="max-w-2xl mx-auto text-gray-500">
            Browse travelers heading to Tunisia who can transport your items.
          </p>
        </div>

        <TripSearch onSearch={handleSearch} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-gray-200 h-12 w-12 mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <div>
                      <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-8 bg-blue-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredTrips && filteredTrips.length > 0 ? (
            filteredTrips
              .slice(0, 3)
              .map((trip: any) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onContactClick={handleContactClick}
                />
              ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500 mb-4">No trips found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ originCountry: "", destinationCountry: "", departureDate: "" })}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="inline-flex justify-center items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => navigate("/trips")}
          >
            View all available trips
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
