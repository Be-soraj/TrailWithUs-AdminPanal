import { z } from "zod";

export const highlightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const informationSchema = z.object({
  infoDescription: z.string().min(1, "Info description is required"),
  highlights: z.array(highlightSchema).min(1, "At least one highlight required"),
});

export const itineraryDaySchema = z.object({
  day: z.number().min(1),
  title: z.string().min(1),
  description: z.array(z.string().min(1)).min(1),
  amenities: z.array(z.string().min(1)).min(1),
});

export const tourPlanSchema = z.object({
  title: z.string().min(1),
  itinerary: z.array(itineraryDaySchema).min(1),
});

export const locationSchema = z.object({
  title: z.string().min(1),
  first_description: z.string().min(1),
  mapEmbed: z.string().min(1),
  second_description: z.string().min(1),
});

export const galleryImageSchema = z.object({
  image: z.string().url("Must be a valid URL"),
  colSpan: z.number().optional(),
  rowSpan: z.number().optional(),
});

export const gallerySchema = z.object({
  galleryDescription: z.string().min(1),
  images: z.array(galleryImageSchema).min(1),
});

export const tourSchema = z.object({
  _id: z.string(),
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(0),
  priceUnit: z.string().min(1),
  departure_date: z.string(), 
  participants: z.number().min(1),
  image: z.string().url(),
  rating: z.number().min(0).max(5),
  destination: z.string().min(2),
  reviewCount: z.number().min(0),
  information: informationSchema,
  tourPlan: tourPlanSchema,
  location: locationSchema,
  gallery: gallerySchema,
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: tourSchema,
  message: z.string(),
});
