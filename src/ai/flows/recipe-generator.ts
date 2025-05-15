'use server';

/**
 * @fileOverview Recipe suggestion AI agent.
 *
 * - recipeSuggestionFromIngredients - A function that handles the recipe suggestion process.
 * - RecipeSuggestionInput - The input type for the recipeSuggestionFromIngredients function.
 * - RecipeSuggestionOutput - The return type for the recipeSuggestionFromIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeSuggestionInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available.'),
});
export type RecipeSuggestionInput = z.infer<typeof RecipeSuggestionInputSchema>;

const RecipeSuggestionOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.string().describe('A list of ingredients required for the recipe.'),
      instructions: z.string().describe('Step-by-step instructions to prepare the recipe.'),
      approximateTiming: z.string().describe('Estimated time to cook the recipe.'),
    })
  ),
});
export type RecipeSuggestionOutput = z.infer<typeof RecipeSuggestionOutputSchema>;

export async function recipeSuggestionFromIngredients(input: RecipeSuggestionInput): Promise<RecipeSuggestionOutput> {
  return recipeSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeSuggestionPrompt',
  input: {schema: RecipeSuggestionInputSchema},
  output: {schema: RecipeSuggestionOutputSchema},
  prompt: `You are a world-class chef specializing in creating recipes based on the ingredients available.

You will take a list of ingredients and generate a set of recipes that can be made with them. The recipes must include:
- name: The name of the recipe
- ingredients: A list of ingredients required for the recipe.
- instructions: Step-by-step instructions to prepare the recipe.
- approximateTiming: Estimated time to cook the recipe.

Ingredients: {{{ingredients}}}
`,
});

const recipeSuggestionFlow = ai.defineFlow(
  {
    name: 'recipeSuggestionFlow',
    inputSchema: RecipeSuggestionInputSchema,
    outputSchema: RecipeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
