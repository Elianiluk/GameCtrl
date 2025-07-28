
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Package, ShoppingCart, User, Gamepad2, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "All Controllers",
    url: createPageUrl("Products"),
    icon: Package,
  },
  {
    title: "Cart",
    url: createPageUrl("Cart"),
    icon: ShoppingCart,
  },
];

// IMPORTANT: This is a placeholder/mock for CartItem to make the file functional.
// In a real application, CartItem would typically be an imported API client,
// an ORM model, or a utility for managing cart data (e.g., in local storage or a database).
// For demonstration purposes, this mock simulates fetching cart items.
const CartItem = {
  /**
   * Simulates filtering cart items based on a user session.
   * In a real application, this would fetch data from a backend or persistent storage.
   * For this mock, it returns a hardcoded array of items.
   * To make it more dynamic for testing, you could uncomment the localStorage part
   * and simulate adding items to localStorage somewhere else in your app.
   */
  filter: async ({ user_session }) => {
    // Simulate an async API call delay
    await new Promise(resolve => setTimeout(resolve, 50));

    // Example mock data
    // In a real scenario, you might retrieve from localStorage or an API
    if (user_session === "test_session_123") {
      return [
        { id: "p1", quantity: 2, productId: "abc" },
        { id: "p2", quantity: 1, productId: "def" },
      ];
    }
    // If no specific session, return empty or a default set
    return [];
  },
};


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      // In a real application, this 'cart_session' might come from
      // user authentication, a unique browser ID, or a persistent cookie.
      // For this example, we're using a simple string.
      const session = localStorage.getItem('cart_session') || "test_session_123"; // Using a default if not set
      if (session) {
        // Assume CartItem.filter returns an array of cart item objects, each with a 'quantity' property
        const items = await CartItem.filter({ user_session: session });
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error("Error loading cart count:", error);
      // Optionally set cartCount to 0 or handle error display
      setCartCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style>
        {`
          :root {
            --primary: 59 130 246;
            --primary-foreground: 255 255 255;
            --background: 15 23 42;
            --foreground: 248 250 252;
            --card: 30 41 59;
            --card-foreground: 248 250 252;
            --accent: 99 102 241;
            --accent-foreground: 255 255 255;
            --muted: 51 65 85;
            --muted-foreground: 148 163 184;
            --border: 51 65 85;
          }
          
          .glass-effect {
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(148, 163, 184, 0.1);
          }
          
          .glow-effect {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          
          .text-gradient {
            background: linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>
      
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <Sidebar className="border-r border-slate-700/50 glass-effect">
            <SidebarHeader className="border-b border-slate-700/50 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow-effect">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">GameCtrl</h2>
                  <p className="text-xs text-slate-400">Premium Controllers</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-300 rounded-lg p-3 ${
                            location.pathname === item.url ? 'bg-slate-700/50 text-blue-400 glow-effect' : 'text-slate-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                            {item.title === "Cart" && cartCount > 0 && (
                              <Badge className="ml-auto bg-blue-500 text-white">{cartCount}</Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <div className="mt-8 p-4 glass-effect rounded-lg">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Shop by Brand</h3>
                <div className="space-y-2">
                  {["Xbox", "PlayStation", "Nintendo", "Razer"].map((brand) => (
                    <Link
                      key={brand}
                      to={createPageUrl(`Products?brand=${brand}`)}
                      className="block w-full text-left text-sm text-slate-400 hover:text-blue-400 transition-colors p-1 rounded-md"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="glass-effect border-b border-slate-700/50 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-slate-700/50 p-2 rounded-lg transition-colors duration-200 text-white">
                  <Menu className="w-5 h-5" />
                </SidebarTrigger>
                <h1 className="text-xl font-bold text-white">GameCtrl</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
