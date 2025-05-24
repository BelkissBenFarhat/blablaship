import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TripSearch from "@/components/TripSearch";
import TripCard from "@/components/TripCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plane } from "lucide-react";
import { Helmet } from 'react-helmet';

export default function Trips() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState({
    originCountry: "",
    destinationCountry: "",
    departureDate: "",
  });

  const { data: trips, isLoading, isError } = useQuery({
    queryKey: ['/api/trips'],
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load trips. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

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

  return (
    <>
      <Helmet>
        <title>Available Trips | BlaBlaShip</title>
        <meta name="description" content="Browse available trips and find travelers heading your way on BlaBlaShip." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Available Trips</h1>
            <p className="text-gray-500">Find travelers heading your way</p>
          </div>
          <Button 
            onClick={() => navigate('/trips/new')}
            className="mt-4 md:mt-0"
          >
            <Plane className="mr-2 h-4 w-4" />
            Create Trip
          </Button>
        </div>

        <div className="mb-8">
          <TripSearch onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
            ))}
          </div>
        ) : filteredTrips && filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip: any) => (
              <TripCard key={trip.id} trip={trip} onContactClick={handleContactClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-blue-50 rounded-xl">
            <Plane className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trips found</h3>
            <p className="text-gray-500 mb-6">
              {Object.values(filters).some(f => f) 
                ? "No trips match your search criteria. Try adjusting your filters."
                : "There are no available trips at the moment."}
            </p>
            {Object.values(filters).some(f => f) && (
              <Button 
                variant="outline" 
                onClick={() => setFilters({ originCountry: "", destinationCountry: "", departureDate: "" })}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
