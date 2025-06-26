import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Calendar, MapPin, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

const MatchHistory: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<number, UserProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  useEffect(() => {
    loadMatches();
    loadUserProfiles();
  }, [user?.ID]);

  useEffect(() => {
    filterMatches();
  }, [matches, searchTerm, statusFilter, resultFilter]);

  const loadMatches = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading match history...');

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

      // Filter matches where the current user participated and are completed
      const userMatches = matchesList.filter((match: Match) =>
      (match.player1_user_id === user.ID ||
      match.player2_user_id === user.ID ||
      match.player3_user_id === user.ID ||
      match.player4_user_id === user.ID) &&
      match.status === 'Completed'
      );

      setMatches(userMatches);
      console.log('User match history loaded:', userMatches.length);
    } catch (error: any) {
      console.error('Error loading match history:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load match history. Please try again.",
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

  const filterMatches = () => {
    let filtered = [...matches];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((match) => {
        const player1Name = getUserName(match.player1_user_id).toLowerCase();
        const player2Name = getUserName(match.player2_user_id).toLowerCase();
        const player3Name = getUserName(match.player3_user_id).toLowerCase();
        const player4Name = getUserName(match.player4_user_id).toLowerCase();
        const location = match.location.toLowerCase();
        const score = match.score_sets.toLowerCase();

        return player1Name.includes(searchTerm.toLowerCase()) ||
        player2Name.includes(searchTerm.toLowerCase()) ||
        player3Name.includes(searchTerm.toLowerCase()) ||
        player4Name.includes(searchTerm.toLowerCase()) ||
        location.includes(searchTerm.toLowerCase()) ||
        score.includes(searchTerm.toLowerCase());
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((match) => match.verification_status === statusFilter);
    }

    // Result filter
    if (resultFilter !== 'all') {
      if (resultFilter === 'won') {
        filtered = filtered.filter((match) => match.winner_user_id === user?.ID);
      } else if (resultFilter === 'lost') {
        filtered = filtered.filter((match) => match.winner_user_id !== user?.ID && match.winner_user_id !== 0);
      }
    }

    setFilteredMatches(filtered);
  };

  const getMatchStats = () => {
    const totalMatches = matches.length;
    const wonMatches = matches.filter((m) => m.winner_user_id === user?.ID && m.verification_status === 'Verified').length;
    const lostMatches = matches.filter((m) => m.winner_user_id !== user?.ID && m.winner_user_id !== 0 && m.verification_status === 'Verified').length;
    const winRate = totalMatches > 0 ? Math.round(wonMatches / totalMatches * 100) : 0;

    return { totalMatches, wonMatches, lostMatches, winRate };
  };

  const getMatchResult = (match: Match): 'won' | 'lost' | 'unknown' => {
    if (match.winner_user_id === user?.ID) return 'won';
    if (match.winner_user_id !== 0 && match.winner_user_id !== user?.ID) return 'lost';
    return 'unknown';
  };

  const getResultBadge = (match: Match) => {
    const result = getMatchResult(match);

    switch (result) {
      case 'won':
        return (
          <Badge className="bg-green-100 text-green-800" data-id="nws72bo1g" data-path="src/components/MatchHistory.tsx">
            <TrendingUp className="w-3 h-3 mr-1" data-id="tye4fbo96" data-path="src/components/MatchHistory.tsx" />
            Won
          </Badge>);

      case 'lost':
        return (
          <Badge className="bg-red-100 text-red-800" data-id="h0yrzt1pk" data-path="src/components/MatchHistory.tsx">
            <TrendingDown className="w-3 h-3 mr-1" data-id="8c45el84a" data-path="src/components/MatchHistory.tsx" />
            Lost
          </Badge>);

      default:
        return (
          <Badge variant="outline" data-id="bpde57zjo" data-path="src/components/MatchHistory.tsx">
            Unknown
          </Badge>);

    }
  };

  const getOpponents = (match: Match): string => {
    const allPlayers = [
    match.player1_user_id,
    match.player2_user_id,
    match.player3_user_id,
    match.player4_user_id].
    filter((id) => id !== 0 && id !== user?.ID);

    return allPlayers.map((id) => getUserName(id)).join(' & ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" data-id="p88ak288o" data-path="src/components/MatchHistory.tsx">
        <div className="text-center" data-id="dqs751rf4" data-path="src/components/MatchHistory.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" data-id="9gscga6u4" data-path="src/components/MatchHistory.tsx"></div>
          <p className="mt-2 text-gray-600" data-id="0ub0q9v2w" data-path="src/components/MatchHistory.tsx">Loading match history...</p>
        </div>
      </div>);

  }

  const stats = getMatchStats();

  return (
    <div className="space-y-6" data-id="nlsojqd00" data-path="src/components/MatchHistory.tsx">
      <div className="flex items-center justify-between" data-id="tgu6qxngr" data-path="src/components/MatchHistory.tsx">
        <h2 className="text-2xl font-bold" data-id="jc7auxntj" data-path="src/components/MatchHistory.tsx">Match History</h2>
        <Badge variant="outline" data-id="zhohr053q" data-path="src/components/MatchHistory.tsx">
          {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''}
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="1epnfeh3x" data-path="src/components/MatchHistory.tsx">
        <Card data-id="wslyyf2m5" data-path="src/components/MatchHistory.tsx">
          <CardContent className="p-4 text-center" data-id="w5l0vnn4s" data-path="src/components/MatchHistory.tsx">
            <div className="flex items-center justify-center space-x-2" data-id="u2cp9w88h" data-path="src/components/MatchHistory.tsx">
              <Trophy className="w-5 h-5 text-blue-600" data-id="amfsbf75y" data-path="src/components/MatchHistory.tsx" />
              <span className="text-2xl font-bold text-blue-600" data-id="pf8vvinja" data-path="src/components/MatchHistory.tsx">{stats.totalMatches}</span>
            </div>
            <p className="text-sm text-gray-600" data-id="y8xt15iqq" data-path="src/components/MatchHistory.tsx">Total Matches</p>
          </CardContent>
        </Card>
        <Card data-id="gxqbb6ama" data-path="src/components/MatchHistory.tsx">
          <CardContent className="p-4 text-center" data-id="iqxcdbv2v" data-path="src/components/MatchHistory.tsx">
            <div className="flex items-center justify-center space-x-2" data-id="fxecv2gbr" data-path="src/components/MatchHistory.tsx">
              <TrendingUp className="w-5 h-5 text-green-600" data-id="hbz1sibbv" data-path="src/components/MatchHistory.tsx" />
              <span className="text-2xl font-bold text-green-600" data-id="shz3g3hvs" data-path="src/components/MatchHistory.tsx">{stats.wonMatches}</span>
            </div>
            <p className="text-sm text-gray-600" data-id="nckhavill" data-path="src/components/MatchHistory.tsx">Matches Won</p>
          </CardContent>
        </Card>
        <Card data-id="z5gbgriwf" data-path="src/components/MatchHistory.tsx">
          <CardContent className="p-4 text-center" data-id="w1yeill4p" data-path="src/components/MatchHistory.tsx">
            <div className="flex items-center justify-center space-x-2" data-id="ydakruqvu" data-path="src/components/MatchHistory.tsx">
              <TrendingDown className="w-5 h-5 text-red-600" data-id="ze9mf0nnz" data-path="src/components/MatchHistory.tsx" />
              <span className="text-2xl font-bold text-red-600" data-id="sti4atghv" data-path="src/components/MatchHistory.tsx">{stats.lostMatches}</span>
            </div>
            <p className="text-sm text-gray-600" data-id="kxe4drxvl" data-path="src/components/MatchHistory.tsx">Matches Lost</p>
          </CardContent>
        </Card>
        <Card data-id="mzzrwckum" data-path="src/components/MatchHistory.tsx">
          <CardContent className="p-4 text-center" data-id="spq70x0oy" data-path="src/components/MatchHistory.tsx">
            <div className="flex items-center justify-center space-x-2" data-id="44a217zu7" data-path="src/components/MatchHistory.tsx">
              <Trophy className="w-5 h-5 text-purple-600" data-id="2gc9ha5m4" data-path="src/components/MatchHistory.tsx" />
              <span className="text-2xl font-bold text-purple-600" data-id="qx342xepx" data-path="src/components/MatchHistory.tsx">{stats.winRate}%</span>
            </div>
            <p className="text-sm text-gray-600" data-id="76061zq11" data-path="src/components/MatchHistory.tsx">Win Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card data-id="h2ahx2ock" data-path="src/components/MatchHistory.tsx">
        <CardContent className="p-4" data-id="58n91a6vs" data-path="src/components/MatchHistory.tsx">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="p7raa66fo" data-path="src/components/MatchHistory.tsx">
            <div data-id="q8ejwaurt" data-path="src/components/MatchHistory.tsx">
              <div className="relative" data-id="ceuiflre1" data-path="src/components/MatchHistory.tsx">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" data-id="oo4y2qxbp" data-path="src/components/MatchHistory.tsx" />
                <Input
                  placeholder="Search matches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" data-id="e4y6v0o5q" data-path="src/components/MatchHistory.tsx" />

              </div>
            </div>
            <div data-id="gwyslb6hu" data-path="src/components/MatchHistory.tsx">
              <Select value={statusFilter} onValueChange={setStatusFilter} data-id="w0bdj2g5k" data-path="src/components/MatchHistory.tsx">
                <SelectTrigger data-id="bt9ssm4d8" data-path="src/components/MatchHistory.tsx">
                  <SelectValue placeholder="Verification Status" data-id="3wacsoub5" data-path="src/components/MatchHistory.tsx" />
                </SelectTrigger>
                <SelectContent data-id="tpsyaaeh8" data-path="src/components/MatchHistory.tsx">
                  <SelectItem value="all" data-id="aqmin84k7" data-path="src/components/MatchHistory.tsx">All Status</SelectItem>
                  <SelectItem value="Verified" data-id="8c12ouwpd" data-path="src/components/MatchHistory.tsx">Verified</SelectItem>
                  <SelectItem value="Pending" data-id="bzld3klyr" data-path="src/components/MatchHistory.tsx">Pending</SelectItem>
                  <SelectItem value="Disputed" data-id="of1go69g4" data-path="src/components/MatchHistory.tsx">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div data-id="sm2g4bgm6" data-path="src/components/MatchHistory.tsx">
              <Select value={resultFilter} onValueChange={setResultFilter} data-id="x752von12" data-path="src/components/MatchHistory.tsx">
                <SelectTrigger data-id="jw77f87fb" data-path="src/components/MatchHistory.tsx">
                  <SelectValue placeholder="Match Result" data-id="7sha1we7j" data-path="src/components/MatchHistory.tsx" />
                </SelectTrigger>
                <SelectContent data-id="vt6wttscb" data-path="src/components/MatchHistory.tsx">
                  <SelectItem value="all" data-id="ght23yffa" data-path="src/components/MatchHistory.tsx">All Results</SelectItem>
                  <SelectItem value="won" data-id="ff7r64fdr" data-path="src/components/MatchHistory.tsx">Won</SelectItem>
                  <SelectItem value="lost" data-id="utvu3oslk" data-path="src/components/MatchHistory.tsx">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div data-id="i6jeegmhv" data-path="src/components/MatchHistory.tsx">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setResultFilter('all');
                }}
                className="w-full" data-id="tspyqg0tu" data-path="src/components/MatchHistory.tsx">

                <Filter className="w-4 h-4 mr-2" data-id="v117idtbj" data-path="src/components/MatchHistory.tsx" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match History List */}
      {filteredMatches.length === 0 ?
      <Card data-id="7f3x34vjw" data-path="src/components/MatchHistory.tsx">
          <CardContent className="p-8 text-center" data-id="ic67h4eab" data-path="src/components/MatchHistory.tsx">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="ug1c70d8t" data-path="src/components/MatchHistory.tsx" />
            <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="rmhisk7xw" data-path="src/components/MatchHistory.tsx">
              {matches.length === 0 ? 'No Match History' : 'No Matches Found'}
            </h3>
            <p className="text-gray-500" data-id="veafbus6q" data-path="src/components/MatchHistory.tsx">
              {matches.length === 0 ?
            "Your completed matches will appear here." :
            "Try adjusting your filters to see more matches."
            }
            </p>
          </CardContent>
        </Card> :

      <div className="grid gap-4" data-id="mneunnleq" data-path="src/components/MatchHistory.tsx">
          {filteredMatches.map((match) =>
        <Card key={match.id} className="hover:shadow-md transition-shadow" data-id="nerqvck03" data-path="src/components/MatchHistory.tsx">
              <CardContent className="p-6" data-id="ujyqmg8bc" data-path="src/components/MatchHistory.tsx">
                <div className="space-y-4" data-id="xyosjt6je" data-path="src/components/MatchHistory.tsx">
                  {/* Match Header */}
                  <div className="flex items-start justify-between" data-id="512ch5udm" data-path="src/components/MatchHistory.tsx">
                    <div className="space-y-2" data-id="y06289e8n" data-path="src/components/MatchHistory.tsx">
                      <div className="flex items-center space-x-2" data-id="7erx4t8oy" data-path="src/components/MatchHistory.tsx">
                        <h3 className="font-semibold text-lg" data-id="gj65bduax" data-path="src/components/MatchHistory.tsx">
                          vs {getOpponents(match)}
                        </h3>
                        {getResultBadge(match)}
                        <Badge
                      className={
                      match.verification_status === 'Verified' ?
                      'bg-green-100 text-green-800' :
                      match.verification_status === 'Disputed' ?
                      'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                      } data-id="ololeynk6" data-path="src/components/MatchHistory.tsx">

                          {match.verification_status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500" data-id="51yz6qo1k" data-path="src/components/MatchHistory.tsx">
                        <span className="flex items-center" data-id="2osg7d75a" data-path="src/components/MatchHistory.tsx">
                          <Calendar className="w-4 h-4 mr-1" data-id="q07xem39o" data-path="src/components/MatchHistory.tsx" />
                          {new Date(match.match_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center" data-id="2wh126n3h" data-path="src/components/MatchHistory.tsx">
                          <MapPin className="w-4 h-4 mr-1" data-id="3e06vnuec" data-path="src/components/MatchHistory.tsx" />
                          {match.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Display */}
                  {match.score_sets &&
              <div className="bg-gray-50 p-4 rounded-lg" data-id="lotuvlzog" data-path="src/components/MatchHistory.tsx">
                      <div className="flex items-center justify-between" data-id="d3ssm8bmj" data-path="src/components/MatchHistory.tsx">
                        <div data-id="2ih0tbobp" data-path="src/components/MatchHistory.tsx">
                          <p className="font-medium text-lg" data-id="0sybkuqje" data-path="src/components/MatchHistory.tsx">Final Score: {match.score_sets}</p>
                          {match.winner_user_id !== 0 &&
                    <p className="text-sm text-gray-600" data-id="s8azqg9ow" data-path="src/components/MatchHistory.tsx">
                              Winner: {getUserName(match.winner_user_id)}
                              {match.winner_user_id === user?.ID && ' (You)'}
                            </p>
                    }
                        </div>
                        {getMatchResult(match) === 'won' &&
                  <Trophy className="w-6 h-6 text-yellow-500" data-id="czjij6nt6" data-path="src/components/MatchHistory.tsx" />
                  }
                      </div>
                    </div>
              }

                  {/* Match Details */}
                  <div className="text-sm text-gray-500 space-y-1" data-id="7tpviux81" data-path="src/components/MatchHistory.tsx">
                    {match.score_entered_by !== 0 &&
                <p data-id="89qrhejs9" data-path="src/components/MatchHistory.tsx">Score entered by: {getUserName(match.score_entered_by)}</p>
                }
                    {match.score_verified_by !== 0 &&
                <p data-id="vcuamhzyh" data-path="src/components/MatchHistory.tsx">Score verified by: {getUserName(match.score_verified_by)}</p>
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

export default MatchHistory;