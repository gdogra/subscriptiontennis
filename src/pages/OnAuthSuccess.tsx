import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

const OnAuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4" data-id="9lfgofft3" data-path="src/pages/OnAuthSuccess.tsx">
      <Card className="w-full max-w-md" data-id="2ksfit3ac" data-path="src/pages/OnAuthSuccess.tsx">
        <CardHeader className="text-center" data-id="361bxwlm4" data-path="src/pages/OnAuthSuccess.tsx">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4" data-id="23y786vzm" data-path="src/pages/OnAuthSuccess.tsx">
            <CheckCircle className="w-8 h-8 text-green-600" data-id="q0j69e3t6" data-path="src/pages/OnAuthSuccess.tsx" />
          </div>
          <CardTitle className="text-2xl" data-id="u3bwr311k" data-path="src/pages/OnAuthSuccess.tsx">Email Verified Successfully!</CardTitle>
          <CardDescription data-id="ruv08sw2p" data-path="src/pages/OnAuthSuccess.tsx">
            Your account has been verified and is now active.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center" data-id="fkx77p084" data-path="src/pages/OnAuthSuccess.tsx">
          <div className="space-y-4" data-id="7po30059i" data-path="src/pages/OnAuthSuccess.tsx">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-id="zgf1wkrwm" data-path="src/pages/OnAuthSuccess.tsx">
              <p className="text-sm text-green-800" data-id="33l22v0hs" data-path="src/pages/OnAuthSuccess.tsx">
                <strong data-id="xxzgfj0yb" data-path="src/pages/OnAuthSuccess.tsx">Welcome to Tennis Challenge!</strong> You can now log in and start challenging other players.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600" data-id="y67z9kkpr" data-path="src/pages/OnAuthSuccess.tsx">
              <Loader2 className="w-4 h-4 animate-spin" data-id="jxnkj0y6j" data-path="src/pages/OnAuthSuccess.tsx" />
              <span className="text-sm" data-id="9nfywwa6y" data-path="src/pages/OnAuthSuccess.tsx">
                Redirecting to login page in {countdown} seconds...
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default OnAuthSuccess;