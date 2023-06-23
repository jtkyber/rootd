import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel'

type Data = {
	data: IGroup[]
	cursor: number | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	try {
		await connectMongo()
		const {
			keyword = '',
			characters,
			books,
			includePrivate,
			sortType,
			sortDir,
			cursor,
			limit,
		}: any = req.query

		let sortObject = {}

		switch (sortType) {
			case 'name':
				if (sortDir === 'down') sortObject = { name: 1 }
				else sortObject = { name: -1 }
				break

			case 'members':
				if (sortDir === 'down') sortObject = { memberCount: 1 }
				else sortObject = { memberCount: -1 }
				break

			case 'lastActive':
				if (sortDir === 'down') sortObject = { date: -1 }
				else sortObject = { date: 1 }
				break

			case 'isPrivate':
				if (sortDir === 'down') sortObject = { isPrivate: 1 }
				else sortObject = { isPrivate: -1 }
				break

			default:
				sortObject = { name: 1 }
		}

		const groups = await Group.find(
			{
				$and: [
					{ tags: { $regex: keyword } },
					JSON.parse(characters).length ? { characters: { $all: [...JSON.parse(characters)] } } : {},
					JSON.parse(books).length ? { books: { $all: [...JSON.parse(books)] } } : {},
					JSON.parse(includePrivate) === false ? { isPrivate: { $ne: true } } : {},
				],
			},
			{ messages: 0, password: 0 }
		)
			.collation({ locale: 'en' })
			.sort(sortObject)
			.skip(parseInt(cursor))
			.limit(parseInt(limit))
		res.json({
			data: groups,
			cursor: groups.length >= parseInt(limit) ? parseInt(cursor) + parseInt(limit) : null,
		})
	} catch (err) {
		console.log(err)
		res.status(400).end(err)
	}
}
