import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User from '../../models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		await connectMongo()
		const { userId, bibleVersion }: any = req.body

		await User.updateOne(
			{ _id: userId },
			{
				bVersion: bibleVersion,
			}
		).then(docs => {
			if (docs.modifiedCount > 0) res.json(true)
			else throw new Error('Could not update bible version')
		})
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
