import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || "postgres://localhost/medusa",
    http: {
      storeCors: process.env.STORE_CORS || "https://giradi.vercel.app",
      adminCors: process.env.ADMIN_CORS || "https://giradi-backend.onrender.com",
      authCors: process.env.AUTH_CORS || "https://giradi.vercel.app",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
})
