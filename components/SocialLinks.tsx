"use client";

import { SocialLinks as SocialLinksType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  socialLinks: SocialLinksType;
  className?: string;
}

export default function SocialLinks({ socialLinks, className }: SocialLinksProps) {
  const { facebook, instagram, linkedin, others } = socialLinks;
  
  // Extract Twitter from others array
  const twitter = others?.find(link => 
    link.includes('twitter.com') || link.includes('x.com')
  );
  
  if (!facebook && !instagram && !linkedin && !twitter) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2 justify-start", className)}>
      {facebook && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200"
          asChild
        >
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
          </a>
        </Button>
      )}
      
      {instagram && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-pink-50 hover:bg-pink-100 border-pink-200"
          asChild
        >
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4 text-pink-600" />
          </a>
        </Button>
      )}
      
      {linkedin && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200"
          asChild
        >
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
          </a>
        </Button>
      )}
      
      {twitter && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-sky-50 hover:bg-sky-100 border-sky-200"
          asChild
        >
          <a
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="h-4 w-4 text-sky-500" />
          </a>
        </Button>
      )}
    </div>
  );
}