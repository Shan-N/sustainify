import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.URI!);
        const connection = await mongoose.connection;
        connection.on('connected', () =>{
            console.log('MongoDB connection established');
        });

        connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            process.exit();
        });

    } catch (error){
        console.error('Error connecting to MongoDB:', error);

    }    
}
