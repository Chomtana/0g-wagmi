import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Zap, Brain, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockModels = [
  {
    id: 1,
    name: "GPT-4 Turbo",
    provider: "0x742d35Cc6634C0532925a3b8D404fddF4b34c451",
    inputPrice: "0.01",
    outputPrice: "0.03",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    id: 2,
    name: "Claude-3 Opus",
    provider: "0x8ba1f109551bD432803012645Hac136c0532925",
    inputPrice: "0.015",
    outputPrice: "0.075",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    id: 3,
    name: "DALL-E 3",
    provider: "0x123abc456def789ghi012jkl345mno678pqr901",
    inputPrice: "0.04",
    outputPrice: "0.08",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: 4,
    name: "Whisper Large",
    provider: "0x987fed654cba321hgf098lkj765nmo432rqp109",
    inputPrice: "0.006",
    outputPrice: "0.006",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    id: 5,
    name: "CodeLlama 70B",
    provider: "0x456def789abc012ghi345jkl678mno901pqr234",
    inputPrice: "0.008",
    outputPrice: "0.016",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    id: 6,
    name: "Stable Diffusion XL",
    provider: "0x789ghi012def345abc678jkl901mno234pqr567",
    inputPrice: "0.02",
    outputPrice: "0.04",
    icon: <Zap className="h-6 w-6" />,
  },
];

export function ModelsSection() {
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-balance">Available Models</h2>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {mockModels.map((model) => (
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
                    {model.inputPrice} OG
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
                    {model.outputPrice} OG
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
  );
}