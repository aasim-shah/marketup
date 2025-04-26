import { NextResponse } from "next/server";
import { mockSearchResults } from "@/lib/mockData";

// For static export, we'll return a static version of the search results
export async function GET() {
  // Get mock data with empty search terms to return all possible results
  const results = mockSearchResults("", "");

  return NextResponse.json(results);
}
