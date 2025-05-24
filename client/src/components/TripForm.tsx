import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTripSchema, countries } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const formSchema = insertTripSchema
  .omit({ userId: true })
  .extend({
    originCity: z.string().min(1, "City is required"),
    originCountry: z.string().min(1, "Country is required"),
    destinationCity: z.string().min(1, "City is required"),
    destinationCountry: z.string().min(1, "Country is required"),
    departureDate: z.string().min(1, "Departure date is required"),
    arrivalDate: z.string().min(1, "Arrival date is required"),
    availableWeight: z.string().or(z.number()).pipe(
      z.coerce.number().positive("Weight must be positive")
    ),
    baseFee: z.string().or(z.number()).pipe(
      z.coerce.number().positive("Fee must be positive")
    ),
    notes: z.string().optional(),
  });

type FormValues = z.infer<typeof formSchema>;

interface TripFormProps {
  onSubmit?: (data: FormValues) => void;
  className?: string;
}

export default function TripForm({ onSubmit, className }: TripFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [originCities, setOriginCities] = useState<string[]>([]);
  const [destinationCities, setDestinationCities] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originCity: "",
      originCountry: "",
      destinationCity: "",
      destinationCountry: "",
      departureDate: "",
      arrivalDate: "",
      availableWeight: "",
      baseFee: "",
      notes: "",
    },
  });

  const watchOriginCountry = form.watch("originCountry");
  const watchDestinationCountry = form.watch("destinationCountry");
  const watchDepartureDate = form.watch("departureDate");

  useEffect(() => {
    if (watchOriginCountry) {
      const country = countries.find((c) => c.name === watchOriginCountry);
      if (country) {
        setOriginCities(country.cities);
      }
    } else {
      setOriginCities([]);
    }
  }, [watchOriginCountry]);

  useEffect(() => {
    if (watchDestinationCountry) {
      const country = countries.find((c) => c.name === watchDestinationCountry);
      if (country) {
        setDestinationCities(country.cities);
      }
    } else {
      setDestinationCities([]);
    }
  }, [watchDestinationCountry]);

  useEffect(() => {
    // Set min date for arrival date based on departure date
    if (watchDepartureDate) {
      const arrivalDateInput = document.getElementById('arrivalDate') as HTMLInputElement;
      if (arrivalDateInput) {
        arrivalDateInput.min = watchDepartureDate;
      }
    }
  }, [watchDepartureDate]);

  const handleSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a trip",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      if (onSubmit) {
        onSubmit(data);
      } else {
        await apiRequest("POST", "/api/trips", data);
        toast({
          title: "Success!",
          description: "Your trip has been created.",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create your trip. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get today's date in YYYY-MM-DD format for min date inputs
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-blue-50 rounded-xl shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Create a Trip</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="originCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From (Country)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="originCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From (City)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!watchOriginCountry}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {originCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To (Country)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.name} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To (City)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!watchDestinationCountry}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {destinationCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      min={today}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arrivalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
                  <FormControl>
                    <Input 
                      id="arrivalDate"
                      type="date" 
                      min={watchDepartureDate || today}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="availableWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Weight available in your luggage"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Fee (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="Starting fee in euros"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Additional details about your trip, preferences for packages, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Trip
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
