'use client'
import { useState } from "react";
import { Amplify } from 'aws-amplify';
import outputs from "../../amplify_outputs.json";
import { confirmSignIn, signIn } from "aws-amplify/auth";
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

Amplify.configure(outputs);
export default function SignIn() {
    const [userImageB64, setUserImageB64] = useState<string | null>(null);
    const [step, setStep] = useState<string>("signin");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

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

    const submitSignIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { nextStep } = await signIn({
                username: email,
                password: password,
                options: {
                    authFlowType: "CUSTOM_WITH_SRP"
                }
            });
            console.log(nextStep);
            setStep("confirm");
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    const submitConfirmSignIn = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/login', {
                method: 'POST',
                body: JSON.stringify({ userImageB64 })
            })
            const data = await response.json();
            console.log(data);
            if (data.error) {
                alert(data.error);
                return;
            }
            const { nextStep } = await confirmSignIn({
                challengeResponse: data.faceId
            })
            console.log(nextStep);
            if (nextStep.signInStep === "DONE") {
                setStep("signin");
                router.push('/');
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        submitSignIn(values.email, values.password)
    }
    return (
        <div className="">
            <main className="max-w-xl px-4 mx-auto my-16 flex flex-col gap-4">
                {step === "signin" && (
                    <>
                        <h3 className="text-2xl font-bold">Sign In</h3>
                        <p>Enter your email below to login to your account</p>
                        <Form {...form} >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                <Button className="w-full" disabled={loading} type="submit">{loading ? "Loading..." : "Sign In"}</Button>
                            </form>
                        </Form>
                    </>
                )}

                {step === "confirm" && (
                    <>
                        <h3 className="text-2xl font-bold">Confirm your Face for Sign In</h3>
                        <FaceRegister setUserImageB64={setUserImageB64} userImageB64={userImageB64} />
                        <Button className="w-full" onClick={submitConfirmSignIn} disabled={loading} type="submit">{loading ? "Loading..." : "Confirm Sign In"}</Button>
                    </>
                )}
                <div className="mt-4 text-center text-sm">Don't have an account? <Link className="underline" href="/signup">Sign up</Link></div>
            </main>
        </div>

    );
}
