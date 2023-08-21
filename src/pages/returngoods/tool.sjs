
  var combineArray = function(array) {
    if (array == undefined) {
      return
    }
    var str = "规格："
    for (var i = 0; i < array.length; i++) {
      str += array[i].feature_name + " " + array[i].option_name + " "
    }
    return str
  }

  export default {
    combineArray: combineArray
  };
