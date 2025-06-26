// Service to seed the database with sample data
export class SeedDataService {
  static async seedAllData() {
    try {
      // First create the user accounts in the authentication system
      await this.createTestUsers();

      // Then create the associated profile data
      await this.seedUserProfiles();
      await this.seedEvents();
      await this.seedChallenges();
      await this.seedMatches();
      await this.seedTransactions();
      await this.seedNotifications();

      console.log('All seed data created successfully');
      return true;
    } catch (error) {
      console.error('Error seeding data:', error);
      return false;
    }
  }

  static async createTestUsers() {
    const testUsers = [
    {
      email: 'admin@tennisclub.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      email: 'player1@example.com',
      password: 'player123',
      role: 'player'
    },
    {
      email: 'player2@example.com',
      password: 'player456',
      role: 'player'
    },
    {
      email: 'johnsmith@example.com',
      password: 'tennis789',
      role: 'player'
    },
    {
      email: 'maryjohnson@example.com',
      password: 'match2024',
      role: 'player'
    }];


    console.log('Creating test user accounts...');

    for (const user of testUsers) {
      try {
        const { error } = await window.ezsite.apis.register({
          email: user.email,
          password: user.password
        });

        if (error) {
          console.log(`User ${user.email} may already exist:`, error);
        } else {
          console.log(`Test user created: ${user.email}`);
        }
      } catch (error) {
        console.log(`Error creating user ${user.email}:`, error);
      }
    }
  }

  static async seedUserProfiles() {
    const profiles = [
    {
      user_id: 1,
      display_name: 'Admin User',
      skill_level: 'Professional',
      location_latitude: 40.7589,
      location_longitude: -73.9851,
      location_address: 'Central Park Tennis Center, New York, NY',
      phone_number: '+1 (555) 123-4567',
      subscription_tier: 'Pro',
      avatar_file_id: 0
    },
    {
      user_id: 2,
      display_name: 'Player One',
      skill_level: 'Advanced',
      location_latitude: 34.0522,
      location_longitude: -118.2437,
      location_address: 'Griffith Park Tennis Courts, Los Angeles, CA',
      phone_number: '+1 (555) 234-5678',
      subscription_tier: 'Premium',
      avatar_file_id: 0
    },
    {
      user_id: 3,
      display_name: 'Player Two',
      skill_level: 'Intermediate',
      location_latitude: 41.8781,
      location_longitude: -87.6298,
      location_address: 'Millennium Park Tennis Courts, Chicago, IL',
      phone_number: '+1 (555) 345-6789',
      subscription_tier: 'Free',
      avatar_file_id: 0
    },
    {
      user_id: 4,
      display_name: 'John Smith',
      skill_level: 'Advanced',
      location_latitude: 32.7767,
      location_longitude: -96.7970,
      location_address: 'Fair Park Tennis Center, Dallas, TX',
      phone_number: '+1 (555) 456-7890',
      subscription_tier: 'Premium',
      avatar_file_id: 0
    },
    {
      user_id: 5,
      display_name: 'Mary Johnson',
      skill_level: 'Beginner',
      location_latitude: 33.4484,
      location_longitude: -112.0740,
      location_address: 'Phoenix Tennis Center, Phoenix, AZ',
      phone_number: '+1 (555) 567-8901',
      subscription_tier: 'Free',
      avatar_file_id: 0
    }];


    for (const profile of profiles) {
      try {
        await window.ezsite.apis.tableCreate(21045, profile);
      } catch (error) {
        console.log('Profile may already exist:', profile.display_name);
      }
    }
  }

  static async seedEvents() {
    const events = [
    {
      title: 'Central Park Summer Tournament',
      description: 'Annual summer tennis tournament featuring singles and doubles competitions for all skill levels.',
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location_name: 'Central Park Tennis Center',
      location_address: 'Central Park West & 96th St, New York, NY 10025',
      location_latitude: 40.7589,
      location_longitude: -73.9851,
      event_type: 'Tournament',
      skill_level_required: 'All Levels',
      max_participants: 32,
      registration_fee: 50,
      organizer_user_id: 1,
      status: 'Active'
    },
    {
      title: 'Beginner Tennis Clinic',
      description: 'Learn the fundamentals of tennis with certified instructors in a friendly environment.',
      event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location_name: 'Riverside Tennis Courts',
      location_address: 'Riverside Park, New York, NY 10024',
      location_latitude: 40.7879,
      location_longitude: -73.9745,
      event_type: 'Clinic',
      skill_level_required: 'Beginner',
      max_participants: 12,
      registration_fee: 25,
      organizer_user_id: 2,
      status: 'Active'
    },
    {
      title: 'Evening Social Tennis',
      description: 'Casual tennis meetup for players to practice and socialize after work.',
      event_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      location_name: 'Brooklyn Bridge Park Tennis',
      location_address: 'Brooklyn Bridge Park, Brooklyn, NY 11201',
      location_latitude: 40.7024,
      location_longitude: -73.9969,
      event_type: 'Social',
      skill_level_required: 'All Levels',
      max_participants: 20,
      registration_fee: 0,
      organizer_user_id: 3,
      status: 'Active'
    },
    {
      title: 'Advanced Skills Workshop',
      description: 'Intensive workshop focusing on advanced techniques and strategy for experienced players.',
      event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      location_name: 'Queens Tennis Club',
      location_address: 'Queens, NY 11375',
      location_latitude: 40.7282,
      location_longitude: -73.7949,
      event_type: 'Clinic',
      skill_level_required: 'Advanced',
      max_participants: 8,
      registration_fee: 75,
      organizer_user_id: 1,
      status: 'Active'
    },
    {
      title: 'Carmel Valley Tennis - July/August Junior Clinics',
      description: `The schedule is posted for July and August junior clinics. To sign-up, please email one of the following contacts.

Recreational Sign-Ups: michaelwilliamscvt@gmail.com

High Performance Sign-Ups: josephreyescvt@gmail.com

For class information, reference the flyer attached. Times may vary per week. Check your Playbypoint app for each class.

Note: We are starting to send personalized emails for Fall classes, please check your inbox.

Bookings Website Link available upon registration.`,
      event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location_name: 'Carmel Valley Tennis',
      location_address: 'Carmel Valley, CA 93924',
      location_latitude: 36.4864,
      location_longitude: -121.7713,
      event_type: 'Clinic',
      skill_level_required: 'All Levels',
      max_participants: 24,
      registration_fee: 150,
      organizer_user_id: 1,
      status: 'Active'
    }];


    for (const event of events) {
      try {
        await window.ezsite.apis.tableCreate(21046, event);
      } catch (error) {
        console.log('Event may already exist:', event.title);
      }
    }
  }

  static async seedChallenges() {
    const challenges = [
    {
      challenger_user_id: 1,
      opponent_user_id: 2,
      challenge_type: 'Singles',
      skill_level: 'Advanced',
      preferred_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      location_preference: 'Central Park Tennis Center',
      status: 'Accepted',
      message: 'Looking forward to a great match!',
      stakes: 'Winner buys coffee',
      doubles_partner_user_id: 0,
      response_deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      challenger_user_id: 3,
      opponent_user_id: 0,
      challenge_type: 'Singles',
      skill_level: 'Beginner',
      preferred_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location_preference: 'Any local court',
      status: 'Open',
      message: 'New player looking for a friendly match to improve skills',
      stakes: '',
      doubles_partner_user_id: 0,
      response_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      challenger_user_id: 2,
      opponent_user_id: 1,
      challenge_type: 'Doubles',
      skill_level: 'Professional',
      preferred_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location_preference: 'Professional courts with spectator seating',
      status: 'Pending',
      message: 'High stakes doubles match - bring your A game!',
      stakes: '$100 per team',
      doubles_partner_user_id: 3,
      response_deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      challenger_user_id: 4,
      opponent_user_id: 5,
      challenge_type: 'Singles',
      skill_level: 'Intermediate',
      preferred_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      location_preference: 'Fair Park Tennis Center',
      status: 'Accepted',
      message: 'Great way to practice before the tournament!',
      stakes: 'Lunch at the winner\'s choice',
      doubles_partner_user_id: 0,
      response_deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    }];


    for (const challenge of challenges) {
      try {
        await window.ezsite.apis.tableCreate(21047, challenge);
      } catch (error) {
        console.log('Challenge may already exist');
      }
    }
  }

  static async seedMatches() {
    const matches = [
    {
      challenge_id: 1,
      player1_user_id: 1,
      player2_user_id: 2,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Central Park Tennis Center - Court 3',
      score_sets: '6-4, 7-5',
      winner_user_id: 1,
      status: 'Completed',
      score_entered_by: 1,
      score_verified_by: 2,
      verification_status: 'Verified'
    },
    {
      challenge_id: 2,
      player1_user_id: 2,
      player2_user_id: 3,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Brooklyn Bridge Park Tennis - Court 1',
      score_sets: '6-2, 6-3',
      winner_user_id: 2,
      status: 'Completed',
      score_entered_by: 2,
      score_verified_by: 3,
      verification_status: 'Verified'
    },
    {
      challenge_id: 3,
      player1_user_id: 1,
      player2_user_id: 3,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Riverside Tennis Courts',
      score_sets: '6-1, 6-0',
      winner_user_id: 1,
      status: 'Completed',
      score_entered_by: 1,
      score_verified_by: 0,
      verification_status: 'Pending'
    },
    {
      challenge_id: 4,
      player1_user_id: 4,
      player2_user_id: 5,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Fair Park Tennis Center - Court 2',
      score_sets: '7-6, 4-6, 6-3',
      winner_user_id: 4,
      status: 'Completed',
      score_entered_by: 4,
      score_verified_by: 5,
      verification_status: 'Verified'
    },
    {
      challenge_id: 1,
      player1_user_id: 2,
      player2_user_id: 4,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Queens Tennis Club - Court 1',
      score_sets: '6-4, 3-6, 7-5',
      winner_user_id: 2,
      status: 'Completed',
      score_entered_by: 2,
      score_verified_by: 4,
      verification_status: 'Verified'
    },
    {
      challenge_id: 2,
      player1_user_id: 3,
      player2_user_id: 5,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Phoenix Tennis Center - Court 3',
      score_sets: '6-2, 6-1',
      winner_user_id: 3,
      status: 'Completed',
      score_entered_by: 3,
      score_verified_by: 5,
      verification_status: 'Verified'
    },
    {
      challenge_id: 1,
      player1_user_id: 1,
      player2_user_id: 4,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Central Park Tennis Center - Court 1',
      score_sets: '7-5, 6-4',
      winner_user_id: 1,
      status: 'Completed',
      score_entered_by: 1,
      score_verified_by: 4,
      verification_status: 'Verified'
    },
    {
      challenge_id: 3,
      player1_user_id: 2,
      player2_user_id: 5,
      player3_user_id: 0,
      player4_user_id: 0,
      match_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Griffith Park Tennis Courts - Court 2',
      score_sets: '6-3, 7-6',
      winner_user_id: 2,
      status: 'Completed',
      score_entered_by: 2,
      score_verified_by: 5,
      verification_status: 'Verified'
    }];


    for (const match of matches) {
      try {
        await window.ezsite.apis.tableCreate(21048, match);
      } catch (error) {
        console.log('Match may already exist');
      }
    }
  }

  static async seedTransactions() {
    const transactions = [
    {
      user_id: 1,
      transaction_type: 'Subscription',
      amount: 49.99,
      currency: 'USD',
      status: 'Completed',
      payment_method: 'Credit Card',
      description: 'Pro subscription upgrade',
      related_id: 0,
      transaction_reference: 'TXN-1234567890-ABC'
    },
    {
      user_id: 2,
      transaction_type: 'Subscription',
      amount: 29.99,
      currency: 'USD',
      status: 'Completed',
      payment_method: 'PayPal',
      description: 'Premium subscription upgrade',
      related_id: 0,
      transaction_reference: 'TXN-0987654321-DEF'
    },
    {
      user_id: 1,
      transaction_type: 'Event Registration',
      amount: 50.00,
      currency: 'USD',
      status: 'Completed',
      payment_method: 'Credit Card',
      description: 'Central Park Summer Tournament registration',
      related_id: 1,
      transaction_reference: 'TXN-5555555555-GHI'
    },
    {
      user_id: 3,
      transaction_type: 'Challenge Stakes',
      amount: 25.00,
      currency: 'USD',
      status: 'Completed',
      payment_method: 'Credit Card',
      description: 'Stakes for singles challenge match',
      related_id: 2,
      transaction_reference: 'TXN-7777777777-JKL'
    },
    {
      user_id: 4,
      transaction_type: 'Subscription',
      amount: 29.99,
      currency: 'USD',
      status: 'Completed',
      payment_method: 'Credit Card',
      description: 'Premium subscription upgrade',
      related_id: 0,
      transaction_reference: 'TXN-1111111111-MNO'
    },
    {
      user_id: 1,
      transaction_type: 'Event Registration',
      amount: 150.00,
      currency: 'USD',
      status: 'Completed',
      payment_method: 'Credit Card',
      description: 'Carmel Valley Tennis Junior Clinics registration',
      related_id: 5,
      transaction_reference: 'TXN-2222222222-PQR'
    }];


    for (const transaction of transactions) {
      try {
        await window.ezsite.apis.tableCreate(21050, transaction);
      } catch (error) {
        console.log('Transaction may already exist');
      }
    }
  }

  static async seedNotifications() {
    const notifications = [
    {
      user_id: 1,
      title: 'Challenge Accepted!',
      message: 'Player One has accepted your singles challenge. Match scheduled for this weekend.',
      notification_type: 'Challenge',
      related_id: 1,
      is_read: false,
      priority: 'High',
      action_url: '/challenges'
    },
    {
      user_id: 2,
      title: 'New Tournament Available',
      message: 'Central Park Summer Tournament is now open for registration. Early bird pricing ends soon!',
      notification_type: 'Event',
      related_id: 1,
      is_read: false,
      priority: 'Medium',
      action_url: '/events'
    },
    {
      user_id: 3,
      title: 'Match Score Verification',
      message: 'Please verify the score for your recent match against Admin User.',
      notification_type: 'Match',
      related_id: 3,
      is_read: false,
      priority: 'High',
      action_url: '/matches'
    },
    {
      user_id: 1,
      title: 'Payment Successful',
      message: 'Your Pro subscription payment has been processed successfully. Welcome to premium features!',
      notification_type: 'Payment',
      related_id: 1,
      is_read: true,
      priority: 'Medium',
      action_url: '/profile'
    },
    {
      user_id: 2,
      title: 'New Challenge Request',
      message: 'Admin User has challenged you to a doubles match. Stakes: $100 per team!',
      notification_type: 'Challenge',
      related_id: 3,
      is_read: false,
      priority: 'Urgent',
      action_url: '/challenges'
    },
    {
      user_id: 4,
      title: 'Match Victory!',
      message: 'Congratulations on your recent win! Your match score has been verified.',
      notification_type: 'Match',
      related_id: 4,
      is_read: false,
      priority: 'Medium',
      action_url: '/matches'
    },
    {
      user_id: 5,
      title: 'Score Verification Request',
      message: 'John Smith has entered the score for your recent match. Please verify.',
      notification_type: 'Match',
      related_id: 4,
      is_read: false,
      priority: 'High',
      action_url: '/matches'
    }];


    for (const notification of notifications) {
      try {
        await window.ezsite.apis.tableCreate(21049, notification);
      } catch (error) {
        console.log('Notification may already exist');
      }
    }
  }
}

export default SeedDataService;