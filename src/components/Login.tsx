import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2, Zap, Copy, CheckCircle, AlertCircle, Mail, Wifi, WifiOff } from 'lucide-react';

const Login: React.FC = () => {
  const { login, register, sendPasswordReset, loading, error, clearError } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [copiedCredential, setCopiedCredential] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking');

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds total

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Checking API status... attempt ${attempts}`);

        try {
          if (window.ezsite?.apis) {
            console.log('APIs are ready');
            setApiStatus('ready');
            return;
          }
        } catch (e) {
          console.log('Error checking APIs:', e);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.error('APIs not available after 30 seconds');
      setApiStatus('error');
    };

    checkApiStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    console.log('Login attempt:', loginForm.email);

    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    const success = await login(loginForm.email, loginForm.password);
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in."
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    console.log('Register attempt:', registerForm.email);

    if (!registerForm.email || !registerForm.password || !registerForm.firstName || !registerForm.lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    const success = await register(registerForm);
    if (success) {
      setRegistrationSuccess(true);
      toast({
        title: "Registration Successful!",
        description: "Please check your email for verification instructions.",
        duration: 5000
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!forgotPasswordEmail) {
      toast({
        title: "Missing Email",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    const success = await sendPasswordReset(forgotPasswordEmail);
    if (success) {
      toast({
        title: "Password Reset Sent",
        description: "Please check your email for password reset instructions.",
        duration: 5000
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCredential(type);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`
      });
      setTimeout(() => setCopiedCredential(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setLoginForm({ email, password });
    clearError();
    toast({
      title: "Demo Credentials Filled",
      description: "You can now click Sign In to login with demo account."
    });
  };

  // Show API status checking
  if (apiStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4" data-id="h0maxkv92" data-path="src/components/Login.tsx">
        <Card className="w-full max-w-md" data-id="ofp2gkakr" data-path="src/components/Login.tsx">
          <CardHeader className="text-center" data-id="z08thfznk" data-path="src/components/Login.tsx">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4" data-id="uyjprh7kp" data-path="src/components/Login.tsx">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" data-id="y47who33y" data-path="src/components/Login.tsx" />
            </div>
            <CardTitle className="text-2xl" data-id="hw2v4siyi" data-path="src/components/Login.tsx">Starting Up</CardTitle>
            <CardDescription data-id="9iij834p5" data-path="src/components/Login.tsx">
              Initializing authentication service...
            </CardDescription>
          </CardHeader>
          <CardContent data-id="kzj8pvk6t" data-path="src/components/Login.tsx">
            <div className="space-y-4" data-id="ljgcrkj95" data-path="src/components/Login.tsx">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="or4dboemm" data-path="src/components/Login.tsx">
                <p className="text-sm text-blue-800" data-id="q7imoj93s" data-path="src/components/Login.tsx">
                  <strong data-id="gcprn2t7t" data-path="src/components/Login.tsx">Please wait:</strong> The system is starting up. This usually takes 10-15 seconds.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>);

  }

  // Show API error
  if (apiStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4" data-id="1py0p55ze" data-path="src/components/Login.tsx">
        <Card className="w-full max-w-md" data-id="hx29wuxqk" data-path="src/components/Login.tsx">
          <CardHeader className="text-center" data-id="aooeqlute" data-path="src/components/Login.tsx">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4" data-id="ms4bb4p1n" data-path="src/components/Login.tsx">
              <WifiOff className="w-8 h-8 text-red-600" data-id="wd54bwxtm" data-path="src/components/Login.tsx" />
            </div>
            <CardTitle className="text-2xl text-red-600" data-id="ozs815u85" data-path="src/components/Login.tsx">Connection Error</CardTitle>
            <CardDescription data-id="mumbu7yns" data-path="src/components/Login.tsx">
              Unable to connect to authentication service
            </CardDescription>
          </CardHeader>
          <CardContent data-id="ihpz7t3ex" data-path="src/components/Login.tsx">
            <div className="space-y-4" data-id="eb0yokmet" data-path="src/components/Login.tsx">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-id="7j8xgfey7" data-path="src/components/Login.tsx">
                <p className="text-sm text-red-800" data-id="pj8y2k6pq" data-path="src/components/Login.tsx">
                  <strong data-id="1ku36qoz7" data-path="src/components/Login.tsx">Service Unavailable:</strong> Please check your internet connection and try refreshing the page.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
                variant="outline" data-id="n7mlokk64" data-path="src/components/Login.tsx">

                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>);

  }

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4" data-id="na2fmwsjx" data-path="src/components/Login.tsx">
        <Card className="w-full max-w-md" data-id="pzb6wx4ci" data-path="src/components/Login.tsx">
          <CardHeader className="text-center" data-id="n91p2uw67" data-path="src/components/Login.tsx">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4" data-id="ikazef2mn" data-path="src/components/Login.tsx">
              <Mail className="w-8 h-8 text-green-600" data-id="e2fhpu9d0" data-path="src/components/Login.tsx" />
            </div>
            <CardTitle className="text-2xl" data-id="qfj25dpmz" data-path="src/components/Login.tsx">Check Your Email!</CardTitle>
            <CardDescription data-id="nkkfgw5ge" data-path="src/components/Login.tsx">
              We've sent a verification link to your email address. Please click the link to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent data-id="66iji00nq" data-path="src/components/Login.tsx">
            <div className="space-y-4" data-id="om8b20z3w" data-path="src/components/Login.tsx">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="gxx8jf2l6" data-path="src/components/Login.tsx">
                <p className="text-sm text-blue-800" data-id="jt3qmw04d" data-path="src/components/Login.tsx">
                  <strong data-id="kxg57n87a" data-path="src/components/Login.tsx">Don't see the email?</strong> Check your spam folder or wait a few minutes for delivery.
                </p>
              </div>
              <Button
                onClick={() => setRegistrationSuccess(false)}
                variant="outline"
                className="w-full" data-id="mmg01h8ii" data-path="src/components/Login.tsx">

                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>);

  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4" data-id="07jbghq4t" data-path="src/components/Login.tsx">
        <Card className="w-full max-w-md" data-id="c3xt0n5d8" data-path="src/components/Login.tsx">
          <CardHeader data-id="wuj5ouakr" data-path="src/components/Login.tsx">
            <CardTitle data-id="p7tu7j7pk" data-path="src/components/Login.tsx">Reset Password</CardTitle>
            <CardDescription data-id="3vfd1zccu" data-path="src/components/Login.tsx">
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent data-id="bn836rnha" data-path="src/components/Login.tsx">
            <form onSubmit={handleForgotPassword} className="space-y-4" data-id="ma54vs5kb" data-path="src/components/Login.tsx">
              {error &&
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2" data-id="p0evuvtro" data-path="src/components/Login.tsx">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" data-id="m1exhvt11" data-path="src/components/Login.tsx" />
                  <p className="text-sm text-red-800" data-id="3xe0prde6" data-path="src/components/Login.tsx">{error}</p>
                </div>
              }
              
              <div className="space-y-2" data-id="6xz8qru93" data-path="src/components/Login.tsx">
                <Label htmlFor="forgotEmail" data-id="q51jgpjwj" data-path="src/components/Login.tsx">Email</Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required data-id="i2o2i947l" data-path="src/components/Login.tsx" />

              </div>
              
              <div className="flex space-x-2" data-id="zt8b27g4h" data-path="src/components/Login.tsx">
                <Button type="submit" disabled={loading} className="flex-1" data-id="rd3r3okg1" data-path="src/components/Login.tsx">
                  {loading ?
                  <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" data-id="x9ylnn8fx" data-path="src/components/Login.tsx" />
                      Sending...
                    </> :

                  'Send Reset Link'
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1" data-id="p3o11ebbv" data-path="src/components/Login.tsx">

                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4" data-id="xtobnb6sk" data-path="src/components/Login.tsx">
      <div className="w-full max-w-md" data-id="cn9jw9cgw" data-path="src/components/Login.tsx">
        <div className="text-center mb-8" data-id="peu128v8t" data-path="src/components/Login.tsx">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4" data-id="ndizjka78" data-path="src/components/Login.tsx">
            <Zap className="w-8 h-8 text-white" data-id="10klh47uz" data-path="src/components/Login.tsx" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900" data-id="zw15o93hn" data-path="src/components/Login.tsx">Tennis Community</h1>
          <p className="text-gray-600 mt-2" data-id="ax5df3g6j" data-path="src/components/Login.tsx">Join the ultimate tennis community</p>
        </div>

        {/* API Status Indicator */}
        <div className="mb-4 flex items-center justify-center" data-id="kefbk3tsc" data-path="src/components/Login.tsx">
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1" data-id="m1csbiih0" data-path="src/components/Login.tsx">
            <Wifi className="w-4 h-4 text-green-600" data-id="7fxv3n72x" data-path="src/components/Login.tsx" />
            <span className="text-sm text-green-700" data-id="emifkfx2j" data-path="src/components/Login.tsx">Service Ready</span>
          </div>
        </div>

        <Card data-id="n7o4pd0na" data-path="src/components/Login.tsx">
          <CardHeader data-id="iupjxh7nz" data-path="src/components/Login.tsx">
            <CardTitle className="text-center" data-id="x6byjnykc" data-path="src/components/Login.tsx">Welcome</CardTitle>
            <CardDescription className="text-center" data-id="34b72c5hv" data-path="src/components/Login.tsx">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent data-id="g8117ard6" data-path="src/components/Login.tsx">
            {error &&
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2" data-id="6tddxlqnd" data-path="src/components/Login.tsx">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" data-id="5y6tkho5a" data-path="src/components/Login.tsx" />
                <p className="text-sm text-red-800" data-id="5p4vai04z" data-path="src/components/Login.tsx">{error}</p>
              </div>
            }

            <Tabs defaultValue="login" className="w-full" data-id="56oyxb11u" data-path="src/components/Login.tsx">
              <TabsList className="grid w-full grid-cols-2" data-id="bsh6cf6rk" data-path="src/components/Login.tsx">
                <TabsTrigger value="login" data-id="i4m4c6y1p" data-path="src/components/Login.tsx">Login</TabsTrigger>
                <TabsTrigger value="register" data-id="rl6kzc7ns" data-path="src/components/Login.tsx">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" data-id="2ia48dqwh" data-path="src/components/Login.tsx">
                <form onSubmit={handleLogin} className="space-y-4" data-id="kmkfaclz5" data-path="src/components/Login.tsx">
                  <div className="space-y-2" data-id="5637cc0oy" data-path="src/components/Login.tsx">
                    <Label htmlFor="email" data-id="0xtvl6dzn" data-path="src/components/Login.tsx">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                      required data-id="fgdmxq5g3" data-path="src/components/Login.tsx" />

                  </div>
                  <div className="space-y-2" data-id="yi80bcrxm" data-path="src/components/Login.tsx">
                    <Label htmlFor="password" data-id="yz9zlhgj0" data-path="src/components/Login.tsx">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      required data-id="dgpozfhhl" data-path="src/components/Login.tsx" />

                  </div>
                  
                  <div className="flex justify-between items-center" data-id="6o4hax4dg" data-path="src/components/Login.tsx">
                    <Button type="submit" className="flex-1 mr-2" disabled={loading} data-id="mtzjhiner" data-path="src/components/Login.tsx">
                      {loading ?
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" data-id="ue9e6fode" data-path="src/components/Login.tsx" />
                          Signing in...
                        </> :

                      'Sign In'
                      }
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs" data-id="44xtzn4xw" data-path="src/components/Login.tsx">

                      Forgot?
                    </Button>
                  </div>
                </form>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border" data-id="1o1pc17fj" data-path="src/components/Login.tsx">
                  <p className="text-sm font-medium text-gray-700 mb-3" data-id="vy1t9429r" data-path="src/components/Login.tsx">Demo Accounts:</p>
                  <div className="space-y-3" data-id="29dzynuwx" data-path="src/components/Login.tsx">
                    <div className="flex items-center justify-between p-2 bg-white rounded border" data-id="wd9g43apq" data-path="src/components/Login.tsx">
                      <div className="flex-1" data-id="0ap00tzc7" data-path="src/components/Login.tsx">
                        <div className="text-xs font-medium text-gray-600" data-id="p0hmjdqdg" data-path="src/components/Login.tsx">Admin Account</div>
                        <div className="text-sm text-gray-800" data-id="w81j4uzer" data-path="src/components/Login.tsx">admin@tennisclub.com</div>
                        <div className="text-sm text-gray-600" data-id="6aqrqc0jk" data-path="src/components/Login.tsx">admin123</div>
                      </div>
                      <div className="flex space-x-1" data-id="z97sw1rve" data-path="src/components/Login.tsx">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => fillDemoCredentials('admin@tennisclub.com', 'admin123')}
                          className="h-8 px-2" data-id="xennlrx0k" data-path="src/components/Login.tsx">

                          Fill
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard('admin@tennisclub.com', 'Admin Email')}
                          className="h-8 px-2" data-id="84elurev7" data-path="src/components/Login.tsx">

                          {copiedCredential === 'Admin Email' ?
                          <CheckCircle className="h-3 w-3" data-id="105utpf84" data-path="src/components/Login.tsx" /> :

                          <Copy className="h-3 w-3" data-id="twnl5s29v" data-path="src/components/Login.tsx" />
                          }
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-white rounded border" data-id="2foapj2lr" data-path="src/components/Login.tsx">
                      <div className="flex-1" data-id="u5m8ak071" data-path="src/components/Login.tsx">
                        <div className="text-xs font-medium text-gray-600" data-id="1xo6ll7en" data-path="src/components/Login.tsx">Player Account</div>
                        <div className="text-sm text-gray-800" data-id="22d62hfld" data-path="src/components/Login.tsx">player1@example.com</div>
                        <div className="text-sm text-gray-600" data-id="0p3n3hndl" data-path="src/components/Login.tsx">player123</div>
                      </div>
                      <div className="flex space-x-1" data-id="pnfpyl0e9" data-path="src/components/Login.tsx">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => fillDemoCredentials('player1@example.com', 'player123')}
                          className="h-8 px-2" data-id="3ee58l6vx" data-path="src/components/Login.tsx">

                          Fill
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard('player1@example.com', 'Player Email')}
                          className="h-8 px-2" data-id="7gftb1din" data-path="src/components/Login.tsx">

                          {copiedCredential === 'Player Email' ?
                          <CheckCircle className="h-3 w-3" data-id="462fsnwi3" data-path="src/components/Login.tsx" /> :

                          <Copy className="h-3 w-3" data-id="1trryvb3r" data-path="src/components/Login.tsx" />
                          }
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2" data-id="ltebqvow2" data-path="src/components/Login.tsx">
                    Click "Fill" to auto-fill credentials or copy individual fields
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="register" data-id="tzpn3j5ac" data-path="src/components/Login.tsx">
                <form onSubmit={handleRegister} className="space-y-4" data-id="k1jd8ra3t" data-path="src/components/Login.tsx">
                  <div className="grid grid-cols-2 gap-4" data-id="syo17plge" data-path="src/components/Login.tsx">
                    <div className="space-y-2" data-id="gqcyq8gj4" data-path="src/components/Login.tsx">
                      <Label htmlFor="firstName" data-id="56nj5trcx" data-path="src/components/Login.tsx">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, firstName: e.target.value }))}
                        required data-id="a83ih9ei0" data-path="src/components/Login.tsx" />

                    </div>
                    <div className="space-y-2" data-id="cauhrnnew" data-path="src/components/Login.tsx">
                      <Label htmlFor="lastName" data-id="s7pogr1gx" data-path="src/components/Login.tsx">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm((prev) => ({ ...prev, lastName: e.target.value }))}
                        required data-id="03rhfbnss" data-path="src/components/Login.tsx" />

                    </div>
                  </div>
                  <div className="space-y-2" data-id="59d6scv0x" data-path="src/components/Login.tsx">
                    <Label htmlFor="registerEmail" data-id="knystj5e5" data-path="src/components/Login.tsx">Email</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                      required data-id="fnwfftbty" data-path="src/components/Login.tsx" />

                  </div>
                  <div className="space-y-2" data-id="oripf4ha8" data-path="src/components/Login.tsx">
                    <Label htmlFor="registerPassword" data-id="m1vkhgxx1" data-path="src/components/Login.tsx">Password</Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6} data-id="mcm8o6qj3" data-path="src/components/Login.tsx" />

                  </div>
                  <div className="space-y-2" data-id="uf721shy5" data-path="src/components/Login.tsx">
                    <Label htmlFor="skillLevel" data-id="ncwfhpgxe" data-path="src/components/Login.tsx">Skill Level</Label>
                    <Select
                      value={registerForm.skillLevel}
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                      setRegisterForm((prev) => ({ ...prev, skillLevel: value }))
                      } data-id="0jn9yetvk" data-path="src/components/Login.tsx">

                      <SelectTrigger data-id="gld9jwo2u" data-path="src/components/Login.tsx">
                        <SelectValue data-id="mzvupjmw2" data-path="src/components/Login.tsx" />
                      </SelectTrigger>
                      <SelectContent data-id="qoq6eml1y" data-path="src/components/Login.tsx">
                        <SelectItem value="beginner" data-id="jrwapqmr1" data-path="src/components/Login.tsx">Beginner</SelectItem>
                        <SelectItem value="intermediate" data-id="0cqpv6i68" data-path="src/components/Login.tsx">Intermediate</SelectItem>
                        <SelectItem value="advanced" data-id="xkufvnwzu" data-path="src/components/Login.tsx">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading} data-id="jp2pjtrbg" data-path="src/components/Login.tsx">
                    {loading ?
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" data-id="chzk7e9ok" data-path="src/components/Login.tsx" />
                        Creating account...
                      </> :

                    'Create Account'
                    }
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg" data-id="flmo3fn7p" data-path="src/components/Login.tsx">
                  <p className="text-xs text-blue-800" data-id="tpg3f4lgs" data-path="src/components/Login.tsx">
                    <strong data-id="0wur65878" data-path="src/components/Login.tsx">Email Verification Required:</strong> After registration, you'll receive an email with a verification link. Please check your inbox and spam folder.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>);

};

export default Login;