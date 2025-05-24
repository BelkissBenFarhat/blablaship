import { Link } from "wouter";
import { Search, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How BlaBlaShip Works</h2>
          <p className="max-w-2xl mx-auto text-gray-500">
            A simple way to connect package senders with travelers going their way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Search className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find a Match</h3>
            <p className="text-gray-500">
              Search for travelers heading to your destination or list your trip if you're traveling.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <MessageCircle className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Securely</h3>
            <p className="text-gray-500">
              Use our in-app messaging to discuss details and arrange pickup/delivery.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Package className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Send & Receive</h3>
            <p className="text-gray-500">
              Complete the delivery and leave a review to help build our trusted community.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/register">
            <Button
              size="lg"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Learn more about our process
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
          </Link>
        </div>
      </div>
    </div>
  );
}
