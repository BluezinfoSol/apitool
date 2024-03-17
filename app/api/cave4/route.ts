import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("api_key");
    const response = await fetch(`https://smsak.org/api/getbalance/${apiKey}`);
    const data = await response.text();
    return NextResponse.json({ data: data, message: "success" });
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const response = await fetch(`https://smsak.org/api/getnumber/${req.apiKey}?id=${req.service}&code=${req.country}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        return NextResponse.json({ data: data, message: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "error", error: error });
    }
}
