import { Place } from './types';
import { utils, writeFile } from 'xlsx';

export function exportPlacesToExcel(places: Place[]) {
  // Prepare data for Excel
  const data = places.map(place => ({
    'Name': place.name,
    'Address': place.address,
    'Phone': place.phone || 'N/A',
    'Website': place.website || 'N/A',
    'Latitude': place.location.lat,
    'Longitude': place.location.lng,
    'Facebook': place.socialLinks?.facebook || 'N/A',
    'Instagram': place.socialLinks?.instagram || 'N/A',
    'LinkedIn': place.socialLinks?.linkedin || 'N/A',
    'Twitter': place.socialLinks?.others?.find(link => 
      link.includes('twitter.com') || link.includes('x.com')
    ) || 'N/A'
  }));

  // Create workbook and worksheet
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Selected Places');

  // Auto-size columns
  const colWidths = Object.keys(data[0]).map(key => ({
    wch: Math.max(
      key.length,
      ...data.map(row => String(row[key as keyof typeof row]).length)
    )
  }));
  ws['!cols'] = colWidths;

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `selected-places-${timestamp}.xlsx`;

  // Save file
  writeFile(wb, filename);
  
  return filename;
}