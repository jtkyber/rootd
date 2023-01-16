import { Schema, model, models } from "mongoose"
import { IDate, dateSchema } from "./groupModel"

export interface IDm {
    msgID: string,
    author: string,
    content: string,
    date: IDate,
    isLiked: boolean,
    isRead: boolean
}

export interface IUser {
    username: string,
    password: string,
    email: string,
    gender: string,
    bVersion: string,
    groups: string[],
    notifications: string[],
    directMsgs: IDm[],
    dmPeople: string[],
    strikes: string[] // Reasons for strikes
}

export const dmSchema = new Schema<IDm>({
    msgID: String,
    author: String,
    content: String,
    date: dateSchema,
    isLiked: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
})

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
    },
    groups: {
        type: [String],
        required: false
    },
    notifications: {
        type: [String],
        required: false
    },
    directMsgs: {
        type: [dmSchema],
        required: false
    },
    dmPeople: {
        type: [String],
        required: false
    },
    strikes: {
        type: [String],
        required: false
    }
})

const User = models.User0 || model('User0', userSchema, 'users')

export default User