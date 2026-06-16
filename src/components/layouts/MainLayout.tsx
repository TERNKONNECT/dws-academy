import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, linkTo: string) => {
    if (linkTo.startsWith('/#') && window.location.pathname === '/') {
      e.preventDefault();
      const id = linkTo.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', linkTo);
      } else {
        window.location.href = linkTo;
      }
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    // { to: "/services", label: "Our Services" },
    { to: "/#gallery", label: "Event Gallery" },
    { to: "/contact", label: "Contact Us" },
    { to: "/courses", label: "Events Academy" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-black text-yellow-400 text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> +234 806 319 1533
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> dwseventsng@gmail.com
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Mon - Fri: 9:00 - 17:00
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-yellow-200 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl">
            <img
              src="https://res.cloudinary.com/pro-solve/image/upload/v1778026489/logo_jxfytc.png"
              alt="JD Events Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavClick(e, link.to)}
                className="text-sm font-semibold text-gray-700 hover:text-yellow-600 transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                  >
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold border-0 shadow-lg hover:shadow-xl transition-all"
                  // className="text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 font-semibold"
                  >
                    Log In
                  </Button>
                </Link>
                {/* <Link to="/appointment">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold border-0 shadow-lg hover:shadow-xl transition-all"
                  >
                    Start free trial
                  </Button>
                </Link> */}
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-yellow-200 bg-white p-4 space-y-3 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-3 text-sm font-semibold text-gray-700 hover:text-yellow-600 transition-colors border-b border-gray-100 last:border-b-0"
                onClick={(e) => {
                  setMobileOpen(false);
                  handleNavClick(e, link.to);
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-yellow-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-300"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 font-semibold"
                    >
                      Log In
                    </Button>
                  </Link>
                  {/* <Link to="/appointment" onClick={() => setMobileOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold border-0"
                    >
                      Appointment
                    </Button>
                  </Link> */}
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-yellow-200 bg-gradient-to-br from-black via-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 font-bold text-xl">
              <img
                src="https://res.cloudinary.com/pro-solve/image/upload/v1778026489/logo_jxfytc.png"
                alt="JD Events Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              We bring your dream events to life with elegance and precision,
              creating unforgettable experiences.
            </p>
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">DWS Events Academy</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm text-yellow-400 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>
                <span className="cursor-default hover:text-yellow-400 transition-colors">
                  Portfolio
                </span>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm text-yellow-400 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span>dwseventsacademy@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-yellow-400" />
                <span>+234 704 375 7985</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-yellow-400/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} DWS Events Academy. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
