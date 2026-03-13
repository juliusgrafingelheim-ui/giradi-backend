import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

console.log("========== MEDUSA CONFIG DEBUG ==========")
console.log("S3_ACCESS_KEY set:", !!process.env.SUPABASE_S3_ACCESS_KEY)
console.log("S3_SECRET_KEY set:", !!process.env.SUPABASE_S3_SECRET_KEY)
console.log("Modules.FILE =", Modules.FILE)
console.log("==========================================")

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
  modules: [
    {
      key: Modules.FILE,
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              file_url: "https://afawjsfbtsisryafwyyq.supabase.co/storage/v1/object/public/product-images",
              access_key_id: process.env.SUPABASE_S3_ACCESS_KEY,
              secret_access_key: process.env.SUPABASE_S3_SECRET_KEY,
              region: "eu-north-1",
              bucket: "product-images",
              endpoint: "https://afawjsfbtsisryafwyyq.supabase.co/storage/v1/s3",
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
  ],
})
