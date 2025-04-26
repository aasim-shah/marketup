"use client";

import { mockSearchResults } from "@/lib/mockData";
import {
  GoogleMap,
  LoadScript,
  OverlayView,
  Marker,
} from "@react-google-maps/api";
import { useState, useRef, useEffect } from "react";
import { Place } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Share2,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Phone,
  Navigation,
  Youtube,
  Bot,
  Brain,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { useTheme } from "next-themes";
import { Checkbox } from "@/components/ui/checkbox";

interface MapSectionProps {
  searchResults: {
    results: Place[];
  };
}

export default function MapSection({ searchResults }: MapSectionProps) {
  const { theme } = useTheme();
  const [selectedMarkers, setSelectedMarkers] = useState<Place[]>([]);
  const [zoom, setZoom] = useState(13);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [shouldRecenter, setShouldRecenter] = useState(true);
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    resume: null as File | null,
  });
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "AIzaSyBECY2aNK5YkXshm_ZEqtZY0M_hcJT65Iw";

  const locations = searchResults.results;
  const mapRef = useRef<google.maps.Map | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, email: editor.getHTML() });
    },
  });

  const toggleSelection = (loc: Place) => {
    setSelectedMarkers((prev) =>
      prev.some((item) => item.name === loc.name)
        ? prev.filter((item) => item.name !== loc.name)
        : [...prev, loc]
    );
  };

  const handleMarkerClick = (loc: Place) => {
    setSelectedPlace(loc);
  };

  const handleCloseCard = () => {
    setSelectedPlace(null);
  };

  const handleProceed = () => {
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("subject", formData.subject);
      if (formData.resume) {
        formDataToSend.append("resume", formData.resume);
      }
      formDataToSend.append("selectedMarkers", JSON.stringify(selectedMarkers));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/proceed`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // alert("Application submitted successfully!");
        // setIsDialogOpen(false);
        // setFormData({ fullName: "", message: "", resume: null });
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application");
    }
  };

  const handleBrainClick = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/generate-text`,
        {
          text: formData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Brain request successful", response);
        // Format the response text to preserve line breaks
        const formattedText = response.data.response.replace(/\n/g, "<br>");
        // Update the editor content with the formatted response
        editor?.commands.setContent(formattedText);
        // Also update the formData
        setFormData((prev) => ({ ...prev, email: formattedText }));
      }
    } catch (error) {
      console.error("Error sending brain request:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  useEffect(() => {
    if (mapRef.current && locations.length > 0 && shouldRecenter) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((loc) => {
        bounds.extend(
          new google.maps.LatLng(loc.location.lat, loc.location.lng)
        );
      });
      mapRef.current.fitBounds(bounds);
      const center = mapRef.current.getCenter();
      if (center) {
        setMapCenter({ lat: center.lat(), lng: center.lng() });
      }
      setZoom(mapRef.current.getZoom() || 13);
      setShouldRecenter(false);
    }
  }, [locations, shouldRecenter]);

  // Reset recenter flag when search results change
  useEffect(() => {
    setShouldRecenter(true);
    setSelectedMarkers([]);
    setSelectedPlace(null);
  }, [searchResults]);

  const darkMapStyles = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "all",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#144b53" }, { lightness: 17 }, { weight: 1.2 }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#0b434f" }, { lightness: 29 }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0b434f" }],
    },
  ];

  const lightMapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  return (
    <div className="w-full h-[80vh] relative flex flex-col md:flex-row">
      <div
        className={`relative w-full md:w-1/4  md:h-full overflow-y-auto  border-b md:border-r bg-card transition-all duration-300 ${
          isListCollapsed
            ? "w-0 md:w-0 overflow-hidden p-0 border-0 opacity-0"
            : "opacity-100 p-4"
        }`}
      >
        <div className="bg-card pb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold whitespace-nowrap">
            Locations ({locations.length})
          </h3>
        </div>
        <div className={`space-y-2 mt-2 ${isListCollapsed ? "hidden" : ""}`}>
          {locations.map((location) => (
            <div
              key={location.name}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMarkers.some((marker) => marker.name === location.name)
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted"
              }`}
              onClick={() => handleMarkerClick(location)}
            >
              <Checkbox
                checked={selectedMarkers.some(
                  (marker) => marker.name === location.name
                )}
                onCheckedChange={() => toggleSelection(location)}
                className="h-4 w-4"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{location.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {location.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`relative w-full h-[52vh] md:h-full transition-all duration-300 ${
          isListCollapsed ? "w-full h-[100vh]" : "w-full md:w-3/4"
        }`}
      >
        <Button
          variant="default"
          size="icon"
          className={`absolute bg-primary text-primary-foreground top-4 ${
            isListCollapsed ? "left-4" : "left-4 md:left-4"
          } z-10  backdrop-blur-sm`}
          onClick={() => setIsListCollapsed(!isListCollapsed)}
        >
          {isListCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter || undefined}
            zoom={zoom}
            options={{
              disableDefaultUI: true,
              styles: theme === "dark" ? darkMapStyles : lightMapStyles,
            }}
            onLoad={(map) => {
              mapRef.current = map;
              if (locations.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                locations.forEach((loc) => {
                  bounds.extend(
                    new google.maps.LatLng(loc.location.lat, loc.location.lng)
                  );
                });
                map.fitBounds(bounds);
                const center = map.getCenter();
                if (center) {
                  setMapCenter({ lat: center.lat(), lng: center.lng() });
                }
                setZoom(map.getZoom() || 13);
              }
            }}
          >
            {locations.map((loc: any) => (
              <Marker
                key={loc.name}
                position={loc.location}
                onClick={() => handleMarkerClick(loc)}
                icon={{
                  url: selectedMarkers.some(
                    (marker) => marker.name === loc.name
                  )
                    ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            ))}

            {selectedPlace && (
              <OverlayView
                position={selectedPlace.location}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <Card className="w-60 cursor-pointer relative shadow-md hover:scale-105 transition rounded-2xl">
                  <div className="flex absolute top-4 right-4 items-center space-x-2">
                    <Checkbox
                      id={`select-${selectedPlace.name}`}
                      checked={selectedMarkers.some(
                        (marker) => marker.name === selectedPlace.name
                      )}
                      onCheckedChange={() => {
                        toggleSelection(selectedPlace);
                        handleCloseCard();
                      }}
                    />
                  </div>

                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-medium">
                      {selectedPlace.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-wrap gap-3 px-4 py-4">
                    {selectedPlace.phone && (
                      <Link href={`tel:${selectedPlace.phone}`}>
                        <Phone className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    )}
                    {selectedPlace.website && (
                      <Link href={selectedPlace.website} target="_blank">
                        <Globe className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    )}
                    {selectedPlace.socialLinks?.linkedin && (
                      <Link
                        href={selectedPlace.socialLinks.linkedin}
                        target="_blank"
                      >
                        <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    )}
                    {selectedPlace.socialLinks?.facebook && (
                      <Link
                        href={selectedPlace.socialLinks.facebook}
                        target="_blank"
                      >
                        <Facebook className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    )}
                    {selectedPlace.socialLinks?.instagram && (
                      <Link
                        href={selectedPlace.socialLinks.instagram}
                        target="_blank"
                      >
                        <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    )}
                    {selectedPlace.socialLinks?.others?.map(
                      (url: string, idx: number) => {
                        if (url.toLowerCase().includes("youtube.com")) {
                          return (
                            <Link key={idx} href={url} target="_blank">
                              <Youtube className="h-4 w-4 text-muted-foreground hover:text-primary" />
                            </Link>
                          );
                        } else if (
                          url.toLowerCase().includes("twitter.com") ||
                          url.toLowerCase().includes("x.com")
                        ) {
                          return (
                            <Link key={idx} href={url} target="_blank">
                              <Twitter className="h-4 w-4 text-muted-foreground hover:text-primary" />
                            </Link>
                          );
                        }
                        return null;
                      }
                    )}
                    <Link
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        selectedPlace.address
                      )}`}
                      target="_blank"
                    >
                      <Navigation className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Link>
                  </CardContent>
                </Card>
              </OverlayView>
            )}
          </GoogleMap>
        </LoadScript>

        {/* Proceed Button */}
        <div className="mt-4 ml-auto w-fit absolute bottom-4 right-4">
          <Button
            variant="default"
            className="w-fit bg-primary text-primary-foreground hover:bg-primary/80"
            onClick={handleProceed}
            disabled={selectedMarkers.length === 0}
          >
            Proceed with Selected ({selectedMarkers.length})
          </Button>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Application</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4  h-[80vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Enter subject"
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="email">Email</Label>
              <TiptapEditor editor={editor} />
              <Button
                variant="outline"
                className="absolute right-8 bottom-10 rounded-full h-12 w-12 p-2  bg-primary"
                onClick={handleBrainClick}
              >
                <Brain className="w-full h-full text-primary-foreground" />
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="resume">Resume</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
