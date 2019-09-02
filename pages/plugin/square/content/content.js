// pages/plugin/square/content/content.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    content: null
  },
  // 返回上一级
  bindBack: function (options) {
    wx.navigateBack({
      delta: 1
    })
  },
  //时间戳转换工具
  formatDateTime: function (time, format) {
    var t = new Date(time);
    var tf = function (i) {
      return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear());
          break;
        case 'MM':
          return tf(t.getMonth() + 1);
          break;
        case 'mm':
          return tf(t.getMinutes());
          break;
        case 'dd':
          return tf(t.getDate());
          break;
        case 'HH':
          return tf(t.getHours());
          break;
        case 'ss':
          return tf(t.getSeconds());
          break;
      }
    })
  },
  sortNumber(a, b) {
    return b.goodCount - a.goodCount
  },
  getContent: function (id) {
    const db = wx.cloud.database()
    var that = this;
    db.collection('content').doc(id).get({
      success: function (res) {
        console.log(res.data)
        var content = res.data
        var xuehao = wx.getStorageSync("xuehao")
        var time = content.time;
        content.year = that.formatDateTime(time, 'yyyy');
        content.month = that.formatDateTime(time, 'MM');
        content.day = that.formatDateTime(time, 'dd');
        content.hour = that.formatDateTime(time, 'HH');
        content.minute = that.formatDateTime(time, 'ss');
        content.commentCount = content.commentList.length;
        // console.log(content.goodList)
        //设置喜欢
        // content.isLike = false;
        // for (let elem in content.goodList) {
        //   //console.log(content.goodList[elem])
        //   if (content.goodList[elem] == xuehao) {
        content.isLike = content.goodList.includes(wx.getStorageSync("xuehao"));
        //     break;
        //   }
        // }
        var commentList = content.commentList
        for (let index = 0; index < commentList.length; index++) {
          commentList[index].year = that.formatDateTime(commentList[index].time, 'yyyy');
          commentList[index].month = that.formatDateTime(commentList[index].time, 'MM');
          commentList[index].day = that.formatDateTime(commentList[index].time, 'dd');
          commentList[index].hour = that.formatDateTime(commentList[index].time, 'HH');
          commentList[index].minute = that.formatDateTime(commentList[index].time, 'ss');
          commentList[index].isZan = commentList[index].goodList.includes(wx.getStorageSync("xuehao"))
        }
        commentList.sort(that.sortNumber);
        content.commentList = commentList
        that.setData({
          content: res.data
        })
      }
    })
  },
  // 点击喜欢
  setContentLike: function (e) {
    var that = this;
    //console.log(e.currentTarget.dataset.id);
    var id = e.currentTarget.dataset.id;
    var content = that.data.content;
    if (content.isLike == true) {
      content.isLike = false;
      content.goodCount = content.goodCount - 1;
    } else {
      content.isLike = true;
      content.goodCount = content.goodCount + 1;
    }
    wx.cloud.callFunction({
      name: "setContentLike",
      data: {
        xuehao: wx.getStorageSync("xuehao"),
        xingming: wx.getStorageSync("name"),
        id: id,
      }
    })
    that.setData({
      content: content
    })
  },
  // 点击评论喜欢
  setCommentLike(e) {
    var that = this;
    // console.log(e.currentTarget.dataset.time);
    // console.log(that.data.commentId)
    var commentList = that.data.content.commentList;
    var content = that.data.content
    var time = e.currentTarget.dataset.time;
    for (let index = 0; index < commentList.length; index++) {
      if (commentList[index].time == time) {
        if (commentList[index].isZan == true) {
          commentList[index].isZan = false;
          commentList[index].goodCount = commentList[index].goodCount - 1;
        } else {
          commentList[index].isZan = true;
          commentList[index].goodCount = commentList[index].goodCount + 1;
        }
        break;
      }
    }
    wx.cloud.callFunction({
      name: "setCommentLike",
      data: {
        xuehao: wx.getStorageSync("xuehao"),
        xingming: wx.getStorageSync("name"),
        id: that.data.commentId,
        commentTime: e.currentTarget.dataset.time
      }
    })
    content.commentList = commentList
    that.setData({
      content: content
    })

  },
  //回复某人
  commentToOne: function (e) {
    console.log(e)
    this.setData({
      commentTo: e.currentTarget.dataset.name
    })
  },
  // 评论输入框
  commentInput(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  // 评论内容
  pushComment(e) {
    var that = this;
    if (that.data.commentValue == "") {
      return
    }
    wx.showLoading({
      title: '评论中',
    })
    wx.cloud.callFunction({
      name: "publishComment",
      data: {
        id: that.data.commentId,
        value: that.data.commentValue,
        xuehao: wx.getStorageSync("xuehao"),
        xingming: wx.getStorageSync("name"),
        userImage: wx.getStorageSync("userImageId"),
        commentTo: that.data.commentTo,
        time: new Date().getTime(),
        goodList: [],
        goodCount: 0
      },
      success: res => {
        console.log(res.result)
        that.getContent(that.data.id)
        wx.hideLoading()
      },
      fail: err => {
        //console.log(err)
      },
      complete: () => {
      }
    })
  },
  ViewContentImage(e) {
    //console.log(e)
    wx.previewImage({
      urls: e.currentTarget.dataset.list,
      current: e.currentTarget.dataset.url
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    var id = options.id
    that.setData({
      id: id
    })
    that.getContent(id)
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