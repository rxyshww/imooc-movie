var postsData = require('../../../data/posts-data.js').postList;
var app = getApp();

// pages/posts/post-detail/post-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData[postId];

    this.setData({ postData });

    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId] || false;
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }

    this.setAudioMonitor();
  },

  setAudioMonitor() {
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isPlayingMusic: true
      })

      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
    })

    wx.onBackgroundAudioPause(() => {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_currentMusicPostId = null
    })
  },

  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];

    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;

    this.showToast(postsCollected, postCollected);

    // this.showModal(postsCollected, postCollected)


  },

  showToast(postsCollected, postCollected) {

    wx.setStorageSync('posts_collected', postsCollected);

    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000
    })
  },

  showModal(postsCollected, postCollected) {
    wx.showModal({
      title: "收藏",
      content: postCollected ? "是否收藏该文章?" : "取消收藏该文章?",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: (res) => {
        if (res.confirm) {

          wx.setStorageSync('posts_collected', postsCollected);

          this.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  onShareTap(event) {
    var itemList= [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: (res) => {
        wx.showModal({
          title: "用户" + itemList[res.tapIndex],
          content: "现在无法实现分享功能"
        })
      }
    })
  },


  onMusicTap(event) {
    var currentPostId = this.data.currentPostId;

    var isPlayingMusic = this.data.isPlayingMusic;

    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();

      this.setData({
        isPlayingMusic: false
      })
  
    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData[currentPostId].music.url,
        title: postsData[currentPostId].music.title,
        coverImgUrl: postsData[currentPostId].music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
    
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