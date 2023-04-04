import { ObjectId } from "mongodb"
import mongoose, { Schema, model, models } from "mongoose"

export interface IDm {
    author: string
    content: string
    date: Date | number
    isLiked: boolean
    isRead: boolean
}

interface INotifGroup {
    id: ObjectId
    name: string
}

export interface INotification {
    _id: ObjectId
    content: string
    date: Date | number
    notificationType: string
    read?: boolean
    group?: INotifGroup
    msgId?: ObjectId
    likers?: string[]
    groupName?: string
}

export interface IUser {
    _id: ObjectId
    username: string
    password: string
    email: string
    gender: string
    bVersion: string
    groups: string[]
    notifications: INotification[]
    directMsgs: IDm[]
    dmPeople: string[]
    strikes: string[] // Reasons for strikes
    currentGroup: string | null
    lastSeenMsgs?: ILastSeenMsg[]
}

export interface ILastSeenMsg {
    msgId: ObjectId
    groupId: ObjectId
}

const dmSchema = new Schema<IDm>({
    author: String,
    content: String,
    date: Date,
    isLiked: {
        type: Boolean,
        default: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
})

const notifGroupSchema = new Schema<INotifGroup>({
    id: mongoose.Schema.Types.ObjectId,
    name: String
})

const lastSeenMsgSchema = new Schema<ILastSeenMsg>({
    msgId: mongoose.Schema.Types.ObjectId,
    groupId: mongoose.Schema.Types.ObjectId
})

export const notificationSchema = new Schema<INotification>({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    date: Date,
    notificationType: String,
    group: notifGroupSchema,
    msgId: ObjectId,
    likers: [String],
    read: {
        type: Boolean,
        default: false
    },
    groupName: String
})

const userSchema = new Schema<IUser>({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    } ,
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
        type: [notificationSchema],
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
    },
    currentGroup: {
        type: String || null,
        default: null,
    },
    lastSeenMsgs: [lastSeenMsgSchema]
})

const User = models.User15 || model('User15', userSchema, 'users')

export default User