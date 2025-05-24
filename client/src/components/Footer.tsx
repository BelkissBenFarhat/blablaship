import { Ship, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Ship className="text-white h-8 w-8 mr-2" />
              <span className="font-bold text-xl text-white">BlaBlaShip</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting Tunisians abroad with travelers to transport packages securely and affordably.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#find-trips" className="text-gray-400 hover:text-white">
                  Find Trips
                </a>
              </li>
              <li>
                <a href="#send-package" className="text-gray-400 hover:text-white">
                  Send a Package
                </a>
              </li>
              <li>
                <a href="#safety" className="text-gray-400 hover:text-white">
                  Safety & Trust
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Prohibited Items
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Customs Information
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                <a
                  href="mailto:hello@blablaship.com"
                  className="text-gray-400 hover:text-white"
                >
                  hello@blablaship.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-400" />
                <a
                  href="tel:+21612345678"
                  className="text-gray-400 hover:text-white"
                >
                  +216 12 345 678
                </a>
              </li>
              <li className="flex items-start mt-4">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-1" />
                <span className="text-gray-400">
                  Rue du Lac Malaren, Les Berges du Lac
                  <br />
                  Tunis, Tunisia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BlaBlaShip. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              Built with ❤️ for the Tunisian diaspora
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
