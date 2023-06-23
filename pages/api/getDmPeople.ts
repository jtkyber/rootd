import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const { userId }: any = req.query
		await connectMongo()

		const data: IUser | null = await User.findById(userId, { directMsgs: 1 })
		if (data && typeof data?.directMsgs === 'object') {
			const dmPeople = Object.keys(JSON.parse(JSON.stringify(data.directMsgs)))
			const users: IUser[] | null = await User.find({ username: { $in: dmPeople } }, { _id: 1, username: 1 })
			res.json(users)
		}
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
