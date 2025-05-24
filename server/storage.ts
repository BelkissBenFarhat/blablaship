import { 
  users, type User, type InsertUser,
  trips, type Trip, type InsertTrip,
  packages, type Package, type InsertPackage,
  messages, type Message, type InsertMessage,
  reviews, type Review, type InsertReview,
  deliveries, type Delivery, type InsertDelivery
} from "@shared/schema";

// Define the interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Trip operations
  getTrip(id: number): Promise<Trip | undefined>;
  getTripsByUser(userId: number): Promise<Trip[]>;
  getAvailableTrips(originCountry?: string, destinationCountry?: string, departureDate?: Date): Promise<Trip[]>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<Trip>): Promise<Trip | undefined>;
  deleteTrip(id: number): Promise<boolean>;
  
  // Package operations
  getPackage(id: number): Promise<Package | undefined>;
  getPackagesByUser(userId: number): Promise<Package[]>;
  getAvailablePackages(originCountry?: string, destinationCountry?: string, neededBy?: Date): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: Partial<Package>): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;
  
  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]>;
  getUserConversations(userId: number): Promise<{ userId: number, latestMessage: Message }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  
  // Review operations
  getReview(id: number): Promise<Review | undefined>;
  getReviewsForUser(userId: number): Promise<Review[]>;
  getUserRating(userId: number): Promise<{ rating: number, count: number }>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Delivery operations
  getDelivery(id: number): Promise<Delivery | undefined>;
  getDeliveriesByTrip(tripId: number): Promise<Delivery[]>;
  getDeliveriesByPackage(packageId: number): Promise<Delivery[]>;
  getDeliveriesByUser(userId: number): Promise<Delivery[]>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDeliveryStatus(id: number, status: string): Promise<Delivery | undefined>;
  calculateDeliveryFee(packageWeight: number, tripBaseFee: number): number;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trips: Map<number, Trip>;
  private packages: Map<number, Package>;
  private messages: Map<number, Message>;
  private reviews: Map<number, Review>;
  private deliveries: Map<number, Delivery>;
  
  private userIdCounter: number;
  private tripIdCounter: number;
  private packageIdCounter: number;
  private messageIdCounter: number;
  private reviewIdCounter: number;
  private deliveryIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.trips = new Map();
    this.packages = new Map();
    this.messages = new Map();
    this.reviews = new Map();
    this.deliveries = new Map();
    
    this.userIdCounter = 1;
    this.tripIdCounter = 1;
    this.packageIdCounter = 1;
    this.messageIdCounter = 1;
    this.reviewIdCounter = 1;
    this.deliveryIdCounter = 1;
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      isVerified: false,
      rating: "0",
      reviewCount: 0
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Trip operations
  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }
  
  async getTripsByUser(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(
      (trip) => trip.userId === userId
    );
  }
  
  async getAvailableTrips(
    originCountry?: string, 
    destinationCountry?: string, 
    departureDate?: Date
  ): Promise<Trip[]> {
    let filteredTrips = Array.from(this.trips.values());
    
    if (originCountry) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.originCountry.toLowerCase() === originCountry.toLowerCase()
      );
    }
    
    if (destinationCountry) {
      filteredTrips = filteredTrips.filter(
        (trip) => trip.destinationCountry.toLowerCase() === destinationCountry.toLowerCase()
      );
    }
    
    if (departureDate) {
      const date = new Date(departureDate);
      filteredTrips = filteredTrips.filter(
        (trip) => new Date(trip.departureDate).toDateString() === date.toDateString()
      );
    }
    
    return filteredTrips;
  }
  
  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.tripIdCounter++;
    const trip: Trip = { 
      ...insertTrip, 
      id
    };
    this.trips.set(id, trip);
    return trip;
  }
  
  async updateTrip(id: number, tripData: Partial<Trip>): Promise<Trip | undefined> {
    const trip = await this.getTrip(id);
    if (!trip) return undefined;
    
    const updatedTrip = { ...trip, ...tripData };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }
  
  async deleteTrip(id: number): Promise<boolean> {
    return this.trips.delete(id);
  }
  
  // Package operations
  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }
  
  async getPackagesByUser(userId: number): Promise<Package[]> {
    return Array.from(this.packages.values()).filter(
      (pkg) => pkg.userId === userId
    );
  }
  
  async getAvailablePackages(
    originCountry?: string, 
    destinationCountry?: string, 
    neededBy?: Date
  ): Promise<Package[]> {
    let filteredPackages = Array.from(this.packages.values()).filter(
      (pkg) => pkg.status === 'open'
    );
    
    if (originCountry) {
      filteredPackages = filteredPackages.filter(
        (pkg) => pkg.originCountry.toLowerCase() === originCountry.toLowerCase()
      );
    }
    
    if (destinationCountry) {
      filteredPackages = filteredPackages.filter(
        (pkg) => pkg.destinationCountry.toLowerCase() === destinationCountry.toLowerCase()
      );
    }
    
    if (neededBy) {
      const date = new Date(neededBy);
      filteredPackages = filteredPackages.filter(
        (pkg) => new Date(pkg.neededBy) >= date
      );
    }
    
    return filteredPackages;
  }
  
  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.packageIdCounter++;
    const pkg: Package = { 
      ...insertPackage, 
      id,
      status: 'open'
    };
    this.packages.set(id, pkg);
    return pkg;
  }
  
  async updatePackage(id: number, packageData: Partial<Package>): Promise<Package | undefined> {
    const pkg = await this.getPackage(id);
    if (!pkg) return undefined;
    
    const updatedPackage = { ...pkg, ...packageData };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }
  
  async deletePackage(id: number): Promise<boolean> {
    return this.packages.delete(id);
  }
  
  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async getMessagesBetweenUsers(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(
        (message) => 
          (message.senderId === userId1 && message.receiverId === userId2) ||
          (message.senderId === userId2 && message.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }
  
  async getUserConversations(userId: number): Promise<{ userId: number, latestMessage: Message }[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(
        (message) => message.senderId === userId || message.receiverId === userId
      );
    
    const conversationMap = new Map<number, Message[]>();
    
    userMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, []);
      }
      conversationMap.get(otherUserId)?.push(message);
    });
    
    const conversations: { userId: number, latestMessage: Message }[] = [];
    
    conversationMap.forEach((messages, otherUserId) => {
      messages.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      if (messages.length > 0) {
        conversations.push({
          userId: otherUserId,
          latestMessage: messages[0]
        });
      }
    });
    
    return conversations;
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const message: Message = { 
      ...insertMessage, 
      id,
      sentAt: now,
      isRead: false
    };
    this.messages.set(id, message);
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<boolean> {
    const message = await this.getMessage(id);
    if (!message) return false;
    
    message.isRead = true;
    this.messages.set(id, message);
    return true;
  }
  
  // Review operations
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }
  
  async getReviewsForUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.revieweeId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getUserRating(userId: number): Promise<{ rating: number, count: number }> {
    const reviews = await this.getReviewsForUser(userId);
    
    if (reviews.length === 0) {
      return { rating: 0, count: 0 };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    
    return {
      rating: parseFloat(avgRating.toFixed(1)),
      count: reviews.length
    };
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const review: Review = { 
      ...insertReview, 
      id,
      createdAt: now
    };
    this.reviews.set(id, review);
    
    // Update user rating
    const { rating, count } = await this.getUserRating(review.revieweeId);
    const user = await this.getUser(review.revieweeId);
    if (user) {
      user.rating = rating.toString();
      user.reviewCount = count;
      this.users.set(user.id, user);
    }
    
    return review;
  }
  
  // Delivery operations
  async getDelivery(id: number): Promise<Delivery | undefined> {
    return this.deliveries.get(id);
  }
  
  async getDeliveriesByTrip(tripId: number): Promise<Delivery[]> {
    return Array.from(this.deliveries.values())
      .filter(delivery => delivery.tripId === tripId);
  }
  
  async getDeliveriesByPackage(packageId: number): Promise<Delivery[]> {
    return Array.from(this.deliveries.values())
      .filter(delivery => delivery.packageId === packageId);
  }
  
  async getDeliveriesByUser(userId: number): Promise<Delivery[]> {
    const userTrips = await this.getTripsByUser(userId);
    const userPackages = await this.getPackagesByUser(userId);
    
    const tripIds = userTrips.map(trip => trip.id);
    const packageIds = userPackages.map(pkg => pkg.id);
    
    return Array.from(this.deliveries.values())
      .filter(delivery => 
        tripIds.includes(delivery.tripId) || packageIds.includes(delivery.packageId)
      );
  }
  
  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const id = this.deliveryIdCounter++;
    const now = new Date();
    const delivery: Delivery = { 
      ...insertDelivery, 
      id,
      status: 'pending',
      createdAt: now
    };
    this.deliveries.set(id, delivery);
    
    // Update package status
    const pkg = await this.getPackage(delivery.packageId);
    if (pkg) {
      pkg.status = 'in-transit';
      this.packages.set(pkg.id, pkg);
    }
    
    return delivery;
  }
  
  async updateDeliveryStatus(id: number, status: string): Promise<Delivery | undefined> {
    const delivery = await this.getDelivery(id);
    if (!delivery) return undefined;
    
    delivery.status = status;
    this.deliveries.set(id, delivery);
    
    // If delivery is completed, update package status
    if (status === 'completed') {
      const pkg = await this.getPackage(delivery.packageId);
      if (pkg) {
        pkg.status = 'delivered';
        this.packages.set(pkg.id, pkg);
      }
    }
    
    // If delivery is cancelled, update package status back to open
    if (status === 'cancelled') {
      const pkg = await this.getPackage(delivery.packageId);
      if (pkg) {
        pkg.status = 'open';
        this.packages.set(pkg.id, pkg);
      }
    }
    
    return delivery;
  }
  
  calculateDeliveryFee(packageWeight: number, tripBaseFee: number): number {
    // Base calculation: base fee + (weight * 5€ per kg)
    const weightFee = packageWeight * 5;
    const totalFee = tripBaseFee + weightFee;
    
    // Round to 2 decimal places
    return Math.round(totalFee * 100) / 100;
  }
}

export const storage = new MemStorage();
