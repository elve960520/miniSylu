// pages/plugin/square/remindList/remindList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    commentList: [],
    contentLikeList: [],
    commentLikeList: []
  },

  bindBack: function (options) {
    wx.cloud.callFunction({
      name: "delRemind",
      data: {
        xuehao: wx.getStorageSync("xuehao")
      }
    })
    wx.navigateBack({
      delta: 1
    })
  },
  lookContent: function (options) {
    var that = this
    // console.log(options)
    var id = options.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../content/content?id='+id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.cloud.callFunction({
      name: "getRemind",
      data: {
        xuehao: wx.getStorageSync("xuehao")
      },
      success: res => {
        var data = res.result.data[0]
        console.log(data)
        var commentList = data.commentList
        var contentLikeList = data.contentLikeList
        var commentLikeList = data.commentLikeList

        for (let index = 0; index < commentList.length; index++) {
          commentList[index].text = commentList[index].text.length > 5 ? commentList[index].text.substring(0, 5) + "..." : commentList[index].text;
        }
        for (let index = 0; index < contentLikeList.length; index++) {
          contentLikeList[index].text = contentLikeList[index].text.length > 5 ? contentLikeList[index].text.substring(0, 5) + "..." : contentLikeList[index].text;
          if (contentLikeList[index].text.length == 0) {
            contentLikeList[index].text = "[图片内容]"
          }
        }
        for (let index = 0; index < commentLikeList.length; index++) {
          commentLikeList[index].commentText = commentLikeList[index].commentText.length > 5 ? commentLikeList[index].commentText.substring(0, 5) + "..." : commentLikeList[index].commentText;
        }
        that.setData({
          commentList: commentList,
          contentLikeList: contentLikeList,
          commentLikeList: commentLikeList
        })
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
    wx.cloud.callFunction({
      name: "delRemind",
      data: {
        xuehao: wx.getStorageSync("xuehao")
      }
    })
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