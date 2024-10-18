'use client'
import { useState } from "react";
import { Amplify } from 'aws-amplify';
import outputs from "../../amplify_outputs.json";
import { confirmSignUp } from "aws-amplify/auth";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import FaceRegister from "../components/FaceRegister";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Label } from "@/components/ui/label";

Amplify.configure(outputs);
export default function SignUp() {
    const router = useRouter();
    const [userImageB64, setUserImageB64] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    // const [password, setPassword] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string>("");
    const [step, setStep] = useState<string>("signup");
    const [loading, setLoading] = useState<boolean>(false);
    const formSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const submitSignUp = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/register', {
                method: 'POST',
                body: JSON.stringify({ userImageB64 })
            })
            const data = await response.json();
            console.log(data);
            if (data.error) {
                alert(data.error);
                return;
            }
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: email,
                password: password,
                options: {
                    userAttributes: {
                        "custom:face_id": data.faceId
                    }
                }
            });
            console.log(isSignUpComplete, userId, nextStep);
            setStep("confirm");
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    const submitConfirmSignUp = async () => {
        try {
            setLoading(true);
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: email,
                confirmationCode: confirmationCode
            });
            console.log(isSignUpComplete, nextStep);
            if (nextStep.signUpStep === "DONE") {
                router.push('/signin');
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        submitSignUp(values.email, values.password)
        setEmail(values.email);
    }
    return (
        <div className="">
            <main className="max-w-xl px-4 mx-auto my-16 flex flex-col gap-4">
                {(step === "signup" || step === "faceregister") && (
                    <>
                        {/* <h3 className="text-2xl font-bold">Sign Up</h3>
                        <label>Email</label>
                        <input type="text" placeholder="Username" onChange={(e) => setEmail(e.target.value)} />
                        <label>Password</label>
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                        <Button type="submit" onClick={submitSignUp}>Sign Up</Button> */}
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {step === "signup" && (
                                    <>
                                        <h3 className="text-2xl font-bold">Sign Up</h3>
                                        <p>Enter your information below to register for an account</p>

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="user@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="********" type="password"  {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button className="w-full" onClick={() => setStep("faceregister")}>Sign Up</Button>
                                    </>
                                )}
                                {step === "faceregister" && (
                                    <>
                                        <h3 className="text-2xl font-bold">Face Registration</h3>
                                        <p>Please look at the camera to register your face</p>
                                        <FaceRegister setUserImageB64={setUserImageB64} userImageB64={userImageB64} />
                                        <Button className="w-full" disabled={loading} type="submit">{loading ? "Loading..." : "Submit Face"}</Button>
                                    </>
                                )}
                            </form>
                        </Form>
                    </>
                )}
                {step === "confirm" && (
                    <>
                        <h3 className="text-2xl font-bold">Confirm Sign Up</h3>
                        <p>Please enter the confirmation code sent to your email</p>
                        <Label htmlFor="confirmationCode">Confirmation Code</Label>
                        <Input id="confirmationCode" type="text" placeholder="xxxxxx" onChange={(e) => setConfirmationCode(e.target.value)} />
                        <Button type="submit" onClick={submitConfirmSignUp}>Confirm Sign Up</Button>
                    </>
                )}
                <div className="mt-4 text-center text-sm">Already have an account? <Link className="underline" href="/signin">Sign in</Link></div>
            </main>
        </div>

    );
}
