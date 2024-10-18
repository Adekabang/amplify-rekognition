import { NextResponse } from "next/server";
import { CreateCollectionCommand, DeleteCollectionCommand, ListCollectionsCommand, ListCollectionsCommandOutput, RekognitionClient } from '@aws-sdk/client-rekognition';

export async function GET(request: Request) {
    try {
        if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REKOGNITION_COLLECTION) {
            return NextResponse.json({ error: "AWS credentials are not set" }, { status: 500 });
        }

        const rekognitionClient = new RekognitionClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            }
        });

        // Creates AWS Rekognition collection (first it will delete if it exist)
        rekognitionClient.send(new ListCollectionsCommand({}))
            .then(async (collections: ListCollectionsCommandOutput) => {
                if (!collections.CollectionIds) {
                    return NextResponse.json({ error: "No collections found" }, { status: 500 });
                }

                let alreadyExist = false

                for (const collectionId of collections.CollectionIds) {
                    if (collectionId === process.env.AWS_REKOGNITION_COLLECTION) {
                        alreadyExist = true
                    }
                }

                // TODO: Re-create the logic. 
                // You will probably not want to delete entire collection everytime the app is executed.
                // And you also do not want to try to create something that already exists. 
                if (alreadyExist) {
                    await rekognitionClient.send(new DeleteCollectionCommand({
                        CollectionId: process.env.AWS_REKOGNITION_COLLECTION
                    }))
                }
                await rekognitionClient.send(new CreateCollectionCommand({
                    CollectionId: process.env.AWS_REKOGNITION_COLLECTION
                }))
            })

        return NextResponse.json({ message: "Collection initialized" });
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
