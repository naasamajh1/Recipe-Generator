import type { RecipeSuggestionOutput } from '@/ai/flows/recipe-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Clock, ListChecks, Apple } from 'lucide-react';

type Recipe = RecipeSuggestionOutput['recipes'][0];

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Utensils className="mr-2 h-6 w-6 text-primary" />
          {recipe.name}
        </CardTitle>
        <CardDescription className="flex items-center pt-1">
          <Clock className="mr-2 h-4 w-4" />
          Approx. {recipe.approximateTiming}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Apple className="mr-2 h-5 w-5 text-primary" />
            Ingredients
          </h3>
          <p className="text-sm text-foreground/90 whitespace-pre-line">{recipe.ingredients}</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />
            Instructions
          </h3>
          <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-line">
            {recipe.instructions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
