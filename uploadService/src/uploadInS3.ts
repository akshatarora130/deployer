import {S3} from "aws-sdk"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config();

const s3:S3 = new S3(
    {
        accessKeyId:process.env.AWS_ACESSKEY,
        secretAccessKey:process.env.AWS_SECRETKEY
    }
)

export const upload= async (filePath:string , fileName:string)=>{
    const fileContent= fs.readFileSync(filePath);
    const upl = await s3.upload(
        {
            Body: fileContent,
            Bucket: `depreact`,
            Key: fileName
        }
    ).promise()
    console.log(upl);
}

