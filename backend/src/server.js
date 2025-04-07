import app from "./app.js";
import mongoose from "mongoose"
import "dotenv/config";

const PORT = process.env.PORT;
const DB_URI= process.env.MONGO_CONNECTION_STRING;

mongoose
    .connect(DB_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        })
    })
    .catch(console.error);