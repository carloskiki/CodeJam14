import React, { useState } from "react";
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from '@/firebase';
import { Button } from "@/components/ui/button";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'http://localhost:5173/finishSignUp',
  // This must be true.
  handleCodeInApp: true,
};

enum LoginStatus {
  Error = 'Error',
  Sent = 'Sent',
}

const Frontpage: React.FC = () => {

  const [email, setEmail] = useState('');
  const [state, setState] = useState<LoginStatus | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const regex = /^[a-zA-Z0-9._%+-]+@mail\.mcgill\.ca$/;
    if (!regex.test(email)) {
      alert('Please enter a valid McGill email address.');
      return;
    }
    
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        setState(LoginStatus.Sent);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setState(LoginStatus.Error);
        console.error(errorCode, errorMessage);
      });
  };

  const renderStatusMessage = (status: LoginStatus | null) => {
    switch (status) {
      case LoginStatus.Sent:
        return <p className="text-green-500">An email has been sent! Check your inbox to continue.</p>;
      case LoginStatus.Error:
        return <p className="text-red-500">There was an error processing your login. Please try again.</p>;
      default:
        return null;
    }
  };

    
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24"
    style={{ backgroundImage: 'url("/images/mcgill-bg.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="space-x-4">
        <div className="flex bg-transparent items-center justify-center bg-gray-100">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold ">Welcome!</CardTitle>
              <p className="text-sm text-gray-500">Enter your McGill email, and we'll take it from there.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Conditionally render error message */}
                {renderStatusMessage(state)}
                
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate('/frontpage')}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#e83030] transform
                  hover:translate-y-[-2px] hover:bg-[#e83030] hover:border-[#e83030]
                  transition-transform duration-200">Login</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Frontpage;
