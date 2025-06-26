import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ChallengeCreator from '@/components/ChallengeCreator';
import SeedFAQButton from '@/components/SeedFAQButton';
import { Users, Trophy, Calendar, DollarSign, Plus, Settings, BarChart3, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
}

interface UserProfile {
  id: number;
  user_id: number;
  display_name: string;
  skill_level: string;
  subscription_tier: string;
}

interface Transaction {
  id: number;
  user_id: number;
  transaction_type: string;
  amount: number;
  status: string;
  description: string;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading admin dashboard data...');
      setError(null);

      // Load all data with error handling
      const [challengesResponse, profilesResponse, transactionsResponse] = await Promise.allSettled([
      window.ezsite.apis.tablePage(21047, { PageNo: 1, PageSize: 100, OrderByField: "id", IsAsc: false }),
      window.ezsite.apis.tablePage(21045, { PageNo: 1, PageSize: 100, OrderByField: "id", IsAsc: false }),
      window.ezsite.apis.tablePage(21050, { PageNo: 1, PageSize: 100, OrderByField: "id", IsAsc: false })]
      );

      // Handle challenges
      if (challengesResponse.status === 'fulfilled' && !challengesResponse.value.error) {
        setChallenges(challengesResponse.value.data?.List || []);
      } else {
        console.error('Failed to load challenges:', challengesResponse);
      }

      // Handle user profiles
      if (profilesResponse.status === 'fulfilled' && !profilesResponse.value.error) {
        setUserProfiles(profilesResponse.value.data?.List || []);
      } else {
        console.error('Failed to load user profiles:', profilesResponse);
      }

      // Handle transactions
      if (transactionsResponse.status === 'fulfilled' && !transactionsResponse.value.error) {
        setTransactions(transactionsResponse.value.data?.List || []);
      } else {
        console.error('Failed to load transactions:', transactionsResponse);
      }

      console.log('Admin dashboard data loaded successfully');
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

  const handleChallengeCreated = () => {
    // Reload challenges after creation
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalChallenges: challenges.length,
    activeChallenges: challenges.filter((c) => c.status === 'Open' || c.status === 'Accepted').length,
    totalUsers: userProfiles.length,
    totalRevenue: transactions.
    filter((t) => t.status === 'Completed').
    reduce((sum, t) => sum + t.amount, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="y0kr0ynr4" data-path="src/components/AdminDashboard.tsx">
        <div className="text-center" data-id="t6bwjj77n" data-path="src/components/AdminDashboard.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" data-id="2fl3nx8g5" data-path="src/components/AdminDashboard.tsx"></div>
          <p className="mt-4 text-gray-600" data-id="bg37oa739" data-path="src/components/AdminDashboard.tsx">Loading dashboard...</p>
        </div>
      </div>);

  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="pikevxtkc" data-path="src/components/AdminDashboard.tsx">
        <div className="text-center" data-id="pzgc92nii" data-path="src/components/AdminDashboard.tsx">
          <div className="text-red-600 mb-4" data-id="b19bqk7h4" data-path="src/components/AdminDashboard.tsx">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-id="9xx5iqunu" data-path="src/components/AdminDashboard.tsx">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" data-id="ubk1j80l2" data-path="src/components/AdminDashboard.tsx" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2" data-id="jilomvqb1" data-path="src/components/AdminDashboard.tsx">Dashboard Error</h2>
          <p className="text-gray-600 mb-4" data-id="v24h3ffmc" data-path="src/components/AdminDashboard.tsx">{error}</p>
          <Button onClick={() => {setError(null);loadData();}} data-id="gyl2qve80" data-path="src/components/AdminDashboard.tsx">
            Try Again
          </Button>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50" data-id="a51ye7tfk" data-path="src/components/AdminDashboard.tsx">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4" data-id="5571bk7wf" data-path="src/components/AdminDashboard.tsx">
        <div className="flex items-center justify-between" data-id="jdmvxlawb" data-path="src/components/AdminDashboard.tsx">
          <div className="flex items-center space-x-4" data-id="sqtv45xiy" data-path="src/components/AdminDashboard.tsx">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center" data-id="vlvge3ioq" data-path="src/components/AdminDashboard.tsx">
              <Settings className="w-5 h-5 text-white" data-id="tklpk5ag9" data-path="src/components/AdminDashboard.tsx" />
            </div>
            <div data-id="pdvdjblsx" data-path="src/components/AdminDashboard.tsx">
              <h1 className="text-2xl font-bold text-gray-900" data-id="qjtjbj0wv" data-path="src/components/AdminDashboard.tsx">Admin Dashboard</h1>
              <p className="text-gray-600" data-id="3jyto06tg" data-path="src/components/AdminDashboard.tsx">Welcome back, {user?.Name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4" data-id="9i1s5vkfz" data-path="src/components/AdminDashboard.tsx">
            <Link to="/faq" data-id="5q20oqvcp" data-path="src/components/AdminDashboard.tsx">
              <Button variant="outline" size="sm" data-id="10r1szkmr" data-path="src/components/AdminDashboard.tsx">
                <HelpCircle className="mr-2 h-4 w-4" data-id="ffyib8h3f" data-path="src/components/AdminDashboard.tsx" />
                FAQ
              </Button>
            </Link>
            <Badge variant="outline" className="bg-emerald-50" data-id="6un3skr64" data-path="src/components/AdminDashboard.tsx">
              ADMIN
            </Badge>
            <Button variant="outline" onClick={logout} data-id="y1fkzj7aj" data-path="src/components/AdminDashboard.tsx">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6" data-id="3iwhva10j" data-path="src/components/AdminDashboard.tsx">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-id="0ivc5y81n" data-path="src/components/AdminDashboard.tsx">
          <Card data-id="ypbjyal7e" data-path="src/components/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="cftn4q942" data-path="src/components/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="ovxzumssr" data-path="src/components/AdminDashboard.tsx">Total Challenges</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" data-id="q68acki82" data-path="src/components/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="r8eruovai" data-path="src/components/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="cbq91nmbq" data-path="src/components/AdminDashboard.tsx">{stats.totalChallenges}</div>
              <p className="text-xs text-muted-foreground" data-id="abl8qkugq" data-path="src/components/AdminDashboard.tsx">
                {stats.activeChallenges} active
              </p>
            </CardContent>
          </Card>
          
          <Card data-id="9o0jdgqtz" data-path="src/components/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="kk3k5cfi7" data-path="src/components/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="4spm8y3ud" data-path="src/components/AdminDashboard.tsx">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" data-id="oag5mn4tf" data-path="src/components/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="jnoiub6da" data-path="src/components/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="kwcwa81ji" data-path="src/components/AdminDashboard.tsx">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground" data-id="s0cealxus" data-path="src/components/AdminDashboard.tsx">
                Registered players
              </p>
            </CardContent>
          </Card>
          
          <Card data-id="eoe3etkz8" data-path="src/components/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="g1ywenu7i" data-path="src/components/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="g4k93uba8" data-path="src/components/AdminDashboard.tsx">Transactions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" data-id="ng2n4w6d1" data-path="src/components/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="lkb5ex174" data-path="src/components/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="3oxv5hrsy" data-path="src/components/AdminDashboard.tsx">{transactions.length}</div>
              <p className="text-xs text-muted-foreground" data-id="d6jz1laa1" data-path="src/components/AdminDashboard.tsx">
                Total processed
              </p>
            </CardContent>
          </Card>
          
          <Card data-id="2dhh0vnzc" data-path="src/components/AdminDashboard.tsx">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" data-id="86sr8uzop" data-path="src/components/AdminDashboard.tsx">
              <CardTitle className="text-sm font-medium" data-id="vvvf3j0fu" data-path="src/components/AdminDashboard.tsx">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" data-id="2k0j2499m" data-path="src/components/AdminDashboard.tsx" />
            </CardHeader>
            <CardContent data-id="jug20vdkp" data-path="src/components/AdminDashboard.tsx">
              <div className="text-2xl font-bold" data-id="thwra9zhd" data-path="src/components/AdminDashboard.tsx">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground" data-id="hir8tjdm7" data-path="src/components/AdminDashboard.tsx">
                Total earnings
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="challenges" className="space-y-6" data-id="mlflmnw1y" data-path="src/components/AdminDashboard.tsx">
          <TabsList data-id="8c9ihhe46" data-path="src/components/AdminDashboard.tsx">
            <TabsTrigger value="challenges" data-id="ilc80mm8h" data-path="src/components/AdminDashboard.tsx">Challenges</TabsTrigger>
            <TabsTrigger value="users" data-id="c3qa3n9re" data-path="src/components/AdminDashboard.tsx">Users</TabsTrigger>
            <TabsTrigger value="transactions" data-id="7zao4rtv2" data-path="src/components/AdminDashboard.tsx">Transactions</TabsTrigger>
            <TabsTrigger value="faq" data-id="rxfl01jf4" data-path="src/components/AdminDashboard.tsx">FAQ Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenges" className="space-y-6" data-id="fg49eqvo6" data-path="src/components/AdminDashboard.tsx">
            <div className="flex items-center justify-between" data-id="fssgl6pji" data-path="src/components/AdminDashboard.tsx">
              <h2 className="text-xl font-semibold" data-id="gjwqjemcr" data-path="src/components/AdminDashboard.tsx">Challenge Management</h2>
              <ChallengeCreator onChallengeCreated={handleChallengeCreated} data-id="1y16rx97n" data-path="src/components/AdminDashboard.tsx" />
            </div>
            
            <div className="grid gap-4" data-id="5d1iuken4" data-path="src/components/AdminDashboard.tsx">
              {challenges.length === 0 ?
              <Card data-id="eaoksco2e" data-path="src/components/AdminDashboard.tsx">
                  <CardContent className="p-6 text-center" data-id="5kglp4lih" data-path="src/components/AdminDashboard.tsx">
                    <p className="text-gray-500" data-id="g20lqoi6h" data-path="src/components/AdminDashboard.tsx">No challenges found. Create one to get started!</p>
                  </CardContent>
                </Card> :

              challenges.map((challenge) =>
              <Card key={challenge.id} data-id="511s4yhux" data-path="src/components/AdminDashboard.tsx">
                    <CardContent className="p-6" data-id="gluoj1dsc" data-path="src/components/AdminDashboard.tsx">
                      <div className="flex items-start justify-between" data-id="dyrxriz9v" data-path="src/components/AdminDashboard.tsx">
                        <div className="space-y-2" data-id="vhj6h41nb" data-path="src/components/AdminDashboard.tsx">
                          <div className="flex items-center space-x-2" data-id="edtvaph2q" data-path="src/components/AdminDashboard.tsx">
                            <h3 className="font-semibold text-lg" data-id="m9tfvcpdk" data-path="src/components/AdminDashboard.tsx">
                              {challenge.challenge_type} Challenge
                            </h3>
                            <Badge className={getStatusColor(challenge.status)} data-id="qda8g5h58" data-path="src/components/AdminDashboard.tsx">
                              {challenge.status}
                            </Badge>
                            <Badge variant="outline" data-id="0h1hc8e18" data-path="src/components/AdminDashboard.tsx">
                              {challenge.skill_level}
                            </Badge>
                          </div>
                          <p className="text-gray-600" data-id="2bd1duhfm" data-path="src/components/AdminDashboard.tsx">{challenge.message || 'No description provided'}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500" data-id="45fln4msj" data-path="src/components/AdminDashboard.tsx">
                            <span className="flex items-center" data-id="pgk0aszst" data-path="src/components/AdminDashboard.tsx">
                              <Calendar className="w-4 h-4 mr-1" data-id="ds2h2pdqp" data-path="src/components/AdminDashboard.tsx" />
                              {challenge.preferred_date ? new Date(challenge.preferred_date).toLocaleDateString() : 'No date set'}
                            </span>
                            <span data-id="qcisd9qpk" data-path="src/components/AdminDashboard.tsx">{challenge.location_preference || 'Location TBD'}</span>
                            {challenge.stakes && <span data-id="zv0pjs9ia" data-path="src/components/AdminDashboard.tsx">Stakes: {challenge.stakes}</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              )
              }
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6" data-id="ektiz0kud" data-path="src/components/AdminDashboard.tsx">
            <h2 className="text-xl font-semibold" data-id="dfsfq3qux" data-path="src/components/AdminDashboard.tsx">User Management</h2>
            
            <div className="grid gap-4" data-id="z694o4zxd" data-path="src/components/AdminDashboard.tsx">
              {userProfiles.length === 0 ?
              <Card data-id="xeo68h2ka" data-path="src/components/AdminDashboard.tsx">
                  <CardContent className="p-6 text-center" data-id="b82awfgho" data-path="src/components/AdminDashboard.tsx">
                    <p className="text-gray-500" data-id="yi7qukm85" data-path="src/components/AdminDashboard.tsx">No user profiles found.</p>
                  </CardContent>
                </Card> :

              userProfiles.map((profile) =>
              <Card key={profile.id} data-id="wlg2xloup" data-path="src/components/AdminDashboard.tsx">
                    <CardContent className="p-6" data-id="cxjtd5u4b" data-path="src/components/AdminDashboard.tsx">
                      <div className="flex items-center justify-between" data-id="33dsjm6tk" data-path="src/components/AdminDashboard.tsx">
                        <div data-id="85dwjhxia" data-path="src/components/AdminDashboard.tsx">
                          <h3 className="font-semibold text-lg" data-id="xh1lzzl2b" data-path="src/components/AdminDashboard.tsx">{profile.display_name}</h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500" data-id="f5xkco0gv" data-path="src/components/AdminDashboard.tsx">
                            <span data-id="7u7yo4fy6" data-path="src/components/AdminDashboard.tsx">Skill: {profile.skill_level}</span>
                            <Badge
                          variant="outline"
                          className={
                          profile.subscription_tier === 'Pro' ? 'bg-purple-50 text-purple-800' :
                          profile.subscription_tier === 'Premium' ? 'bg-emerald-50 text-emerald-800' :
                          'bg-gray-50 text-gray-800'
                          } data-id="ydhr7kjs7" data-path="src/components/AdminDashboard.tsx">

                              {profile.subscription_tier}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              )
              }
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6" data-id="35s2ok4r8" data-path="src/components/AdminDashboard.tsx">
            <h2 className="text-xl font-semibold" data-id="ffchofmrf" data-path="src/components/AdminDashboard.tsx">Transaction History</h2>
            
            <div className="grid gap-4" data-id="djnq8vthu" data-path="src/components/AdminDashboard.tsx">
              {transactions.length === 0 ?
              <Card data-id="d4qj9xuzd" data-path="src/components/AdminDashboard.tsx">
                  <CardContent className="p-6 text-center" data-id="2mmnk518n" data-path="src/components/AdminDashboard.tsx">
                    <p className="text-gray-500" data-id="97hykmd7l" data-path="src/components/AdminDashboard.tsx">No transactions found.</p>
                  </CardContent>
                </Card> :

              transactions.map((transaction) =>
              <Card key={transaction.id} data-id="k1wzf26du" data-path="src/components/AdminDashboard.tsx">
                    <CardContent className="p-6" data-id="asetnl24h" data-path="src/components/AdminDashboard.tsx">
                      <div className="flex items-center justify-between" data-id="zlbtsxmms" data-path="src/components/AdminDashboard.tsx">
                        <div data-id="dszxn3k1t" data-path="src/components/AdminDashboard.tsx">
                          <h3 className="font-semibold" data-id="f2hjykitu" data-path="src/components/AdminDashboard.tsx">{transaction.description}</h3>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500" data-id="0ud2e4q9m" data-path="src/components/AdminDashboard.tsx">
                            <span data-id="pxnhwx45w" data-path="src/components/AdminDashboard.tsx">{transaction.transaction_type}</span>
                            <Badge className={
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                        } data-id="8xjmww7cl" data-path="src/components/AdminDashboard.tsx">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right" data-id="okzvnnew2" data-path="src/components/AdminDashboard.tsx">
                          <div className="text-2xl font-bold text-emerald-600" data-id="l0mh6klyo" data-path="src/components/AdminDashboard.tsx">
                            ${transaction.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              )
              }
            </div>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-6" data-id="vfe2nral7" data-path="src/components/AdminDashboard.tsx">
            <h2 className="text-xl font-semibold" data-id="vrgj64mxz" data-path="src/components/AdminDashboard.tsx">FAQ Management</h2>
            
            <Card data-id="av13o5ggs" data-path="src/components/AdminDashboard.tsx">
              <CardHeader data-id="3u42fdlp6" data-path="src/components/AdminDashboard.tsx">
                <CardTitle data-id="qdrgvqdp3" data-path="src/components/AdminDashboard.tsx">FAQ Administration</CardTitle>
                <CardDescription data-id="00xwpaj7t" data-path="src/components/AdminDashboard.tsx">
                  Manage frequently asked questions and seed sample data for the chat-bot system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4" data-id="dyddhzw1r" data-path="src/components/AdminDashboard.tsx">
                <div className="flex items-center space-x-4" data-id="sblp45k5o" data-path="src/components/AdminDashboard.tsx">
                  <SeedFAQButton data-id="qq5z8osrn" data-path="src/components/AdminDashboard.tsx" />
                  <Link to="/faq" data-id="l8tz5ib8v" data-path="src/components/AdminDashboard.tsx">
                    <Button variant="outline" data-id="5nevxpeq4" data-path="src/components/AdminDashboard.tsx">
                      <HelpCircle className="mr-2 h-4 w-4" data-id="auwwlkml8" data-path="src/components/AdminDashboard.tsx" />
                      View FAQ Page
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-gray-600" data-id="mx5kwpofk" data-path="src/components/AdminDashboard.tsx">
                  Use the seed button to populate the FAQ database with sample questions and answers. 
                  This data will be used by the chat-bot to provide helpful responses to users.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>);

};

export default AdminDashboard;