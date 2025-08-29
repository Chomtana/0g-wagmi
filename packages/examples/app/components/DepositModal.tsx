import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { use0gAddFunds } from "0g-wagmi";
import { useToast } from "@/hooks/use-toast";

interface DepositModalProps {
  onClose: () => void;
}

export function DepositModal({ onClose }: DepositModalProps) {
  const { address } = useAccount();
  const { data: walletBalance } = useBalance({ address });
  const { addFunds } = use0gAddFunds();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addFunds(amount);
      toast({
        title: "Success!",
        description: `Added ${amount} OG to your 0G balance`,
      });
      setAmount("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Funds</CardTitle>
          <CardDescription>
            Transfer OG from your wallet to 0G credit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Wallet Balance</label>
            <p className="text-lg font-semibold">
              {formatBalance(walletBalance?.value)}{" "}
              {walletBalance?.symbol || "ETH"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Amount (OG)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available: {formatBalance(walletBalance?.value)} OG
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDeposit}
              className="flex-1 hover:cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Funds"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:cursor-pointer"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
