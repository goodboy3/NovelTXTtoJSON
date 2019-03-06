"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//#####删除以下字符#####
//以下字符出现,会替换成空字符
exports.deleteString = [
    /【.*13800100.*】/,
    /【.*13800100.*看书网”$/,
    /【.*13800100.*看书网$/,
];
//#####出现以下字符整行删除#####
//以下字符出现,会删除整行
exports.deleteLine = [
    "分节阅读",
    "----------",
    "看无广告，全文字无错首发小说",
    /^【.*】$/,
    "www.13800100.Com文字首发/files/article/info/2237/www.13800100.Com文字首发《无良房东俏佳人》",
    "频道177855",
    /^……第[0-9]{1,6}章.*……$/,
    "微信公众号",
];
//#####以下字符出现,可能是标题#####
//以下字符出现,判断可能是章节标题
exports.titleLine = [
    /第[1234567890一二三四五六七八九十两百千万零oO ]{1,10}[集章节： ]/,
    /^【[0123456789-]{0,8}】/,
    /^[IVX0123456789]{1,5}[章:： ]{0,1}.{2,20}$/,
    /^[一二三四五六七八九十两百千万零]{1,8}[ 、].{2,20}$/,
    /^章[1234567890一二三四五六七八九十两百千万零].{2,20}/,
    /^章 [一二三四五六七八九十两百千万零]{1,10}.{2,20}/,
];
//#####以下字符出现,不是标题#####
//以下字符出现,判断不是标题
exports.notTitleLine = [
    /^.{0,3}ps/i,
    /^“.*”$/,
    "一、二、三、",
    /.{1,6}第.{1,6}节.{1,6}课/,
    /[0-9]{1,4}月[0-9]{1,4}[日号]/,
    /[0-9]{1,4}：[0-9]{1,4}/,
    /^6峰/,
    /^6为民/,
    "10万以",
    /[0-9]{1,8}，[0-9]{1,8}，[0-9]{1,8}/,
    "100银币",
    /[0-9]{1,10}[年级秒]/,
    /[0-9]{1,4}点[0-9]{1,4}分/,
    /^[0-9]{4,8}$/,
    /[0-9]{1,8}分钟/,
    /[0-9]{1,5}%/
];
//#####开始标记#####
//以下字符出现,采集开始
exports.startSymbol = [
    /.*章节内容开始.*/,
    "------------"
];
//#####结束标记#####
//以下字符出现,采集结束
exports.finishSymbol = [
    /.*『还在连载中...』.*/,
    /.{0,5}已完结.{0,5}/,
    /全书完/
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZVN5bWJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpbmVTeW1ib2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ0gsUUFBQSxZQUFZLEdBQ3JCO0lBQ0ksZ0JBQWdCO0lBQ2hCLG9CQUFvQjtJQUNwQixtQkFBbUI7Q0FDdEIsQ0FBQTtBQUVMLHNCQUFzQjtBQUN0QixjQUFjO0FBQ0QsUUFBQSxVQUFVLEdBQUc7SUFDdEIsTUFBTTtJQUNOLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsUUFBUTtJQUNSLDRFQUE0RTtJQUM1RSxVQUFVO0lBQ1Ysc0JBQXNCO0lBQ3RCLE9BQU87Q0FDVixDQUFBO0FBRUQsd0JBQXdCO0FBQ3hCLGtCQUFrQjtBQUNMLFFBQUEsU0FBUyxHQUFHO0lBQ3JCLDhDQUE4QztJQUM5Qyx1QkFBdUI7SUFDdkIsMENBQTBDO0lBQzFDLHFDQUFxQztJQUNyQyxzQ0FBc0M7SUFDdEMsbUNBQW1DO0NBQ3RDLENBQUE7QUFFRCx1QkFBdUI7QUFDdkIsZUFBZTtBQUNGLFFBQUEsWUFBWSxHQUFHO0lBQ3hCLFlBQVk7SUFDWixRQUFRO0lBQ1IsUUFBUTtJQUNSLHVCQUF1QjtJQUN2QiwyQkFBMkI7SUFDM0IsdUJBQXVCO0lBQ3ZCLEtBQUs7SUFDTCxNQUFNO0lBQ04sTUFBTTtJQUNOLGtDQUFrQztJQUNsQyxPQUFPO0lBQ1Asa0JBQWtCO0lBQ2xCLHdCQUF3QjtJQUN4QixjQUFjO0lBQ2QsY0FBYztJQUNkLGFBQWE7Q0FDaEIsQ0FBQTtBQUVELGdCQUFnQjtBQUNoQixhQUFhO0FBQ0EsUUFBQSxXQUFXLEdBQUc7SUFDdkIsWUFBWTtJQUNaLGNBQWM7Q0FDakIsQ0FBQTtBQUVELGdCQUFnQjtBQUNoQixhQUFhO0FBQ0EsUUFBQSxZQUFZLEdBQUc7SUFDeEIsZ0JBQWdCO0lBQ2hCLGlCQUFpQjtJQUNqQixLQUFLO0NBQ1IsQ0FBQSJ9