//#####删除以下字符#####
//以下字符出现,会替换成空字符
export const deleteString =
    [
        /【.*13800100.*】/,
        /【.*13800100.*看书网”$/,
        /【.*13800100.*看书网$/,
    ]

//#####出现以下字符整行删除#####
//以下字符出现,会删除整行
export const deleteLine = [
    "分节阅读",
    "----------",
    "看无广告，全文字无错首发小说",
    /^【.*】$/,//正则表达式 忽略【XXXXXXXXXXX】 以【开头  以】结尾 的行
    "www.13800100.Com文字首发/files/article/info/2237/www.13800100.Com文字首发《无良房东俏佳人》",
    "频道177855",
    /^……第[0-9]{1,6}章.*……$/,
    "微信公众号",
]

//#####以下字符出现,可能是标题#####
//以下字符出现,判断可能是章节标题
export const titleLine = [
    /第[1234567890一二三四五六七八九十两百千万零oO ]{1,10}[集章节： ]/,
    /^【[0123456789-]{0,8}】/,
    /^[IVX0123456789]{1,5}[章:： ]{0,1}.{2,20}$/,
    /^[一二三四五六七八九十两百千万零]{1,8}[ 、].{2,20}$/,
    /^章[1234567890一二三四五六七八九十两百千万零].{2,20}/,
    /^章 [一二三四五六七八九十两百千万零]{1,10}.{2,20}/,
]

//#####以下字符出现,不是标题#####
//以下字符出现,判断不是标题
export const notTitleLine = [
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
]

//#####开始标记#####
//以下字符出现,采集开始
export const startSymbol = [
    /.*章节内容开始.*/,
    "------------"
]

//#####结束标记#####
//以下字符出现,采集结束
export const finishSymbol = [
    /.*『还在连载中...』.*/,
    /.{0,5}已完结.{0,5}/,
    /全书完/
]