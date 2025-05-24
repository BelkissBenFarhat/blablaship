import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturedItems() {
  const items = [
    {
      title: "Traditional Food",
      description: "Authentic Tunisian cuisine including harissa, makroudh, kaftaji, and home-preserved lemons.",
      imageUrl: "https://images.unsplash.com/photo-1528712306091-ed0763094c98?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      tags: ["Most Popular", "Nostalgic"],
    },
    {
      title: "Tunisian Spices",
      description: "Unique spice blends like tabil, gaalat dagga, and coriander seeds not found abroad.",
      imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821eec72d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      tags: ["Cultural"],
    },
    {
      title: "Official Documents",
      description: "Birth certificates, diplomas, family documents, and legally verified paperwork.",
      imageUrl: "https://images.unsplash.com/photo-1568219656418-15c329312bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      tags: ["Essential"],
    },
    {
      title: "Artisanal Crafts",
      description: "Handcrafted items from Tunisian artisans including ceramics from Nabeul and chechias from Tunis.",
      imageUrl: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      tags: ["Gifts"],
    },
    {
      title: "Traditional Clothing",
      description: "Authentic jellabas, fouta towels, kachabias, and other traditional textile items.",
      imageUrl: "https://images.unsplash.com/photo-1615886753866-79396abc5c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      tags: ["Cultural"],
    },
    {
      title: "Family Medicines",
      description: "Non-prescription medications, herbal remedies, and health supplies from home.",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      tags: ["Health"],
    },
  ];

  return (
    <div className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Tunisians Abroad Miss Most
          </h2>
          <p className="max-w-2xl mx-auto text-gray-500 mb-6">
            Discover the most commonly transported items between Tunisia and the diaspora communities.
          </p>
          <p className="max-w-3xl mx-auto text-gray-600 italic">
            "From the taste of home to essential documents, connect with travelers heading your way."
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                {item.tags && item.tags.length > 0 && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    {item.tags.map((tag, idx) => (
                      <Badge key={idx} variant={tag === "Most Popular" ? "destructive" : "secondary"} className="opacity-90">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All items must comply with airline regulations and customs laws. <br />
            <span className="text-primary font-medium">Join our community to learn more about what's allowed.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
