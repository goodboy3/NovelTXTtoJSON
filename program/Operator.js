"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const jschardet_1 = __importDefault(require("jschardet"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const nzh_1 = __importDefault(require("nzh"));
const os_1 = __importDefault(require("os"));
const lineSymbol_1 = require("../lineSymbol");
class Operator {
    static IsStartSymbol(line) {
        for (let i = 0; i < Operator.startSymbol.length; i++) {
            if (line.search(Operator.startSymbol[i]) != -1) {
                return true;
            }
        }
        return false;
    }
    static IsFinishSymbol(line) {
        for (let i = 0; i < Operator.finishSymbol.length; i++) {
            if (line.search(Operator.finishSymbol[i]) != -1) {
                return true;
            }
        }
        return false;
    }
    static OneOfInTitle(line) {
        for (let i = 0; i < Operator.oneOfInTitle.length; i++) {
            if (line.search(Operator.oneOfInTitle[i]) != -1) {
                return true;
            }
        }
        return false;
    }
    static NotTitleLine(line) {
        for (let i = 0; i < Operator.notTitleLine.length; i++) {
            if (line.search(Operator.notTitleLine[i]) != -1) {
                return true;
            }
        }
        return false;
    }
    //判断此行是不是章节标题
    static IsAChapter(line) {
        if (
        //必要条件,全部满足
        (line.length <= 45 && //长度小于45个字符
            true)
            &&
                (!Operator.NotTitleLine(line))
            &&
                //可选条件,至少满足一个
                (Operator.OneOfInTitle(line))) {
            return true;
        }
        return false;
    }
    static CheckTxtFile(path) {
        return new Promise((res, rej) => {
            let str = fs_1.default.readFileSync(path);
            let result = jschardet_1.default.detect(str);
            if (result.encoding == 'GB2312') {
                console.log("--->", path, result.encoding, ">>> utf-8");
                let newStr = iconv_lite_1.default.decode(str, 'gbk');
                fs_1.default.writeFileSync(path, newStr, 'utf8');
            }
            let fRead = fs_1.default.createReadStream(path);
            let objReadLine = readline_1.default.createInterface({
                input: fRead
            });
            let lastTimeIsChapter = false;
            let lineNumber = 0; //行号
            let chapterCount = 0; //章节数
            objReadLine.on('line', (line) => {
                lineNumber++;
                //去掉空行
                if (line == "") {
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
                if (Operator.IsAChapter(line)) {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter) {
                        return;
                    }
                    lastTimeIsChapter = true;
                    chapterCount++;
                    for (let i = 0; i < Operator.oneOfInTitle.length; i++) {
                        if (line.search(Operator.oneOfInTitle[i]) != -1) {
                            line = line.match(Operator.oneOfInTitle[i])[0];
                            break;
                        }
                    }
                    let numStr = line.replace(/[^1234567890一二三四五六七八九十两百千万零]/ig, " ");
                    let temp = numStr.split(" ");
                    let numArr = temp.filter((v, i, arr) => {
                        return v != "";
                    });
                    let cNumStr = numArr[numArr.length - 1];
                    let cNum = 0;
                    if (cNumStr && cNumStr.search(/[^0-9]/) != -1) {
                        //是中文
                        cNum = Operator.nzhcn.decodeS(cNumStr);
                    }
                    else {
                        cNum = parseInt(cNumStr);
                    }
                    if (cNum != chapterCount) {
                        console.log("-->第", chapterCount, "章 缺失 请检查.", "line:", lineNumber);
                        chapterCount = cNum;
                    }
                }
                else {
                    if (lastTimeIsChapter) {
                        lastTimeIsChapter = false;
                    }
                }
            });
            objReadLine.on('close', () => {
                console.log("total line count", lineNumber);
                res();
            });
        });
    }
    static PreConvertTxt(fromPathDir, fileName, toPathDir) {
        return new Promise((res, rej) => {
            let path = fromPathDir + fileName;
            console.log("->开始处理", path);
            let needTransCode = false;
            //先读取256字节的数据,来判断编码格式
            let buf = Buffer.alloc(256);
            let fd = fs_1.default.openSync(path, 'r');
            fs_1.default.readSync(fd, buf, 0, buf.length, 0);
            let result = jschardet_1.default.detect(buf);
            if (result.encoding != 'UTF-8') {
                console.log("   ->", path, result.encoding, ">>> utf-8");
                needTransCode = true;
            }
            //创建读取流,并且如果有必要 就进行转码
            let fRead;
            if (needTransCode) {
                fRead = fs_1.default.createReadStream(path).pipe(iconv_lite_1.default.decodeStream('gbk'));
            }
            else {
                fRead = fs_1.default.createReadStream(path);
            }
            let objReadLine = readline_1.default.createInterface({
                input: fRead
            });
            //创建写入流
            let fWrite = fs_1.default.createWriteStream(toPathDir + fileName, 'utf8');
            let isStart = false;
            let isFinish = false;
            let lastTimeIsChapter = false;
            let isChapterStart = false;
            let lineCount = 0;
            let chapterCount = 0;
            objReadLine.on('line', (line) => {
                //如果已经结束,就直接返回
                if (isFinish == true) {
                    objReadLine.close();
                    return;
                }
                //去掉空行
                if (line == "") {
                    return;
                }
                //如果读到开始标记
                if (isStart == false && Operator.IsStartSymbol(line)) {
                    isStart = true;
                    return;
                }
                if (isStart == false) {
                    return;
                }
                //如果读到结束标记
                if (isStart && Operator.IsFinishSymbol(line)) {
                    isFinish = true;
                }
                //去掉一行的首尾空格
                line = line.replace(/(^\s*)|(\s*$)/g, ''); //收尾去掉空格
                //整行去掉 设定的字符
                for (let i = 0; i < Operator.ignoreLineContainStr.length; i++) {
                    if (line.search(Operator.ignoreLineContainStr[i]) != -1) {
                        return;
                    }
                }
                //替换掉设定的字符串
                for (let i = 0; i < Operator.replaceStr.length; i++) {
                    line = line.replace(Operator.replaceStr[i], '');
                }
                //去掉空行
                if (line == "") {
                    return;
                }
                //判断此行是不是章节标题
                if (Operator.IsAChapter(line)) {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter) {
                        return;
                    }
                    isChapterStart = true;
                    //如果是标题,则获取到标题中的数字
                    line = line.replace("两百", "二百");
                    line = line.replace("两千", "二千");
                    line = line.replace("两万", "二万");
                    //标题写入
                    fWrite.write(line + os_1.default.EOL);
                    lineCount++;
                    chapterCount++;
                    lastTimeIsChapter = true;
                    return;
                }
                if (isChapterStart) {
                    if (lastTimeIsChapter) {
                        lastTimeIsChapter = false;
                    }
                    //文本写入
                    fWrite.write("    " + line + os_1.default.EOL);
                    lineCount++;
                }
                return;
            });
            objReadLine.on('close', () => {
                res({ lineCount: lineCount, chapterCount: chapterCount });
            });
        });
    }
    static ConvertTxtToJson(fromPathDir, fileName) {
        return new Promise((res, rej) => {
            let path = fromPathDir + fileName;
            let needTransCode = false;
            //先读取256字节的数据,来判断编码格式
            let buf = Buffer.alloc(256);
            let fd = fs_1.default.openSync(path, 'r');
            fs_1.default.readSync(fd, buf, 0, buf.length, 0);
            let result = jschardet_1.default.detect(buf);
            if (result.encoding != 'UTF-8') {
                console.log("   ->", path, result.encoding, ">>> utf-8");
                needTransCode = true;
            }
            //创建读取流,并且如果有必要 就进行转码
            let fRead;
            if (needTransCode) {
                fRead = fs_1.default.createReadStream(path).pipe(iconv_lite_1.default.decodeStream('gbk'));
            }
            else {
                fRead = fs_1.default.createReadStream(path);
            }
            let objReadLine = readline_1.default.createInterface({
                input: fRead
            });
            //创建写入流
            //let fWrite = fs.createWriteStream(toPathDir + fileName, 'utf8')
            let isStart = false;
            let isFinish = false;
            let lastTimeIsChapter = false;
            let isChapterStart = false;
            let lineCount = 0;
            let chapterCount = 0;
            let bookJson = [];
            let contentJson = [];
            objReadLine.on('line', (line) => {
                //如果已经结束,就直接返回
                if (isFinish == true) {
                    objReadLine.close();
                    return;
                }
                //去掉空行
                if (line == "") {
                    return;
                }
                //如果读到开始标记
                if (isStart == false && Operator.IsStartSymbol(line)) {
                    isStart = true;
                    return;
                }
                if (isStart == false) {
                    return;
                }
                //如果读到结束标记
                if (isStart && Operator.IsFinishSymbol(line)) {
                    isFinish = true;
                }
                //去掉一行的首尾空格
                line = line.replace(/(^\s*)|(\s*$)/g, ''); //收尾去掉空格
                //整行去掉 设定的字符
                for (let i = 0; i < Operator.ignoreLineContainStr.length; i++) {
                    if (line.search(Operator.ignoreLineContainStr[i]) != -1) {
                        return;
                    }
                }
                //替换掉设定的字符串
                for (let i = 0; i < Operator.replaceStr.length; i++) {
                    line = line.replace(Operator.replaceStr[i], '');
                }
                //去掉空行
                if (line == "") {
                    return;
                }
                //判断此行是不是章节标题
                if (Operator.IsAChapter(line)) {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter) {
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
                    lastTimeIsChapter = true;
                    return;
                }
                if (isChapterStart) {
                    if (lastTimeIsChapter) {
                        lastTimeIsChapter = false;
                        contentJson.push([]);
                    }
                    //文本写入
                    //fWrite.write("    " + line + os.EOL);
                    contentJson[chapterCount - 1].push(line);
                    lineCount++;
                }
                return;
            });
            objReadLine.on('close', () => {
                res({ book: bookJson, content: contentJson });
                //res({ lineCount: lineCount, chapterCount: chapterCount });
            });
        });
    }
    static ReadFileToJson(path) {
        return new Promise((res, rej) => {
            let fRead = fs_1.default.createReadStream(path);
            let objReadLine = readline_1.default.createInterface({
                input: fRead
            });
            let json = {
                mainBody: []
            };
            let count = 1;
            let isStart = false;
            let isFinish = false;
            let lastTimeIsChapter = false;
            objReadLine.on('line', (line) => {
                //如果已经结束 就直接返回
                if (isFinish == true) {
                    return;
                }
                //去掉空行
                if (line == "") {
                    return;
                }
                //去掉一行的首尾空格
                line = line.replace(/(^\s*)|(\s*$)/g, ''); //收尾去掉空格
                //如果读到"章节内容开始" 就删除之前所有的内容
                if (line.search(/.*章节内容开始.*/) != -1) {
                    json.mainBody = [];
                    return;
                }
                //整行去掉 设定的字符
                for (let i = 0; i < Operator.ignoreLineContainStr.length; i++) {
                    if (line.search(Operator.ignoreLineContainStr[i]) != -1) {
                        return;
                    }
                }
                //替换掉设定的字符串
                for (let i = 0; i < Operator.replaceStr.length; i++) {
                    line = line.replace(Operator.replaceStr[i], '');
                }
                //判断此行是不是章节标题
                if (Operator.IsAChapter(line)) {
                    //如果上一行也是标题,则忽略此行
                    if (lastTimeIsChapter) {
                        return;
                    }
                    isStart = true;
                    json.mainBody.push({
                        chapterCount: count++,
                        chapterName: line,
                        content: [],
                    });
                    lastTimeIsChapter = true;
                    return;
                }
                if (isStart) {
                    if (lastTimeIsChapter) {
                        lastTimeIsChapter = false;
                    }
                    json.mainBody[count - 2].content.push(line);
                }
                return;
            });
            objReadLine.on('close', () => {
                res(json);
            });
        });
    }
}
Operator.nzhcn = nzh_1.default.cn;
//如果一行中含有这些字符串,就跳过此行
Operator.ignoreLineContainStr = lineSymbol_1.deleteLine;
//出现这些字符串就直接替换成'' 空串
Operator.replaceStr = lineSymbol_1.deleteString;
//开始标记
Operator.startSymbol = lineSymbol_1.startSymbol;
//结束标记
Operator.finishSymbol = lineSymbol_1.finishSymbol;
//标题中可能包含的字符串
Operator.oneOfInTitle = lineSymbol_1.titleLine;
//出现这些字符就不是标题
Operator.notTitleLine = lineSymbol_1.notTitleLine;
exports.Operator = Operator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3BlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJPcGVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRDQUFvQjtBQUNwQix3REFBZ0M7QUFDaEMsMERBQWtDO0FBQ2xDLDREQUErQjtBQUMvQiw4Q0FBc0I7QUFDdEIsNENBQW9CO0FBQ3BCLDhDQUF3RztBQU94RyxNQUFhLFFBQVE7SUFZakIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFZO1FBRTdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFDbkQ7WUFDSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxFQUM1QztnQkFDSSxPQUFPLElBQUksQ0FBQzthQUNmO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBSUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFZO1FBRTlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDckQ7WUFDSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUMvQztnQkFDSSxPQUFPLElBQUksQ0FBQzthQUNmO1NBQ0o7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBSUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFZO1FBRTVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFDckQ7WUFDSSxJQUFJLElBQUksQ0FBQyxNQUFNLENB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