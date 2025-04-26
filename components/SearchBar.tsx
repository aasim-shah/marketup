"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Search, MapPin, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Form validation schema
const searchFormSchema = z.object({
  query: z.string().min(2, { message: "Query must be at least 2 characters." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." }),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  // Default values from the example
  const [lastSubmitted, setLastSubmitted] = useState({
    query: "",
    location: "",
  });

  // Form setup
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: "software house",
      location: "Gulberg Green",
    },
  });

  // Submit handler
  const onSubmit = (data: SearchFormValues) => {
    // Only search if query or location has changed
    if (
      data.query === lastSubmitted.query &&
      data.location === lastSubmitted.location
    ) {
      return;
    }

    onSearch(data.query, data.location);
    setLastSubmitted({ query: data.query, location: data.location });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-0 justify-center items-center md:flex md:gap-4"
      >
        <div className="flex-1 md:flex-initial md:w-2/5">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="What are you looking for?"
                      className="pl-10"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex-1 md:flex-initial md:w-2/5">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Where?"
                      className="pl-10"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>
    </Form>
  );
}
