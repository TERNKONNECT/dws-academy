import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Phone,
  Mail,
  Clock,
  LayoutDashboard,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
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
    { to: "/courses", label: "Courses" },
    { to: "/#books", label: "Books" },
    { to: "/team", label: "Our Team" },
    { to: "/gallery", label: "Gallery" },
    { to: "/#insights", label: "Insights" },
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
              <Mail className="h-3 w-3" /> schoolofeventsafrica@gmail.com
            </span>
          </div>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Mon - Fri: 9:00 - 17:00
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0C]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 font-bold text-xl md:text-2xl">
            <img src="/school-logo.jpeg" alt="" className="h-10 w-10 rounded-full object-cover md:h-11 md:w-11" />
            <span className="font-bold text-white tracking-tight">School of Events Africa</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavClick(e, link.to)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group py-2"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <Link
              to="/contact"
              className="rounded-full bg-primary px-5 py-2 text-[13.5px] font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,180,0,0.35)]"
            >
              Book a Clarity Call
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle className="text-white/70 hover:text-white hover:bg-[#151517]/10 rounded-full" />
            {isAuthenticated ? (
              <>
                <Link to={user?.role === "admin" || user?.role === "super-admin" ? "/dashboard" : "/my-learning"}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,180,0,0.35)] transition-all"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-white/70 hover:text-white hover:bg-[#151517]/10 rounded-full"
                  >
                    <User className="h-4 w-4" />
                    {user?.name}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 bg-transparent border-white/20 text-white/70 hover:text-white hover:border-white/50 hover:bg-[#151517]/10 rounded-full"
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-[0_8px_24px_rgba(244,180,0,0.35)] hover:-translate-y-0.5 transition-all"
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

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle className="text-white/70 hover:text-white hover:bg-[#151517]/10 rounded-lg" />
            <button
              className="p-2 text-white/70 hover:text-white hover:bg-[#151517]/10 rounded-lg"
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
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0B0B0C] p-4 space-y-3 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-3 text-sm font-semibold text-white/80 hover:text-white transition-colors border-b border-white/10 last:border-b-0"
                onClick={(e) => {
                  setMobileOpen(false);
                  handleNavClick(e, link.to);
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block rounded-full bg-primary px-5 py-2.5 text-center text-sm font-bold text-primary-foreground"
            >
              Book a Clarity Call
            </Link>
            <div className="pt-4 border-t border-white/10 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-[#151517]/10 rounded-full"
                    >
                      <User className="h-4 w-4" /> Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 bg-transparent border-white/20 text-white/80 hover:text-white hover:border-white/50 hover:bg-[#151517]/10 rounded-full"
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
                      className="w-full text-white/80 hover:text-white hover:bg-[#151517]/10 font-semibold rounded-full"
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

      <footer className="border-t border-white/10 bg-[#0B0B0C] text-white py-12 md:py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 font-bold text-xl">
              <img src="/school-logo.jpeg" alt="" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-bold text-white tracking-tight">School of Events Africa</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[260px]">
              Africa's business school for the event industry. Practical
              education from professionals building real businesses.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[13px] text-yellow-400 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/courses" className="hover:text-yellow-400 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/#books" onClick={(e) => handleNavClick(e, "/#books")} className="hover:text-yellow-400 transition-colors">
                  Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[13px] text-yellow-400 uppercase tracking-wider">
              Institution
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/team" className="hover:text-yellow-400 transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-yellow-400 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/#testimonials" onClick={(e) => handleNavClick(e, "/#testimonials")} className="hover:text-yellow-400 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-yellow-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[13px] text-yellow-400 uppercase tracking-wider">
              Social
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">Instagram</a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">LinkedIn</a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">YouTube</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[13px] text-yellow-400 uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-[13px] text-gray-400 mb-3">
              Insights, direct to your inbox.
            </p>
            {/* No newsletter subscribe endpoint exists yet — placeholder form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex rounded-full border border-white/10 overflow-hidden"
            >
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent px-4 py-2.5 text-[13px] text-white outline-none placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="bg-primary px-4 text-[13px] font-bold text-primary-foreground"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-yellow-400/20 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} School of Events Africa. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 text-center md:text-right">
              <Mail className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-yellow-400" />
              schoolofeventsafrica@gmail.com
              <span className="block sm:inline mt-2 sm:mt-0">
                <Phone className="inline h-3.5 w-3.5 sm:ml-4 mr-1.5 -mt-0.5 text-yellow-400" />
                +234 704 375 7985
              </span>
            </p>
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-gray-500">
            <span>Built by</span>
            <a 
              href="https://ternkonnect.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center transition-colors"
            >
              <div className="flex items-center gap-1 text-[#7B5EE3] group-hover:text-[#674ac7] transition-colors">
                <BookOpen className="h-[14px] w-[14px]" strokeWidth={2.5} />
                <span className="font-extrabold text-[11.5px] tracking-wide mt-[1px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  TERNKONNECT
                </span>
              </div>
            </a>
          </div>
        </div>
      </footer>
      {/* Floating Support Button */}
      <a
        href="mailto:schoolofeventsafrica@gmail.com"
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-black shadow-lg shadow-black/20 transition-transform hover:-translate-y-1 hover:bg-yellow-500 hover:shadow-xl group"
        aria-label="Contact Support"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute left-full ml-4 whitespace-nowrap rounded-lg bg-black px-3 py-1.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 pointer-events-none">
          Contact Support
        </span>
      </a>
    </div>
  );
};

export default MainLayout;
