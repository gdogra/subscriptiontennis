import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { seedFAQData } from '@/services/SeedFAQService';

const SeedFAQButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    if (isSeeding) return;

    setIsSeeding(true);
    try {
      await seedFAQData();
      toast({
        title: 'Success',
        description: 'FAQ data has been seeded successfully!'
      });
    } catch (error) {
      console.error('Error seeding FAQ data:', error);
      toast({
        title: 'Error',
        description: 'Failed to seed FAQ data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      onClick={handleSeedData}
      disabled={isSeeding}
      variant="outline"
      className="gap-2" data-id="ub7v2ha6b" data-path="src/components/SeedFAQButton.tsx">

      {isSeeding ?
      <Loader2 className="h-4 w-4 animate-spin" data-id="gbuwn8owe" data-path="src/components/SeedFAQButton.tsx" /> :

      <Database className="h-4 w-4" data-id="ydsmdz3wk" data-path="src/components/SeedFAQButton.tsx" />
      }
      {isSeeding ? 'Seeding FAQ Data...' : 'Seed FAQ Data'}
    </Button>);

};

export default SeedFAQButton;