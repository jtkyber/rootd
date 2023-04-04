import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../../connectDB'
import User, { IUser } from '../../../models/userModel'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<IUser>>
  ) {
    try {
        const { username, password, email, gender, bVersion } = req.body;
        await connectMongo();
        bcrypt.genSalt(10, (_err, salt): void => {
            bcrypt.hash(password, salt, async (_err, hash) => {
                User.create({
                    _id: new mongoose.Types.ObjectId,
                    username: username, 
                    password: hash,
                    email: email,
                    gender: gender,
                    bVersion: bVersion
                }, (error, docs) => {
                    if (docs?._id) {
                        const userClone = (({ password, ...object }) => object)(docs?._doc)
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