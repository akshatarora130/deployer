import express from "express"
import cors from "cors"
import {generateid} from "./generateid";
import simpleGit from "simple-git";
import path from "path"
import {generateFilePath} from "./generateFilePath";
import {upload} from "./uploadInS3";
//redis for queue
import {createClient} from "redis";

const publisher = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 11801
    }
});
publisher.connect().then(() => {
    app.listen(3000, () => {
        console.log("Server started");
    })
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy" , async (req , res)=>{
    const {url} = req.body;
    const id = generateid();
    await simpleGit().clone(url,path.join(__dirname,`/react/${id}`));
    const files:string [] = generateFilePath(path.join(__dirname,`/react/${id}`));
    for (const file of files) {
        await upload(file,file.slice(__dirname.length+1));
    }
    // await new Promise((res , rej)=>{
    //     setTimeout(res , 5000);
    // })
    await publisher.rPush("toBuildQueue" , id);
    res.json(id);
})

// testing