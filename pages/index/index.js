//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    xuehao: '',
    mima: '',
    modalName: null
  },

  setXuehao: function(e) {
    this.setData({
      xuehao: e.detail.value
    });
    wx.setStorage({
      key: 'xuehao',
      data: e.detail.value,
    })
  },
  setMima: function(e) {
    this.setData({
      mima: e.detail.value
    });
    wx.setStorage({
      key: 'mima',
      data: e.detail.value,
    })
  },

  onLoad: function() {
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  getUserInfo: function(e) {
    var indexPage = this;
    if (!this.logged && e.detail.userInfo) {
      wx.showLoading({
        title: '验证学号密码...',
      })
      wx.request({
        url: 'https://sylucloud.cn/checkStudentAccount',
        data: {
          xuehao: this.data.xuehao,
          mima: this.data.mima
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'post',
        success(res) {
          wx.hideLoading()
          console.log(res.data)
          wx.setStorage({
            key: 'checkedAccount',
            data: res.data.account,
          })
          wx.setStorage({
            key: 'name',
            data: res.data.name,
          })
          if (res.data.account) {
            indexPage.setData({
              modalName: 'Modal'
            });
            //获取成绩
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
                //wx.hideLoading()
                console.log(res.data)
                wx.setStorage({
                  key: 'markArray',
                  data: res.data,
                })
              }
            });
            //获取课表
            wx.request({
              url: 'https://sylucloud.cn/getSource',
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
                wx.setStorage({
                  key: 'sourceArray',
                  data: res.data,
                })
              }
            });
            //获取专业课列表
            setTimeout(function() {
              wx.switchTab({
                url: '/pages/source/source',
              })
            }, 1500)
          } else {
            indexPage.setData({
              modalName: 'errModal'
            })
          }
        }
      })
    }
  }
})