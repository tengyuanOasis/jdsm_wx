const wx2my = require("../../wx2my");
const Behavior = require("../../Behavior");
const evaluation = require("../../constant/evaluation.json");

Component({
  data: {
    evaluationList: evaluation,
  },

  methods: {
    toCommonProblem: function () {
      wx2my.navigateTo({
        url: "/pages/questionguide/questionguide",
      });
    },
  },
});
