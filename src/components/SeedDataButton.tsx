import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SeedDataService from '@/services/SeedDataService';

const SeedDataButton = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);

    try {
      const success = await SeedDataService.seedAllData();

      if (success) {
        setIsSeeded(true);
        toast({
          title: "Database Seeded!",
          description: "Sample data has been created successfully. You can now explore all features."
        });
      } else {
        toast({
          title: "Seeding Failed",
          description: "There was an error creating sample data. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        title: "Seeding Error",
        description: "An unexpected error occurred while seeding data.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isSeeded) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2" data-id="js11oetj8" data-path="src/components/SeedDataButton.tsx">
        <CheckCircle className="h-4 w-4 text-green-500" data-id="kn60xa6zg" data-path="src/components/SeedDataButton.tsx" />
        Data Seeded
      </Button>);

  }

  return (
    <Button
      onClick={handleSeedData}
      disabled={isSeeding}
      className="flex items-center gap-2"
      variant="outline" data-id="7ewtsast8" data-path="src/components/SeedDataButton.tsx">

      <Database className="h-4 w-4" data-id="u6avrm5av" data-path="src/components/SeedDataButton.tsx" />
      {isSeeding ? 'Seeding Database...' : 'Seed Sample Data'}
    </Button>);

};

export default SeedDataButton;