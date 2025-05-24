import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import TripForm from "@/components/TripForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from 'react-helmet';

export default function NewTrip() {
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
        <title>Create New Trip | BlaBlaShip</title>
        <meta name="description" content="Create a new trip on BlaBlaShip to help transport packages for others." />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create a New Trip</CardTitle>
            <CardDescription>
              Let others know about your upcoming trip so they can send items with you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TripForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
