//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var today = util.formatTime(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 1))).split(' ')[0];
var minday = util.formatTime(new Date()).split(' ')[0];
var maxday = util.formatTime(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 62))).split(' ')[0];

Page({
  //初始化数据
  data: {
    userCode: '',
    userId: '',
    leaveName: '请选择出差人',
    deptId: '',
    deptName: '请选择所在科室',
    location: '',
    startDate: today,
    endDate: '请选择结束日期',
    start: minday,

    arrange: ''//安排人
  },
  setName: function (e) {
    var rangeName = this.data.rangeName;
    this.setData({
      leaveName: rangeName[e.detail.value].userName,
      userId: rangeName[e.detail.value].userId,
      deptName: rangeName[e.detail.value].deptName,
      deptId: rangeName[e.detail.value].deptId
    });
  },
  setDept: function (e) {
    var rangeDept = this.data.rangeDept;
    this.setData({
      leaveName: '请选择出差人',
      userId: '',
      deptName: rangeDept[e.detail.value].deptName,
      deptId: rangeDept[e.detail.value].deptId
    });
  },
  //绑定日期事件
  bindDateChange: function (e) {
    var id = e.target.id;
    if (id == "startDate") {
      this.setData({
        startDate: e.detail.value
      });
    } else {
      this.setData({
        endDate: e.detail.value
      });
    }
  },
  formSubmit: function (e) {
    var data = e.detail.value;
    var that = this;

    //基本的数据校验
    if (data.leaveName == '') {
      util.isError('请选择出差人', that);
      return false;
    };
    if (data.deptName == '') {
      util.isError('请选择所在科室', that);
      return false;
    };
    if (data.location == '') {
      util.isError('请选择目的地', that);
      return false;
    };
    if (data.startDate == '') {
      util.isError('请选择开始日期', that);
      return false;
    };
    if (data.endDate == '') {
      util.isError('请选择结束日期', that);
      return false;
    };
    if (data.endDate < data.startDate) {
      util.isError('结束日期不能小于开始日期', that);
      return false;
    };
    //后台发送请求，保存数据
    util.req('my/editForm', data, function (data) {
      //如果保存成功则提示
      if (data.isSuccess == 0) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 10000,
          success: function () {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      } else {
        util.isError(data.msg, that);
        return false;
      }
    })
    util.clearError(that);
  },
  //事件处理函数
  onLoad: function (options) {
    var that = this;
    util.req('create/getUserInfo', {}, function (data) {
      that.setData({
        rangeName: data.userInfo,
        rangeDept: data.deptInfo,
      })
    });
    util.req('create/detail', { id: options.id }, function (data) {
      var startDate = util.formatTime(new Date(data.startDate)).split(' ')[0];
      var endDate = util.formatTime(new Date(data.endDate)).split(' ')[0];
      data.startDate = startDate;
      data.endDate = endDate;
      that.setData({
        id: data.id,
        userId: data.userId,
        deptId: data.deptId,
        leaveName: data.leaveName,
        deptName: data.deptName,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        arrangeName: data.taskName
      });
    })
  }
})
