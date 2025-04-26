import { SearchResponse } from "./types";

export const mockSearchResults = (
  query: string,
  location: string
): SearchResponse => {
  return {
    query: `${query} in ${location}`,
    results: [
      {
        name: "Software Development Hub",
        address: "2nd floor, Gulberg Express Way...",
        phone: "0341 5240748",
        website: "https://softwaredevelopmenthub.com/",
        location: { lat: 33.5975145, lng: 73.1438345 },
        socialLinks: {
          facebook: "https://www.facebook.com/SdhPak",
        },
      },
      {
        name: "Techozon SMC PVT LTD",
        address: "Office 503, Gulberg empire...",
        phone: "0335 6701234",
        website: "https://techozon.com/",
        location: { lat: 33.6006541, lng: 73.1527226 },
        socialLinks: {
          instagram: "https://www.instagram.com/techozonsoftwarehouse/",
          facebook: "https://www.facebook.com/TechozonSoftwareHouse",
          linkedin: "https://www.linkedin.com/company/techozon-software-house/",
          others: ["https://twitter.com/Techozon1"],
        },
      },
      {
        name: "APPINSNAP (PRIVATE) LIMITED",
        address: "Office 401, Gulberg Business Center",
        phone: "(051) 2745817",
        website: "http://appinsnap.com/",
        location: { lat: 33.6180986, lng: 73.1678115 },
        socialLinks: {
          instagram: "https://instagram.com/appinsnap_ais",
          facebook: "https://www.facebook.com/appinsnap",
          linkedin: "https://www.linkedin.com/company/appinsnap/",
          others: ["https://twitter.com/appinsnap_"],
        },
      },
    ],
  };
};
