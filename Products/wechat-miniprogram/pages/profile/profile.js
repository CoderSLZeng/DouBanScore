// pages/profile/profile.js
Page({
  data: {
      items: [
        {
          icon: 'ic_cat_movie.png',
          title: '观影分析',
          has: '看过',
          count: 0,
          mark: '标记10部影片\n开启观影分析'
        },
        {
          icon: 'ic_cat_book.png',
          title: '读书分析',
          has: '读过',
          count: 0,
          mark: '标记10本书\n开启读书分析'
        },
        {
          icon: 'ic_cat_music.png',
          title: '音乐分析',
          count: 0,
          has: '听过',
          mark: '标记10张唱片\n开启音乐分析'
        }
      ]
  },

  openLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },

  begin: function(evt) {
    const idx = evt.currentTarget.dataset.index;
    if (idx == 0) {
        console.log('观影分析');
      } else if (idx == 1) {
        console.log('读书分析');
      } else if (idx == 2) {
        console.log('音乐分析');
    }
  }
})