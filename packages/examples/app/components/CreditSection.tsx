import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Droplets } from "lucide-react";
import { use0gBalance } from "0g-wagmi";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useToast } from "@/hooks/use-toast";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";

export function CreditSection() {
  const { isConnected } = useAccount();
  const { balance } = use0gBalance();
  const { toast } = useToast();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  const handleFaucet = async () => {
    toast({
      title: "Faucet Request",
      description: "Faucet feature coming soon!",
    });
  };

  return (
    <>
      <Card className="mb-8">
        <CardContent className="pt-6">
          {isConnected ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">0G</span>
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
                  onClick={() => setShowDepositModal(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Deposit</span>
                </Button>
                <Button
                  className="hover:cursor-pointer flex-1 sm:flex-initial"
                  onClick={() => setShowWithdrawModal(true)}
                  size="sm"
                >
                  <Minus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Withdraw</span>
                </Button>
                <Button
                  className="hover:cursor-pointer flex-1 sm:flex-initial"
                  onClick={handleFaucet}
                  size="sm"
                >
                  <Droplets className="h-4 w-4 mr-1 sm:mr-2" />
                  <span>Faucet</span>
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

      {showDepositModal && (
        <DepositModal onClose={() => setShowDepositModal(false)} />
      )}

      {showWithdrawModal && (
        <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
      )}
    </>
  );
}