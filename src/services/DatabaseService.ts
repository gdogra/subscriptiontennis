export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  location: string;
  established: string;
  logo?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'singles' | 'doubles';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'open';
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate: string;
  location: string;
  prize?: string;
  status: 'upcoming' | 'active' | 'completed';
  createdBy: string;
  communityId: string;
  participants: string[];
  rules?: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxChallenges: number;
  maxParticipants: number;
  priority: boolean;
}

// Mock Communities
export const mockCommunities: Community[] = [
{
  id: '1',
  name: 'Metro Tennis Club',
  description: 'A vibrant community of tennis enthusiasts in the heart of the city',
  memberCount: 156,
  location: 'Downtown Metro Area',
  established: '2019',
  logo: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=100&h=100&fit=crop'
},
{
  id: '2',
  name: 'Riverside Tennis Academy',
  description: 'Professional coaching and competitive play by the river',
  memberCount: 89,
  location: 'Riverside District',
  established: '2021',
  logo: 'https://images.unsplash.com/photo-1526676037777-05a232c2f000?w=100&h=100&fit=crop'
}];


// Mock Challenges
export const mockChallenges: Challenge[] = [
{
  id: '1',
  title: 'Spring Singles Championship',
  description: 'Annual singles tournament open to all skill levels',
  type: 'singles',
  skillLevel: 'open',
  maxParticipants: 32,
  currentParticipants: 18,
  startDate: '2024-03-15',
  endDate: '2024-03-22',
  location: 'Central Courts',
  prize: '$500 Winner Prize',
  status: 'upcoming',
  createdBy: '1',
  communityId: '1',
  participants: ['2', '3', '4'],
  rules: [
  'Best of 3 sets format',
  'Standard tennis scoring',
  'Players must arrive 15 minutes early',
  'Proper tennis attire required']

},
{
  id: '2',
  title: 'Beginner Doubles Fun Day',
  description: 'Friendly doubles matches for beginners to learn and have fun',
  type: 'doubles',
  skillLevel: 'beginner',
  maxParticipants: 16,
  currentParticipants: 12,
  startDate: '2024-02-28',
  endDate: '2024-02-28',
  location: 'Practice Courts',
  status: 'active',
  createdBy: '1',
  communityId: '1',
  participants: ['3'],
  rules: [
  'Friendly play format',
  'Coaching tips provided',
  'Refreshments included',
  'Equipment available for loan']

},
{
  id: '3',
  title: 'Advanced Singles Ladder',
  description: 'Competitive ladder system for advanced players',
  type: 'singles',
  skillLevel: 'advanced',
  maxParticipants: 20,
  currentParticipants: 14,
  startDate: '2024-02-01',
  endDate: '2024-04-30',
  location: 'Championship Court',
  prize: 'Trophy & Ranking Points',
  status: 'active',
  createdBy: '1',
  communityId: '1',
  participants: ['4'],
  rules: [
  'Round-robin format',
  'Match scheduling flexible',
  'Professional umpiring available',
  'Stats tracking included']

}];


// Mock Subscription Plans
export const mockSubscriptionPlans: SubscriptionPlan[] = [
{
  id: 'basic',
  name: 'Basic',
  price: 9.99,
  interval: 'monthly',
  features: [
  'Join up to 3 challenges per month',
  'Basic player statistics',
  'Community access',
  'Mobile app access'],

  maxChallenges: 3,
  maxParticipants: 50,
  priority: false
},
{
  id: 'premium',
  name: 'Premium',
  price: 19.99,
  interval: 'monthly',
  features: [
  'Join unlimited challenges',
  'Advanced statistics & analytics',
  'Priority match scheduling',
  'Video analysis tools',
  'Custom challenge creation'],

  maxChallenges: -1, // unlimited
  maxParticipants: 200,
  priority: true
},
{
  id: 'pro',
  name: 'Pro',
  price: 49.99,
  interval: 'monthly',
  features: [
  'All Premium features',
  'Community management tools',
  'Tournament organization',
  'Coaching resources',
  'Revenue sharing from events',
  'White-label options'],

  maxChallenges: -1, // unlimited
  maxParticipants: -1, // unlimited
  priority: true
}];


class DatabaseService {
  // Communities
  getCommunities(): Promise<Community[]> {
    return new Promise((resolve) =>
    setTimeout(() => resolve(mockCommunities), 500)
    );
  }

  getCommunity(id: string): Promise<Community | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const community = mockCommunities.find((c) => c.id === id);
        resolve(community || null);
      }, 300);
    });
  }

  // Challenges
  getChallenges(communityId?: string): Promise<Challenge[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const challenges = communityId ?
        mockChallenges.filter((c) => c.communityId === communityId) :
        mockChallenges;
        resolve(challenges);
      }, 500);
    });
  }

  getChallenge(id: string): Promise<Challenge | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const challenge = mockChallenges.find((c) => c.id === id);
        resolve(challenge || null);
      }, 300);
    });
  }

  createChallenge(challenge: Omit<Challenge, 'id' | 'currentParticipants' | 'participants'>): Promise<Challenge> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newChallenge: Challenge = {
          ...challenge,
          id: Date.now().toString(),
          currentParticipants: 0,
          participants: []
        };
        mockChallenges.push(newChallenge);
        resolve(newChallenge);
      }, 800);
    });
  }

  joinChallenge(challengeId: string, userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const challenge = mockChallenges.find((c) => c.id === challengeId);
        if (challenge && !challenge.participants.includes(userId) &&
        challenge.currentParticipants < challenge.maxParticipants) {
          challenge.participants.push(userId);
          challenge.currentParticipants++;
          resolve(true);
        }
        resolve(false);
      }, 500);
    });
  }

  // Subscription Plans
  getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return new Promise((resolve) =>
    setTimeout(() => resolve(mockSubscriptionPlans), 300)
    );
  }
}

export const databaseService = new DatabaseService();