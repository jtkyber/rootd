import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User from '../../models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		await connectMongo()
		const { userId }: any = req.query

		const uid = new ObjectId(userId)

		const data = await User.aggregate([
			{
				$match: { _id: uid },
			},
			{
				$project: {
					directMsgs: { $objectToArray: '$directMsgs' },
				},
			},
			{
				$group: {
					_id: {
						author: '$directMsgs.v.author',
						isRead: '$directMsgs.v.isRead',
					},
				},
			},
		])

		const authors = data[0]._id.author.flat()
		const isRead = data[0]._id.isRead.flat()
		const isReadCounts = {}

		for (let i = 0; i < authors.length; i++) {
			if (!isReadCounts?.[authors[i]] && !isRead[i]) isReadCounts[authors[i]] = 1
			else if (!isRead[i]) isReadCounts[authors[i]] += 1
		}

		res.json(isReadCounts)
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
