import { useState } from "react";
import { Brain, Upload, Database, Key } from "lucide-react";
import { ConnectButton } from "@/components/ConnectButton";
import { CreditSection } from "@/components/CreditSection";
import { ModelsSection } from "@/components/ModelsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tab = "inference" | "storage" | "key-value";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("inference");
  const [storageTab, setStorageTab] = useState<"upload" | "download">("upload");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold">
              0g-wagmi <span className="hidden sm:inline">Demo</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <appkit-network-button />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 border-b">
          <button
            onClick={() => setActiveTab("inference")}
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
          </button>
          <button
            onClick={() => setActiveTab("storage")}
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
          </button>
          <button
            onClick={() => setActiveTab("key-value")}
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
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "inference" && (
          <>
            <CreditSection />
            <ModelsSection />
          </>
        )}

        {activeTab === "storage" && (
          <div className="space-y-6">
            {/* Storage Sub-tabs */}
            <div className="flex space-x-2 border-b">
              <button
                onClick={() => setStorageTab("upload")}
                className={`px-4 py-2 font-medium transition-colors hover:cursor-pointer ${
                  storageTab === "upload"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setStorageTab("download")}
                className={`px-4 py-2 font-medium transition-colors hover:cursor-pointer ${
                  storageTab === "download"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Download
              </button>
            </div>

            {storageTab === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>File Upload</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input id="file-upload" type="file" className="mt-2" />
                  </div>
                  <Button
                    onClick={() => window.alert("Coming Soon")}
                    className="hover:cursor-pointer"
                  >
                    Upload
                  </Button>
                </CardContent>
              </Card>
            )}

            {storageTab === "download" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>File Download</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="merkle-root">Merkle Root Hash</Label>
                    <Input
                      id="merkle-root"
                      type="text"
                      placeholder="Enter merkle root hash..."
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={() => window.alert("Coming Soon")}
                    className="hover:cursor-pointer"
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "key-value" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Key-Value Store</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="kv-key">Key</Label>
                <Input
                  id="kv-key"
                  type="text"
                  placeholder="Enter key..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="kv-value">Value</Label>
                <Input
                  id="kv-value"
                  type="text"
                  placeholder="Enter value..."
                  className="mt-2"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => window.alert("Coming Soon")}
                  className="hover:cursor-pointer"
                >
                  Set
                </Button>
                <Button
                  onClick={() => window.alert("Coming Soon")}
                  variant="outline"
                  className="hover:cursor-pointer"
                >
                  Get
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
