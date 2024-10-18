import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
       

        return NextResponse.json({ message: "Success to register user" });
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
