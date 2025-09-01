import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Copy, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { use0gInferenceBalance } from "0g-wagmi";
import { formatEther } from "viem";

interface Model {
  id: number;
  name: string;
  provider: string;
  inputPrice: string;
  outputPrice: string;
}

interface ModelCardProps {
  model: Model;
  onUseModel: (model: Model) => void;
  onAddCredit: (model: Model) => void;
}

export function ModelCard({ model, onUseModel, onAddCredit }: ModelCardProps) {
  const { toast } = useToast();
  const { balance: allocatedCredit, isLoading: balanceLoading } =
    use0gInferenceBalance(model.provider);

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

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(formatEther(balance)).toFixed(4);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">{model.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Provider Address
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono bg-muted py-1">
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

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Allocated Credit
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-primary">
              {balanceLoading
                ? "Loading..."
                : `${formatBalance(allocatedCredit?.availableBalance)} OG`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:cursor-pointer"
              onClick={() => onAddCredit(model)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Input Price
            </p>
            <p className="text-lg font-bold text-primary">
              {model.inputPrice} OG
            </p>
            <p className="text-xs text-muted-foreground">per 1M tokens</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Output Price
            </p>
            <p className="text-lg font-bold text-primary">
              {model.outputPrice} OG
            </p>
            <p className="text-xs text-muted-foreground">per 1M tokens</p>
          </div>
        </div>

        <Button
          className="w-full hover:cursor-pointer"
          size="sm"
          onClick={() => onUseModel(model)}
        >
          Use Model
        </Button>
      </CardContent>
    </Card>
  );
}
