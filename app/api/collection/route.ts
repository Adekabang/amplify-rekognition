import { ListFacesCommand } from "@aws-sdk/client-rekognition";

import { SearchFacesByImageCommandOutput } from "@aws-sdk/client-rekognition";

import { NextResponse } from "next/server";
import { CreateCollectionCommand, DeleteCollectionCommand, ListCollectionsCommand, ListCollectionsCommandOutput, RekognitionClient } from '@aws-sdk/client-rekognition';

export async function GET(request: Request) {
    try {
        if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REKOGNITION_COLLECTION) {
            return NextResponse.json({ error: "AWS credentials are not set" }, { status: 500 });
        }   
        // Connects to AWS Rekognition service
        const rekognitionClient = new RekognitionClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            }
        });

        // List faces in collection
        const listFacesResult: SearchFacesByImageCommandOutput = await rekognitionClient.send(new ListFacesCommand({
            CollectionId: process.env.AWS_REKOGNITION_COLLECTION,
        }))


        return NextResponse.json({ message: "Success to get collection", data: listFacesResult });
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

