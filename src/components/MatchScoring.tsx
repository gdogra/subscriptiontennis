import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Edit, Check, X, Clock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface MatchScoringProps {
  onScoreUpdate?: () => void;
}

interface Match {
  id: number;
  challenge_id: number;
  player1_user_id: number;
  player2_user_id: number;
  player3_user_id: number;
  player4_user_id: number;
  match_date: string;
  location: string;
  score_sets: string;
  winner_user_id: number;
  status: string;
  score_entered_by: number;
  score_verified_by: number;
  verification_status: string;
}

interface UserProfile {
  id: number;
  user_id: number;
  display_name: string;
}

const MatchScoring: React.FC<MatchScoringProps> = ({ onScoreUpdate }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<number, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [scoreInput, setScoreInput] = useState('');
  const [winnerInput, setWinnerInput] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadMatches();
    loadUserProfiles();
  }, [user?.ID]);

  const loadMatches = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading matches for scoring...');

      const { data, error } = await window.ezsite.apis.tablePage(21048, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "match_date",
        IsAsc: false
      });

      if (error) {
        throw new Error(error);
      }

      const matchesList = data?.List || [];

      // Filter matches where the current user is a participant
      const userMatches = matchesList.filter((match: Match) =>
      match.player1_user_id === user.ID ||
      match.player2_user_id === user.ID ||
      match.player3_user_id === user.ID ||
      match.player4_user_id === user.ID
      );

      setMatches(userMatches);
      console.log('User matches loaded:', userMatches.length);
    } catch (error: any) {
      console.error('Error loading matches:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load matches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
    const profile = userProfiles.get(userId);
    return profile?.display_name || `User ${userId}`;
  };

  const canEnterScore = (match: Match): boolean => {
    if (!user?.ID) return false;

    // Can enter score if match is scheduled and user is winner, or if no score has been entered yet
    return (
      match.status === 'Scheduled' ||
      match.status === 'Completed' && match.score_entered_by === 0 ||
      match.status === 'Completed' && match.winner_user_id === user.ID && match.verification_status === 'Pending');

  };

  const canVerifyScore = (match: Match): boolean => {
    if (!user?.ID) return false;

    // Can verify if score was entered by opponent and not yet verified
    return (
      match.score_entered_by !== 0 &&
      match.score_entered_by !== user.ID &&
      match.score_verified_by === 0 &&
      match.verification_status === 'Pending' && (
      match.player1_user_id === user.ID || match.player2_user_id === user.ID ||
      match.player3_user_id === user.ID || match.player4_user_id === user.ID));


  };

  const updateChallengeStatus = async (challengeId: number, status: string) => {
    try {
      // Get the challenge first
      const { data: challengeData, error: challengeError } = await window.ezsite.apis.tablePage(21047, {
        PageNo: 1,
        PageSize: 1,
        Filters: [
        {
          name: "ID",
          op: "Equal",
          value: challengeId
        }]

      });

      if (challengeError || !challengeData?.List?.length) {
        console.error('Error loading challenge:', challengeError);
        return;
      }

      const challenge = challengeData.List[0];

      // Update challenge status
      const { error } = await window.ezsite.apis.tableUpdate(21047, {
        ID: challenge.id,
        challenger_user_id: challenge.challenger_user_id,
        opponent_user_id: challenge.opponent_user_id,
        challenge_type: challenge.challenge_type,
        skill_level: challenge.skill_level,
        preferred_date: challenge.preferred_date,
        location_preference: challenge.location_preference,
        status: status,
        message: challenge.message,
        stakes: challenge.stakes,
        doubles_partner_user_id: challenge.doubles_partner_user_id,
        response_deadline: challenge.response_deadline
      });

      if (error) {
        console.error('Error updating challenge status:', error);
      }
    } catch (error) {
      console.error('Error updating challenge status:', error);
    }
  };

  const handleScoreSubmit = async () => {
    if (!editingMatch || !user?.ID) return;

    try {
      console.log('Submitting score for match:', editingMatch.id);

      const { error } = await window.ezsite.apis.tableUpdate(21048, {
        ID: editingMatch.id,
        challenge_id: editingMatch.challenge_id,
        player1_user_id: editingMatch.player1_user_id,
        player2_user_id: editingMatch.player2_user_id,
        player3_user_id: editingMatch.player3_user_id,
        player4_user_id: editingMatch.player4_user_id,
        match_date: editingMatch.match_date,
        location: editingMatch.location,
        score_sets: scoreInput,
        winner_user_id: winnerInput,
        status: 'Completed',
        score_entered_by: user.ID,
        score_verified_by: 0,
        verification_status: 'Pending'
      });

      if (error) {
        throw new Error(error);
      }

      // Create notifications for other players to verify the score
      const otherPlayers = [
      editingMatch.player1_user_id,
      editingMatch.player2_user_id,
      editingMatch.player3_user_id,
      editingMatch.player4_user_id].
      filter((playerId) => playerId !== 0 && playerId !== user.ID);

      for (const playerId of otherPlayers) {
        try {
          await window.ezsite.apis.tableCreate(21049, {
            user_id: playerId,
            title: 'Score Verification Required',
            message: `${getUserName(user.ID)} has entered the score for your recent match: ${scoreInput}. Please verify this score.`,
            notification_type: 'Match',
            related_id: editingMatch.id,
            is_read: false,
            priority: 'High',
            action_url: '/matches'
          });
        } catch (notificationError) {
          console.error('Failed to create notification:', notificationError);
        }
      }

      toast({
        title: "Score Submitted!",
        description: "Score has been recorded and sent for verification."
      });

      // Close modal and reset form
      setIsModalOpen(false);
      setEditingMatch(null);
      setScoreInput('');
      setWinnerInput(0);
      loadMatches();

      // Call the callback if provided
      if (onScoreUpdate) {
        onScoreUpdate();
      }
    } catch (error: any) {
      console.error('Error submitting score:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit score. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
    setScoreInput('');
    setWinnerInput(0);
  };

  const handleScoreVerification = async (match: Match, verified: boolean) => {
    if (!user?.ID) return;

    try {
      console.log('Verifying score for match:', match.id, 'verified:', verified);

      const { error } = await window.ezsite.apis.tableUpdate(21048, {
        ID: match.id,
        challenge_id: match.challenge_id,
        player1_user_id: match.player1_user_id,
        player2_user_id: match.player2_user_id,
        player3_user_id: match.player3_user_id,
        player4_user_id: match.player4_user_id,
        match_date: match.match_date,
        location: match.location,
        score_sets: match.score_sets,
        winner_user_id: match.winner_user_id,
        status: verified ? 'Completed' : 'Score Dispute',
        score_entered_by: match.score_entered_by,
        score_verified_by: verified ? user.ID : 0,
        verification_status: verified ? 'Verified' : 'Disputed'
      });

      if (error) {
        throw new Error(error);
      }

      // Update challenge status to completed if score is verified
      if (verified) {
        await updateChallengeStatus(match.challenge_id, 'Completed');
      }

      // Notify the score submitter
      try {
        await window.ezsite.apis.tableCreate(21049, {
          user_id: match.score_entered_by,
          title: verified ? 'Score Verified' : 'Score Disputed',
          message: verified ?
          `${getUserName(user.ID)} has verified the match score.` :
          `${getUserName(user.ID)} has disputed the match score. Please review and re-enter if necessary.`,
          notification_type: 'Match',
          related_id: match.id,
          is_read: false,
          priority: 'Medium',
          action_url: '/matches'
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      toast({
        title: verified ? "Score Verified" : "Score Disputed",
        description: verified ?
        "The match score has been verified." :
        "The match score has been disputed. The submitter will be notified."
      });

      loadMatches();

      // Call the callback if provided
      if (onScoreUpdate) {
        onScoreUpdate();
      }
    } catch (error: any) {
      console.error('Error verifying score:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify score. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string, verificationStatus: string) => {
    if (status === 'Score Dispute') return 'bg-red-100 text-red-800';
    if (verificationStatus === 'Verified') return 'bg-green-100 text-green-800';
    if (verificationStatus === 'Pending') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Scheduled') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const openScoreEditor = (match: Match) => {
    setEditingMatch(match);
    setScoreInput(match.score_sets || '');
    setWinnerInput(match.winner_user_id || 0);
    setIsModalOpen(true);
  };

  // Check if submit button should be enabled
  const isSubmitEnabled = scoreInput.trim() !== '' && winnerInput !== 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" data-id="8dgmacyli" data-path="src/components/MatchScoring.tsx">
        <div className="text-center" data-id="rihr04asr" data-path="src/components/MatchScoring.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" data-id="csn39cr0g" data-path="src/components/MatchScoring.tsx"></div>
          <p className="mt-2 text-gray-600" data-id="x7wqdwive" data-path="src/components/MatchScoring.tsx">Loading matches...</p>
        </div>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="siyvg2dvd" data-path="src/components/MatchScoring.tsx">
      <div className="flex items-center justify-between" data-id="o8w58nutc" data-path="src/components/MatchScoring.tsx">
        <h2 className="text-2xl font-bold" data-id="ekhmv1zme" data-path="src/components/MatchScoring.tsx">Match Scoring & Verification</h2>
        <Badge variant="outline" data-id="t3xizteei" data-path="src/components/MatchScoring.tsx">
          {matches.length} match{matches.length !== 1 ? 'es' : ''}
        </Badge>
      </div>

      {matches.length === 0 ?
      <Card data-id="yx6gbg6yr" data-path="src/components/MatchScoring.tsx">
          <CardContent className="p-8 text-center" data-id="fotzi2ody" data-path="src/components/MatchScoring.tsx">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="guyse803t" data-path="src/components/MatchScoring.tsx" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="ocyi7syg3" data-path="src/components/MatchScoring.tsx">No Matches Found</h3>
            <p className="text-gray-500" data-id="x5kawkhs7" data-path="src/components/MatchScoring.tsx">
              You don't have any matches to score or verify yet.
            </p>
          </CardContent>
        </Card> :
      <div className="grid gap-4" data-id="adheqrjvf" data-path="src/components/MatchScoring.tsx">
          {matches.map((match) =>
        <Card key={match.id} data-id="m2d976ucq" data-path="src/components/MatchScoring.tsx">
              <CardContent className="p-6" data-id="y4behvab9" data-path="src/components/MatchScoring.tsx">
                <div className="space-y-4" data-id="3ji62jdbt" data-path="src/components/MatchScoring.tsx">
                  {/* Match Header */}
                  <div className="flex items-start justify-between" data-id="mnyrdmcfn" data-path="src/components/MatchScoring.tsx">
                    <div data-id="hoymmbbgz" data-path="src/components/MatchScoring.tsx">
                      <h3 className="font-semibold text-lg" data-id="qqvxr8ocv" data-path="src/components/MatchScoring.tsx">
                        {getUserName(match.player1_user_id)} vs {getUserName(match.player2_user_id)}
                        {match.player3_user_id !== 0 && ` & ${getUserName(match.player3_user_id)}`}
                        {match.player4_user_id !== 0 && ` vs ${getUserName(match.player4_user_id)}`}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1" data-id="aa5vzje5m" data-path="src/components/MatchScoring.tsx">
                        <span data-id="0nlsalscr" data-path="src/components/MatchScoring.tsx">{new Date(match.match_date).toLocaleDateString()}</span>
                        <span data-id="ul2msasow" data-path="src/components/MatchScoring.tsx">{match.location}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(match.status, match.verification_status)} data-id="pcv5fyw2i" data-path="src/components/MatchScoring.tsx">
                      {match.verification_status !== 'Pending' ? match.verification_status : match.status}
                    </Badge>
                  </div>

                  {/* Score Display */}
                  {match.score_sets &&
              <div className="bg-gray-50 p-4 rounded-lg" data-id="s0zhlgt37" data-path="src/components/MatchScoring.tsx">
                      <div className="flex items-center justify-between" data-id="k233owz5i" data-path="src/components/MatchScoring.tsx">
                        <div data-id="rdskvdt1p" data-path="src/components/MatchScoring.tsx">
                          <p className="font-medium" data-id="2inq6xbnc" data-path="src/components/MatchScoring.tsx">Score: {match.score_sets}</p>
                          {match.winner_user_id !== 0 &&
                    <p className="text-sm text-gray-600" data-id="e6m9q8ygl" data-path="src/components/MatchScoring.tsx">
                              Winner: {getUserName(match.winner_user_id)}
                            </p>
                    }
                        </div>
                        {match.score_entered_by !== 0 &&
                  <div className="text-right text-sm text-gray-500" data-id="acqyiiocz" data-path="src/components/MatchScoring.tsx">
                            <p data-id="asnhftm83" data-path="src/components/MatchScoring.tsx">Entered by: {getUserName(match.score_entered_by)}</p>
                            {match.score_verified_by !== 0 &&
                    <p data-id="obn3hdhva" data-path="src/components/MatchScoring.tsx">Verified by: {getUserName(match.score_verified_by)}</p>
                    }
                          </div>
                  }
                      </div>
                    </div>
              }

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2" data-id="xxx6qc0iq" data-path="src/components/MatchScoring.tsx">
                    {canEnterScore(match) &&
                <Dialog open={isModalOpen && editingMatch?.id === match.id} onOpenChange={(open) => {
                  if (!open) handleCancel();
                }} data-id="r6fjxa53n" data-path="src/components/MatchScoring.tsx">
                        <DialogTrigger asChild data-id="7967rl2zz" data-path="src/components/MatchScoring.tsx">
                          <Button variant="outline" size="sm" onClick={() => openScoreEditor(match)} data-id="5l8vj8esy" data-path="src/components/MatchScoring.tsx">
                            <Edit className="w-4 h-4 mr-2" data-id="mal59u6l2" data-path="src/components/MatchScoring.tsx" />
                            {match.score_sets ? 'Edit Score' : 'Enter Score'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent data-id="3pqqtmymi" data-path="src/components/MatchScoring.tsx">
                          <DialogHeader data-id="h4vwin7i6" data-path="src/components/MatchScoring.tsx">
                            <DialogTitle data-id="w1wt7e6fr" data-path="src/components/MatchScoring.tsx">Enter Match Score</DialogTitle>
                            <DialogDescription data-id="p2lfzbtrc" data-path="src/components/MatchScoring.tsx">
                              Enter the score for this match. The opponent will need to verify it.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4" data-id="aeiz2qcl0" data-path="src/components/MatchScoring.tsx">
                            <div data-id="pa6op8fby" data-path="src/components/MatchScoring.tsx">
                              <Label htmlFor="score" data-id="1c8aafkzc" data-path="src/components/MatchScoring.tsx">Score (e.g., "6-4, 7-5")</Label>
                              <Input
                          id="score"
                          value={scoreInput}
                          onChange={(e) => setScoreInput(e.target.value)}
                          placeholder="6-4, 7-5" data-id="4d6r3enkk" data-path="src/components/MatchScoring.tsx" />
                            </div>
                            <div data-id="vqrolzuu0" data-path="src/components/MatchScoring.tsx">
                              <Label htmlFor="winner" data-id="n8cme01va" data-path="src/components/MatchScoring.tsx">Winner</Label>
                              <select
                          id="winner"
                          value={winnerInput}
                          onChange={(e) => setWinnerInput(Number(e.target.value))}
                          className="w-full p-2 border rounded-md" data-id="h94xzdl2i" data-path="src/components/MatchScoring.tsx">
                                <option value={0} data-id="f6r356d02" data-path="src/components/MatchScoring.tsx">Select winner</option>
                                <option value={match.player1_user_id} data-id="a0ks4o433" data-path="src/components/MatchScoring.tsx">{getUserName(match.player1_user_id)}</option>
                                <option value={match.player2_user_id} data-id="92a0tb8tk" data-path="src/components/MatchScoring.tsx">{getUserName(match.player2_user_id)}</option>
                                {match.player3_user_id !== 0 &&
                          <option value={match.player3_user_id} data-id="msmmgqpye" data-path="src/components/MatchScoring.tsx">{getUserName(match.player3_user_id)}</option>
                          }
                                {match.player4_user_id !== 0 &&
                          <option value={match.player4_user_id} data-id="sbcuuupa8" data-path="src/components/MatchScoring.tsx">{getUserName(match.player4_user_id)}</option>
                          }
                              </select>
                            </div>
                            <div className="flex justify-end space-x-2" data-id="xdbap66wy" data-path="src/components/MatchScoring.tsx">
                              <Button variant="outline" onClick={handleCancel} data-id="qo3g4anz5" data-path="src/components/MatchScoring.tsx">
                                Cancel
                              </Button>
                              <Button
                          onClick={handleScoreSubmit}
                          disabled={!isSubmitEnabled} data-id="4w4bxgb3z" data-path="src/components/MatchScoring.tsx">
                                Submit Score
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                }

                    {canVerifyScore(match) &&
                <div className="flex items-center space-x-2" data-id="hye3fa35k" data-path="src/components/MatchScoring.tsx">
                        <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreVerification(match, true)}
                    className="text-green-600 hover:text-green-700" data-id="m1t7acs4d" data-path="src/components/MatchScoring.tsx">
                          <Check className="w-4 h-4 mr-2" data-id="ilgvgn05y" data-path="src/components/MatchScoring.tsx" />
                          Verify Score
                        </Button>
                        <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScoreVerification(match, false)}
                    className="text-red-600 hover:text-red-700" data-id="irvlh0hii" data-path="src/components/MatchScoring.tsx">
                          <X className="w-4 h-4 mr-2" data-id="1ljhpv51h" data-path="src/components/MatchScoring.tsx" />
                          Dispute
                        </Button>
                      </div>
                }

                    {match.verification_status === 'Pending' && match.score_entered_by === user?.ID &&
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700" data-id="aoqhqei2m" data-path="src/components/MatchScoring.tsx">
                        <Clock className="w-3 h-3 mr-1" data-id="ufrrft8e3" data-path="src/components/MatchScoring.tsx" />
                        Awaiting Verification
                      </Badge>
                }
                  </div>
                </div>
              </CardContent>
            </Card>
        )}
        </div>
      }
    </div>);

};

export default MatchScoring;