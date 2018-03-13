//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    leaveName: '',
    deptName: ''
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    //通过id查看详情
    util.req('create/detail', { id: options.id }, function (data) {
      var startDate = util.formatTime(new Date(data.startDate)).split(' ')[0];
      var endDate = util.formatTime(new Date(data.endDate)).split(' ')[0];
      data.startDate = startDate;
      data.endDate = endDate;
      that.setData({
        leaveName: data.leaveName,
        deptName: data.deptName,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        taskName: data.taskName
      });//加载form表单数据
    });
  }
})
