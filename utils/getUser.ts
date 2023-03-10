import axios from "axios"
import { IUser } from "../models/userModel"

export default async function getUser(email) {
    try {
        const res = await axios.get(`/api/getUser?email=${email}`)
        const user: IUser = res.data
        if (user._id) {
            return {
                username: user.username,
                bVersion: user.bVersion,
                groups: user.groups,
                notifications: user.notifications,
                dmPeople: user.dmPeople,
                strikes: user.strikes,
                directMsgs: user.directMsgs
            }
        }
        throw new Error('could not get user')
    } catch(err) {
        console.log(err)
        return(err)
    }
}