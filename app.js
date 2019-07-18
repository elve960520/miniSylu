//app.js
App({
  onLaunch: function() {    
    // 获取系统状态栏信息
    var that = this;
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
        this.globalData.SquareMainHeight = e.screenHeight-e.statusBarHeight-90;
        //onsole.log(e)
      }
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'release-elve',
        traceUser: true,
      })
    }
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
        // that.setData({
        //   tabCur: parseInt(res.data.weekNum)
        // })
        console.log(parseInt(res.data.weekNum));
      }
    });
    
  },
  onShow(options) {
    // Do something when show.
    let that = this
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