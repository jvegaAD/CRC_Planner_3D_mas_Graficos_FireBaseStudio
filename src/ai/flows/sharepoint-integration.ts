'use server';

/**
 * @fileOverview A SharePoint integration AI agent.
 *
 * - integrateSharePoint - A function that handles the SharePoint integration process.
 * - IntegrateSharePointInput - The input type for the integrateSharePoint function.
 * - IntegrateSharePointOutput - The return type for the integrateSharePoint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntegrateSharePointInputSchema = z.object({
  nextJsCode: z
    .string()
    .describe('The NextJS code for the Ganttastic application.'),
  sharePointContext: z
    .string()
    .optional()
    .describe('Optional details about the SharePoint instance.'),
});
export type IntegrateSharePointInput = z.infer<typeof IntegrateSharePointInputSchema>;

const IntegrateSharePointOutputSchema = z.object({
  guidance: z.string().describe('Guidance on integrating the NextJS code with SharePoint.'),
  codeSnippets: z.string().describe('Code snippets for SharePoint integration.'),
});
export type IntegrateSharePointOutput = z.infer<typeof IntegrateSharePointOutputSchema>;

export async function integrateSharePoint(input: IntegrateSharePointInput): Promise<IntegrateSharePointOutput> {
  return integrateSharePointFlow(input);
}

const prompt = ai.definePrompt({
  name: 'integrateSharePointPrompt',
  input: {schema: IntegrateSharePointInputSchema},
  output: {schema: IntegrateSharePointOutputSchema},
  prompt: `You are an expert software engineer specializing in NextJS and SharePoint integration.

You will analyze the provided NextJS code for a Gantt chart application and provide guidance and code snippets to integrate it with a SharePoint instance.

Consider the following:
- Authentication with SharePoint.
- Reading and writing data to SharePoint lists.
- Handling different data types.
- Error handling.

NextJS Code:
{{nextJsCode}}

SharePoint Context (if available):
{{sharePointContext}}

Provide clear, concise guidance and code snippets to facilitate the integration.`,
});

const integrateSharePointFlow = ai.defineFlow(
  {
    name: 'integrateSharePointFlow',
    inputSchema: IntegrateSharePointInputSchema,
    outputSchema: IntegrateSharePointOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
