import { Key } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function KeyValuePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <main className="container max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Key-Value Store</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="kv-key">Key</Label>
              <Input
                id="kv-key"
                type="text"
                placeholder="Enter key..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="kv-value">Value</Label>
              <Input
                id="kv-value"
                type="text"
                placeholder="Enter value..."
                className="mt-2"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => window.alert("Coming Soon")}
                className="hover:cursor-pointer"
              >
                Set
              </Button>
              <Button
                onClick={() => window.alert("Coming Soon")}
                variant="outline"
                className="hover:cursor-pointer"
              >
                Get
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
