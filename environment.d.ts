declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string
            MONGODB_DB: string
            GOOGLE_CLIENT_ID: string
            GOOGLE_CLIENT_SECRET: string
            CURRENT_BASE_URL: string
            AUTH_SECRET: string
            PUSHER_APP_ID: string
            PUSHER_KEY: string
            PUSHER_SECRET: string
            PUSHER_CLUSTER: string
        }
    }
}

export {}