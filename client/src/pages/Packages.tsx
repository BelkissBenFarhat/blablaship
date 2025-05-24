import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import TripSearch from "@/components/TripSearch";
import PackageCard from "@/components/PackageCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";
import { Helmet } from 'react-helmet';

export default function Packages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const [filters, setFilters] = useState({
    originCountry: "",
    destinationCountry: "",
    departureDate: "",
  });

  const { data: packages, isLoading, isError } = useQuery({
    queryKey: ['/api/packages'],
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load packages. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  const handleSearch = (searchFilters: any) => {
    // Convert departureDate to neededBy for packages search
    const { departureDate, ...rest } = searchFilters;
    setFilters({ 
      ...rest, 
      neededBy: departureDate,
    });
  };

  const handleContactClick = (packageId: number, userId: number) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to contact package senders",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate(`/messages/${userId}`);
  };

  const filteredPackages = packages?.filter((pkg: any) => {
    if (filters.originCountry && pkg.originCountry !== filters.originCountry) {
      return false;
    }
    if (filters.destinationCountry && pkg.destinationCountry !== filters.destinationCountry) {
      return false;
    }
    if (filters.neededBy) {
      const filterDate = new Date(filters.neededBy);
      const pkgDate = new Date(pkg.neededBy);
      // For packages, we want to show packages that need delivery by or after the filter date
      if (pkgDate < filterDate) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Available Packages | BlaBlaShip</title>
        <meta name="description" content="Browse available packages that need transport to Tunisia or other destinations on BlaBlaShip." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Available Packages</h1>
            <p className="text-gray-500">Find packages that need transport</p>
          </div>
          <Button 
            onClick={() => navigate('/packages/new')}
            className="mt-4 md:mt-0"
          >
            <Package className="mr-2 h-4 w-4" />
            Create Package Request
          </Button>
        </div>

        <div className="mb-8">
          <TripSearch onSearch={handleSearch} />
          <p className="text-sm text-gray-500 mt-2">
            * For packages, the date filter shows packages needed by or after the selected date.
          </p>
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
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <div className="h-8 bg-blue-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPackages && filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg: any) => (
              <PackageCard key={pkg.id} pkg={pkg} onContactClick={handleContactClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-blue-50 rounded-xl">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No packages found</h3>
            <p className="text-gray-500 mb-6">
              {Object.values(filters).some(f => f) 
                ? "No packages match your search criteria. Try adjusting your filters."
                : "There are no available package requests at the moment."}
            </p>
            {Object.values(filters).some(f => f) && (
              <Button 
                variant="outline" 
                onClick={() => setFilters({ originCountry: "", destinationCountry: "", neededBy: "" })}
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
