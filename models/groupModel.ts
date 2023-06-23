import { ObjectId } from 'mongodb'
import mongoose, { Schema, model, models } from 'mongoose'

export interface IMessage {
	_id: string
	author: string
	authorId: ObjectId
	content: string
	date: Date | number
	likes: string[]
	psgReference?: string
	authorProfileImg: string
}

export interface IGroup {
	_id: ObjectId | null
	name: string
	members: string[]
	memberCount: number
	messages?: IMessage[]
	isPrivate: boolean
	description: string
	tags: string[]
	characters?: string[]
	books: string[]
	date: Date | number
	lastActive: Date | number
	groupAdmin?: string | null
	membersWithGroupMuted: string[]
	password?: ObjectId | null
}

export const msgSchema = new Schema<IMessage>({
	author: String,
	authorId: mongoose.Schema.Types.ObjectId,
	content: String,
	date: Date,
	likes: [String],
	psgReference: {
		type: String,
		required: false,
	},
	authorProfileImg: {
		type: String,
		required: false,
	},
})

const groupSchema = new Schema<IGroup>({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	members: {
		type: [String],
		required: true,
	},
	memberCount: {
		type: Number,
		required: true,
		default: 0,
	},
	messages: {
		type: [msgSchema],
		required: true,
	},
	isPrivate: {
		type: Boolean,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	tags: {
		type: [String],
		required: true,
	},
	characters: {
		type: [String],
		required: false,
	},
	books: {
		type: [String],
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	lastActive: {
		type: Date,
		required: true,
	},
	groupAdmin: {
		type: String,
		required: false,
	},
	membersWithGroupMuted: {
		type: [String],
		required: false,
	},
	password: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		unique: true,
	},
})

const Group = models.Group8 || model('Group8', groupSchema, 'groups')

export default Group
