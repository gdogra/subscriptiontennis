import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface ChallengeCreatorProps {
  onChallengeCreated?: () => void;
}

const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ onChallengeCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    challenge_type: 'Singles',
    skill_level: 'Any',
    preferred_date: '',
    location_preference: '',
    message: '',
    stakes: '',
    response_deadline: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDeadline, setSelectedDeadline] = useState<Date | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.ID) {
      toast({
        title: "Error",
        description: "You must be logged in to create a challenge",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Creating challenge with data:', formData);

      const challengeData = {
        challenger_user_id: user.ID,
        opponent_user_id: 0, // Open challenge
        challenge_type: formData.challenge_type,
        skill_level: formData.skill_level,
        preferred_date: selectedDate ? selectedDate.toISOString() : '',
        location_preference: formData.location_preference,
        status: 'Open',
        message: formData.message,
        stakes: formData.stakes,
        doubles_partner_user_id: 0,
        response_deadline: selectedDeadline ? selectedDeadline.toISOString() : ''
      };

      const { error } = await window.ezsite.apis.tableCreate(21047, challengeData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Challenge Created!",
        description: "Your challenge has been posted and is now available for others to accept."
      });

      // Reset form
      setFormData({
        challenge_type: 'Singles',
        skill_level: 'Any',
        preferred_date: '',
        location_preference: '',
        message: '',
        stakes: '',
        response_deadline: ''
      });
      setSelectedDate(undefined);
      setSelectedDeadline(undefined);
      setIsOpen(false);

      // Notify parent component
      if (onChallengeCreated) {
        onChallengeCreated();
      }
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Failed to Create Challenge",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2" data-id="2qom4qhta" data-path="src/components/ChallengeCreator.tsx">
        <Plus className="w-4 h-4" data-id="0d99ev565" data-path="src/components/ChallengeCreator.tsx" />
        Create Challenge
      </Button>);

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-id="s9qbeyvvi" data-path="src/components/ChallengeCreator.tsx">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" data-id="ikvrl456w" data-path="src/components/ChallengeCreator.tsx">
        <CardHeader data-id="1btvrnc0o" data-path="src/components/ChallengeCreator.tsx">
          <CardTitle data-id="ttaj4r51v" data-path="src/components/ChallengeCreator.tsx">Create New Challenge</CardTitle>
          <CardDescription data-id="k8ae83iv9" data-path="src/components/ChallengeCreator.tsx">
            Set up a tennis challenge for other players to accept
          </CardDescription>
        </CardHeader>
        <CardContent data-id="bswuigt0y" data-path="src/components/ChallengeCreator.tsx">
          <form onSubmit={handleSubmit} className="space-y-6" data-id="m3dvvzwbo" data-path="src/components/ChallengeCreator.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="k9auwxzko" data-path="src/components/ChallengeCreator.tsx">
              <div className="space-y-2" data-id="n8nghlmoj" data-path="src/components/ChallengeCreator.tsx">
                <Label htmlFor="challenge_type" data-id="wiy0rmwm6" data-path="src/components/ChallengeCreator.tsx">Match Type</Label>
                <Select
                  value={formData.challenge_type}
                  onValueChange={(value) => handleInputChange('challenge_type', value)} data-id="snktsmppk" data-path="src/components/ChallengeCreator.tsx">

                  <SelectTrigger data-id="bcoy3fbiy" data-path="src/components/ChallengeCreator.tsx">
                    <SelectValue data-id="8gjboic8b" data-path="src/components/ChallengeCreator.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="gt1b7xa2o" data-path="src/components/ChallengeCreator.tsx">
                    <SelectItem value="Singles" data-id="bezxzljdl" data-path="src/components/ChallengeCreator.tsx">Singles</SelectItem>
                    <SelectItem value="Doubles" data-id="ag3ammv23" data-path="src/components/ChallengeCreator.tsx">Doubles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2" data-id="51yt8arr7" data-path="src/components/ChallengeCreator.tsx">
                <Label htmlFor="skill_level" data-id="qas5i3nbp" data-path="src/components/ChallengeCreator.tsx">Skill Level</Label>
                <Select
                  value={formData.skill_level}
                  onValueChange={(value) => handleInputChange('skill_level', value)} data-id="bg3oxtm0q" data-path="src/components/ChallengeCreator.tsx">

                  <SelectTrigger data-id="efuml9g2a" data-path="src/components/ChallengeCreator.tsx">
                    <SelectValue data-id="d0y25lv03" data-path="src/components/ChallengeCreator.tsx" />
                  </SelectTrigger>
                  <SelectContent data-id="irqyie2pl" data-path="src/components/ChallengeCreator.tsx">
                    <SelectItem value="Any" data-id="v2lowapkr" data-path="src/components/ChallengeCreator.tsx">Any Level</SelectItem>
                    <SelectItem value="Beginner" data-id="ag6twhufc" data-path="src/components/ChallengeCreator.tsx">Beginner</SelectItem>
                    <SelectItem value="Intermediate" data-id="1en8r3e7j" data-path="src/components/ChallengeCreator.tsx">Intermediate</SelectItem>
                    <SelectItem value="Advanced" data-id="zh7o32qrd" data-path="src/components/ChallengeCreator.tsx">Advanced</SelectItem>
                    <SelectItem value="Professional" data-id="n8fip7jrf" data-path="src/components/ChallengeCreator.tsx">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="qg4ziidxm" data-path="src/components/ChallengeCreator.tsx">
              <div className="space-y-2" data-id="v2onh8m44" data-path="src/components/ChallengeCreator.tsx">
                <Label data-id="gd5fe77jf" data-path="src/components/ChallengeCreator.tsx">Preferred Date</Label>
                <Popover data-id="y2yv5ym5c" data-path="src/components/ChallengeCreator.tsx">
                  <PopoverTrigger asChild data-id="xco3jaxe5" data-path="src/components/ChallengeCreator.tsx">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal" data-id="cjraswk4g" data-path="src/components/ChallengeCreator.tsx">

                      <CalendarIcon className="mr-2 h-4 w-4" data-id="ygty0ctlu" data-path="src/components/ChallengeCreator.tsx" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" data-id="dbao6v5q0" data-path="src/components/ChallengeCreator.tsx">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus data-id="5ae57p31j" data-path="src/components/ChallengeCreator.tsx" />

                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2" data-id="srlsx1a6m" data-path="src/components/ChallengeCreator.tsx">
                <Label data-id="mh7t5c2om" data-path="src/components/ChallengeCreator.tsx">Response Deadline</Label>
                <Popover data-id="1fi7cuv4k" data-path="src/components/ChallengeCreator.tsx">
                  <PopoverTrigger asChild data-id="ymgv9yaa3" data-path="src/components/ChallengeCreator.tsx">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal" data-id="uhrsvg899" data-path="src/components/ChallengeCreator.tsx">

                      <CalendarIcon className="mr-2 h-4 w-4" data-id="nn9e7u1wm" data-path="src/components/ChallengeCreator.tsx" />
                      {selectedDeadline ? format(selectedDeadline, "PPP") : "Pick deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" data-id="19cue5fu1" data-path="src/components/ChallengeCreator.tsx">
                    <Calendar
                      mode="single"
                      selected={selectedDeadline}
                      onSelect={setSelectedDeadline}
                      initialFocus data-id="q2bil72vw" data-path="src/components/ChallengeCreator.tsx" />

                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2" data-id="352vmfy7e" data-path="src/components/ChallengeCreator.tsx">
              <Label htmlFor="location_preference" data-id="19pf51006" data-path="src/components/ChallengeCreator.tsx">Preferred Location</Label>
              <Input
                id="location_preference"
                value={formData.location_preference}
                onChange={(e) => handleInputChange('location_preference', e.target.value)}
                placeholder="e.g., Central Park Tennis Courts, Court 3" data-id="qvmm4uwg5" data-path="src/components/ChallengeCreator.tsx" />

            </div>

            <div className="space-y-2" data-id="fqsqviucr" data-path="src/components/ChallengeCreator.tsx">
              <Label htmlFor="stakes" data-id="8h38ccsui" data-path="src/components/ChallengeCreator.tsx">Stakes (Optional)</Label>
              <Input
                id="stakes"
                value={formData.stakes}
                onChange={(e) => handleInputChange('stakes', e.target.value)}
                placeholder="e.g., $20 winner takes all, Friendly match" data-id="ao6xejlkv" data-path="src/components/ChallengeCreator.tsx" />

            </div>

            <div className="space-y-2" data-id="i4uhvmfas" data-path="src/components/ChallengeCreator.tsx">
              <Label htmlFor="message" data-id="rv4eavylr" data-path="src/components/ChallengeCreator.tsx">Challenge Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Add a message to potential opponents..."
                rows={3} data-id="vye7hsgw8" data-path="src/components/ChallengeCreator.tsx" />

            </div>

            <div className="flex space-x-4" data-id="0n11vzs5u" data-path="src/components/ChallengeCreator.tsx">
              <Button type="submit" disabled={loading} className="flex-1" data-id="6ipon812r" data-path="src/components/ChallengeCreator.tsx">
                {loading ? 'Creating...' : 'Create Challenge'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1" data-id="2jq84jz3j" data-path="src/components/ChallengeCreator.tsx">

                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);

};

export default ChallengeCreator;