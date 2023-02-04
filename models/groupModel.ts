import { Schema, model, models } from "mongoose"

// export interface IDate {
//     dateNow: string,
//     dateFormatted: string
// }

interface IMessage {
    author: string,
    content: string,
    date: Date | number,
    likes: number,
    psgReference?: string
}

export interface IMsg {
    _id: string,
    author: string,
    content: string,
    date: Date | number,
    likes: number,
    psgReference?: string
}

interface IGrp {
    name: string,
    members: string[], // usernames 
    messages?: IMsg[],
    isPrivate: boolean,
    summary: string,
    tags: string[],
    characters?: string[],
    books: string[],
    date: Date | number,
    lastActive: Date | number,
    groupAdmin?: string | null
}

export interface IGroup extends IGrp {
    _id: string
}

// export const dateSchema = new Schema<IDate>({
//     dateNow: String,
//     dateFormatted: String
// })

export const msgSchema = new Schema<IMessage>({
    author: String,
    content: String,
    date: Date,
    likes: Number,
    psgReference: {
        type: String,
        required: false
    }
})

const groupSchema = new Schema<IGrp>({
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

const Group = models.Group || model('Group', groupSchema, 'groups')

export default Group