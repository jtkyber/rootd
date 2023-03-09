import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectMongo from '../../../connectDB'
import User from '../../../models/userModel'
import bcrypt from 'bcrypt'

interface ICredentials {
    email: string,
    password: string
}

export default NextAuth({
    session: {
        maxAge: 4 * 60 * 60
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials: ICredentials) {
                try {
                    // connectMongo().catch(error => { error: 'Connection Failed'})
                    console.log('test')
                    await connectMongo()
                    console.log(credentials)
    
                    const user = await User.findOne({ email: credentials?.email })

                    console.log(user)
                    if (!user) throw new Error('No user found with email')
    
                    const pwMatch = await bcrypt.compare(credentials?.password, user.password);
                    if (pwMatch || user.email !== credentials?.email) {
                        return user
                    } else throw new Error('Incorrect username or password')
                } catch (err) {
                    console.log(err)
                    return null
                }
            }
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token
        },
        session: async ({ session, token }: any) => {
            session.user = token.user
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.AUTH_SECRET
}) 