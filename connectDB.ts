import mongoose from "mongoose";

const connectMongo = async () => {
    if (process.env.MONGODB_URI)
    {
        mongoose.set('strictQuery', true);
        const success = mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: true
        })
        console.log(success)
    }
}

export default connectMongo;