import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { pgStorage as storage } from "./pgStorage";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import MemoryStore from "memorystore";
import {
  insertUserSchema,
  insertTripSchema,
  insertPackageSchema,
  insertMessageSchema,
  insertReviewSchema,
  insertDeliverySchema,
  packageTypes,
  countries
} from "@shared/schema";
import { config } from "./config";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Setup session store
  const MemoryStoreInstance = MemoryStore(session);
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new MemoryStoreInstance({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        secure: config.nodeEnv === "production",
        sameSite: config.nodeEnv === "production" ? 'none' : 'lax'
      },
    })
  );
  
  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        
        // Check if we need to use password comparison or bcrypt comparison
        // This allows for a smooth transition to bcrypt
        if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
          // Password is already hashed with bcrypt
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return done(null, false, { message: "Incorrect password." });
          }
        } else {
          // Plain text password comparison (for legacy accounts)
          if (user.password !== password) {
            return done(null, false, { message: "Incorrect password." });
          }
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
  
  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Authentication check middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };
  
  // API routes
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash the password with bcrypt for security
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const secureUserData = {
        ...userData,
        password: hashedPassword
      };
      
      const user = await storage.createUser(secureUserData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    // If this function gets called, authentication was successful
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  // Trip routes
  app.get("/api/trips", async (req, res) => {
    try {
      const originCountry = req.query.originCountry as string | undefined;
      const destinationCountry = req.query.destinationCountry as string | undefined;
      const departureDateString = req.query.departureDate as string | undefined;
      
      let departureDate: Date | undefined;
      if (departureDateString) {
        departureDate = new Date(departureDateString);
      }
      
      const trips = await storage.getAvailableTrips(
        originCountry,
        destinationCountry,
        departureDate
      );
      
      // Fetch user info for each trip
      const tripsWithUserInfo = await Promise.all(
        trips.map(async (trip) => {
          const user = await storage.getUser(trip.userId);
          return {
            ...trip,
            user: user ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImage: user.profileImage,
              isVerified: user.isVerified,
              rating: parseFloat(user.rating.toString()),
              reviewCount: user.reviewCount
            } : null
          };
        })
      );
      
      res.json(tripsWithUserInfo);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/trips", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const tripData = insertTripSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const trip = await storage.createTrip(tripData);
      res.status(201).json(trip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      const user = await storage.getUser(trip.userId);
      
      res.json({
        ...trip,
        user: user ? {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          rating: parseFloat(user.rating.toString()),
          reviewCount: user.reviewCount
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/trips", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const trips = await storage.getTripsByUser(userId);
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/trips/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (trip.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedTrip = await storage.updateTrip(id, req.body);
      res.json(updatedTrip);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/trips/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      if (trip.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const success = await storage.deleteTrip(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete trip" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Package routes
  app.get("/api/packages", async (req, res) => {
    try {
      const originCountry = req.query.originCountry as string | undefined;
      const destinationCountry = req.query.destinationCountry as string | undefined;
      const neededByString = req.query.neededBy as string | undefined;
      
      let neededBy: Date | undefined;
      if (neededByString) {
        neededBy = new Date(neededByString);
      }
      
      const packages = await storage.getAvailablePackages(
        originCountry,
        destinationCountry,
        neededBy
      );
      
      // Fetch user info for each package
      const packagesWithUserInfo = await Promise.all(
        packages.map(async (pkg) => {
          const user = await storage.getUser(pkg.userId);
          return {
            ...pkg,
            user: user ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              profileImage: user.profileImage,
              isVerified: user.isVerified,
              rating: parseFloat(user.rating.toString()),
              reviewCount: user.reviewCount
            } : null
          };
        })
      );
      
      res.json(packagesWithUserInfo);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/packages", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const packageData = insertPackageSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const pkg = await storage.createPackage(packageData);
      res.status(201).json(pkg);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      const user = await storage.getUser(pkg.userId);
      
      res.json({
        ...pkg,
        user: user ? {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          isVerified: user.isVerified,
          rating: parseFloat(user.rating.toString()),
          reviewCount: user.reviewCount
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/:userId/packages", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const packages = await storage.getPackagesByUser(userId);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.put("/api/packages/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      if (pkg.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updatedPackage = await storage.updatePackage(id, req.body);
      res.json(updatedPackage);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/packages/:id", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      if (pkg.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const success = await storage.deletePackage(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete package" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Message routes
  app.get("/api/messages/:userId", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const otherUserId = parseInt(req.params.userId);
      
      const messages = await storage.getMessagesBetweenUsers(user.id, otherUserId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/conversations", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      const conversations = await storage.getUserConversations(user.id);
      
      // Fetch user info for each conversation
      const conversationsWithUserInfo = await Promise.all(
        conversations.map(async (conversation) => {
          const otherUser = await storage.getUser(conversation.userId);
          return {
            ...conversation,
            user: otherUser ? {
              id: otherUser.id,
              username: otherUser.username,
              firstName: otherUser.firstName,
              lastName: otherUser.lastName,
              profileImage: otherUser.profileImage
            } : null
          };
        })
      );
      
      res.json(conversationsWithUserInfo);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/messages", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: user.id
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.put("/api/messages/:id/read", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markMessageAsRead(id);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Review routes
  app.get("/api/users/:userId/reviews", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviews = await storage.getReviewsForUser(userId);
      
      // Fetch reviewer info for each review
      const reviewsWithUserInfo = await Promise.all(
        reviews.map(async (review) => {
          const reviewer = await storage.getUser(review.reviewerId);
          return {
            ...review,
            reviewer: reviewer ? {
              id: reviewer.id,
              username: reviewer.username,
              firstName: reviewer.firstName,
              lastName: reviewer.lastName,
              profileImage: reviewer.profileImage
            } : null
          };
        })
      );
      
      res.json(reviewsWithUserInfo);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/reviews", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        reviewerId: user.id
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Delivery routes
  app.post("/api/deliveries", isAuthenticated, async (req, res) => {
    try {
      const deliveryData = insertDeliverySchema.parse(req.body);
      
      // Fetch trip and package to calculate fee
      const trip = await storage.getTrip(deliveryData.tripId);
      const pkg = await storage.getPackage(deliveryData.packageId);
      
      if (!trip || !pkg) {
        return res.status(404).json({ message: "Trip or package not found" });
      }
      
      // Calculate fee if not provided
      if (!deliveryData.fee) {
        deliveryData.fee = storage.calculateDeliveryFee(
          parseFloat(pkg.weight.toString()),
          parseFloat(trip.baseFee.toString())
        );
      }
      
      const delivery = await storage.createDelivery(deliveryData);
      res.status(201).json(delivery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.put("/api/deliveries/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'accepted', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedDelivery = await storage.updateDeliveryStatus(id, status);
      
      if (!updatedDelivery) {
        return res.status(404).json({ message: "Delivery not found" });
      }
      
      res.json(updatedDelivery);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/users/me/deliveries", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const deliveries = await storage.getDeliveriesByUser(user.id);
      
      // Fetch trip and package info for each delivery
      const deliveriesWithDetails = await Promise.all(
        deliveries.map(async (delivery) => {
          const trip = await storage.getTrip(delivery.tripId);
          const pkg = await storage.getPackage(delivery.packageId);
          return {
            ...delivery,
            trip,
            package: pkg
          };
        })
      );
      
      res.json(deliveriesWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Utility routes
  app.get("/api/utils/package-types", (req, res) => {
    res.json(packageTypes);
  });
  
  app.get("/api/utils/countries", (req, res) => {
    res.json(countries);
  });
  
  return httpServer;
}
