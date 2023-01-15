import { Schema, model, models } from "mongoose"

export interface IUser {
    username: string,
    password: string,
    email: string,
    gender: string,
    bVersion: string
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    bVersion: {
        type: String,
        required: true
    }
})

const User = models.User || model('User', userSchema, 'users')

export default User