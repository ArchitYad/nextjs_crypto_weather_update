import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/auth",
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : null;
      }

      if (Date.now() > (token.accessTokenExpires as number)) {
        console.log("🔄 Refreshing Google Token...");
        return await refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      session.user.name = token.name || null;
      session.user.email = token.email || null;
      session.user.image = token.picture || null;
      session.accessToken = token.accessToken as string | undefined; 
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: token.refreshToken!,
        grant_type: "refresh_token",
      }),
    });

    const refreshedTokens = (await response.json()) as {
      access_token: string;
      expires_in: number;
      refresh_token?: string;
    };

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    console.log("✅ Successfully refreshed Google token");

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Keep the old refresh token if Google doesn’t return a new one
    };
  } catch (error) {
    console.error("❌ Failed to refresh access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
export default NextAuth(authOptions);