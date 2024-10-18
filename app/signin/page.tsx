'use client'
import { useEffect, useState } from "react";
import { Amplify } from 'aws-amplify';
import outputs from "../../amplify_outputs.json";
import { confirmSignIn, getCurrentUser, signIn } from "aws-amplify/auth";
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
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Loading from "@/components/loading";
import { Eye, EyeOff } from "lucide-react";

Amplify.configure(outputs);
export default function SignIn() {
    const [userImageB64, setUserImageB64] = useState<string | null>(null);
    const [step, setStep] = useState<string>("signin");
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const getUser = async () => {
            try {
                const user = await getCurrentUser();
                console.log("user", user);
                if (user) {
                    router.push('/');
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
        getUser();

    }, []);

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
            setError(null);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError("Invalid email or password.");
            setUserImageB64(null);
            form.reset();
            setStep("signin");

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
                setLoading(false);
                setError(data.error);
                setUserImageB64(null);
                form.reset();
                setStep("signin");
                return;
            }
            const { nextStep } = await confirmSignIn({
                challengeResponse: data.faceId
            })
            console.log(nextStep);
            if (nextStep.signInStep === "DONE") {
                router.push('/');
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError("Invalid email or password or face. Please try again.");
            setUserImageB64(null);
            form.reset();
            setStep("signin");
        }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        submitSignIn(values.email, values.password)
    }
    return (
        <>
            {isLoading ? <Loading /> : (
                <main className="max-w-xl px-4 mx-auto my-16 flex flex-col gap-4">
                    {step === "signin" && (
                        <>
                            {error && <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>}
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <h3 className="text-2xl font-bold">Sign In</h3>
                                    <p className="text-sm">Enter your email and password below to login to your account</p>
                                    <div className="space-y-4 mt-4">
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
                                                        <div className="relative">
                                                            <Input
                                                                placeholder="********"
                                                                type={showPassword ? "text" : "password"}
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                            >
                                                                {showPassword ? <EyeOff /> : <Eye />}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button className="w-full" disabled={loading} type="submit">{loading ? "Loading..." : "Sign In"}</Button>
                                    </div>
                                </form>
                            </Form>
                        </>
                    )}

                    {step === "confirm" && (
                        <>
                            <h3 className="text-2xl font-bold">Confirm your Face for Sign In</h3>
                            <p className="text-sm">Please look at the camera to confirm your face</p>
                            <FaceRegister setUserImageB64={setUserImageB64} userImageB64={userImageB64} />
                            <Button className="w-full" onClick={submitConfirmSignIn} disabled={loading || !userImageB64} type="submit">{loading ? "Loading..." : "Confirm Sign In"}</Button>
                        </>
                    )}
                    <div className="mt-4 text-center text-sm">Don't have an account? <Link className="underline" href="/signup">Sign up</Link></div>
                </main>
            )}
        </>
    );
}
