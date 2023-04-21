import axios from "axios"
import { IUserState } from "../redux/userSlice"

export default async function getUser(email) {
    try {
        const res = await axios.get(`/api/getUser?email=${email}`)
        const user: IUserState = res.data
        if (user._id) {
            return user
        }
        throw new Error('could not get user')
    } catch(err) {
        console.log(err)
        return(err)
    }
}