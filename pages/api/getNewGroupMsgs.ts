import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup, IMessage } from '../../models/groupModel'

type Data = {
	name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	try {
		await connectMongo()

		const { groupId, lastMsgDate }: any = req.query
		const lastMsgDateParsed = Date.parse(lastMsgDate)

		const group: IGroup | null = await Group.findById(groupId)
		if (!group) throw new Error('Group not found')

		const newMesssages: any = []
		if (lastMsgDate && group.messages) {
			for (let i = group.messages.length - 1; i >= 0; i--) {
				if (group.messages[i].date.valueOf() > lastMsgDateParsed.valueOf()) {
					newMesssages.push(group.messages[i])
				} else break
			}
		}
		newMesssages.sort((a, b) => a.date.valueOflastMsgDateParsed() - b.date.valueOf())
		res.json(newMesssages)
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
