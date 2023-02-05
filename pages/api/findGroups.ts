import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../connectDB'
import Group, { IGroup } from '../../models/groupModel';

type Data = {
  data: IGroup[],
  cursor: number | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        await connectMongo()
        const { keyword, characters, books, includePrivate, cursor, limit }: any = req.query
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
        }, {messages: 0}).skip(parseInt(cursor)).limit(parseInt(limit))
        res.json({
          data: groups,
          cursor: groups.length > 2 ? parseInt(cursor) + parseInt(limit) : null
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}