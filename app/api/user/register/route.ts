import { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand, SearchFacesByImageCommandOutput, ListFacesCommand, DeleteCollectionCommand} from "@aws-sdk/client-rekognition";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userImageB64, userName } = await request.json();
    try {
      const rekognitionClient = new RekognitionClient({
        region: process.env.AWS_REGION
    });

    const rekognitionCollection = process.env.AWS_REKOGNITION_COLLECTION

    const profilePhotoBuffer = Buffer.from(userImageB64.replace(/^data:image\/\w+;base64,/, ""), "base64")
    
    const searchFacesResult: SearchFacesByImageCommandOutput = await rekognitionClient.send(new SearchFacesByImageCommand({
      CollectionId: rekognitionCollection,
      Image: {
        Bytes: profilePhotoBuffer
      },
      MaxFaces: 1,
    }))

    if (searchFacesResult?.FaceMatches?.length && searchFacesResult?.FaceMatches?.[0].Similarity && searchFacesResult?.FaceMatches?.[0].Similarity > 80) {
      return NextResponse.json({
        error: 'User already registered.'
      })
    }
    const insertInCollectionResult = await rekognitionClient.send(new IndexFacesCommand({
      CollectionId: rekognitionCollection,
      Image: {
        Bytes: profilePhotoBuffer
      },
      MaxFaces: 1,
      QualityFilter: "MEDIUM" // NONE | AUTO | LOW | MEDIUM | HIGH
    }))

    const faceId = insertInCollectionResult?.FaceRecords?.[0]?.Face?.FaceId
    const successfullyInsertedInCollection = (insertInCollectionResult.$metadata.httpStatusCode === 200) && faceId

    if (successfullyInsertedInCollection) {
      return NextResponse.json({
        message: "Successfully add user face to collection.",
        faceId: faceId
      })
    } else {
      return NextResponse.json({
        error: "Something went wrong while adding user face to collection, please try again."
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
