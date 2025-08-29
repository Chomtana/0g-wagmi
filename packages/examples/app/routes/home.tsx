"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  Minus,
  Droplets,
  Cpu,
  Zap,
  Brain,
  Copy,
} from "lucide-react";
import { use0gBalance, use0gAddFunds, use0gWithdrawFunds } from "0g-wagmi";
import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useToast } from "@/hooks/use-toast";
import { ConnectButton } from "@/components/ConnectButton";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "0g-wagmi Demo" },
    {
      name: "description",
      content: "AI Model Marketplace powered by 0G Network",
    },
  ];
}

export default function AIMarketplacePage() {
  const { address, isConnected } = useAccount();
  const { balance } = use0gBalance();
  const { addFunds } = use0gAddFunds();
  const { withdrawFunds } = use0gWithdrawFunds();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Models");
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const truncateAddress = (address: string) => {
    if (address.length <= 14) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleAddFunds = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      await addFunds(addAmount);
      toast({
        title: "Success!",
        description: `Added ${addAmount} OG to your balance`,
      });
      setAddAmount("");
      setShowAddModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds",
        variant: "destructive",
      });
    }
  };

  const handleWithdrawFunds = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    try {
      await withdrawFunds(withdrawAmount);
      toast({
        title: "Success!",
        description: `Withdrew ${withdrawAmount} OG from your balance`,
      });
      setWithdrawAmount("");
      setShowWithdrawModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw funds",
        variant: "destructive",
      });
    }
  };

  const handleFaucet = async () => {
    toast({
      title: "Faucet Request",
      description: "Faucet feature coming soon!",
    });
  };

  const mockModels = [
    {
      id: 1,
      name: "GPT-4 Turbo",
      provider: "0x742d35Cc6634C0532925a3b8D404fddF4b34c451",
      inputPrice: "0.01",
      outputPrice: "0.03",
      category: "Language Model",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      id: 2,
      name: "Claude-3 Opus",
      provider: "0x8ba1f109551bD432803012645Hac136c0532925",
      inputPrice: "0.015",
      outputPrice: "0.075",
      category: "Language Model",
      icon: <Cpu className="h-6 w-6" />,
    },
    {
      id: 3,
      name: "DALL-E 3",
      provider: "0x123abc456def789ghi012jkl345mno678pqr901",
      inputPrice: "0.04",
      outputPrice: "0.08",
      category: "Image Generation",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      id: 4,
      name: "Whisper Large",
      provider: "0x987fed654cba321hgf098lkj765nmo432rqp109",
      inputPrice: "0.006",
      outputPrice: "0.006",
      category: "Audio Processing",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      id: 5,
      name: "CodeLlama 70B",
      provider: "0x456def789abc012ghi345jkl678mno901pqr234",
      inputPrice: "0.008",
      outputPrice: "0.016",
      category: "Code Generation",
      icon: <Cpu className="h-6 w-6" />,
    },
    {
      id: 6,
      name: "Stable Diffusion XL",
      provider: "0x789ghi012def345abc678jkl901mno234pqr567",
      inputPrice: "0.02",
      outputPrice: "0.04",
      category: "Image Generation",
      icon: <Zap className="h-6 w-6" />,
    },
  ];

  const filteredModels = mockModels.filter((model) => {
    const matchesSearch = model.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Models" ||
      (selectedCategory === "Language" &&
        model.category === "Language Model") ||
      (selectedCategory === "Image" && model.category === "Image Generation") ||
      (selectedCategory === "Audio" && model.category === "Audio Processing");
    return matchesSearch && matchesCategory;
  });

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return +parseFloat(formatEther(balance)).toFixed(4);
  };

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
          <ConnectButton />
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Credit Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            {isConnected ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-lg font-bold text-primary">OG</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Available Credit
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">
                      {formatBalance(balance?.availableBalance)} OG
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <Button
                    className="hover:cursor-pointer flex-1 sm:flex-initial"
                    onClick={() => setShowAddModal(true)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                  <Button
                    className="hover:cursor-pointer flex-1 sm:flex-initial"
                    onClick={() => setShowWithdrawModal(true)}
                    size="sm"
                  >
                    <Minus className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Withdraw</span>
                    <span className="sm:hidden">Withdraw</span>
                  </Button>
                  <Button
                    className="hover:cursor-pointer flex-1 sm:flex-initial"
                    onClick={handleFaucet}
                    size="sm"
                  >
                    <Droplets className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Faucet</span>
                    <span className="sm:hidden">Faucet</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Connect your wallet to view balance and manage 0G tokens
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Funds Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Funds</CardTitle>
                <CardDescription>Add 0G tokens to your balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (0G)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddFunds} className="flex-1">
                    Add Funds
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Withdraw Funds Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Withdraw 0G tokens from your balance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (0G)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: {formatBalance(balance?.availableBalance)} 0G
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleWithdrawFunds} className="flex-1">
                    Withdraw
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search AI models..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={
                  selectedCategory === "All Models" ? "secondary" : "outline"
                }
                className="hover:cursor-pointer hover:bg-accent text-xs sm:text-sm"
                onClick={() => setSelectedCategory("All Models")}
              >
                All Models
              </Badge>
              <Badge
                variant={
                  selectedCategory === "Language" ? "secondary" : "outline"
                }
                className="hover:cursor-pointer hover:bg-accent text-xs sm:text-sm"
                onClick={() => setSelectedCategory("Language")}
              >
                Language
              </Badge>
              <Badge
                variant={selectedCategory === "Image" ? "secondary" : "outline"}
                className="hover:cursor-pointer hover:bg-accent text-xs sm:text-sm"
                onClick={() => setSelectedCategory("Image")}
              >
                Image
              </Badge>
              <Badge
                variant={selectedCategory === "Audio" ? "secondary" : "outline"}
                className="hover:cursor-pointer hover:bg-accent text-xs sm:text-sm"
                onClick={() => setSelectedCategory("Audio")}
              >
                Audio
              </Badge>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-balance">Available Models</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <Card
                key={model.id}
                className="hover:shadow-lg transition-shadow hover:cursor-pointer"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {model.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {model.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Provider Address
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {truncateAddress(model.provider)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:cursor-pointer"
                        onClick={() => copyToClipboard(model.provider)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Input Price
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {model.inputPrice} 0G
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per 1K tokens
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Output Price
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {model.outputPrice} 0G
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per 1K tokens
                      </p>
                    </div>
                  </div>

                  <Button className="w-full hover:cursor-pointer" size="sm">
                    Use Model
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
