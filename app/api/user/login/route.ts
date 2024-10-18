import { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand, SearchFacesByImageCommandOutput, ListFacesCommand, DeleteCollectionCommand} from "@aws-sdk/client-rekognition";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { userImageB64 } = await request.json();
    try {
       // Connects to AWS Rekognition service
    const rekognitionClient = new RekognitionClient({
        region: process.env.AWS_REGION
        });

    // Transforms the image represented as base64 into a bytes buffer
    const profilePhotoBuffer = Buffer.from(userImageB64.replace(/^data:image\/\w+;base64,/, ""), "base64")

    // Search faces in our collection using the main face from the image (if it exist)
    const searchFacesResult: SearchFacesByImageCommandOutput = await rekognitionClient.send(new SearchFacesByImageCommand({
    CollectionId: process.env.AWS_REKOGNITION_COLLECTION,
    Image: {
        Bytes: profilePhotoBuffer
    },
    MaxFaces: 1,
    QualityFilter: 'MEDIUM'
    }))

    const faceId = searchFacesResult?.FaceMatches?.[0]?.Face?.FaceId
    const found = searchFacesResult?.$metadata?.httpStatusCode === 200 && faceId

    if (found) {
    return NextResponse.json({
        message: "success get user face id",
        faceId: faceId
        })
    } else {
    return NextResponse.json({
        error: "Couldn't find user by profile photo."
        })
    }

    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: err.message || err.toString() }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}
