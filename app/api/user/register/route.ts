import { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand, SearchFacesByImageCommandOutput, ListFacesCommand, DeleteCollectionCommand} from "@aws-sdk/client-rekognition";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userImageB64, userName } = await request.json();
    try {
       // Step 0: Connect to AWS Rekognition service

    const rekognitionClient = new RekognitionClient({
      region: process.env.AWS_REGION
    });

    const rekognitionCollection = process.env.AWS_REKOGNITION_COLLECTION

    // Step 1: Check if the user is already registered

    // Transforms the image represented as base64 into a bytes buffer
    const profilePhotoBuffer = Buffer.from(userImageB64.replace(/^data:image\/\w+;base64,/, ""), "base64")

    // Search faces in our collection using the main face from the image (if it exist)
    const searchFacesResult: SearchFacesByImageCommandOutput = await rekognitionClient.send(new SearchFacesByImageCommand({
      CollectionId: rekognitionCollection,
      Image: {
        Bytes: profilePhotoBuffer
      },
      MaxFaces: 1,
    }))

    if (searchFacesResult?.FaceMatches?.length > 0 && searchFacesResult.FaceMatches[0].Similarity > 80) {
      return {
        error: 'User already registered.'
      }
    }

    // Step 2: Create the user in our database
    // const resultCreateUser: ResultSetHeader = await this.appService.createUser({
    //   name: name,
    //   age: age,
    // })

    // const userId = resultCreateUser.insertId

    // Step 3 (optional): Insert the user profile photo in the AWS S3 Bucket
    // const s3Client = new S3Client({
    //   region: process.env.AWS_REGION,
    //   credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY,
    //     secretAccessKey: process.env.AWS_SECRET_KEY
    //   }
    // });

    // const s3Bucket = process.env.AWS_S3_BUCKET
    // const s3BucketBaseUrl = `https://${s3Bucket}.s3.us-east-1.amazonaws.com/`
    // const profilePhotoFileName = `user_avatar_${userId}.jpeg`

    // const insertProfilePhotoResult: PutObjectCommandOutput = await s3Client.send(new PutObjectCommand({
    //   Bucket: s3Bucket,
    //   Key: profilePhotoFileName,
    //   Body: profilePhotoBuffer,
    //   ContentEncoding: "base64",
    //   ContentType: "image/jpeg"
    // }))

    // const successfullyInsertedInS3 = insertProfilePhotoResult.$metadata.httpStatusCode === 200

    // Step 4: Insert the user profile photo in the AWS Rekognition Collection
    // if (successfullyInsertedInS3) {


      // Note: To insert a face in a collection you can send it's bytes or send an image stored in S3
      const insertInCollectionResult = await rekognitionClient.send(new IndexFacesCommand({
        CollectionId: rekognitionCollection,
        Image: {
          Bytes: profilePhotoBuffer
          // S3Object: { // use S3Object if you are using S3 Bucket in the previous step
          //   Bucket: s3Bucket,
          //   Name: profilePhotoFileName,
          // }
        },
        MaxFaces: 1,
        QualityFilter: "MEDIUM" // NONE | AUTO | LOW | MEDIUM | HIGH
      }))

      const faceId = insertInCollectionResult?.FaceRecords[0]?.Face?.FaceId
      const successfullyInsertedInCollection = (insertInCollectionResult.$metadata.httpStatusCode === 200) && faceId

      // Step 4: Update the faceId of the user and the profilePhotoUrl in our database
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
