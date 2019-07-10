// pages/about/about.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitTotal: 0,
    starCount: 0,
    imageList: ['https://syluCloud.cn/zan'],
    stared: false,
    name:null
  },

  coutNum(e) {
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },

  showQrcode: function (e) {
    let that = this;
    var current = e.target.dataset.src;
    wx.previewImage({
      urls: that.data.imageList,
      current: 'https://syluCloud.cn/zan'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  clickStar: function () {
    let that = this;
    if (that.data.stared) {
      that.setData({
        stared: false,
        starCount: that.data.starCount - 1
      })
    } else {
      that.setData({
        stared: true,
        starCount: that.data.starCount + 1
      })
    }
    let xuehao = wx.getStorageSync('xuehao')
    wx.request({
      url: 'https://sylucloud.cn/setStared', //第四个函数
      data: {
        xuehao: xuehao,
        stared: that.data.stared
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        console.log(res.data)
      }
    })
  },
  onLoad: function (options) {

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      name: wx.getStorageSync('name')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    var tempView = 0;
    var tempStar = 0;
    wx.request({
      url: 'https://sylucloud.cn/getViewAndStar', //第三个函数
      data: {
        xuehao: wx.getStorageSync('xuehao')
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var star = res.data.stared;
        if (star == null) {
          star = false;
        }
        that.setData({
          visitTotal: res.data.viewNum,
          starCount: res.data.starNum,
          stared: star
        })
        tempView = that.coutNum(that.data.visitTotal);
        tempStar = that.coutNum(that.data.starCount);
        let i = 0;
        numDH();
        function numDH() {
          if (i < 20) {
            setTimeout(function () {
              that.setData({
                visitTotal: i,
                starCount: i
              })
              i++;
              numDH();
            }, 20)
          } else {
            that.setData({
              visitTotal: tempView,
              starCount: tempStar
            })
          }
        }
      }
    })
    
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

  }
})