import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Trophy, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: string;
  related_id: number;
  is_read: boolean;
  priority: string;
  action_url: string;
}

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.ID) {
      loadNotifications();
    }
  }, [user?.ID]);

  const loadNotifications = async () => {
    if (!user?.ID) return;

    try {
      console.log('Loading notifications for user:', user.ID);
      setLoading(true);

      const { data, error } = await window.ezsite.apis.tablePage(21049, {
        PageNo: 1,
        PageSize: 50,
        Filters: [
        { name: "user_id", op: "Equal", value: user.ID }],

        OrderByField: "id",
        IsAsc: false
      });

      if (error) {
        throw new Error(error);
      }

      setNotifications(data?.List || []);
      console.log('Notifications loaded:', data?.List?.length || 0);
    } catch (error: any) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification) return;

      const { error } = await window.ezsite.apis.tableUpdate(21049, {
        ID: notificationId,
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        notification_type: notification.notification_type,
        related_id: notification.related_id,
        is_read: true,
        priority: notification.priority,
        action_url: notification.action_url
      });

      if (error) {
        throw new Error(error);
      }

      // Update local state
      setNotifications((prev) =>
      prev.map((n) =>
      n.id === notificationId ? { ...n, is_read: true } : n
      )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.is_read);

      // Update all unread notifications
      await Promise.all(
        unreadNotifications.map((notification) =>
        window.ezsite.apis.tableUpdate(21049, {
          ID: notification.id,
          user_id: notification.user_id,
          title: notification.title,
          message: notification.message,
          notification_type: notification.notification_type,
          related_id: notification.related_id,
          is_read: true,
          priority: notification.priority,
          action_url: notification.action_url
        })
        )
      );

      // Update local state
      setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
      );

      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'challenge':
        return <Trophy className="w-4 h-4 text-yellow-600" data-id="cyrnlvlkv" data-path="src/components/NotificationCenter.tsx" />;
      case 'match':
        return <Calendar className="w-4 h-4 text-blue-600" data-id="zn2xiwccf" data-path="src/components/NotificationCenter.tsx" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-green-600" data-id="a8de1in51" data-path="src/components/NotificationCenter.tsx" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-600" data-id="zacg5uno2" data-path="src/components/NotificationCenter.tsx" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" data-id="9xlb3cwdw" data-path="src/components/NotificationCenter.tsx" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} data-id="nmn8mmo57" data-path="src/components/NotificationCenter.tsx">
      <PopoverTrigger asChild data-id="64bbe6ak6" data-path="src/components/NotificationCenter.tsx">
        <Button variant="outline" size="sm" className="relative" data-id="yw9stpq2e" data-path="src/components/NotificationCenter.tsx">
          <Bell className="h-4 w-4" data-id="ue9bx2osn" data-path="src/components/NotificationCenter.tsx" />
          {unreadCount > 0 &&
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500" data-id="uk8muh834" data-path="src/components/NotificationCenter.tsx">

              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" data-id="6hmkqiblw" data-path="src/components/NotificationCenter.tsx">
        <Card className="border-0 shadow-lg" data-id="ojnnqjbq5" data-path="src/components/NotificationCenter.tsx">
          <CardHeader className="pb-3" data-id="hxlypeysb" data-path="src/components/NotificationCenter.tsx">
            <div className="flex items-center justify-between" data-id="g2zinctbe" data-path="src/components/NotificationCenter.tsx">
              <CardTitle className="text-lg" data-id="zwlsfdsxk" data-path="src/components/NotificationCenter.tsx">Notifications</CardTitle>
              <div className="flex items-center space-x-2" data-id="fh9cxugaf" data-path="src/components/NotificationCenter.tsx">
                {unreadCount > 0 &&
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead} data-id="z9ku9hizt" data-path="src/components/NotificationCenter.tsx">

                    <Check className="h-4 w-4 mr-1" data-id="b0sqdr131" data-path="src/components/NotificationCenter.tsx" />
                    Mark all read
                  </Button>
                }
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)} data-id="uczjj0ey7" data-path="src/components/NotificationCenter.tsx">

                  <X className="h-4 w-4" data-id="a9vsmqqm3" data-path="src/components/NotificationCenter.tsx" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 &&
            <CardDescription data-id="udljzzqh0" data-path="src/components/NotificationCenter.tsx">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </CardDescription>
            }
          </CardHeader>
          <CardContent className="p-0" data-id="y6py98401" data-path="src/components/NotificationCenter.tsx">
            <ScrollArea className="h-96" data-id="yrq41ytwb" data-path="src/components/NotificationCenter.tsx">
              {loading ?
              <div className="flex items-center justify-center p-8" data-id="bm7ul7bz1" data-path="src/components/NotificationCenter.tsx">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" data-id="z4v55ssuz" data-path="src/components/NotificationCenter.tsx"></div>
                </div> :
              notifications.length === 0 ?
              <div className="text-center p-8 text-gray-500" data-id="653xavgr7" data-path="src/components/NotificationCenter.tsx">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" data-id="03lb0jcv2" data-path="src/components/NotificationCenter.tsx" />
                  <p data-id="g8zgyinqn" data-path="src/components/NotificationCenter.tsx">No notifications yet</p>
                  <p className="text-sm" data-id="b7gglbi1j" data-path="src/components/NotificationCenter.tsx">We'll notify you when something important happens!</p>
                </div> :

              <div className="space-y-1" data-id="kadny8xg9" data-path="src/components/NotificationCenter.tsx">
                  {notifications.map((notification) =>
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !notification.is_read ?
                  'bg-blue-50 border-l-blue-500' :
                  'border-l-transparent'}`
                  }
                  onClick={() => markAsRead(notification.id)} data-id="u60y2zdu1" data-path="src/components/NotificationCenter.tsx">

                      <div className="flex items-start space-x-3" data-id="3jncv29pz" data-path="src/components/NotificationCenter.tsx">
                        <div className="flex-shrink-0 mt-1" data-id="up92e826s" data-path="src/components/NotificationCenter.tsx">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1" data-id="xl29cut3t" data-path="src/components/NotificationCenter.tsx">
                          <div className="flex items-center justify-between" data-id="1092mpr0g" data-path="src/components/NotificationCenter.tsx">
                            <h4 className={`text-sm font-medium truncate ${
                        !notification.is_read ? 'text-gray-900' : 'text-gray-700'}`
                        } data-id="1j2423ipf" data-path="src/components/NotificationCenter.tsx">
                              {notification.title}
                            </h4>
                            {notification.priority !== 'Low' &&
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(notification.priority)}`} data-id="st03d7nic" data-path="src/components/NotificationCenter.tsx">

                                {notification.priority}
                              </Badge>
                        }
                          </div>
                          <p className={`text-sm ${
                      !notification.is_read ? 'text-gray-700' : 'text-gray-500'}`
                      } data-id="qdgurgmlf" data-path="src/components/NotificationCenter.tsx">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between" data-id="4ymdyn820" data-path="src/components/NotificationCenter.tsx">
                            <Badge variant="outline" className="text-xs" data-id="um2w6ykwd" data-path="src/components/NotificationCenter.tsx">
                              {notification.notification_type}
                            </Badge>
                            {!notification.is_read &&
                        <div className="w-2 h-2 bg-blue-500 rounded-full" data-id="g8g7m55fl" data-path="src/components/NotificationCenter.tsx"></div>
                        }
                          </div>
                        </div>
                      </div>
                    </div>
                )}
                </div>
              }
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>);

};

export default NotificationCenter;