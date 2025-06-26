import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Target,
  CheckCircle,
  Star,
  PlayCircle,
  FileText,
  MessageCircle,
  Settings,
  Award,
  Zap,
  Info,
  ArrowRight,
  X } from
'lucide-react';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const UserGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string>('getting-started');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const markStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]));
  };

  const gettingStartedSteps: GuideStep[] = [
  {
    id: 'profile-setup',
    title: 'Set Up Your Profile',
    description: 'Complete your tennis profile with skill level and location',
    icon: <Users className="w-5 h-5" data-id="4vmtomyqo" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="8eslk4juj" data-path="src/components/UserGuide.tsx">
          <p data-id="hol5zwn60" data-path="src/components/UserGuide.tsx">First, let's get your profile set up:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="1dfoq260u" data-path="src/components/UserGuide.tsx">
            <li data-id="j9a26lx4n" data-path="src/components/UserGuide.tsx">Go to your Player Dashboard</li>
            <li data-id="jx36sqyca" data-path="src/components/UserGuide.tsx">Click "Edit Profile" in the Profile section</li>
            <li data-id="2aca6darx" data-path="src/components/UserGuide.tsx">Enter your display name and skill level</li>
            <li data-id="4g5e73rbf" data-path="src/components/UserGuide.tsx">Add your location for local match finding</li>
            <li data-id="05smokqbb" data-path="src/components/UserGuide.tsx">Upload a profile picture (optional)</li>
            <li data-id="21atrbq4q" data-path="src/components/UserGuide.tsx">Save your changes</li>
          </ol>
          <div className="bg-blue-50 p-3 rounded-lg" data-id="8mqkur4u0" data-path="src/components/UserGuide.tsx">
            <p className="text-sm text-blue-800" data-id="ubzfd25f1" data-path="src/components/UserGuide.tsx">
              <Info className="w-4 h-4 inline mr-1" data-id="6p48lpdo0" data-path="src/components/UserGuide.tsx" />
              Your skill level helps match you with appropriate opponents!
            </p>
          </div>
        </div>

  },
  {
    id: 'location-setup',
    title: 'Enable Location Services',
    description: 'Allow location access to find nearby courts and players',
    icon: <MapPin className="w-5 h-5" data-id="b3uaswgbo" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="8o4apfhm7" data-path="src/components/UserGuide.tsx">
          <p data-id="k0e50l2kv" data-path="src/components/UserGuide.tsx">Enable location services to discover tennis opportunities near you:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="5qm8tjy9v" data-path="src/components/UserGuide.tsx">
            <li data-id="1vm3m2ebe" data-path="src/components/UserGuide.tsx">Navigate to the "Events Near Me" section</li>
            <li data-id="p3wu6wyms" data-path="src/components/UserGuide.tsx">Click "Get Current Location"</li>
            <li data-id="akfeo96xm" data-path="src/components/UserGuide.tsx">Allow location access when prompted</li>
            <li data-id="nz4sbxl94" data-path="src/components/UserGuide.tsx">Your location will be saved for finding nearby events</li>
          </ol>
          <div className="bg-green-50 p-3 rounded-lg" data-id="8ml1rg02e" data-path="src/components/UserGuide.tsx">
            <p className="text-sm text-green-800" data-id="1bhzr73j9" data-path="src/components/UserGuide.tsx">
              <CheckCircle className="w-4 h-4 inline mr-1" data-id="ouymalxzm" data-path="src/components/UserGuide.tsx" />
              Location data is used only to show you relevant tennis opportunities!
            </p>
          </div>
        </div>

  },
  {
    id: 'first-challenge',
    title: 'Create Your First Challenge',
    description: 'Learn how to challenge other players to matches',
    icon: <Target className="w-5 h-5" data-id="6edb94y6z" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="8l0xfqcca" data-path="src/components/UserGuide.tsx">
          <p data-id="sn8nyqrnk" data-path="src/components/UserGuide.tsx">Ready to play? Create your first challenge:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="va3qaf6xe" data-path="src/components/UserGuide.tsx">
            <li data-id="pvnfcthwl" data-path="src/components/UserGuide.tsx">Go to "My Challenges" section</li>
            <li data-id="qvtn9jbrx" data-path="src/components/UserGuide.tsx">Click "Create New Challenge"</li>
            <li data-id="zo2756z7w" data-path="src/components/UserGuide.tsx">Choose Singles or Doubles</li>
            <li data-id="kwhc39wds" data-path="src/components/UserGuide.tsx">Set your preferred date and location</li>
            <li data-id="f0u7yokpf" data-path="src/components/UserGuide.tsx">Add a message or stakes (optional)</li>
            <li data-id="5ikq8etg2" data-path="src/components/UserGuide.tsx">Publish your challenge</li>
          </ol>
          <div className="bg-purple-50 p-3 rounded-lg" data-id="nce3epd61" data-path="src/components/UserGuide.tsx">
            <p className="text-sm text-purple-800" data-id="fqi2npqvg" data-path="src/components/UserGuide.tsx">
              <Star className="w-4 h-4 inline mr-1" data-id="80fqszuql" data-path="src/components/UserGuide.tsx" />
              Open challenges can be accepted by any player!
            </p>
          </div>
        </div>

  }];


  const challengeSteps: GuideStep[] = [
  {
    id: 'creating-challenges',
    title: 'Creating Challenges',
    description: 'Master the art of creating compelling tennis challenges',
    icon: <Trophy className="w-5 h-5" data-id="y2rsqiyvs" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="ah9xkp94t" data-path="src/components/UserGuide.tsx">
          <h4 className="font-semibold" data-id="7p7zc0o7j" data-path="src/components/UserGuide.tsx">Types of Challenges:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" data-id="orb109keh" data-path="src/components/UserGuide.tsx">
            <div className="bg-blue-50 p-3 rounded-lg" data-id="7mog8smsa" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-blue-800" data-id="pfwugdazr" data-path="src/components/UserGuide.tsx">Open Challenges</h5>
              <p className="text-blue-700" data-id="zg84slv7f" data-path="src/components/UserGuide.tsx">Anyone can accept these challenges</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg" data-id="evv13zak1" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-green-800" data-id="nd271k2rv" data-path="src/components/UserGuide.tsx">Direct Challenges</h5>
              <p className="text-green-700" data-id="c6olr7m4i" data-path="src/components/UserGuide.tsx">Challenge a specific player</p>
            </div>
          </div>
          <h4 className="font-semibold" data-id="kc5zi4cth" data-path="src/components/UserGuide.tsx">Best Practices:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm" data-id="a5uja5aif" data-path="src/components/UserGuide.tsx">
            <li data-id="asmhs2hge" data-path="src/components/UserGuide.tsx">Be specific about your skill level expectations</li>
            <li data-id="16f9f7d97" data-path="src/components/UserGuide.tsx">Suggest multiple date/time options</li>
            <li data-id="h6nqreeec" data-path="src/components/UserGuide.tsx">Include court preferences or suggestions</li>
            <li data-id="g89rnagoa" data-path="src/components/UserGuide.tsx">Be clear about any stakes or friendly wagers</li>
            <li data-id="x6bscxukq" data-path="src/components/UserGuide.tsx">Add a personal message to make it more engaging</li>
          </ul>
        </div>

  },
  {
    id: 'accepting-challenges',
    title: 'Accepting Challenges',
    description: 'How to respond to and accept tennis challenges',
    icon: <CheckCircle className="w-5 h-5" data-id="y50hd7e44" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="pazlya2b1" data-path="src/components/UserGuide.tsx">
          <p data-id="6wp6f2fcx" data-path="src/components/UserGuide.tsx">When you find a challenge you like:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="5mlp30b55" data-path="src/components/UserGuide.tsx">
            <li data-id="2s81b2qi4" data-path="src/components/UserGuide.tsx">Review the challenge details carefully</li>
            <li data-id="gmbbu1f21" data-path="src/components/UserGuide.tsx">Check the skill level and location</li>
            <li data-id="tupzaftnu" data-path="src/components/UserGuide.tsx">Make sure you're available on the proposed date</li>
            <li data-id="42qqnaif4" data-path="src/components/UserGuide.tsx">Click "Accept" if you're interested</li>
            <li data-id="g892rj21x" data-path="src/components/UserGuide.tsx">The challenger will be notified automatically</li>
          </ol>
          <div className="bg-orange-50 p-3 rounded-lg" data-id="58fb31xyj" data-path="src/components/UserGuide.tsx">
            <p className="text-sm text-orange-800" data-id="7i9rjgp2b" data-path="src/components/UserGuide.tsx">
              <Info className="w-4 h-4 inline mr-1" data-id="8cz16ae6e" data-path="src/components/UserGuide.tsx" />
              You can also decline challenges if they don't suit you.
            </p>
          </div>
          <h4 className="font-semibold" data-id="9nachxk37" data-path="src/components/UserGuide.tsx">After Accepting:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm" data-id="3lq1wfhwy" data-path="src/components/UserGuide.tsx">
            <li data-id="hsi1nzzni" data-path="src/components/UserGuide.tsx">A match record is automatically created</li>
            <li data-id="jpbsfecy3" data-path="src/components/UserGuide.tsx">You can coordinate details via the platform</li>
            <li data-id="9g0rra3ie" data-path="src/components/UserGuide.tsx">The match appears in your "Match Scoring" section</li>
          </ul>
        </div>

  }];


  const scoringSteps: GuideStep[] = [
  {
    id: 'entering-scores',
    title: 'Entering Match Scores',
    description: 'Learn how to record your match results',
    icon: <Award className="w-5 h-5" data-id="jtt41pe3u" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="iasnn3pj7" data-path="src/components/UserGuide.tsx">
          <p data-id="pifh8pe1w" data-path="src/components/UserGuide.tsx">After playing a match, record the results:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="xhx8whrj7" data-path="src/components/UserGuide.tsx">
            <li data-id="fx4kzmis3" data-path="src/components/UserGuide.tsx">Go to "My Challenges" → "Match Scoring"</li>
            <li data-id="1k1d0zze2" data-path="src/components/UserGuide.tsx">Find your completed match</li>
            <li data-id="l58xq0wod" data-path="src/components/UserGuide.tsx">Click "Enter Score"</li>
            <li data-id="376qhbqw0" data-path="src/components/UserGuide.tsx">Enter the set scores (e.g., "6-4, 7-5")</li>
            <li data-id="bpsppvvgq" data-path="src/components/UserGuide.tsx">Select the winner from the dropdown</li>
            <li data-id="qchk3xmav" data-path="src/components/UserGuide.tsx">Click "Submit Score"</li>
          </ol>
          <div className="bg-yellow-50 p-3 rounded-lg" data-id="xokwaxx6u" data-path="src/components/UserGuide.tsx">
            <p className="text-sm text-yellow-800" data-id="n77w1ucs5" data-path="src/components/UserGuide.tsx">
              <Info className="w-4 h-4 inline mr-1" data-id="jthe2oewi" data-path="src/components/UserGuide.tsx" />
              Both score and winner must be selected before submitting.
            </p>
          </div>
          <h4 className="font-semibold" data-id="zilnc0qwf" data-path="src/components/UserGuide.tsx">Score Format Examples:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm" data-id="g84nua3be" data-path="src/components/UserGuide.tsx">
            <li data-id="c1azqtzvy" data-path="src/components/UserGuide.tsx">"6-4, 6-2" for a straight sets win</li>
            <li data-id="h4k3wyltl" data-path="src/components/UserGuide.tsx">"6-4, 4-6, 6-3" for a three-set match</li>
            <li data-id="3mw4rrhfn" data-path="src/components/UserGuide.tsx">"7-6, 6-4" for a tiebreak first set</li>
          </ul>
        </div>

  },
  {
    id: 'verifying-scores',
    title: 'Score Verification',
    description: 'Understand the score verification process',
    icon: <CheckCircle className="w-5 h-5" data-id="mg77da0yx" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="tabut6ed8" data-path="src/components/UserGuide.tsx">
          <p data-id="kp96xlprm" data-path="src/components/UserGuide.tsx">Tennis Connect uses a verification system to ensure accurate scores:</p>
          <h4 className="font-semibold" data-id="7qhy6hnmv" data-path="src/components/UserGuide.tsx">When Someone Enters a Score:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="7fusn80mi" data-path="src/components/UserGuide.tsx">
            <li data-id="3lv68z1wq" data-path="src/components/UserGuide.tsx">The score submitter enters the match result</li>
            <li data-id="kspu65iap" data-path="src/components/UserGuide.tsx">Other players receive a verification notification</li>
            <li data-id="4aj8eiqbw" data-path="src/components/UserGuide.tsx">Players can "Verify" or "Dispute" the score</li>
            <li data-id="wae6sbbdg" data-path="src/components/UserGuide.tsx">Verified scores become official match records</li>
          </ol>
          <h4 className="font-semibold" data-id="rlu1rkjkk" data-path="src/components/UserGuide.tsx">Verification Actions:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" data-id="am4mngf7v" data-path="src/components/UserGuide.tsx">
            <div className="bg-green-50 p-3 rounded-lg" data-id="t010xq9t6" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-green-800" data-id="mlb3gr2z5" data-path="src/components/UserGuide.tsx">Verify Score</h5>
              <p className="text-green-700" data-id="ejl6r2lsx" data-path="src/components/UserGuide.tsx">Confirms the score is accurate</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg" data-id="fcbnvpwpe" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-red-800" data-id="qeeuzfm00" data-path="src/components/UserGuide.tsx">Dispute Score</h5>
              <p className="text-red-700" data-id="uj4ju47dr" data-path="src/components/UserGuide.tsx">Questions the accuracy, requires re-entry</p>
            </div>
          </div>
        </div>

  }];


  const platformSteps: GuideStep[] = [
  {
    id: 'events-near-me',
    title: 'Finding Local Events',
    description: 'Discover tennis events and tournaments in your area',
    icon: <Calendar className="w-5 h-5" data-id="ddx4a8c0a" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="x8ah4vryh" data-path="src/components/UserGuide.tsx">
          <p data-id="d2hk41qx2" data-path="src/components/UserGuide.tsx">Stay connected with your local tennis community:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="6t0afoudx" data-path="src/components/UserGuide.tsx">
            <li data-id="8w7kq5389" data-path="src/components/UserGuide.tsx">Visit the "Events Near Me" section</li>
            <li data-id="mvc1fd91j" data-path="src/components/UserGuide.tsx">Enable location services if prompted</li>
            <li data-id="ow832lcfl" data-path="src/components/UserGuide.tsx">Browse upcoming tournaments and social events</li>
            <li data-id="6zcl14okf" data-path="src/components/UserGuide.tsx">Click "Register" for events you want to join</li>
            <li data-id="33m19igtm" data-path="src/components/UserGuide.tsx">Complete payment if there's a registration fee</li>
          </ol>
          <h4 className="font-semibold" data-id="0prfa7wnq" data-path="src/components/UserGuide.tsx">Types of Events:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm" data-id="tz67etnn5" data-path="src/components/UserGuide.tsx">
            <div className="bg-blue-50 p-3 rounded-lg" data-id="0hibrb42t" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-blue-800" data-id="86i3gu2in" data-path="src/components/UserGuide.tsx">Tournaments</h5>
              <p className="text-blue-700" data-id="j5u1ae9mi" data-path="src/components/UserGuide.tsx">Competitive play with prizes</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg" data-id="oi2ck8abg" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-green-800" data-id="r255ig4a9" data-path="src/components/UserGuide.tsx">Social Events</h5>
              <p className="text-green-700" data-id="gyd4ls98s" data-path="src/components/UserGuide.tsx">Casual meetups and mixers</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg" data-id="5fgu8sx7g" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-purple-800" data-id="ws06sg4ay" data-path="src/components/UserGuide.tsx">Clinics</h5>
              <p className="text-purple-700" data-id="h20s2q35v" data-path="src/components/UserGuide.tsx">Skill development sessions</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg" data-id="iu9sgsbq4" data-path="src/components/UserGuide.tsx">
              <h5 className="font-medium text-orange-800" data-id="f6yf0ifmu" data-path="src/components/UserGuide.tsx">Practice</h5>
              <p className="text-orange-700" data-id="iw9quwc7q" data-path="src/components/UserGuide.tsx">Organized practice sessions</p>
            </div>
          </div>
        </div>

  },
  {
    id: 'notifications',
    title: 'Managing Notifications',
    description: 'Stay updated with important tennis activities',
    icon: <MessageCircle className="w-5 h-5" data-id="dwmjaap8k" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="x1cm49i05" data-path="src/components/UserGuide.tsx">
          <p data-id="c2kxtahy9" data-path="src/components/UserGuide.tsx">Tennis Connect keeps you informed with smart notifications:</p>
          <h4 className="font-semibold" data-id="w6c5uhxjs" data-path="src/components/UserGuide.tsx">Notification Types:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm" data-id="75tkyv3kr" data-path="src/components/UserGuide.tsx">
            <li data-id="4o7va6o3x" data-path="src/components/UserGuide.tsx"><strong data-id="hflwh2tla" data-path="src/components/UserGuide.tsx">Challenge Notifications:</strong> When someone accepts/declines your challenge</li>
            <li data-id="dn66ltwxl" data-path="src/components/UserGuide.tsx"><strong data-id="asz61ng9o" data-path="src/components/UserGuide.tsx">Match Notifications:</strong> Score verification requests and confirmations</li>
            <li data-id="e8o01avf8" data-path="src/components/UserGuide.tsx"><strong data-id="i3rbfcsxv" data-path="src/components/UserGuide.tsx">Event Notifications:</strong> Event registrations and updates</li>
            <li data-id="2nyl9f6go" data-path="src/components/UserGuide.tsx"><strong data-id="uca09nf1r" data-path="src/components/UserGuide.tsx">System Notifications:</strong> Platform updates and important news</li>
          </ul>
          <h4 className="font-semibold" data-id="wtc1tpiw1" data-path="src/components/UserGuide.tsx">Managing Notifications:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="rimh0rqwu" data-path="src/components/UserGuide.tsx">
            <li data-id="nm3hk554z" data-path="src/components/UserGuide.tsx">Click the notification bell icon in the header</li>
            <li data-id="ltsdg6e4a" data-path="src/components/UserGuide.tsx">View all unread notifications</li>
            <li data-id="ckah07hrl" data-path="src/components/UserGuide.tsx">Click notifications to take action</li>
            <li data-id="coopvcl2z" data-path="src/components/UserGuide.tsx">Mark as read when you've addressed them</li>
          </ol>
          <div className="bg-blue-50 p-3 rounded-lg" data-id="rsqccpxbf" data-path="src/components/UserGuide.tsx">
            <p className="text-sm text-blue-800" data-id="wrvqrc0rb" data-path="src/components/UserGuide.tsx">
              <Zap className="w-4 h-4 inline mr-1" data-id="afislafyq" data-path="src/components/UserGuide.tsx" />
              High priority notifications appear with special badges!
            </p>
          </div>
        </div>

  },
  {
    id: 'faq-chatbot',
    title: 'FAQ and ChatBot Help',
    description: 'Get instant answers to common questions',
    icon: <MessageCircle className="w-5 h-5" data-id="1yz8vy5k7" data-path="src/components/UserGuide.tsx" />,
    content:
    <div className="space-y-4" data-id="7t86yvgdk" data-path="src/components/UserGuide.tsx">
          <p data-id="q9gl3xqo6" data-path="src/components/UserGuide.tsx">Need quick help? Tennis Connect offers multiple support options:</p>
          <h4 className="font-semibold" data-id="w2kt5tqxr" data-path="src/components/UserGuide.tsx">FAQ Section:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="56762g1hb" data-path="src/components/UserGuide.tsx">
            <li data-id="no2q6ntor" data-path="src/components/UserGuide.tsx">Access via the navigation menu or footer</li>
            <li data-id="bjqva5od4" data-path="src/components/UserGuide.tsx">Browse categories like Challenges, Events, Payments</li>
            <li data-id="r4uo4yxim" data-path="src/components/UserGuide.tsx">Use the search feature to find specific topics</li>
            <li data-id="7n6wzgatl" data-path="src/components/UserGuide.tsx">Questions are organized by popularity and relevance</li>
          </ol>
          <h4 className="font-semibold" data-id="upxcecvdo" data-path="src/components/UserGuide.tsx">AI ChatBot Assistant:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm" data-id="cinuacexa" data-path="src/components/UserGuide.tsx">
            <li data-id="x99t69hmn" data-path="src/components/UserGuide.tsx">Look for the chat bubble in the bottom right</li>
            <li data-id="jjje15fqv" data-path="src/components/UserGuide.tsx">Click to open the interactive chat interface</li>
            <li data-id="k2oqr57ys" data-path="src/components/UserGuide.tsx">Ask questions in natural language</li>
            <li data-id="2pr9pocy3" data-path="src/components/UserGuide.tsx">Get instant responses based on FAQ knowledge</li>
            <li data-id="8scjqrxb0" data-path="src/components/UserGuide.tsx">Request escalation to human support if needed</li>
          </ol>
          <div className="bg-green-50 p-3 rounded-lg" data-id="kap4fh04i" data-path="src/components/UserGuide.tsx">
            <p className="text-sm text-green-800" data-id="b2hj1zggc" data-path="src/components/UserGuide.tsx">
              <MessageCircle className="w-4 h-4 inline mr-1" data-id="fs9pe4c4f" data-path="src/components/UserGuide.tsx" />
              The chatbot is available 24/7 for instant help!
            </p>
          </div>
        </div>

  }];


  const allSteps = {
    'getting-started': gettingStartedSteps,
    'challenges': challengeSteps,
    'scoring': scoringSteps,
    'platform': platformSteps
  };

  const currentSteps = allSteps[activeStep as keyof typeof allSteps] || gettingStartedSteps;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" data-id="pqideww1k" data-path="src/components/UserGuide.tsx">
      <div className="text-center space-y-4" data-id="p8p5rf9om" data-path="src/components/UserGuide.tsx">
        <h1 className="text-3xl font-bold text-gray-900" data-id="rjlwtgrpf" data-path="src/components/UserGuide.tsx">Tennis Connect User Guide</h1>
        <p className="text-lg text-gray-600" data-id="mqt9n8o54" data-path="src/components/UserGuide.tsx">
          Master the platform and elevate your tennis game with our comprehensive guide
        </p>
      </div>

      {/* Progress Overview */}
      <Card data-id="dqdpgbiiu" data-path="src/components/UserGuide.tsx">
        <CardContent className="p-6" data-id="17smz2907" data-path="src/components/UserGuide.tsx">
          <div className="flex items-center justify-between" data-id="qnn63r8wo" data-path="src/components/UserGuide.tsx">
            <div data-id="d5mjp0ful" data-path="src/components/UserGuide.tsx">
              <h3 className="text-lg font-semibold" data-id="afatiqfqs" data-path="src/components/UserGuide.tsx">Your Progress</h3>
              <p className="text-sm text-gray-600" data-id="4ibzqapfn" data-path="src/components/UserGuide.tsx">
                {completedSteps.size} of {Object.values(allSteps).flat().length} steps completed
              </p>
            </div>
            <div className="text-right" data-id="px7o2gk49" data-path="src/components/UserGuide.tsx">
              <div className="text-2xl font-bold text-emerald-600" data-id="0qpfyl1tb" data-path="src/components/UserGuide.tsx">
                {Math.round(completedSteps.size / Object.values(allSteps).flat().length * 100)}%
              </div>
              <p className="text-sm text-gray-500" data-id="x40l9s64c" data-path="src/components/UserGuide.tsx">Complete</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4" data-id="f77udvqo4" data-path="src/components/UserGuide.tsx">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${completedSteps.size / Object.values(allSteps).flat().length * 100}%`
              }} data-id="r5z6sivt4" data-path="src/components/UserGuide.tsx">
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide Navigation */}
      <Tabs value={activeStep} onValueChange={setActiveStep} className="space-y-6" data-id="dlylcmhf2" data-path="src/components/UserGuide.tsx">
        <TabsList className="grid w-full grid-cols-4" data-id="g359bi2uj" data-path="src/components/UserGuide.tsx">
          <TabsTrigger value="getting-started" className="text-center" data-id="1bgdzl3hb" data-path="src/components/UserGuide.tsx">
            <div className="space-y-1" data-id="dfmbjskna" data-path="src/components/UserGuide.tsx">
              <PlayCircle className="w-4 h-4 mx-auto" data-id="metsx561b" data-path="src/components/UserGuide.tsx" />
              <span className="text-xs" data-id="5n1q6kyw2" data-path="src/components/UserGuide.tsx">Getting Started</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="text-center" data-id="4u6j4eort" data-path="src/components/UserGuide.tsx">
            <div className="space-y-1" data-id="tikhcwzjj" data-path="src/components/UserGuide.tsx">
              <Target className="w-4 h-4 mx-auto" data-id="eeqoz5b9u" data-path="src/components/UserGuide.tsx" />
              <span className="text-xs" data-id="c5qa0obze" data-path="src/components/UserGuide.tsx">Challenges</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="scoring" className="text-center" data-id="s9lgfyti0" data-path="src/components/UserGuide.tsx">
            <div className="space-y-1" data-id="iins3kldr" data-path="src/components/UserGuide.tsx">
              <Trophy className="w-4 h-4 mx-auto" data-id="ufgssf2ov" data-path="src/components/UserGuide.tsx" />
              <span className="text-xs" data-id="jeu3vf4hb" data-path="src/components/UserGuide.tsx">Match Scoring</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="platform" className="text-center" data-id="36ly6jvr2" data-path="src/components/UserGuide.tsx">
            <div className="space-y-1" data-id="br0hoy088" data-path="src/components/UserGuide.tsx">
              <Settings className="w-4 h-4 mx-auto" data-id="crocch9d9" data-path="src/components/UserGuide.tsx" />
              <span className="text-xs" data-id="4wcg7c35x" data-path="src/components/UserGuide.tsx">Platform Features</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeStep} className="space-y-6" data-id="o9llxkbj8" data-path="src/components/UserGuide.tsx">
          <div className="grid gap-6" data-id="dd54v2y27" data-path="src/components/UserGuide.tsx">
            {currentSteps.map((step) =>
            <Card key={step.id} className="hover:shadow-md transition-shadow" data-id="i3v6jhn4b" data-path="src/components/UserGuide.tsx">
                <CardHeader data-id="pw3nyl8cv" data-path="src/components/UserGuide.tsx">
                  <div className="flex items-center justify-between" data-id="dmexbkxgm" data-path="src/components/UserGuide.tsx">
                    <div className="flex items-center space-x-3" data-id="7ghs38nf0" data-path="src/components/UserGuide.tsx">
                      <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600" data-id="bzlv6wwbh" data-path="src/components/UserGuide.tsx">
                        {step.icon}
                      </div>
                      <div data-id="6sgflajwo" data-path="src/components/UserGuide.tsx">
                        <CardTitle className="text-lg" data-id="ctki4yocf" data-path="src/components/UserGuide.tsx">{step.title}</CardTitle>
                        <CardDescription data-id="1va8txsll" data-path="src/components/UserGuide.tsx">{step.description}</CardDescription>
                      </div>
                    </div>
                    {completedSteps.has(step.id) ?
                  <Badge className="bg-green-100 text-green-800" data-id="2eddph8ab" data-path="src/components/UserGuide.tsx">
                        <CheckCircle className="w-3 h-3 mr-1" data-id="vh4fvdbk8" data-path="src/components/UserGuide.tsx" />
                        Completed
                      </Badge> :

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markStepComplete(step.id)} data-id="6qp7xry55" data-path="src/components/UserGuide.tsx">

                        Mark Complete
                      </Button>
                  }
                  </div>
                </CardHeader>
                <CardContent data-id="q8amk7kou" data-path="src/components/UserGuide.tsx">
                  {step.content}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card data-id="zrve7av3k" data-path="src/components/UserGuide.tsx">
        <CardHeader data-id="rhojjv83s" data-path="src/components/UserGuide.tsx">
          <CardTitle data-id="04jlhoeo8" data-path="src/components/UserGuide.tsx">Quick Actions</CardTitle>
          <CardDescription data-id="fxyjiga20" data-path="src/components/UserGuide.tsx">
            Jump directly to key features after reading the guide
          </CardDescription>
        </CardHeader>
        <CardContent data-id="spwzupsh8" data-path="src/components/UserGuide.tsx">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-id="hl8irqgis" data-path="src/components/UserGuide.tsx">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" data-id="0mzrr326z" data-path="src/components/UserGuide.tsx">
              <Target className="w-6 h-6" data-id="2an936pv6" data-path="src/components/UserGuide.tsx" />
              <span className="text-sm" data-id="ng29j2zto" data-path="src/components/UserGuide.tsx">Create Challenge</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" data-id="hcjwac3ro" data-path="src/components/UserGuide.tsx">
              <Users className="w-6 h-6" data-id="9ow9b6w3n" data-path="src/components/UserGuide.tsx" />
              <span className="text-sm" data-id="ysip77ew6" data-path="src/components/UserGuide.tsx">Edit Profile</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" data-id="hm7vf0fkp" data-path="src/components/UserGuide.tsx">
              <Calendar className="w-6 h-6" data-id="579g2a3aj" data-path="src/components/UserGuide.tsx" />
              <span className="text-sm" data-id="xep5cxt8u" data-path="src/components/UserGuide.tsx">Find Events</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" data-id="1y8b7mxdg" data-path="src/components/UserGuide.tsx">
              <MessageCircle className="w-6 h-6" data-id="uqd51u69c" data-path="src/components/UserGuide.tsx" />
              <span className="text-sm" data-id="tj30qtp34" data-path="src/components/UserGuide.tsx">Open ChatBot</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card data-id="qfy188qmw" data-path="src/components/UserGuide.tsx">
        <CardContent className="p-6 text-center" data-id="1p6opokbx" data-path="src/components/UserGuide.tsx">
          <h3 className="text-lg font-semibold mb-2" data-id="5cvf8th2c" data-path="src/components/UserGuide.tsx">Need More Help?</h3>
          <p className="text-gray-600 mb-4" data-id="b1jsl6lm3" data-path="src/components/UserGuide.tsx">
            If you can't find what you're looking for in this guide, our support team is here to help.
          </p>
          <div className="flex justify-center space-x-4" data-id="yxm506673" data-path="src/components/UserGuide.tsx">
            <Button variant="outline" data-id="k10xsdstb" data-path="src/components/UserGuide.tsx">
              <FileText className="w-4 h-4 mr-2" data-id="0hmw2jizd" data-path="src/components/UserGuide.tsx" />
              View FAQ
            </Button>
            <Button data-id="d8uaksq09" data-path="src/components/UserGuide.tsx">
              <MessageCircle className="w-4 h-4 mr-2" data-id="3r4cysq5m" data-path="src/components/UserGuide.tsx" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default UserGuide;