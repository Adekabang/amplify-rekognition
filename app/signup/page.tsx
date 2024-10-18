'use client'
import { useEffect, useState } from "react";
import { Amplify } from 'aws-amplify';
import outputs from "../../amplify_outputs.json";
import { confirmSignUp, getCurrentUser } from "aws-amplify/auth";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import FaceRegister from "../components/FaceRegister";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import { Eye, EyeOff } from "lucide-react";

Amplify.configure(outputs);
export default function SignUp() {
    const router = useRouter();
    const [userImageB64, setUserImageB64] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    // const [password, setPassword] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string>("");
    const [step, setStep] = useState<string>("signup");
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);

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
            }
            setIsLoading(false);
        }
        getUser();
    }, []);

    const formSchema = z.object({
        email: z.string().email(),
        password: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
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
        <>
            {isLoading ? <Loading /> : (
                <main className="max-w-xl px-4 mx-auto my-16 flex flex-col gap-4">
                    {(step === "signup" || step === "faceregister") && (
                        <>
                            <Form {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                                    {step === "signup" && (
                                        <>
                                            <h3 className="text-2xl font-bold">Account Registration</h3>
                                            <p className="text-sm">Enter your information below to register for a new account</p>
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
                                                            <FormDescription>
                                                                Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number and one special character
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button className="w-full" onClick={() => { setStep("faceregister") }} disabled={!(form.formState.isValid && form.formState.isDirty)}>Sign Up</Button>
                                            </div>
                                        </>
                                    )}
                                    {step === "faceregister" && (
                                        <>
                                            <h3 className="text-2xl font-bold">Face Registration</h3>
                                            <p>Please look at the camera to register your face</p>
                                            <div className="space-y-4">
                                                <FaceRegister setUserImageB64={setUserImageB64} userImageB64={userImageB64} />
                                                <div className="flex justify-center gap-4">
                                                    <Button className="w-2/5" variant="outline" onClick={() => setStep("signup")}>Back to Sign Up</Button>
                                                    <Button className="w-2/5" disabled={loading || !userImageB64} type="submit">{loading ? "Loading..." : "Submit Face"}</Button>
                                                </div>
                                            </div>
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
                    {/* <div>
                        <h1>Form State</h1>
                        <p>isDirty: {form.formState.isDirty.toString()}</p>
                        <p>isValid: {form.formState.isValid.toString()}</p>
                        <p>condition: {(!form.formState.isValid && !form.formState.isDirty).toString()}</p>
                    </div> */}
                </main>
            )}
        </>

    );
}
