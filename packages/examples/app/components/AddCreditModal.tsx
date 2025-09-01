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
import { use0gBalance, use0gInferenceAddFunds } from "0g-wagmi";
import { useToast } from "@/hooks/use-toast";
import { formatEther } from "viem";
import { X } from "lucide-react";

interface AddCreditModalProps {
  modelName: string;
  providerAddress: string;
  onClose: () => void;
}

export function AddCreditModal({
  modelName,
  providerAddress,
  onClose,
}: AddCreditModalProps) {
  const { balance: availableCredit } = use0gBalance();
  const { addFunds, isLoading } = use0gInferenceAddFunds();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  const handleAddCredit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    const availableAmount = availableCredit
      ? parseFloat(formatEther(availableCredit.availableBalance))
      : 0;
    if (parseFloat(amount) > availableAmount) {
      toast({
        title: "Insufficient balance",
        description: "Amount exceeds your available credit",
        variant: "destructive",
      });
      return;
    }

    try {
      await addFunds(providerAddress, amount);
      toast({
        title: "Success!",
        description: `Added ${amount} OG credit to ${modelName}`,
      });
      setAmount("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add credit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Add Credit</CardTitle>
            <CardDescription>Allocate credit to {modelName}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:cursor-pointer"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Available Credit</label>
            <p className="text-lg font-semibold">
              {formatBalance(availableCredit?.availableBalance)} OG
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">
              Amount to Allocate (OG)
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available: {formatBalance(availableCredit?.availableBalance)} OG
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAddCredit}
              className="flex-1 hover:cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Credit"}
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
