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
import { use0gChat } from "0g-wagmi";
import { useToast } from "@/hooks/use-toast";
import { Brain, Send, X } from "lucide-react";

interface ChatModalProps {
  modelName: string;
  providerAddress: string;
  onClose: () => void;
}

export function ChatModal({
  modelName,
  providerAddress,
  onClose,
}: ChatModalProps) {
  const { chat, isLoading, error } = use0gChat(providerAddress);
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setResponse("");

    try {
      const answer = await chat(question);
      setResponse(answer);
      toast({
        title: "Success!",
        description: "Response received from the model",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>{modelName}</CardTitle>
              <CardDescription>Ask a question to the AI model</CardDescription>
            </div>
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
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Question</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isSubmitting && handleSubmit()
                }
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isLoading}
                className="hover:cursor-pointer"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>

          {response && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Response</label>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{response}</p>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Note: Each request will consume OG tokens based on the model's
            pricing.
          </div>

          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm mt-2"
              role="alert"
            >
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
