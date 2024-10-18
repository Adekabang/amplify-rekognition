
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useCallback, useRef } from 'react'
import Webcam from 'react-webcam'
import Image from 'next/image';
import { Form, FormDescription, FormLabel, FormMessage } from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export default function Register({
    setUserImageB64,
    userImageB64,
    setUserName,
    userName }: {
        setUserImageB64: (data: string) => void,
        userImageB64: string | null,
        setUserName: (data: string) => void,
        userName: string
    }) {

    const webcamDimensions = { width: 640, height: 360 }
    const webcamRef: any = useRef(null);
    const takePhoto = useCallback(
        () => {
            if (webcamRef && webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                setUserImageB64(imageSrc);
            }
        },
        [webcamRef]
    );

    const formSchema = z.object({
        username: z.string().min(2).max(50),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: userName,
                userImageB64: userImageB64
            })
        }).then(async (res) => {
            if (res.status === 201) {
                const result = await res.json()
                if (!result.error) {
                    alert('Successfully registered.')
                } else {
                    alert(result.error)
                }
                setUserImageB64('')
            }
        }).finally(() => {
            // setLoading(false)
        })
    }

    return (
        <div className='flex flex-col gap-4'>
            {!userImageB64 &&
                <>
                    <Webcam
                        width={webcamDimensions.width}
                        height={webcamDimensions.height}
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            width: webcamDimensions.width,
                            height: webcamDimensions.height,
                            facingMode: "user"
                        }}
                    />
                    <Button type='button'
                        onClick={takePhoto}>Take photo</Button>
                </>}

            {userImageB64 && <>
                <Image src={userImageB64} width={webcamDimensions.width} height={webcamDimensions.height} alt="User photo" />
                <Button type='button' variant="outline" onClick={() => setUserImageB64('')}>Take another photo</Button>
            </>}

            {/* <Input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} /> */}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>

        </div>
    )
}
