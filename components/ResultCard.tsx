"use client";

import { Phone, Globe } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Place } from "@/lib/types";
import SocialLinks from "@/components/SocialLinks";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  place: Place;
  isActive: boolean;
  onToggleSelect: () => void;
}

export default function ResultCard({ 
  place, 
  isActive, 
  onToggleSelect 
}: ResultCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-md overflow-hidden",
        isActive && "ring-2 ring-primary shadow-lg transform scale-[1.02]",
        place.selected && "bg-primary/5 border-primary/30"
      )}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">{place.name}</h3>
        </div>
        <div className="flex items-center">
          <Checkbox 
            id={`select-${place.name.replace(/\s+/g, '-').toLowerCase()}`}
            checked={place.selected}
            onCheckedChange={onToggleSelect}
            className="h-5 w-5"
            aria-label={`Select ${place.name}`}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 space-y-2">
        <p className="text-sm text-muted-foreground">{place.address}</p>
        
        {place.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a 
              href={`tel:${place.phone.replace(/\s+/g, '')}`} 
              className="text-primary hover:underline"
            >
              {place.phone}
            </a>
          </div>
        )}
        
        {place.website && (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a 
              href={place.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline truncate max-w-[200px]"
            >
              {place.website.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex flex-col items-stretch gap-3">
        {place.socialLinks && (
          <SocialLinks socialLinks={place.socialLinks} />
        )}
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`, '_blank');
            }}
          >
            Directions
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs"
            onClick={onToggleSelect}
          >
            {place.selected ? "Unselect" : "Select"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}