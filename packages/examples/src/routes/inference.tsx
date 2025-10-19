import { PageHeader } from "@/components/PageHeader";
import { CreditSection } from "@/components/CreditSection";
import { ModelsSection } from "@/components/ModelsSection";

export default function InferencePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <main className="container max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <CreditSection />
        <ModelsSection />
      </main>
    </div>
  );
}
