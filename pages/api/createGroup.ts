import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import mongoose from 'mongoose';

interface IMyError {
    msg: string,
    section: string | null
}

class MyError extends Error {
    section: string | null
    constructor ({ msg, section }: IMyError) {
        super(msg)
        this.section = section
    }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup | IMyError>
  ) {
    try {
        await connectMongo()
        const { username, name, summary, books, characters, tags, isPrivate }: any = req.body

        if (!username) throw new MyError({ msg: 'Not logged in', section: null })
        if (!name.length) throw new MyError({ msg: 'Please include a group name', section: 'Name' })
        if (summary.length < 15) throw new MyError({ msg: 'Please write a longer summary', section: 'Summary' })
        if (!books.length) throw new MyError({ msg: 'Please include at least one book', section: 'Books' })
        if (tags.length < 2) throw new MyError({ msg: 'Please include at least two tags', section: 'Tags' })

        await Group.create({
            _id: new mongoose.Types.ObjectId,
            name: name,
            isPrivate: isPrivate,
            summary: summary,
            tags: [...tags.map(tag => tag.toLowerCase()), name.toLowerCase(), summary.toLowerCase(), ...books.map(book => book.toLowerCase()), ...characters.map(character => character.toLowerCase())],
            characters: characters,
            books: books,
            date: Date.now(),
            lastActive: Date.now(),
            groupAdmin: username,
            password: new mongoose.Types.ObjectId
        }).then(async docs => {
            const group = await Group.findById(docs._id, { password: 0})
            res.json(group)
        })
    } catch(err) {
        console.log(err.message)
        res.status(400).json({ msg: err.message, section: err?.section || null })
    }
}