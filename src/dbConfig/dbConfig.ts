import mongoose from "mongoose";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export async function connect(){
    try{
        await mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connected");
        })

        connection.on('error', (err)=>{
            console.log("Error connecting to MongoDB " + err);
            process.exit();
        })
    }
    catch(error){
        console.log("Error connecting to database");
        console.log(error);
        
    }
}