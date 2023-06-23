import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IUser } from '../../models/userModel'

export interface IDm {
	content: string
	date: Date | number
	isLiked: boolean
	isRead: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		await connectMongo()

		const { userName, friendName }: any = req.query

		let count = 0
		let objectPath
		let username
		while (count < 2) {
			if (count === 0) {
				//post to receiver
				objectPath = `directMsgs.${userName}.$[i].isRead`
				username = friendName
			} else {
				//post to author
				objectPath = `directMsgs.${friendName}.$[i].isRead`
				username = userName
			}

			await User.updateOne(
				{
					username: username,
				},
				{
					$set: { [objectPath]: true },
				},
				{
					arrayFilters: [{ 'i.author': friendName }],
				}
			)
			count++
		}
		res.json(true)
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
