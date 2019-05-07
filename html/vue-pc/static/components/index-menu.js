var BndMenu = {
    name: 'BndMenu',
    template: ' <div class="menu"  :style="{\'min-width\':menuItemWidth+40+\'px \'}">\
                            <row >\
                                <i-col span="24" ref="menu">\
                                    <div class="wrapper">\
                                        <icon type="ios-arrow-back" v-show="isScroll" @click="menuBack"></icon>\
                                        <icon type="ios-arrow-forward" v-show="isScroll" @click="menuForward"></icon>\
                                        <i-menu mode="horizontal" :active-name="activeName" :style="{width:list.length*menuItemWidth+\'px \'}" class="menu-wrapper" @on-select="onMenuChange">\
                                            <menu-item :name="index" v-for="(item,index) in list" v-bind:key="index">\
                                                <icon :type="item.logo"></icon>\
                                                <p>{{item.name}}</p>\
                                            </menu-item>\
                                        </i-menu>\
                                    </div>\
                                </i-col>\
                             </row>\
                        </div>',
    data: function () {
        return {
            menuItemWidth: 90,
            isScroll: false,
            list: [{ name: '', icon: '', label: '' }],
            activeName: 0
        }
    },
    props: {
        isPlatform: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        // list: function (val) {
        //     console.log(val)
        //     this.getChildren(val.id);
        // }
    },
    mounted: function () {
        this.adjust();
        window.addEventListener('resize', this.adjust);
        this.getResourceMenu()
    },
    methods: {
        getResourceMenu: function () {
            this.$utils.ajax({
                method: 'get',
                url: this.isPlatform ? '/platformcenter/resource/app/pc/v1/list' : '/companycenter/resource/app/pc/v1/list',
                success: function (res) {
                    if (res.data) {
                        this.list = res.data;
                        if (this.list.length) {
                            this.getChildren(this.list[0].id);
                        }
                    }
                }.bind(this)
            })
        },
        getChildren: function (appId) {
            this.$utils.ajax({
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'get',
                url: this.isPlatform ? '/platformcenter/resource/menu/pc/v1/list' : '/companycenter/resource/menu/pc/v1/list',
                data: {
                    appId: appId
                },
                success: function (res) {
                    this.$emit('on-change', res.data);
                    // alert(1)
                }.bind(this)
            })
        },
        onMenuChange: function (name) {
            var data = this.list[name];
            this.getChildren(data.id);
        },
        adjust: function () {
            if (this.$refs.menu) {
                this.isScroll = this.list.length * this.menuItemWidth >= this.$refs.menu.$el.offsetWidth;
                if (this.isScroll) {
                    document.querySelector('.menu-wrapper').style.transform = 'translateX(0px)'
                }
            }
        },
        menuBack: function () {
            var $el = document.querySelector('.menu-wrapper');
            var currentOffsetLeft;
            if ($el.style.transform) {
                currentOffsetLeft = $el.style.transform.match(/translateX\((\S*)px\)/)[1] * 1;
            } else {
                currentOffsetLeft = 0
            }
            if (currentOffsetLeft === 0) {
                return false
            }
            $el.style.transform = 'translateX(' + (currentOffsetLeft + this.menuItemWidth) + 'px)';
        },
        menuForward: function () {
            var $el = document.querySelector('.menu-wrapper');
            var currentOffsetLeft;
            if ($el.style.transform) {
                currentOffsetLeft = $el.style.transform.match(/translateX\((\S*)px\)/)[1] * 1;
            } else {
                currentOffsetLeft = 0
            }
            var wrapperWidth = parseInt($el.offsetWidth); // 
            if (currentOffsetLeft <= -(wrapperWidth - document.querySelector('.wrapper').offsetWidth)) {
                return false
            }
            $el.style.transform = 'translateX(' + (currentOffsetLeft - this.menuItemWidth) + 'px)';
        }
    }
}