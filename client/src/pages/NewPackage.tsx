import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import PackageRequestForm from "@/components/PackageRequestForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from 'react-helmet';

export default function NewPackage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
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
        <title>Create Package Request | BlaBlaShip</title>
        <meta name="description" content="Create a new package request on BlaBlaShip and find travelers to transport your items." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create a Package Request</CardTitle>
            <CardDescription>
              Describe the package you want to send and find a traveler heading your way.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PackageRequestForm className="bg-white" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
