export interface Location {
  lat: number;
  lng: number;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  others?: string[];
}

export interface Place {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  location: Location;
  socialLinks?: SocialLinks;
  selected?: boolean;
}

export interface SearchResponse {
  query: string;
  results: Place[];
}