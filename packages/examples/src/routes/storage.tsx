import { useState } from "react";
import { Upload, Database, CheckCircle, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { use0gStorageUpload } from "0g-wagmi";
import { useAccount } from "wagmi";

export default function StoragePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isConnected } = useAccount();

  // Initialize the 0G storage upload hook
  const {
    upload,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    reset,
  } = use0gStorageUpload({
    onSuccess: (uploadData) => {
      console.log("Upload successful:", uploadData);
    },
    onError: (err) => {
      console.error("Upload failed:", err);
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      reset(); // Reset previous upload state when new file is selected
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      window.alert("Please select a file first");
      return;
    }

    if (!isConnected) {
      window.alert("Please connect your wallet first");
      return;
    }

    try {
      await upload(selectedFile);
    } catch (err) {
      // Error is already handled by onError callback
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <main className="container max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>File Upload</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  className="mt-2 hover:cursor-pointer"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                className="hover:cursor-pointer"
                disabled={!selectedFile || isLoading || !isConnected}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Uploading...
                  </>
                ) : (
                  "Upload to 0G Network"
                )}
              </Button>

              {!isConnected && (
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  ⚠️ Please connect your wallet to upload files
                </p>
              )}

              {isSuccess && data && (
                <div className="p-4 bg-green-950 border border-green-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Upload Successful!</span>
                  </div>
                  <div className="space-y-1 text-sm text-green-300">
                    <div>
                      <span className="font-medium">Root Hash:</span>
                      <code className="ml-2 px-2 py-1 bg-green-900 rounded text-xs break-all text-green-200">
                        {data.rootHash}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Transaction Hash:</span>
                      <code className="ml-2 px-2 py-1 bg-green-900 rounded text-xs break-all text-green-200">
                        {data.txHash}
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {isError && error && (
                <div className="p-4 bg-red-950 border border-red-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Upload Failed</span>
                  </div>
                  <p className="text-sm text-red-300">
                    {error.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>File Download</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="merkle-root">Merkle Root Hash</Label>
                <Input
                  id="merkle-root"
                  type="text"
                  placeholder="Enter merkle root hash..."
                  className="mt-2"
                />
              </div>
              <Button
                onClick={() => window.alert("Coming Soon")}
                className="hover:cursor-pointer"
              >
                Download
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
