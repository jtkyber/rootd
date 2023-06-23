import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Admin from '../../models/adminModel'
import Group, { IGroup } from '../../models/groupModel'
import User, { IUser } from '../../models/userModel'

interface IMyError {
	msg: string
	section: string | null
}

class MyError extends Error {
	section: string | null
	constructor({ msg, section }: IMyError) {
		super(msg)
		this.section = section
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<IGroup | IMyError | boolean>
) {
	try {
		await connectMongo()
		const { groupId, groupAdmin, userId, name, description, books, characters, tags, isPrivate }: any =
			req.body

		if (!groupAdmin) throw new MyError({ msg: 'Not logged in', section: null })
		if (!name?.trim()?.length) throw new MyError({ msg: 'Please include a group name', section: 'Name' })
		if (description?.trim()?.length < 15)
			throw new MyError({ msg: 'Please write a longer description', section: 'Description' })
		if (!books.length) throw new MyError({ msg: 'Please include at least one book', section: 'Books' })
		if (tags.length < 2) throw new MyError({ msg: 'Please include at least two tags', section: 'Tags' })

		const isAdmin: IUser | null = await User.findOne({ _id: userId, isAdmin: true })
		const userIsAdmin = isAdmin ? true : false

		if (!userIsAdmin) {
			await Admin.updateOne(
				{},
				{
					$push: {
						groupCreationRequests: {
							_id: new mongoose.Types.ObjectId(),
							groupId: new mongoose.Types.ObjectId(),
							name: name.trim(),
							description: description.trim(),
							tags: tags,
							date: Date.now(),
							isPrivate: isPrivate,
							characters: characters,
							books: books,
							groupAdmin: groupAdmin,
							groupAdminId: userId,
						},
					},
				}
			).then(docs => {
				if (docs.modifiedCount > 0) {
					res.json(true)
				} else res.json(false)
			})
		} else {
			await Group.create({
				_id: groupId,
				name: name.trim(),
				isPrivate: isPrivate,
				description: description.trim(),
				tags: [
					...tags.map(tag => tag.toLowerCase()),
					name.trim().toLowerCase(),
					description.trim().toLowerCase(),
					...books.map(book => book.toLowerCase()),
					...characters.map(character => character.toLowerCase()),
				],
				characters: characters,
				books: books,
				date: Date.now(),
				lastActive: Date.now(),
				groupAdmin: groupAdmin,
				password: new mongoose.Types.ObjectId(),
			}).then(async docs => {
				const group = await Group.findById(docs._id, { password: 0 })
				res.json(group)
			})
		}
	} catch (err) {
		console.log(err.message)
		res.status(400).json({ msg: err.message, section: err?.section || null })
	}
}
