import { Shield, AlertTriangle, CheckCircle, LockKeyhole, BadgeCheck, Scale } from "lucide-react";
import { Link } from "wouter";

export default function Safety() {
  return (
    <div id="safety" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Safety & Trust</h2>
          <p className="max-w-2xl mx-auto text-gray-500">
            Your safety is our top priority. Learn how we create a secure and trusted community for Tunisian diaspora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <img
              src="https://images.unsplash.com/photo-1570777461323-6a08e81034c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
              alt="Tunisian travelers exchanging packages"
              className="rounded-xl shadow-md w-full h-auto mb-6"
            />

            <div className="flex items-start mb-6">
              <div className="flex-shrink-0">
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold mb-2">Verified Users</h3>
                <p className="text-gray-500">
                  Every member goes through a thorough verification process. We verify IDs, contact information, and connect social profiles. We also perform background checks for frequent travelers to ensure maximum security.
                </p>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold mb-2">Transparent Reviews</h3>
                <p className="text-gray-500">
                  Our rating system builds trust through transparency. After each delivery, both parties leave detailed reviews visible to the community, creating accountability and helping others make informed decisions.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mt-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Customs & Regulations</h3>
                  <p className="text-gray-500 mt-2">
                    All users must comply with Tunisian customs regulations and airline policies. We provide guidance on documentation needed for common items like food, medicine, and electronics.
                  </p>
                  <p className="text-gray-500 mt-2">
                    <strong>Important:</strong> Senders are responsible for ensuring items are legal to transport between countries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0">
                <LockKeyhole className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
                <p className="text-gray-500">
                  Our in-app messaging system lets you communicate safely without sharing personal contact information until you're ready. All messages are encrypted and stored securely with end-to-end encryption.
                </p>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold mb-2">Package Guidelines</h3>
                <p className="text-gray-500">
                  We have clear guidelines about what can and cannot be transported:
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-500 space-y-1">
                  <li>Allowed: Traditional foods, clothes, documents, personal electronics, medicines (with prescription)</li>
                  <li>Prohibited: Valuables over €500, illegal substances, dangerous goods, counterfeit items</li>
                  <li>All packages must comply with airline and customs regulations</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <div className="flex-shrink-0">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-semibold mb-2">Dispute Resolution</h3>
                <p className="text-gray-500">
                  In the rare case something goes wrong, our specialized support team is ready to help mediate and find solutions. We're committed to fair outcomes for all parties involved and can communicate in Arabic, French, and English.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mt-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">BlaBlaShip Protection Program</h3>
                  <p className="text-gray-500 mt-2">
                    Our protection program offers basic coverage for packages up to €100 in value. For higher-value items, we recommend additional insurance through our partners.
                  </p>
                  <p className="text-gray-500 mt-2">
                    We also provide verification of package contents through optional photo/video documentation before shipping.
                  </p>
                  <Link href="/register" className="inline-flex items-center mt-4 text-primary hover:text-primary-dark">
                    Learn more about our protection
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
