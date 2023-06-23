import { ObjectId } from 'mongodb'
import mongoose, { Schema, model, models } from 'mongoose'

export interface IGrpCreationReq {
	_id: ObjectId
	groupId: ObjectId
	name: string
	description: string
	tags: string[]
	date: Date
	isPrivate: boolean
	characters: string[]
	books: string[]
	groupAdmin: string
	groupAdminId: ObjectId
}

const grpCreationReqSchema = new Schema<IGrpCreationReq>({
	_id: mongoose.Schema.Types.ObjectId,
	groupId: {
		type: mongoose.Schema.Types.ObjectId,
		unique: true,
	},
	name: {
		type: String,
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
	date: {
		type: Date,
		required: true,
	},
	isPrivate: {
		type: Boolean,
		required: true,
	},
	characters: {
		type: [String],
		required: true,
	},
	books: {
		type: [String],
		required: true,
	},
	groupAdmin: {
		type: String,
		required: true,
	},
	groupAdminId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
})

export interface IUserReport {
	_id: ObjectId
	userId: ObjectId
	username: string
	gender: string
	strikes: string[]
	reason: string
	date: Date
}

const userReportSchema = new Schema<IUserReport>({
	_id: mongoose.Schema.Types.ObjectId,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	strikes: {
		type: [String],
		required: true,
	},
	reason: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
})

export interface IGroupReport {
	_id: ObjectId
	groupId: ObjectId
	name: string
	description: string
	tags: string[]
	characters: string[]
	books: string[]
	lastActive: Date
	memberCount: number
	groupAdmin: string
	reason: string
	date: Date
}

const groupReportSchema = new Schema<IGroupReport>({
	_id: mongoose.Schema.Types.ObjectId,
	groupId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	name: {
		type: String,
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
		required: true,
	},
	books: {
		type: [String],
		required: true,
	},
	lastActive: {
		type: Date,
		required: true,
	},
	memberCount: {
		type: Number,
		required: true,
	},
	groupAdmin: {
		type: String,
		required: true,
	},
	reason: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
})

export interface IAdmin {
	groupCreationRequests: IGrpCreationReq[]
	userReports: IUserReport[]
	groupReports: IGroupReport[]
}

const adminSchema = new Schema<IAdmin>({
	groupCreationRequests: {
		type: [grpCreationReqSchema],
		default: [],
	},
	userReports: {
		type: [userReportSchema],
		default: [],
	},
	groupReports: {
		type: [groupReportSchema],
		default: [],
	},
})

const Admin = models.Admin11 || model('Admin11', adminSchema, 'admin')

export default Admin
