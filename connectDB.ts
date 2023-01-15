import mongoose from "mongoose";

const connectMongo = async () => {
    if (process.env.MONGODB_URI)
    {
        mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: true
        })
    }
}

export default connectMongo;