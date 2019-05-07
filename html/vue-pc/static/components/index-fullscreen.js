var fullscreen = {
    template: '  <div v-if="showFullScreenBtn" class="full-screen-btn-con">\
    <tooltip :content="value ?\'退出全屏 \' : \'全屏 \'" placement="bottom">\
      <Icon @click.native="handleChange" :type="value ? \'md-contract\' : \'md-expand\'" :size="20"></Icon>\
    </tooltip>\
  </div>',
    data: function() {
        return {}
    },
    name: 'Fullscreen',
    computed: {
        showFullScreenBtn: function() {
            return window.navigator.userAgent.indexOf('MSIE') < 0
        }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleFullscreen: function() {
            var main = document.body;
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
            }
        },
        handleChange: function() {
            this.handleFullscreen();
        }
    },
    mounted: function() {
        var isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
        isFullscreen = !!isFullscreen
        document.addEventListener('fullscreenchange', function() {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        }.bind(this));
        document.addEventListener('mozfullscreenchange', function() {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        }.bind(this));
        document.addEventListener('webkitfullscreenchange', function() {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        }.bind(this));
        document.addEventListener('msfullscreenchange', function() {
            this.$emit('input', !this.value);
            this.$emit('on-change', !this.value);
        }.bind(this));
        this.$emit('input', isFullscreen);
    }
}



// <style lang="less">
// .full-screen-btn-con .ivu-tooltip-rel{
//   height: 64px;
//   line-height: 56px;
//   i{
//     cursor: pointer;
//   }
// }
// </style>