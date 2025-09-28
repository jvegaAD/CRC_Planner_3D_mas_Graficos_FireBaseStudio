"use client";

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import { integrateSharePoint, type IntegrateSharePointOutput } from '@/ai/flows/sharepoint-integration';
import { NEXTJS_CODE } from '@/lib/code-snippets';

export function SharePointIntegrationHelper() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntegrateSharePointOutput | null>(null);
  const [sharePointContext, setSharePointContext] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await integrateSharePoint({
        nextJsCode: NEXTJS_CODE,
        sharePointContext: sharePointContext,
      });
      setResult(response);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate integration guidance. Please try again.",
      });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          SharePoint Integration
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>SharePoint Integration Helper</DialogTitle>
          <DialogDescription>
            Generate guidance and code snippets to integrate this Gantt chart with a SharePoint instance.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 py-4 overflow-y-auto pr-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sp-context">SharePoint Context (Optional)</Label>
              <Textarea
                id="sp-context"
                placeholder="Provide details about your SharePoint instance, e.g., version, list names, column types..."
                value={sharePointContext}
                onChange={(e) => setSharePointContext(e.target.value)}
                className="h-40 bg-white"
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Guidance
            </Button>
          </div>
          <div className="space-y-4 rounded-md border bg-slate-50 p-4 overflow-y-auto">
            <h3 className="font-semibold text-slate-800">Generated Output</h3>
            {loading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {result && (
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2 text-slate-700">Guidance</h4>
                  <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap">
                    {result.guidance}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-slate-700">Code Snippets</h4>
                  <pre className="bg-slate-900 text-white p-4 rounded-md overflow-x-auto text-xs">
                    <code>{result.codeSnippets}</code>
                  </pre>
                </div>
              </div>
            )}
             {!loading && !result && (
                <div className="flex items-center justify-center h-full text-slate-500 text-center px-4">
                    <p>Enter your SharePoint context and click "Generate Guidance" to see the results here.</p>
                </div>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
