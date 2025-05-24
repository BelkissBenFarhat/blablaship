import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import { IStorage, MemStorage } from './storage';
import { 
  users, 
  trips, 
  packages, 
  messages, 
  reviews, 
  deliveries,
  InsertUser,
  User,
  InsertTrip,
  Trip,
  InsertPackage,
  Package,
  InsertMessage,
  Message,
  InsertReview,
  Review,
  InsertDelivery,
  Delivery
} from '@shared/schema';
import { eq, and, desc, or, isNull, gte, lte } from 'drizzle-orm';
import { config } from './config';

// PostgreSQL implementation of the storage interface
export class PgStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(dbUrl: string) {
    // Initialize database connection
    const sql = neon(dbUrl);
    this.db = drizzle(sql);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await this.db.select().from(users).where(eq(users.email, email));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await this.db.insert(users).values(user).returning();
    return results[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const results = await this.db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return results.length > 0 ? results[0] : undefined;
  }

  // Trip operations
  async getTrip(id: number): Promise<Trip | undefined> {
    const results = await this.db.select().from(trips).where(eq(trips.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getTripsByUser(userId: number): Promise<Trip[]> {
    return await this.db.select().from(trips).where(eq(trips.userId, userId));
  }

  async getAvailableTrips(
    originCountry?: string,
    destinationCountry?: string,
    departureDate?: Date
  ): Promise<Trip[]> {
    let query = this.db.select().from(trips);

    if (originCountry) {
      query = query.where(eq(trips.originCountry, originCountry));
    }

    if (destinationCountry) {
      query = query.where(eq(trips.destinationCountry, destinationCountry));
    }

    if (departureDate) {
      // Get trips that depart on or after the given date
      query = query.where(gte(trips.departureDate, departureDate));
    }

    return await query;
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const results = await this.db.insert(trips).values(trip).returning();
    return results[0];
  }

  async updateTrip(id: number, tripData: Partial<Trip>): Promise<Trip | undefined> {
    const results = await this.db.update(trips)
      .set(tripData)
      .where(eq(trips.id, id))
      .returning();
    return results.length > 0 ? results[0] : undefined;
  }

  async deleteTrip(id: number): Promise<boolean> {
    const results = await this.db.delete(trips).where(eq(trips.id, id)).returning();
    return results.length > 0;
  }

  // Package operations
  async getPackage(id: number): Promise<Package | undefined> {
    const results = await this.db.select().from(packages).where(eq(packages.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getPackagesByUser(userId: number): Promise<Package[]> {
    return await this.db.select().from(packages).where(eq(packages.userId, userId));
  }

  async getAvailablePackages(
    originCountry?: string,
    destinationCountry?: string,
    neededBy?: Date
  ): Promise<Package[]> {
    let query = this.db.select().from(packages);

    if (originCountry) {
      query = query.where(eq(packages.originCountry, originCountry));
    }

    if (destinationCountry) {
      query = query.where(eq(packages.destinationCountry, destinationCountry));
    }

    if (neededBy) {
      // Get packages needed before the given date
      query = query.where(lte(packages.neededBy, neededBy));
    }

    return await query;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const results = await this.db.insert(packages).values(pkg).returning();
    return results[0];
  }

  async updatePackage(id: number, packageData: Partial<Package>): Promise<Package | undefined> {
    const results = await this.db.update(packages)
      .set(packageData)
      .where(eq(packages.id, id))
      .returning();
    return results.length > 0 ? results[0] : undefined;
  }

  async deletePackage(id: number): Promise<boolean> {
    const results = await this.db.delete(packages).where(eq(packages.id, id)).returning();
    return results.length > 0;
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const results = await this.db.select().from(messages).where(eq(messages.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return await this.db.select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, userId1),
            eq(messages.receiverId, userId2)
          ),
          and(
            eq(messages.senderId, userId2),
            eq(messages.receiverId, userId1)
          )
        )
      )
      .orderBy(messages.sentAt);
  }

  async getUserConversations(userId: number): Promise<{ userId: number, latestMessage: Message }[]> {
    // First get all unique users that the current user has exchanged messages with
    const sentMessages = await this.db.select({
      otherUserId: messages.receiverId,
    })
      .from(messages)
      .where(eq(messages.senderId, userId))
      .groupBy(messages.receiverId);

    const receivedMessages = await this.db.select({
      otherUserId: messages.senderId,
    })
      .from(messages)
      .where(eq(messages.receiverId, userId))
      .groupBy(messages.senderId);

    // Combine unique user IDs
    const uniqueUserIds = new Set<number>();
    
    sentMessages.forEach(msg => uniqueUserIds.add(msg.otherUserId));
    receivedMessages.forEach(msg => uniqueUserIds.add(msg.otherUserId));

    // For each unique user, get the latest message
    const conversations: { userId: number, latestMessage: Message }[] = [];
    
    for (const otherUserId of Array.from(uniqueUserIds)) {
      const latestMessages = await this.db.select()
        .from(messages)
        .where(
          or(
            and(
              eq(messages.senderId, userId),
              eq(messages.receiverId, otherUserId)
            ),
            and(
              eq(messages.senderId, otherUserId),
              eq(messages.receiverId, userId)
            )
          )
        )
        .orderBy(desc(messages.sentAt))
        .limit(1);

      if (latestMessages.length > 0) {
        conversations.push({
          userId: otherUserId,
          latestMessage: latestMessages[0]
        });
      }
    }

    return conversations;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const results = await this.db.insert(messages)
      .values({
        ...message,
        sentAt: new Date(),
        isRead: false
      })
      .returning();
    return results[0];
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const results = await this.db.update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return results.length > 0;
  }

  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    const results = await this.db.select().from(reviews).where(eq(reviews.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getReviewsForUser(userId: number): Promise<Review[]> {
    return await this.db.select().from(reviews).where(eq(reviews.reviewedUserId, userId));
  }

  async getUserRating(userId: number): Promise<{ rating: number, count: number }> {
    const userReviews = await this.db.select().from(reviews).where(eq(reviews.reviewedUserId, userId));
    
    if (userReviews.length === 0) {
      return { rating: 0, count: 0 };
    }
    
    const totalRating = userReviews.reduce((sum, review) => sum + Number(review.rating), 0);
    return {
      rating: totalRating / userReviews.length,
      count: userReviews.length
    };
  }

  async createReview(review: InsertReview): Promise<Review> {
    const results = await this.db.insert(reviews)
      .values({
        ...review,
        createdAt: new Date()
      })
      .returning();
    return results[0];
  }

  // Delivery operations
  async getDelivery(id: number): Promise<Delivery | undefined> {
    const results = await this.db.select().from(deliveries).where(eq(deliveries.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getDeliveriesByTrip(tripId: number): Promise<Delivery[]> {
    return await this.db.select().from(deliveries).where(eq(deliveries.tripId, tripId));
  }

  async getDeliveriesByPackage(packageId: number): Promise<Delivery[]> {
    return await this.db.select().from(deliveries).where(eq(deliveries.packageId, packageId));
  }

  async getDeliveriesByUser(userId: number): Promise<Delivery[]> {
    // A user participates in deliveries either as a traveler or a sender
    // First get trips and packages owned by the user
    const userTrips = await this.db.select().from(trips).where(eq(trips.userId, userId));
    const userPackages = await this.db.select().from(packages).where(eq(packages.userId, userId));
    
    // Extract IDs
    const tripIds = userTrips.map(trip => trip.id);
    const packageIds = userPackages.map(pkg => pkg.id);
    
    // Then get deliveries where those trips or packages are involved
    const deliveriesList: Delivery[] = [];
    
    // If user has trips, get deliveries for those trips
    if (tripIds.length > 0) {
      for (const tripId of tripIds) {
        const tripDeliveries = await this.db.select()
          .from(deliveries)
          .where(eq(deliveries.tripId, tripId));
        deliveriesList.push(...tripDeliveries);
      }
    }
    
    // If user has packages, get deliveries for those packages
    if (packageIds.length > 0) {
      for (const packageId of packageIds) {
        const packageDeliveries = await this.db.select()
          .from(deliveries)
          .where(eq(deliveries.packageId, packageId));
        
        // Only add deliveries that aren't already in the list
        for (const delivery of packageDeliveries) {
          if (!deliveriesList.some(d => d.id === delivery.id)) {
            deliveriesList.push(delivery);
          }
        }
      }
    }
    
    return deliveriesList;
  }

  async createDelivery(delivery: InsertDelivery): Promise<Delivery> {
    const results = await this.db.insert(deliveries)
      .values({
        ...delivery,
        createdAt: new Date(),
        status: 'pending'
      })
      .returning();
    return results[0];
  }

  async updateDeliveryStatus(id: number, status: string): Promise<Delivery | undefined> {
    const results = await this.db.update(deliveries)
      .set({ status })
      .where(eq(deliveries.id, id))
      .returning();
    return results.length > 0 ? results[0] : undefined;
  }

  calculateDeliveryFee(packageWeight: number, tripBaseFee: number): number {
    // Simple calculation based on weight and base fee
    return parseFloat((packageWeight * tripBaseFee).toFixed(2));
  }
}

// Initialize and export storage layer based on environment
// We default to in-memory during development but can use PostgreSQL in production
let storageInstance: IStorage;

if (config.databaseUrl) {
  // Use PostgreSQL in production or when database URL is provided
  try {
    storageInstance = new PgStorage(config.databaseUrl);
    console.log('Using PostgreSQL storage');
  } catch (error) {
    console.error('Error initializing PostgreSQL storage, falling back to in-memory storage:', error);
    storageInstance = new MemStorage();
    console.log('Using in-memory storage (fallback)');
  }
} else {
  // Use in-memory storage in development
  storageInstance = new MemStorage();
  console.log('Using in-memory storage');
}

export const pgStorage = storageInstance;