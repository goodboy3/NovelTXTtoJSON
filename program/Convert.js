"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Operator_1 = require("./Operator");
const fs_1 = __importDefault(require("fs"));
function Convert() {
    return __awaiter(this, void 0, void 0, function* () {
        let originDir = __dirname + "/../originTxt/";
        let distDir = __dirname + "/../distJson/";
        console.log(" ");
        let files = fs_1.default.readdirSync(originDir);
        let fileNames = [];
        fileNames = files.filter((v, i, arr) => {
            return v.search(".txt") != -1;
        });
        if (fileNames.length == 0) {
            console.log("->Error:", "未找到txt文件");
            return;
        }
        if (!fs_1.default.existsSync(originDir + fileNames[0])) {
            console.log("->Error:", "未找到", fileNames[0]);
            return;
        }
        console.log("->开始处理", fileNames[0]);
        let json = yield Operator_1.Operator.ConvertTxtToJson(originDir, fileNames[0]);
        if (!json) {
            console.log("->转换错误", fileNames[0]);
            return;
        }
        if (json.book.length < 20) {
            console.log("->转换错误", fileNames[0]);
            return;
        }
        let book = json.book;
        let content = json.content;
        //book存为book.json
        SaveJsonToFile(book, distDir, "book.json");
        //content保存
        for (let i = 0; i < content.length; i++) {
            SaveJsonToFile(content[i], distDir, i + ".json");
        }
        console.log("   -> ChapterCount:", book.length);
        console.log("->转换完成", fileNames[0]);
    });
}
function SaveJsonToFile(json, dirpath, name) {
    if (fs_1.default.existsSync(dirpath + name)) {
        fs_1.default.unlinkSync(dirpath + name);
    }
    fs_1.default.writeFileSync(dirpath + name, JSON.stringify(json));
}
Convert();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnZlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFzQztBQUN0Qyw0Q0FBb0I7QUFFcEIsU0FBZSxPQUFPOztRQUVsQixJQUFJLFNBQVMsR0FBRyxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7UUFDN0MsSUFBSSxPQUFPLEdBQUcsU0FBUyxHQUFHLGVBQWUsQ0FBQztRQUUxQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksS0FBSyxHQUFHLFlBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEMsSUFBSSxTQUFTLEdBQWEsRUFBRSxDQUFDO1FBQzdCLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxHQUFHLEVBQUUsRUFBRTtZQUVqQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUE7UUFDRixJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUN6QjtZQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3BDLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxZQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDNUM7WUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsT0FBTTtTQUNUO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxJQUFJLEdBQVEsTUFBTSxtQkFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsSUFBSSxFQUNUO1lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsT0FBTztTQUNWO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQ3pCO1lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsT0FBTztTQUNWO1FBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRTNCLGlCQUFpQjtRQUNqQixjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMzQyxXQUFXO1FBQ1gsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQ2hDO1lBQ0ksY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUFBO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBUyxFQUFFLE9BQWUsRUFBRSxJQUFZO0lBRTVELElBQUksWUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQ2pDO1FBQ0ksWUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDakM7SUFDRCxZQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sR0FBRyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFFRCxPQUFPLEVBQUUsQ0FBQyJ9