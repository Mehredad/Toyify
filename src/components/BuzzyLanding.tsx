import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Loader2,
  Sparkles,
  Edit,
  Download,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import ProfileDialog from "@/components/ProfileDialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url: string;
        },
        HTMLElement
      >;
    }
  }
}
export interface BuzzyLandingProps {
  user?: User | null;
  conceptId?: string | null;
  onLogout?: () => void; // 👈 optional
}

export const BuzzyLanding: React.FC<BuzzyLandingProps> = ({
  user = null,
  conceptId = null,
  onLogout,
}) => {
  const navigate = useNavigate();
  // const [step, setStep] = useState(1);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  // const [isTransitioning, setIsTransitioning] = useState(false);

  console.log("Zain here is user", user);

  // Restore pending order after login (non-PII data only for security)
  x
  // const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [size, setSize] = useState([20]);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSliderActive, setIsSliderActive] = useState(false);
  const [tempDescription, setTempDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedConceptUrl, setGeneratedConceptUrl] = useState<string | null>(
    null
  );
  const [isGeneratingConcept, setIsGeneratingConcept] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [toyName, setToyName] = useState("");
  const [toyStory, setToyStory] = useState("");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedImageVersion, setSelectedImageVersion] = useState<
    "generated" | "original"
  >("generated");
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  // Normalized scroll constants
  const NORMALIZED_DELTA = 200;
  const ANIMATION_DURATION = 350;
  const FRAMES = 20;

  // Unified animation dispatcher for 3D model
  const dispatchNormalizedAnimation = (
    container: HTMLDivElement,
    direction: 1 | -1
  ) => {
    const deltaPerFrame = (NORMALIZED_DELTA * direction) / FRAMES;
    let frameCount = 0;
    const animateFrame = () => {
      if (frameCount >= FRAMES) return;
      const wheelEvent = new WheelEvent("wheel", {
        deltaY: deltaPerFrame,
        bubbles: true,
        cancelable: true,
      });
      container.dispatchEvent(wheelEvent);
      frameCount++;
      requestAnimationFrame(() => {
        setTimeout(animateFrame, ANIMATION_DURATION / FRAMES);
      });
    };
    requestAnimationFrame(animateFrame);
  };
  // useEffect(() => {
  //   let isScrolling = false;
  //   let scrollAccumulator = 0;
  //   const scrollThreshold = 150;
  //   let touchStartY = 0;
  //   let touchAccumulator = 0;
  //   let isAnimating = false;
  //   const handleScroll = (e: WheelEvent) => {
  //     e.preventDefault();
  //     if (
  //       isScrolling ||
  //       isTransitioning ||
  //       isAnalyzing ||
  //       isTextareaFocused ||
  //       isSliderActive ||
  //       isEditingDescription ||
  //       step === 5 ||
  //       step === 6
  //     )
  //       return;

  //     // Detect touchpad vs mouse wheel (touchpads typically have smaller deltaY values)
  //     const isTouchpad = Math.abs(e.deltaY) < 50;
  //     const sensitivity = isTouchpad ? 2 : 1;
  //     scrollAccumulator += e.deltaY * sensitivity;
  //     if (Math.abs(scrollAccumulator) >= scrollThreshold) {
  //       isScrolling = true;
  //       setIsTransitioning(true);
  //       const container = containerRef.current;
  //       const scrollDirection = scrollAccumulator > 0 ? 1 : -1;

  //       // Dispatch normalized animation
  //       if (container && !isAnimating) {
  //         isAnimating = true;
  //         dispatchNormalizedAnimation(container, scrollDirection);
  //         setTimeout(() => {
  //           isAnimating = false;
  //         }, ANIMATION_DURATION);
  //       }
  //       setTimeout(() => {
  //         if (scrollAccumulator > 0 && step < 5) {
  //           setDirection("forward");
  //           setStep((prev) => prev + 1);
  //         } else if (scrollAccumulator < 0 && step > 1) {
  //           setDirection("backward");
  //           setStep((prev) => prev - 1);
  //         }
  //         scrollAccumulator = 0;
  //         setTimeout(() => {
  //           setIsTransitioning(false);
  //           isScrolling = false;
  //         }, 600);
  //       }, 200);
  //     }
  //   };
  //   const handleTouchStart = (e: TouchEvent) => {
  //     touchStartY = e.touches[0].clientY;
  //     touchAccumulator = 0;
  //   };
  //   const handleTouchMove = (e: TouchEvent) => {
  //     if (
  //       isScrolling ||
  //       isTransitioning ||
  //       isAnalyzing ||
  //       isTextareaFocused ||
  //       isSliderActive ||
  //       isEditingDescription ||
  //       step === 5 ||
  //       step === 6
  //     )
  //       return;
  //     const touchY = e.touches[0].clientY;
  //     const deltaY = touchStartY - touchY;
  //     touchAccumulator += deltaY;
  //     touchStartY = touchY;

  //     // No direct dispatch here - animation will be handled when threshold is reached

  //     if (Math.abs(touchAccumulator) >= scrollThreshold) {
  //       isScrolling = true;
  //       setIsTransitioning(true);
  //       const container = containerRef.current;
  //       const touchDirection = touchAccumulator > 0 ? 1 : -1;

  //       // Dispatch normalized animation
  //       if (container && !isAnimating) {
  //         isAnimating = true;
  //         dispatchNormalizedAnimation(container, touchDirection);
  //         setTimeout(() => {
  //           isAnimating = false;
  //         }, ANIMATION_DURATION);
  //       }
  //       setTimeout(() => {
  //         if (touchAccumulator > 0 && step < 5) {
  //           setDirection("forward");
  //           setStep((prev) => prev + 1);
  //         } else if (touchAccumulator < 0 && step > 1) {
  //           setDirection("backward");
  //           setStep((prev) => prev - 1);
  //         }
  //         touchAccumulator = 0;
  //         setTimeout(() => {
  //           setIsTransitioning(false);
  //           isScrolling = false;
  //         }, 600);
  //       }, 200);
  //     }
  //   };
  //   const handleTouchEnd = () => {
  //     touchAccumulator = 0;
  //   };
  //   const container = containerRef.current;
  //   if (container) {
  //     container.addEventListener("wheel", handleScroll, {
  //       passive: false,
  //     });
  //     container.addEventListener("touchstart", handleTouchStart, {
  //       passive: false,
  //     });
  //     container.addEventListener("touchmove", handleTouchMove, {
  //       passive: false,
  //     });
  //     container.addEventListener("touchend", handleTouchEnd, {
  //       passive: false,
  //     });
  //   }
  //   return () => {
  //     if (container) {
  //       container.removeEventListener("wheel", handleScroll);
  //       container.removeEventListener("touchstart", handleTouchStart);
  //       container.removeEventListener("touchmove", handleTouchMove);
  //       container.removeEventListener("touchend", handleTouchEnd);
  //     }
  //   };
  // }, [
  //   step,
  //   isTransitioning,
  //   isAnalyzing,
  //   isTextareaFocused,
  //   isSliderActive,
  //   isEditingDescription,
  // ]);


//   useEffect(() => {
//   const savedForm = sessionStorage.getItem("orderForm");
//   if (savedForm) {
//     const formState = JSON.parse(savedForm);

//     setUploadedImage(formState.uploadedImage);
//     setSelectedImageVersion(formState.selectedImageVersion);
//     setToyName(formState.toyName);
//     setToyStory(formState.toyStory);
//     setSize(formState.size);
//     setQuantity(formState.quantity);
//     setCustomerName(formState.customerName);
//     setCustomerEmail(formState.customerEmail);
//     setCustomerPhone(formState.customerPhone);
//     setDeliveryAddress(formState.deliveryAddress);

//     sessionStorage.removeItem("orderForm");
//   }
// }, []);

  // const handleNext = () => {
  //   if (step < 5 && !isTransitioning) {
  //     setIsTransitioning(true);
  //     setDirection("forward");
  //     setStep((prev) => prev + 1);
  //     setTimeout(() => setIsTransitioning(false), 600);
  //   }
  // };
  // const handlePrevious = () => {
  //   if (step > 1 && !isTransitioning) {
  //     setIsTransitioning(true);
  //     setDirection("backward");
  //     setStep((prev) => prev - 1);
  //     setTimeout(() => setIsTransitioning(false), 600);
  //   }
  // };

  // Validation schema for order form
  const orderFormSchema = z.object({
    customerName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    customerEmail: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
    customerPhone: z
      .string()
      .trim()
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number (e.g., +44123456789)"
      )
      .optional()
      .or(z.literal("")),
    deliveryAddress: z
      .string()
      .trim()
      .min(10, "Address must be at least 10 characters")
      .max(500, "Address must be less than 500 characters"),
  });
  const calculatePrice = (sizeValue: number, qty: number): number => {
    // Base price calculation: £25 for 15cm, £40 for 30cm
    const minSize = 15;
    const maxSize = 30;
    const minPrice = 25;
    const maxPrice = 40;

    // Linear interpolation for single toy
    const pricePerToy =
      minPrice +
      ((sizeValue - minSize) / (maxSize - minSize)) * (maxPrice - minPrice);

    // Total price before shipping
    return pricePerToy * qty;
  };
// Inside BuzzyLanding.tsx or wherever handleSubmit is defined
// Inside BuzzyLanding.tsx or wherever handleSubmit is defined
const handleSubmit = async () => {
  if (!user) {
    // user must be logged in before submitting
    navigate("/auth?redirect=order"); // or save step in query
    return;
  }

  if (!file || !selectedImageVersion || !size || !quantity) {
    toast({ title: "Missing info", description: "Please fill all required fields", variant: "destructive" });
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        imageVersion: selectedImageVersion,
        size: size[0],
        quantity,
        description: toyStory || "", // optional
        customerEmail
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Order submission failed");

    // ✅ Use backend-generated order ID if needed
    const orderId = data.order._id;

    toast({ title: "Order submitted!", description: "Check your email for confirmation." });

    // Move to confirmation step
    // setStep(7); // assuming step 7 is order confirmation

    // If you want to redirect in future: navigate(`/orders/${orderId}`);
  } catch (err: any) {
    toast({ title: "Submission failed", description: err.message, variant: "destructive" });
  } finally {
    setIsSubmitting(false);
  }
};




  const handleBackToHome = () => {
    // Reset all state
    // setStep(1);
    setIsOrderSubmitted(false);
    setFile(null);
    setUploadedImage(null);
    setDescription("");
    setGeneratedConceptUrl(null);
    setIsGeneratingConcept(false);
    setToyName("");
    setToyStory("");
    setSize([20]);
    setQuantity(1);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setDeliveryAddress("");
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      await analyzeImage(selectedFile);
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      await analyzeImage(selectedFile);
    }
  };
const analyzeImage = async (selectedFile: File) => {
  const reader = new FileReader();
  reader.onload = async (event) => {
    const imageData = event.target?.result as string;
    setUploadedImage(imageData);

    // setStep(4);
    setIsGeneratingConcept(true);
    setGenerationError(null);

    try {
      // Call /toy-preview
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/toy-preview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData }), // <-- matches backend
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Preview failed");

      setGeneratedConceptUrl(data.previewImage); // <-- matches backend response

      toast({ title: "Preview ready", description: "Toy preview generated!" });

      // Call story generation using the caption returned
      generateToyStory(data.generatedCaption || "A cute toy"); // optional fallback
    } catch (err: any) {
      console.error("Toy preview error:", err);
      setGenerationError(err.message);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsGeneratingConcept(false);
    }
  };

  reader.readAsDataURL(selectedFile);
};

// Regenerate function
const handleRegenerateConcept = async () => {
  if (!uploadedImage) return;

  setIsGeneratingConcept(true);
  setGenerationError(null);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ai/toy-preview`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: uploadedImage }), // unified key
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to generate toy preview." }));
      throw new Error(errorData.error || "Failed to generate toy preview.");
    }

    const data = await response.json();
    setGeneratedConceptUrl(data.previewImage || null);
    setDescription(data.generatedCaption || "");

    toast({ title: "Toy Preview Updated!", description: "A new toy preview has been generated." });
  } catch (error: any) {
    console.error("Error re-generating toy preview:", error);
    setGenerationError(error.message || "Failed to regenerate preview.");
    toast({ title: "Generation Failed", description: error.message || "Could not generate the toy.", variant: "destructive" });
  } finally {
    setIsGeneratingConcept(false);
  }
};

// Toy story function (unchanged)
const generateToyStory = async (description: string) => {
  try {
    setIsGeneratingStory(true);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/toy-story`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) throw new Error("Failed to generate toy story");

    const data = await response.json();
    setToyName(data.name || "Your Special Toy");
    setToyStory(data.story || "This toy is waiting for its adventure to begin.");
  } catch (err) {
    console.error("Error generating toy story:", err);
    setToyName("Your Special Toy");
    setToyStory("This toy is waiting for its adventure to begin.");
  } finally {
    setIsGeneratingStory(false);
  }
};

  // const handleGetStarted = () => {
  //   setStep(3); // Navigate to Upload step (step 1 of 3)
  // };

  const handleDownloadDigitalToy = () => {
    const imageToDownload = generatedConceptUrl || uploadedImage;
    if (!imageToDownload) {
      toast({
        title: "No image available",
        description: "Please upload a drawing first.",
        variant: "destructive",
      });
      return;
    }

    // Create download link
    const link = document.createElement("a");
    link.href = imageToDownload;
    link.download = `buzzymuzzy-digital-toy-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download started!",
      description: "Your digital toy has been downloaded.",
    });
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    onLogout?.(); // 👈 call logout passed from Index
  };

  const handleClear = () => {
    setFile(null);
    setUploadedImage(null);
    setDescription("");
    setGeneratedConceptUrl(null);
    setIsGeneratingConcept(false);
    setGenerationError(null);
    // setStep(3);
  };
  return (
    <div
      className="h-screen bg-white relative overflow-hidden"
      // ref={containerRef}
    >
      {/* Navbar */}
<nav className="fixed top-0 left-0 right-0 z-[100] bg-transparent">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    <div className="flex items-center justify-between h-14">
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
      >
       
        <img 
          src="/Logo.svg" 
          alt="Toyify Logo" 
          className="w-15 h-15 object-contain"
        />
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-8">
        <button
          onClick={() => setAboutOpen(true)}
          className="text-white/90 hover:text-white text-sm font-medium transition-colors"
        >
          About
        </button>
        <button
          onClick={() => setContactOpen(true)}
          className="text-white/90 hover:text-white text-sm font-medium transition-colors"
        >
          Contact
        </button>
        <button
          onClick={() => setPrivacyOpen(true)}
          className="text-white/90 hover:text-white text-sm font-medium transition-colors"
        >
          Privacy
        </button>
        <button
          onClick={() => setTermsOpen(true)}
          className="text-white/90 hover:text-white text-sm font-medium transition-colors"
        >
          Terms
        </button>
      </div>

      {/* Right Side - Cart & Auth */}
      <div className="hidden md:flex items-center gap-3">
        {/* Cart Icon */}
        <button className="text-white/80 hover:text-white transition-colors p-2">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowProfileDialog(true)}
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10 gap-2 text-sm"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Button>
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="ghost"
              className="text-white/90 hover:text-white hover:bg-white/10 gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            className="bg-white text-purple-600 hover:bg-gray-100 rounded-lg px-5 py-2 text-sm font-medium shadow-sm"
          >
            Sign in
          </Button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
    </div>
  </div>

  {/* Mobile Menu */}
  {mobileMenuOpen && (
    <div className="md:hidden bg-purple-600/95 backdrop-blur-sm border-t border-white/10 px-4 py-4">
      <div className="flex flex-col gap-1">
        <button
          onClick={() => {
            setAboutOpen(true);
            setMobileMenuOpen(false);
          }}
          className="text-white/90 hover:text-white hover:bg-white/10 text-left py-3 px-3 text-sm font-medium rounded-lg transition-colors"
        >
          About
        </button>
        <button
          onClick={() => {
            setContactOpen(true);
            setMobileMenuOpen(false);
          }}
          className="text-white/90 hover:text-white hover:bg-white/10 text-left py-3 px-3 text-sm font-medium rounded-lg transition-colors"
        >
          Contact
        </button>
        <button
          onClick={() => {
            setPrivacyOpen(true);
            setMobileMenuOpen(false);
          }}
          className="text-white/90 hover:text-white hover:bg-white/10 text-left py-3 px-3 text-sm font-medium rounded-lg transition-colors"
        >
          Privacy
        </button>
        <button
          onClick={() => {
            setTermsOpen(true);
            setMobileMenuOpen(false);
          }}
          className="text-white/90 hover:text-white hover:bg-white/10 text-left py-3 px-3 text-sm font-medium rounded-lg transition-colors"
        >
          Terms
        </button>
        
        <div className="border-t border-white/20 mt-3 pt-3">
          {user ? (
            <div className="flex flex-col gap-1">
              <Button
                onClick={() => {
                  setShowProfileDialog(true);
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-2"
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </Button>
              <Button
                onClick={() => {
                  setShowLogoutDialog(true);
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => {
                navigate("/auth");
                setMobileMenuOpen(false);
              }}
              className="w-full bg-white text-purple-600 hover:bg-gray-100 gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </div>
  )}
</nav>

      {/* Profile Dialog */}
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        user={user}
      />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You'll need to sign in again to
              access your profile and orders.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* About Dialog */}
      {/* <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About BuzzyMuzzy</DialogTitle>
            <DialogDescription>
              BuzzyMuzzy is a platform that transforms any drawing into a custom
              toy. We bring your imagination to life with our innovative 3D
              printing technology and expert craftsmanship.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Our mission is to make creativity accessible to everyone. Whether
              you're a child with a vivid imagination or an adult with a unique
              design idea, we're here to turn your vision into reality.
            </p>
            <p>
              With fast turnaround times, quality guarantee, and risk-free
              ordering, we make the process simple and enjoyable.
            </p>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Contact Dialog */}
      {/* <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              Get in touch with our team. We'd love to hear from you!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                support@buzzymuzzy.com
              </p>
            </div>
            <div>
              <Label htmlFor="contact-hours" className="text-sm font-medium">
                Hours
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Monday - Friday: 9:00 AM - 6:00 PM
              </p>
            </div>
            <div>
              <Label htmlFor="contact-response" className="text-sm font-medium">
                Response Time
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Rounded Frame - Filled borders */}
      {/* <div className="fixed inset-0 pointer-events-none z-50">
        // Top border
        <div className="fixed top-0 left-0 right-0 h-2 bg-white rounded-t-3xl" />
        // Left border
        <div className="fixed top-0 left-0 bottom-0 w-4 bg-white" />
        // Right border
        <div className="fixed top-0 right-0 bottom-0 w-4 bg-white" />
        // Bottom border - for footer space
        <div className="fixed bottom-0 left-0 right-0 h-[70px] md:h-[70px] lg:h-[70px] bg-white rounded-b-3xl" />
      </div> */}

      {/* Watermark cover - fixed white layer on bottom right */}
      {/* <div className="fixed bottom-0 right-0 w-32 h-6 bg-white pointer-events-none z-[55]" /> */}

      {/* Main content area with background */}
      {/* <div className="absolute top-2 left-4 right-4 bottom-[70px] md:bottom-[70px] lg:bottom-[70px] bg-background rounded-3xl overflow-hidden" /> */}

      {/* <div
        className={`h-screen flex items-start justify-center relative z-10 px-0 mx-[12px] ${
          step === 4 && uploadedImage ? "overflow-y-auto overflow-x-hidden" : ""
        }`}
      >
        <div
          className={`w-full max-w-2xl text-center ${
            step === 4 && uploadedImage
              ? "pt-24 pb-6 md:py-20"
              : "fixed top-24 left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:py-20"
          } px-0`}
        > */}
          {/* Step 1: Hero - Bigger on desktop */}
          {/* <div
            className={`transition-opacity transition-transform duration-500 ease-in-out w-full left-1/2 -translate-x-1/2 px-[6px] md:px-0 ${
              step === 1
                ? "opacity-100 translate-y-0 relative"
                : direction === "forward"
                ? "opacity-0 translate-y-10 absolute pointer-events-none"
                : "opacity-0 -translate-y-10 absolute pointer-events-none"
            }`}
          >
            <h1 className="text-6xl mb-6 md:mb-7 text-primary font-sketchy font-inter font-bold md:text-8xl">
              Buzzy
              <span className="text-3xl md:text-5xl align-super text-[hsl(30,100%,60%)] ml-[-4px]">
                Muzzy
              </span>
            </h1>
            <p className="text-2xl mb-4 md:mb-5 text-slate-900 md:text-4xl">
              Any drawing can become a toy!
            </p>
            <p className="text-lg mb-8 md:mb-10 mx-0 px-0 text-pink-500 font-normal md:text-2xl">
              Transform scribbles, doodles and mark-makings into real toys
            </p>
            <div
              className="sp inline-block scale-110 md:scale-125"
              onClick={handleNext}
            >
              <button className="sparkle-button">
                <span className="spark"></span>
                <span className="backdrop"></span>
                <svg
                  className="sparkle"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                    fill="black"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                    fill="black"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                    fill="black"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="text">Get started for free</span>
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 ml-2 text-white" />
              </button>
              <div className="bodydrop"></div>
              <span aria-hidden="true" className="particle-pen">
                {[...Array(20)].map((_, i) => (
                  <svg
                    key={i}
                    className="particle"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.937 3.846L7.75 1L8.563 3.846C8.77313 4.58114 9.1671 5.25062 9.70774 5.79126C10.2484 6.3319 10.9179 6.72587 11.653 6.936L14.5 7.75L11.654 8.563C10.9189 8.77313 10.2494 9.1671 9.70874 9.70774C9.1681 10.2484 8.77413 10.9179 8.564 11.653L7.75 14.5L6.937 11.654C6.72687 10.9189 6.3329 10.2494 5.79226 9.70874C5.25162 9.1681 4.58214 8.77413 3.847 8.564L1 7.75L3.846 6.937C4.58114 6.72687 5.25062 6.3329 5.79126 5.79226C6.3319 5.25162 6.72587 4.58214 6.936 3.847L6.937 3.846Z"
                      fill="black"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                ))}
              </span>
            </div>

            // Mobile Navigation Buttons
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4 lg:hidden">
              {step > 1 && (
                <Button onClick={handlePrevious} size="lg" variant="outline">
                  <ChevronUp className="w-5 h-5" />
                  Back
                </Button>
              )}
            </div>
          </div> */}

          {/* Step 2: Combined Benefits */}
          {/* <div
            className={`transition-opacity transition-transform duration-500 ease-in-out w-full left-1/2 -translate-x-1/2 px-[6px] md:px-0 ${
              step === 2
                ? "opacity-100 translate-y-0 relative"
                : direction === "forward"
                ? "opacity-0 translate-y-10 absolute pointer-events-none"
                : "opacity-0 -translate-y-10 absolute pointer-events-none"
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-secondary font-inter">
              Why Choose BuzzyMuzzy?
            </h2>

            <div className="space-y-4 mb-8 max-w-[320px] md:max-w-none mx-auto">
              <div
                className={`transition-all duration-500 delay-100 ${
                  step === 2
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 text-foreground">
                  No Payment Required Now
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Pay only when you're completely satisfied with your preview
                </p>
              </div>

              <div
                className={`transition-all duration-500 delay-300 ${
                  step === 2
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 text-foreground">
                  Ready to deliver in 3 Days
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Lightning-fast turnaround to bring your creation to life
                </p>
              </div>

              <div
                className={`transition-all duration-500 delay-500 ${
                  step === 2
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 text-foreground">
                  100% Refund if Unsatisfied
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Your satisfaction is our guarantee - risk-free ordering
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center justify-center">
              {step > 1 && (
                <Button onClick={handlePrevious} size="lg" variant="outline">
                  <ChevronUp className="w-5 h-5" />
                  Back
                </Button>
              )}
              <Button onClick={handleNext} size="lg">
                Continue
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>
          </div> */}

          {/* Step 3: Upload */}
          {/* <div
            className={`transition-opacity transition-transform duration-500 ease-in-out w-full left-1/2 -translate-x-1/2 px-[10px] md:px-0 ${
              step === 3
                ? "opacity-100 translate-y-0 relative"
                : direction === "forward"
                ? "opacity-0 translate-y-10 absolute pointer-events-none"
                : "opacity-0 -translate-y-10 absolute pointer-events-none"
            }`}
          >
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              Step 1 of 3
            </p>
            <div className="flex flex-col items-center mb-3 md:mb-4">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded mb-2 ${
                  uploadedImage
                    ? "text-green-600 bg-green-500/10"
                    : "text-red-500 bg-red-500/10"
                }`}
              >
                {uploadedImage ? "COMPLETED" : "REQUIRED"}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-inter">
                Upload Your Drawing
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Share your creative masterpiece
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg py-6 px-4 md:p-12 cursor-pointer transition-all max-w-[320px] md:max-w-none mx-auto ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
              }`}
            >
              <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-primary" />
              <p className="text-lg font-medium mb-2">
                {file ? file.name : "Drag & drop your drawing here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex gap-3 items-center mt-6 justify-center">
              {step > 1 && (
                <Button onClick={handlePrevious} size="lg" variant="outline">
                  <ChevronUp className="w-5 h-5" />
                  Back
                </Button>
              )}
              <Button onClick={handleNext} size="lg">
                Continue
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>
          </div> */}

          {/* Step 4: Select Image & Size/Quantity */}
          {/* <div
            className={`transition-opacity transition-transform duration-500 ease-in-out w-full left-1/2 -translate-x-1/2 px-[6px] md:px-0 ${
              step === 4
                ? "opacity-100 translate-y-0 relative"
                : direction === "forward"
                ? "opacity-0 translate-y-10 absolute pointer-events-none"
                : "opacity-0 -translate-y-10 absolute pointer-events-none"
            }`}
          >
            <div
              className="h-[calc(100vh-200px)] md:h-auto overflow-y-auto md:overflow-visible overscroll-contain px-[6px] md:px-0"
              onWheel={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <p className="text-xs md:text-sm text-muted-foreground mb-2">
                Step 2 of 3
              </p>
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-primary font-inter">
                Choose Your Toy
              </h2> */}

              {/* Loading State */}
              {/* {isGeneratingConcept && (
                <div className="flex flex-col items-center justify-center py-12 max-w-[320px] md:max-w-2xl mx-auto">
                  <Loader2 className="w-12 h-12 md:w-16 md:h-16 animate-spin text-primary mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                    Creating Your 3D Toy...
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Our AI is transforming your drawing into a 3D printed toy!
                  </p>
                </div>
              )} */}

              {/* Image Selection */}
              {/* {!isGeneratingConcept && generatedConceptUrl && (
                <div className="mb-6 max-w-[320px] md:max-w-2xl mx-auto">
                  <Label className="text-sm font-semibold mb-3 block">
                    Select Version
                  </Label>
                  <RadioGroup
                    value={selectedImageVersion}
                    onValueChange={(value: "generated" | "original") =>
                      setSelectedImageVersion(value)
                    }
                    className="grid grid-cols-2 gap-3"
                  >
                    <div
                      className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                        selectedImageVersion === "generated"
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      }`}
                      onClick={() => setSelectedImageVersion("generated")}
                    >
                      <RadioGroupItem
                        value="generated"
                        className="absolute top-2 right-2"
                      />
                      <img
                        src={generatedConceptUrl}
                        alt="Generated 3D toy"
                        className="w-full h-32 md:h-48 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                        <p className="text-white text-xs font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          3D Toy
                        </p>
                      </div>
                    </div>
                    <div
                      className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                        selectedImageVersion === "original"
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      }`}
                      onClick={() => setSelectedImageVersion("original")}
                    >
                      <RadioGroupItem
                        value="original"
                        className="absolute top-2 right-2"
                      />
                      <img
                        src={uploadedImage || ""}
                        alt="Original drawing"
                        className="w-full h-32 md:h-48 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                        <p className="text-white text-xs font-semibold">
                          Original
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              )} */}

              {/* Toy Name and Story Section */}
              {/* {!isGeneratingConcept && generatedConceptUrl && (
                <div className="mb-6 max-w-[320px] md:max-w-2xl mx-auto">
                  <div className="bg-muted/30 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Toy Name & Story
                      </Label>
                      {isGeneratingStory && (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="toy-name"
                          className="text-xs text-muted-foreground mb-1 block"
                        >
                          Toy Name (Optional)
                        </Label>
                        <Input
                          id="toy-name"
                          value={toyName}
                          onChange={(e) => setToyName(e.target.value)}
                          placeholder="Give your toy a special name..."
                          className="bg-background/50 text-foreground font-mono ring-1 ring-border focus:ring-1 focus:ring-primary ring-offset-0 outline-none duration-300 rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="toy-story"
                          className="text-xs text-muted-foreground mb-1 block"
                        >
                          Toy's Story (Optional)
                        </Label>
                        <Textarea
                          id="toy-story"
                          value={toyStory}
                          onChange={(e) => setToyStory(e.target.value)}
                          onFocus={() => setIsTextareaFocused(true)}
                          onBlur={() => setIsTextareaFocused(false)}
                          placeholder="What adventures await your toy?..."
                          className="min-h-[120px] bg-background/50 text-foreground font-mono ring-1 ring-border focus:ring-1 focus:ring-primary ring-offset-0 outline-none duration-300 rounded-lg px-3 py-2 resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          AI-generated story - feel free to edit and make it
                          your own!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* Size & Quantity */}
              {/* {!isGeneratingConcept && (
                <div className="mb-6 max-w-[320px] md:max-w-2xl mx-auto">
                  <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground">
                    Size & Quantity
                  </h3>
                  <div className="flex gap-4 items-stretch">
                    // Size Selector
                    <div
                      onPointerDown={() => setIsSliderActive(true)}
                      onPointerUp={() => setIsSliderActive(false)}
                      onPointerLeave={() => setIsSliderActive(false)}
                      className="flex-1 py-3 bg-muted/30 rounded-lg border border-border flex flex-col items-center justify-start px-2"
                    >
                      <Label className="text-xs font-semibold mb-3 block">
                        Size
                      </Label>
                      <div className="mb-3 flex items-baseline gap-2 flex-nowrap">
                        <div className="text-lg md:text-2xl font-bold text-secondary whitespace-nowrap">
                          {size[0]} cm
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                          ({(size[0] / 2.54).toFixed(1)}")
                        </div>
                      </div>
                      <div className="w-full">
                        <Slider
                          value={size}
                          onValueChange={setSize}
                          min={15}
                          max={30}
                          step={1}
                          className="mb-1"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>15 cm</span>
                          <span>30 cm</span>
                        </div>
                      </div>
                    </div> */}

                    {/* Quantity Selector */}
                    {/* <div className="w-[120px] px-3 py-3 bg-muted/30 rounded-lg border border-border flex flex-col items-center justify-start">
                      <Label className="text-xs font-semibold mb-3 block">
                        Quantity
                      </Label>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            disabled={quantity <= 1}
                          >
                            -
                          </Button>
                          <div className="text-xl font-bold text-secondary min-w-[40px] text-center">
                            {quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        {quantity > 1 && (
                          <p className="text-xs text-green-600 font-medium text-center">
                            🎉 Free ship!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isGeneratingConcept && (
                <div className="flex gap-3 items-center justify-center">
                  <Button onClick={handlePrevious} size="lg" variant="outline">
                    <ChevronUp className="w-5 h-5" />
                    Back
                  </Button>
                  <Button onClick={handleNext} size="lg">
                    Continue
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </div> */}

          {/* Step 5: Customer Details (was Step 6) */}
          {/* <div
            className={`transition-opacity transition-transform duration-500 ease-in-out w-full left-1/2 -translate-x-1/2 px-[10px] md:px-0 ${
              step === 5
                ? "opacity-100 translate-y-0 relative"
                : direction === "forward"
                ? "opacity-0 translate-y-10 absolute pointer-events-none"
                : "opacity-0 -translate-y-10 absolute pointer-events-none"
            }`}
          >
            <p className="text-xs md:text-sm text-muted-foreground mb-2">
              Step 3 of 3
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-primary font-inter">
              Delivery Details
            </h2> */}

            {/* Order Summary Card - Very compact on mobile */}
            {/* <div className="mb-2 p-2 bg-card rounded-lg border border-border mx-0 px-0 py-0">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-3 text-[10px] md:text-xs my-[6px]">
                <div>
                  <span className="text-muted-foreground">File:</span>
                  <span className="font-medium block truncate">
                    {file?.name.substring(0, 8)}...
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium block">
                    {generatedConceptUrl ? (
                      <span className="text-primary flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        3D Toy
                      </span>
                    ) : (
                      <span>Original</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium block">{size[0]}cm</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Qty:</span>
                  <span className="font-medium block">{quantity}</span>
                </div>
                {quantity > 1 && (
                  <div className="text-green-600">
                    <span>Ship:</span>
                    <span className="font-medium block">FREE</span>
                  </div>
                )}
              </div>
            </div> */}

            {/* Customer Form - Smaller on mobile to fit everything */}
            {/* <div
              className="mb-3 h-[280px] md:h-[400px] w-full max-w-[320px] md:max-w-none mx-auto rounded-md border border-border bg-background overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <ScrollArea className="h-full w-full p-4">
                <div className="space-y-4 pr-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-[calc(100%-12px)] ml-1.5 bg-background/50 text-foreground font-mono ring-1 ring-border focus:ring-1 focus:ring-primary ring-offset-0 outline-none duration-300 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-primary/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="w-[calc(100%-12px)] ml-1.5 bg-background/50 text-foreground font-mono ring-1 ring-border focus:ring-1 focus:ring-primary ring-offset-0 outline-none duration-300 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-primary/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-[calc(100%-12px)] ml-1.5 bg-background/50 text-foreground font-mono ring-1 ring-border focus:ring-1 focus:ring-primary ring-offset-0 outline-none duration-300 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-primary/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      onFocus={() => setIsTextareaFocused(true)}
                      onBlur={() => setIsTextareaFocused(false)}
                      required
                      className="w-[calc(100%-12px)] ml-1.5 min-h-[80px] bg-background/50 text-foreground font-mono ring-1 ring-border focus:ring-1 focus:ring-primary ring-offset-0 outline-none duration-300 rounded-3xl px-4 py-3 shadow-md focus:shadow-lg focus:shadow-primary/50"
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>

            // Fixed consent and buttons on mobile
            <div className="md:relative md:mt-0 mt-4">
              <p className="text-xs text-muted-foreground mb-4 text-center max-w-[320px] md:max-w-none mx-auto">
                By submitting your order, you agree to our{" "}
                <button
                  onClick={() => setTermsOpen(true)}
                  className="underline hover:text-foreground transition-colors"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="underline hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </button>
                .
              </p>

              <div className="flex gap-3 items-center justify-center">
                <Button
                  onClick={() => {
                    setDirection("backward");
                    setStep(4);
                  }}
                  size="lg"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <ChevronUp className="w-5 h-5" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-[150px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Order"
                  )}
                </Button>
              </div>
            </div>
          </div> */}

          {/* Step 7: Order Confirmation */}
          {/* <div
            className={`transition-opacity transition-transform duration-500 ease-in-out w-full left-1/2 -translate-x-1/2 ${
              step === 7
                ? "opacity-100 translate-y-0 relative"
                : direction === "forward"
                ? "opacity-0 translate-y-10 absolute pointer-events-none"
                : "opacity-0 -translate-y-10 absolute pointer-events-none"
            }`}
          >
            <div
              className="h-[calc(100vh-200px)] md:h-auto overflow-y-auto md:overflow-visible overscroll-contain px-[6px] md:px-0 flex flex-col items-center pb-24 md:pb-8"
              onWheel={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary font-inter">
                Order Confirmed!
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-md text-center">
                Thank you, {customerName}! We're excited to bring your drawing
                to life.
              </p> */}

              {/* Two Column Layout for Order Details and Next Steps */}
              {/* <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                // Order Details
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-base mb-3 text-foreground">
                    Your Order Details
                  </h3>
                  {uploadedImage && (
                    <div className="mb-3">
                      <img
                        src={uploadedImage}
                        alt="Your drawing"
                        className="w-full h-32 object-contain rounded-lg bg-muted"
                      />
                    </div>
                  )}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium text-foreground truncate ml-2">
                        {file?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium text-foreground">
                        {size[0]} cm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium text-foreground">
                        {quantity}
                      </span>
                    </div>
                    {quantity > 1 && (
                      <div className="flex justify-between text-green-600">
                        <span>Shipping:</span>
                        <span className="font-medium">FREE</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground mb-1">Delivery to:</p>
                      <p className="text-foreground line-clamp-2">
                        {deliveryAddress}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground mb-1">Description:</p>
                      <p className="text-foreground line-clamp-3">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>

                // Next Steps
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-base mb-3 text-foreground text-left">
                    What Happens Next?
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Email Confirmation Sent
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Review 3D Preview & Pay
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          We Create Your Toy
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs">
                        4
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Shipped to Your Door
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBackToHome}
                size="lg"
                className="w-full max-w-sm"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* 3D Model - Two thirds of screen */}
      {/* <div className="h-[66vh] w-full fixed bottom-0 left-0 z-0">
        <spline-viewer
          url="https://prod.spline.design/SYopen3qbPaD4-82/scene.splinecode"
          className="w-full h-full"
        />
      </div> */}

      {/* Footer Space - Reserved for copyright */}
      <div className="fixed bottom-2 left-8 right-8 z-[60] h-6 md:h-10 flex items-center justify-center pointer-events-auto">
        <div className="text-center text-xs md:text-sm text-foreground/70">
          <p className="text-xs">© 2025 BuzzyMuzzy. All rights reserved.</p>
        </div>
      </div>

      {/* Edit Description Dialog */}
      <Dialog
        open={isEditingDescription}
        onOpenChange={setIsEditingDescription}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Image Description</DialogTitle>
            <DialogDescription>
              Review and edit the AI-generated description of your drawing
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-1">
            <Textarea
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              placeholder="My drawing shows a friendly monster with big eyes and a smile..."
              className="min-h-[300px] resize-none text-left"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              onClick={() => setIsEditingDescription(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegenerateConcept}
              variant="secondary"
              disabled={isGeneratingConcept || !uploadedImage}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Regenerate Toy
            </Button>
            <Button
              onClick={() => {
                setDescription(tempDescription);
                setIsEditingDescription(false);
                toast({
                  title: "Description updated",
                  description: "Your changes have been saved.",
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      {/* <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-[85vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="font-semibold text-foreground">
                Alpha Testing Notice
              </p>
              <p className="text-muted-foreground mt-1">
                BuzzyMuzzy is currently in alpha testing phase. This privacy
                policy may be updated as our service evolves.
              </p>
            </div>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                1. Company Information
              </h3>
              <p className="text-muted-foreground">
                BuzzyMuzzy (unregistered, alpha testing phase)
                <br />
                Based in London, United Kingdom
                <br />
                Email: support@buzzymuzzy.com
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                2. Data We Collect
              </h3>
              <p className="text-muted-foreground mb-2">
                We only collect the following information necessary to fulfill
                your custom toy order:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Your name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Delivery address</li>
                <li>Drawing uploads (images you submit for toy creation)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                3. How We Use Your Data
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>
                  <strong>Order Fulfillment:</strong> To create and deliver your
                  custom toy
                </li>
                <li>
                  <strong>Customer Communication:</strong> To update you about
                  your order status
                </li>
                <li>
                  <strong>Marketing:</strong> Your submitted drawings may be
                  used in our advertisements and marketing materials
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">4. Cookies</h3>
              <p className="text-muted-foreground">
                BuzzyMuzzy does not use cookies directly. However, the Lovable
                platform hosting our service may use analytics cookies to
                improve performance.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                5. Data Storage & Security
              </h3>
              <p className="text-muted-foreground">
                Your data is securely stored using Lovable Cloud/Supabase
                infrastructure. We implement industry-standard security measures
                to protect your information.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                6. Third-Party Services
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>
                  <strong>Stripe:</strong> For secure payment processing
                </li>
                <li>
                  <strong>Resend:</strong> For sending order confirmation and
                  update emails
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                7. Your Rights (UK GDPR & EU Compliance)
              </h3>
              <p className="text-muted-foreground mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                To exercise these rights, contact us at support@buzzymuzzy.com
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                8. Data Retention
              </h3>
              <p className="text-muted-foreground">
                We retain your order data and drawings for as long as necessary
                to fulfill orders, handle refunds (up to 30 days), and maintain
                business records. You may request deletion at any time by
                contacting support@buzzymuzzy.com
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                9. Contact Us
              </h3>
              <p className="text-muted-foreground">
                For any privacy-related questions or concerns, please contact us
                at:
                <br />
                Email: support@buzzymuzzy.com
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Terms of Service Dialog */}
      {/* <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto w-[85vw] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="font-semibold text-foreground">
                Alpha Testing Notice
              </p>
              <p className="text-muted-foreground mt-1">
                BuzzyMuzzy is currently in alpha testing phase. Our service,
                pricing, and terms may change as we develop and improve the
                platform.
              </p>
            </div>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                1. Service Description
              </h3>
              <p className="text-muted-foreground">
                BuzzyMuzzy provides a custom toy creation service where
                customers upload drawings that we transform into 3D-printed
                physical toys. By using our service, you agree to these terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                2. User Responsibilities
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Provide accurate contact and delivery information</li>
                <li>Own or have rights to use the drawings you submit</li>
                <li>
                  Ensure drawings do not contain offensive, illegal, or
                  inappropriate content
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                3. Intellectual Property Rights
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>
                  <strong>Your Drawing:</strong> You retain ownership of the
                  original drawing you submit
                </li>
                <li>
                  <strong>3D Model & Physical Toy:</strong> BuzzyMuzzy owns all
                  rights to the 3D model we create and the physical printed toy
                </li>
                <li>
                  <strong>Marketing Usage:</strong> By submitting your drawing,
                  you grant BuzzyMuzzy permission to use it in our
                  advertisements, marketing materials, and promotional content
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                4. Pricing & Payment
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>Upfront Payment:</strong> All orders must be paid in
                full before production begins via Stripe payment processing.
              </p>
              <p className="text-muted-foreground">
                Prices are displayed before checkout and include the toy
                creation cost. Shipping costs are additional and calculated
                based on delivery location and quantity.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                5. Production & Timeline
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>
                  <strong>Typical Production Time:</strong> 3 days from order
                  confirmation
                </li>
                <li>
                  <strong>Shipping:</strong> Delivery time depends on your
                  location and is added to production time
                </li>
                <li>
                  <strong>No Guarantee:</strong> We do not guarantee specific
                  delivery dates
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                6. Design Modifications
              </h3>
              <p className="text-muted-foreground">
                BuzzyMuzzy reserves the right to modify your drawing design
                during the 3D modeling process to ensure:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Structural durability and stability</li>
                <li>Aesthetic quality and printability</li>
                <li>Safety standards compliance</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                7. No Exact Match Guarantee
              </h3>
              <p className="text-muted-foreground">
                Due to limitations in 3D modeling and printing technology, the
                final physical toy may not exactly match your original drawing.
                We strive for the best representation possible while maintaining
                quality and safety.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                8. Refund Policy
              </h3>
              <p className="text-muted-foreground mb-2">
                <strong>Customer Satisfaction:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>
                  You may request a refund within 30 days of placing your order
                  if you are not satisfied with the product
                </li>
              </ul>
              <p className="text-muted-foreground mt-2 mb-2">
                <strong>Shipping Damage:</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>
                  We do not guarantee refunds for products damaged during
                  shipping
                </li>
                <li>
                  Refunds or replacements for shipping damage are at
                  BuzzyMuzzy's discretion
                </li>
                <li>
                  We recommend contacting us immediately if your toy arrives
                  damaged
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                9. Shipping
              </h3>
              <p className="text-muted-foreground">
                Customers are responsible for shipping costs unless ordering
                multiple items, which may qualify for reduced or free shipping
                based on our current promotions.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                10. Limitation of Liability
              </h3>
              <p className="text-muted-foreground">
                BuzzyMuzzy is not liable for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Damage occurring during shipping beyond our control</li>
                <li>Minor variations between your drawing and the final toy</li>
                <li>
                  Delays in production or delivery beyond typical timelines
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                11. Governing Law
              </h3>
              <p className="text-muted-foreground">
                These terms are governed by the laws of the United Kingdom. Any
                disputes will be subject to the exclusive jurisdiction of the
                courts in London, UK.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                12. Contact Information
              </h3>
              <p className="text-muted-foreground">
                For questions about these terms, please contact us at:
                <br />
                Email: support@buzzymuzzy.com
                <br />
                Location: London, United Kingdom
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">
                13. Changes to Terms
              </h3>
              <p className="text-muted-foreground">
                As an alpha service, we may update these terms at any time.
                Continued use of our service after changes constitutes
                acceptance of the new terms.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Description Dialog */}
      {/* <Dialog
        open={showDescriptionDialog}
        onOpenChange={setShowDescriptionDialog}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Toy Description</DialogTitle>
            <DialogDescription>
              Edit the description for your 3D toy concept
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[200px]"
              placeholder="Describe your toy..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDescriptionDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowDescriptionDialog(false)}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};
