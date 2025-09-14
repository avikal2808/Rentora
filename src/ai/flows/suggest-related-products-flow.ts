'use server';
/**
 * @fileOverview An AI agent for suggesting related products.
 *
 * - suggestRelatedProducts - A function that suggests products related to a given product.
 * - SuggestRelatedProductsInput - The input type for the suggestRelatedProducts function.
 * - SuggestRelatedProductsOutput - The return type for the suggestRelatedProducts function.
 */

import { ai } from '@/ai/genkit';
import { products, type Product } from '@/lib/data';
import { z } from 'genkit';

const SuggestRelatedProductsInputSchema = z.object({
  product: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
  }),
});
export type SuggestRelatedProductsInput = z.infer<
  typeof SuggestRelatedProductsInputSchema
>;

const SuggestRelatedProductsOutputSchema = z.object({
  products: z
    .array(
      z.object({
        productId: z.string().describe('The ID of the recommended product.'),
        reason: z
          .string()
          .describe(
            'A very short (5-7 words) reason for the recommendation.'
          ),
      })
    )
    .max(2)
    .describe('A list of up to two related products.'),
});
export type SuggestRelatedProductsOutput = z.infer<
  typeof SuggestRelatedProductsOutputSchema
>;

export async function suggestRelatedProducts(
  input: SuggestRelatedProductsInput
): Promise<SuggestRelatedProductsOutput> {
  return suggestRelatedProductsFlow(input);
}

const suggestRelatedProductsFlow = ai.defineFlow(
  {
    name: 'suggestRelatedProductsFlow',
    inputSchema: SuggestRelatedProductsInputSchema,
    outputSchema: SuggestRelatedProductsOutputSchema,
  },
  async ({ product }) => {
    // Exclude the product itself and unavailable products from the list of candidates
    const candidateProducts = products.filter(
      (p) => p.id !== product.id && p.availability
    );

    const { output } = await ai.generate({
      prompt: `You are a helpful assistant that suggests related products. Based on the provided product, recommend up to two other relevant products from the list of available items. Provide the product ID and a very short (5-7 words) reason for each recommendation.

The user just added this product to their cart:
${JSON.stringify(product, null, 2)}

Here are the available products to choose from:
${JSON.stringify(candidateProducts, null, 2)}
`,
      output: {
        schema: SuggestRelatedProductsOutputSchema,
      },
      model: 'googleai/gemini-2.5-flash',
    });
    return output!;
  }
);
