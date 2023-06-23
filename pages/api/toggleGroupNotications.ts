import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		const { groupId, username } = req.body

		await connectMongo()

		await Group.updateOne(
			{ _id: groupId },
			{
				$pull: { membersWithGroupMuted: username },
			}
		).then(async docs => {
			if (docs.modifiedCount > 0) res.json(false)
			else {
				await Group.updateOne(
					{ _id: groupId },
					{
						$push: { membersWithGroupMuted: username },
					}
				).then(docs => {
					if (docs.modifiedCount > 0) res.json(true)
					else throw new Error('Could not modify "membersWithGroupMuted" array')
				})
			}
		})
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
