import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';
import rw from 'random-words'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup[]>
  ) {
    try {
        await connectMongo()
        const { count }: any = req.query
        const characters = ['samuel', 'david', 'saul', 'jesus', 'moses', 'noah', 'peter', 'andrew', 'thomas', 'mary'] 
        const books = ['1 samuel', 'genesis', 'john', 'mark', 'revelation', 'acts', 'romans', 'exodus', 'psalms', 'luke'] 
        
        const groups: IGroup[] = []
        for (let i = 0; i < count; i++) {
            const newBooks: string[] = []
            for (let j = 0; j < books.length-1; j++) {
                if (Math.random() < 0.5) newBooks.push(books[j])
            }

            const newCharacters: string[] = []
            for (let k = 0; k < characters.length-1; k++) {
                if (Math.random() < 0.5) newCharacters.push(characters[k])
            }

            const newGroup: IGroup | any = await Group.insertMany({
                name: rw({ exactly: 2, join: ' ' }),
                members: rw(Math.floor(Math.random() * (21 - 3 + 1) + 3)),
                isPrivate: Math.random() < 0.5,
                summary: rw({ exactly: 20, join: ' ' }),
                tags: rw(5),
                characters: newCharacters,
                books: newBooks,
                date: Date.now(),
                lastActive: Date.now()
            })
            groups.push(newGroup)
        } 
        res.json(groups)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}