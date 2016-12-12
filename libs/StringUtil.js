'use strict';

var StringUtil = function() {

    this.isOptStrNull = function(str) {
        if (str == undefined || str == null || str == '' || str == 'null' || str == '[]' || str == '{}') {
            return true
        } else {
            return false;
        }
    }

    this.objToStr = function (appendixStr, obj) {
        var str = "";
        var length = Object.keys(obj).length;
        var index = 0;
        for (var p in obj) { // 方法
            index++;
            if (typeof(obj[p]) == "function") {
                // obj [ p ]() ; //调用方法

            } else if (obj[p] != undefined && obj[p] != null) { // p 为属性名称，obj[p]为对应属性的值
                str += p + "=" + obj[p];
                if (index < length) {
                    str = str + appendixStr;
                }
            }
        }
        return str;
    }

    if (StringUtil.instance == null) {
        StringUtil.instance = this;
    }
    return StringUtil.instance;
}

module.exports = StringUtil;