# FaceAuth

FaceAuth is a Next.js project that implements facial authentication using AWS Rekognition.

## Getting Started

To initialize the AWS Rekognition collection, open this URL in your browser:

[http://localhost:3000/api/collection/init](http://localhost:3000/api/collection/init)

To see the collection list, open this URL in your browser:

[http://localhost:3000/api/collection](http://localhost:3000/api/collection)

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (version 18.16.0 or higher)
- npm or yarn

## Installation

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

## Project Structure

This project uses Next.js and includes the following key dependencies:

- AWS SDK for JavaScript (v3)
- AWS Amplify
- React Hook Form
- Zod for schema validation
- Tailwind CSS for styling

## AWS Configuration

Make sure to set up your AWS credentials properly to use the Rekognition service. You may need to configure environment variables or use AWS Amplify for managing your backend resources.
