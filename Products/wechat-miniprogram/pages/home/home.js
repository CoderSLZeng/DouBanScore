// pages/home/home.js
Page({

  data: {
    allMovies: [
      {
        title: '影院热映',
        url: 'v2/movie/in_theaters',
        movies: []
      },
      {
        title: '新片榜',
        url: 'v2/movie/new_movies',
        movies: []
      },
      {
        title: '口碑榜',
        url: 'v2/movie/weekly',
        movies: []
      },
      {
        title: '北美票房榜',
        url: 'v2/movie/us_box',
        movies: []
      },
      {
        title: 'Top250',
        url: 'v2/movie/top250',
        movies: []
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.loadData();
  },

  loadData: function() {
    for (let index = 0; index < this.data.allMovies.length; index++) {
      const obj = this.data.allMovies[index];
      obj.movies = wx.getStorageSync(obj.title) || [];

      if (obj.movies.length) {
        this.setData(this.data);
        continue;
      } 
            
      if (index == 0) {
        this.loadCity((city) => {
          this.loadNewData(index, {city: city});
        })          
      } else {
        this.loadNewData(index);
      }
    }
    
  },

  loadLocalData: function() {
    for (let index = 0; index < this.data.allMovies.length; index++) {
      let obj = this.data.allMovies[index];
      obj.movies = wx.getStorageSync(obj.title) || [];        
    }
    this.setData(this.data);
  },
  
  loadNewData: function(idx, params) {
    wx.request({
      url: wx.db.url(this.data.allMovies[idx].url),
      data: params,
      header: {'content-type':'json'},
      success: (res) => {
        const movies = res.data.subjects;
        let obj = this.data.allMovies[idx];
        for (let index = 0; index < movies.length; index++) {
          const movie = movies[index].subject || movies[index];
          this.updateMovies(movie);          
          obj.movies.push(movie);
        }
        this.setData(this.data);
        // 将movies数组缓存到本地
        wx.setStorage({
          key: obj.title,
          data: obj.movies
        });          
      },
      fail: () => {
        wx.db.toast(`获取${ this.data.allMovies[idx].title }失败`);
      }
    });
      
  },

  loadCity: function(success) {
    wx.getLocation({
      success: (res) => {
        wx.request({
          url: 'https://api.map.baidu.com/reverse_geocoding/v3/',
          data: {
            output: 'json',
            coordtype: 'wgs84ll',
            ak: '1bsIGDWb6I9ueMnQ63x5intLrWGK67c4',
            location: `${res.latitude},${res.longitude}`
          },
          success: (res) => {
            let city = res.data.result.addressComponent.city;
            city = city.substring(0, city.length - 1);
            console.log(city);
            success && success(city);
          },
          fail: () => {
            wx.db.toastError('获取城市失败');            
          }
        });          
      },
      fail: () => {
        wx.db.toastError('获取位置失败');        
      }
    });
  }, 

  updateMovies: function(movie) {
    let stars = parseInt(movie.rating.stars);
    if (stars == 0) return;

    movie.stars = {};
    movie.stars.on = parseInt(stars / 10);
    movie.stars.half = (stars - (movie.stars.on) * 10) > 0;
    movie.stars.off = parseInt((50 - stars) / 10);
  }
})