import { Schema, model, models } from "mongoose"

// export interface IDate {
//     dateNow: string,
//     dateFormatted: string
// }

export interface IMsg {
    msgId: string,
    author: string,
    content: string,
    date: Number,
    likes: number,
    psgReference?: string
}

export interface IGroup {
    groupId: string,
    name: string,
    members: string[], // usernames 
    messages: IMsg[],
    isPrivate: boolean,
    summary: string,
    tags: string[],
    characters?: string[],
    books: string[],
    date: number
}

// export const dateSchema = new Schema<IDate>({
//     dateNow: String,
//     dateFormatted: String
// })

export const msgSchema = new Schema<IMsg>({
    msgId: String,
    author: String,
    content: String,
    date: Number,
    likes: Number,
    psgReference: {
        type: String,
        required: false
    }
})

const groupSchema = new Schema<IGroup>({
    groupId: {
        type: String,
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
        type: Number,
        required: true
    }
})

const Group = models.Group || model('Group', groupSchema, 'groups')

export default Group