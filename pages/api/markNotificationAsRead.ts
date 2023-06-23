import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel'

type Data = {
	name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IUser | boolean>) {
	try {
		await connectMongo()

		const { userId, notificationId }: any = req.body

		const user = await User.findOneAndUpdate(
			{ _id: userId },
			{
				$set: {
					'notifications.$[i].read': true,
					'notifications.$[i].readDate': Date.now(),
				},
			},
			{
				arrayFilters: [{ 'i._id': notificationId }],
				new: true,
			}
		)
		if (!user) throw new Error('Could not update notification')
		res.json(user)
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
