import { ObjectId } from 'mongodb'
import mongoose, { Schema, model, models } from 'mongoose'

export interface IDm {
	_id: ObjectId
	content: string
	authorId: ObjectId
	date: Date | number
	isLiked: boolean
	isRead: boolean
	author: string
	authorProfileImg: string
}

export interface IAllDms {
	[key: string]: IDm[]
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
	readDate: Date | number
	group?: INotifGroup
	msgId?: ObjectId
	likers?: string[]
	likerId?: ObjectId
	groupName?: string
	inviter?: string
	reason?: string
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
	directMsgs: IAllDms
	strikes: string[] // Reasons for strikes
	currentGroup: string | null
	lastSeenMsgs?: ILastSeenMsg[]
	currentDmPerson: string | null
	isAdmin: boolean
	darkMode: boolean
}

export interface ILastSeenMsg {
	msgId: ObjectId
	groupId: ObjectId
}

const dmSchema = new Schema<IDm>({
	_id: mongoose.Schema.Types.ObjectId,
	content: String,
	authorId: mongoose.Schema.Types.ObjectId,
	date: Date,
	isLiked: {
		type: Boolean,
		default: false,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	author: String,
	authorProfileImg: {
		type: String,
		required: false,
	},
})

const notifGroupSchema = new Schema<INotifGroup>({
	id: mongoose.Schema.Types.ObjectId,
	name: String,
})

const lastSeenMsgSchema = new Schema<ILastSeenMsg>({
	msgId: mongoose.Schema.Types.ObjectId,
	groupId: mongoose.Schema.Types.ObjectId,
})

export const notificationSchema = new Schema<INotification>({
	_id: mongoose.Schema.Types.ObjectId,
	content: String,
	date: Date,
	readDate: Date,
	notificationType: String,
	group: notifGroupSchema,
	msgId: ObjectId,
	likers: [String],
	likerId: mongoose.Schema.Types.ObjectId,
	read: {
		type: Boolean,
		default: false,
	},
	groupName: String,
	inviter: String,
	reason: String,
})

const userSchema = new Schema<IUser>({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	gender: {
		type: String,
		required: true,
	},
	bVersion: {
		type: String,
		required: true,
	},
	groups: {
		type: [ObjectId],
		required: false,
	},
	notifications: {
		type: [notificationSchema],
		required: false,
	},
	directMsgs: {
		type: Map,
		of: [dmSchema],
		default: {},
	},
	strikes: {
		type: [String],
		required: false,
	},
	currentGroup: {
		type: String || null,
		default: null,
	},
	lastSeenMsgs: [lastSeenMsgSchema],
	currentDmPerson: {
		type: String || null,
		default: null,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
	darkMode: {
		type: Boolean,
		default: false,
	},
})

const User = models.User32 || model('User32', userSchema, 'users')

export default User
