var BndPage = {
    template: '<page :current="current" :page-size="pageSize" :size="size" :total="total" @on-change="onPageChange" @on-page-size-change="onPageSizeChange" :simple="isSimple" :show-total="showTotal" :show-sizer="showSizer" ref="page"></page>',
    data: function () {
        return {
            isSmall: false,
            isSimple: false,
            showTotal: true,
            showSizer: true
        }
    },
    name: 'BndPage',
    computed: {
        size: function () {
            if (this.isSmall) {
                return 'small'
            } else {
                return null
            }
        }
    },
    props: {
        total: {
            type: Number,
            default: 0
        },
        current: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        }
    },
    methods: {
        adjust: _.debounce(function () {
            var parent = this.$refs.page.$el.parentElement;
            var parentStyle = parent.currentStyle ? parent.currentStyle : document.defaultView.getComputedStyle(parent, null);
            var outerWidth = parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.paddingRight) + parseInt(parentStyle.marginRight) + parseInt(parentStyle.marginLeft);
            var width = parent.offsetWidth - outerWidth;
            // console.log(width)
            if (width >= 640) {
                this.isSmall = false;
                this.isSimple = false;
                this.showSizer = true;
                this.showTotal = true;
            } else if (width < 640 && width >= 520) {
                this.isSmall = true;
                this.isSimple = false;
                this.showSizer = true;
                this.showTotal = true;
            } else if (width < 520 && width >= 430) {
                this.isSmall = true;
                this.isSimple = false;
                this.showSizer = false;
                this.showTotal = false;
            } else if (width < 430 && width >= 330) {
                this.isSmall = true;
                this.isSimple = false;
                this.showSizer = false;
                this.showTotal = false;
            } else if (width < 330) {
                this.isSimple = true
            }
        }, 200),
        onPageSizeChange: function (size) {
            this.$emit('on-page-size-change', size);
        },
        onPageChange: function (index) {
            this.$emit('update:current', index);
            this.$emit('on-change', index);
        }
    },
    mounted: function () {
        // this.adjust();
        window.addEventListener('resize', this.adjust);
    }
}