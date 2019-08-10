// pages/square/square.js
const app = getApp()
// const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   * 页面问题（未改正）：头像更新 ，评论、点赞提醒
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    windowHeight: app.globalData.SquareMainHeight,
    isCard: true,
    squareList: ['新鲜事', '二手物品', '表白墙', '学长答', '考研交流'],
    tabCur: 0,
    commentTo: null,
    contentPage: 0,
    commentPage: 0,
    modalName: null,
    imgList: [],
    textareaAValue: "",
    commentCount: 0,
    commentId: null,
    commentValue: "",
    fileIdList: [],
    contentList: [],
    commentList: [],
    remindCount: 0
  },

  bindBack: function (options) {
    wx.switchTab({
      url: '/pages/plugin/home/home',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // wx.navigateBack({
    //   delta: 1
    // })
  },

  tabSelect(e) {
    //console.log(Math.round(new Date()));
    var that = this;
    wx.showLoading({
      title: '获取中',
    })
    that.setData({
      tabCur: e.currentTarget.dataset.id,
      contentPage: 0
    })
    that.getContent();
    // wx.hideLoading();
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
  //下拉刷新
  onPullDownScroll: function (e) {
    var that = this;
    wx.showLoading({
      title: '获取中',
    })
    that.setData({
      contentPage: 0
    })
    that.getContent();
  },
  //选择发布图片
  ChooseImage() {
    var that = this;
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // for (filePath in res.tempFilePaths) {
        var timestamp = (new Date()).getTime();
        const cloudPath = wx.getStorageSync('xuehao') + timestamp + filePath.match(/\.[^.]+?$/)[0]
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFilePaths)
          })
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              that.setData({
                fileIdList: that.data.fileIdList.concat([res.fileID])
              });
              wx.hideLoading();
            },
            fail: e => {
              console.error(e)
            }
          })
        } else {
          that.setData({
            imgList: res.tempFilePaths
          })
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              that.setData({
                fileIdList: [res.fileID]
              });
              wx.hideLoading();
            },
            fail: e => {
              console.error(e)
            }
          })
        }
        // }
      }
    });
  },
  // 查看发布图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  // 查看内容图片
  ViewContentImage(e) {
    //console.log(e)
    wx.previewImage({
      urls: e.currentTarget.dataset.list,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除图片
  DelImg(e) {
    var that = this;
    //console.log(that.data.fileIdList[e.currentTarget.dataset.index])
    wx.cloud.deleteFile({
      fileList: [that.data.fileIdList[e.currentTarget.dataset.index]],
      success: res => {
        // handle success
        //console.log(res.fileList)
        that.data.imgList.splice(e.currentTarget.dataset.index, 1);
        that.data.fileIdList.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          imgList: that.data.imgList,
          fileIdList: that.data.fileIdList
        })
      },
      fail: err => {
        // handle error
      }
    })

  },
  // 发布输入框
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  // 评论输入框
  commentInput(e) {
    this.setData({
      commentValue: e.detail.value
    })
  },
  // 发送内容
  pushContent(e) {
    var that = this;
    var imageList = that.data.fileIdList;
    var text = that.data.textareaAValue;
    if (imageList.length == 0 && text == "") {
      return
    }
    that.hideModal();
    wx.showLoading({
      title: '上传中',
    })
    wx.cloud.callFunction({
      name: "publishContent",
      data: {
        time: new Date().getTime(),
        xuehao: wx.getStorageSync("xuehao"),
        xingming: wx.getStorageSync("name"),
        userImage: wx.getStorageSync("userImageId"),
        fileIdList: that.data.fileIdList,
        tabCur: that.data.tabCur,
        text: that.data.textareaAValue,
        goodCount: 0,
        goodList: [],
        commentCount: 0,
        commentList: []
      },
      success: res => {
        console.log(res.result);
        that.setData({
          contentPage: 0
        })
        that.getContent();
        that.setData({
          imgList: [],
          fileIdList: [],
          textareaAValue: ""
        })
        wx.hideLoading();
      },
      fail: err => {
        console.log(err)
      },
      complete: () => { }
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
        wx.cloud.callFunction({
          name: "getComment",
          data: {
            id: that.data.commentId,
            page: that.data.commentPage
          },
          success: res => {
            // console.log(res.result)
            var commentList = res.result
            for (let index = 0; index < commentList.length; index++) {
              commentList[index].year = that.formatDateTime(commentList[index].time, 'yyyy');
              commentList[index].month = that.formatDateTime(commentList[index].time, 'MM');
              commentList[index].day = that.formatDateTime(commentList[index].time, 'dd');
              commentList[index].hour = that.formatDateTime(commentList[index].time, 'HH');
              commentList[index].minute = that.formatDateTime(commentList[index].time, 'ss');
              commentList[index].isZan = commentList[index].goodList.includes(wx.getStorageSync("xuehao"))
            }
            commentList.sort(that.sortNumber);
            that.setData({
              commentList: commentList,
              commentCount: commentList.length,
              commentValue: ""
            })
            wx.hideLoading()
          },
          fail: err => {
            //console.log(err)
          },
          complete: () => { }
        })
      },
      fail: err => {
        //console.log(err)
      },
      complete: () => {

      }
    })
  },
  //回复某人
  commentToOne: function (e) {
    console.log(e)
    this.setData({
      commentTo: e.currentTarget.dataset.name
    })
  },
  // 获取内容
  getContent: function () {
    var that = this;
    wx.cloud.callFunction({
      name: "getContent",
      data: {
        xuehao: wx.getStorageSync("xuehao"),
        tabCur: that.data.tabCur,
        page: that.data.contentPage
      },
      success: res => {
        that.setData({
          contentList: []
        })
        //console.log(res)
        let xuehao = wx.getStorageSync("xuehao")
        var contentList = res.result.data;
        var userFileId;
        for (let index = 0; index < contentList.length; index++) {
          var time = contentList[index].time;
          contentList[index].year = that.formatDateTime(time, 'yyyy');
          contentList[index].month = that.formatDateTime(time, 'MM');
          contentList[index].day = that.formatDateTime(time, 'dd');
          contentList[index].hour = that.formatDateTime(time, 'HH');
          contentList[index].minute = that.formatDateTime(time, 'ss');
          contentList[index].commentCount = contentList[index].commentList.length;
          //console.log(contentList[index].goodList)
          //设置喜欢
          contentList[index].isLike = false;
          for (let elem in contentList[index].goodList) {
            //console.log(contentList[index].goodList[elem])
            if (contentList[index].goodList[elem] == xuehao) {
              contentList[index].isLike = true;
              break;
            }
          }
        }
        that.setData({
          contentList: contentList
        })

        wx.hideLoading();
      },

      fail: err => {
        console.log(err)
      },
      complete: () => {

      }
    })
  },

  // 显示评论
  sortNumber(a, b) {
    return b.goodCount - a.goodCount
  },
  getComment: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载评论...',
    })
    var id = e.currentTarget.dataset.id;//获取帖子 id
    that.setData({
      commentId: e.currentTarget.dataset.id,
      commentTo:null
    })
    // console.log(id)
    wx.cloud.callFunction({
      name: "getComment",
      data: {
        id: id,
        page: that.data.commentPage
      },
      success: res => {
        console.log(res.result)
        var commentList = res.result
        for (let index = 0; index < commentList.length; index++) {
          commentList[index].year = that.formatDateTime(commentList[index].time, 'yyyy');
          commentList[index].month = that.formatDateTime(commentList[index].time, 'MM');
          commentList[index].day = that.formatDateTime(commentList[index].time, 'dd');
          commentList[index].hour = that.formatDateTime(commentList[index].time, 'HH');
          commentList[index].minute = that.formatDateTime(commentList[index].time, 'ss');
          commentList[index].isZan = commentList[index].goodList.includes(wx.getStorageSync("xuehao"))
        }
        wx.hideLoading();
        commentList.sort(that.sortNumber);
        that.setData({
          modalName: "commentModal",
          commentList: commentList,
          commentCount: commentList.length
        })
      },
      fail: err => {
        //console.log(err)
      },
      complete: () => {

      }
    })
  },
  // 分享界面
  onShareAppMessage: function () {
    return {
      title: '转发',
      success: function (res) { }
    }
  },
  // 点击喜欢
  setContentLike: function (e) {
    var that = this;
    //console.log(e.currentTarget.dataset.id);
    var id = e.currentTarget.dataset.id;
    var contentList = that.data.contentList;
    for (let index = 0; index < contentList.length; index++) {
      if (contentList[index]._id == id) {
        if (contentList[index].isLike == true) {
          contentList[index].isLike = false;
          contentList[index].goodCount = contentList[index].goodCount - 1;
          // wx.cloud.callFunction({
          //   name: "setContentLike",
          //   data: {
          //     xuehao: wx.getStorageSync("xuehao"),
          //     id: id,
          //   }
          // })
        } else {
          contentList[index].isLike = true;
          contentList[index].goodCount = contentList[index].goodCount + 1;

        }

        break;
      }
    }
    wx.cloud.callFunction({
      name: "setContentLike",
      data: {
        xuehao: wx.getStorageSync("xuehao"),
        xingming:wx.getStorageSync("name"),
        id: id,
      }
    })
    that.setData({
      contentList: contentList
    })
  },
  // 点击评论喜欢
  setCommentLike(e) {
    var that = this;
    // console.log(e.currentTarget.dataset.time);
    // console.log(that.data.commentId)
    var commentList = that.data.commentList;
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
        xingming:wx.getStorageSync("name"),
        id: that.data.commentId,
        commentTime: e.currentTarget.dataset.time
      }
    })
    that.setData({
      commentList: commentList
    })

  },
  // 触底刷新
  getNewContent(e) {
    // console.log(e)
    var that = this;
    that.setData({
      contentPage: that.data.contentPage + 1
    })
    wx.cloud.callFunction({
      name: "getContent",
      data: {
        xuehao: wx.getStorageSync("xuehao"),
        tabCur: that.data.tabCur,
        page: that.data.contentPage
      },
      success: res => {
        console.log(res)
        let xuehao = wx.getStorageSync("xuehao")
        var contentList = res.result.data;
        for (let index = 0; index < contentList.length; index++) {
          var time = contentList[index].time;
          contentList[index].year = that.formatDateTime(time, 'yyyy');
          contentList[index].month = that.formatDateTime(time, 'MM');
          contentList[index].day = that.formatDateTime(time, 'dd');
          //console.log(contentList[index].goodList)
          contentList[index].isLike = false;
          for (let elem in contentList[index].goodList) {
            //console.log(contentList[index].goodList[elem])
            if (contentList[index].goodList[elem] == xuehao) {
              contentList[index].isLike = true;
              break;
            }
          }
        }
        var newContentList = that.data.contentList.concat(contentList)
        // console.log(newContentList)
        that.setData({
          contentList: newContentList
        })
        wx.hideLoading();
      },
      fail: err => {
        //console.log(err)
      },
      complete: () => {

      }
    })
  },

  // 点击发布按钮
  publish: function () {
    var that = this
    that.setData({
      modalName: 'DialogModal'
    })
  },
  // 隐藏弹窗
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    function compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)

      while (v1.length < len) {
        v1.push('0')
      }
      while (v2.length < len) {
        v2.push('0')
      }
      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])
        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }
      return 0
    }
    const version = wx.getSystemInfoSync().SDKVersion
    if (compareVersion(version, '2.3.0') >= 0) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，部分功能无法使用，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // function getLocalTime(nS) {
    //   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    // }
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    that.getContent();

    wx.cloud.callFunction({
      name: "getRemind",
      data: {
        xuehao: wx.getStorageSync("xuehao")
      },
      success: res => {
        var data = res.result.data[0]
        console.log(data)
        that.setData({
          remindCount: data.commentList.length + data.contentLikeList.length + data.commentLikeList.length
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