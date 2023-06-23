import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../../connectDB'
import Admin from '../../../models/adminModel'
import User, { IUser } from '../../../models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const { userId, resultType, cursor, limit }: any = req.query
		await connectMongo()

		const isAdmin: IUser | null = await User.findOne({ _id: userId, isAdmin: true })
		const userIsAdmin = isAdmin ? true : false

		if (userIsAdmin) {
			const res1 = await Admin.findOne({}, { [`${resultType}`]: 1, _id: 0 })
			const notifs = res1.groupCreationRequests.slice(parseInt(cursor), parseInt(cursor) + parseInt(limit))

			res.json({
				data: notifs,
				cursor: notifs.length >= parseInt(limit) ? parseInt(cursor) + parseInt(limit) : null,
			})
		} else throw new Error('This feature is only accessable to admins')
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
