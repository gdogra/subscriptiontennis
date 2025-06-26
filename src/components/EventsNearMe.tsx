import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Trophy, Search, Filter, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import PaymentModal from '@/components/PaymentModal';

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location_name: string;
  location_address: string;
  location_latitude: number;
  location_longitude: number;
  event_type: string;
  skill_level_required: string;
  max_participants: number;
  registration_fee: number;
  organizer_user_id: number;
  status: string;
}

const EventsNearMe: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, typeFilter, skillFilter]);

  const loadEvents = async () => {
    try {
      console.log('Loading events...');
      setLoading(true);

      const { data, error } = await window.ezsite.apis.tablePage(21046, {
        PageNo: 1,
        PageSize: 100,
        Filters: [
        { name: "status", op: "Equal", value: "Active" }],

        OrderByField: "event_date",
        IsAsc: true
      });

      if (error) {
        throw new Error(error);
      }

      const eventsList = data?.List || [];
      setEvents(eventsList);
      console.log('Events loaded:', eventsList.length);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((event) => event.event_type === typeFilter);
    }

    // Skill level filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter((event) =>
      event.skill_level_required === skillFilter ||
      event.skill_level_required === 'All Levels'
      );
    }

    setFilteredEvents(filtered);
  };

  const registerForEvent = async (event: Event) => {
    if (!user?.ID) {
      toast({
        title: "Login Required",
        description: "Please log in to register for events.",
        variant: "destructive"
      });
      return;
    }

    // Check if payment is required
    if (event.registration_fee > 0) {
      setSelectedEvent(event);
      setShowPaymentModal(true);
      return;
    }

    // Free event registration
    await handleEventRegistration(event);
  };

  const handleEventRegistration = async (event: Event) => {
    try {
      console.log('Registering for event:', event.id);

      // Create a transaction record for paid events
      if (event.registration_fee > 0) {
        await window.ezsite.apis.tableCreate(21050, {
          user_id: user!.ID,
          transaction_type: 'Event Registration',
          amount: event.registration_fee,
          currency: 'USD',
          status: 'Completed',
          payment_method: 'Credit Card',
          description: `Registration for ${event.title}`,
          related_id: event.id,
          transaction_reference: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
      }

      toast({
        title: "Registration Successful!",
        description: `You've been registered for ${event.title}. Check your notifications for details.`
      });

      // Create a notification for the user
      try {
        await window.ezsite.apis.tableCreate(21049, {
          user_id: user!.ID,
          title: "Event Registration Confirmed",
          message: `You have successfully registered for ${event.title} on ${new Date(event.event_date).toLocaleDateString()}. ${event.registration_fee > 0 ? `Payment of $${event.registration_fee} has been processed.` : 'This is a free event.'}`,
          notification_type: "Event",
          related_id: event.id,
          is_read: false,
          priority: "Medium",
          action_url: ""
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register for event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedEvent) {
      handleEventRegistration(selectedEvent);
    }
    setShowPaymentModal(false);
    setSelectedEvent(null);
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'tournament':
        return 'bg-purple-100 text-purple-800';
      case 'practice':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-green-100 text-green-800';
      case 'clinic':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'professional':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" data-id="cizz7aawh" data-path="src/components/EventsNearMe.tsx">
        <div className="text-center" data-id="5wd0c1sbv" data-path="src/components/EventsNearMe.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" data-id="oigy1ijwo" data-path="src/components/EventsNearMe.tsx"></div>
          <p className="mt-2 text-gray-600" data-id="1wawjr7ji" data-path="src/components/EventsNearMe.tsx">Loading events...</p>
        </div>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="1s83tent8" data-path="src/components/EventsNearMe.tsx">
      <div className="flex items-center justify-between" data-id="y3urs39e4" data-path="src/components/EventsNearMe.tsx">
        <h2 className="text-2xl font-bold" data-id="l0pe6je15" data-path="src/components/EventsNearMe.tsx">Tennis Events Near You</h2>
        <div className="flex items-center space-x-2" data-id="iuzj2k09k" data-path="src/components/EventsNearMe.tsx">
          <Badge variant="outline" data-id="lhdjdhsn7" data-path="src/components/EventsNearMe.tsx">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card data-id="eawejgjlc" data-path="src/components/EventsNearMe.tsx">
        <CardContent className="p-4" data-id="i793wcz3k" data-path="src/components/EventsNearMe.tsx">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-id="j9dw0y12k" data-path="src/components/EventsNearMe.tsx">
            <div className="relative" data-id="553y7r2v0" data-path="src/components/EventsNearMe.tsx">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" data-id="4sq56uf5f" data-path="src/components/EventsNearMe.tsx" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="s95bjzdoc" data-path="src/components/EventsNearMe.tsx" />

            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter} data-id="htjkofegb" data-path="src/components/EventsNearMe.tsx">
              <SelectTrigger data-id="sw9zp6i5l" data-path="src/components/EventsNearMe.tsx">
                <SelectValue placeholder="Event Type" data-id="yjjtzlc73" data-path="src/components/EventsNearMe.tsx" />
              </SelectTrigger>
              <SelectContent data-id="yqqn7db2u" data-path="src/components/EventsNearMe.tsx">
                <SelectItem value="all" data-id="dijd9hk7t" data-path="src/components/EventsNearMe.tsx">All Types</SelectItem>
                <SelectItem value="Tournament" data-id="4i9q4ysmt" data-path="src/components/EventsNearMe.tsx">Tournament</SelectItem>
                <SelectItem value="Practice" data-id="k6bd8l0sf" data-path="src/components/EventsNearMe.tsx">Practice</SelectItem>
                <SelectItem value="Social" data-id="uc6id6h2v" data-path="src/components/EventsNearMe.tsx">Social</SelectItem>
                <SelectItem value="Clinic" data-id="q92rf7dno" data-path="src/components/EventsNearMe.tsx">Clinic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={setSkillFilter} data-id="wqcd4exug" data-path="src/components/EventsNearMe.tsx">
              <SelectTrigger data-id="c8281ydqp" data-path="src/components/EventsNearMe.tsx">
                <SelectValue placeholder="Skill Level" data-id="0kfwfblx4" data-path="src/components/EventsNearMe.tsx" />
              </SelectTrigger>
              <SelectContent data-id="v6syy3vfp" data-path="src/components/EventsNearMe.tsx">
                <SelectItem value="all" data-id="1n0zg2gao" data-path="src/components/EventsNearMe.tsx">All Levels</SelectItem>
                <SelectItem value="Beginner" data-id="7ljotrbwj" data-path="src/components/EventsNearMe.tsx">Beginner</SelectItem>
                <SelectItem value="Intermediate" data-id="vp42rq2ug" data-path="src/components/EventsNearMe.tsx">Intermediate</SelectItem>
                <SelectItem value="Advanced" data-id="ea8g7lwcp" data-path="src/components/EventsNearMe.tsx">Advanced</SelectItem>
                <SelectItem value="Professional" data-id="nag1ltc39" data-path="src/components/EventsNearMe.tsx">Professional</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setSkillFilter('all');
            }} data-id="dxw5rby7v" data-path="src/components/EventsNearMe.tsx">
              <Filter className="w-4 h-4 mr-2" data-id="ywh5vk3l1" data-path="src/components/EventsNearMe.tsx" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid gap-6" data-id="4w99dvees" data-path="src/components/EventsNearMe.tsx">
        {filteredEvents.length === 0 ?
        <Card data-id="jql35fw94" data-path="src/components/EventsNearMe.tsx">
            <CardContent className="p-8 text-center" data-id="biz6l0g8y" data-path="src/components/EventsNearMe.tsx">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" data-id="3lgy7d0rs" data-path="src/components/EventsNearMe.tsx" />
              <h3 className="text-lg font-medium text-gray-900 mb-2" data-id="h2mwgwdjv" data-path="src/components/EventsNearMe.tsx">No Events Found</h3>
              <p className="text-gray-500" data-id="9yvh7ft8k" data-path="src/components/EventsNearMe.tsx">
                {events.length === 0 ?
              "No events are currently available. Check back later!" :
              "Try adjusting your filters to find more events."
              }
              </p>
            </CardContent>
          </Card> :

        filteredEvents.map((event) =>
        <Card key={event.id} className="hover:shadow-md transition-shadow" data-id="2mrxkl8nw" data-path="src/components/EventsNearMe.tsx">
              <CardHeader data-id="fu1hvhkkf" data-path="src/components/EventsNearMe.tsx">
                <div className="flex items-start justify-between" data-id="1sl9p8bjv" data-path="src/components/EventsNearMe.tsx">
                  <div className="space-y-2" data-id="52nlv1a4f" data-path="src/components/EventsNearMe.tsx">
                    <div className="flex items-center space-x-2" data-id="dnuoeu0mb" data-path="src/components/EventsNearMe.tsx">
                      <CardTitle className="text-xl" data-id="w2b77qztk" data-path="src/components/EventsNearMe.tsx">{event.title}</CardTitle>
                      <Badge className={getEventTypeColor(event.event_type)} data-id="nu9v758no" data-path="src/components/EventsNearMe.tsx">
                        {event.event_type}
                      </Badge>
                    </div>
                    <Badge
                  variant="outline"
                  className={getSkillLevelColor(event.skill_level_required)} data-id="q73xd2aa1" data-path="src/components/EventsNearMe.tsx">

                      {event.skill_level_required}
                    </Badge>
                  </div>
                  {event.registration_fee > 0 &&
              <div className="text-right" data-id="57dnqntxm" data-path="src/components/EventsNearMe.tsx">
                      <div className="text-2xl font-bold text-emerald-600" data-id="9jd7vqz3q" data-path="src/components/EventsNearMe.tsx">
                        ${event.registration_fee}
                      </div>
                      <div className="text-sm text-gray-500" data-id="rcnnfgiwf" data-path="src/components/EventsNearMe.tsx">registration fee</div>
                    </div>
              }
                </div>
                <CardDescription className="text-base whitespace-pre-line" data-id="2573yb4zj" data-path="src/components/EventsNearMe.tsx">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent data-id="qbzut0348" data-path="src/components/EventsNearMe.tsx">
                <div className="space-y-4" data-id="94tnn47qr" data-path="src/components/EventsNearMe.tsx">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" data-id="yh9wf22ln" data-path="src/components/EventsNearMe.tsx">
                    <div className="flex items-center text-gray-600" data-id="l8gfusbxc" data-path="src/components/EventsNearMe.tsx">
                      <Calendar className="w-4 h-4 mr-2" data-id="52lcctc0x" data-path="src/components/EventsNearMe.tsx" />
                      <span data-id="896wpyxic" data-path="src/components/EventsNearMe.tsx">
                        {new Date(event.event_date).toLocaleDateString()} at{' '}
                        {new Date(event.event_date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600" data-id="7a58mcwnb" data-path="src/components/EventsNearMe.tsx">
                      <MapPin className="w-4 h-4 mr-2" data-id="lvbtz49v7" data-path="src/components/EventsNearMe.tsx" />
                      <span className="truncate" data-id="4mqbtm7b1" data-path="src/components/EventsNearMe.tsx">
                        {event.location_name}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600" data-id="20u1lt43t" data-path="src/components/EventsNearMe.tsx">
                      <Users className="w-4 h-4 mr-2" data-id="cza1xatov" data-path="src/components/EventsNearMe.tsx" />
                      <span data-id="6wi1x39kb" data-path="src/components/EventsNearMe.tsx">Max {event.max_participants} participants</span>
                    </div>
                  </div>

                  {event.location_address &&
              <div className="text-sm text-gray-500" data-id="ugt6bejpg" data-path="src/components/EventsNearMe.tsx">
                      <MapPin className="w-4 h-4 inline mr-1" data-id="yhxonaumm" data-path="src/components/EventsNearMe.tsx" />
                      {event.location_address}
                    </div>
              }

                  <div className="flex items-center justify-between pt-4 border-t" data-id="o672w94rj" data-path="src/components/EventsNearMe.tsx">
                    <div className="flex items-center space-x-4" data-id="10c9l90go" data-path="src/components/EventsNearMe.tsx">
                      <Badge variant="outline" data-id="6prwifep4" data-path="src/components/EventsNearMe.tsx">
                        {event.status}
                      </Badge>
                      {event.registration_fee === 0 &&
                  <Badge variant="outline" className="bg-green-50 text-green-700" data-id="aln5qioy2" data-path="src/components/EventsNearMe.tsx">
                          Free Event
                        </Badge>
                  }
                    </div>
                    <Button onClick={() => registerForEvent(event)} className="flex items-center gap-2" data-id="c8y3l2rkz" data-path="src/components/EventsNearMe.tsx">
                      {event.registration_fee > 0 && <CreditCard className="w-4 h-4" data-id="aq6y66vzi" data-path="src/components/EventsNearMe.tsx" />}
                      Register Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        )
        }
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedEvent(null);
        }}
        subscriptionPlan={selectedEvent ? {
          name: selectedEvent.title,
          price: selectedEvent.registration_fee,
          features: [
          `Event registration for ${selectedEvent.title}`,
          `Date: ${new Date(selectedEvent.event_date).toLocaleDateString()}`,
          `Location: ${selectedEvent.location_name}`,
          `Skill Level: ${selectedEvent.skill_level_required}`]

        } : { name: '', price: 0, features: [] }}
        onPaymentSuccess={handlePaymentSuccess} data-id="cqhj18z98" data-path="src/components/EventsNearMe.tsx" />

    </div>);

};

export default EventsNearMe;