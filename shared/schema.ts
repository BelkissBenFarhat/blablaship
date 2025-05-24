import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profileImage: text("profile_image"),
  phoneNumber: text("phone_number"),
  isVerified: boolean("is_verified").default(false).notNull(),
  rating: numeric("rating").default("0"),
  reviewCount: integer("review_count").default(0),
});

// Trip schema
export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  originCity: text("origin_city").notNull(),
  originCountry: text("origin_country").notNull(),
  destinationCity: text("destination_city").notNull(),
  destinationCountry: text("destination_country").notNull(),
  departureDate: timestamp("departure_date").notNull(),
  arrivalDate: timestamp("arrival_date").notNull(),
  availableWeight: numeric("available_weight").notNull(), // in kg
  notes: text("notes"),
  baseFee: numeric("base_fee").notNull(), // in EUR
});

// Package schema
export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  originCity: text("origin_city").notNull(),
  originCountry: text("origin_country").notNull(),
  destinationCity: text("destination_city").notNull(),
  destinationCountry: text("destination_country").notNull(),
  packageType: text("package_type").notNull(),
  weight: numeric("weight").notNull(), // in kg
  neededBy: timestamp("needed_by").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(), // open, in-transit, delivered
});

// Messages schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false).notNull(),
});

// Reviews schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id"),
  packageId: integer("package_id"),
  reviewerId: integer("reviewer_id").notNull(),
  revieweeId: integer("reviewee_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Delivery schema - connects trips and packages
export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  packageId: integer("package_id").notNull(),
  status: text("status").default("pending").notNull(), // pending, accepted, completed, cancelled
  fee: numeric("fee"), // Calculated based on package weight and trip base fee
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  phoneNumber: true,
});

export const insertTripSchema = createInsertSchema(trips).pick({
  userId: true,
  originCity: true,
  originCountry: true,
  destinationCity: true,
  destinationCountry: true,
  departureDate: true,
  arrivalDate: true,
  availableWeight: true,
  notes: true,
  baseFee: true,
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  userId: true,
  originCity: true,
  originCountry: true,
  destinationCity: true,
  destinationCountry: true,
  packageType: true,
  weight: true,
  neededBy: true,
  description: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  tripId: true,
  packageId: true,
  reviewerId: true,
  revieweeId: true,
  rating: true,
  comment: true,
});

export const insertDeliverySchema = createInsertSchema(deliveries).pick({
  tripId: true,
  packageId: true,
  fee: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveries.$inferSelect;

// Constants for form options
export const packageTypes = [
  "Food items",
  "Documents",
  "Medicine",
  "Clothes",
  "Electronics",
  "Gifts",
  "Other"
];

export const countries = [
  { name: "Tunisia", cities: ["Tunis", "Sousse", "Sfax", "Monastir", "Djerba"] },
  { name: "France", cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"] },
  { name: "Canada", cities: ["Montreal", "Toronto", "Ottawa", "Quebec City", "Vancouver"] },
  { name: "Belgium", cities: ["Brussels", "Antwerp", "Ghent", "Liège", "Charleroi"] },
  { name: "Italy", cities: ["Milan", "Rome", "Naples", "Turin", "Florence"] },
  { name: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"] }
];
