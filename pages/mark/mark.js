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
      ['2018-2019', '2017-2018', '2016-2017', '2015-2016'],
      ['第一学期', '第二学期'],
    ],
    markArray:[{
        name:'通信原理',
        mark:95
      },{
        name: '毛泽东特色中国社会主义理论体系',
        mark: 95
      },{
        name: '电磁学',
        mark: 65
      },{
        name: '计算机网络',
        mark: 55
      }, {
        name: '可乐鸡翅',
        mark: 68
      }, {
        name: '烧茄子',
        mark: 98
      }, {
        name: '宫保鸡丁',
        mark: 45
      }, {
        name: '鱼香肉丝',
        mark: 85
      }
    ],
    multiIndex : [0,0]
  },

  MultiChange:function(e){
    this.setData({
      multiIndex: e.detail.value
    })
  }, 
  
  // MultiColumnChange(e) {
  //   let data = {
  //     multiArray: this.data.multiArray,
  //     multiIndex: this.data.multiIndex
  //   };
  //   data.multiIndex[e.detail.column] = e.detail.value;
  //   switch (e.detail.column) {
  //     case 0:
  //       switch (data.multiIndex[0]) {
  //         case 0:
  //           data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
  //           data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
  //           break;
  //         case 1:
  //           data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
  //           data.multiArray[2] = ['鲫鱼', '带鱼'];
  //           break;
  //       }
  //       data.multiIndex[1] = 0;
  //       data.multiIndex[2] = 0;
  //       break;
  //     case 1:
  //       switch (data.multiIndex[0]) {
  //         case 0:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
  //               break;
  //             case 1:
  //               data.multiArray[2] = ['蛔虫'];
  //               break;
  //             case 2:
  //               data.multiArray[2] = ['蚂蚁', '蚂蟥'];
  //               break;
  //             case 3:
  //               data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
  //               break;
  //             case 4:
  //               data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
  //               break;
  //           }
  //           break;
  //         case 1:
  //           switch (data.multiIndex[1]) {
  //             case 0:
  //               data.multiArray[2] = ['鲫鱼', '带鱼'];
  //               break;
  //             case 1:
  //               data.multiArray[2] = ['青蛙', '娃娃鱼'];
  //               break;
  //             case 2:
  //               data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
  //               break;
  //           }
  //           break;
  //       }
  //       data.multiIndex[2] = 0;
  //       break;
  //   }
  //   this.setData(data);
  // },

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