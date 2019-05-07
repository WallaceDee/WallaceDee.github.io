<template>
  <div>
    <div class="page-demo">
      <mt-header title="demo">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
        <mt-button slot="right" v-on:click="openMenu" ref="button">
          <i class="icon-search"></i>
        </mt-button>
      </mt-header>
      <div class="content">
        <div class="slide-nav">
          <ul v-on:click="switchTab">
            <li class="active" id="all">全部</li>
            <li id="ready">未出发</li>
            <li id="ing">行程中</li>
            <li id="over">已完成</li>
            <li id="commit">已提交审批</li>
          </ul>
        </div>
        <mt-navbar v-model="selected">
          <mt-tab-item id="all">全部</mt-tab-item>
          <mt-tab-item id="ready">未出发</mt-tab-item>
          <mt-tab-item id="ing">行程中</mt-tab-item>
        </mt-navbar>
        <div class="details-list">
          <mt-cell title="起点" value="清晖园"></mt-cell>
          <mt-cell title="终点" value="华南家电研究院"></mt-cell>
          <mt-cell title="出发时间" value="2017-03-23 11:32"></mt-cell>
          <mt-cell title="到达时间" value="2017-03-23 11:32"></mt-cell>
          <mt-cell title="车辆" value="湘T22333(公车)"></mt-cell>
          <mt-cell title="预计里程" value="23km"></mt-cell>
          <mt-cell title="实际里程" value="0.5km"></mt-cell>
          <mt-cell title="轨迹">
            <a href="">查看轨迹</a>
          </mt-cell>
        </div>
        <div class="stroke border-top">
          <mt-cell title="轨迹1" value="实际里程:5km"></mt-cell>
          <a href="">点击查看</a>
          <ul>
            <li>
              <span>清晖园</span>
            </li>
            <li>
              <span>华南家电研究院综合楼华南家电研究院综合楼华南家电研究院综合楼</span>
            </li>
          </ul>
        </div>
        <div class="stroke border-top">
          <mt-cell title="轨迹2" value="实际里程:5km"></mt-cell>
          <a href="">点击查看</a>
          <ul>
            <li>
              <span>清晖园</span>
            </li>
            <li>
              <span>华南家电研究院综合楼华南家电研究院综合楼华南家电研究院综合楼</span>
            </li>
          </ul>
        </div>
        <div class="process-list list-block media-list">
          <ul>
            <li class="item-content">
              <div class="item-media">
                <span style="background-image: url(./static/img/default_avatar.png)"></span>
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title">于海
                    <span>发起</span>
                  </div>
                  <div class="item-after">2018/03/02 10:08</div>
                </div>
              </div>
            </li>
            <li class="item-content">
              <div class="item-media">
                <span style="background-image: url(./static/img/default_avatar.png)"></span>
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title">唐同学
                    <span class="green">已同意</span>
                  </div>
                  <div class="item-after">2018/03/02 10:08</div>
                </div>
              </div>
            </li>
            <li class="item-content">
              <div class="item-media">
                <span style="background-image: url(./static/img/default_avatar.png)"></span>
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title">我
                    <span class="yellow">审批中</span>
                  </div>
                  <div class="item-after">2018/03/02 10:08</div>
                </div>
              </div>
            </li>
            <li class="item-content">
              <div class="item-media">
                <span style="background-image: url(./static/img/default_avatar.png)"></span>
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title">王五
                    <span class="gray">待审批</span>
                  </div>
                  <div class="item-after">2018/03/02 10:08</div>
                </div>
              </div>
            </li>
            <li class="item-content">
              <div class="item-media">
                <span style="background-image: url(./static/img/default_avatar.png)"></span>
              </div>
              <div class="item-inner">
                <div class="item-title-row">
                  <div class="item-title">张某某
                    <span class="red">已拒绝</span>
                  </div>
                  <div class="item-after">2018/03/02 10:08</div>
                </div>
                <div class="item-text">此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容此处是文本内容</div>
              </div>
            </li>
          </ul>
        </div>
        <button v-on:click="openPicker">日历年月</button>
        <div class="cell-swipe-list" style="background-color:#fff; ">
          <mt-cell-swipe title="标题文字" :right="[{
      content: 'Delete',
      style: { background: 'red', color: '#fff' },
      handler: () => this.$messagebox('delete')
    }
  ]"><a href="">阿强</a></mt-cell-swipe>
        </div>
      </div>
    </div>
    <mt-popup v-model="menuVisible" popup-transition="popup-fade" class="menu-popup" :style="{ top: buttonBottom }">
      <ul>
        <li>
          <a href="">
            <i class="icon-search"></i>司机登记</a>
        </li>
        <li>
          <a href="">
            <i class="icon-search"></i>重复行程管理</a>
        </li>
      </ul>
    </mt-popup>
    <mt-datetime-picker class="date-yyyy-mm" ref="picker" v-model="pickerVisible" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
    </mt-datetime-picker>
  </div>
</template>
<script>
export default {
  name: 'demo',
  data() {
    return {
      selected: 'all',
      menuVisible: false,
      buttonBottom: 0,
      pickerVisible: false,
      slots: ['1', '2']
    }
  },
  watch: {
    selected(val, oldVal) {
      const currElement = document.querySelector('.active')
      currElement.className = ''
      let clickElement = document.querySelector('.slide-nav').querySelector('#' + val)
      clickElement.className = 'active'
    }
  },
  methods: {
    openPicker() {
      this.$refs.picker.open()
    },
    switchTab(e) {
      if (e.target.tagName === 'LI') {
        this.selected = e.target.id
      }
    },
    openMenu() {
      this.menuVisible = true
    }
  },
  mounted() {
    this.buttonBottom = this.$refs.button.$el.getBoundingClientRect().bottom + 1.5 + 'px'
  }
}

</script>
<style lang="less" scoped>
.details-list {
  margin-top: 10px;
}

.process-list {
  margin-top: 10px;
}

.slide-nav {
  background-color: #fff;
  overflow: auto;
  height: 30px;
  overflow: hidden;
  padding: 0 10px;
  ul {
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
  li {
    list-style: none;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 14px;
    display: inline-table;
    vertical-align: top;
    position: relative;
    color: @grayFont;
    &.active {
      color: @supportColor;
      &:before {
        content: "";
        display: block;
        height: 2px;
        width: 80%;
        background-color: @supportColor;
        position: absolute;
        bottom: 0;
        left: 10%;
      }
    }
  }
}

</style>
