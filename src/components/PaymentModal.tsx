import React, { useState } from 'react';
import { X, CreditCard, Shield, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle } from
'@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionPlan: {
    name: string;
    price: number;
    features: string[];
  };
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  subscriptionPlan,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'plan' | 'payment' | 'processing' | 'success'>('plan');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const processPayment = async () => {
    if (!user?.ID) return;

    setLoading(true);
    setStep('processing');

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Create transaction record
      const transactionData = {
        user_id: user.ID,
        transaction_type: 'Subscription',
        amount: subscriptionPlan.price,
        currency: 'USD',
        status: 'Completed',
        payment_method: 'Credit Card',
        description: `${subscriptionPlan.name} subscription upgrade`,
        related_id: 0,
        transaction_reference: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const { error: transactionError } = await window.ezsite.apis.tableCreate(21050, transactionData);

      if (transactionError) {
        throw new Error('Failed to record transaction: ' + transactionError);
      }

      // Update user profile subscription tier
      try {
        // Get current user profile
        const profileResponse = await window.ezsite.apis.tablePage(21045, {
          PageNo: 1,
          PageSize: 1,
          Filters: [{ name: "user_id", op: "Equal", value: user.ID }]
        });

        if (profileResponse.data?.List?.length > 0) {
          const profile = profileResponse.data.List[0];

          const { error: updateError } = await window.ezsite.apis.tableUpdate(21045, {
            ID: profile.id,
            user_id: profile.user_id,
            display_name: profile.display_name,
            skill_level: profile.skill_level,
            location_latitude: profile.location_latitude,
            location_longitude: profile.location_longitude,
            location_address: profile.location_address,
            phone_number: profile.phone_number,
            subscription_tier: subscriptionPlan.name,
            avatar_file_id: profile.avatar_file_id
          });

          if (updateError) {
            console.error('Failed to update profile subscription:', updateError);
          }
        }
      } catch (profileError) {
        console.error('Error updating profile:', profileError);
      }

      // Create success notification
      try {
        await window.ezsite.apis.tableCreate(21049, {
          user_id: user.ID,
          title: "Payment Successful",
          message: `Your ${subscriptionPlan.name} subscription has been activated. Welcome to premium tennis!`,
          notification_type: "Payment",
          related_id: 0,
          is_read: false,
          priority: "High",
          action_url: ""
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
      }

      setStep('success');

      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        resetModal();
      }, 2000);

    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Payment processing failed. Please try again.",
        variant: "destructive"
      });
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('plan');
    setPaymentData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      billingAddress: '',
      city: '',
      zipCode: '',
      country: 'US'
    });
  };

  const handleClose = () => {
    if (step === 'processing') return; // Prevent closing during processing
    onClose();
    resetModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} data-id="xsdf2s6oj" data-path="src/components/PaymentModal.tsx">
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-id="19bsrkswl" data-path="src/components/PaymentModal.tsx">
        <DialogHeader data-id="pt1g2dw7h" data-path="src/components/PaymentModal.tsx">
          <DialogTitle className="flex items-center gap-2" data-id="qvcrt63xg" data-path="src/components/PaymentModal.tsx">
            <CreditCard className="w-5 h-5" data-id="6f2klc7g6" data-path="src/components/PaymentModal.tsx" />
            Upgrade Subscription
          </DialogTitle>
          <DialogDescription data-id="og1e86eh5" data-path="src/components/PaymentModal.tsx">
            {step === 'plan' && 'Review your subscription plan'}
            {step === 'payment' && 'Enter your payment information'}
            {step === 'processing' && 'Processing your payment...'}
            {step === 'success' && 'Payment successful!'}
          </DialogDescription>
        </DialogHeader>

        {step === 'plan' &&
        <div className="space-y-6" data-id="ysm5oczwb" data-path="src/components/PaymentModal.tsx">
            <Card className="border-emerald-200" data-id="9r2169nby" data-path="src/components/PaymentModal.tsx">
              <CardHeader data-id="oj48p7u60" data-path="src/components/PaymentModal.tsx">
                <div className="flex items-center justify-between" data-id="jihc43f8s" data-path="src/components/PaymentModal.tsx">
                  <div data-id="hr4bov9b0" data-path="src/components/PaymentModal.tsx">
                    <CardTitle className="text-xl text-emerald-700" data-id="ria4kcyy7" data-path="src/components/PaymentModal.tsx">
                      {subscriptionPlan.name} Plan
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold" data-id="wxvahjbn7" data-path="src/components/PaymentModal.tsx">
                      ${subscriptionPlan.price}/month
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800" data-id="ncvp91q68" data-path="src/components/PaymentModal.tsx">
                    Recommended
                  </Badge>
                </div>
              </CardHeader>
              <CardContent data-id="0l362xb3e" data-path="src/components/PaymentModal.tsx">
                <ul className="space-y-2" data-id="08dfkevb1" data-path="src/components/PaymentModal.tsx">
                  {subscriptionPlan.features.map((feature, index) =>
                <li key={index} className="flex items-center text-sm" data-id="a2f4t83ob" data-path="src/components/PaymentModal.tsx">
                      <Check className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0" data-id="6o330syrn" data-path="src/components/PaymentModal.tsx" />
                      {feature}
                    </li>
                )}
                </ul>
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-4 rounded-lg" data-id="qo3yl4gbm" data-path="src/components/PaymentModal.tsx">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2" data-id="xsekxiag8" data-path="src/components/PaymentModal.tsx">
                <span data-id="jhev98c8n" data-path="src/components/PaymentModal.tsx">Subtotal</span>
                <span data-id="6tyfmossn" data-path="src/components/PaymentModal.tsx">${subscriptionPlan.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2" data-id="84jlx9bwy" data-path="src/components/PaymentModal.tsx">
                <span data-id="0cvrn1a4n" data-path="src/components/PaymentModal.tsx">Tax</span>
                <span data-id="enhowx2r9" data-path="src/components/PaymentModal.tsx">$0.00</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between font-semibold" data-id="45efod5de" data-path="src/components/PaymentModal.tsx">
                <span data-id="0y6fg777d" data-path="src/components/PaymentModal.tsx">Total</span>
                <span data-id="3pbp330mn" data-path="src/components/PaymentModal.tsx">${subscriptionPlan.price}</span>
              </div>
            </div>

            <div className="flex space-x-4" data-id="txfn2mmy8" data-path="src/components/PaymentModal.tsx">
              <Button variant="outline" onClick={handleClose} className="flex-1" data-id="zt2n426p7" data-path="src/components/PaymentModal.tsx">
                Cancel
              </Button>
              <Button onClick={() => setStep('payment')} className="flex-1" data-id="j0rsaaaxb" data-path="src/components/PaymentModal.tsx">
                Continue to Payment
              </Button>
            </div>
          </div>
        }

        {step === 'payment' &&
        <div className="space-y-6" data-id="v4k4hc6ly" data-path="src/components/PaymentModal.tsx">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-id="ec76zs3ls" data-path="src/components/PaymentModal.tsx">
              <div className="space-y-2" data-id="owaiccece" data-path="src/components/PaymentModal.tsx">
                <Label htmlFor="cardNumber" data-id="mxwjjh0q1" data-path="src/components/PaymentModal.tsx">Card Number</Label>
                <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19} data-id="zik3ow96c" data-path="src/components/PaymentModal.tsx" />

              </div>
              <div className="space-y-2" data-id="g3trzgnfd" data-path="src/components/PaymentModal.tsx">
                <Label htmlFor="cardHolder" data-id="tq2207hl5" data-path="src/components/PaymentModal.tsx">Cardholder Name</Label>
                <Input
                id="cardHolder"
                placeholder="John Doe"
                value={paymentData.cardHolder}
                onChange={(e) => handleInputChange('cardHolder', e.target.value)} data-id="ndbgzhcj8" data-path="src/components/PaymentModal.tsx" />

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4" data-id="ejuhxpjlv" data-path="src/components/PaymentModal.tsx">
              <div className="space-y-2" data-id="2b96uykyx" data-path="src/components/PaymentModal.tsx">
                <Label htmlFor="expiryDate" data-id="n9bnaxyx5" data-path="src/components/PaymentModal.tsx">Expiry Date</Label>
                <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                maxLength={5} data-id="7qchrr0kl" data-path="src/components/PaymentModal.tsx" />

              </div>
              <div className="space-y-2" data-id="svuq9a0dt" data-path="src/components/PaymentModal.tsx">
                <Label htmlFor="cvv" data-id="difu5xb52" data-path="src/components/PaymentModal.tsx">CVV</Label>
                <Input
                id="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                maxLength={4} data-id="twql7019e" data-path="src/components/PaymentModal.tsx" />

              </div>
            </div>

            <div className="space-y-4" data-id="wue90im32" data-path="src/components/PaymentModal.tsx">
              <h3 className="font-medium" data-id="rrmgdemd2" data-path="src/components/PaymentModal.tsx">Billing Address</h3>
              <div className="space-y-2" data-id="lisr358af" data-path="src/components/PaymentModal.tsx">
                <Label htmlFor="billingAddress" data-id="wao51xokq" data-path="src/components/PaymentModal.tsx">Address</Label>
                <Input
                id="billingAddress"
                placeholder="123 Main St"
                value={paymentData.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)} data-id="h1s9laqje" data-path="src/components/PaymentModal.tsx" />

              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-id="2hcyj3aym" data-path="src/components/PaymentModal.tsx">
                <div className="space-y-2" data-id="0150y41gy" data-path="src/components/PaymentModal.tsx">
                  <Label htmlFor="city" data-id="u2748dcqh" data-path="src/components/PaymentModal.tsx">City</Label>
                  <Input
                  id="city"
                  placeholder="New York"
                  value={paymentData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)} data-id="ocgeu20jh" data-path="src/components/PaymentModal.tsx" />

                </div>
                <div className="space-y-2" data-id="kwt6sf8l2" data-path="src/components/PaymentModal.tsx">
                  <Label htmlFor="zipCode" data-id="5c2c62zb4" data-path="src/components/PaymentModal.tsx">ZIP Code</Label>
                  <Input
                  id="zipCode"
                  placeholder="10001"
                  value={paymentData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)} data-id="u67q8clbo" data-path="src/components/PaymentModal.tsx" />

                </div>
                <div className="space-y-2" data-id="cgeol1x5u" data-path="src/components/PaymentModal.tsx">
                  <Label htmlFor="country" data-id="o84yut0ts" data-path="src/components/PaymentModal.tsx">Country</Label>
                  <Select value={paymentData.country} onValueChange={(value) => handleInputChange('country', value)} data-id="gicma3coh" data-path="src/components/PaymentModal.tsx">
                    <SelectTrigger data-id="rdlqi8ii8" data-path="src/components/PaymentModal.tsx">
                      <SelectValue data-id="mxjf4pg6a" data-path="src/components/PaymentModal.tsx" />
                    </SelectTrigger>
                    <SelectContent data-id="dpq33aiq8" data-path="src/components/PaymentModal.tsx">
                      <SelectItem value="US" data-id="s92gop04o" data-path="src/components/PaymentModal.tsx">United States</SelectItem>
                      <SelectItem value="CA" data-id="nry9ywzc5" data-path="src/components/PaymentModal.tsx">Canada</SelectItem>
                      <SelectItem value="UK" data-id="8yqgtoyc8" data-path="src/components/PaymentModal.tsx">United Kingdom</SelectItem>
                      <SelectItem value="AU" data-id="yuo8o11dg" data-path="src/components/PaymentModal.tsx">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600" data-id="eiofr1pee" data-path="src/components/PaymentModal.tsx">
              <Shield className="w-4 h-4" data-id="0hsqj4o66" data-path="src/components/PaymentModal.tsx" />
              <span data-id="efp626iii" data-path="src/components/PaymentModal.tsx">Your payment information is secure and encrypted</span>
            </div>

            <div className="flex space-x-4" data-id="vmtlcplsb" data-path="src/components/PaymentModal.tsx">
              <Button variant="outline" onClick={() => setStep('plan')} className="flex-1" data-id="yc5uf89s8" data-path="src/components/PaymentModal.tsx">
                Back
              </Button>
              <Button
              onClick={processPayment}
              disabled={loading}
              className="flex-1" data-id="d2ba4kdqb" data-path="src/components/PaymentModal.tsx">

                {loading ? 'Processing...' : `Pay $${subscriptionPlan.price}`}
              </Button>
            </div>
          </div>
        }

        {step === 'processing' &&
        <div className="text-center py-8" data-id="kxard5dzv" data-path="src/components/PaymentModal.tsx">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" data-id="vtdqvbkqg" data-path="src/components/PaymentModal.tsx"></div>
            <h3 className="text-lg font-medium mb-2" data-id="z4hwv3m7d" data-path="src/components/PaymentModal.tsx">Processing Payment</h3>
            <p className="text-gray-600" data-id="vi8gqnqth" data-path="src/components/PaymentModal.tsx">Please don't close this window...</p>
          </div>
        }

        {step === 'success' &&
        <div className="text-center py-8" data-id="cvae1xwfv" data-path="src/components/PaymentModal.tsx">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" data-id="pglbtjg7y" data-path="src/components/PaymentModal.tsx">
              <Check className="w-8 h-8 text-green-600" data-id="u7wn9nu6l" data-path="src/components/PaymentModal.tsx" />
            </div>
            <h3 className="text-lg font-medium mb-2" data-id="73nvz2opc" data-path="src/components/PaymentModal.tsx">Payment Successful!</h3>
            <p className="text-gray-600" data-id="q6ng69gza" data-path="src/components/PaymentModal.tsx">Your subscription has been upgraded. Welcome to {subscriptionPlan.name}!</p>
          </div>
        }
      </DialogContent>
    </Dialog>);

};

export default PaymentModal;