import axios from "axios";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("apiKey");
    const orderId = searchParams.get("orderId");
    const response = await fetch(`https://www.gogetsms.com/handler_api.php?api_key=${apiKey}&action=getStatus&id=${orderId}`);
    const data = await response.text();
    return NextResponse.json({ data: data, message: "success" });
}

export async function POST(request: NextRequest) {
    const req = await request.json();
    try {
        const status   = req.status==='cancel' ? '8' : '3' ;
        const activate = await fetch(`https://www.gogetsms.com/handler_api.php?api_key=${req.apiKey}&action=setStatus&status=${status}&id=${req.orderId}`);
        if (!activate.ok) {
            throw new Error(`Failed to set status: ${activate.statusText}`);
        }
        const data = activate.text();
        return NextResponse.json({data: data, message: "success"});
    } catch (error) {
        return NextResponse.json({ message: "error", error: error });
    }
}