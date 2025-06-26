import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Calendar, MapPin, Users, MessageSquare, CheckCircle, XCircle, Clock, Plus, User, History, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ChallengeCreator from '@/components/ChallengeCreator';
import MatchScoring from '@/components/MatchScoring';
import MatchHistory from '@/components/MatchHistory';

interface Challenge {
  id: number;
  challenger_user_id: number;
  opponent_user_id: number;
  challenge_type: string;
  skill_level: string;
  preferred_date: string;
  location_preference: string;
  status: string;
  message: string;
  stakes: string;
  doubles_partner_user_id: number;
  response_deadline: string;
}

interface Match {
  id: number;
  challenge_id: number;
  winner_user_id: number;
  verification_status: string;
  score_sets: string;
}

interface UserProfile {
  id: number;
  user_id: number;
  display_name: string;
}

const MyChallenges: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<number, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (user?.ID) {
      loadChallenges();
      loadMatches();
      loadUserProfiles();
    }
  }, [user?.ID]);

  const loadChallenges = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading challenges for user:', user.ID);
      setLoading(true);

      const { data, error } = await window.ezsite.apis.tablePage(21047, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
        IsAsc: false
      });

      if (error) {
        throw new Error(error);
      }

      const challengesList = data?.List || [];

      // Filter challenges where user is involved
      const userChallenges = challengesList.filter((challenge: Challenge) =>
      challenge.challenger_user_id === user.ID ||
      challenge.opponent_user_id === user.ID ||
      challenge.doubles_partner_user_id === user.ID ||
      challenge.opponent_user_id === 0 // Open challenges
      );

      setChallenges(userChallenges);
      console.log('User challenges loaded:', userChallenges.length);
    } catch (error: any) {
      console.error('Error loading challenges:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load challenges. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    if (!user?.ID) return;

    try {
      const { data, error } = await window.ezsite.apis.tablePage(21048, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "id",
        IsAsc: false
      });

      if (error) {
        console.error('Error loading matches:', error);
        return;
      }

      const matchesList = data?.List || [];
      setMatches(matchesList);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const loadUserProfiles = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(21045, {
        PageNo: 1,
        PageSize: 100
      });

      if (error) {
        console.error('Error loading user profiles:', error);
        return;
      }

      const profiles = data?.List || [];
      const profileMap = new Map<number, UserProfile>();
      profiles.forEach((profile: UserProfile) => {
        profileMap.set(profile.user_id, profile);
      });
      setUserProfiles(profileMap);
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  };

  const getUserName = (userId: number): string => {
    if (userId === 0) return 'Open Challenge';
    const profile = userProfiles.get(userId);
    return profile?.display_name || `User ${userId}`;
  };

  const acceptChallenge = async (challenge: Challenge) => {
    if (!user?.ID) return;

    try {
      console.log('Accepting challenge:', challenge.id);

      const { error } = await window.ezsite.apis.tableUpdate(21047, {
        ID: challenge.id,
        challenger_user_id: challenge.challenger_user_id,
        opponent_user_id: challenge.opponent_user_id === 0 ? user.ID : challenge.opponent_user_id,
        challenge_type: challenge.challenge_type,
        skill_level: challenge.skill_level,
        preferred_date: challenge.preferred_date,
        location_preference: challenge.location_preference,
        status: 'Accepted',
        message: challenge.message,
        stakes: challenge.stakes,
        doubles_partner_user_id: challenge.doubles_partner_user_id,
        response_deadline: challenge.response_deadline
      });

      if (error) {
        throw new Error(error);
      }

      // Create a match record
      try {
        await window.ezsite.apis.tableCreate(21048, {
          challenge_id: challenge.id,
          player1_user_id: challenge.challenger_user_id,
          player2_user_id: challenge.opponent_user_id === 0 ? user.ID : challenge.opponent_user_id,
          player3_user_id: challenge.doubles_partner_user_id || 0,
          player4_user_id: 0,
          match_date: challenge.preferred_date,
          location: challenge.location_preference,
          score_sets: '',
          winner_user_id: 0,
          status: 'Scheduled',
          score_entered_by: 0,
          score_verified_by: 0,
          verification_status: 'Pending'
        });
      } catch (matchError) {
        console.error('Failed to create match record:', matchError);
      }

      // Notify challenger
      try {
        await window.ezsite.apis.tableCreate(21049, {
          user_id: challenge.challenger_user_id,
          title: 'Challenge Accepted!',
          message: `${getUserName(user.ID)} has accepted your ${challenge.challenge_type.toLowerCase()} challenge.`,
          notification_type: 'Challenge',
          related_id: challenge.id,
          is_read: false,
          priority: 'High',
          action_url: '/challenges'
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      toast({
        title: "Challenge Accepted!",
        description: "You've accepted the challenge. Good luck with your match!"
      });

      loadChallenges();
    } catch (error: any) {
      console.error('Error accepting challenge:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept challenge. Please try again.",
        variant: "destructive"
      });
    }
  };

  const declineChallenge = async (challenge: Challenge) => {
    if (!user?.ID) return;

    try {
      console.log('Declining challenge:', challenge.id);

      const { error } = await window.ezsite.apis.tableUpdate(21047, {
        ID: challenge.id,
        challenger_user_id: challenge.challenger_user_id,
        opponent_user_id: challenge.opponent_user_id,
        challenge_type: challenge.challenge_type,
        skill_level: challenge.skill_level,
        preferred_date: challenge.preferred_date,
        location_preference: challenge.location_preference,
        status: 'Declined',
        message: challenge.message,
        stakes: challenge.stakes,
        doubles_partner_user_id: challenge.doubles_partner_user_id,
        response_deadline: challenge.response_deadline
      });

      if (error) {
        throw new Error(error);
      }

      // Notify challenger
      try {
        await window.ezsite.apis.tableCreate(21049, {
          user_id: challenge.challenger_user_id,
          title: 'Challenge Declined',
          message: `${getUserName(user.ID)} has declined your ${challenge.challenge_type.toLowerCase()} challenge.`,
          notification_type: 'Challenge',
          related_id: challenge.id,
          is_read: false,
          priority: 'Medium',
          action_url: '/challenges'
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      toast({
        title: "Challenge Declined",
        description: "You've declined the challenge."
      });

      loadChallenges();
    } catch (error: any) {
      console.error('Error declining challenge:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to decline challenge. Please try again.",
        variant: "destructive"
      });
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" data-id="yhzam634k" data-path="src/components/MyChallenge.tsx" />;
      case 'declined':
        return <XCircle className="w-4 h-4" data-id="d0c3dbibl" data-path="src/components/MyChallenge.tsx" />;
      case 'pending':
        return <Clock className="w-4 h-4" data-id="p36dtkrvn" data-path="src/components/MyChallenge.tsx" />;
      default:
        return <Trophy className="w-4 h-4" data-id="3g84krkm4" data-path="src/components/MyChallenge.tsx" />;
    }
  };

  const filterChallenges = (status: string) => {
    switch (status) {
      case 'active':
        return challenges.filter((c) => ['Open', 'Pending', 'Accepted'].includes(c.status));
      default:
        return challenges;
    }
  };

  const getChallengeStats = () => {
    const activeChallenges = challenges.filter((c) => ['Open', 'Pending', 'Accepted'].includes(c.status)).length;
    const completedMatches = challenges.filter((c) => c.status === 'Completed').length;
    const wonMatches = matches.filter((m) => m.winner_user_id === user?.ID && m.verification_status === 'Verified').length;

    return { activeChallenges, completedMatches, wonMatches };
  };

  const canAcceptChallenge = (challenge: Challenge): boolean => {
    if (!user?.ID) return false;
    return (
      challenge.status === 'Open' && challenge.opponent_user_id === 0 ||
      challenge.status === 'Pending' && challenge.opponent_user_id === user.ID);
  };

  const canDeclineChallenge = (challenge: Challenge): boolean => {
    if (!user?.ID) return false;
    return challenge.status === 'Pending' && challenge.opponent_user_id === user.ID;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" data-id="7162zexh5" data-path="src/components/MyChallenge.tsx">
        <div className="text-center" data-id="i0vv86ira" data-path="src/components/MyChallenge.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" data-id="z6pefouo1" data-path="src/components/MyChallenge.tsx"></div>
          <p className="mt-2 text-gray-600" data-id="2n0lyyand" data-path="src/components/MyChallenge.tsx">Loading challenges...</p>
        </div>
      </div>);

  }

  const stats = getChallengeStats();

  return (
    <div className="space-y-6" data-id="fqcejplg4" data-path="src/components/MyChallenge.tsx">
      <div className="flex items-center justify-between" data-id="rg3thor92" data-path="src/components/MyChallenge.tsx">
        <h2 className="text-2xl font-bold" data-id="bzlzaj2h1" data-path="src/components/MyChallenge.tsx">My Tennis Challenges</h2>
        <div className="flex items-center space-x-2" data-id="76tpntbzi" data-path="src/components/MyChallenge.tsx">
          <ChallengeCreator onChallengeCreated={loadChallenges} data-id="m2ease5n4" data-path="src/components/MyChallenge.tsx" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" data-id="44svnbsq6" data-path="src/components/MyChallenge.tsx">
        <Card data-id="amyqy61mr" data-path="src/components/MyChallenge.tsx">
          <CardContent className="p-4 text-center" data-id="x9wpd1om7" data-path="src/components/MyChallenge.tsx">
            <div className="flex items-center justify-center space-x-2" data-id="7pbshp3u5" data-path="src/components/MyChallenge.tsx">
              <Target className="w-5 h-5 text-blue-600" data-id="0ok9of2x3" data-path="src/components/MyChallenge.tsx" />
              <span className="text-2xl font-bold text-blue-600" data-id="2nn30zbns" data-path="src/components/MyChallenge.tsx">{stats.activeChallenges}</span>
            </div>
            <p className="text-sm text-gray-600" data-id="0eti2tjz8" data-path="src/components/MyChallenge.tsx">Active Challenges</p>
          </CardContent>
        </Card>
        <Card data-id="eflezz59p" data-path="src/components/MyChallenge.tsx">
          <CardContent className="p-4 text-center" data-id="9go97b3aq" data-path="src/components/MyChallenge.tsx">
            <div className="flex items-center justify-center space-x-2" data-id="gsdnaw4mu" data-path="src/components/MyChallenge.tsx">
              <Trophy className="w-5 h-5 text-green-600" data-id="sul84p4c4" data-path="src/components/MyChallenge.tsx" />
              <span className="text-2xl font-bold text-green-600" data-id="0oaggdlcy" data-path="src/components/MyChallenge.tsx">{stats.wonMatches}</span>
            </div>
            <p className="text-sm text-gray-600" data-id="iwuwhpy1v" data-path="src/components/MyChallenge.tsx">Matches Won</p>
          </CardContent>
        </Card>
        <Card data-id="0pfr37578" data-path="src/components/MyChallenge.tsx">
          <CardContent className="p-4 text-center" data-id="isjgbney0" data-path="src/components/MyChallenge.tsx">
            <div className="flex items-center justify-center space-x-2" data-id="echec6n8x" data-path="src/components/MyChallenge.tsx">
              <History className="w-5 h-5 text-purple-600" data-id="h5m3wkh2x" data-path="src/components/MyChallenge.tsx" />
              <span className="text-2xl font-bold text-purple-600" data-id="6xf07s6e9" data-path="src/components/MyChallenge.tsx">{stats.completedMatches}</span>
            </div>
            <p className="text-sm text-gray-600" data-id="69zg7fm54" data-path="src/components/MyChallenge.tsx">Total Completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" data-id="xlazv6bfa" data-path="src/components/MyChallenge.tsx">
        <TabsList className="grid w-full grid-cols-3" data-id="yewzlof1q" data-path="src/components/MyChallenge.tsx">
          <TabsTrigger value="active" data-id="kt9sjk8x1" data-path="src/components/MyChallenge.tsx">Active Challenges</TabsTrigger>
          <TabsTrigger value="scoring" data-id="u82ymfo4q" data-path="src/components/MyChallenge.tsx">Match Scoring</TabsTrigger>
          <TabsTrigger value="history" data-id="zdrgu96uf" data-path="src/components/MyChallenge.tsx">Match History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4" data-id="epunycf0j" data-path="src/components/MyChallenge.tsx">
          {filterChallenges('active').length === 0 ?
          <Card data-id="5yj34o1cb" data-path="src/components/MyChallenge.tsx">
              <CardContent className="p-8 text-center" data-id="2mxam7hla" data-path="src/components/MyChallenge.tsx">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="s68u510jx" data-path="src/components/MyChallenge.tsx" />
                <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="6c9ugtl7f" data-path="src/components/MyChallenge.tsx">No Active Challenges</h3>
                <p className="text-gray-500 mb-4" data-id="trjaxre8q" data-path="src/components/MyChallenge.tsx">
                  You don't have any active challenges yet. Create one to get started!
                </p>
              </CardContent>
            </Card> :
          filterChallenges('active').map((challenge) =>
          <Card key={challenge.id} className="hover:shadow-md transition-shadow" data-id="9a78nppnp" data-path="src/components/MyChallenge.tsx">
                <CardContent className="p-6" data-id="f5l33dk0y" data-path="src/components/MyChallenge.tsx">
                  <div className="space-y-4" data-id="p13god5zt" data-path="src/components/MyChallenge.tsx">
                    {/* Challenge Header */}
                    <div className="flex items-start justify-between" data-id="iy7uhn279" data-path="src/components/MyChallenge.tsx">
                      <div className="space-y-2" data-id="nw9u7k61w" data-path="src/components/MyChallenge.tsx">
                        <div className="flex items-center space-x-2" data-id="dpv9d26sr" data-path="src/components/MyChallenge.tsx">
                          <h3 className="font-semibold text-lg" data-id="un533u6r6" data-path="src/components/MyChallenge.tsx">
                            {challenge.challenge_type} Challenge
                          </h3>
                          <Badge className={getStatusColor(challenge.status)} data-id="ee095qdyb" data-path="src/components/MyChallenge.tsx">
                            {getStatusIcon(challenge.status)}
                            <span className="ml-1" data-id="7rtb4ajt1" data-path="src/components/MyChallenge.tsx">{challenge.status}</span>
                          </Badge>
                          <Badge variant="outline" data-id="s78kq0eia" data-path="src/components/MyChallenge.tsx">
                            {challenge.skill_level}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600" data-id="qe0nisfzb" data-path="src/components/MyChallenge.tsx">
                          <div className="flex items-center space-x-4" data-id="1obqvi0sq" data-path="src/components/MyChallenge.tsx">
                            <span className="flex items-center" data-id="83ujv2tx2" data-path="src/components/MyChallenge.tsx">
                              <User className="w-4 h-4 mr-1" data-id="rb077m9qw" data-path="src/components/MyChallenge.tsx" />
                              Challenger: {getUserName(challenge.challenger_user_id)}
                            </span>
                            {challenge.opponent_user_id !== 0 &&
                        <span className="flex items-center" data-id="7q8ev1yw7" data-path="src/components/MyChallenge.tsx">
                                <User className="w-4 h-4 mr-1" data-id="zxeqmem2m" data-path="src/components/MyChallenge.tsx" />
                                Opponent: {getUserName(challenge.opponent_user_id)}
                              </span>
                        }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Challenge Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" data-id="8tqifr450" data-path="src/components/MyChallenge.tsx">
                      <div className="flex items-center text-gray-600" data-id="dpiyizn1e" data-path="src/components/MyChallenge.tsx">
                        <Calendar className="w-4 h-4 mr-2" data-id="6wfgtms9d" data-path="src/components/MyChallenge.tsx" />
                        <span data-id="khgpx9moc" data-path="src/components/MyChallenge.tsx">
                          {challenge.preferred_date ?
                      new Date(challenge.preferred_date).toLocaleDateString() :
                      'Date TBD'
                      }
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600" data-id="7xd4ufk55" data-path="src/components/MyChallenge.tsx">
                        <MapPin className="w-4 h-4 mr-2" data-id="x6gsfqd1p" data-path="src/components/MyChallenge.tsx" />
                        <span className="truncate" data-id="0dmdvhpfs" data-path="src/components/MyChallenge.tsx">
                          {challenge.location_preference || 'Location TBD'}
                        </span>
                      </div>
                      {challenge.stakes &&
                  <div className="flex items-center text-gray-600" data-id="b8fm3orah" data-path="src/components/MyChallenge.tsx">
                          <Trophy className="w-4 h-4 mr-2" data-id="i67sn9zxm" data-path="src/components/MyChallenge.tsx" />
                          <span className="truncate" data-id="31oehnwp4" data-path="src/components/MyChallenge.tsx">Stakes: {challenge.stakes}</span>
                        </div>
                  }
                    </div>

                    {/* Challenge Message */}
                    {challenge.message &&
                <div className="bg-gray-50 p-4 rounded-lg" data-id="wjehrgvj7" data-path="src/components/MyChallenge.tsx">
                        <div className="flex items-start space-x-2" data-id="rnz1vvo7w" data-path="src/components/MyChallenge.tsx">
                          <MessageSquare className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" data-id="jcjqhwkkx" data-path="src/components/MyChallenge.tsx" />
                          <p className="text-sm text-gray-700" data-id="wa1jq0zir" data-path="src/components/MyChallenge.tsx">{challenge.message}</p>
                        </div>
                      </div>
                }

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t" data-id="gbqdq2yhe" data-path="src/components/MyChallenge.tsx">
                      <div className="flex items-center space-x-2" data-id="69k0ul6am" data-path="src/components/MyChallenge.tsx">
                        {challenge.response_deadline &&
                    <div className="text-xs text-gray-500" data-id="pensrqqta" data-path="src/components/MyChallenge.tsx">
                            Respond by: {new Date(challenge.response_deadline).toLocaleDateString()}
                          </div>
                    }
                      </div>
                      <div className="flex items-center space-x-2" data-id="yizv0ax9t" data-path="src/components/MyChallenge.tsx">
                        {canAcceptChallenge(challenge) &&
                    <Button
                      size="sm"
                      onClick={() => acceptChallenge(challenge)}
                      className="bg-green-600 hover:bg-green-700" data-id="wl3uakegd" data-path="src/components/MyChallenge.tsx">
                            <CheckCircle className="w-4 h-4 mr-2" data-id="qgfojdhmm" data-path="src/components/MyChallenge.tsx" />
                            Accept
                          </Button>
                    }
                        {canDeclineChallenge(challenge) &&
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => declineChallenge(challenge)}
                      className="text-red-600 hover:text-red-700" data-id="vms04oyzj" data-path="src/components/MyChallenge.tsx">
                            <XCircle className="w-4 h-4 mr-2" data-id="19qtc0dpm" data-path="src/components/MyChallenge.tsx" />
                            Decline
                          </Button>
                    }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          )
          }
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4" data-id="owtuznq0l" data-path="src/components/MyChallenge.tsx">
          <MatchScoring onScoreUpdate={() => {
            loadChallenges();
            loadMatches();
          }} data-id="or7b3pmv8" data-path="src/components/MyChallenge.tsx" />
        </TabsContent>

        <TabsContent value="history" className="space-y-4" data-id="wwuu4ee16" data-path="src/components/MyChallenge.tsx">
          <MatchHistory data-id="1gnu8nx6b" data-path="src/components/MyChallenge.tsx" />
        </TabsContent>
      </Tabs>
    </div>);

};

export default MyChallenges;