import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Plane, Package, Globe, Star } from "lucide-react";

export default function CallToAction() {
  const { user } = useAuth();

  return (
    <div className="py-16 bg-gradient-to-r from-red-600 to-red-700 relative overflow-hidden">
      {/* Decorative elements that represent Tunisian flag colors */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect with your Homeland</h2>
          <div className="flex justify-center mb-6">
            <div className="h-1 w-20 bg-white rounded"></div>
          </div>
          <p className="text-xl text-white mb-6 max-w-2xl mx-auto">
            Join our growing community of Tunisians abroad and travelers who help each other stay connected to home.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-white text-center">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-center mb-3">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-1">20+ Countries</h3>
              <p className="text-sm text-white/80">Connecting Tunisians across the globe</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-center mb-3">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Weekly Trips</h3>
              <p className="text-sm text-white/80">Regular travelers to and from Tunisia</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-center mb-3">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Fast Delivery</h3>
              <p className="text-sm text-white/80">Items delivered in days, not weeks</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-center mb-3">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-1">5-Star Service</h3>
              <p className="text-sm text-white/80">Trusted by the community</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
            {user ? (
              <>
                <Link href="/trips/new">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <Plane className="mr-2 h-5 w-5" />
                    Register your trip to Tunisia
                  </Button>
                </Link>
                <Link href="/packages/new">
                  <Button
                    size="lg"
                    variant="outline"
                    className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Send a package home
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <Plane className="mr-2 h-5 w-5" />
                    Join as a traveler
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Join as a sender
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <p className="text-white/80 text-sm italic mt-4">
            "The taste of Tunisia is just a journey away."
          </p>
        </div>
      </div>
    </div>
  );
}
