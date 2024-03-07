import fs from "fs";
import path from "path";

export const generateFilePath=(folderPath:string):string[]=>{
    let arr:string [] = [];
    const allFilesAndFolder:string [] = fs.readdirSync(
        folderPath
    )
    allFilesAndFolder.forEach((files:string)=>{
        const fullFilePath = path.join(folderPath,files);
        if(fs.statSync(fullFilePath).isDirectory()){
            arr = arr.concat(generateFilePath(fullFilePath));
        }
        else{
            arr.push(fullFilePath);
        }
    })
    return arr;
}