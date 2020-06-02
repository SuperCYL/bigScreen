var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');
require('./index.css')

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
    this.updateStyle();
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    data = this.data(data);
    var cfg = this.mergeConfig(config);
    this.createrHtml(data);

    //如果有需要的话,更新样式
    this.updateStyle();
  },
  createrHtml:function(data){
    var html=`<div id="wbwbRealTimeContentTable">`
      //table1
        html+=`<table class="table1">
          <thead>
            <tr>`
              if(data[0]["contentType"] == 1){ //微信
                html+=`<th style="width:10%">排行</th>
                <th style="width:60%">标题</th>
                <th style="width:10%">阅读数</th>
                <th style="width:20%">WCI指数</th>`
              }
              else if(data[0]["contentType"] == 2){ //抖音
                html+=`<th style="width:10%">排行</th>
                <th style="width:50%">标题</th>
                <th style="width:10%">点赞数</th>
                <th style="width:10%">评论数</th>
                <th style="width:20%">DCI指数</th>
                `
              }
              else if(data[0]["contentType"] == 3){ //微博
                html+=`<th style="width:10%">排行</th>
                <th style="width:50%">标题</th>
                <th style="width:10%">点赞数</th>
                <th style="width:10%">评论数</th>
                <th style="width:20%">BCI指数</th>
                `
              }
              else if(data[0]["contentType"] == 3){ //头条
                html+=`<th style="width:10%">排行</th>
                <th style="width:50%">标题</th>
                <th style="width:10%">点赞数</th>
                <th style="width:0%">阅读量</th>
                <th style="width:20%">TGI指数</th>
                `
              }

              html+=` </tr>
              </thead>
              <tbody>`
           
          

            for(var i=0;i<data.length;i++){
              if(i<12){
                   html+=`<tr class="haveData">`
                  if(i==0){
                    html+=`<td style="position:relative;"><img src="http://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/e4f45fe6a9db8e0fc5b97919c59c5917.png" /></td>`     
                  }
                  else if(i==1){
                    html+=`<td style="position:relative;"><img src="http://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/a7386c344b863989d5dd6debb8073c33.png" /></td>`    
                  }
                  else if(i==2){
                    html+=`<td style="position:relative;"><img src="http://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/c62dc5c8fdaa7d8ef289b3d39bb12936.png" /></td>`   
                  }else{
                    html+=`<td>${i+1}</td>` 
                  }
                  html+=`<td class="title">${data[i]["title"]}</td>`
                if(data[i]["contentType"] == 1){
                  html+=`<td>${data[i]["readNum"]}</td>`
                  html+=`<td>${data[i]["score"]}</td>`
                }
                else if(data[i]["contentType"] == 2 || data[i]["contentType"] == 3){
                  html+=`<td>${data[i]["attitudesNum"]}</td>`
                  html+=`<td>${data[i]["commentNum"]}</td>`
                  html+=`<td>${data[i]["score"]}</td>`
                }
                else if(data[i]["contentType"] == 4){
                  html+=`<td>${data[i]["attitudesNum"]}</td>`
                  html+=`<td>${data[i]["readNum"]}</td>`
                  html+=`<td>${data[i]["score"]}</td>`
                }
                html+=`</tr>`

              }
            }

            for(var i= data.length;i<12;i++){
              if(data[0]["contentType"] == 1){
                html+=`<tr><td></td><td></td><td></td><td></td></tr>`
              }else{
                html+=`<tr><td></td><td></td><td></td><td></td><td></td></tr>`
              }
             
            }
              
          html+=`</<tbody></table>`

        //table2
        html+=`<table class="table2">
        <thead>
          <tr>`
            if(data[0]["contentType"] == 1){ //微信
              html+=`<th style="width:10%">排行</th>
              <th style="width:60%">标题</th>
              <th style="width:10%">阅读数</th>
              <th style="width:20%">WCI指数</th>`
            }
            else if(data[0]["contentType"] == 2){ //抖音
              html+=`<th style="width:10%">排行</th>
              <th style="width:50%">标题</th>
              <th style="width:10%">点赞数</th>
              <th style="width:10%">评论数</th>
              <th style="width:20%">DCI指数</th>
              `
            }
            else if(data[0]["contentType"] == 3){ //微博
              html+=`<th style="width:10%">排行</th>
              <th style="width:50%">标题</th>
              <th style="width:10%">点赞数</th>
              <th style="width:10%">评论数</th>
              <th style="width:20%">BCI指数</th>
              `
            }
            else if(data[0]["contentType"] == 3){ //头条
              html+=`<th style="width:10%">排行</th>
              <th style="width:50%">标题</th>
              <th style="width:10%">点赞数</th>
              <th style="width:0%">阅读量</th>
              <th style="width:20%">TGI指数</th>
              `
            }

            html+=` </tr>
            </thead>
            <tbody>`
          

            for(var i=12;i<data.length;i++){
              if(i>12){
                html+=`<tr class="haveData">`
                html+=`<td>${i}</td>` 
                html+=`<td class="title">${data[i]["title"]}</td>`
                if(data[i]["contentType"] == 1){
                  html+=`<td>${data[i]["readNum"]}</td>`
                  html+=`<td>${data[i]["score"]}</td>`
                }
                else if(data[i]["contentType"] == 2 || data[i]["contentType"] == 3){
                  html+=`<td>${data[i]["attitudesNum"]}</td>`
                  html+=`<td>${data[i]["commentNum"]}</td>`
                  html+=`<td>${data[i]["score"]}</td>`
                }
                else if(data[i]["contentType"] == 4){
                  html+=`<td>${data[i]["attitudesNum"]}</td>`
                  html+=`<td>${data[i]["readNum"]}</td>`
                  html+=`<td>${data[i]["score"]}</td>`
                }
                html+=`</tr>`
              }
            }
            if(data.length < 12){
              for(var i= 0;i<12;i++){
                if(data[0]["contentType"] == 1){
                  html+=`<tr><td></td><td></td><td></td><td></td></tr>`
                }else{
                  html+=`<tr><td></td><td></td><td></td><td></td><td></td></tr>`
                }
              }
            }else{
              for(var i= data.length;i<25;i++){
                if(data[0]["contentType"] == 1){
                  html+=`<tr><td></td><td></td><td></td><td></td></tr>`
                }else{
                  html+=`<tr><td></td><td></td><td></td><td></td><td></td></tr>`
                }
              }
            }
            
              
          html+=`</<tbody></table>` 

        html+=`</div>`
        this.container.html(html);
        //图表1执行
        this.tableOneEvent(data,-1); 
  },
  tableOneEvent:function(data,arriver){
    window.clearInterval(wbTime1);
    console.log(wbTime1)
    let that = this;
    let trlength = $("#wbRealTimeContentTable .table1 tbody .haveData").length;
    let index = 0;
    var wbTime1 = setInterval(function(){
      let item = $("#wbRealTimeContentTable .table1 tbody tr")[index];

      if(index == 0){
        let removeItem = $("#wbRealTimeContentTable .table2 tbody tr")[arriver];
        $(removeItem).removeClass("tableActive");
      }

      $(item).addClass('tableActive');
      $(item).siblings('tr').removeClass("tableActive");
      if(index == trlength-1){
          if(data.length >12){

            that.tableTwoEvent(data,index);
            window.clearInterval(wbTime1);
          }else{
            index = 0;
          }
      }else{
        index=index+1;
      }
    },1000)
  },

  tableTwoEvent:function(data,arriver){
    window.clearInterval(wbTime2);
    console.log(wbTime2)
    let that = this;
    let trlength = $("#wbRealTimeContentTable .table2 tbody .haveData").length;
    let index = 0;
    let wbTime2 = setInterval(function(){
      let item = $("#wbRealTimeContentTable .table2 tbody tr")[index];

      if(index == 0){
        let removeItem = $("#wbRealTimeContentTable .table1 tbody tr")[arriver];
        $(removeItem).removeClass("tableActive");
      }

      $(item).addClass('tableActive');
      $(item).siblings('tr').removeClass("tableActive");
      if(index == trlength-1){

          window.clearInterval(wbTime2);
          that.tableOneEvent(data,index);

      }else{
        index=index+1;
      }
    },1500)
  },

  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
  },
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig: function (config) {
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){console.log('请实现 destroy 方法')}
});