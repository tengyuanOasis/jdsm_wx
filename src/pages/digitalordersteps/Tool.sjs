//字符串取值>>Tool.cutStr():val传入字符串，position切割的位置
var cutStr = function (val, position) {
  return val.split("|")[position];
};

const findKeyIdx = function (ObjectData, key) {
  const list = Object.keys(ObjectData);
  const idx = list.findIndex((item) => item === key);
  return idx;
};

const showIcon = function (data) {
  return data.includes("true");
};

const objectToArray = function (obj = {}) {
  const keys = Object.keys(obj);
  return keys.map((item) => {
    const [name, qid, showIcon, selectType, sort] = item.toString().split("|");
    return {
      name,
      qid,
      showIcon: showIcon === "true",
      selectType,
      sort,
      children: obj[item],
    };
  });
};

export default {
  backStr: cutStr,
  findKeyIdx,
  showIcon,
  objectToArray,
};
