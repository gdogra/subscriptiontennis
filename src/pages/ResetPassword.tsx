import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Reset Link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const { error } = await window.ezsite.apis.resetPassword({
        token,
        password
      });

      if (error) {
        throw new Error(error);
      }

      setSuccess(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully."
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);

    } catch (error) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4" data-id="oegmr26ab" data-path="src/pages/ResetPassword.tsx">
        <Card className="w-full max-w-md" data-id="9kurthxa6" data-path="src/pages/ResetPassword.tsx">
          <CardHeader className="text-center" data-id="tqrcszxx7" data-path="src/pages/ResetPassword.tsx">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4" data-id="2b48lnxhk" data-path="src/pages/ResetPassword.tsx">
              <CheckCircle className="w-8 h-8 text-green-600" data-id="wp06w9f23" data-path="src/pages/ResetPassword.tsx" />
            </div>
            <CardTitle className="text-2xl" data-id="srd7v77oh" data-path="src/pages/ResetPassword.tsx">Password Reset Complete</CardTitle>
            <CardDescription data-id="huq9ke5bi" data-path="src/pages/ResetPassword.tsx">
              Your password has been successfully updated. You can now log in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center" data-id="4pdnp96sl" data-path="src/pages/ResetPassword.tsx">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-id="msqnapfax" data-path="src/pages/ResetPassword.tsx">
              <p className="text-sm text-green-800" data-id="76vtcsos6" data-path="src/pages/ResetPassword.tsx">
                Redirecting to login page in a few seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4" data-id="5vidprce0" data-path="src/pages/ResetPassword.tsx">
      <Card className="w-full max-w-md" data-id="hr63rr5gk" data-path="src/pages/ResetPassword.tsx">
        <CardHeader data-id="xnxxviumd" data-path="src/pages/ResetPassword.tsx">
          <CardTitle data-id="3uln3sfpw" data-path="src/pages/ResetPassword.tsx">Reset Your Password</CardTitle>
          <CardDescription data-id="73pu57ts4" data-path="src/pages/ResetPassword.tsx">
            Enter your new password below. Make sure it's at least 6 characters long.
          </CardDescription>
        </CardHeader>
        <CardContent data-id="t7ll4se3w" data-path="src/pages/ResetPassword.tsx">
          <form onSubmit={handleSubmit} className="space-y-4" data-id="q6eel6u8b" data-path="src/pages/ResetPassword.tsx">
            {error &&
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2" data-id="1iormzg7m" data-path="src/pages/ResetPassword.tsx">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" data-id="iz1rh2ojt" data-path="src/pages/ResetPassword.tsx" />
                <p className="text-sm text-red-800" data-id="kxe82trtg" data-path="src/pages/ResetPassword.tsx">{error}</p>
              </div>
            }
            
            <div className="space-y-2" data-id="ukf8a0ysv" data-path="src/pages/ResetPassword.tsx">
              <Label htmlFor="password" data-id="co9ir471j" data-path="src/pages/ResetPassword.tsx">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6} data-id="6mqjaxaao" data-path="src/pages/ResetPassword.tsx" />

            </div>
            
            <div className="space-y-2" data-id="dxxdaqfce" data-path="src/pages/ResetPassword.tsx">
              <Label htmlFor="confirmPassword" data-id="mm1mwc7jm" data-path="src/pages/ResetPassword.tsx">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6} data-id="d4i06vef6" data-path="src/pages/ResetPassword.tsx" />

            </div>
            
            <Button type="submit" disabled={loading} className="w-full" data-id="o7vbi15e2" data-path="src/pages/ResetPassword.tsx">
              {loading ?
              <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" data-id="vmvucqa4o" data-path="src/pages/ResetPassword.tsx" />
                  Resetting Password...
                </> :

              'Reset Password'
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>);

};

export default ResetPassword;