import { Brain } from "lucide-react";
import { ConnectButton } from "@/components/ConnectButton";
import { CreditSection } from "@/components/CreditSection";
import { ModelsSection } from "@/components/ModelsSection";

export default function HomePage() {
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
        <CreditSection />
        <ModelsSection />
      </main>
    </div>
  );
}
