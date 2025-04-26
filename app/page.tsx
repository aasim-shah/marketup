"use client";

import { useState, useMemo } from "react";
import { Place, SearchResponse } from "@/lib/types";
import { mockSearchResults } from "@/lib/mockData";
import SearchBar from "@/components/SearchBar";
import MapSection from "@/components/MapSection";
import ActionBar from "@/components/ActionBar";
import ThemeToggle from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const places = useMemo(() => searchResults?.results || [], [searchResults]);

  const handleSearch = async (query: string, location: string) => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/search-places`,
        {
          params: {
            lookfor: query,
            location: location,
          },
        }
      );

      const data = response.data;
      console.log({ data });

      setSearchResults({ ...data, results: data.results });
      setActiveMarkerIndex(null);

      toast({
        title: "Search completed",
        description: `Found ${data.results.length} results for "${query}" in "${location}"`,
      });
    } catch (error) {
      console.error("Error searching places:", error);
      toast({
        title: "Error",
        description: "Failed to search places. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col  bg-background">
      <header className="bg-card shadow-sm py-4 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Place Finder</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-col ">
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
          {searchResults && (
            <div className="flex-1 relative h-[calc(100vh-200px)]">
              <MapSection searchResults={searchResults} />
            </div>
          )}
          {/* <div className="p-4">
            <ActionBar
              selectedCount={selectedPlaces.length}
              onProceed={handleProceed}
              selectedPlaces={selectedPlaces}
            />
          </div> */}
        </div>

        {/* {!searchResults && !isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md p-8">
              <h2 className="text-xl font-semibold mb-2">Start Your Search</h2>
              <p className="text-muted-foreground mb-4">
                Enter a search query (e.g., &quot;software house&quot;) and
                location (e.g., &quot;Gulberg Green&quot;) to find places.
              </p>
            </div>
          </div>
        )} */}
      </main>

      {/* <footer className="bg-muted py-4 px-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Place Finder. All rights reserved.</p>
      </footer> */}
    </div>
  );
}
