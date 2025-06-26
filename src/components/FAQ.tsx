import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ChevronDown, ChevronRight, MessageCircle, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ChatBot from '@/components/ChatBot';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string;
  priority: number;
  is_active: boolean;
}

interface FAQProps {
  userRole?: 'admin' | 'player';
}

const FAQ: React.FC<FAQProps> = ({ userRole = 'player' }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'General', 'Challenges', 'Events', 'Payments', 'Account', 'Technical'];

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(21776, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'priority',
        IsAsc: false,
        Filters: [
        {
          name: 'is_active',
          op: 'Equal',
          value: true
        }]

      });

      if (error) throw error;
      setFaqs(data?.List || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load FAQs. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' ||
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.keywords.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
    prev.includes(id) ?
    prev.filter((item) => item !== id) :
    [...prev, id]
    );
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return faqs.length;
    return faqs.filter((faq) => faq.category === category).length;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" data-id="c2f7yo3xi" data-path="src/components/FAQ.tsx">
        <div className="text-center" data-id="w9xsx54v8" data-path="src/components/FAQ.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" data-id="5wwuxvqn0" data-path="src/components/FAQ.tsx"></div>
          <p className="text-gray-600" data-id="1s63r17gj" data-path="src/components/FAQ.tsx">Loading FAQs...</p>
        </div>
      </div>);

  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" data-id="lgiajn7yc" data-path="src/components/FAQ.tsx">
      <div className="text-center mb-6" data-id="fs2f4z0zi" data-path="src/components/FAQ.tsx">
        <h1 className="text-2xl font-bold mb-2" data-id="ye35db04l" data-path="src/components/FAQ.tsx">Help Center</h1>
        <p className="text-muted-foreground" data-id="f3vw78e35" data-path="src/components/FAQ.tsx">
          Find answers to common questions or chat with our assistant for personalized help.
        </p>
      </div>

      {/* FAQ or ChatBot Toggle */}
      <Tabs value={showChatBot ? 'chatbot' : 'faq'} onValueChange={(value) => setShowChatBot(value === 'chatbot')} className="space-y-6" data-id="rzt9tguux" data-path="src/components/FAQ.tsx">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto" data-id="ni0knk40a" data-path="src/components/FAQ.tsx">
          <TabsTrigger value="faq" className="flex items-center gap-2" data-id="w6dvqymlt" data-path="src/components/FAQ.tsx">
            <MessageCircle className="h-4 w-4" data-id="9u542bcm3" data-path="src/components/FAQ.tsx" />
            Browse FAQs
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="flex items-center gap-2" data-id="iv3n3b46a" data-path="src/components/FAQ.tsx">
            <Bot className="h-4 w-4" data-id="fzho5fegx" data-path="src/components/FAQ.tsx" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6" data-id="i42hn2zlm" data-path="src/components/FAQ.tsx">
          {/* Search Bar */}
          <Card data-id="1v66dt5p0" data-path="src/components/FAQ.tsx">
            <CardContent className="pt-6" data-id="n3mq92dun" data-path="src/components/FAQ.tsx">
              <div className="relative" data-id="glr6bv3zm" data-path="src/components/FAQ.tsx">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" data-id="2u7hyeomp" data-path="src/components/FAQ.tsx" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10" data-id="lb4y4zj6h" data-path="src/components/FAQ.tsx" />

              </div>
            </CardContent>
          </Card>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} data-id="8d760k8l7" data-path="src/components/FAQ.tsx">
            <TabsList className="grid w-full grid-cols-7" data-id="4lfdpwana" data-path="src/components/FAQ.tsx">
              {categories.map((category) =>
              <TabsTrigger key={category} value={category} className="text-xs" data-id="n2xny9311" data-path="src/components/FAQ.tsx">
                  {category}
                  <Badge variant="secondary" className="ml-1 text-xs" data-id="ehcqus08u" data-path="src/components/FAQ.tsx">
                    {getCategoryCount(category)}
                  </Badge>
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>

          {/* FAQ Items */}
          <div className="space-y-4" data-id="0aj9y7zbh" data-path="src/components/FAQ.tsx">
            {filteredFAQs.length === 0 ?
            <Card data-id="wscxvixo0" data-path="src/components/FAQ.tsx">
                <CardContent className="pt-6 text-center" data-id="tn6gddj7n" data-path="src/components/FAQ.tsx">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" data-id="uaq8c0pdu" data-path="src/components/FAQ.tsx" />
                  <h3 className="text-lg font-semibold mb-2" data-id="1il90aou2" data-path="src/components/FAQ.tsx">No FAQs Found</h3>
                  <p className="text-muted-foreground mb-4" data-id="3ltobk65h" data-path="src/components/FAQ.tsx">
                    {searchTerm || selectedCategory !== 'All' ?
                  'Try adjusting your search or category filter.' :
                  'No FAQs are currently available.'}
                  </p>
                  <Button
                  onClick={() => setShowChatBot(true)}
                  className="flex items-center gap-2" data-id="p8kssdgc3" data-path="src/components/FAQ.tsx">
                    <Bot className="h-4 w-4" data-id="fbyzkugw8" data-path="src/components/FAQ.tsx" />
                    Try AI Assistant
                  </Button>
                </CardContent>
              </Card> :

            filteredFAQs.map((faq) =>
            <Card key={faq.id} className="hover:shadow-md transition-shadow" data-id="erfqk4z17" data-path="src/components/FAQ.tsx">
                  <Collapsible
                open={openItems.includes(faq.id)}
                onOpenChange={() => toggleItem(faq.id)} data-id="xwuqy562o" data-path="src/components/FAQ.tsx">

                    <CollapsibleTrigger asChild data-id="mlijs70dd" data-path="src/components/FAQ.tsx">
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" data-id="n6wollzgj" data-path="src/components/FAQ.tsx">
                        <div className="flex items-center justify-between" data-id="j6u9bwmog" data-path="src/components/FAQ.tsx">
                          <div className="flex items-center space-x-3" data-id="2n3bnblsd" data-path="src/components/FAQ.tsx">
                            <Badge variant="outline" data-id="owtwygrbv" data-path="src/components/FAQ.tsx">{faq.category}</Badge>
                            <CardTitle className="text-left" data-id="r47g0yngq" data-path="src/components/FAQ.tsx">{faq.question}</CardTitle>
                          </div>
                          {openItems.includes(faq.id) ?
                      <ChevronDown className="h-4 w-4" data-id="byh7vd4fi" data-path="src/components/FAQ.tsx" /> :

                      <ChevronRight className="h-4 w-4" data-id="jdgwxlqsj" data-path="src/components/FAQ.tsx" />
                      }
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent data-id="53ffx1h26" data-path="src/components/FAQ.tsx">
                      <CardContent data-id="u7bg25hei" data-path="src/components/FAQ.tsx">
                        <div className="prose prose-sm max-w-none" data-id="fui0f255g" data-path="src/components/FAQ.tsx">
                          <p className="whitespace-pre-line" data-id="5lduvdbvb" data-path="src/components/FAQ.tsx">{faq.answer}</p>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
            )
            }
          </div>

          {/* Results Summary */}
          {filteredFAQs.length > 0 &&
          <div className="mt-8 text-center text-sm text-muted-foreground" data-id="py1bamhvx" data-path="src/components/FAQ.tsx">
              Showing {filteredFAQs.length} of {faqs.length} FAQs
            </div>
          }

          {/* AI Assistant Suggestion */}
          {searchTerm && filteredFAQs.length === 0 &&
          <Card className="border-blue-200 bg-blue-50" data-id="yzj3z0vdu" data-path="src/components/FAQ.tsx">
              <CardContent className="pt-6 text-center" data-id="2d922snq5" data-path="src/components/FAQ.tsx">
                <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600" data-id="qmy6zoa9d" data-path="src/components/FAQ.tsx" />
                <h3 className="text-lg font-semibold mb-2" data-id="2l91gh58z" data-path="src/components/FAQ.tsx">Can't find what you're looking for?</h3>
                <p className="text-muted-foreground mb-4" data-id="bmq49eh00" data-path="src/components/FAQ.tsx">
                  Our AI assistant can provide personalized answers to your specific questions.
                </p>
                <Button
                onClick={() => setShowChatBot(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" data-id="vn6yx1upk" data-path="src/components/FAQ.tsx">
                  <Bot className="h-4 w-4" data-id="46qoh8lo2" data-path="src/components/FAQ.tsx" />
                  Ask AI Assistant
                </Button>
              </CardContent>
            </Card>
          }
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-6" data-id="jmczlmoaw" data-path="src/components/FAQ.tsx">
          <ChatBot data-id="e9chd31ez" data-path="src/components/FAQ.tsx" />
        </TabsContent>
      </Tabs>
    </div>);

};

export default FAQ;