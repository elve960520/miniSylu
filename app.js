//app.js
App({
  onLaunch: function() {    
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
      }
    })
    
  },
  onShow(options) {
    // Do something when show.
    let that = this
    wx.request({
      url: 'https://sylucloud.cn/setViewNum', //第二个函数
      data: {
        xuehao: wx.getStorageSync('xuehao')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        console.log(res.data)
      }
    });
    wx.request({
      url: 'https://sylucloud.cn/getWeekNumber', //第一个函数
      data: {
        xuehao: wx.getStorageSync('xuehao')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        that.globalData.weekNumber = parseInt(res.data.weekNum);//res.weekNum
        console.log(parseInt(res.data.weekNum))
      }
    });
  },
  onHide() {
    // Do something when hide.
  },
  globalData: {
    userInfo: null,
    weekNumber:1,
    viewNumber:0,
    starNumber:0,
  }
})