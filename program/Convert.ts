import { Operator } from "./Operator";
import fs from 'fs';

async function Convert()
{
    let originDir = __dirname + "/../originTxt/";
    let distDir = __dirname + "/../distJson/";

    console.log(" ");
    let files = fs.readdirSync(originDir);
    let fileNames: string[] = [];
    fileNames = files.filter((v,i,arr) =>
    {
        return v.search(".txt") != -1;
    })
    if (fileNames.length == 0) 
    {
        console.log("->Error:", "未找到txt文件");
        return;    
    }
    if (!fs.existsSync(originDir + fileNames[0]))
    {
        console.log("->Error:", "未找到", fileNames[0]);
        return
    }

    console.log("->开始处理", fileNames[0]);
    let json: any = await Operator.ConvertTxtToJson(originDir, fileNames[0]);
    
    if (!json)
    {
        console.log("->转换错误", fileNames[0]);
        return;
    }

    if (json.book.length < 20)
    {
        console.log("->转换错误", fileNames[0]);
        return;
    }

    let book = json.book;
    let content = json.content;

    //book存为book.json
    SaveJsonToFile(book, distDir, "book.json");
    //content保存
    for(let i=0;i<content.length;i++)
    {
        SaveJsonToFile(content[i], distDir, i+".json");
    }
    console.log("   -> ChapterCount:", book.length);
    console.log("->转换完成", fileNames[0]);
}

function SaveJsonToFile(json: any, dirpath: string, name: string)
{
    if (fs.existsSync(dirpath + name)) 
    {
        fs.unlinkSync(dirpath + name);
    }
    fs.writeFileSync(dirpath + name, JSON.stringify(json));
}

Convert();

