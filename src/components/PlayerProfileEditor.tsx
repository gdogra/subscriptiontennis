import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, X, MapPin, User, Phone, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  ID: number;
  user_id: number;
  display_name: string;
  skill_level: string;
  location_latitude: number;
  location_longitude: number;
  location_address: string;
  phone_number: string;
  subscription_tier: string;
  avatar_file_id: number;
}

interface PlayerProfileEditorProps {
  userProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

const PlayerProfileEditor: React.FC<PlayerProfileEditorProps> = ({ userProfile, onProfileUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    skill_level: 'Beginner',
    location_address: '',
    phone_number: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || user?.Name || '',
        skill_level: userProfile.skill_level || 'Beginner',
        location_address: userProfile.location_address || '',
        phone_number: userProfile.phone_number || ''
      });
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    if (!userProfile || !user?.ID) return;

    setSaving(true);
    try {
      const { error } = await window.ezsite.apis.tableUpdate(21045, {
        ID: userProfile.ID,
        user_id: userProfile.user_id,
        display_name: formData.display_name,
        skill_level: formData.skill_level,
        location_latitude: userProfile.location_latitude,
        location_longitude: userProfile.location_longitude,
        location_address: formData.location_address,
        phone_number: formData.phone_number,
        subscription_tier: userProfile.subscription_tier,
        avatar_file_id: userProfile.avatar_file_id
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully."
      });

      setIsEditing(false);
      onProfileUpdate();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData({
        display_name: userProfile.display_name || user?.Name || '',
        skill_level: userProfile.skill_level || 'Beginner',
        location_address: userProfile.location_address || '',
        phone_number: userProfile.phone_number || ''
      });
    }
    setIsEditing(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Try to get readable address using reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const address = data.display_name || `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;

          setFormData((prev) => ({ ...prev, location_address: address }));

          toast({
            title: "Location updated",
            description: `Your location has been set to ${address}`
          });
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          const fallbackAddress = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          setFormData((prev) => ({ ...prev, location_address: fallbackAddress }));
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location error",
          description: "Failed to get your location",
          variant: "destructive"
        });
      }
    );
  };

  if (!userProfile) {
    return (
      <Card data-id="n8atas91j" data-path="src/components/PlayerProfileEditor.tsx">
        <CardContent className="p-6 text-center" data-id="4ue4z8gb8" data-path="src/components/PlayerProfileEditor.tsx">
          <p className="text-gray-500" data-id="181d30own" data-path="src/components/PlayerProfileEditor.tsx">Loading profile...</p>
        </CardContent>
      </Card>);

  }

  return (
    <Card data-id="64erkwqca" data-path="src/components/PlayerProfileEditor.tsx">
      <CardHeader data-id="vsl8mp9sq" data-path="src/components/PlayerProfileEditor.tsx">
        <div className="flex items-center justify-between" data-id="aut8rjl8n" data-path="src/components/PlayerProfileEditor.tsx">
          <div data-id="8oskxn6j6" data-path="src/components/PlayerProfileEditor.tsx">
            <CardTitle data-id="w9u306g1d" data-path="src/components/PlayerProfileEditor.tsx">Profile Information</CardTitle>
            <CardDescription data-id="nyzdxpjf9" data-path="src/components/PlayerProfileEditor.tsx">
              Your tennis profile and preferences
            </CardDescription>
          </div>
          {!isEditing ?
          <Button variant="outline" onClick={() => setIsEditing(true)} data-id="9r0j3gt9b" data-path="src/components/PlayerProfileEditor.tsx">
              <Edit className="h-4 w-4 mr-2" data-id="fspm0y0hc" data-path="src/components/PlayerProfileEditor.tsx" />
              Edit Profile
            </Button> :

          <div className="flex gap-2" data-id="i10zn5ytb" data-path="src/components/PlayerProfileEditor.tsx">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving} data-id="1ptu69mq1" data-path="src/components/PlayerProfileEditor.tsx">
                <X className="h-4 w-4 mr-2" data-id="r5s0i897a" data-path="src/components/PlayerProfileEditor.tsx" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} data-id="ji628h4n6" data-path="src/components/PlayerProfileEditor.tsx">
                <Save className="h-4 w-4 mr-2" data-id="gjopdonfm" data-path="src/components/PlayerProfileEditor.tsx" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          }
        </div>
      </CardHeader>
      <CardContent className="space-y-6" data-id="tyrboogt3" data-path="src/components/PlayerProfileEditor.tsx">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4" data-id="zue39x0tr" data-path="src/components/PlayerProfileEditor.tsx">
          <Avatar className="w-20 h-20" data-id="qwdk7x14c" data-path="src/components/PlayerProfileEditor.tsx">
            <AvatarImage src="" alt={userProfile.display_name || user?.Name} data-id="gac5pexep" data-path="src/components/PlayerProfileEditor.tsx" />
            <AvatarFallback className="text-xl" data-id="lu5yffymq" data-path="src/components/PlayerProfileEditor.tsx">
              {(userProfile.display_name || user?.Name)?.split(' ').map((n) => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1" data-id="6p1avuumm" data-path="src/components/PlayerProfileEditor.tsx">
            <p className="text-sm text-gray-500 mb-2" data-id="fhzverre6" data-path="src/components/PlayerProfileEditor.tsx">Profile Picture</p>
            {isEditing &&
            <Button variant="outline" size="sm" data-id="s19gdfsh0" data-path="src/components/PlayerProfileEditor.tsx">
                <Upload className="h-4 w-4 mr-2" data-id="ybiiuy5cn" data-path="src/components/PlayerProfileEditor.tsx" />
                Upload Photo
              </Button>
            }
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="r9ixihwsx" data-path="src/components/PlayerProfileEditor.tsx">
          <div className="space-y-2" data-id="bizqvv7mv" data-path="src/components/PlayerProfileEditor.tsx">
            <Label htmlFor="display_name" data-id="r5lvuz9hf" data-path="src/components/PlayerProfileEditor.tsx">Display Name</Label>
            {isEditing ?
            <Input
              id="display_name"
              value={formData.display_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, display_name: e.target.value }))}
              placeholder="Enter your display name" data-id="sd3ju6w8w" data-path="src/components/PlayerProfileEditor.tsx" /> :


            <div className="flex items-center p-2 border rounded bg-gray-50" data-id="g3uuhlapx" data-path="src/components/PlayerProfileEditor.tsx">
                <User className="h-4 w-4 mr-2 text-gray-400" data-id="6m6m0914r" data-path="src/components/PlayerProfileEditor.tsx" />
                <span data-id="t80q5urft" data-path="src/components/PlayerProfileEditor.tsx">{userProfile.display_name || user?.Name || 'Not set'}</span>
              </div>
            }
          </div>

          <div className="space-y-2" data-id="nzwsv0mcn" data-path="src/components/PlayerProfileEditor.tsx">
            <Label htmlFor="skill_level" data-id="aohu2bb9f" data-path="src/components/PlayerProfileEditor.tsx">Skill Level</Label>
            {isEditing ?
            <Select value={formData.skill_level} onValueChange={(value) => setFormData((prev) => ({ ...prev, skill_level: value }))} data-id="mdbc1t419" data-path="src/components/PlayerProfileEditor.tsx">
                <SelectTrigger data-id="qs3oxtf3u" data-path="src/components/PlayerProfileEditor.tsx">
                  <SelectValue placeholder="Select skill level" data-id="m1s31eoye" data-path="src/components/PlayerProfileEditor.tsx" />
                </SelectTrigger>
                <SelectContent data-id="l8l6rgk7p" data-path="src/components/PlayerProfileEditor.tsx">
                  <SelectItem value="Beginner" data-id="l78ed1smz" data-path="src/components/PlayerProfileEditor.tsx">Beginner</SelectItem>
                  <SelectItem value="Intermediate" data-id="ihky7a0i1" data-path="src/components/PlayerProfileEditor.tsx">Intermediate</SelectItem>
                  <SelectItem value="Advanced" data-id="t1xvuprfv" data-path="src/components/PlayerProfileEditor.tsx">Advanced</SelectItem>
                  <SelectItem value="Professional" data-id="xg1cp8lvi" data-path="src/components/PlayerProfileEditor.tsx">Professional</SelectItem>
                </SelectContent>
              </Select> :

            <div className="flex items-center p-2 border rounded bg-gray-50" data-id="i2ifedcdd" data-path="src/components/PlayerProfileEditor.tsx">
                <span data-id="nad0m2vm3" data-path="src/components/PlayerProfileEditor.tsx">{userProfile.skill_level || 'Beginner'}</span>
              </div>
            }
          </div>

          <div className="space-y-2" data-id="rdaxfd8ue" data-path="src/components/PlayerProfileEditor.tsx">
            <Label htmlFor="phone_number" data-id="2ahwa53l2" data-path="src/components/PlayerProfileEditor.tsx">Phone Number</Label>
            {isEditing ?
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
              placeholder="Enter your phone number" data-id="vvvgpu9pg" data-path="src/components/PlayerProfileEditor.tsx" /> :


            <div className="flex items-center p-2 border rounded bg-gray-50" data-id="hp4feusku" data-path="src/components/PlayerProfileEditor.tsx">
                <Phone className="h-4 w-4 mr-2 text-gray-400" data-id="e4wqomqyl" data-path="src/components/PlayerProfileEditor.tsx" />
                <span data-id="m70b1bxo6" data-path="src/components/PlayerProfileEditor.tsx">{userProfile.phone_number || 'Not set'}</span>
              </div>
            }
          </div>

          <div className="space-y-2" data-id="4catg6x2b" data-path="src/components/PlayerProfileEditor.tsx">
            <Label data-id="9lbb400q7" data-path="src/components/PlayerProfileEditor.tsx">Email</Label>
            <div className="flex items-center p-2 border rounded bg-gray-50" data-id="5a7rxz2fo" data-path="src/components/PlayerProfileEditor.tsx">
              <span className="text-gray-600" data-id="czdy1i6m5" data-path="src/components/PlayerProfileEditor.tsx">{user?.Email}</span>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-2" data-id="r7tk6cj95" data-path="src/components/PlayerProfileEditor.tsx">
          <Label htmlFor="location_address" data-id="2vxd0puny" data-path="src/components/PlayerProfileEditor.tsx">Location</Label>
          {isEditing ?
          <div className="space-y-2" data-id="tnwj6w1zv" data-path="src/components/PlayerProfileEditor.tsx">
              <div className="flex gap-2" data-id="xa3eiswjw" data-path="src/components/PlayerProfileEditor.tsx">
                <Input
                id="location_address"
                value={formData.location_address}
                onChange={(e) => setFormData((prev) => ({ ...prev, location_address: e.target.value }))}
                placeholder="Enter your location or get current location"
                className="flex-1" data-id="fcufdhlv9" data-path="src/components/PlayerProfileEditor.tsx" />

                <Button type="button" variant="outline" onClick={getCurrentLocation} data-id="48tipf2xh" data-path="src/components/PlayerProfileEditor.tsx">
                  <MapPin className="h-4 w-4 mr-2" data-id="wz2fouo7z" data-path="src/components/PlayerProfileEditor.tsx" />
                  Get Current
                </Button>
              </div>
              <p className="text-xs text-gray-500" data-id="2h458p89q" data-path="src/components/PlayerProfileEditor.tsx">
                Your location helps us show nearby events and players
              </p>
            </div> :

          <div className="flex items-center p-2 border rounded bg-gray-50" data-id="ejnik762g" data-path="src/components/PlayerProfileEditor.tsx">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" data-id="6zw822y6m" data-path="src/components/PlayerProfileEditor.tsx" />
              <span data-id="50k8828hy" data-path="src/components/PlayerProfileEditor.tsx">{userProfile.location_address || 'Location not set'}</span>
            </div>
          }
        </div>
      </CardContent>
    </Card>);

};

export default PlayerProfileEditor;