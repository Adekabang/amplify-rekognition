'use client'
import { useState } from "react";
import { Authenticator, Button } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../../amplify_outputs.json";
import { confirmSignIn, confirmSignUp, getCurrentUser, signIn } from "aws-amplify/auth";
import { SignInInput, signUp, SignUpInput } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

Amplify.configure(outputs);
export default function SignIn() {
    // const [userImageB64, setUserImageB64] = useState<string | null>(null);
    // const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string>("");
    const router = useRouter();

    const submitSignIn = async () => {
        try {
            const { nextStep } = await signIn({
                username: email,
                password: password,
                options: {
                    authFlowType: "CUSTOM_WITH_SRP"
                }
            });
            console.log(nextStep);
        } catch (error) {
            console.log(error);
        }
    };
    const submitConfirmSignIn = async () => {
        try {

            const { nextStep } = await confirmSignIn({
                challengeResponse: confirmationCode
            })
            console.log(nextStep);
            if (nextStep.signInStep === "DONE") {
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    {/* <Register setUserImageB64={setUserImageB64} userImageB64={userImageB64} setUserName={setUserName} userName={userName} /> */ }
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-center">
                {/* <form> */}
                <h3 className="text-2xl font-bold">Sign In</h3>
                <label>Email</label>
                <input type="text" placeholder="Username" onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" onClick={submitSignIn}>Sign In</Button>
                <hr />
                <h3 className="text-2xl font-bold">Confirm Sign In</h3>
                <label>Confirmation Code</label>
                <input type="text" placeholder="Confirmation Code" onChange={(e) => setConfirmationCode(e.target.value)} />
                <Button type="submit" onClick={submitConfirmSignIn}>Confirm Sign In</Button>
            </main>
        </div>

    );
}
