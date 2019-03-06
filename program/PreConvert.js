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
//获取文件列表
function PreConvert() {
    return __awaiter(this, void 0, void 0, function* () {
        let files = fs_1.default.readdirSync("./originTxt/");
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            let temp = files[i].split('.');
            fileNames.push(temp[0]);
        }
        console.log("开始进行预转换转换...");
        //将文件转换为json
        for (let i = 0; i < fileNames.length; i++) {
            console.log(" ");
            let count = yield Operator_1.Operator.PreConvertTxt("./originTxt/", fileNames[i] + ".txt", "./preConvertTxt/");
            console.log("   ->", "TotalLineCount:", count.lineCount);
            console.log("   ->", "TotalChapterCount:", count.chapterCount);
            console.log("->", fileNames[i] + ".txt", "转换完成", "(", i + 1, "/", fileNames.length, ")");
        }
        ;
    });
}
PreConvert();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJlQ29udmVydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlByZUNvbnZlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF1RDtBQUN2RCw0Q0FBb0I7QUFDcEIsUUFBUTtBQUNSLFNBQWUsVUFBVTs7UUFFckIsSUFBSSxLQUFLLEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzQyxJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQ3JDO1lBQ0ksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNCO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU1QixZQUFZO1FBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQ3pDO1lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixJQUFJLEtBQUssR0FBUSxNQUFNLG1CQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDekcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM1RjtRQUFBLENBQUM7SUFDTixDQUFDO0NBQUE7QUFFRCxVQUFVLEVBQUUsQ0FBQyJ9