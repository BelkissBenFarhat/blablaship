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
import { insertPackageSchema, packageTypes, countries } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

const formSchema = insertPackageSchema
  .omit({ userId: true })
  .extend({
    originCity: z.string().min(1, "City is required"),
    originCountry: z.string().min(1, "Country is required"),
    destinationCity: z.string().min(1, "City is required"),
    destinationCountry: z.string().min(1, "Country is required"),
    packageType: z.string().min(1, "Package type is required"),
    weight: z.string().or(z.number()).pipe(
      z.coerce.number().positive("Weight must be positive")
    ),
    neededBy: z.string().min(1, "Date needed by is required"),
    description: z.string().min(10, "Please provide a detailed description"),
  });

type FormValues = z.infer<typeof formSchema>;

interface PackageRequestFormProps {
  onSubmit?: (data: FormValues) => void;
  className?: string;
}

export default function PackageRequestForm({ onSubmit, className }: PackageRequestFormProps) {
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
      packageType: "",
      weight: "",
      neededBy: "",
      description: "",
    },
  });

  const watchOriginCountry = form.watch("originCountry");
  const watchDestinationCountry = form.watch("destinationCountry");

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

  const handleSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send a package request",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      if (onSubmit) {
        onSubmit(data);
      } else {
        await apiRequest("POST", "/api/packages", data);
        toast({
          title: "Success!",
          description: "Your package request has been submitted.",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your package request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`bg-blue-50 rounded-xl shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Package Request Form</h3>
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

          <FormField
            control={form.control}
            name="packageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {packageTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Estimated weight in kg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="neededBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Needed By</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Please describe your package and any special requirements"
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
              className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Submit Package Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
