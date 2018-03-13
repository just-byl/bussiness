// pages/my/list.js
var app = getApp();
var util = require('../../utils/util.js');
var page = 1;
var weekList = new Array();
var monthList = new Array();
var allList = new Array();


Page({
  data: {
    tabs: [
      { "tabtitle": "本周", "tabnum": 0 },
      { "tabtitle": "本月", "tabnum": 0 },
      { "tabtitle": "所有", "tabnum": 0 }
    ],
    nomore: false,
    activeIndex: 0,
    sliderOffset: 0,
    sliderWidth: 0,
    weekList: [],
    monthList: [],
    allList: []
  },
  onLoad: function (e) {
    var that = this;
    //设置tab宽度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  //tab页切换事件处理函数
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  weekEdit: function (e) {
    var currentTarget = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/create/edit?id=' + weekList[currentTarget].id,
      complete: function (res) {
        console.log(res)
      }
    })
  },
  monthEdit: function (e) {
    var currentTarget = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/create/edit?id=' + monthList[currentTarget].id,
      complete: function (res) {
        console.log(res)
      }
    })
  },
  allEdit: function (e) {
    var currentTarget = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/create/edit?id=' + allList[currentTarget].id,
      complete: function (res) {
        console.log(res)
      }
    })
  },
  onReachBottom: function () {
    if (!this.data.nomore) {
      page++;
      this.getList();
    }
  },
  getList() {
    var that = this;
    //传入用户工号
    util.req('my/getLeaveCount',
      { userCode: app.globalData.userInfo.userCode,page:page,pageSize:10 },
      function (data) {
        var weekMap = data.weekMap;
        var monthMap = data.monthMap;
        var allMap = data.allMap;

        if (data.allMap == null) {
          if (page == 1) {
            that.setData({ 'isnull': true });
          }
          that.setData({ nomore: true });
          return false;
        }

        if (page == 1) {
          weekList = new Array();
          monthList = new Array();
          allList = new Array();
        }
        //本周
        weekMap.weekData.forEach(function (item) {
          var obj = {
            registerDate: util.formatTime(new Date(item.registerDate)).split(' ')[0],
            deptName: item.deptName,
            location: item.location,
            leaveName: item.leaveName,
            taskName: item.taskName,
            startDate: util.formatTime(new Date(item.startDate)).split(' ')[0],
            endDate: util.formatTime(new Date(item.endDate)).split(' ')[0],
            //url: '/pages/create/detail?id=' + item.id,
            id: item.id
          };
          weekList.push(obj);
        });
        //本月
        monthMap.monthData.forEach(function (item) {
          var obj = {
            registerDate: util.formatTime(new Date(item.registerDate)).split(' ')[0],
            deptName: item.deptName,
            location: item.location,
            leaveName: item.leaveName,
            taskName: item.taskName,
            startDate: util.formatTime(new Date(item.startDate)).split(' ')[0],
            endDate: util.formatTime(new Date(item.endDate)).split(' ')[0],
            //url: '/pages/create/detail?id=' + item.id,
            id: item.id
          };
          monthList.push(obj);
        });
        //所有
        allMap.allData.forEach(function (item) {
          var obj = {
            registerDate: util.formatTime(new Date(item.registerDate)).split(' ')[0],
            deptName: item.deptName,
            location: item.location,
            leaveName: item.leaveName,
            taskName: item.taskName,
            startDate: util.formatTime(new Date(item.startDate)).split(' ')[0],
            endDate: util.formatTime(new Date(item.endDate)).split(' ')[0],
            //url: '/pages/create/detail?id=' + item.id,
            id: item.id
          };
          allList.push(obj);
        });
        that.setData({
          'tabs[0].tabnum': weekMap.weekCount,
          'tabs[1].tabnum': monthMap.monthCount,
          'tabs[2].tabnum': allMap.allCount,
          weekList: weekList,
          monthList: monthList,
          allList: allList
        });
      })
  },
  onShow: function () {
    page = 1;
    this.getList();
  }
})

/**
 * ,
  del: function (e) {
    var that = this;
    var currentTarget = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定删除?',
      success: function (res) {
        if (res.confirm) {
          util.req('my/listdel', { sk: app.globalData.sk, id: list[currentTarget].id }, function (data) {
            if (data.status == 1) {
              list.splice(currentTarget, 1);
              that.setData({ list: list });
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            } else {
              util.isError('删除失败,请重试', that);
              return false;
            }
          })
        }
      }
    })
    return false;
  },
 */