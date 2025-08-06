export interface Highlight {
  title: string;
  description: string;
}

export interface Information {
  infoDescription: string;
  highlights: Highlight[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string[];
  amenities: string[];
}

export interface TourPlan {
  title: string;
  itinerary: ItineraryDay[];
}

export interface Location {
  title: string;
  first_description: string;
  mapEmbed: string;
  second_description: string;
}

export interface GalleryImage {
  image: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface Gallery {
  galleryDescription: string;
  images: GalleryImage[];
}

export interface Tour {
  _id?: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  departure_date: string;
  participants: number;
  participantType: string;
  image: string;
  rating: number;
  destination: string;
  reviewCount: number;
  information: Information;
  tourPlan: TourPlan;
  location: Location;
  gallery: Gallery;
  date: string;
}
