Page({
  data: {
    // 展开折叠
    selectedFlag: [false, false, false, false, false, false, false, false, false, false, false],
    foncl: "subitem"
  },
  // 展开折叠选择 
  changeToggle: function (e) {
    var index = e.currentTarget.dataset.index;

    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      for (var i = 0; i < this.data.selectedFlag.length; i++) {
        this.data.selectedFlag[i] = false;
      }

      this.data.selectedFlag[index] = true;
      this.setData({
        foncl: "subitem"
      });
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    });
  },
  ff: function () {
    this.setData({
      foncl: "subitem"
    });
  }
});