/* eslint-disable no-console */
export function compareVersion(v1, v2) {
    if (v1 === v2) {
        return 0;
    }
    var v1Arr = v1.split('.');
    var v2Arr = v2.split('.');
    if (v1Arr.length < v2Arr.length) {
        var len = v1Arr.length;
    } else {
        var len = v2Arr.length;
    }
    var i = 0;
    while (i <= len) {
        if (v1Arr[i] === v2Arr[i]) {
            i++;
        } else if (!v1Arr[i] || !v2Arr[i]) {
            return v1Arr.length > v2Arr.length ? 1 : -1;
        } else {
            // eslint-disable-next-line no-nested-ternary
            return Number(v1Arr[i]) === Number(v2Arr[i]) ? 0 : Number(v1Arr[i]) > Number(v2Arr[i]) ? 1 : -1;
        }
    }
}
