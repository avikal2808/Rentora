'use server';
/**
 * @fileOverview A product recommendation AI agent.
 *
 * - recommendProduct - A function that handles the product recommendation process.
 * - RecommendProductInput - The input type for the recommendProduct function.
 * - RecommendProductOutput - The return type for the recommendProduct function.
 */

import { ai } from '@/ai/genkit';
import { products } from '@/lib/data';
import { z } from 'genkit';

const RecommendProductInputSchema = z.object({
  description: z
    .string()
    .describe("A user's description of what they are looking for."),
});
export type RecommendProductInput = z.infer<typeof RecommendProductInputSchema>;

const RecommendProductOutputSchema = z.object({
  productId: z.string().describe('The ID of the recommended product.'),
  reason: z.string().describe('A short reason for the recommendation.'),
});
export type RecommendProductOutput = z.infer<typeof RecommendProductOutputSchema>;

export async function recommendProduct(
  input: RecommendProductInput
): Promise<RecommendProductOutput> {
  return recommendProductFlow(input);
}

const recommendProductFlow = ai.defineFlow(
  {
    name: 'recommendProductFlow',
    inputSchema: RecommendProductInputSchema,
    outputSchema: RecommendProductOutputSchema,
  },
  async ({ description }) => {
    const availableProducts = products.filter((p) => p.availability);

    const { output } = await ai.generate({
      prompt: `You are a helpful assistant that recommends products. Based on the user's request, pick the best product from the list. Provide the product ID and a short reason for your recommendation.

User request: "${description}"

Available products:
${JSON.stringify(availableProducts, null, 2)}
`,
      output: {
        schema: RecommendProductOutputSchema,
      },
      model: 'googleai/gemini-2.5-flash',
    });
    return output!;
  }
);
