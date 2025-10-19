import { useState } from "react";
import { Key, CheckCircle, AlertCircle, Database } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { use0gKeyValue } from "0g-wagmi";
import { useAccount } from "wagmi";
import { KvClient } from "@0glabs/0g-ts-sdk";

export default function KeyValuePage() {
  const [setKey, setSetKey] = useState("");
  const [setValue, setSetValue] = useState("");
  const [getKey, setGetKey] = useState("");
  const [retrievedValue, setRetrievedValue] = useState<string | null>(null);
  const [isGetting, setIsGetting] = useState(false);
  const [getError, setGetError] = useState<Error | null>(null);

  const { isConnected, chainId } = useAccount();

  // Initialize the 0G key-value store hook
  // Using a default stream ID - in production, this would be configurable
  const {
    setValue: setKVValue,
    isSettingValue,
    setSuccess,
    setError,
    setData,
    resetSetMutation,
    cachedValues,
  } = use0gKeyValue({
    streamId:
      "0x000000000000000000000000000000000000000000000000000000000000f2bd",
    chainId,
    onSetSuccess: (result: { txHash: string; rootHash: string }) => {
      console.log("Set value successful:", result);
    },
    onSetError: (err: Error) => {
      console.error("Set value failed:", err);
    },
  });

  // Handle setting a key-value pair
  const handleSetValue = async () => {
    if (!setKey.trim()) {
      window.alert("Please enter a key");
      return;
    }

    if (!setValue.trim()) {
      window.alert("Please enter a value");
      return;
    }

    if (!isConnected) {
      window.alert("Please connect your wallet first");
      return;
    }

    try {
      resetSetMutation();
      await setKVValue(setKey, setValue);
    } catch (err) {
      console.error("Set value error:", err);
    }
  };

  // Handle getting a value by key
  const handleGetValue = async () => {
    if (!getKey.trim()) {
      window.alert("Please enter a key to retrieve");
      return;
    }

    setIsGetting(true);
    setGetError(null);
    setRetrievedValue(null);

    try {
      // First check if we have it cached
      if (cachedValues[getKey] !== undefined) {
        setRetrievedValue(cachedValues[getKey]);
        setIsGetting(false);
        return;
      }

      // If not cached, fetch from the KV store
      const kvClient = new KvClient("http://3.101.147.150:6789");
      const keyBytes = Buffer.from(getKey, "utf-8");
      const valueObj = await kvClient.getValue(
        "0x000000000000000000000000000000000000000000000000000000000000f2bd",
        keyBytes
      );

      const valueString = valueObj
        ? Buffer.from(valueObj.data, "base64").toString("utf-8")
        : null;

      setRetrievedValue(valueString);
    } catch (err: any) {
      console.error("Get value error:", err);
      setGetError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsGetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />

      <main className="container max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <div className="space-y-6">
          {/* Set Key-Value Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Set Key-Value Pair</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="set-key">Key</Label>
                <Input
                  id="set-key"
                  type="text"
                  placeholder="e.g., user:name"
                  className="mt-2"
                  value={setKey}
                  onChange={(e) => setSetKey(e.target.value)}
                  disabled={isSettingValue}
                />
              </div>
              <div>
                <Label htmlFor="set-value">Value</Label>
                <Input
                  id="set-value"
                  type="text"
                  placeholder="e.g., Alice"
                  className="mt-2"
                  value={setValue}
                  onChange={(e) => setSetValue(e.target.value)}
                  disabled={isSettingValue}
                />
              </div>

              <Button
                onClick={handleSetValue}
                className="hover:cursor-pointer"
                disabled={
                  !setKey || !setValue || isSettingValue || !isConnected
                }
              >
                {isSettingValue ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Setting Value...
                  </>
                ) : (
                  "Set Value"
                )}
              </Button>

              {!isConnected && (
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  ⚠️ Please connect your wallet to set values
                </p>
              )}

              {setSuccess && setData && (
                <div className="p-4 bg-green-950 border border-green-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">
                      Value Set Successfully!
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-green-300">
                    <div>
                      <span className="font-medium">Key:</span>
                      <code className="ml-2 px-2 py-1 bg-green-900 rounded text-xs text-green-200">
                        {setKey}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Root Hash:</span>
                      <code className="ml-2 px-2 py-1 bg-green-900 rounded text-xs break-all text-green-200">
                        {setData.rootHash}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Transaction Hash:</span>
                      <code className="ml-2 px-2 py-1 bg-green-900 rounded text-xs break-all text-green-200">
                        {setData.txHash}
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {setError && (
                <div className="p-4 bg-red-950 border border-red-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Set Value Failed</span>
                  </div>
                  <p className="text-sm text-red-300">{setError.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Get Value Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Get Value by Key</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="get-key">Key</Label>
                <Input
                  id="get-key"
                  type="text"
                  placeholder="e.g., user:name"
                  className="mt-2"
                  value={getKey}
                  onChange={(e) => setGetKey(e.target.value)}
                  disabled={isGetting}
                />
              </div>

              <Button
                onClick={handleGetValue}
                variant="outline"
                className="hover:cursor-pointer"
                disabled={!getKey || isGetting}
              >
                {isGetting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Getting Value...
                  </>
                ) : (
                  "Get Value"
                )}
              </Button>

              {retrievedValue !== null && (
                <div className="p-4 bg-blue-950 border border-blue-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Value Retrieved</span>
                  </div>
                  <div className="space-y-1 text-sm text-blue-300">
                    <div>
                      <span className="font-medium">Key:</span>
                      <code className="ml-2 px-2 py-1 bg-blue-900 rounded text-xs text-blue-200">
                        {getKey}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Value:</span>
                      <code className="ml-2 px-2 py-1 bg-blue-900 rounded text-xs text-blue-200">
                        {retrievedValue}
                      </code>
                    </div>
                  </div>
                </div>
              )}

              {getError && (
                <div className="p-4 bg-red-950 border border-red-800 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">Get Value Failed</span>
                  </div>
                  <p className="text-sm text-red-300">{getError.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
