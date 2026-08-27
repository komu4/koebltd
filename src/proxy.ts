import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized({ token }) {
      return token?.role === "admin";
    },
  },
});

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};