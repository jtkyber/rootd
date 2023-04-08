import mongoose, { Schema, model, models } from "mongoose"
import { ObjectId } from "mongodb"

export interface IMessage {
    _id: string
    author: string
    authorId: ObjectId
    content: string
    date: Date | number
    likes: string[]
    psgReference?: string
}


export interface IGroup {
    _id: ObjectId | null
    name: string
    members: string[]
    memberCount: number
    messages?: IMessage[]
    isPrivate: boolean
    summary: string
    tags: string[]
    characters?: string[]
    books: string[]
    date: Date | number
    lastActive: Date | number
    groupAdmin?: string | null
}

export const msgSchema = new Schema<IMessage>({
    author: String,
    authorId: mongoose.Schema.Types.ObjectId,
    content: String,
    date: Date,
    likes: [String],
    psgReference: {
        type: String,
        required: false
    }
})

const groupSchema = new Schema<IGroup>({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    memberCount: {
        type: Number,
        required: true,
        default: 0
    },
    messages: {
        type: [msgSchema],
        required: true
    },
    isPrivate: {
        type: Boolean,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    characters: {
        type: [String],
        required: false
    },
    books: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    lastActive: {
        type: Date,
        required: true
    },
    groupAdmin: {
        type: String,
        required: false
    }
})

const Group = models.Group4 || model('Group4', groupSchema, 'groups')

export default Group