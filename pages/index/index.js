//index.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp();
var page = 1;
var list = new Array();
var userInfo = {};


Page({
  data: {
    startDate: '',
    endDate: '',
    registerDate: '',
    deptName: '',
    leaveName: '',
    location: '',
    url: '',
    isPlan: '',//控制新建出差安排控件是否显示
    imgUrl: "/image/img/homepic.jpg",
    listData: [],
    imgUrls: [
      '/image/img/01.jpg',
      '/image/img/02.jpg',
      '/image/img/03.jpg'
    ]
  },
  onLoad: function () {
    var that = this;
    //重新加载数据list
    userInfo = app.globalData.userInfo;
    if (userInfo) {
      that.setData({
        isPlan: userInfo.isPlan
      });
      that.getList(userInfo);
    }
  },
  //下拉刷新事件
  onPullDownRefresh: function () {
    page = 1;
    this.getList(userInfo);
    wx.stopPullDownRefresh();
  },
  //获取列表数据
  getList: function (userInfo) {
    var that = this;
    //后台查询数据
    util.req('home/lists',
      { userInfo: userInfo, page: page, pageSize: 5 },
      function (data) {
        if (!data.data) {
          that.setData({ nomore: true });
          return false;
        }
        if (page == 1) {
          list = new Array();
        }
        data.data.forEach(function (item) {
          //循环取对象item
          var obj = {
            startDate: util.formatTime(new Date(item.startDate)).split(' ')[0],//开始时间
            endDate: util.formatTime(new Date(item.endDate)).split(' ')[0],//结束时间
            registerDate: util.formatTime(new Date(item.registerDate)).split(' ')[0],//登记时间
            deptName: item.deptName,//所在部门
            leaveName: item.leaveName,//出差人
            location: item.location,//出差地点
            url: '/pages/create/detail?id=' + item.id //点击查看详情数据
          };
          list.push(obj);
        })
        that.setData({ listData: list });
      })
  },
  onReachBottom: function () {
    if (!this.data.nomore) {
      page++;
      this.getList(userInfo);
    }
  }
})
