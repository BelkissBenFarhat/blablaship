import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { countries } from "@shared/schema";

const formSchema = z.object({
  originCountry: z.string().optional(),
  destinationCountry: z.string().optional(),
  departureDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TripSearchProps {
  onSearch: (filters: FormValues) => void;
  isInline?: boolean;
}

export default function TripSearch({ onSearch, isInline = false }: TripSearchProps) {
  const [originCities, setOriginCities] = useState<string[]>([]);
  const [destinationCities, setDestinationCities] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originCountry: "",
      destinationCountry: "",
      departureDate: "",
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

  function onSubmit(data: FormValues) {
    onSearch(data);
  }

  return (
    <div className={`bg-white ${isInline ? "" : "p-4 rounded-xl shadow-md mb-8"}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={`grid grid-cols-1 ${isInline ? "md:grid-cols-3" : "md:grid-cols-4"} gap-4`}>
            <FormField
              control={form.control}
              name="originCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Trips
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
