//修改密码页面
var app = getApp();
var util = require('../../utils/util.js');

Page({
  formSubmit: function (e) {
    var data = e.detail.value;
    var that = this;
    //基本的数据校验
    if (data.oldPwd == '') {
      util.isError('请填写旧密码', that);
      return false;
    };
    if (data.newPwd == '') {
      util.isError('请填写新密码', that);
      return false;
    };
    if (data.reNewPwd == '') {
      util.isError('请确认新密码', that);
      return false;
    };
    if (data.newPwd != data.reNewPwd) {
      util.isError('两次输入密码不一致', that);
      return false;
    };
    data.userCode = app.globalData.userInfo.userCode;
    wx.showModal({
      title: '提示',
      content: '确定要修改密码吗？若确定将需要重新登录！',
      success: function (res) {
        if (res.confirm) {
          //后台发送请求，保存数据
          util.req('my/changePassword', data, function (data) {
            //如果保存成功则提示
            if (data.isSuccess == 0) {
              that.loginOut();
            } else {
              util.isError(data.msg, that);
              return false;
            }
          })
          util.clearError(that);
        } else if (res.cancel) {
          return;
        }
      }
    })
  },
  loginOut: function loginOut() {
    wx.clearStorage()
    wx.redirectTo({ url: '../login/login' });
  }
});