import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { use0gServices } from "0g-wagmi";
import { formatEther } from "viem";
import { ChatModal } from "@/components/ChatModal";
import { ModelCard } from "@/components/ModelCard";
import { AddCreditModal } from "@/components/AddCreditModal";

interface Model {
  id: number;
  name: string;
  provider: string;
  inputPrice: string;
  outputPrice: string;
}

// const mockModels: Model[] = [
//   {
//     id: 1,
//     name: "GPT-4 Turbo",
//     provider: "0x742d35Cc6634C0532925a3b8D404fddF4b34c451",
//     inputPrice: "0.01",
//     outputPrice: "0.03",
//   },
//   {
//     id: 2,
//     name: "Claude-3 Opus",
//     provider: "0x8ba1f109551bD432803012645Hac136c0532925",
//     inputPrice: "0.015",
//     outputPrice: "0.075",
//   },
//   {
//     id: 3,
//     name: "DALL-E 3",
//     provider: "0x123abc456def789ghi012jkl345mno678pqr901",
//     inputPrice: "0.04",
//     outputPrice: "0.08",
//   },
//   {
//     id: 4,
//     name: "Whisper Large",
//     provider: "0x987fed654cba321hgf098lkj765nmo432rqp109",
//     inputPrice: "0.006",
//     outputPrice: "0.006",
//   },
//   {
//     id: 5,
//     name: "CodeLlama 70B",
//     provider: "0x456def789abc012ghi345jkl678mno901pqr234",
//     inputPrice: "0.008",
//     outputPrice: "0.016",
//   },
//   {
//     id: 6,
//     name: "Stable Diffusion XL",
//     provider: "0x789ghi012def345abc678jkl901mno234pqr567",
//     inputPrice: "0.02",
//     outputPrice: "0.04",
//   },
// ];

export function ModelsSection() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [addCreditModel, setAddCreditModel] = useState<Model | null>(null);
  const { services, isLoading, error } = use0gServices();

  console.log(services, error, "services");

  useEffect(() => {
    setModels(
      services?.map((service, i) => ({
        id: i,
        name: service.model,
        provider: service.provider,
        inputPrice: (
          +parseFloat(formatEther(service.inputPrice, "gwei")).toFixed(4) / 1000
        ).toString(),
        outputPrice: (
          +parseFloat(formatEther(service.outputPrice, "gwei")).toFixed(4) /
          1000
        ).toString(),
      })) || []
    );
  }, [services]);

  const ModelSkeleton = () => (
    <div className="hover:shadow-lg transition-shadow p-6 border rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>

        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-1" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-balance">Available Models</h2>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <ModelSkeleton key={i} />)
          : models.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onUseModel={setSelectedModel}
                onAddCredit={setAddCreditModel}
              />
            ))}
      </div>

      {selectedModel && (
        <ChatModal
          modelName={selectedModel.name}
          providerAddress={selectedModel.provider}
          onClose={() => setSelectedModel(null)}
        />
      )}

      {addCreditModel && (
        <AddCreditModal
          modelName={addCreditModel.name}
          providerAddress={addCreditModel.provider}
          onClose={() => setAddCreditModel(null)}
        />
      )}
    </div>
  );
}
