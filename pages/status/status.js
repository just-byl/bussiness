//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    tabs: [
      { "tabtitle": "出差中", "tabnum": 0 },
      { "tabtitle": "计划出差", "tabnum": 0 }
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderWidth: 0
  },
  //tab页切换事件处理函数
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onShow:function(){
    //获取出差数据
    this.getdata();
  },
  //页面初始化事件
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  getdata: function () {
    //获取出差状态链接  //status/getStatus
    var that = this;
    var deptId = '';//app.globalData.userInfo.deptId;
    util.req('status/getStatuCount', { deptId: deptId },
      function (data) {
        var leavingMap = data.leavingMap;
        var planMap = data.planMap;
        that.setData({
          'tabs[0].tabnum': leavingMap.leavingCount,
          'tabs[1].tabnum': planMap.planCount,
          'checitems': leavingMap.leavingData,
          'checitems1': planMap.planData
        });
      }
    )
  }
})
