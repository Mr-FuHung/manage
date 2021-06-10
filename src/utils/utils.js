/* 
*
*工具函数
* */

export default {
    formateDate(date, rule = 'YYYY-MM-DD HH:mm:ss') {
        if (/(Y+)/.test(rule)) {
            rule = rule.replace(RegExp.$1, date.getFullYear())
        }
        const o = {
            // 'Y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            "D+": date.getDate(),
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds()
        }
        for (const k in o) {
            if (new RegExp(`(${k})`).test(rule)) {
                const val = o[k] + '';
                rule = rule.replace(RegExp.$1, ('00' + val).substr(val.length))
            }
        }

        return rule;
    }
}