"use client";

import { Button } from "@/components/ui/button";
import { Download, ArrowRight } from "lucide-react";
import { exportPlacesToExcel } from "@/lib/exportToExcel";
import { Place } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ActionBarProps {
  selectedCount: number;
  onProceed: () => void;
  selectedPlaces: Place[];
}

export default function ActionBar({ selectedCount, onProceed, selectedPlaces }: ActionBarProps) {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      const filename = exportPlacesToExcel(selectedPlaces);
      toast({
        title: "Export successful",
        description: `Data has been exported to ${filename}`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-sm text-muted-foreground">
        {selectedCount === 0 ? (
          <span>No places selected</span>
        ) : (
          <span>
            <strong>{selectedCount}</strong> place{selectedCount !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={selectedCount === 0}
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          <span>Export Selection</span>
        </Button>
        
        <Button
          size="sm"
          className="flex items-center gap-2"
          disabled={selectedCount === 0}
          onClick={onProceed}
        >
          <span>Proceed</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}