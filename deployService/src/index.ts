import {commandOptions, createClient} from "redis";
import dotenv from "dotenv"
import {downloadS3Folder} from "./downloadS3Folder";
import {buildProject} from "./buildProject";
import {copyFinalDist} from "./uploadInS3";

dotenv.config();

const subscriber = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 11801
    }
});

subscriber.connect().then(() => {
    main();
});

const main = async () => {
    while(1){
        const res = await subscriber.blPop(
            commandOptions({ isolated: true }),
            'toBuildQueue',
            0
        );

        // @ts-ignore
        const id = res.element;
        console.log("Download started");
        await downloadS3Folder(`react/${id}`);
        console.log("Download completed");
        console.log("Started Building");
        await buildProject(id);
        console.log("Build Complete");
        await copyFinalDist(id);
        console.log("Upload completed");
    }
}
