'use client'
import { useEffect, useState } from "react";
import { Amplify } from 'aws-amplify';
import outputs from "../amplify_outputs.json";
import { getCurrentUser, signOut, fetchUserAttributes } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

import type { ConfettiRef } from "@/components/ui/confetti";
import Confetti from "@/components/ui/confetti";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

Amplify.configure(outputs);
function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [fullName, setFullName] = useState<string | undefined>("");
  const [signInDetails, setSignInDetails] = useState<any>(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        const userData = await fetchUserAttributes();
        console.log("userData", userData);
        console.log("username", username);
        console.log("user id", userId);
        console.log("sign-in details", signInDetails);
        setFullName(userData.name);
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
  const confettiRef = useRef<ConfettiRef>(null);


  return (
    <div className="">
      <main className="max-w-2xl px-4 mx-auto my-16 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Home</h1>
        {loading ? <p>Loading...</p> : (
          <>
            <p className="text-xl font-bold">Welcome, {fullName}</p>
            <p className="text-md">Identity: {signInDetails.loginId}</p>
            <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
              <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 items-center justify-center flex flex-col">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${fullName}`} alt="@shadcn" />
                  <AvatarFallback>{fullName}</AvatarFallback>
                </Avatar>
                {fullName}
              </span>

              <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full"
                onMouseEnter={() => {
                  confettiRef.current?.fire({});
                }}
              />
            </div>
            <span className="text-sm">This page is protected by AWS Amplify, AWS Cognito and AWS Rekognition.</span>
            <Button variant="outline" className="hover:bg-red-500 hover:text-white" onClick={handleSignOut}>Sign Out</Button>
          </>
        )}

      </main>
    </div>

  );
}

export default Home;
