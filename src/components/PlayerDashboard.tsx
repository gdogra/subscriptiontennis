import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import EventsNearMe from '@/components/EventsNearMe';
import MyChallenges from '@/components/MyChallenge';
import NotificationCenter from '@/components/NotificationCenter';
import PaymentModal from '@/components/PaymentModal';
import PlayerProfileEditor from '@/components/PlayerProfileEditor';
import LocationService from '@/components/LocationService';
import UserGuide from '@/components/UserGuide';
import FAQ from '@/components/FAQ';
import { Calendar, MapPin, Users, Trophy, Star, Crown, Target, CreditCard, TrendingUp, CheckCircle, BookOpen, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface DashboardStats {
  activeChallenges: number;
  completedMatches: number;
  nearbyEvents: number;
  winRate: number;
}

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface EventSummary {
  id: number;
  title: string;
  event_date: string;
  location_name: string;
  event_type: string;
  registration_fee: number;
}

interface ChallengeSummary {
  id: number;
  challenge_type: string;
  status: string;
  opponent_name: string;
  preferred_date: string;
  skill_level: string;
}

const PlayerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    activeChallenges: 0,
    completedMatches: 0,
    nearbyEvents: 0,
    winRate: 0
  });
  const [eventsSummary, setEventsSummary] = useState<EventSummary[]>([]);
  const [challengesSummary, setChallengesSummary] = useState<ChallengeSummary[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({
    name: 'Premium',
    price: 29.99,
    features: ['Unlimited challenges', 'Priority support', 'Advanced analytics']
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.ID) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user?.ID]);

  const loadData = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading player dashboard data for user ID:', user.ID);
      setError(null);

      // Load user profile with timeout
      const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const profilePromise = window.ezsite.apis.tablePage(21045, {
        PageNo: 1,
        PageSize: 1,
        Filters: [{ name: "user_id", op: "Equal", value: user.ID }]
      });

      const profileResponse = (await Promise.race([profilePromise, timeoutPromise])) as any;

      if (profileResponse.error) {
        throw new Error(profileResponse.error);
      }

      if (profileResponse.data?.List?.length > 0) {
        const profile = profileResponse.data.List[0];
        setUserProfile(profile);

        // Set location from profile if available
        if (profile.location_latitude && profile.location_longitude) {
          setCurrentLocation({
            latitude: profile.location_latitude,
            longitude: profile.location_longitude,
            address: profile.location_address
          });
        }

        console.log('User profile loaded:', profile);
      } else {
        console.log('No profile found, creating default profile...');
        // Create default profile if doesn't exist
        const createResponse = await window.ezsite.apis.tableCreate(21045, {
          user_id: user.ID,
          display_name: user.Name || '',
          skill_level: 'Beginner',
          location_latitude: 0,
          location_longitude: 0,
          location_address: '',
          phone_number: '',
          subscription_tier: 'Free',
          avatar_file_id: 0
        });

        if (createResponse.error) {
          throw new Error(`Failed to create profile: ${createResponse.error}`);
        }

        // Refetch profile after creation
        const newProfileResponse = await window.ezsite.apis.tablePage(21045, {
          PageNo: 1,
          PageSize: 1,
          Filters: [{ name: "user_id", op: "Equal", value: user.ID }]
        });

        if (newProfileResponse.data?.List?.length > 0) {
          setUserProfile(newProfileResponse.data.List[0]);
        }
      }

      // Load dashboard stats and summaries with error handling
      await Promise.all([
      loadDashboardStats(),
      loadEventsSummary(),
      loadChallengesSummary()]
      );

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      const errorMessage = error.message || 'Failed to load dashboard data';
      setError(errorMessage);

      toast({
        title: "Loading Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading dashboard stats...');

      // Set default stats first
      setStats({
        activeChallenges: 0,
        completedMatches: 0,
        nearbyEvents: 0,
        winRate: 0
      });

      // Try to load actual stats, but don't fail the whole dashboard if this fails
      const statsPromises = [
      // Active challenges
      window.ezsite.apis.tablePage(21047, {
        PageNo: 1,
        PageSize: 100,
        Filters: [
        { name: "challenger_user_id", op: "Equal", value: user.ID },
        { name: "status", op: "StringContains", value: "Open" }]

      }).catch(() => ({ data: { List: [] } })),

      // Completed matches
      window.ezsite.apis.tablePage(21048, {
        PageNo: 1,
        PageSize: 100,
        Filters: [
        { name: "player1_user_id", op: "Equal", value: user.ID },
        { name: "status", op: "Equal", value: "Completed" }]

      }).catch(() => ({ data: { List: [] } })),

      // Nearby events
      window.ezsite.apis.tablePage(21046, {
        PageNo: 1,
        PageSize: 100,
        Filters: [
        { name: "status", op: "Equal", value: "Active" }]

      }).catch(() => ({ data: { List: [] } }))];


      const [challengesResponse, matchesResponse, eventsResponse] = await Promise.all(statsPromises);

      // Calculate stats safely
      const activeChallenges = challengesResponse.data?.List?.length || 0;
      const totalMatches = matchesResponse.data?.List?.length || 0;
      const nearbyEvents = eventsResponse.data?.List?.length || 0;

      const wonMatches = matchesResponse.data?.List?.filter((match: any) =>
      match.winner_user_id === user.ID
      ).length || 0;

      const winRate = totalMatches > 0 ? Math.round(wonMatches / totalMatches * 100) : 0;

      setStats({
        activeChallenges,
        completedMatches: totalMatches,
        nearbyEvents,
        winRate
      });

      console.log('Dashboard stats loaded:', { activeChallenges, totalMatches, nearbyEvents, winRate });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Don't show error for stats loading failure
    }
  };

  const loadEventsSummary = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading events summary...');

      const { data, error } = await window.ezsite.apis.tablePage(21046, {
        PageNo: 1,
        PageSize: 5,
        OrderByField: "event_date",
        IsAsc: true,
        Filters: [
        { name: "status", op: "Equal", value: "Active" }]

      });

      if (error) {
        console.error('Error loading events summary:', error);
        return;
      }

      const events = data?.List || [];
      setEventsSummary(events.slice(0, 3)); // Show top 3 upcoming events

    } catch (error) {
      console.error('Error loading events summary:', error);
    }
  };

  const loadChallengesSummary = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading challenges summary...');

      const { data, error } = await window.ezsite.apis.tablePage(21047, {
        PageNo: 1,
        PageSize: 5,
        OrderByField: "id",
        IsAsc: false
      });

      if (error) {
        console.error('Error loading challenges summary:', error);
        return;
      }

      const challenges = data?.List || [];

      // Filter challenges where user is involved and get user profiles for names
      const userChallenges = challenges.filter((challenge: any) =>
      challenge.challenger_user_id === user.ID ||
      challenge.opponent_user_id === user.ID ||
      challenge.doubles_partner_user_id === user.ID ||
      challenge.opponent_user_id === 0 // Open challenges
      );

      // Load user profiles to get opponent names
      const profilesResponse = await window.ezsite.apis.tablePage(21045, {
        PageNo: 1,
        PageSize: 100
      });

      const profiles = profilesResponse.data?.List || [];
      const profileMap = new Map();
      profiles.forEach((profile: any) => {
        profileMap.set(profile.user_id, profile.display_name);
      });

      const challengesSummaryData = userChallenges.slice(0, 3).map((challenge: any) => {
        const opponentId = challenge.challenger_user_id === user.ID ?
        challenge.opponent_user_id : challenge.challenger_user_id;

        return {
          id: challenge.id,
          challenge_type: challenge.challenge_type,
          status: challenge.status,
          opponent_name: opponentId === 0 ? 'Open Challenge' :
          profileMap.get(opponentId) || `User ${opponentId}`,
          preferred_date: challenge.preferred_date,
          skill_level: challenge.skill_level
        };
      });

      setChallengesSummary(challengesSummaryData);

    } catch (error) {
      console.error('Error loading challenges summary:', error);
    }
  };

  const handleLocationUpdate = async (location: Location) => {
    setCurrentLocation(location);

    // Update user profile with new location
    if (userProfile && user?.ID) {
      try {
        const { error } = await window.ezsite.apis.tableUpdate(21045, {
          ID: userProfile.ID,
          user_id: userProfile.user_id,
          display_name: userProfile.display_name,
          skill_level: userProfile.skill_level,
          location_latitude: location.latitude,
          location_longitude: location.longitude,
          location_address: location.address || '',
          phone_number: userProfile.phone_number,
          subscription_tier: userProfile.subscription_tier,
          avatar_file_id: userProfile.avatar_file_id
        });

        if (!error) {
          setUserProfile((prev) => prev ? {
            ...prev,
            location_latitude: location.latitude,
            location_longitude: location.longitude,
            location_address: location.address || ''
          } : null);
        }
      } catch (error) {
        console.error('Failed to update location in profile:', error);
      }
    }
  };

  const handleUpgrade = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Upgrade Successful!",
      description: "Your subscription has been upgraded. Enjoy your new features!"
    });
    loadData(); // Refresh profile data
  };

  const getSkillLevelIcon = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return <Target className="w-4 h-4 text-green-600" data-id="trlou7bou" data-path="src/components/PlayerDashboard.tsx" />;
      case 'intermediate':
        return <Star className="w-4 h-4 text-yellow-600" data-id="13rwmsipl" data-path="src/components/PlayerDashboard.tsx" />;
      case 'advanced':
        return <Crown className="w-4 h-4 text-purple-600" data-id="v2je084gw" data-path="src/components/PlayerDashboard.tsx" />;
      case 'professional':
        return <Trophy className="w-4 h-4 text-red-600" data-id="hko7xd8kt" data-path="src/components/PlayerDashboard.tsx" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" data-id="891p4fj6y" data-path="src/components/PlayerDashboard.tsx" />;
    }
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'pro':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'premium':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="va9jt9fti" data-path="src/components/PlayerDashboard.tsx">
        <div className="text-center" data-id="8vqijfmah" data-path="src/components/PlayerDashboard.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" data-id="alx979fxq" data-path="src/components/PlayerDashboard.tsx"></div>
          <p className="mt-4 text-gray-600" data-id="q5sr0jep8" data-path="src/components/PlayerDashboard.tsx">Loading dashboard...</p>
        </div>
      </div>);

  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="wu9r6fdrd" data-path="src/components/PlayerDashboard.tsx">
        <div className="text-center" data-id="f67lnmpke" data-path="src/components/PlayerDashboard.tsx">
          <div className="text-red-600 mb-4" data-id="nrhpqahe5" data-path="src/components/PlayerDashboard.tsx">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-id="zz0o7o6wz" data-path="src/components/PlayerDashboard.tsx">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" data-id="pye1ete83" data-path="src/components/PlayerDashboard.tsx" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2" data-id="dpdwtrihe" data-path="src/components/PlayerDashboard.tsx">Dashboard Error</h2>
          <p className="text-gray-600 mb-4" data-id="65y27plxk" data-path="src/components/PlayerDashboard.tsx">{error}</p>
          <Button onClick={() => {setError(null);loadData();}} data-id="mozdl9yfg" data-path="src/components/PlayerDashboard.tsx">
            Try Again
          </Button>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50" data-id="hhv6vwwjs" data-path="src/components/PlayerDashboard.tsx">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4" data-id="2vz554izz" data-path="src/components/PlayerDashboard.tsx">
        <div className="flex items-center justify-between" data-id="9z1o9iq23" data-path="src/components/PlayerDashboard.tsx">
          <div className="flex items-center space-x-4" data-id="qei0ct32f" data-path="src/components/PlayerDashboard.tsx">
            <Avatar className="w-12 h-12" data-id="y8ilm64hc" data-path="src/components/PlayerDashboard.tsx">
              <AvatarImage src="" alt={user?.Name} data-id="4nzbtpzno" data-path="src/components/PlayerDashboard.tsx" />
              <AvatarFallback data-id="5cwvdl2zh" data-path="src/components/PlayerDashboard.tsx">
                {user?.Name?.split(' ').map((n) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div data-id="n1h7strqo" data-path="src/components/PlayerDashboard.tsx">
              <h1 className="text-2xl font-bold text-gray-900" data-id="un84osc9o" data-path="src/components/PlayerDashboard.tsx">
                Welcome, {user?.Name || 'Player'}!
              </h1>
              <div className="flex items-center space-x-2" data-id="abcbfw91w" data-path="src/components/PlayerDashboard.tsx">
                {getSkillLevelIcon(userProfile?.skill_level)}
                <span className="text-gray-600 capitalize" data-id="pdfiezz2p" data-path="src/components/PlayerDashboard.tsx">
                  {userProfile?.skill_level || 'Beginner'} Player
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4" data-id="7hzolz1kl" data-path="src/components/PlayerDashboard.tsx">
            <NotificationCenter data-id="v6va79xjf" data-path="src/components/PlayerDashboard.tsx" />
            <Badge
              variant="outline"
              className={getSubscriptionColor(userProfile?.subscription_tier || 'free')} data-id="ef90ii5sx" data-path="src/components/PlayerDashboard.tsx">
              {(userProfile?.subscription_tier || 'Free').toUpperCase()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpgrade({
                name: 'Premium',
                price: 29.99,
                features: ['Unlimited challenges', 'Priority support', 'Advanced analytics', 'Tournament access']
              })}
              className="flex items-center gap-2" data-id="c4unjkbzp" data-path="src/components/PlayerDashboard.tsx">
              <CreditCard className="h-4 w-4" data-id="z39gwkjvs" data-path="src/components/PlayerDashboard.tsx" />
              Upgrade
            </Button>
            <Button variant="outline" onClick={logout} data-id="30g39kiwn" data-path="src/components/PlayerDashboard.tsx">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6" data-id="tgz3pe78i" data-path="src/components/PlayerDashboard.tsx">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-id="2r2bruykk" data-path="src/components/PlayerDashboard.tsx">
          <Card data-id="b8zxpi0l4" data-path="src/components/PlayerDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="5c4j4pl8g" data-path="src/components/PlayerDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="dbjf747fy" data-path="src/components/PlayerDashboard.tsx">Active Challenges</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" data-id="dnw213zz6" data-path="src/components/PlayerDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="ejim3xls9" data-path="src/components/PlayerDashboard.tsx">
              <div className="text-2xl font-bold" data-id="thh3ygl1q" data-path="src/components/PlayerDashboard.tsx">{stats.activeChallenges}</div>
              <p className="text-xs text-muted-foreground" data-id="5wm23tziz" data-path="src/components/PlayerDashboard.tsx">
                Currently participating
              </p>
            </CardContent>
          </Card>
          
          <Card data-id="9eatul365" data-path="src/components/PlayerDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="zo4j5siww" data-path="src/components/PlayerDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="ottdxg6ly" data-path="src/components/PlayerDashboard.tsx">Matches Played</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" data-id="zkpjzlmd0" data-path="src/components/PlayerDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="ppxuo32er" data-path="src/components/PlayerDashboard.tsx">
              <div className="text-2xl font-bold" data-id="q2gn60qxo" data-path="src/components/PlayerDashboard.tsx">{stats.completedMatches}</div>
              <p className="text-xs text-muted-foreground" data-id="d3rsv8cbr" data-path="src/components/PlayerDashboard.tsx">
                Total completed
              </p>
            </CardContent>
          </Card>
          
          <Card data-id="r96v2ab4o" data-path="src/components/PlayerDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="sjxrvplzc" data-path="src/components/PlayerDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="h1ros55b6" data-path="src/components/PlayerDashboard.tsx">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" data-id="1i7osfeyg" data-path="src/components/PlayerDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="izdnb12z9" data-path="src/components/PlayerDashboard.tsx">
              <div className="text-2xl font-bold" data-id="p5l0rlmqr" data-path="src/components/PlayerDashboard.tsx">{stats.winRate}%</div>
              <p className="text-xs text-muted-foreground" data-id="5lo7ltae1" data-path="src/components/PlayerDashboard.tsx">
                Match success rate
              </p>
            </CardContent>
          </Card>
          
          <Card data-id="uyt7lwotb" data-path="src/components/PlayerDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="0hljbg7pb" data-path="src/components/PlayerDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="2gkun17jy" data-path="src/components/PlayerDashboard.tsx">Events Nearby</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" data-id="7xvjb0xnn" data-path="src/components/PlayerDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="ha6sqio2o" data-path="src/components/PlayerDashboard.tsx">
              <div className="text-2xl font-bold" data-id="65g86l5op" data-path="src/components/PlayerDashboard.tsx">{stats.nearbyEvents}</div>
              <p className="text-xs text-muted-foreground" data-id="uwgufn2zu" data-path="src/components/PlayerDashboard.tsx">
                Available to join
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" data-id="vechaom5v" data-path="src/components/PlayerDashboard.tsx">
          {/* Events Summary */}
          <Card data-id="i7dfojtwh" data-path="src/components/PlayerDashboard.tsx">
            <CardHeader data-id="nq9p3oq5a" data-path="src/components/PlayerDashboard.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="edd5b5mbf" data-path="src/components/PlayerDashboard.tsx">
                <Calendar className="h-5 w-5" data-id="s5dcvmfap" data-path="src/components/PlayerDashboard.tsx" />
                <span data-id="07phejlj9" data-path="src/components/PlayerDashboard.tsx">Upcoming Events</span>
              </CardTitle>
              <CardDescription data-id="xo1zxcdqp" data-path="src/components/PlayerDashboard.tsx">Events happening near you</CardDescription>
            </CardHeader>
            <CardContent data-id="8wh17i79d" data-path="src/components/PlayerDashboard.tsx">
              {eventsSummary.length === 0 ?
              <p className="text-gray-500 text-sm" data-id="11l3ibdl6" data-path="src/components/PlayerDashboard.tsx">No upcoming events found</p> :
              <div className="space-y-3" data-id="69sya3q0c" data-path="src/components/PlayerDashboard.tsx">
                  {eventsSummary.map((event) =>
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-id="y3yp4av5z" data-path="src/components/PlayerDashboard.tsx">
                      <div data-id="35abcmksj" data-path="src/components/PlayerDashboard.tsx">
                        <h4 className="font-medium text-sm" data-id="69xcssgjb" data-path="src/components/PlayerDashboard.tsx">{event.title}</h4>
                        <p className="text-xs text-gray-600" data-id="ibwzk97du" data-path="src/components/PlayerDashboard.tsx">
                          {new Date(event.event_date).toLocaleDateString()} • {event.location_name}
                        </p>
                        <Badge variant="outline" className="text-xs mt-1" data-id="akrhjvxck" data-path="src/components/PlayerDashboard.tsx">
                          {event.event_type}
                        </Badge>
                      </div>
                      <div className="text-right" data-id="nuw9y611u" data-path="src/components/PlayerDashboard.tsx">
                        <p className="text-sm font-medium" data-id="wxy7cdnzn" data-path="src/components/PlayerDashboard.tsx">
                          {event.registration_fee > 0 ? `$${event.registration_fee}` : 'Free'}
                        </p>
                      </div>
                    </div>
                )}
                </div>
              }
            </CardContent>
          </Card>

          {/* Challenges Summary */}
          <Card data-id="bjj6erew0" data-path="src/components/PlayerDashboard.tsx">
            <CardHeader data-id="cnf02l3ec" data-path="src/components/PlayerDashboard.tsx">
              <CardTitle className="flex items-center space-x-2" data-id="sn69uhnen" data-path="src/components/PlayerDashboard.tsx">
                <Trophy className="h-5 w-5" data-id="fsw5jky1y" data-path="src/components/PlayerDashboard.tsx" />
                <span data-id="pabq1zoga" data-path="src/components/PlayerDashboard.tsx">Recent Challenges</span>
              </CardTitle>
              <CardDescription data-id="l97s05etc" data-path="src/components/PlayerDashboard.tsx">Your latest challenge activity</CardDescription>
            </CardHeader>
            <CardContent data-id="tzrj40pea" data-path="src/components/PlayerDashboard.tsx">
              {challengesSummary.length === 0 ?
              <p className="text-gray-500 text-sm" data-id="dfzrhnhog" data-path="src/components/PlayerDashboard.tsx">No recent challenges found</p> :
              <div className="space-y-3" data-id="7k22tnzxf" data-path="src/components/PlayerDashboard.tsx">
                  {challengesSummary.map((challenge) =>
                <div key={challenge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-id="tql8nn098" data-path="src/components/PlayerDashboard.tsx">
                      <div data-id="pgrycdh1v" data-path="src/components/PlayerDashboard.tsx">
                        <h4 className="font-medium text-sm" data-id="wwm83mw6h" data-path="src/components/PlayerDashboard.tsx">{challenge.challenge_type}</h4>
                        <p className="text-xs text-gray-600" data-id="pb70i7ywp" data-path="src/components/PlayerDashboard.tsx">
                          vs {challenge.opponent_name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1" data-id="luxl8emze" data-path="src/components/PlayerDashboard.tsx">
                          <Badge variant="outline" className={`text-xs ${getStatusColor(challenge.status)}`} data-id="9pbwifook" data-path="src/components/PlayerDashboard.tsx">
                            {challenge.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs" data-id="14npssdkm" data-path="src/components/PlayerDashboard.tsx">
                            {challenge.skill_level}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right" data-id="dz8s8q2pj" data-path="src/components/PlayerDashboard.tsx">
                        <p className="text-xs text-gray-600" data-id="hdl4ng9my" data-path="src/components/PlayerDashboard.tsx">
                          {challenge.preferred_date ?
                      new Date(challenge.preferred_date).toLocaleDateString() :
                      'TBD'
                      }
                        </p>
                      </div>
                    </div>
                )}
                </div>
              }
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6" data-id="6xc2oyfkm" data-path="src/components/PlayerDashboard.tsx">
          <TabsList className="grid w-full grid-cols-6" data-id="s4qr22mu3" data-path="src/components/PlayerDashboard.tsx">
            <TabsTrigger value="events" data-id="ufur2f2uc" data-path="src/components/PlayerDashboard.tsx">Events Near Me</TabsTrigger>
            <TabsTrigger value="challenges" data-id="7gr29rm5p" data-path="src/components/PlayerDashboard.tsx">My Challenges</TabsTrigger>
            <TabsTrigger value="help" data-id="839ewtda9" data-path="src/components/PlayerDashboard.tsx">FAQ & Help</TabsTrigger>
            <TabsTrigger value="profile" data-id="51f0maxbp" data-path="src/components/PlayerDashboard.tsx">Profile & Settings</TabsTrigger>
            <TabsTrigger value="location" data-id="16oo7ichg" data-path="src/components/PlayerDashboard.tsx">Location</TabsTrigger>
            <TabsTrigger value="guide" data-id="yjxbgdb17" data-path="src/components/PlayerDashboard.tsx">User Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-6" data-id="72ylugstt" data-path="src/components/PlayerDashboard.tsx">
            <EventsNearMe data-id="n6zttaf27" data-path="src/components/PlayerDashboard.tsx" />
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-6" data-id="3oh9yjhl2" data-path="src/components/PlayerDashboard.tsx">
            <MyChallenges data-id="8defvch9e" data-path="src/components/PlayerDashboard.tsx" />
          </TabsContent>

          <TabsContent value="help" className="space-y-6" data-id="4hd6blei6" data-path="src/components/PlayerDashboard.tsx">
            <Card data-id="bfnd0df2b" data-path="src/components/PlayerDashboard.tsx">
              <CardHeader data-id="153fbpbiu" data-path="src/components/PlayerDashboard.tsx">
                <CardTitle className="flex items-center space-x-2" data-id="jakbmlc0m" data-path="src/components/PlayerDashboard.tsx">
                  <HelpCircle className="h-5 w-5" data-id="ui8mx55e5" data-path="src/components/PlayerDashboard.tsx" />
                  <span data-id="juvicljy2" data-path="src/components/PlayerDashboard.tsx">Help Center</span>
                </CardTitle>
                <CardDescription data-id="3da6qfvly" data-path="src/components/PlayerDashboard.tsx">
                  Get help with common questions about tennis challenges, events, and more.
                </CardDescription>
              </CardHeader>
              <CardContent data-id="5163rjsd3" data-path="src/components/PlayerDashboard.tsx">
                <FAQ data-id="lmcf9j262" data-path="src/components/PlayerDashboard.tsx" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6" data-id="6z6ya9wk8" data-path="src/components/PlayerDashboard.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-id="8tc4kszv5" data-path="src/components/PlayerDashboard.tsx">
              <PlayerProfileEditor
                userProfile={userProfile}
                onProfileUpdate={loadData} data-id="8jxmr8qcs" data-path="src/components/PlayerDashboard.tsx" />

              <Card data-id="gnhgz44n4" data-path="src/components/PlayerDashboard.tsx">
                <CardHeader data-id="ozmazucb5" data-path="src/components/PlayerDashboard.tsx">
                  <CardTitle data-id="uflyiblvl" data-path="src/components/PlayerDashboard.tsx">Subscription Plans</CardTitle>
                  <CardDescription data-id="udcycddja" data-path="src/components/PlayerDashboard.tsx">
                    Upgrade to unlock premium features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4" data-id="hr196mq7a" data-path="src/components/PlayerDashboard.tsx">
                  <div className="space-y-3" data-id="d0wgecb90" data-path="src/components/PlayerDashboard.tsx">
                    <div className="p-4 border rounded-lg" data-id="7pwh8eepp" data-path="src/components/PlayerDashboard.tsx">
                      <h4 className="font-medium text-green-600" data-id="t06rnb848" data-path="src/components/PlayerDashboard.tsx">Premium Plan</h4>
                      <p className="text-sm text-muted-foreground" data-id="r10dx6fxl" data-path="src/components/PlayerDashboard.tsx">$29.99/month</p>
                      <ul className="text-xs mt-2 space-y-1 text-muted-foreground" data-id="jbrvje3y6" data-path="src/components/PlayerDashboard.tsx">
                        <li data-id="dmg4c0y3b" data-path="src/components/PlayerDashboard.tsx">• Unlimited challenges</li>
                        <li data-id="lmkaqim0l" data-path="src/components/PlayerDashboard.tsx">• Priority support</li>
                        <li data-id="wy6fhi059" data-path="src/components/PlayerDashboard.tsx">• Advanced analytics</li>
                      </ul>
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleUpgrade({
                          name: 'Premium',
                          price: 29.99,
                          features: ['Unlimited challenges', 'Priority support', 'Advanced analytics']
                        })} data-id="lk9r2wjj6" data-path="src/components/PlayerDashboard.tsx">
                        Upgrade to Premium
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg" data-id="6q7s4k6ic" data-path="src/components/PlayerDashboard.tsx">
                      <h4 className="font-medium text-purple-600" data-id="ge3gpmq52" data-path="src/components/PlayerDashboard.tsx">Pro Plan</h4>
                      <p className="text-sm text-muted-foreground" data-id="1b53rtch7" data-path="src/components/PlayerDashboard.tsx">$49.99/month</p>
                      <ul className="text-xs mt-2 space-y-1 text-muted-foreground" data-id="vg2g3p6hf" data-path="src/components/PlayerDashboard.tsx">
                        <li data-id="zc5ozh0e8" data-path="src/components/PlayerDashboard.tsx">• Everything in Premium</li>
                        <li data-id="8turmyb0j" data-path="src/components/PlayerDashboard.tsx">• Tournament hosting</li>
                        <li data-id="m06zfxu4c" data-path="src/components/PlayerDashboard.tsx">• Custom branding</li>
                      </ul>
                      <Button
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleUpgrade({
                          name: 'Pro',
                          price: 49.99,
                          features: ['Everything in Premium', 'Tournament hosting', 'Custom branding', 'White-label solution']
                        })} data-id="pooan0exf" data-path="src/components/PlayerDashboard.tsx">
                        Upgrade to Pro
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-6" data-id="v9gn40598" data-path="src/components/PlayerDashboard.tsx">
            <LocationService
              onLocationUpdate={handleLocationUpdate}
              showMap={true}
              currentLocation={currentLocation} data-id="vch09g5p7" data-path="src/components/PlayerDashboard.tsx" />
          </TabsContent>

          <TabsContent value="guide" className="space-y-6" data-id="h0klwqwvv" data-path="src/components/PlayerDashboard.tsx">
            <UserGuide data-id="a1rmdpqjq" data-path="src/components/PlayerDashboard.tsx" />
          </TabsContent>
        </Tabs>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        subscriptionPlan={selectedPlan}
        onPaymentSuccess={handlePaymentSuccess} data-id="8pf2xpaau" data-path="src/components/PlayerDashboard.tsx" />

    </div>);

};

export default PlayerDashboard;