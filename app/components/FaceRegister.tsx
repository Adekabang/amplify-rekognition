
import { Button } from '@/components/ui/button';
import React, { useCallback, useRef } from 'react'
import Webcam from 'react-webcam'
import Image from 'next/image';

export default function FaceRegister({
    setUserImageB64,
    userImageB64,
}: {
    setUserImageB64: (data: string) => void,
    userImageB64: string | null,
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
        </div>
    )
}
