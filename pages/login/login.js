//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    logged: true,
    eye: false,
    user: '',
    pwd: '',
    hiddenLoading: true
  },
  switchEye: function switchEye(e) {
    this.setData({
      eye: !this.data.eye
    })
  },
  bindPwd: function bindPwd(e) {
    var val = e.detail.value;
    this.setData({
      pwd: val
    });
  },
  bindUser: function bindUser(e) {
    var val = e.detail.value;
    this.setData({
      user: val
    });
  },
  //用户登录获取用户的相关信息，包括userinfo,sk,userinfo应包含用户其他扩展信息（部门，角色，是否能够）；
  login: function () {
    var that = this;
    var user = that.data.user;
    var pwd = that.data.pwd;
    if (!user) {
      util.hint('请填写账号');
    }
    if (!pwd) {
      util.hint('请填写密码');
    }
    if (user != '' && pwd != '') {
      wx.login({
        success: res => {
          // 获取用户信息
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              util.req('user/login', {
                //"code": res.code,//"encryptedData": userinfo.encryptedData,//"iv": userinfo.iv,
                "userCode": user,
                "password": pwd
              }, function (data) {
                if (data.isSuccess == 1) {
                  util.hint('账户名或密码错误!');
                } else {
                  that.setData({ hiddenLoading: false });//隐藏登录框
                  //that.setUserInfo(data.loginInfo);//保存用户信息到缓存中
                  data.loginInfo.avatarUrl = res.userInfo.avatarUrl;
                  data.loginInfo.country = res.userInfo.country;
                  data.loginInfo.city = res.userInfo.city;
                  data.loginInfo.gender = res.userInfo.gender;
                  data.loginInfo.nickName = res.userInfo.nickName;
                  data.loginInfo.province = res.userInfo.province;
                  app.globalData.userInfo = data.loginInfo;
                  wx.setStorage({ key: "userInfo", data: data.loginInfo })
                  //that.setSessionKey(resData.sk);//保存会话id到缓存中
                  wx.setStorage({ key: "logged", data: true });
                  wx.switchTab({ url: '/pages/index/index' });//跳转到首页
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              that.loginFail();
            }
          })
        }
      });
    }
  },
  setUserInfo: function (data) {   //将用户信息缓存保存
    this.globalData.userInfo = data;
    wx.setStorage({ key: "userInfo", data: data })
  },
  setSessionKey: function (data) {   //将用户信息session_key缓存保存
    this.globalData.sessionkey = data;
    wx.setStorage({ key: "sessionkey", data: data })
  },
  loginFail: function () {
    var that = this;
    wx.showModal({
      content: '登录失败，请允许获取用户信息,如不显示请删除小程序重新进入',
      showCancel: false
    });
  },
  onLoad: function () {
    var that = this;
    //小程序初始化先判断用户是否登录    
    wx.checkSession({
      //如果检测登录态正常，说明已经调用wx.login
      success: function () {
        //检测成功之后，获取会话key
        wx.getStorage({
          key: 'logged',//session_key
          success: lres => {
            if (lres.data) {//logged==true
              //若登录成功,则从缓存获取userInfo
              wx.getStorage({
                key: 'userInfo',//从缓存获取userInfo
                success: ures => {
                  app.globalData.userInfo = ures.data;
                  wx.switchTab({
                    url: '/pages/index/index'
                  });
                }
              });
            }
          },
          fail: function () {
            //若无登录则跳转到登录页面
            return;
          }
        })
      },
      fail: function () {//若检测失败，说明小程序未授权
        return;
      }
    });
  }
});

