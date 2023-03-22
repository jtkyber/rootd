import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import rw from 'random-words'
import characters from '../../characters.json'
import books from '../../books.json'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup[]>
  ) {
    try {
        await connectMongo()
        const { count }: any = req.query
        
        const groups: IGroup[] = []
        for (let i = 0; i < count; i++) {
            const newBooks: string[] = []
            for (let j = 0; j < books.length-1; j++) {
                if (Math.random() < 0.05) newBooks.push(books[j].book)
            }

            const newCharacters: string[] = []
            for (let k = 0; k < characters.length-1; k++) {
                if (Math.random() < 0.03) newCharacters.push(characters[k])
            }

            const isPrivate = Math.random() < 0.5

            const newGroup: IGroup | any = await Group.insertMany({
                name: rw({ exactly: 2, join: ' ' }),
                members: rw(Math.floor(Math.random() * (21 - 3 + 1) + 3)),
                isPrivate: isPrivate,
                summary: rw({ exactly: 20, join: ' ' }),
                tags: rw(5),
                characters: newCharacters,
                books: newBooks,
                date: Date.now(),
                lastActive: Date.now(),
                groupAdmin: '123'
            })
            groups.push(newGroup)
        } 
        res.json(groups)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}