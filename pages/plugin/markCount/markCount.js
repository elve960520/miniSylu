// pages/plugin/markCount/markCount.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    modalName: '',
    yearList: ['', '', '', '', ''],
    classList: ['公共基础课', '公共选修课', '专业基础课', '专业任选课', '专业方向课', '生产实习', '专业基础选修', '素质教育课', '专业课', '岗位实践', '教学实习', '课程设计', '毕业实习', '毕业设计', '军训', '公共基础选修', '公共基础选修', '生产实习选修', '实践教学环节'],
    markList: [],
    yearIndex: '',
    classIndex: [],
    countIndex: [],
    countResult: 0.0
  },

  bindBack: function (options) {
    wx.switchTab({
      url: '/pages/plugin/home/home',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
    //console.log(e.detail.value)
  },

  yearChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    var that = this;
    var markList = wx.getStorageSync('markArray');
    that.setData({
      yearIndex: e.detail.value
    })
    var setList = [];
    var i = 0;
    if (e.detail.value == "全部") {
      that.setData({
        markList: markList
      })
    } else {
      for (let index = 0; index < markList.length; index++) {
        let elem = markList[index];
        if (elem.markYear == e.detail.value && elem.markValue != '0') {
          setList[i] = elem;
          setList[i++].checked = false;
        }
      }
      that.setData({
        markList: setList
      })
    }
  },

  checkboxChange: function (e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var that = this;
    that.setData({
      classIndex: e.detail.value
    })
    var setList = [];
    var tempList = [];
    var setCountData = [];
    var i = 0;
    var markList = wx.getStorageSync('markArray');
    if (that.data.yearIndex != "全部") {
      for (let index = 0; index < markList.length; index++) {
        let elem = markList[index];
        if (elem.markYear == that.data.yearIndex) {
          tempList[i++] = elem;
        }
      }
      markList = tempList;
    }
    //console.log(markList);
    i = 0;
    for (let indexO = 0; indexO < markList.length; indexO++) {
      let elem = markList[indexO];
      for (let indexI = 0; indexI < e.detail.value.length; indexI++) {
        let evem = e.detail.value[indexI];
        if (elem.markClass == evem && elem.markValue != '0') {
          setList[i] = elem;
          setCountData[i] = elem.markNumber;
          setList[i++].checked = true;
          continue;
        }
      }
    }
    //console.log(setCountData)
    that.setData({
      markList: setList,
      countIndex: setCountData
    })
  },

  markChange: function (e) {
    var that = this;
    //console.log(e.detail.value)
    that.setData({
      countIndex: e.detail.value
    })
  },

  countMark: function () {
    var that = this;
    var countArry = that.data.countIndex;
    if (that.data.yearIndex == '') {
      that.setData({
        modalName: 'yearModal'
      })
    } else if (countArry.length == 0) {
      that.setData({
        modalName: 'sourceModal'
      })
    } else {
      var markList = wx.getStorageSync('markArray');
      var countList = [];
      var i = 0;
      for (let index = 0; index < markList.length; index++) {
        let elem = markList[index];
        for (let indexI = 0; indexI < countArry.length; indexI++) {
          if (elem.markNumber == countArry[indexI] && elem.markValue != '0') {
            countList[i++] = elem;
          }
        }
      }
      var countMark = 0, countValue = 0;
      for (let index = 0; index < countList.length; index++) {
        let elem = countList[index];
        countMark += parseFloat(elem.markWidget) * parseFloat(elem.markValue);
        countValue += parseFloat(elem.markWidget);
      }
      var averMark = countMark / countValue;
      console.log(averMark.toFixed(3))
      that.setData({
        countResult: averMark.toFixed(2),
      })
      var mark = averMark.toFixed(2);
      var i = 0;
      showMark();
      function showMark() {
        if (i < 2) {
          setTimeout(function () {
            that.setData({
              countResult: i.toFixed(1),
            })
            i = i + 0.1
            //console.log(i)
            showMark()
          }, 20)
        } else {
          that.setData({
            countResult: mark,
          })
        }
      }
    }
  },

  showMark: function () {
    var that = this;
    var mark = that.data.countResult;
    if (i < 20) {
      setTimeout(function () {
        that.setData({
          visitTotal: i,
          starCount: i
        })
        i++
        numDH();
      }, 20)
    } else {
      that.setData({
        visitTotal: that.coutNum(that.data.visitTotal),
        starCount: that.coutNum(that.data.starCount)
      })
    }
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
    yearList = ['20' + (year + 3).toString() + '-' + '20' + (year + 4).toString(), '20' + (year + 2).toString() + '-' + '20' + (year + 3).toString(), '20' + (year + 1).toString() + '-' + '20' + (year + 2).toString(), '20' + year.toString() + '-' + '20' + (year + 1).toString(), "全部"];
    this.setData({
      yearList: yearList
    });
    // this.setData({
    //   markList: wx.getStorageSync('markArray')
    // });

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