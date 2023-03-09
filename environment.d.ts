declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string
            MONGODB_DB: string
            GOOGLE_CLIENT_ID: string
            GOOGLE_CLIENT_SECRET: string
            CURRENT_BASE_URL: string
            AUTH_SECRET: string
        }
    }
}

export {}