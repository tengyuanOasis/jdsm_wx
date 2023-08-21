
  var subStr = function(str) {
    if (str == null || str.length == 0) {
      return ""
    } else {
      return str.substring(0,10)
    }
  }

  export default {
    subStr: subStr
  };
