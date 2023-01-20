import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../../connectDB'
import User from '../../../models/userModel'
import bcrypt from 'bcrypt'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
  ) {
    try {
        const { username, password, email, gender, bVersion } = req.body;
        await connectMongo();
        bcrypt.genSalt(10, (_err, salt): void => {
            bcrypt.hash(password, salt, async (_err, hash) => {
                User.create({
                    username: username, 
                    password: hash,
                    email: email,
                    gender: gender,
                    bVersion: bVersion
                }, (error, newUser) => {
                    const userClone = (({ password, ...object }) => object)(newUser._doc)
                    if (userClone?._id) {
                        res.json(userClone)
                    } else {
                        if (error.code === 11000) {
                            throw new Error('Username already exists')
                        } else {
                            throw new Error(error)
                        }
                    }
                });
            })
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err)
    }
}