var BndPicker = {
    name: 'BndPicker',
    template: '<div><tree ref="tree" :class="{\'drawer-box\':multiple}" :multiple="multiple" :data="treeData" @on-select-change="onSelectChange"></tree><spin size="large" fix v-if="treeLoading"></spin></div>',
    data: function () {
        return {
            treeLoading: false,
            treeData: [],
            url: {
                'job': '/companycenter/comPosition/pc/v1/queryComPositionTree',
                'department': '/companycenter/comDepartment/pc/v1/queryComDepartmentTree',
                'employee': ''
            }
        }
    },
    props: {
        type: {
            type: String,
            default: 'department'
        },
        companyId: {
            type: String,
            default: undefined
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    mounted: function () {
        this.loadData();
    },
    methods: {
        getSelectedNodes: function () {
            return this.$refs.tree.getSelectedNodes();
        },
        onSelectChange: function (data) {
            this.$emit('on-change', data);
        },
        loadData: function () {
            this.treeLoading = true;
            this.$utils.ajax({
                url: this.url[this.type],
                data: {
                    companyId: this.companyId || window.userInfo.companyId
                },
                success: function (res) {
                    this.treeData = res.data;
                    this.treeLoading = false;
                }.bind(this),
                error: function (err) {
                    this.treeLoading = false;
                    console.error(err);
                }.bind(this)
            });
        }
    }
}