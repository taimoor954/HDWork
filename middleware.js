import { NextResponse } from "next/server";

export function middleware(req){
    console.log('middleware workeds')
    return NextResponse.next()
}

export const config = {
    matcher: "/api/hello"
}