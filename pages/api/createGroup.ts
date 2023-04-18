import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import mongoose from 'mongoose';

interface IQuery {
    username: string
    name: string
    summary: string
    books: string[]
    characters: string[]
    tags: string[]
    isPrivate: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup>
  ) {
    try {
        await connectMongo()
        const { username, name, summary, books, characters, tags, isPrivate }: any = req.body

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
        console.log(err)
        res.status(400).end(err)
    }
}