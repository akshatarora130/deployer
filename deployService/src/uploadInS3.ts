import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import {S3} from "aws-sdk";

dotenv.config();

const s3 = new S3({
    accessKeyId: process.env.AWS_ACESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
})

export const copyFinalDist = (id: string) => {
    const folderPath = path.join(__dirname, `react/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "depreact",
        Key: fileName,
    }).promise();
}