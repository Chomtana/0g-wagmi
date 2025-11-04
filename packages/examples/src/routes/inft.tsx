import { useState } from "react";
import { Sparkles, CheckCircle, AlertCircle, Image as ImageIcon, Zap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { use0gInftMint, use0gInftList, use0gInftMetadata, saveInftToStorage, InftMetadata } from "0g-wagmi";
import { useAccount } from "wagmi";

export default function InftPage() {
  const { isConnected, address } = useAccount();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Selected iNFT for viewing
  const [selectedInft, setSelectedInft] = useState<string | null>(null);

  // Initialize the 0G iNFT mint hook
  const {
    mint,
    isLoading: isMinting,
    isSuccess: isMintSuccess,
    isError: isMintError,
    error: mintError,
    data: mintData,
    reset: resetMint,
  } = use0gInftMint({
    onSuccess: (data) => {
      console.log("iNFT minted successfully:", data);
      // Save to localStorage for demo purposes
      if (address) {
        saveInftToStorage({
          tokenId: data.tokenId,
          metadataHash: data.metadataHash,
          owner: address,
          mintedAt: Date.now(),
          txHash: data.txHash,
        });
      }
      // Refetch the list
      refetchInfts();
      // Reset form
      setName("");
      setDescription("");
      setAiModel("");
      setImageUrl("");
    },
    onError: (err) => {
      console.error("Minting failed:", err);
    },
  });

  // List user's iNFTs
  const { infts, isLoading: isLoadingList, refetch: refetchInfts } = use0gInftList({
    enabled: isConnected,
  });

  // Get metadata for selected iNFT
  const { data: metadata, isLoading: isLoadingMetadata } = use0gInftMetadata({
    metadataHash: selectedInft || undefined,
    enabled: !!selectedInft,
  });

  // Handle minting
  const handleMint = async () => {
    if (!name.trim() || !description.trim()) {
      window.alert("Please provide at least name and description");
      return;
    }

    if (!isConnected) {
      window.alert("Please connect your wallet first");
      return;
    }

    const metadata: InftMetadata = {
      name: name.trim(),
      description: description.trim(),
      ...(imageUrl.trim() && { image: imageUrl.trim() }),
      ...(aiModel.trim() && {
        aiModel: aiModel.trim(),
        modelWeights: "ipfs://example-weights-hash",
        configuration: {
          type: "language-model",
          parameters: 7000000000,
        },
      }),
      attributes: [
        { trait_type: "Type", value: "AI Agent" },
        { trait_type: "Network", value: "0G Testnet" },
      ],
    };

    try {
      resetMint();
      await mint(metadata);
    } catch (err) {
      console.error("Mint error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <main className="container max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <div className="space-y-6">
          {/* Introduction Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>Intelligent NFTs (iNFTs)</span>
              </CardTitle>
              <CardDescription>
                Create and manage AI-powered NFTs on 0G Network with encrypted metadata storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  iNFTs combine NFT ownership with AI intelligence, using 0G Storage for encrypted
                  metadata and 0G Compute for AI inference. Each iNFT can represent:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>AI agents with unique personalities and capabilities</li>
                  <li>Trained models with preserved weights and configurations</li>
                  <li>Intelligent digital assets with evolving behaviors</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Mint iNFT Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Mint iNFT</span>
              </CardTitle>
              <CardDescription>
                Create a new intelligent NFT with encrypted AI metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nft-name">Name *</Label>
                  <Input
                    id="nft-name"
                    type="text"
                    placeholder="My AI Agent"
                    className="mt-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isMinting}
                  />
                </div>

                <div>
                  <Label htmlFor="ai-model">AI Model (Optional)</Label>
                  <Input
                    id="ai-model"
                    type="text"
                    placeholder="GPT-4, LLaMA, etc."
                    className="mt-2"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    disabled={isMinting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nft-description">Description *</Label>
                <textarea
                  id="nft-description"
                  placeholder="Describe your AI agent's capabilities and personality..."
                  className="mt-2 w-full px-3 py-2 bg-background border border-input rounded-md resize-none"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isMinting}
                />
              </div>

              <div>
                <Label htmlFor="image-url">Image URL (Optional)</Label>
                <Input
                  id="image-url"
                  type="text"
                  placeholder="https://example.com/image.png"
                  className="mt-2"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isMinting}
                />
              </div>

              <Button
                onClick={handleMint}
                className="hover:cursor-pointer w-full md:w-auto"
                disabled={!name || !description || isMinting || !isConnected}
              >
                {isMinting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Minting iNFT...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Mint iNFT
                  </>
                )}
              </Button>

              {!isConnected && (
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  ⚠️ Please connect your wallet to mint iNFTs
                </p>
              )}

              {isMintSuccess && mintData && (
                <div className="p-4 bg-green-950 border border-green-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">iNFT Minted Successfully!</span>
                  </div>
                  <div className="space-y-1 text-sm text-green-300">
                    <div>
                      <span className="font-medium">Token ID:</span>
                      <code className="ml-2 px-2 py-1 bg-green-900 rounded text-xs text-green-200">
                        {mintData.tokenId}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Metadata Hash:</span>
                      <code className="ml-2 px-2 py-1 bg-green-900 rounded text-xs break-all text-green-200">
                        {mintData.metadataHash}
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {isMintError && mintError && (
                <div className="p-4 bg-red-950 border border-red-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Minting Failed</span>
                  </div>
                  <p className="text-sm text-red-300">{mintError.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My iNFTs Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>My iNFTs</span>
                <Badge variant="secondary">{infts.length}</Badge>
              </CardTitle>
              <CardDescription>
                Your collection of intelligent NFTs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to view your iNFTs
                </p>
              ) : isLoadingList ? (
                <p className="text-sm text-muted-foreground">Loading iNFTs...</p>
              ) : infts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You don't have any iNFTs yet. Mint one above to get started!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {infts.map((inft) => (
                    <Card
                      key={inft.tokenId}
                      className="hover:border-primary transition-colors hover:cursor-pointer"
                      onClick={() => setSelectedInft(inft.metadataHash)}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">#{inft.tokenId}</span>
                            <Badge variant="outline">iNFT</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground break-all">
                            {inft.metadataHash.substring(0, 20)}...
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Minted: {new Date(inft.mintedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedInft && (
                <div className="mt-6 p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">iNFT Metadata</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInft(null)}
                      className="hover:cursor-pointer"
                    >
                      Close
                    </Button>
                  </div>

                  {isLoadingMetadata ? (
                    <p className="text-sm text-muted-foreground">Loading metadata...</p>
                  ) : metadata ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Name:</span>
                        <p className="mt-1">{metadata.name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="mt-1">{metadata.description}</p>
                      </div>
                      {metadata.aiModel && (
                        <div>
                          <span className="font-medium">AI Model:</span>
                          <p className="mt-1">{metadata.aiModel}</p>
                        </div>
                      )}
                      {metadata.image && (
                        <div>
                          <span className="font-medium">Image:</span>
                          <img
                            src={metadata.image}
                            alt={metadata.name}
                            className="mt-2 rounded-lg max-w-full h-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {metadata.attributes && metadata.attributes.length > 0 && (
                        <div>
                          <span className="font-medium">Attributes:</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {metadata.attributes.map((attr, idx) => (
                              <Badge key={idx} variant="secondary">
                                {attr.trait_type}: {attr.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-400">Failed to load metadata</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
