import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SubscriptionPlan } from '@/services/DatabaseService';
import { toast } from '@/hooks/use-toast';
import { X, Check, Crown, Star, Zap } from 'lucide-react';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentPlan: string;
  onClose: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans, currentPlan, onClose }) => {
  const handleUpgrade = (planId: string) => {
    console.log('Upgrading to plan:', planId);
    toast({
      title: "Upgrade successful!",
      description: `You've been upgraded to the ${planId} plan.`
    });
    onClose();
  };

  const getIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'basic':return <Zap className="w-6 h-6" data-id="nejdokqeq" data-path="src/components/SubscriptionPlans.tsx" />;
      case 'premium':return <Star className="w-6 h-6" data-id="wbs2ldekp" data-path="src/components/SubscriptionPlans.tsx" />;
      case 'pro':return <Crown className="w-6 h-6" data-id="l0ihzhgsx" data-path="src/components/SubscriptionPlans.tsx" />;
      default:return <Zap className="w-6 h-6" data-id="cp7ocs5um" data-path="src/components/SubscriptionPlans.tsx" />;
    }
  };

  const getCardStyle = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'premium':return 'border-emerald-500 relative';
      case 'pro':return 'border-purple-500 relative';
      default:return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-id="nhr1jfqrt" data-path="src/components/SubscriptionPlans.tsx">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto" data-id="i6or2lpkv" data-path="src/components/SubscriptionPlans.tsx">
        <div className="flex items-center justify-between p-6 border-b" data-id="jpkebrkmb" data-path="src/components/SubscriptionPlans.tsx">
          <div data-id="6bics7uo7" data-path="src/components/SubscriptionPlans.tsx">
            <h2 className="text-2xl font-bold" data-id="qy05woabg" data-path="src/components/SubscriptionPlans.tsx">Choose Your Plan</h2>
            <p className="text-gray-600" data-id="1p8vg7laz" data-path="src/components/SubscriptionPlans.tsx">Upgrade your tennis experience</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} data-id="w148t319b" data-path="src/components/SubscriptionPlans.tsx">
            <X className="w-4 h-4" data-id="pkaw3p5t4" data-path="src/components/SubscriptionPlans.tsx" />
          </Button>
        </div>

        <div className="p-6" data-id="0t2mrg1yn" data-path="src/components/SubscriptionPlans.tsx">
          <div className="grid md:grid-cols-3 gap-6" data-id="ii64lm6q5" data-path="src/components/SubscriptionPlans.tsx">
            {plans.map((plan) =>
            <Card key={plan.id} className={getCardStyle(plan.name)} data-id="bmdfbah8q" data-path="src/components/SubscriptionPlans.tsx">
                {plan.name === 'Premium' &&
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2" data-id="rty5skbyf" data-path="src/components/SubscriptionPlans.tsx">
                    <Badge className="bg-emerald-600" data-id="mdbsryz98" data-path="src/components/SubscriptionPlans.tsx">Most Popular</Badge>
                  </div>
              }
                {plan.name === 'Pro' &&
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2" data-id="uspabn1k6" data-path="src/components/SubscriptionPlans.tsx">
                    <Badge className="bg-purple-600" data-id="ghjg8e54d" data-path="src/components/SubscriptionPlans.tsx">Best Value</Badge>
                  </div>
              }
                
                <CardHeader className="text-center" data-id="3sm215a1l" data-path="src/components/SubscriptionPlans.tsx">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                plan.name === 'Pro' ? 'bg-purple-100 text-purple-600' :
                plan.name === 'Premium' ? 'bg-emerald-100 text-emerald-600' :
                'bg-gray-100 text-gray-600'}`
                } data-id="r0yeqg1et" data-path="src/components/SubscriptionPlans.tsx">
                    {getIcon(plan.name)}
                  </div>
                  <CardTitle className="text-xl" data-id="fjw059wq7" data-path="src/components/SubscriptionPlans.tsx">{plan.name}</CardTitle>
                  <CardDescription data-id="9akf8c0eb" data-path="src/components/SubscriptionPlans.tsx">
                    <span className="text-3xl font-bold text-gray-900" data-id="4afve13rc" data-path="src/components/SubscriptionPlans.tsx">${plan.price}</span>
                    <span className="text-gray-500" data-id="kdggh3ggn" data-path="src/components/SubscriptionPlans.tsx">/{plan.interval}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent data-id="mp99ufn3l" data-path="src/components/SubscriptionPlans.tsx">
                  <ul className="space-y-3 mb-6" data-id="znjljwakm" data-path="src/components/SubscriptionPlans.tsx">
                    {plan.features.map((feature, index) =>
                  <li key={index} className="flex items-start" data-id="qkyas4tl9" data-path="src/components/SubscriptionPlans.tsx">
                        <Check className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" data-id="3n8fp5me2" data-path="src/components/SubscriptionPlans.tsx" />
                        <span className="text-sm" data-id="y4zw4krwd" data-path="src/components/SubscriptionPlans.tsx">{feature}</span>
                      </li>
                  )}
                  </ul>
                  
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm" data-id="t9zz3ujov" data-path="src/components/SubscriptionPlans.tsx">
                    <div className="flex justify-between items-center mb-1" data-id="i9uyjft27" data-path="src/components/SubscriptionPlans.tsx">
                      <span className="text-gray-600" data-id="qyow9us58" data-path="src/components/SubscriptionPlans.tsx">Max Challenges:</span>
                      <span className="font-medium" data-id="iir75wfej" data-path="src/components/SubscriptionPlans.tsx">
                        {plan.maxChallenges === -1 ? 'Unlimited' : plan.maxChallenges}
                      </span>
                    </div>
                    <div className="flex justify-between items-center" data-id="ok5e3nfh0" data-path="src/components/SubscriptionPlans.tsx">
                      <span className="text-gray-600" data-id="i94jartrl" data-path="src/components/SubscriptionPlans.tsx">Max Participants:</span>
                      <span className="font-medium" data-id="fuvvhamjz" data-path="src/components/SubscriptionPlans.tsx">
                        {plan.maxParticipants === -1 ? 'Unlimited' : plan.maxParticipants}
                      </span>
                    </div>
                  </div>
                  
                  {currentPlan === plan.id ?
                <Button className="w-full" disabled data-id="cmrnogsgi" data-path="src/components/SubscriptionPlans.tsx">
                      Current Plan
                    </Button> :

                <Button
                  className={`w-full ${
                  plan.name === 'Pro' ? 'bg-purple-600 hover:bg-purple-700' :
                  plan.name === 'Premium' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  ''}`
                  }
                  onClick={() => handleUpgrade(plan.id)} data-id="a6295rmim" data-path="src/components/SubscriptionPlans.tsx">

                      {currentPlan === 'basic' ? 'Upgrade' : 'Switch Plan'}
                    </Button>
                }
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg" data-id="stwa3fnen" data-path="src/components/SubscriptionPlans.tsx">
            <div className="flex items-start space-x-3" data-id="8l9blh7yp" data-path="src/components/SubscriptionPlans.tsx">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" data-id="ee3fmr9fe" data-path="src/components/SubscriptionPlans.tsx">
                <Check className="w-4 h-4 text-white" data-id="bxp3wvhy1" data-path="src/components/SubscriptionPlans.tsx" />
              </div>
              <div data-id="vf22a8mct" data-path="src/components/SubscriptionPlans.tsx">
                <h3 className="font-medium text-blue-900" data-id="hqga1a308" data-path="src/components/SubscriptionPlans.tsx">30-Day Money-Back Guarantee</h3>
                <p className="text-sm text-blue-700 mt-1" data-id="olu72fxzt" data-path="src/components/SubscriptionPlans.tsx">
                  Not satisfied? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default SubscriptionPlans;