import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User from '../../models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const { userId, person } = req.body

		await connectMongo()

		await User.updateOne(
			{ _id: userId },
			{
				$set: { currentDmPerson: person },
			}
		).then(docs => {
			if (docs.modifiedCount) res.json(true)
			else res.json(false)
		})
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
