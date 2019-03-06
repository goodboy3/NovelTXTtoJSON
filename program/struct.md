export interface NovelStruct
{
    info: NovelInfo;
    mainBody: Chapter[];
}
export interface NovelInfo
{
    id: string;
    author: string;
    name: string;
    category: string;
    recommendGender: string;
    totalChapterCount: number;
    keyWords: string[];
    coverUrl: string;
    introduction: string;
    lastUpdate: number;
    isFinish: boolean;
    totalReadCount: number;
}
export interface Chapter
{
    chapterCount:number,
    chapterName: string;
    content: string[];
}

//小说的结构
const novelStruct:NovelStruct = {
    info: {
        id: "",//id
        author: "",//作者
        name: "",//名称
        category: "",//分类
        recommendGender: "",//推荐阅读性别
        totalChapterCount:23,//总章节数
        keyWords:["","",""],//关键字
        coverUrl:"",//封面图片路径
        introduction:"",//简介
        lastUpdate: 2234234234234,//更新时间,时间戳
        isFinish: true,//是否完结,
        totalReadCount:0,
    },
    mainBody: [
        {
            chapterCount:1,
            chapterName: "",
            content: [
                "",
                "",
                "",
            ]
        },
        {
            chapterCount: 2,
            chapterName: "",
            content: [
                "",
                "",
                "",
            ]
        },
        {
            chapterCount: 3,
            chapterName: "",
            content: [
                "",
                "",
                "",
            ]
        }
    ]
}