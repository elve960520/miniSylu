// pages/mark/mark.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    multiArray: [
      ['2018-2019', '2017-2018', '2016-2017', '2015-2016', ' 全部'],
      ['第一学期', '第二学期'],
    ],
    markArray: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    multiIndex: [4, 0],
    // loadProgress: 0,
    loadModal:false,
    loadtext:"加载中"
  },

  setMarkList: function (multIndex) {
    if (multIndex[0] == 4) {
      this.setData({
        markArray: wx.getStorageSync('markArray')
      });
    } else {
      try {
        var markArray = wx.getStorageSync('markArray');
        var markList = new Array();
        let markId = 0;
        for (let index = 0; index < markArray.length; index++) {
          var markIndex = markArray[index];
          if (markIndex.markYear == this.data.multiArray[0][multIndex[0]] && markIndex.markSemester == multIndex[1] + 1) {
            markList[markId++] = markIndex;
          }
        }
        this.setData({
          markArray: markList
        })
      } catch (e) {
        console.log("获取成绩失败")
      }
    }
  },
  //
  // loadProgress: function () {
  //   this.setData({
  //     loadProgress: this.data.loadProgress + 10
  //   })
  //   if (this.data.loadProgress < 100) {
  //     setTimeout(() => {
  //       this.loadProgress();
  //     }, 100)
  //   } else {
  //     this.setData({
  //       loadProgress: 0
  //     })
  //   }
  // },

  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
    this.setMarkList(e.detail.value)
    console.log(e.detail.value)
  },

  MultiColumnChange: function (e) {
    console.log(e.detail)
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0: switch (data.multiIndex[0]) {
        case 4:
          data.multiArray[1] = [];
          //console.log(data.multiArray[1]);
          break;
        case 0:
          data.multiArray[1] = ['第一学期', '第二学期'];
          break;
        case 1:
          data.multiArray[1] = ['第一学期', '第二学期'];
          break;
        case 2:
          data.multiArray[1] = ['第一学期', '第二学期'];
          break;
        case 3:
          data.multiArray[1] = ['第一学期', '第二学期'];
          break;
      }
        break;
    }
    //data.multiIndex[1] = 0;
    this.setData(data);
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
    var xuehao = wx.getStorageSync('xuehao')
    var year = Number(xuehao.slice(0, 2));
    var yearList = [];
    yearList[0] = ['20' + (year + 3).toString() + '-' + '20' + (year + 4).toString(), '20' + (year + 2).toString() + '-' + '20' + (year + 3).toString(), '20' + (year + 1).toString() + '-' + '20' + (year + 2).toString(), '20' + year.toString() + '-' + '20' + (year + 1).toString(), "全部"];
    yearList[1] = [];
    this.setData({
      multiArray: yearList
    });
    //console.log(yearList)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   markArray: wx.getStorageSync('markArray')
    // });
    this.setMarkList(this.data.multiIndex);
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
    this.setData({
      loadModal:true,
      loadtext:"获取成绩..."
    })
    var that = this
    wx.request({
      url: 'https://sylucloud.cn/getMark',
      data: {
        xuehao: wx.getStorageSync('xuehao'),
        mima: wx.getStorageSync('mima')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        // that.setData({
        //   loadModal: true,
        //   loadtext: "下载成绩..."
        // })
        //wx.hideLoading()
        console.log(res.data)
        wx.setStorage({
          key: 'markArray',
          data: res.data,
        })
        that.setData({
          loadModal: true,
          loadtext: "获取完成"
        })
        setTimeout(function () {
          that.setData({
            loadModal: false,
            loadtext: ""
          })
          that.setMarkList(that.data.multiIndex);
          wx.stopPullDownRefresh()
        }, 500)
        // this.setMarkList(this.data.multiIndex);
      }, fail(res){
        that.setData({
          loadModal: true,
          loadtext: "获取失败"
        })
        setTimeout(function () {
          that.setData({
            loadModal: false,
            loadtext: ""
          })
          wx.stopPullDownRefresh()
        }, 500)
      }
    })
    

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