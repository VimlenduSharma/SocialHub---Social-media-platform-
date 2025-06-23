import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState<CheckedState>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Welcome back!",
      description: "You have been signed in successfully.",
    });
    
    navigate('/feed');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Account created!",
      description: "Welcome to SocialHub! You can now start connecting.",
    });
    
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            SocialHub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect, share, and discover amazing content
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-xl">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                    />
                    <Label htmlFor="remember-me" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Sign In
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-11 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features showcase */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📱</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Mobile First</p>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🌐</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Global Network</p>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔒</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
