import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IGroup[]>
  ) {
    try {
        await connectMongo()
        const { keyword, characters, books, includePrivate }: any = req.query
        const groups = await Group.find({
          $and: [
            {$or: [
              {'name': {$regex: keyword}},
              {'summary': {$regex: keyword}},
              {'tags': {$in: keyword}}
            ]},
            JSON.parse(characters).length ? {'characters': {$all: [...JSON.parse(characters)]}} : {},
            JSON.parse(books).length ? {'books': {$all: [...JSON.parse(books)]}} : {},
            JSON.parse(includePrivate) === false ? {'isPrivate': {$ne: true}} : {}
          ]
        }, {messages: 0})
        res.json(groups)
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}