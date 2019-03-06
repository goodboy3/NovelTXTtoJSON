import { Operator, PreConverOutput } from "./Operator";
import fs from 'fs';
//获取文件列表
async function PreConvert()
{
    let files = fs.readdirSync("./originTxt/");
    let fileNames: string[] = [];
    for (let i = 0; i < files.length; i++)
    {
        let temp = files[i].split('.');
        fileNames.push(temp[0]);
    }

    console.log("开始进行预转换转换...");

    //将文件转换为json
    for (let i = 0; i < fileNames.length; i++)
    {
        console.log(" ");
        let count: any = await Operator.PreConvertTxt("./originTxt/", fileNames[i] + ".txt", "./preConvertTxt/");
        console.log("   ->", "TotalLineCount:", count.lineCount);
        console.log("   ->", "TotalChapterCount:", count.chapterCount);
        console.log("->", fileNames[i] + ".txt", "转换完成", "(", i + 1, "/", fileNames.length, ")");
    };
}

PreConvert();