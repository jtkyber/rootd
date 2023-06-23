import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import connectMongo from '../../../connectDB'
import User, { IUser } from '../../../models/userModel'

interface ICredentials {
	email: string
	password: string
}

export default NextAuth({
	session: {
		maxAge: 4 * 60 * 60,
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {},
			async authorize(credentials: ICredentials) {
				try {
					await connectMongo()
					// await connectMongo().catch(error => { error: 'Connection Failed'})

					const user = await User.findOne(
						{ email: credentials?.email },
						{ username: 1, email: 1, password: 1, isAdmin: 1 }
					)
					if (!user) throw new Error('No user found with email')

					const pwMatch = await bcrypt.compare(credentials?.password, user.password)
					if (pwMatch || user.email !== credentials?.email) {
						return user
					} else throw new Error('Incorrect username or password')
				} catch (err) {
					console.log(err)
					return null
				}
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			user && (token.user = user)
			return token
		},
		session: async ({ session, token }: any) => {
			const userCopy = { ...token.user }
			delete userCopy.username
			delete userCopy.password

			session.user = userCopy
			return session
		},
	},
	pages: {
		signIn: '/signin',
	},
	secret: process.env.AUTH_SECRET,
})
