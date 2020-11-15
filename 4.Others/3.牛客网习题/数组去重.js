Array.prototype.uniq = function () {
    // 有两个地方需要注意：1、返回值是否是当前引用 2、“重复”的判断条件

    // 长度只有1，直接返回当前的拷贝
    if (this.length <= 1) {
        return this.slice(0);
    }
    var aResult = [];
    for (var i = 0, l = this.length; i < l; i++) {
        if (!_fExist(aResult, this[i])) {
            aResult.push(this[i]);
        }
    }
    return aResult;
    // 判断是否重复
    function _fExist(aTmp, o) {
        if (aTmp.length === 0) {
            return false;
        }
        var tmp;
        for (var i = 0, l = aTmp.length; i < l; i++) {
            tmp = aTmp[i];
            if (tmp === o) {
                return true;
            }
            // NaN 需要特殊处理
            if (!o && !tmp && tmp !== undefined && o !== undefined && isNaN(tmp) && isNaN(o)) {
                return true;
            }
        }
        return false;
    }
}