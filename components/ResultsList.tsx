"use client";

import { useEffect, useRef } from "react";
import { Place } from "@/lib/types";
import ResultCard from "@/components/ResultCard";

interface ResultsListProps {
  places: Place[];
  activeIndex: number | null;
  onToggleSelect: (index: number) => void;
}

export default function ResultsList({ 
  places, 
  activeIndex, 
  onToggleSelect 
}: ResultsListProps) {
  const resultRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to active result when activeIndex changes
  useEffect(() => {
    if (activeIndex !== null && resultRefs.current[activeIndex]) {
      resultRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  if (places.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No results found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Search Results ({places.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place, index) => (
          <div
            key={`${place.name}-${index}`}
            ref={(el) => (resultRefs.current[index] = el)}
            className="transition-all duration-300"
          >
            <ResultCard
              place={place}
              isActive={index === activeIndex}
              onToggleSelect={() => onToggleSelect(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}