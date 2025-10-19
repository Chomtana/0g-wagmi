import { Brain, Upload, Database, Key } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ConnectButton } from "@/components/ConnectButton";

export function PageHeader() {
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === "/inference" || location.pathname === "/") return "inference";
    if (location.pathname === "/storage") return "storage";
    if (location.pathname === "/key-value") return "key-value";
    return "";
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 hover:cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold">
                0g-wagmi <span className="hidden sm:inline">Demo</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <appkit-network-button />
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            <Link
              to="/inference"
              className={`px-4 py-2 font-medium transition-colors hover:cursor-pointer ${
                activeTab === "inference"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Inference</span>
              </div>
            </Link>
            <Link
              to="/storage"
              className={`px-4 py-2 font-medium transition-colors hover:cursor-pointer ${
                activeTab === "storage"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Storage</span>
              </div>
            </Link>
            <Link
              to="/key-value"
              className={`px-4 py-2 font-medium transition-colors hover:cursor-pointer ${
                activeTab === "key-value"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Key-Value</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
