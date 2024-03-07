import {exec, spawn} from "child_process";
import path from "path";

export const buildProject = (id: string) => {
    return new Promise((resolve) => {
        const finalPath = path.join(__dirname, `react/${id}`);
        console.log(finalPath);
        const child = exec(`cd ${finalPath} && npm install && npm run build`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });

        child.on("close", () => {
            resolve("");
        })
    })
}