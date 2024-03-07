import {S3} from "aws-sdk";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.AWS_ACESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
})

export const downloadS3Folder = async (prefix: string) => {
    const allFiles = await s3.listObjectsV2({
        Bucket: "depreact",
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if(!Key){
                resolve("");
                return;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive: true });
            }
            s3.getObject({
                Bucket: "depreact",
                Key: Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })

        })
    }) || []

    await Promise.all(allPromises?.filter(x => x != undefined));
}