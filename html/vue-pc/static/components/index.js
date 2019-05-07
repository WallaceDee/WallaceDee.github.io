var methods = {
    bndPicker: function (option, callback) {
        //type:job,department,employee
        var tempHtml = document.createElement('div');
        if (document.getElementById('bnd-picker-wrapper')) {
            document.body.removeChild(document.getElementById('bnd-picker-wrapper'));
        }
        tempHtml.id = "temp-html";
        tempHtml.innerHTML = '<drawer :title="title" v-model="value" width="500" id="bnd-picker-wrapper">\
                                                        <div class="drawer-footer" v-if="multiple||type===\'employee\'">\
                                                            <i-button @click="value=false">取消</i-button>\
                                                            <i-button type="primary" @click="multipleSubmit">确定</i-button>\
                                                        </div>\
                                                        <div class="drawer-box">\
                                                        <row class="auto-height">\
                                                             <i-col :span="isEmployeePicker?12:24" style="height:100%;padding-right:5px;">\
                                                                 <card class="auto-height">\
                                                                    <tree :render="renderContent" ref="tree" :multiple="type!==\'employee\'&&multiple" :data="treeData" @on-select-change="onSelectChange" ></tree>\
                                                                     <spin size="large" :fix="true" v-if="treeLoading"></spin>\
                                                                 </card>\
                                                             </i-col>\
                                                             <i-col span="12" style="height:100%;padding-left:5px;" v-if="isEmployeePicker">\
                                                              <card class="auto-height scroll-box" style="margin-bottom:10px;" :style="{\'height\':(scrollHeight+32)+\'px \'}">\
                                                                     <spin size="large" :fix="true" v-if="loading"></spin>\
                                                                     <i-input prefix="ios-search" placeholder="请输入关键字..." style="margin-bottom:10px;" v-model="username" @on-change="onSearch" clearable></i-input>\
                                                                     <scroll :on-reach-bottom="handleReachBottom" :height="scrollHeight-42" :distance-to-edge="0">\
                                                                         <div v-if="!employeeData.length" style="font-size:12px;">暂无数据</div>\
                                                                         <checkbox-group @on-change="onCheckChange" v-model="list" v-if="multiple">\
                                                                            <checkbox  style="width:70px" v-for="item in employeeData" :label="JSON.stringify(item)" v-bind:key="(item.id||item.employeeId)+item.userName">{{item.userName}}</checkbox>\
                                                                         </checkbox-group >\
                                                                         <radio-group @on-change="onCheckChange" v-model="single" v-else>\
                                                                            <radio  style="width:70px" v-for="item in employeeData" :label="JSON.stringify(item)" v-bind:key="(item.id||item.employeeId)+item.userName">{{item.userName}}</radio>\
                                                                        </radio-group >\
                                                                     </scroll>\
                                                                </card>\
                                                                <card style="margin-top:10px;overflow: auto;":style="{\'height\':\'calc( 100% - \'+(scrollHeight+32+10)+\'px )\'}">\
                                                                    <p>已选择:</p>\
                                                                    <div>{{selectedNames}}</div>\
                                                                </card>\
                                                             </i-col>\
                                                        </row>\
                                                        </div>\
                                                    </drawer>';
        document.body.appendChild(tempHtml);
        var instance = new Vue({
            el: '#temp-html',
            data: function () {
                return {
                    value: false,
                    treeLoading: false,
                    treeData: [],
                    multiple: option.multiple,
                    companyId: option.companyId,
                    title: option.title,
                    type: option.type,
                    url: {
                        'job': '/companycenter/comPosition/pc/v1/queryComPositionTree',
                        'department': '/companycenter/comDepartment/pc/v1/queryComDepartmentTree',
                        'employee': '/companycenter/comEmployee/pc/v1/queryComEmployeePage'
                    },
                    username: '',
                    callback: null,
                    loading: false,
                    employeeData: [],
                    currentDepartmentCode: '',
                    pageNum: 1,
                    pageSize: 50,
                    total: 0,
                    scrollHeight: 400,
                    list: [],
                    single: ''
                }
            },
            computed: {
                isEmployeePicker: function () {
                    return this.type === 'employee'
                },
                selected: function () {
                    var temp = [];
                    this.list.forEach(function (item) {
                        temp.push(JSON.parse(item));
                    });
                    return temp
                },
                selectedNames: function () {
                    var temp = [];
                    this.selected.forEach(function (item) {
                        temp.push(item.userName);
                    });
                    return temp.join(',');
                }
            },
            mounted: function () {
                if (option.platform) {
                    this.url = {
                        'job': '/companycenter/comPosition/pc/v1/queryComPositionTree',
                        'department': '/platformcenter/company/department/pc/v1/tree',
                        'employee': '/platformcenter/role/employee/pc/v1/page'
                    }
                }
                this.loadData();
            },
            methods: {
                renderContent: function (h, o) {
                    return h('span', {
                        class: ['ivu-tree-title', {
                            'ivu-tree-title-selected': o.data.selected
                        }],
                        on: {
                            click: function (e) {
                                if (o.data.disabled || this.multiple === false && o.data.selected) {
                                    return false;
                                }
                                console.log(o.data)
                                this.$refs.tree.handleSelect(o.data.nodeKey);
                            }.bind(this)
                        }
                    }, o.data.title + (this.isEmployeePicker ? '(' + o.data.empNum + ')' : ''));
                },
                handleReachBottom: function () {
                    return new Promise(function (resolve) {
                        this.getEmployees(resolve);
                    }.bind(this));
                },
                onCheckChange: function (val) {
                    console.log(val);
                },
                multipleSubmit: function () {
                    if (this.type === 'employee') {
                        this.value = false;
                        var result = null;
                        if (this.multiple && this.selected.length) {
                            result = this.selected;
                        } else if (this.single) {
                            result = JSON.parse(this.single);
                        } else {
                            console.log('none');
                            return false
                        }
                        this.callback(result);
                    } else {
                        var data = this.$refs.tree.getSelectedNodes();
                        if (!data.length) {
                            this.$Message.info('您还没有选择' + (this.type === 'job' ? '岗位' : this.type === 'department' ? '部门' : ''));
                        } else {
                            this.value = false;
                            this.callback(data);
                        }
                    }
                },
                onSelectChange: function (data) {
                    if (this.type === 'employee') {
                        if (data.length) {
                            this.currentDepartmentCode = data[0].attributes.code;
                            this.pageNum = 1;
                            this.getEmployees()
                            console.log(data);
                        }
                        return false;
                    }
                    if (!this.multiple) {
                        this.value = false;
                        this.callback(data);
                    }
                },
                onSearch: _.debounce(function () {
                    this.pageNum = 1;
                    this.getEmployees();
                }, 500),
                getEmployees: function (callback) {
                    this.loading = true;
                    var ajaxOption = {
                        url: this.url.employee,
                        data: {
                            companyId: this.companyId || window.userInfo.companyId,
                            deptCode: this.currentDepartmentCode,
                            userName: this.username,
                            page: this.pageNum,
                            rows: this.pageSize
                        },
                        success: function (res) {
                            if (this.pageNum === 1) {
                                this.employeeData = [];
                            }
                            this.employeeData = this.employeeData.concat(res.data.list);
                            this.loading = false;
                            this.total = res.data.total * 1;
                            if (this.employeeData.length >= this.total) {
                                //完成
                            } else {
                                this.pageNum = this.pageNum + 1;
                            }
                            if (callback !== undefined) {
                                callback();
                            }
                        }.bind(this),
                        error: function (err) {
                            this.loading = false;
                            if (callback !== undefined) {
                                callback();
                            }
                        }.bind(this)
                    }
                    if (option.platform) {
                        ajaxOption.headers = { 'Content-Type': 'application/json' }
                        ajaxOption.method = 'get';
                        ajaxOption.data = {
                            exists: false,
                            deptCode: this.currentDepartmentCode,
                            userName: this.username,
                            page: this.pageNum,
                            rows: this.pageSize
                        };
                        _.extend(ajaxOption.data, option.data);
                    }
                    this.$utils.ajax(ajaxOption);
                },
                loadData: function () {
                    this.treeLoading = true;
                    var ajaxOption = {
                        url: this.url[this.type],
                        data: {
                            companyId: this.companyId || window.userInfo.companyId
                        },
                        success: function (res) {
                            function loop(array) {
                                for (var i = 0; i < array.length; i++) {
                                    option.selected.forEach(function (item) {
                                        if (item * 1 === array[i].id * 1) {
                                            array[i].selected = true;
                                        }
                                    });
                                    if (array[i].children) {
                                        array[i].children = loop(array[i].children);
                                    }
                                }
                                return array
                            }
                            if (option.selected) {
                                console.log(loop(res.data))
                            }
                            this.treeData = res.data;
                            this.treeLoading = false;
                            if (this.treeData && this.treeData.length) {
                                if (this.type === 'employee') {
                                    this.$set(this.treeData[0], 'selected', true);
                                    this.getEmployees();
                                }
                            }
                        }.bind(this),
                        error: function (err) {
                            this.treeLoading = false;
                            console.error(err);
                        }.bind(this)
                    };
                    if (this.type === 'employee') {
                        ajaxOption.url = this.url.department
                    }
                    if (option.platform) {
                        ajaxOption.headers = { 'Content-Type': 'application/json' }
                        ajaxOption.method = 'get';
                        ajaxOption.data = {};
                    }
                    this.$utils.ajax(ajaxOption);
                }
            }
        });
        instance.callback = option.callback;
        instance.value = true;
        document.body.removeChild(document.getElementById('temp-html'));
    },
    permissionTree: function (option, callback) {
        if (document.getElementById('permission-tree-wrapper')) {
            document.body.removeChild(document.getElementById('permission-tree-wrapper'));
        }
        var tempHtml = document.createElement('div');
        tempHtml.id = "temp-html";
        tempHtml.innerHTML = '<drawer :title="title" v-model="value" width="80%" id="permission-tree-wrapper">\
                                                         <div class="drawer-footer" v-if="!isDisabled">\
                                                            <i-button @click="closeDrawer">取消</i-button>\
                                                            <i-button type="primary" @click="submit">提交</i-button>\
                                                        </div>\
                                                        <div class="drawer-box">\
                                                            <spin fix v-if="treeLoading"></spin>\
                                                            <tabs :class="{\'is-disabled\':isDisabled}">\
                                                                <tab-pane :label="label[index]" v-for="(item,index) in treeData" v-bind:key="item.id">\
                                                                    <div style="min-width:850px;padding-left:10px;border-style:solid;border-color:#e8eaec;border-width:1px 1px 0 1px;"><span style="display:inline-block;width:203px;text-align:center;font-size:14px;">菜单</span><divider type="vertical" style="height: 32px;"></divider><span style="display:inline-block;width:300px;text-align:center;font-size:14px;">功能点</span><divider type="vertical" style="height: 32px;"></divider><span  style="display:inline-block;width:300px;text-align:center;font-size:14px;">数据权限</span></div>\
                                                                    <tree show-checkbox ref="tree" :data="treeData[index].children" :render="renderContent" class="permission-tree"></tree>\
                                                                </tab-pane>\
                                                            </tabs>\
                                                        </div>\
                                                    </drawer>';
        document.body.appendChild(tempHtml);
        var instance = new Vue({
            el: '#temp-html',
            data: function () {
                return {
                    value: false,
                    isDisabled: option.isDisabled,
                    treeLoading: false,
                    treeData: [],
                    label: [],
                    callback: null,
                    type: typeof option.roleId === 'undefined' ? 'empId' : 'roleId',
                    isAdmin: false,
                    isPlatform: option.isPlatform ? true : false
                }
            },
            computed: {
                title: function () {
                    return this.isDisabled ? '查看授权' : '授权';
                },
            },
            mounted: function () {
                this.isAdmin = option.isAdmin;
                console.log('isAdmin-' + this.isAdmin)
                this.getPermissionData(option[this.type], function (data) {
                    this.setExpand(data);
                    if (this.isDisabled) {
                        this.setDisabled(data);
                    }
                    this.treeData = data;
                    this.label = [];
                    this.treeData.forEach(function (item) {
                        console.log('(Boolean(item.checked) === true)||this.isAdmin-' + (Boolean(item.checked) === true) || this.isAdmin)
                        this.label.push(function (h) {
                            return [h('span', {
                                class: ['app-id'],
                                domProps: {
                                    'id': 'a' + item.id
                                }
                            }, [h('checkbox', {
                                    props: {
                                        'key': item.id,
                                        'disabled': this.isDisabled,
                                        'value': (Boolean(item.checked) === true) || this.isAdmin
                                    }
                                }, ''), h('icon', {
                                    props: {
                                        // type: 'logo-apple'
                                    }
                                }),
                                h('span', item.name)
                            ])]
                        }.bind(this))
                    }.bind(this));
                }.bind(this))
            },
            methods: {
                submit: function () {
                    function getCheckedIds(className) {
                        var tempList = [];
                        document.querySelectorAll(className).forEach(function (item) {
                            if (item.querySelector('input').checked) {
                                tempList.push(item.id.replace(/[abr]/g, ''))
                            }
                        });
                        return tempList;
                    }
                    var roleId = option.roleId;
                    var appIds = getCheckedIds('.app-id');
                    var resourceIds = [];
                    this.$refs.tree.forEach(function (item) {
                        var list = item.getCheckedAndIndeterminateNodes();
                        list.forEach(function (i) {
                            resourceIds.push(i.id)
                        });
                    });
                    resourceIds = resourceIds.concat(getCheckedIds('.button-id'));
                    // var dataroleIds = getCheckedIds('.role-id');
                    var dataroleIds = {};
                    document.querySelectorAll('.ivu-tree-title').forEach(function (item) {
                        function getCheckedIdsWithParent($ele, className) {
                            var tempList = [];
                            $ele.querySelectorAll(className).forEach(function (item) {
                                if (item.querySelector('input').checked) {
                                    tempList.push(item.id.replace(/[abr]/g, ''))
                                }
                            });
                            return tempList;
                        }
                        var roles = getCheckedIdsWithParent(item, '.role-id');
                        if (roles.length) {
                            dataroleIds[item.id] = {};
                            for (var i = 0; i < roles.length; i++) {
                                dataroleIds[item.id][roles[i]] = {};
                                var $el = document.querySelector('.role-id.APPOINT_DEPARTMENT#r' + roles[i]);
                                if ($el !== null) {
                                    var value = JSON.parse($el.querySelector('input[type=hidden]').value);
                                    if (value.length) {
                                        dataroleIds[item.id][roles[i]]['APPOINT_DEPARTMENT'] = value;
                                    }
                                }
                                $el = document.querySelector('.role-id.APPOINT_POSITION#r' + roles[i]);
                                if ($el !== null) {
                                    var value = JSON.parse($el.querySelector('input[type=hidden]').value);
                                    if (value.length) {
                                        dataroleIds[item.id][roles[i]]['APPOINT_POSITION'] = value;
                                    }
                                }
                                $el = document.querySelector('.role-id.APPOINT_DEPT_AND_APPOINT_POSI#r' + roles[i]);
                                if ($el !== null) {
                                    var value = JSON.parse($el.querySelector('input[type=hidden].APPOINT_DEPARTMENT').value);
                                    if (value.length) {
                                        dataroleIds[item.id][roles[i]]['APPOINT_DEPARTMENT'] = value;
                                    }
                                    value = JSON.parse($el.querySelector('input[type=hidden].APPOINT_POSITION').value);
                                    if (value.length) {
                                        dataroleIds[item.id][roles[i]]['APPOINT_POSITION'] = value;
                                    }
                                }
                            }
                        }
                    });
                    console.log({
                        roleId: roleId,
                        appIds: appIds,
                        resourceIds: resourceIds,
                        dataroleIds: dataroleIds
                    })
                    // return false
                    this.$utils.ajax({
                        // baseURL: 'http://192.168.0.71:82/api',
                        url: this.isPlatform ? '/platformcenter/resource/role/pc/v1/batch' : '/companycenter/resource/role/pc/v1/batch',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            roleId: roleId,
                            appIds: appIds,
                            resourceIds: resourceIds,
                            dataroleIds: dataroleIds
                        },
                        success: function (res) {
                            if (res.httpCode === "200") {
                                this.$Notice.success({
                                    title: '提示',
                                    desc: '修改成功'
                                });
                                this.closeDrawer();
                            }
                        }.bind(this)
                    })
                },
                closeDrawer: function () {
                    this.value = false;
                },
                setDisabled: function (arr) {
                    arr.forEach(function (item, index, array) {
                        array[index].disableCheckbox = true;
                        array[index].expand = true;
                        if (array[index].children) {
                            array[index].children = this.setDisabled(array[index].children);
                        }
                    }.bind(this));
                    return arr
                },
                setExpand: function (arr) {
                    arr.forEach(function (item, index, array) {
                        array[index].expand = true;
                        array[index].checked = (array[index].checked === 'true' || this.isAdmin) ? true : false;
                        console.log('array[index].checked-' + array[index].checked)
                        if (array[index].children) {
                            array[index].children = this.setExpand(array[index].children);
                        }
                    }.bind(this));
                    return arr
                },
                getPermissionData: function (id, callback) {
                    this.treeLoading = true;
                    var ajaxOption = {
                        // baseURL: 'http://192.168.0.71:82/api',
                        method: 'get',
                        url: this.isPlatform ? '/platformcenter/resource/role/pc/v1/list' : '/companycenter/resource/role/pc/v1/list',
                        data: {
                            roleId: id
                        },
                        success: function (res) {
                            if (res.httpCode == 200) {
                                if (res['All_PERMISSIONS'] === 'All_PERMISSIONS') {
                                    this.isAdmin = true;
                                }
                                callback(res.data);
                            }
                            this.treeLoading = false;
                        }.bind(this),
                        error: function (err) {
                            this.treeLoading = false;
                        }
                    }
                    if (this.type === 'empId') {
                        ajaxOption.method = 'post';
                        ajaxOption.url = '/companycenter/comEmployee/pc/v1/permissionView';
                        ajaxOption.data[this.type] = id;
                    }
                    this.$utils.ajax(ajaxOption);
                },
                renderContent: function (h, o) {
                    // o={ root, node, data }||es6结构赋值
                    var width = 300;
                    var minWidth = 200;
                    var divider = h('divider', {
                        style: {
                            // 'float': 'right',
                            'vertical-align': 'middle'
                        },
                        props: {
                            type: 'vertical',
                        }
                    })
                    var domList = [];
                    domList.push(h('span', {
                        style: {
                            'display': 'inline-block',
                            // 'width': width + 'px',
                            'vertical-align': 'middle'
                        }
                    }, o.data.resourceName));
                    //buttons
                    var checkboxs1 = [];
                    if (o.data.children === undefined || o.data.children.length === 0) {
                        for (var i = 0; i < o.data.buttons.length; i++) {
                            // console.log('(Boolean(o.data.buttons[i].checked) === true||this.isAdmin)-' + (Boolean(o.data.buttons[i].checked) === true || this.isAdmin))
                            checkboxs1.push(h('span', {
                                class: ['button-id'],
                                domProps: {
                                    'id': 'b' + o.data.buttons[i].id
                                }
                            }, [h('checkbox', {
                                props: {
                                    'key': o.data.buttons[i].id
                                },
                                on: {
                                    'on-change': function (e) {
                                        console.log(e)
                                    }
                                },
                                props: {
                                    'disabled': o.data.disableCheckbox,
                                    'value': (Boolean(o.data.buttons[i].checked) === true || this.isAdmin) ? o.data.buttons[i].id : '',
                                    'true-value': o.data.buttons[i].id,
                                    'false-value': ''
                                }
                            }, o.data.buttons[i].resourceName)]));
                        }
                    }
                    //roles
                    var checkboxs2 = [];
                    if (o.data.children === undefined || o.data.children.length === 0) {
                        for (var i = 0; i < o.data.roles.length; i++) {
                            var code = o.data.roles[i].code;
                            if (code === 'APPOINT_POSITION' || code === 'APPOINT_DEPARTMENT') {
                                checkboxs2.push(h('span', {
                                    style: {
                                        'display': 'inline-block',
                                        'width': 300 + 'px'
                                    },
                                    class: ['role-id', code === 'APPOINT_DEPARTMENT' ? 'APPOINT_DEPARTMENT' : 'APPOINT_POSITION'],
                                    domProps: {
                                        'id': 'r' + o.data.roles[i].id
                                    }
                                }, [h('checkbox', {
                                    props: {
                                        'key': o.data.roles[i].id
                                    },
                                    on: {
                                        'on-change': function (e) {
                                            console.log(e)
                                        }
                                    },
                                    props: {
                                        'disabled': o.data.disableCheckbox,
                                        'value': (Boolean(o.data.roles[i].checked) === true || this.isAdmin) ? o.data.roles[i].id : '',
                                        'true-value': o.data.roles[i].id,
                                        'false-value': ''
                                    }
                                }), h('input', {
                                    style: {
                                        'display': 'inline-block',
                                        'width': 275 + 'px'
                                    },
                                    domProps: {
                                        readonly: true,
                                        placeholder: code === 'APPOINT_DEPARTMENT' ? '请选择指定部门' : '请选择指定岗位',
                                        // value: code === 'APPOINT_DEPARTMENT' ? o.data.roles[i].selectedIds.APPOINT_DEPARTMENT : o.data.roles[i].selectedIds.APPOINT_POSITION
                                        value: code === 'APPOINT_DEPARTMENT' ? ((o.data.roles[i].selectedIds.APPOINT_DEPARTMENT || []).length === 0 ? '' : '已指定部门') : (o.data.roles[i].selectedIds.APPOINT_POSITION || []).length === 0 ? '' : '已指定岗位',
                                    },
                                    on: {
                                        click: function (e) {
                                            console.log(e.target.nextElementSibling);
                                            var isDept = e.target.parentElement.classList.contains('APPOINT_DEPARTMENT');
                                            this.$bndPicker({
                                                type: isDept ? 'department' : 'job',
                                                title: isDept ? '选择部门' : '选择岗位',
                                                multiple: true,
                                                selected: JSON.parse(e.target.nextElementSibling.value),
                                                callback: function (result) {
                                                    console.log(result);
                                                    var str = [];
                                                    var val = []
                                                    result.forEach(function (item) {
                                                        str.push(item.title);
                                                        val.push(item.id);
                                                    });
                                                    e.target.value = str.join(',');
                                                    e.target.nextElementSibling.value = JSON.stringify(val);
                                                }
                                            });
                                        }.bind(this)
                                    }
                                }), h('input', {
                                    class: [code === 'APPOINT_DEPARTMENT' ? 'APPOINT_DEPARTMENT' : 'APPOINT_POSITION'],
                                    domProps: {
                                        type: 'hidden',
                                        value: (code === 'APPOINT_DEPARTMENT' ? JSON.stringify(o.data.roles[i].selectedIds.APPOINT_DEPARTMENT) : JSON.stringify(o.data.roles[i].selectedIds.APPOINT_POSITION)) || '[]'
                                    }
                                })]));
                            } else if (code === 'APPOINT_DEPT_AND_APPOINT_POSI') {
                                checkboxs2.push(h('span', {
                                    style: {
                                        'display': 'inline-block',
                                        'width': 300 + 'px'
                                    },
                                    class: ['role-id', 'APPOINT_DEPT_AND_APPOINT_POSI'],
                                    domProps: {
                                        'id': 'r' + o.data.roles[i].id
                                    }
                                }, [h('checkbox', {
                                    props: {
                                        'key': o.data.roles[i].id
                                    },
                                    on: {
                                        'on-change': function (e) {
                                            console.log(e)
                                        }
                                    },
                                    props: {
                                        'disabled': o.data.disableCheckbox,
                                        'value': (Boolean(o.data.roles[i].checked) === true || this.isAdmin) ? o.data.roles[i].id : '',
                                        'true-value': o.data.roles[i].id,
                                        'false-value': ''
                                    }
                                }), h('input', {
                                    style: {
                                        'display': 'inline-block',
                                        'width': 137 + 'px'
                                    },
                                    domProps: {
                                        readonly: true,
                                        placeholder: '请选择指定部门',
                                        value: (o.data.roles[i].selectedIds.APPOINT_DEPARTMENT || []).length === 0 ? '' : '已指定部门'
                                    },
                                    on: {
                                        click: function (e) {
                                            this.$bndPicker({
                                                type: 'department',
                                                title: '选择部门',
                                                multiple: true,
                                                selected: JSON.parse(e.target.nextElementSibling.value || '[]'),
                                                callback: function (result) {
                                                    console.log(result);
                                                    var str = [];
                                                    var val = []
                                                    result.forEach(function (item) {
                                                        str.push(item.title);
                                                        val.push(item.id);
                                                    });
                                                    e.target.value = str.join(',');
                                                    e.target.nextElementSibling.value = JSON.stringify(val);
                                                }
                                            });
                                        }.bind(this)
                                    }
                                }), h('input', {
                                    class: ['APPOINT_DEPARTMENT'],
                                    domProps: {
                                        type: 'hidden',
                                        value: JSON.stringify(o.data.roles[i].selectedIds.APPOINT_DEPARTMENT) || '[]'
                                    }
                                }), h('input', {
                                    style: {
                                        'display': 'inline-block',
                                        'width': 137 + 'px'
                                    },
                                    domProps: {
                                        readonly: true,
                                        placeholder: '请选择指定岗位',
                                        value: (o.data.roles[i].selectedIds.APPOINT_POSITION || []).length === 0 ? '' : '已指定岗位'
                                    },
                                    on: {
                                        click: function (e) {
                                            this.$bndPicker({
                                                type: 'job',
                                                title: '选择岗位',
                                                multiple: true,
                                                selected: JSON.parse(e.target.nextElementSibling.value || '[]'),
                                                callback: function (result) {
                                                    console.log(result);
                                                    var str = [];
                                                    var val = []
                                                    result.forEach(function (item) {
                                                        str.push(item.title);
                                                        val.push(item.id);
                                                    });
                                                    e.target.value = str.join(',');
                                                    e.target.nextElementSibling.value = JSON.stringify(val);
                                                }
                                            });
                                        }.bind(this)
                                    }
                                }), h('input', {
                                    class: ['APPOINT_POSITION'],
                                    domProps: {
                                        type: 'hidden',
                                        value: JSON.stringify(o.data.roles[i].selectedIds.APPOINT_POSITION) || '[]'
                                    }
                                })]));
                            } else {
                                checkboxs2.push(h('span', {
                                    class: ['role-id'],
                                    domProps: {
                                        'id': 'r' + o.data.roles[i].id
                                    }
                                }, [h('checkbox', {
                                    props: {
                                        'key': o.data.roles[i].id
                                    },
                                    on: {
                                        'on-change': function (e) {
                                            console.log(e)
                                        }
                                    },
                                    props: {
                                        'disabled': o.data.disableCheckbox,
                                        'value': (Boolean(o.data.roles[i].checked) === true || this.isAdmin) ? o.data.roles[i].id : '',
                                        'true-value': o.data.roles[i].id,
                                        'false-value': ''
                                    }
                                }, o.data.roles[i].name)]));

                            }
                        }
                    }
                    [checkboxs1, checkboxs2].forEach(function (item) {
                        domList.push(divider);
                        var checkboxGroup = h('div', {
                            style: {
                                'display': 'inline-block',
                                // 'min-width': minWidth + 'px',
                                'width': width + 'px',
                                'overflow-x': 'auto',
                                'overflow-y': 'hidden',
                                'vertical-align': 'middle',
                                'white-space': 'normal'
                            }
                        }, item);
                        domList.push(checkboxGroup);
                    }.bind(this));

                    var treeNode = [h('div', {
                        class: ['ivu-tree-title', {
                            'ivu-tree-title-selected': o.data.selected
                        }],
                        domProps: {
                            'id': o.data.id
                        },
                        on: {
                            click: function (e) {
                                if (o.data.disabled) {
                                    return false;
                                }
                                // this.$refs.tree.handleSelect(o.data.nodeKey);
                            }.bind(this)
                        }
                    }, domList)];
                    return treeNode;
                }
            }
        });
        instance.callback = option.callback;
        instance.value = true;
        document.body.removeChild(document.getElementById('temp-html'));
    }
}
//注册组件
var components = ['BndPage', 'BndDepartmentPicker', 'BndPicker', 'AddrPicker', 'UploadImg'];
for (var i = 0; i < components.length; i++) {
    if (typeof window[components[i]] !== "undefined") {
        Vue.component(components[i], window[components[i]]);
    }
}
for (var i in methods) {
    Vue.prototype['$' + i] = methods[i]
}