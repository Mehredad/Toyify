import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Result from "./pages/Result";
import Preview from "./pages/Preview";
import Customize from "./pages/Customize";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Terms from "./pages/Terms";
// import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const AppRoutes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  // Listen for storage changes (for cross-tab updates)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for custom events when user logs in/out in the same tab
  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>

      {/* ROUTES THAT USE MAINLAYOUT */}
      <Route element={
        <MainLayout 
          user={user} 
          navigate={navigate}
          onOpenLogout={handleLogout}
        />
      }>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* ROUTES WITHOUT MAINLAYOUT */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/signup" element={<Signup />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;