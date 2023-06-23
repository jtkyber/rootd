import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import User, { IAllDms, IDm, IUser } from '../../models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const { userId, selectedPersonName, cursor, limit }: any = req.query
		await connectMongo()
		const objectPath = `directMsgs.${selectedPersonName}`

		const user: IUser | null = await User.findById(userId, {
			[objectPath]: { $slice: [parseInt(cursor), parseInt(limit)] },
		})
		if (!user) throw new Error('User not found')
		if (!user?.directMsgs) throw new Error('Messages not found')
		const msgsTemp: IAllDms[] = JSON.parse(JSON.stringify(user.directMsgs))
		const messages: any = msgsTemp[selectedPersonName]

		res.json({
			data: messages,
			cursor: messages?.length >= parseInt(limit) ? parseInt(cursor) + parseInt(limit) : null,
		})
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
