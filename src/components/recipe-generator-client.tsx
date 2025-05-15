"use client";

import { useState } from 'react';
import type { RecipeSuggestionInput, RecipeSuggestionOutput } from '@/ai/flows/recipe-generator';
import { recipeSuggestionFromIngredients } from '@/ai/flows/recipe-generator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RecipeCard } from '@/components/recipe-card';
import { Loader2, AlertTriangle, ChefHat, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type Recipe = RecipeSuggestionOutput['recipes'][0];

export default function RecipeGeneratorClient() {
  const [ingredients, setIngredients] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      setRecipes(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes(null);

    try {
      const input: RecipeSuggestionInput = { ingredients };
      const result = await recipeSuggestionFromIngredients(input);
      
      if (result.recipes && result.recipes.length > 0) {
        setRecipes(result.recipes);
      } else {
        setRecipes([]); 
      }
    } catch (e) {
      console.error(e);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <header className="mb-10 sm:mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 shadow-sm">
          <ChefHat className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Fridge Feast</h1>
        <p className="mt-2 sm:mt-3 text-md sm:text-lg text-foreground/80">
          Turn your fridge contents into delicious meals!
        </p>
      </header>

      <Card className="mb-8 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="bg-secondary/30">
          <CardTitle className="text-xl sm:text-2xl text-primary">Your Ingredients</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            List the ingredients you have on hand, separated by commas.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Textarea
              placeholder="e.g., chicken breast, broccoli, garlic, olive oil, soy sauce..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={4}
              className="text-base rounded-md focus:ring-accent focus:border-accent"
              disabled={isLoading}
              aria-label="Ingredients input"
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-base sm:text-lg py-3 px-6 rounded-md transition-transform hover:scale-105 active:scale-95">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Recipes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div role="alert" className="mb-8 p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-md flex items-center shadow">
          <AlertTriangle className="mr-3 h-6 w-6 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl text-foreground/70">Finding tasty recipes for you...</p>
        </div>
      )}

      {!isLoading && recipes !== null && (
        <section aria-live="polite">
          {recipes.length > 0 ? (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-primary">Suggested Recipes</h2>
              {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-card p-6 sm:p-8 rounded-xl shadow-md">
              <Image 
                src="https://placehold.co/300x200.png" 
                alt="Illustration of an empty plate, signifying no recipes found" 
                width={300}
                height={200}
                data-ai-hint="empty plate" 
                className="mx-auto mb-6 rounded-lg shadow-sm" 
              />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground/80 mb-2">No Recipes Found</h2>
              <p className="text-foreground/60 text-sm sm:text-base">
                We couldn't find any recipes with the ingredients you provided.
                Try adding more items or checking for typos.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
