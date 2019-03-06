import fs from 'fs';
import readline from 'readline';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';
import Nzh from 'nzh';
import os from 'os';
import { deleteString,deleteLine,titleLine, startSymbol,finishSymbol,notTitleLine } from '../lineSymbol'

export interface PreConverOutput
{
    lineCount: number;
    chapterCount:number
}
export class Operator
{
    static nzhcn = Nzh.cn;

    //如果一行中含有这些字符串,就跳过此行
    static ignoreLineContainStr: any[] = deleteLine;

    //出现这些字符串就直接替换成'' 空串
    static replaceStr: any[] = deleteString;

    //开始标记
    static startSymbol: any[] = startSymbol;
    static IsStartSymbol(line: string)
    {
        for (let i = 0; i < Operator.startSymbol.length;i++)
        {
            if (line.search(Operator.startSymbol[i])!=-1)
            {
                return true;
            }
        }
        return false;
    }
    
    //结束标记
    static finishSymbol: any[] = finishSymbol;
    static IsFinishSymbol(line: string)
    {
        for (let i = 0; i < Operator.finishSymbol.length; i++)
        {
            if (line.search(Operator.finishSymbol[i]) != -1)
            {
                return true;
            }
        }
        return false;
    }

    //标题中可能包含的字符串
    static oneOfInTitle: any[] = titleLine;
    static OneOfInTitle(line: string)
    {
        for (let i = 0; i < Operator.oneOfInTitle.length; i++)
        {
            if (line.search(Operator.oneOfInTitle[i]) != -1) 
            {
                return true;
            }
        }
        return false;
    }

    //出现这些字符就不是标题
    static notTitleLine: any[] = notTitleLine;
    static NotTitleLine(line: string)
    {
        for(let i=0;i<Operator.notTitleLine.length;i++)
        {
            if (line.search(Operator.notTitleLine[i])!=-1) {
                return true;
            }
        }
        return false;
    }

    //判断此行是不是章节标题
    static IsAChapter(line: string)
    {
        if (
            //必要条件,全部满足
            (
                line.length <= 45 &&//长度小于45个字符
                true 
            )
            &&
            (
                !Operator.NotTitleLine(line)
            )
            &&
            //可选条件,至少满足一个
            (
                Operator.OneOfInTitle(line)
            )) 
        {
            return true;
        }
        return false;
    }


    static CheckTxtFile(path)
    {
        return new Promise((res, rej) =>
        {
            let str = fs.readFileSync(path);
            let result = jschardet.detect(str);
            if (result.encoding == 'GB2312')
            {
                console.log("--->", path, result.encoding, ">>> utf-8");

                let newStr = iconv.decode(str, 'gbk');
                fs.writeFileSync(path, newStr, 'utf8');
            }

            let fRead = fs.createReadStream(path);
            let objReadLine = readline.createInterface({
                input: fRead
            });
            let lastTimeIsChapter = false
            let lineNumber = 0;//行号
            let chapterCount = 0;//章节数
            objReadLine.on('line', (line) =>
            {
                lineNumber++;

                //去掉空行
                if (line == "") 
                {
                    return;
                }

                // //去掉一行的首尾空格
                // line = line.replace(/(^\s*)|(\s*$)/g, '');//收尾去掉空格

                // //整行去掉 设定的字符
                // for (let i = 0; i < Operator.ignoreLineContainStr.length; i++)
                // {
                //     if (line.search(Operator.ignoreLineContainStr[i]) != -1) 
                //     {
                //         return;
                //     }
                // }

                // //替换掉设定的字符串
                // for (let i = 0; i < Operator.replaceStr.length; i++)
                // {
                //     line = line.replace(Operator.replaceStr[i], '');
                // }

                //判断此行是不是章节标题
                if (Operator.IsAChapter(line))
                {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter)
                    {
                        return;
                    }
                    lastTimeIsChapter = true;
                    chapterCount++;
                    
                    for (let i = 0; i < Operator.oneOfInTitle.length; i++)
                    {
                        if (line.search(Operator.oneOfInTitle[i]) != -1) 
                        {
                            line = line.match(Operator.oneOfInTitle[i])[0];
                            break;
                        }
                    }

                    let numStr = line.replace(/[^1234567890一二三四五六七八九十两百千万零]/ig, " ")
                    let temp = numStr.split(" ");
                    let numArr = temp.filter((v, i, arr) =>
                    {
                        return v != ""
                    })
                    let cNumStr = numArr[numArr.length - 1];
                    let cNum = 0;
                    if (cNumStr && cNumStr.search(/[^0-9]/) != -1)
                    {
                        //是中文
                        cNum = Operator.nzhcn.decodeS(cNumStr)
                    }
                    else
                    {
                        cNum = parseInt(cNumStr)
                    }

                    if (cNum != chapterCount) 
                    {
                        console.log("-->第", chapterCount, "章 缺失 请检查.", "line:", lineNumber);
                        chapterCount = cNum;
                    }

                }
                else
                {
                    if (lastTimeIsChapter)
                    {
                        lastTimeIsChapter = false;
                    }
                }
            })
            objReadLine.on('close', () =>
            {
                console.log("total line count", lineNumber);
                res();
            })
        })

    }

    static PreConvertTxt(fromPathDir:string,fileName:string,toPathDir:string)
    {
        return new Promise((res, rej) =>
        {
            let path = fromPathDir + fileName;
            console.log("->开始处理",path);
            
            let needTransCode: boolean = false;
            //先读取256字节的数据,来判断编码格式
            let buf = Buffer.alloc(256);
            let fd = fs.openSync(path, 'r');
            fs.readSync(fd, buf,0, buf.length, 0);
            let result = jschardet.detect(buf);
            if (result.encoding != 'UTF-8')
            {
                console.log("   ->", path, result.encoding, ">>> utf-8");
                needTransCode = true;
            }

            //创建读取流,并且如果有必要 就进行转码
            let fRead;
            if (needTransCode) {
                fRead = fs.createReadStream(path).pipe(iconv.decodeStream('gbk'));
            }
            else
            {
                fRead = fs.createReadStream(path);
            }
            
            let objReadLine = readline.createInterface({
                input: fRead
            });

            //创建写入流
            let fWrite = fs.createWriteStream(toPathDir+fileName,'utf8')

            let isStart = false;
            let isFinish = false;
            let lastTimeIsChapter: boolean = false;
            let isChapterStart: boolean = false;
            
            let lineCount = 0;
            let chapterCount = 0;
            objReadLine.on('line', (line) =>
            {
                //如果已经结束,就直接返回
                if (isFinish == true) 
                {
                    objReadLine.close();
                    return;
                }


                //去掉空行
                if (line == "") 
                {
                    return;
                }

                //如果读到开始标记
                if (isStart==false&&Operator.IsStartSymbol(line)) 
                {
                    isStart = true;
                    return;
                }

                if (isStart == false) 
                {
                    return;
                }

                //如果读到结束标记
                if (isStart && Operator.IsFinishSymbol(line)) 
                {
                    isFinish = true;
                }

                //去掉一行的首尾空格
                line = line.replace(/(^\s*)|(\s*$)/g, '');//收尾去掉空格

                //整行去掉 设定的字符
                for (let i = 0; i < Operator.ignoreLineContainStr.length; i++)
                {
                    if (line.search(Operator.ignoreLineContainStr[i]) != -1) 
                    {
                        return;
                    }
                }

                //替换掉设定的字符串
                for (let i = 0; i < Operator.replaceStr.length; i++)
                {
                    line = line.replace(Operator.replaceStr[i], '');
                }

                //去掉空行
                if (line == "") 
                {
                    return;
                }

                //判断此行是不是章节标题
                if (Operator.IsAChapter(line))
                {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter)
                    {
                        return;
                    }
                    isChapterStart = true;
                    //如果是标题,则获取到标题中的数字
                    line = line.replace("两百", "二百");
                    line = line.replace("两千", "二千");
                    line = line.replace("两万", "二万");

                    //标题写入
                    fWrite.write(line+os.EOL);
                    lineCount++;
                    chapterCount++;

                    lastTimeIsChapter = true
                    return;
                }

                if (isChapterStart)
                {
                    if (lastTimeIsChapter)
                    {
                        lastTimeIsChapter = false;
                    }
                    //文本写入
                    fWrite.write("    " + line + os.EOL);
                    lineCount++;
                }

                return;
            })

            objReadLine.on('close', () =>
            {
                res({ lineCount:lineCount, chapterCount:chapterCount });
            })

        })
    }

    static ConvertTxtToJson(fromPathDir: string, fileName: string)
    {
        return new Promise((res, rej) =>
        {
            let path = fromPathDir + fileName;

            let needTransCode: boolean = false;
            //先读取256字节的数据,来判断编码格式
            let buf = Buffer.alloc(256);
            let fd = fs.openSync(path, 'r');
            fs.readSync(fd, buf, 0, buf.length, 0);
            let result = jschardet.detect(buf);
            if (result.encoding != 'UTF-8')
            {
                console.log("   ->", path, result.encoding, ">>> utf-8");
                needTransCode = true;
            }

            //创建读取流,并且如果有必要 就进行转码
            let fRead;
            if (needTransCode)
            {
                fRead = fs.createReadStream(path).pipe(iconv.decodeStream('gbk'));
            }
            else
            {
                fRead = fs.createReadStream(path);
            }

            let objReadLine = readline.createInterface({
                input: fRead
            });

            //创建写入流
            //let fWrite = fs.createWriteStream(toPathDir + fileName, 'utf8')

            let isStart = false;
            let isFinish = false;
            let lastTimeIsChapter: boolean = false;
            let isChapterStart: boolean = false;

            let lineCount = 0;
            let chapterCount = 0;

            let bookJson = [];
            let contentJson = [];
            objReadLine.on('line', (line) =>
            {
                //如果已经结束,就直接返回
                if (isFinish == true) 
                {
                    objReadLine.close();
                    return;
                }


                //去掉空行
                if (line == "") 
                {
                    return;
                }

                //如果读到开始标记
                if (isStart == false && Operator.IsStartSymbol(line)) 
                {
                    isStart = true;
                    return;
                }

                if (isStart == false) 
                {
                    return;
                }

                //如果读到结束标记
                if (isStart && Operator.IsFinishSymbol(line)) 
                {
                    isFinish = true;
                }

                //去掉一行的首尾空格
                line = line.replace(/(^\s*)|(\s*$)/g, '');//收尾去掉空格

                //整行去掉 设定的字符
                for (let i = 0; i < Operator.ignoreLineContainStr.length; i++)
                {
                    if (line.search(Operator.ignoreLineContainStr[i]) != -1) 
                    {
                        return;
                    }
                }

                //替换掉设定的字符串
                for (let i = 0; i < Operator.replaceStr.length; i++)
                {
                    line = line.replace(Operator.replaceStr[i], '');
                }

                //去掉空行
                if (line == "") 
                {
                    return;
                }

                //判断此行是不是章节标题
                if (Operator.IsAChapter(line))
                {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter)
                    {
                        return;
                    }
                    isChapterStart = true;
                    //如果是标题,则获取到标题中的数字
                    line = line.replace("两百", "二百");
                    line = line.replace("两千", "二千");
                    line = line.replace("两万", "二万");

                    //标题写入
                    //fWrite.write(line + os.EOL);
                    bookJson.push(line);
                    lineCount++;
                    chapterCount++;

                    lastTimeIsChapter = true
                    return;
                }

                if (isChapterStart)
                {
                    if (lastTimeIsChapter)
                    {
                        lastTimeIsChapter = false;
                        contentJson.push([]);
                    }
                    //文本写入
                    //fWrite.write("    " + line + os.EOL);
                    contentJson[chapterCount - 1].push(line);
                    lineCount++;
                }

                return;
            })

            objReadLine.on('close', () =>
            {
                res({book:bookJson,content:contentJson})
                //res({ lineCount: lineCount, chapterCount: chapterCount });
            })

        })
    }

    static ReadFileToJson(path)
    {
        return new Promise((res, rej) =>
        {
            let fRead = fs.createReadStream(path);
            let objReadLine = readline.createInterface({
                input: fRead
            });

            let json = {
                mainBody: []
            };
            let count = 1;
            let isStart = false;
            let isFinish = false;
            let lastTimeIsChapter: boolean = false;
            objReadLine.on('line', (line) =>
            {
                //如果已经结束 就直接返回
                if (isFinish == true) 
                {
                    return;    
                }

                //去掉空行
                if (line == "") 
                {
                    return;
                }

                //去掉一行的首尾空格
                line = line.replace(/(^\s*)|(\s*$)/g, '');//收尾去掉空格

                //如果读到"章节内容开始" 就删除之前所有的内容
                if (line.search(/.*章节内容开始.*/) != -1) 
                {
                    json.mainBody = [];
                    return;
                }


                //整行去掉 设定的字符
                for (let i = 0; i < Operator.ignoreLineContainStr.length; i++)
                {
                    if (line.search(Operator.ignoreLineContainStr[i]) != -1) 
                    {
                        return;
                    }
                }

                //替换掉设定的字符串
                for (let i = 0; i < Operator.replaceStr.length; i++)
                {
                    line = line.replace(Operator.replaceStr[i], '');
                }


                //判断此行是不是章节标题
                if (Operator.IsAChapter(line))
                {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter)
                    {
                        return;
                    }
                    isStart = true;
                    json.mainBody.push({
                        chapterCount: count++,
                        chapterName: line,
                        content: [],
                    });
                    lastTimeIsChapter = true
                    return;
                }

                if (isStart)
                {
                    if (lastTimeIsChapter)
                    {
                        lastTimeIsChapter = false;
                    }
                    json.mainBody[count - 2].content.push(line);
                }

                return;
            })

            objReadLine.on('close', () =>
            {
                res(json);
            })
        })
    }


}




