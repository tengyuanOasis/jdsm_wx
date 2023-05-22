Page({
  data: {},
  onLoad(options) {
    console.log(decodeURIComponent(options.url))
  this.setData({
      url: decodeURIComponent(options.url)
    });
  },
});
