// pages/about/opinion/opinion.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    classify: ["BUG反馈", "开发建议", "联系作者"],
    modalName: null,
    index: 0,
    textArea: '',
    phoneNUmber: ''
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  textareaInput(e) {
    console.log(e);
    this.setData({
      textArea: e.detail.value
    })
  },
  phoneInput(e) {
    console.log(e);
    this.setData({
      phoneNUmber: e.detail.value
    })
  },
  fromSubmit(e) {
    var that = this;
    wx.showLoading({
      title: '正在提交...',
    })
    let xuehao = wx.getStorageSync('xuehao')
    wx.request({
      url: 'https://sylucloud.cn/sendOpinion', //第四个函数
      data: {
        xuehao: xuehao,
        classify: that.data.classify[that.data.index],
        text: that.data.textArea,
        phone: that.data.phoneNUmber
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data == "ok") {
          that.setData({
            modalName: 'Modal'
          })
        }else{
          that.setData({
            modalName: 'errModal'
          })
        }
      }
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //回退
  bindBack: function (options) {
    wx.switchTab({
      url: '/pages/about/home/home',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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