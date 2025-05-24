import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navLinks = [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#find-trips", label: "Find Trips" },
    { href: "/#send-package", label: "Send a Package" },
    { href: "/#safety", label: "Safety" },
  ];

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center cursor-pointer">
                <Ship className="text-primary h-8 w-8 mr-2" />
                <span className="font-bold text-xl text-primary">BlaBlaShip</span>
              </a>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 hidden md:flex">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} alt={user.username} />
                        <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <a className="cursor-pointer w-full">Dashboard</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user.id}`}>
                        <a className="cursor-pointer w-full">Profile</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages">
                        <a className="cursor-pointer w-full">Messages</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-primary bg-white hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-2"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent position="right" size="full">
                  <div className="flex flex-col h-full py-6 space-y-6">
                    <div className="px-4 space-y-1">
                      <Link href="/">
                        <a className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                          <Ship className="text-primary h-8 w-8 mr-2" />
                          <span className="font-bold text-xl text-primary">BlaBlaShip</span>
                        </a>
                      </Link>
                    </div>
                    <div className="py-6 px-4 space-y-4">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="block py-2 text-base font-medium text-gray-700 hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                    <div className="px-4 mt-auto">
                      {user ? (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 border rounded-lg">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.profileImage} alt={user.username} />
                              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                navigate("/dashboard");
                                setMobileMenuOpen(false);
                              }}
                            >
                              Dashboard
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                navigate(`/profile/${user.id}`);
                                setMobileMenuOpen(false);
                              }}
                            >
                              Profile
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                navigate("/messages");
                                setMobileMenuOpen(false);
                              }}
                            >
                              Messages
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                handleLogout();
                                setMobileMenuOpen(false);
                              }}
                            >
                              Log out
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-4">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              navigate("/login");
                              setMobileMenuOpen(false);
                            }}
                          >
                            Log in
                          </Button>
                          <Button
                            className="w-full"
                            onClick={() => {
                              navigate("/register");
                              setMobileMenuOpen(false);
                            }}
                          >
                            Sign up
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
