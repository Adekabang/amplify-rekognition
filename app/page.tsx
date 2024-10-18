'use client'
import { useEffect, useState } from "react";
import { Amplify } from 'aws-amplify';
import outputs from "../amplify_outputs.json";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <div className="">
      <main className="max-w-xl px-4 mx-auto my-16 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Home</h1>
        {loading ? <p>Loading...</p> : (
          <>
            <p>Welcome, {signInDetails.loginId}</p>
            <span>This page is protected by AWS Amplify, AWS Cognito and AWS Rekognition.</span>
            <Button variant="outline" className="hover:bg-red-500 hover:text-white" onClick={handleSignOut}>Sign Out</Button>
          </>
        )}
      </main>
    </div>

  );
}

export default Home;
