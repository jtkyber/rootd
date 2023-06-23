import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const { groupId }: any = req.query
		await connectMongo()

		const group: IGroup | null = await Group.findById(groupId, { password: 1 })
		if (group) res.json(group?.password?.toString())
		else throw new Error('Could not get group password')
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
