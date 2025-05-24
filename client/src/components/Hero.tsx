import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Hero() {
  const { user } = useAuth();

  return (
    <div
      className="relative bg-gray-800 overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1553159925-722263c4494e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="py-24 md:py-32 lg:py-40">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Connect Tunisian Diaspora with Travelers
          </h1>
          <p className="text-lg md:text-xl text-white mb-6 max-w-2xl">
            A trusted community marketplace connecting Tunisians abroad with travelers 
            to transport traditional food, documents, clothes, and medicine between 
            Tunisia and the world.
          </p>
          <div className="flex items-center mb-8 text-white">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-400" />
            <span className="text-sm md:text-base">Verified users and secure transactions</span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href={user ? "/packages/new" : "/register"}>
              <Button
                size="lg"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                I want to send a package
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={user ? "/trips/new" : "/register"}>
              <Button
                variant="outline"
                size="lg"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                I'm traveling soon
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
