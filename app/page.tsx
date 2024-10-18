'use client'
import { useEffect, useState } from "react";
import Register from "./components/Register";
import { Authenticator, Button, withAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import { AuthUser, confirmSignIn, confirmSignUp, fetchAuthSession, getCurrentUser, signIn, signOut } from "aws-amplify/auth";
import { SignInInput, signUp, SignUpInput } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { redirect } from 'next/navigation'

Amplify.configure(outputs);
function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [signInDetails, setSignInDetails] = useState<any>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log("username", username);
        console.log("user id", userId);
        console.log("sign-in details", signInDetails);
        setUser(username);
        setUserId(userId);
        setSignInDetails(signInDetails);
        setLoading(false);
      } catch (error) {
        router.push('/signin')
        console.log(error);
      }
    }
    getUser();

  }, []);

  async function handleSignOut() {
    await signOut().then(() => {
      router.push('/signin')
    })

  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-center">
        <h1>Home</h1>
        {loading ? <p>Loading...</p> : (
          <>
            <p>Username: {user}</p>
            <p>User ID: {userId}</p>
            <p>Sign-in details: {JSON.stringify(signInDetails)}</p>
            <Button onClick={handleSignOut}>Sign Out</Button>
          </>
        )}
      </main>
    </div>

  );
}

export default Home;
