import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import PackageRequestForm from "@/components/PackageRequestForm";
import { ShoppingBag, FileText, Pill, Gift } from "lucide-react";

export default function SendPackage() {
  const { user } = useAuth();

  return (
    <div id="send-package" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need to Send Something?</h2>
            <p className="text-gray-500 mb-6">
              List your package details and find a traveler heading your way. Perfect for sending:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="text-primary h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Traditional Items</h3>
                  <p className="mt-1 text-sm text-gray-500">Food, clothes, and artisanal products</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                  <FileText className="text-primary h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                  <p className="mt-1 text-sm text-gray-500">Important papers and legal documents</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                  <Pill className="text-primary h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Medicine</h3>
                  <p className="mt-1 text-sm text-gray-500">Non-prescription medications and supplies</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                  <Gift className="text-primary h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Gifts</h3>
                  <p className="mt-1 text-sm text-gray-500">Personal presents and souvenirs</p>
                </div>
              </div>
            </div>

            <Link href={user ? "/packages/new" : "/register"}>
              <Button
                size="lg"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                List your package now
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

          <div className="lg:w-1/2">
            <PackageRequestForm />
          </div>
        </div>
      </div>
    </div>
  );
}
