import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  ID: number;
  Name: string;
  Email: string;
  CreateTime: string;
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'player';
  subscription?: 'basic' | 'premium' | 'pro';
  communityId?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  sendPasswordReset: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const waitForApis = async (maxWait: number = 15000): Promise<boolean> => {
    const start = Date.now();
    let attempts = 0;

    while (Date.now() - start < maxWait) {
      attempts++;
      console.log(`Checking for APIs... attempt ${attempts}`);

      try {
        if (window.ezsite?.apis) {
          console.log('APIs found after', attempts, 'attempts');
          return true;
        }
      } catch (e) {
        console.log('Error checking APIs:', e);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.error('APIs not available after', maxWait, 'ms');
    return false;
  };

  const initializeAuth = async () => {
    try {
      console.log('Initializing authentication...');
      setLoading(true);
      setError(null);

      // Wait for APIs to be available with longer timeout
      const apisReady = await waitForApis(15000);
      if (!apisReady) {
        console.error('APIs not ready - authentication service unavailable');
        setError('Authentication service is starting up. Please wait a moment and refresh the page.');
        return;
      }

      console.log('APIs ready, checking user session...');
      const { data, error: userError } = await window.ezsite.apis.getUserInfo();

      if (userError) {
        console.log('No active user session:', userError);
        setUser(null);
        setError(null); // Clear error since no session is normal
      } else if (data) {
        console.log('Active user session found:', data);
        setUser(data);
        setError(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize authentication';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting login for:', email);

      // Ensure APIs are available
      const apisReady = await waitForApis(5000);
      if (!apisReady) {
        throw new Error('Authentication service is not available. Please refresh the page and try again.');
      }

      // Attempt login
      const loginResponse = await window.ezsite.apis.login({ email, password });
      console.log('Login response:', loginResponse);

      if (loginResponse.error) {
        console.error('Login failed:', loginResponse.error);
        setError(loginResponse.error);
        return false;
      }

      // Get user info after successful login
      const { data: userData, error: userError } = await window.ezsite.apis.getUserInfo();

      if (userError) {
        console.error('Failed to get user info after login:', userError);
        setError('Login succeeded but failed to retrieve user information. Please try again.');
        return false;
      }

      if (!userData) {
        console.error('No user data returned after login');
        setError('Login succeeded but no user data was returned. Please try again.');
        return false;
      }

      console.log('Login successful, user data:', userData);
      setUser(userData);
      setError(null);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting registration for:', userData.email);

      // Ensure APIs are available
      const apisReady = await waitForApis(5000);
      if (!apisReady) {
        throw new Error('Authentication service is not available. Please refresh the page and try again.');
      }

      const registerResponse = await window.ezsite.apis.register({
        email: userData.email,
        password: userData.password
      });

      if (registerResponse.error) {
        console.error('Registration failed:', registerResponse.error);
        setError(registerResponse.error);
        return false;
      }

      console.log('Registration successful for:', userData.email);

      // Try to create user profile, but don't fail if it doesn't work
      try {
        const profileData = {
          user_id: 0, // Will be set by backend
          display_name: `${userData.firstName} ${userData.lastName}`,
          skill_level: userData.skillLevel || 'Beginner',
          location_latitude: 0,
          location_longitude: 0,
          location_address: '',
          phone_number: '',
          subscription_tier: 'Free',
          avatar_file_id: 0
        };

        await window.ezsite.apis.tableCreate(21045, profileData);
        console.log('User profile created successfully');
      } catch (profileError) {
        console.log('Profile creation failed (non-critical):', profileError);
      }

      setError(null);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending password reset email to:', email);

      // Ensure APIs are available
      const apisReady = await waitForApis(5000);
      if (!apisReady) {
        throw new Error('Authentication service is not available. Please refresh the page and try again.');
      }

      const resetResponse = await window.ezsite.apis.sendResetPwdEmail({ email });

      if (resetResponse.error) {
        console.error('Password reset failed:', resetResponse.error);
        setError(resetResponse.error);
        return false;
      }

      console.log('Password reset email sent successfully');
      setError(null);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send password reset email';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');

      if (window.ezsite?.apis) {
        const logoutResponse = await window.ezsite.apis.logout();
        if (logoutResponse.error) {
          console.error('Logout API error:', logoutResponse.error);
        }
      }

      setUser(null);
      setError(null);
      console.log('Logout completed');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if logout API fails
      setUser(null);
      setError(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      loading,
      error,
      clearError,
      sendPasswordReset
    }} data-id="20is24gjm" data-path="src/contexts/AuthContext.tsx">
      {children}
    </AuthContext.Provider>);

};