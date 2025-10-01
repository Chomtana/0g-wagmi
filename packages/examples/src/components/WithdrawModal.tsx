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
import { use0gBalance, use0gWithdrawFunds } from "0g-wagmi";
import { formatEther } from "viem";
import { useToast } from "@/hooks/use-toast";

interface WithdrawModalProps {
  onClose: () => void;
}

export function WithdrawModal({ onClose }: WithdrawModalProps) {
  const { balance } = use0gBalance();
  const { withdrawFunds } = use0gWithdrawFunds();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  const handleWithdraw = async () => {
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
      await withdrawFunds(amount);
      toast({
        title: "Success!",
        description: `Withdrew ${amount} OG from your 0G balance`,
      });
      setAmount("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw funds",
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
          <CardTitle>Withdraw Funds</CardTitle>
          <CardDescription>
            Transfer OG from 0G credit to your wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">0G Credit</label>
            <p className="text-lg font-semibold">
              {formatBalance(balance?.availableBalance)} OG
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
              Available: {formatBalance(balance?.availableBalance)} OG
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleWithdraw} 
              className="flex-1 hover:cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Withdrawing..." : "Withdraw"}
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
