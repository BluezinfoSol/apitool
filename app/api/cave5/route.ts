import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("api_key");
    const response = await fetch(`https://give-sms.com/api/v1/?method=getbalance&userkey=${apiKey}`);
    const data = await response.text();
    return NextResponse.json({ data: data, message: "success" });
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const response = await fetch(`https://give-sms.com/api/v1/?method=getnumber&userkey=${req.apiKey}&service=${req.service}&country=${req.country}&operator=ANY`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.error) {
            const activate = await fetch(`https://give-sms.com/stubs/handler_api.php?action=setStatus&status=1&id=${data.data.order_id}&api_key=${req.apiKey}`);
            if (!activate.ok) {
                throw new Error(`Failed to set status: ${activate.statusText}`);
            }
            return NextResponse.json({ data: data, message: "success" });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "error", error: error });
    }
}
