import { ObjectId } from "bson"
import { Schema, model, models, ObjectId as objectId } from "mongoose"

export interface IDm {
    msgId: string,
    author: string,
    content: string,
    date: string,
    isLiked: boolean,
    isRead: boolean
}

export interface IUser {
    username: string,
    password: string,
    email: string,
    gender: string,
    bVersion: string,
    groups: objectId[],
    notifications: string[],
    directMsgs: IDm[],
    dmPeople: string[],
    strikes: string[] // Reasons for strikes
}

export const dmSchema = new Schema<IDm>({
    msgId: String,
    author: String,
    content: String,
    date: String,
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
        type: [ObjectId],
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

const User = models.User1 || model('User1', userSchema, 'users')

export default User