'use server';
/**
 * @fileOverview An AI flow for generating summaries of operational data.
 *
 * - summarizeData - A function that takes data and a context to generate a summary.
 * - SummarizeDataInput - The input type for the summarizeData function.
 * - SummarizeDataOutput - The return type for the summarizeData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeDataInputSchema = z.object({
  data: z.string().describe('A JSON string representing the data to be summarized.'),
  context: z.string().describe('The context of the data (e.g., "restaurant orders", "table statuses").'),
});
export type SummarizeDataInput = z.infer<typeof SummarizeDataInputSchema>;

const SummarizeDataOutputSchema = z.object({
  summary: z.string().describe('A concise, insightful summary of the provided data.'),
});
export type SummarizeDataOutput = z.infer<typeof SummarizeDataOutputSchema>;

export async function summarizeData(input: SummarizeDataInput): Promise<SummarizeDataOutput> {
  return summarizeDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDataPrompt',
  input: {schema: SummarizeDataInputSchema},
  output: {schema: SummarizeDataOutputSchema},
  prompt: `You are an expert restaurant operations analyst. Your task is to provide a brief, insightful summary based on the following data regarding {{context}}.

Analyze the key metrics, identify trends or anomalies, and present a concise summary of 1-2 sentences. Focus on actionable insights.

When presenting the summary, wrap the most critical keywords, metrics, or trends in double asterisks to denote importance (e.g., "There is **high revenue** from **table T5**" or "**Cancellations** are frequent.").

Do not just list the data. Provide a narrative summary.

Data:
{{{data}}}
`,
});

const summarizeDataFlow = ai.defineFlow(
  {
    name: 'summarizeDataFlow',
    inputSchema: SummarizeDataInputSchema,
    outputSchema: SummarizeDataOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error: any) {
      console.error('AI Summarization Error:', error);
      
      // Handle rate limits (429) gracefully to prevent crashing the UI
      if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
        return {
          summary: "I'm currently busy analyzing multiple requests. Please **wait a moment** and refresh to see your AI insights! 🚀"
        };
      }
      
      // Return a safe fallback message for other errors
      return {
        summary: "I encountered a minor issue summarizing this data. A **manual review** of the metrics below is advised."
      };
    }
  }
);
