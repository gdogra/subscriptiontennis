import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, HelpCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string;
  priority: number;
  is_active: boolean;
  relevanceScore?: number;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  faqs?: FAQ[];
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    content: "Hello! I'm your tennis assistant. I can help you find answers to common questions about challenges, events, payments, and more. What would you like to know?",
    isUser: false,
    timestamp: new Date()
  }]
  );
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Enhanced text similarity function using multiple algorithms
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Exact match bonus
    if (s1.includes(s2) || s2.includes(s1)) {
      return 1;
    }

    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        // Direct word match
        if (word1 === word2) {
          matches += 2;
        }
        // Partial word match
        else if (word1.length >= 3 && word2.length >= 3) {
          if (word1.includes(word2) || word2.includes(word1)) {
            matches += 1;
          }
        }
      }
    }

    return matches / Math.max(words1.length, words2.length);
  };

  // Enhanced keyword matching with fuzzy logic
  const calculateKeywordScore = (query: string, keywords: string): number => {
    const queryLower = query.toLowerCase();
    const keywordList = keywords.toLowerCase().split(',').map((k) => k.trim());

    let totalScore = 0;
    let maxScore = keywordList.length;

    for (const keyword of keywordList) {
      if (!keyword) continue;

      // Exact keyword match (highest score)
      if (queryLower.includes(keyword) && keyword.length >= 3) {
        totalScore += 3;
      }
      // Partial keyword match
      else if (keyword.length >= 4) {
        const words = queryLower.split(/\s+/);
        for (const word of words) {
          if (word.includes(keyword) || keyword.includes(word)) {
            totalScore += 1;
            break;
          }
        }
      }
    }

    return maxScore > 0 ? totalScore / maxScore : 0;
  };

  // Preprocess query to extract key terms
  const preprocessQuery = (query: string): string => {
    // Remove common stop words that don't help with matching
    const stopWords = ['how', 'do', 'does', 'can', 'what', 'where', 'when', 'why', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = query.toLowerCase().split(/\s+/);
    const filteredWords = words.filter((word) =>
    word.length > 2 && !stopWords.includes(word)
    );
    return filteredWords.join(' ');
  };

  // Enhanced keyword mapping for tennis-specific terms
  const enhanceQuery = (query: string): string => {
    const enhancements = {
      'score': 'scoring point deuce advantage game set match',
      'scoring': 'score point deuce advantage game set match tiebreak',
      'deuce': 'deuce advantage scoring tennis game',
      'tiebreak': 'tiebreak tie-break scoring tennis set',
      'match': 'match game set scoring tennis',
      'challenge': 'challenge opponent player create accept',
      'event': 'event tournament registration location',
      'payment': 'payment subscription fee billing',
      'location': 'location address map nearby',
      'profile': 'profile account settings user'
    };

    let enhancedQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(enhancements)) {
      if (enhancedQuery.includes(key)) {
        enhancedQuery += ' ' + value;
      }
    }
    return enhancedQuery;
  };

  // Search FAQs based on user input with enhanced matching
  const searchFAQs = async (query: string): Promise<FAQ[]> => {
    try {
      console.log('Searching FAQs for:', query);

      // Get all active FAQs
      const response = await window.ezsite.apis.tablePage(21776, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: "priority",
        IsAsc: false,
        Filters: [{
          name: "is_active",
          op: "Equal",
          value: true
        }]
      });

      if (response.error) {
        console.error('Error fetching FAQs:', response.error);
        return [];
      }

      const faqs = response.data?.List || [];
      console.log('Retrieved FAQs:', faqs.length);

      const processedQuery = preprocessQuery(query);
      const enhancedQuery = enhanceQuery(query);
      console.log('Processed query:', processedQuery);
      console.log('Enhanced query:', enhancedQuery);

      // Score each FAQ based on multiple factors
      const scoredFAQs = faqs.map((faq: FAQ) => {
        let score = 0;
        const queryLower = query.toLowerCase();
        const processedQueryLower = processedQuery.toLowerCase();

        // 1. Enhanced keyword matching (highest weight)
        const keywordScore = calculateKeywordScore(enhancedQuery, faq.keywords);
        score += keywordScore * 15;

        // 2. Question similarity with enhanced query
        const questionSimilarity = calculateSimilarity(enhancedQuery, faq.question);
        score += questionSimilarity * 12;

        // 3. Specific tennis scoring term boosts
        const scoringTerms = ['scor', 'deuce', 'tiebreak', 'advantage', 'point', 'game', 'set'];
        const tennisTerms = ['tennis', 'racket', 'court', 'serve', 'volley'];
        const challengeTerms = ['challenge', 'opponent', 'match', 'accept', 'create'];

        scoringTerms.forEach((term) => {
          if (queryLower.includes(term) && faq.question.toLowerCase().includes(term)) {
            score += 20;
          }
          if (queryLower.includes(term) && faq.answer.toLowerCase().includes(term)) {
            score += 15;
          }
        });

        tennisTerms.forEach((term) => {
          if (queryLower.includes(term) && (faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term))) {
            score += 10;
          }
        });

        challengeTerms.forEach((term) => {
          if (queryLower.includes(term) && (faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term))) {
            score += 12;
          }
        });

        // 4. Category-based scoring
        if (queryLower.includes('pay') && faq.category.toLowerCase() === 'payments') score += 10;
        if (queryLower.includes('event') && faq.category.toLowerCase() === 'events') score += 10;
        if (queryLower.includes('challenge') && faq.category.toLowerCase() === 'challenges') score += 10;
        if (queryLower.includes('account') && faq.category.toLowerCase() === 'account') score += 10;
        if (queryLower.includes('technical') && faq.category.toLowerCase() === 'technical') score += 10;

        // 5. Answer content similarity (moderate weight)
        const answerSimilarity = calculateSimilarity(enhancedQuery, faq.answer);
        score += answerSimilarity * 8;

        // 6. Priority bonus
        score += faq.priority * 1;

        // 7. Exact phrase matching bonus
        if (faq.question.toLowerCase().includes(processedQueryLower) ||
        processedQueryLower.includes(faq.question.toLowerCase())) {
          score += 8;
        }

        console.log(`FAQ "${faq.question.substring(0, 50)}..." - Score: ${score.toFixed(2)}`);
        return { ...faq, relevanceScore: score };
      });

      // Filter and sort by relevance with lower threshold
      const relevantFAQs = scoredFAQs.
      filter((faq) => faq.relevanceScore > 0.5) // Very low threshold for better recall
      .sort((a, b) => b.relevanceScore - a.relevanceScore).
      slice(0, 3); // Return top 3 matches

      console.log('Relevant FAQs found:', relevantFAQs.length);
      if (relevantFAQs.length > 0) {
        console.log('Top match:', relevantFAQs[0].question, 'Score:', relevantFAQs[0].relevanceScore);
      }

      return relevantFAQs;
    } catch (error) {
      console.error('Error searching FAQs:', error);
      return [];
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Search for relevant FAQs
      const relevantFAQs = await searchFAQs(currentInput);

      let botResponse: Message;

      if (relevantFAQs.length > 0) {
        // Create response with FAQ answers
        const mainAnswer = relevantFAQs[0];
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: mainAnswer.answer,
          isUser: false,
          timestamp: new Date(),
          faqs: relevantFAQs
        };
      } else {
        // Enhanced fallback response with helpful suggestions
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "I couldn't find a specific answer to your question in our FAQ database. Here are some things you can try:\n\n• Try rephrasing your question with different keywords\n• Browse our FAQ categories: General, Challenges, Events, Payments, Account, or Technical\n• Ask about common topics like:\n  - Tennis scoring rules (deuce, advantage, tiebreak)\n  - How to create or accept challenges\n  - Finding events near you\n  - Payment and subscription information\n  - Account and profile settings\n\n• Contact our support team for personalized assistance\n\nWhat specific aspect would you like to know more about?",
          isUser: false,
          timestamp: new Date()
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setInputValue(question);
    // Simulate user clicking send
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const quickQuestions = [
  "How does tennis scoring work?",
  "What is deuce in tennis?",
  "How do I create a challenge?",
  "What are the subscription plans?",
  "How do I find events near me?",
  "How to update my profile?"];


  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col" data-id="sk0ppr7ep" data-path="src/components/ChatBot.tsx">
      <CardHeader className="pb-4" data-id="6qz8o4syp" data-path="src/components/ChatBot.tsx">
        <div className="flex items-center gap-3" data-id="srar5nnmo" data-path="src/components/ChatBot.tsx">
          <Avatar className="h-10 w-10" data-id="719p6ahno" data-path="src/components/ChatBot.tsx">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white" data-id="v8y6lgp6n" data-path="src/components/ChatBot.tsx">
              <Bot className="h-5 w-5" data-id="8e8a5a0fv" data-path="src/components/ChatBot.tsx" />
            </AvatarFallback>
          </Avatar>
          <div data-id="93fm5c4q6" data-path="src/components/ChatBot.tsx">
            <h3 className="text-lg font-semibold" data-id="p7rvh4tie" data-path="src/components/ChatBot.tsx">Tennis Assistant</h3>
            <p className="text-sm text-muted-foreground" data-id="y3w08oxz5" data-path="src/components/ChatBot.tsx">Ask me anything about tennis challenges, events, and more!</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0" data-id="3da7y93sa" data-path="src/components/ChatBot.tsx">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef} data-id="7g3pnoc4b" data-path="src/components/ChatBot.tsx">
          <div className="space-y-4" data-id="lzsf4pc2e" data-path="src/components/ChatBot.tsx">
            {messages.map((message) =>
            <div key={message.id} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`} data-id="q8bwda38l" data-path="src/components/ChatBot.tsx">
                {!message.isUser &&
              <Avatar className="h-8 w-8 mt-1" data-id="wb6ymicur" data-path="src/components/ChatBot.tsx">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs" data-id="mcpa09iz8" data-path="src/components/ChatBot.tsx">
                      <Bot className="h-4 w-4" data-id="fy4s8fu2z" data-path="src/components/ChatBot.tsx" />
                    </AvatarFallback>
                  </Avatar>
              }
                
                <div className={`max-w-[80%] ${message.isUser ? 'order-2' : ''}`} data-id="cquhg8hf2" data-path="src/components/ChatBot.tsx">
                  <div
                  className={`p-3 rounded-lg whitespace-pre-wrap ${
                  message.isUser ?
                  'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto' :
                  'bg-muted'}`
                  } data-id="785vwoblq" data-path="src/components/ChatBot.tsx">

                    {message.content}
                  </div>
                  
                  {/* Show related FAQs if available */}
                  {message.faqs && message.faqs.length > 1 &&
                <div className="mt-2 space-y-2" data-id="c0i8nkhuv" data-path="src/components/ChatBot.tsx">
                      <p className="text-sm text-muted-foreground flex items-center gap-1" data-id="aute3n8w5" data-path="src/components/ChatBot.tsx">
                        <Lightbulb className="h-3 w-3" data-id="hdq8bmyq3" data-path="src/components/ChatBot.tsx" />
                        Related questions:
                      </p>
                      {message.faqs.slice(1).map((faq) =>
                  <div key={faq.id} className="p-2 border rounded-md bg-background hover:bg-muted/50 transition-colors" data-id="wp70b8xdd" data-path="src/components/ChatBot.tsx">
                          <div className="flex items-center gap-2 mb-1" data-id="pbe1u2yzy" data-path="src/components/ChatBot.tsx">
                            <Badge variant="outline" className="text-xs" data-id="husxtxrmy" data-path="src/components/ChatBot.tsx">
                              {faq.category}
                            </Badge>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" data-id="hou2tnhpj" data-path="src/components/ChatBot.tsx" />
                          </div>
                          <p className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => handleQuickQuestion(faq.question)} data-id="tubxqyola" data-path="src/components/ChatBot.tsx">
                            {faq.question}
                          </p>
                        </div>
                  )}
                    </div>
                }
                  
                  <div className="text-xs text-muted-foreground mt-1" data-id="94ea0be8m" data-path="src/components/ChatBot.tsx">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                {message.isUser &&
              <Avatar className="h-8 w-8 mt-1" data-id="sysdjjemu" data-path="src/components/ChatBot.tsx">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs" data-id="546vki2po" data-path="src/components/ChatBot.tsx">
                      <User className="h-4 w-4" data-id="pxpzb7ph9" data-path="src/components/ChatBot.tsx" />
                    </AvatarFallback>
                  </Avatar>
              }
              </div>
            )}
            
            {isLoading &&
            <div className="flex gap-3 justify-start" data-id="qkpb2d1rq" data-path="src/components/ChatBot.tsx">
                <Avatar className="h-8 w-8 mt-1" data-id="5togxi4uk" data-path="src/components/ChatBot.tsx">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs" data-id="9sz548th1" data-path="src/components/ChatBot.tsx">
                    <Bot className="h-4 w-4" data-id="8c282s4wp" data-path="src/components/ChatBot.tsx" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg" data-id="gcieg9mgo" data-path="src/components/ChatBot.tsx">
                  <div className="flex items-center gap-2" data-id="d312qcvvg" data-path="src/components/ChatBot.tsx">
                    <Loader2 className="h-4 w-4 animate-spin" data-id="nszb68yoz" data-path="src/components/ChatBot.tsx" />
                    <span className="text-sm" data-id="nobabmdf2" data-path="src/components/ChatBot.tsx">Searching knowledge base...</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </ScrollArea>
        
        {/* Quick Questions */}
        {messages.length === 1 &&
        <div className="mt-4 mb-4" data-id="0uczx6qbh" data-path="src/components/ChatBot.tsx">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1" data-id="get6048jx" data-path="src/components/ChatBot.tsx">
              <Lightbulb className="h-3 w-3" data-id="wt4xf4gjf" data-path="src/components/ChatBot.tsx" />
              Try asking about:
            </p>
            <div className="flex flex-wrap gap-2" data-id="nqczhgf90" data-path="src/components/ChatBot.tsx">
              {quickQuestions.map((question, index) =>
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question)}
              className="text-xs hover:bg-blue-50 hover:border-blue-300" data-id="99xl4b38y" data-path="src/components/ChatBot.tsx">

                  {question}
                </Button>
            )}
            </div>
          </div>
        }
        
        {/* Input Area */}
        <div className="flex gap-2 mt-4" data-id="v2ed1cpja" data-path="src/components/ChatBot.tsx">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about tennis scoring, challenges, events, or anything else..."
            disabled={isLoading}
            className="flex-1" data-id="boadwpmfd" data-path="src/components/ChatBot.tsx" />

          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" data-id="br1yd23ot" data-path="src/components/ChatBot.tsx">

            {isLoading ?
            <Loader2 className="h-4 w-4 animate-spin" data-id="fadckrym3" data-path="src/components/ChatBot.tsx" /> :

            <Send className="h-4 w-4" data-id="apu2h56vt" data-path="src/components/ChatBot.tsx" />
            }
          </Button>
        </div>
      </CardContent>
    </Card>);

};

export default ChatBot;