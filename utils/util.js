const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


var rootDocment = 'http://123.56.28.40:8989/pbmis/mvc/pbmis/wechat/wechatapi/';

//修改成你的appid及appsecret
var AppConf = { 'appid': 'wxb2d554ab4423d3b4', 'appsecret': '05b2da66232924bd9cb381dffede035f' };

function req(url, data, cb) {
  data.appid = AppConf.appid;
  data.appsecret = AppConf.appsecret;
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'post',
    header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

function getReq(url, data, cb) {
  data.appid = AppConf.appid;
  data.appsecret = AppConf.appsecret;
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'get',
    header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

// 去前后空格  
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息  
function isError(msg, that) {
  that.setData({
    showTopTips: true,
    errorMsg: msg
  })
}

//提示错误信息
function hint(msg, headline = '提示') {
  wx.showModal({
    title: headline,
    content: msg,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        return;
        //console.log('用户点击确定')
      }
    }
  })
}

// 清空错误信息  
function clearError(that) {
  that.setData({
    showTopTips: false,
    errorMsg: ""
  })
}

function getDateDiff(dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = dateTimeStamp - now;
  if (diffValue < 0) { return; }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var result = '';
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月后";
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周后";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天后";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时后";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟后";
  } else
    result = "刚刚";
  return result;
}

function getDateBiff(dateTimeStamp) {
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();
  var diffValue = now - dateTimeStamp;
  if (diffValue < 0) { return; }
  var monthC = diffValue / month;
  var weekC = diffValue / (7 * day);
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  var result = '';
  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  }
  else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  }
  else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  }
  else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  }
  else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

function escape2Html(str) {
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}

function dateFormat(date, fmt) {
  if (!isNaN(date) && date != null) {
    var str = new Date(date);
    var obj = {
      'M+': str.getMonth() + 1,
      'd+': str.getDate(),
      'h+': str.getHours(),
      'm+': str.getMinutes(),
      's+': str.getSeconds(),
      'q+': Math.floor((str.getMonth() + 3) / 3),
      'S': str.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (str.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in obj) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? obj[k] : ('00' + obj[k]).substr(('' + obj[k]).length));
    } return fmt;
  } else {
    return '';
  }
}

module.exports = {
  formatTime: formatTime,
  req: req,
  trim: trim,
  isError: isError,
  hint: hint,
  clearError: clearError,
  getReq: getReq,
  getDateDiff: getDateDiff,
  escape2Html: escape2Html,
  getDateBiff: getDateBiff,
  dateFormat: dateFormat
}
