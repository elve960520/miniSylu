// pages/plugin/markCount/markCount.js
const app = getApp()
Page({

  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    modalName: '',
    yearList: ['', '', '', '', ''],
    yearIndex: '',
    classList: ['全部', '专业课'],
    classIndex: '',
    markList: [], //从本地文件获取的无挂科课程
    showList: [], //显示的列表
    countList: [], //用于计算的列表
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
    // var markList = wx.getStorageSync('markArray');
    var markList = that.data.markList;
    that.setData({
      yearIndex: e.detail.value
    })
    var setList = [];
    var i = 0;
    if (e.detail.value == "全部") {
      for (let index = 0; index < markList.length; index++) {
        let elem = markList[index];
        setList[i] = elem;
        setList[i++].checked = true;
      }
      that.setData({
        showList: setList,
        countList: setList
      })
    } else {
      for (let index = 0; index < markList.length; index++) {
        let elem = markList[index];
        if (elem.markYear == e.detail.value) {
          setList[i] = elem;
          setList[i++].checked = true;
        }
      }
      that.setData({
        showList: setList,
        countList: setList
      })
    }
  },

  selectSource: function (e) {
    var that = this;
    console.log(e.detail.value)
    var countList = [];
    var showList = that.data.showList;
    that.setData({
      classIndex: e.detail.value
    })
    var i = 0;
    if (e.detail.value == "全部") {
      for (let index = 0; index < showList.length; index++) {
        showList[index].checked = true;
      }
      that.setData({
        countList: showList,
        showList: showList
      })
    } else if (e.detail.value == "专业课") {
      wx.getStorage({
        key: 'speSourceArray',
        success(res) {
          var speSourceList = res.data;
          var countList = [];
          for (let index = 0; index < showList.length; index++) {
            let elem = showList[index];
            showList[index].checked = false;
            for (let indexI = 0; indexI < speSourceList.length; indexI++) {
              let evem = speSourceList[indexI];
              if (elem.markNumber == evem) {
                showList[index].checked = true;
                countList[i++] = elem;
              }
            }
          }
          that.setData({
            countList: countList,
            showList: showList
          });
        }, fail(e) {
          that.setData({
            modalName: "speSourceModal"
          })
        }
      })
    }
  },
  markChange: function (e) { //选择/取消某个选项
    var that = this;
    // console.log(e.detail.value)
    var eList = e.detail.value;
    var showList = that.data.showList;
    var countList = [];
    var i = 0;
    for (let index = 0; index < eList.length; index++) {
      let elem = eList[index];
      // console.log(Number(elem))
      countList[i++] = showList[Number(elem)]
    }
    that.setData({
      countList: countList
    })
  },


  countMark: function () {
    var that = this;
    var countList = that.data.countList;
    if (countList.length == 0) {
      that.setData({
        modalName: "sourceModal"
      })
      return;
    }
    console.log(countList);
    var countArray = [];
    var flag = false;
    for (let index = 0; index < countList.length; index++) {
      let elem = countList[index];
      flag = false;
      if (countArray.length == 0) {
        countArray.push(elem);
        continue;
      }
      for (let indexI = 0; indexI < countArray.length; indexI++) {
        let evem = countArray[indexI];
        if (elem.markNumber == evem.markNumber) {
          flag = true;
          console.log(elem.markStatus);
          if (elem.markValue > evem.markValue)
            countArray[indexI].markValue = elem.markValue;
        }
      }
      if (!flag) {
        countArray.push(elem)
      }
    }
    var countMark = 0, countValue = 0;
    for (let index = 0; index < countArray.length; index++) {
      let elem = countArray[index];
      countMark += parseFloat(elem.markWidget) * parseFloat(elem.markValue);
      countValue += parseFloat(elem.markWidget);
    }
    var averMark = countMark / countValue;
    console.log(averMark.toFixed(3))
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://sylucloud.cn/getSpeSource',
      data: {
        xuehao: wx.getStorageSync('xuehao'),
        mima: wx.getStorageSync('mima')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'post',
      success(res) {
        //wx.hideLoading()
        console.log(res.data)
        if (res.data.length != 0) {
          wx.setStorage({
            key: 'speSourceArray',
            data: res.data,
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var xuehao = wx.getStorageSync('xuehao')
    var year = Number(xuehao.slice(0, 2));
    var yearList = [];
    yearList = ['20' + (year + 4).toString() + '-' + '20' + (year + 5).toString(), '20' + (year + 3).toString() + '-' + '20' + (year + 4).toString(), '20' + (year + 2).toString() + '-' + '20' + (year + 3).toString(), '20' + (year + 1).toString() + '-' + '20' + (year + 2).toString(), '20' + year.toString() + '-' + '20' + (year + 1).toString(), "全部"];
    this.setData({
      yearList: yearList
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var markList = wx.getStorageSync('markArray');
    let tempMarkList = [];
    let i = 0;
    for (let index = 0; index < markList.length; index++) {
      let elem = markList[index];
      if (elem.markValue != '0') {
        tempMarkList[i++] = elem;
      }
    }
    this.setData({
      markList: tempMarkList
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