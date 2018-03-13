//index.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');

Page({
  onShow: function () {
    var that = this;
    //主要加载人员信息和控制菜单
    that.setData({
      userInfo: app.globalData.userInfo,
      isPlan: app.globalData.userInfo.isPlan
    });
  }
})
