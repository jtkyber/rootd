import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup, IMessage } from '../../models/groupModel'

type Data = {
	data: IMessage[]
	cursor: number | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	try {
		const { groupId, cursor, limit }: any = req.query
		await connectMongo()

		const group: IGroup | null = await Group.findById(groupId, {
			messages: { $slice: [parseInt(cursor), parseInt(limit)] },
		})
		if (!group) throw new Error('Group not found')
		if (!group.messages) throw new Error('Messages not found')
		const messages: IMessage[] = group.messages

		res.json({
			data: messages,
			cursor: messages.length >= parseInt(limit) ? parseInt(cursor) + parseInt(limit) : null,
		})
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
