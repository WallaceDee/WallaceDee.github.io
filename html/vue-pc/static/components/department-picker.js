var BndDepartmentPicker = {
    template: '<card class="company-tree-wrapper auto-height">\
                            <row slot="title" class="title-wrapper">\
                                <i-col span="12">\
                                    <icon type="ios-people"></icon>\
                                    {{title}}\
                                </i-col>\
                                <i-col span="12">\
                                 <slot name="button"></slot>\
                                </i-col>\
                            </row>\
                            <spin size="large" fix v-if="treeLoading"></spin>\
                            <tree :data="treeData" ref="tree" :render="renderContent" @on-select-change="onSelectChange"></tree>\
                        </card>',
    data: function () {
        return {
            treeData: [],
            treeLoading: false,
            url: {
                'job': '/companycenter/comPosition/pc/v1/queryComPositionTree',
                'department': '/companycenter/comDepartment/pc/v1/queryComDepartmentTree',
                'employee': ''
            }
        }
    },
    name: 'BndDepartmentPicker',
    computed: {},
    props: {
        companyId: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: '组织架构'
        },
        type: {
            type: String,
            default: 'department'
        },
        params:{
            coerce: function (val) {
                return JSON.parse(val)
            }
        },
        autoFocus: {
            type: Boolean,
            default: true
        }
    },
    mounted: function () {
        this.loadData();
    },
    methods: {
        getSelectedNodes: function () {
            return this.$refs.tree.getSelectedNodes()
        },
        getData: function () {
            return this.treeData
        },
        onSelectChange: function (data) {
            var currentDepartment;
            if (data.length) {
                currentDepartment = data[0];
            } else {
                currentDepartment = null;
            }
            this.$emit('on-change', currentDepartment);
        },
        renderContent: function (h, o) {
            return h('span', {
                class: ['ivu-tree-title', {
                    'ivu-tree-title-selected': o.data.selected
                }],
                on: {
                    click: function (e) {
                        if (o.data.disabled || o.data.selected) {
                            return false;
                        }
                        this.$refs.tree.handleSelect(o.data.nodeKey);
                    }.bind(this)
                }
            }, o.data.title + '(' + o.data.empNum + ')');
        },
        loadData: function () {
            var data = {companyId: this.companyId || window.userInfo.companyId}
            if(this.params){
                for(var i in this.params){
                    data[i] = this.params[i]
                }
            }
            this.treeLoading = true;
            this.$utils.ajax({
                url: this.url[this.type],
                data: data,
                success: function (res) {
                    this.treeData = res.data;
                    if (this.treeData && this.treeData.length && this.autoFocus) {
                        this.$set(this.treeData[0], 'selected', true);
                        this.$nextTick(function () {
                            this.$emit('on-change', this.$refs.tree.getSelectedNodes()[0]);
                        }.bind(this));
                    }
                    this.treeLoading = false;
                }.bind(this),
                error: function (err) {
                    this.treeLoading = false;
                }.bind(this)
            })
        },
    }
}