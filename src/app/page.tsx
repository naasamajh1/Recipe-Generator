import RecipeGeneratorClient from '@/components/recipe-generator-client';
import { Toaster } from "@/components/ui/toaster";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <RecipeGeneratorClient />
      <Toaster />
    </main>
  );
}
