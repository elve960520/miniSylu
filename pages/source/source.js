const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    tabCur: app.globalData.weekNumber,
    scrollLeft: 0,
    weekList: ["周一", "周二", "周三", "周四", "周五"],
    source12: [{}, {}, {}, {}, {}],
    source34: [{}, {}, {}, {}, {}],
    source56: [{}, {}, {}, {}, {}],
    source78: [{}, {}, {}, {}, {}],
    source910: [{}, {}, {}, {}, {}],
    gridCol: 5,
    skr: "午休",
    loadProgress: 0
  },

  //注册函数:设定显示课表
  setSourceList: function (weekNum) {
    try {
      var sourceArray = wx.getStorageSync('sourceArray');
      if (sourceArray[0].sourceName == null) {
        this.setData({
          skr: "本周没课"
        })
      } else {
        this.setData({
          skr: "午休"
        })
      }
      var tempSource12 = [{}, {}, {}, {}, {}], tempSource34 = [{}, {}, {}, {}, {}], tempSource56 = [{}, {}, {}, {}, {}], tempSource78 = [{}, {}, {}, {}, {}], tempSource910 = [{}, {}, {}, {}, {}];
      //console.log(sourceArray);
      for (var i = 0; i < sourceArray.length; i++) {
        var tempSource = sourceArray[i];
        //console.log(tempSource);
        if (tempSource.sourceStartWeek <= weekNum + 1 && tempSource.sourceEndWeek >= weekNum + 1) {
          if (tempSource.sourceTime == 1) {
            tempSource12[tempSource.sourceWeekDay - 1] = {
              icon: '',//TODO，在课程上添加图标更好认
              color: '',
              sourceName: tempSource.sourceName,
              sourceClassRoom: tempSource.sourceClassRoom,
              sourceTeacher: tempSource.sourceTeacher,
              sourceId:tempSource.sourceId
            }
          } else if (tempSource.sourceTime == 3) {
            tempSource34[tempSource.sourceWeekDay - 1] = {
              icon: '',//TODO，在课程上添加图标更好认
              color: '',
              sourceName: tempSource.sourceName,
              sourceClassRoom: tempSource.sourceClassRoom,
              sourceTeacher: tempSource.sourceTeacher,
              sourceId: tempSource.sourceId
            }
          } else if (tempSource.sourceTime == 5) {
            tempSource56[tempSource.sourceWeekDay - 1] = {
              icon: '',//TODO，在课程上添加图标更好认
              color: '',
              sourceName: tempSource.sourceName,
              sourceClassRoom: tempSource.sourceClassRoom,
              sourceTeacher: tempSource.sourceTeacher,
              sourceId: tempSource.sourceId
            }
          } else if (tempSource.sourceTime == 7) {
            tempSource78[tempSource.sourceWeekDay - 1] = {
              icon: '',//TODO，在课程上添加图标更好认
              color: '',
              sourceName: tempSource.sourceName,
              sourceClassRoom: tempSource.sourceClassRoom,
              sourceTeacher: tempSource.sourceTeacher,
              sourceId: tempSource.sourceId
            }
          } else if (tempSource.sourceTime == 9) {
            tempSource910[tempSource.sourceWeekDay - 1] = {
              icon: '',//TODO，在课程上添加图标更好认
              color: '',
              sourceName: tempSource.sourceName,
              sourceClassRoom: tempSource.sourceClassRoom,
              sourceTeacher: tempSource.sourceTeacher,
              sourceId: tempSource.sourceId
            }
          }
        }
      }
      this.setData({
        source12: tempSource12,
        source34: tempSource34,
        source56: tempSource56,
        source78: tempSource78,
        source910: tempSource910,
      })
    } catch (e) {
      console.log("获取课表失败")
    }
    //var sourceArray = wx.getStorageSync('sourceArray')
  },

  loadProgress: function () {
    this.setData({
      loadProgress: this.data.loadProgress + 3
    })
    if (this.data.loadProgress < 100) {
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    } else {
      this.setData({
        loadProgress: 0
      })
    }
  },
  showInfo(e) {
    // console.log(e)
    var id = e.currentTarget.dataset.id;
    var sourceList = wx.getStorageSync("sourceArray");
    var item;
    for(item in sourceList){
      if (sourceList[item].sourceId == id){
        var source = sourceList[item]
      }
    }
    this.setData({
      modalName: "Modal",
      source:source
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      source:null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    // 获取用户信息
    var checkedAccount = wx.getStorageSync('checkedAccount');
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo'] || !checkedAccount) {
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      }
    })
    
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
        app.globalData.weekNumber = parseInt(res.data.weekNum);//res.weekNum
        that.setData({
          tabCur: parseInt(res.data.weekNum),
          scrollLeft: (parseInt(res.data.weekNum) - 2) * 115
        })
        that.setSourceList(that.data.tabCur - 1);
        console.log(parseInt(res.data.weekNum));
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.setSourceList(app.globalData.weekNumber);
    // var checkedAccount = wx.getStorageSync('checkedAccount');
    // wx.getSetting({
    //   success: res => {
    //     if (!res.authSetting['scope.userInfo'] || !checkedAccount) {
    //       wx.redirectTo({
    //         url: '/pages/index/index'
    //       })
    //     }
    //   }
    // })
    //this.loadProgress();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setSourceList(app.globalData.weekNumber);
    this.setData({
      tabCur: app.globalData.weekNumber,
      scrollLeft: (app.globalData.weekNumber-2) * 115
    })
    this.setSourceList(this.data.tabCur - 1);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  tabSelect(e) {
    console.log(e);
    this.setData({
      tabCur: e.currentTarget.dataset.id + 1,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 115
    })
    this.setSourceList(this.data.tabCur - 1);
  }
})
