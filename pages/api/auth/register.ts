import type { NextApiRequest, NextApiResponse } from 'next'
import connectMongo from '../../../connectDB'
import User, { IUser } from '../../../models/userModel'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<IUser | any>>
  ) {
    try {
        const { username, password, email, gender, bVersion } = req.body
        await connectMongo()
        if (username == null || password == null || email == null || gender == null || bVersion == null) throw new Error('Please fill out all fields')
        else if (gender === 'Gender' || bVersion === 'Prefered Bible Version') throw new Error('Please fill out all fields')
        else if (username.length < 3) throw new Error('Username is too short')
        else if (username.length > 20) throw new Error('Username is too long')
        else if (password.length < 6) throw new Error('Password must be at least 3 characters')
        else if (((email.split('@').length - 1) !== 2) && !email.charAt(email.indexOf('@') + 1)) throw new Error('Incorrect email format')

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
                            if (error?.keyValue?.email) res.json({error: 'That email has already been taken'})
                            else if (error?.keyValue?.username) res.json({error: 'That username has already been taken'})
                            else res.json({error: error.message})
                        } else {
                            return res.json({error: error.message})
                        }
                    }
                })
            })
        })
    } catch(err) {
        console.log(err)
        res.status(400).end(err.message)
    }
}