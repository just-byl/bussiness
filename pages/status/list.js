// pages/my/list.js
var app = getApp();
var util = require('../../utils/util.js');
var page = 1;
var status;
var location;
var list = new Array();
Page({
  data: {
    list: [],
    nomore: false
  },
  onReachBottom: function () {
    if (!this.data.nomore) {
      page++;
      this.getList();
    }
  },
  getList() {
    var that = this;
    var deptId = '' //app.globalData.userInfo.deptId;
    util.req('home/lists',
      { deptId: deptId, status: status, location: location, page: page, pageSize: 8 },
      function (data) {
        if (!data.data) {
          that.setData({ nomore: true });
          return false;
        }

        if (page == 1) {
          list = new Array();
        }

        data.data.forEach(function (item) {
          var obj = {
            startDate: util.formatTime(new Date(item.startDate)).split(' ')[0],//开始时间
            endDate: util.formatTime(new Date(item.endDate)).split(' ')[0],//结束时间
            registerDate: util.formatTime(new Date(item.registerDate)).split(' ')[0],//登记时间
            deptName: item.deptName,//所在部门
            leaveName: item.leaveName,//出差人
            location: item.location,//出差地点
            url: '/pages/create/detail?id=' + item.id
          };
          list.push(obj);
        })
        that.setData({ list: list });
      })
  },
  onPullDownRefresh: function () {
    page = 1;
    this.getList();
    wx.stopPullDownRefresh();
  },
  onLoad: function (options) {
    status = options.status;
    location = options.location;
    wx.setNavigationBarTitle({
      title: status + '-' + location
    })
    page = 1;
    this.getList();
  }
})