# FaceAuth

FaceAuth is a Next.js project that implements facial authentication using AWS Rekognition.

## Getting Started

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and [AWS Amplify](https://docs.amplify.aws/nextjs/start/account-setup/).

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (version 18.16.0 or higher)
- npm or bun
- AWS Credentials (look at .env.example and set the correct environment variables)

## Running the Amplify Sandbox

To start the development sandbox, run:
```bash
npx ampx sandbox
```

## Installation dependencies

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
or
bun install
```
## Running the Development Server

To start the development server, run:
```bash
npm run dev
or
bun --bun run dev
```


Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

To initialize the AWS Rekognition collection, open this URL in your browser:

[http://localhost:3000/api/collection/init](http://localhost:3000/api/collection/init)

To see the collection list, open this URL in your browser:

[http://localhost:3000/api/collection](http://localhost:3000/api/collection)

## Project Structure

This project uses Next.js and includes the following key dependencies:

- AWS SDK for JavaScript (v3)
- AWS Amplify
- React Hook Form
- Zod for schema validation
- Tailwind CSS for styling
- Shadcn for UI

## AWS Configuration

Make sure to set up your AWS credentials properly to use the Rekognition service. You may need to configure environment variables or use AWS Amplify for managing your backend resources.

## Architecture
[View on Eraser![](https://app.eraser.io/workspace/KHBy1oN8T9cXmf6BTsLG/preview?elements=UcoF4-c0sosAaikzeJV5SQ&type=embed)](https://app.eraser.io/workspace/KHBy1oN8T9cXmf6BTsLG?elements=UcoF4-c0sosAaikzeJV5SQ)

Reference:
- [https://github.com/GustavoContreiras/web-authentication-with-aws-rekognition](https://github.com/GustavoContreiras/web-authentication-with-aws-rekognition)
- [https://docs.amplify.aws/nextjs/build-a-backend/functions/examples/custom-auth-flows/](https://docs.amplify.aws/nextjs/build-a-backend/functions/examples/custom-auth-flows/)
- [https://aws.amazon.com/blogs/developer/authenticate-applications-through-facial-recognition-with-amazon-cognito-and-amazon-rekognition/](https://aws.amazon.com/blogs/developer/authenticate-applications-through-facial-recognition-with-amazon-cognito-and-amazon-rekognition/)
