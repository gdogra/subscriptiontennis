import { toast } from '@/hooks/use-toast';

export const seedFAQData = async () => {
  const faqData = [
  // General FAQs
  {
    category: 'General',
    question: 'What is this tennis challenge platform?',
    answer: 'This is a platform that connects tennis players to create challenges, find matches, participate in events, and track their progress. You can challenge other players, join tournaments, and improve your tennis skills.',
    keywords: 'platform, tennis, challenge, what is, about, app, website',
    priority: 10,
    is_active: true
  },
  {
    category: 'General',
    question: 'How do I get started?',
    answer: 'To get started:\n1. Create an account and verify your email\n2. Complete your player profile with skill level and location\n3. Browse challenges or create your own\n4. Connect with other tennis players in your area',
    keywords: 'get started, begin, how to start, new user, first time',
    priority: 9,
    is_active: true
  },
  {
    category: 'General',
    question: 'Is the platform free to use?',
    answer: 'We offer both free and premium subscription tiers. Free users can create basic challenges and participate in community events. Premium users get access to advanced features like priority matching, detailed statistics, and exclusive tournaments.',
    keywords: 'free, cost, price, subscription, premium, money',
    priority: 8,
    is_active: true
  },

  // Tennis Scoring FAQs
  {
    category: 'General',
    question: 'How does tennis scoring work?',
    answer: 'Tennis scoring follows a unique system:\n\n**Points in a game:**\n• 0 points = "Love"\n• 1 point = "15"\n• 2 points = "30" \n• 3 points = "40"\n• 4 points = Game won (unless tied at 40-40)\n\n**Deuce:** When both players reach 40, it\'s called "deuce." A player must win by 2 points from deuce.\n\n**Sets:** First to win 6 games wins the set (must win by 2). If tied 6-6, a tiebreaker is played.\n\n**Match:** Best of 3 or 5 sets depending on the tournament format.',
    keywords: 'scoring, how does scoring work, tennis score, points, games, sets, match, love, deuce, tiebreak',
    priority: 10,
    is_active: true
  },
  {
    category: 'General',
    question: 'What is deuce in tennis?',
    answer: 'Deuce occurs when both players have won 3 points each (40-40). From deuce:\n• A player must win the next point to get "advantage"\n• If the player with advantage wins the next point, they win the game\n• If the other player wins, the score returns to deuce\n• This continues until one player wins by 2 points',
    keywords: 'deuce, 40-40, advantage, tied, tennis rules',
    priority: 8,
    is_active: true
  },
  {
    category: 'General',
    question: 'How does a tiebreaker work in tennis?',
    answer: 'A tiebreaker is played when the set score reaches 6-6:\n• First to reach 7 points wins the tiebreaker\n• Must win by at least 2 points (e.g., 7-5, 8-6, 10-8)\n• Players switch sides after every 6 points\n• The player who wins the tiebreaker wins the set 7-6',
    keywords: 'tiebreaker, tie break, 6-6, 7-6, tiebreak rules',
    priority: 7,
    is_active: true
  },
  {
    category: 'General',
    question: 'What are the different tennis court surfaces?',
    answer: 'There are four main tennis court surfaces:\n\n**Hard Courts:** Most common, medium speed, consistent bounce\n**Clay Courts:** Slower surface, high bounce, made of crushed brick or stone\n**Grass Courts:** Fastest surface, low bounce, slippery when wet\n**Carpet Courts:** Indoor synthetic surface, less common nowadays\n\nEach surface affects playing style and ball behavior differently.',
    keywords: 'court surfaces, hard court, clay court, grass court, court types',
    priority: 6,
    is_active: true
  },

  // Challenge FAQs
  {
    category: 'Challenges',
    question: 'How do I create a challenge?',
    answer: 'To create a challenge:\n1. Go to your dashboard and click "Create Challenge"\n2. Set your preferred match type (singles/doubles)\n3. Choose skill level requirements\n4. Set date, time, and location preferences\n5. Add any special notes or stakes\n6. Publish your challenge',
    keywords: 'create challenge, how to make, new match, challenge someone',
    priority: 9,
    is_active: true
  },
  {
    category: 'Challenges',
    question: 'How do I accept a challenge?',
    answer: 'To accept a challenge:\n1. Browse available challenges in your area\n2. Check the details (skill level, date, location)\n3. Click "Accept Challenge"\n4. Confirm your participation\n5. Contact the challenger to finalize details',
    keywords: 'accept challenge, how to join, participate, respond to challenge',
    priority: 8,
    is_active: true
  },
  {
    category: 'Challenges',
    question: 'Can I cancel a challenge?',
    answer: 'Yes, you can cancel challenges you\'ve created or accepted. However, please cancel as early as possible to be respectful of other players\' time. Frequent cancellations may affect your reputation score.',
    keywords: 'cancel challenge, withdraw, remove, delete, cancel match',
    priority: 7,
    is_active: true
  },
  {
    category: 'Challenges',
    question: 'What are challenge stakes?',
    answer: 'Challenge stakes are optional rewards or consequences you can set for matches. This could be a friendly wager, winner buys drinks, or bragging rights. Stakes are entirely optional and should be agreed upon by both players.',
    keywords: 'stakes, bet, wager, reward, prize, what are stakes',
    priority: 6,
    is_active: true
  },
  {
    category: 'Challenges',
    question: 'How do I record match results?',
    answer: 'After completing a match:\n1. Go to your active challenges\n2. Click "Record Score" on the completed match\n3. Enter the set scores (e.g., 6-4, 7-5)\n4. Submit the results\n5. Your opponent will receive a notification to verify\n6. Once verified, the match is officially recorded',
    keywords: 'record results, enter score, match results, scoring, report score',
    priority: 8,
    is_active: true
  },

  // Events FAQs
  {
    category: 'Events',
    question: 'How do I find tennis events near me?',
    answer: 'Use the "Events Near Me" feature on your dashboard. You can filter by distance, skill level, event type, and date. Make sure your location is set correctly in your profile for accurate results.',
    keywords: 'find events, near me, location, tournaments, local events',
    priority: 8,
    is_active: true
  },
  {
    category: 'Events',
    question: 'Can I organize my own tournament?',
    answer: 'Yes! Premium users can create and organize tournaments. You can set up brackets, manage registrations, collect fees, and track results. Contact support if you need help setting up a large tournament.',
    keywords: 'organize tournament, create event, host, tournament director',
    priority: 7,
    is_active: true
  },
  {
    category: 'Events',
    question: 'How do event registrations work?',
    answer: 'Event registration varies by event type:\n• Free events: Simply click "Register"\n• Paid events: Complete payment during registration\n• Limited spots: Registration is first-come, first-served\n• Some events may require skill level verification',
    keywords: 'event registration, how to register, sign up, join event',
    priority: 7,
    is_active: true
  },

  // Account FAQs
  {
    category: 'Account',
    question: 'How do I update my skill level?',
    answer: 'You can update your skill level in your profile settings. Be honest about your level to ensure fair matches. Your skill level may be adjusted based on match results and community feedback.',
    keywords: 'skill level, update, change, profile, rating, ability',
    priority: 7,
    is_active: true
  },
  {
    category: 'Account',
    question: 'How do I change my location?',
    answer: 'Go to your profile settings and update your location information. This helps us show you relevant challenges and events in your area. You can set your precise location or just your general area.',
    keywords: 'location, change, update, address, move, relocate',
    priority: 6,
    is_active: true
  },
  {
    category: 'Account',
    question: 'Can I delete my account?',
    answer: 'Yes, you can delete your account from the settings page. This will permanently remove all your data including match history, challenges, and profile information. This action cannot be undone.',
    keywords: 'delete account, remove profile, close account, deactivate',
    priority: 5,
    is_active: true
  },

  // Payment FAQs
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay. All payments are processed securely through encrypted connections.',
    keywords: 'payment methods, credit card, paypal, accepted payments, how to pay',
    priority: 7,
    is_active: true
  },
  {
    category: 'Payments',
    question: 'How do refunds work?',
    answer: 'Refund policies vary by purchase type:\n• Subscription: Prorated refunds within 30 days\n• Event fees: Depends on event policy\n• Challenge stakes: Handled between players\nContact support for specific refund requests.',
    keywords: 'refund, money back, return payment, refund policy',
    priority: 6,
    is_active: true
  },
  {
    category: 'Payments',
    question: 'Is my payment information secure?',
    answer: 'Yes, we use industry-standard encryption and security measures. We don\'t store your full credit card information on our servers. All transactions are processed through certified payment processors.',
    keywords: 'secure payment, safety, credit card security, payment protection',
    priority: 6,
    is_active: true
  },

  // Technical FAQs
  {
    category: 'Technical',
    question: 'The app is running slowly, what should I do?',
    answer: 'Try these troubleshooting steps:\n1. Refresh your browser or restart the app\n2. Clear your browser cache\n3. Check your internet connection\n4. Try a different browser\n5. Contact support if issues persist',
    keywords: 'slow performance, troubleshoot, fix, technical issues, app problems',
    priority: 6,
    is_active: true
  },
  {
    category: 'Technical',
    question: 'I\'m not receiving email notifications',
    answer: 'Check these common issues:\n1. Look in your spam/junk folder\n2. Add our email to your safe senders list\n3. Check your notification settings in your profile\n4. Verify your email address is correct\n5. Contact support if still not working',
    keywords: 'email notifications, not receiving, spam, email problems',
    priority: 7,
    is_active: true
  },
  {
    category: 'Technical',
    question: 'How do I report a bug or technical issue?',
    answer: 'To report technical issues:\n1. Use the "Contact Support" feature in the app\n2. Include details about what you were doing when the issue occurred\n3. Mention your device and browser information\n4. Attach screenshots if helpful\nWe aim to respond to all reports within 24 hours.',
    keywords: 'report bug, technical issue, problem, support, report problem',
    priority: 5,
    is_active: true
  }];

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const faq of faqData) {
      try {
        const { error } = await window.ezsite.apis.tableCreate(21776, faq);
        if (error) {
          console.error('Error creating FAQ:', error);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error('Error creating FAQ:', err);
        errorCount++;
      }
    }

    toast({
      title: 'FAQ Data Seeded',
      description: `Successfully created ${successCount} FAQs${errorCount > 0 ? `, ${errorCount} failed` : ''}`
    });

    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error('Error seeding FAQ data:', error);
    toast({
      title: 'Error',
      description: 'Failed to seed FAQ data. Please try again.',
      variant: 'destructive'
    });
    throw error;
  }
};