import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("apiKey");
    const orderId = searchParams.get("orderId");
    const response = await fetch(`https://smsak.org/api/getstatus/${apiKey}?id=${orderId}`);
    const data = await response.json();
    return NextResponse.json({ data: data, message: "success" });
}

export async function POST(request: NextRequest) {
    const req = await request.json();
    try {
        const activate = req.status==='cancel' ? await fetch(`https://smsak.org/api/setstatus/${req.apiKey}?id=$id&status=1`) : await fetch(`https://smsak.org/api/play/${req.apiKey}?id=${req.orderId}`);
        if (!activate.ok) {
            throw new Error(`Failed to set status: ${activate.statusText}`);
        }
        const data = activate.json();
        return NextResponse.json({data: data, message: "success"});
    } catch (error) {
        return NextResponse.json({ message: "error", error: error });
    }
}