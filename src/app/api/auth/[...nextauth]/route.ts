import { nextAuthOptions } from "@/app/lib/next-auth/option";
import NextAuth from "next-auth";

const handler = NextAuth(nextAuthOptions);

export {handler as GET, handler as POST}