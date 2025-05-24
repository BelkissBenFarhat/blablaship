import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      rating: 5,
      content:
        "I needed to send important administrative documents to my family in Sousse. Through BlaBlaShip, I found a traveler who delivered them safely within 3 days. The peace of mind knowing my documents were hand-delivered was worth every euro!",
      name: "Samia M.",
      location: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
      itemSent: "Legal Documents",
      verified: true,
    },
    {
      id: 2,
      rating: 5,
      content:
        "As a frequent traveler between Brussels and Tunis, I've transported several packages and earned enough to cover part of my travel expenses. The platform's verification system makes both parties feel secure. Baraka Allahofik BlaBlaShip!",
      name: "Karim B.",
      location: "Brussels, Belgium",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
      itemSent: "Multiple Packages",
      verified: true,
    },
    {
      id: 3,
      rating: 4.5,
      content:
        "My mother in Monastir was missing her favorite El Hattab cosmetics that aren't available in Canada. Through BlaBlaShip, I connected with someone from Montreal who brought them to her. She was overjoyed to receive her favorite Tunisian beauty products!",
      name: "Nadia T.",
      location: "Montreal, Canada",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
      itemSent: "Cosmetics",
      verified: true,
    },
    {
      id: 4,
      rating: 5,
      content:
        "I was craving authentic harissa from Nabeul that you just can't find in Germany. Found a traveler on BlaBlaShip who brought me 5 jars directly from Tunis! The taste of home made me so happy. Truly grateful for this service connecting our diaspora.",
      name: "Ahmed R.",
      location: "Berlin, Germany",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64",
      itemSent: "Traditional Food",
      verified: true,
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half-star"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.867 6.9-1 3.086-6.253 3.086 6.253 6.9 1-5 4.867 1.179 6.873z" />
          <path
            d="M12 17.75V2"
            fill="rgba(0,0,0,0)"
            stroke="none"
            className="fill-yellow-400"
          />
          <path
            d="M12 2 L12 17.75 L5.828 20.995 L7.007 14.122 L2.007 9.255 L8.907 8.255 L12 2 Z"
            stroke="none"
            className="fill-yellow-400"
          />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="h-4 w-4 text-yellow-400" />
      );
    }

    return stars;
  };

  return (
    <div className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stories from Our Community
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 mb-2">
            Hear from real members of the Tunisian diaspora who use BlaBlaShip to stay connected to home.
          </p>
          <p className="max-w-3xl mx-auto text-gray-600 italic text-sm">
            All testimonials from verified members of our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="absolute top-4 left-4">
                <Quote className="h-8 w-8 text-blue-100" />
              </div>
              <CardContent className="p-8 pt-12 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                  {testimonial.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Verified User
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-6 italic">{testimonial.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 mr-3 border-2 border-primary/10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {testimonial.itemSent}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-primary font-medium">
            Join our growing community of Tunisians helping each other bridge the distance.
          </p>
        </div>
      </div>
    </div>
  );
}
