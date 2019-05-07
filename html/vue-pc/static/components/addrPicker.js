var AddrPicker = {
    name: 'addrPicker',
    template: '<Cascader :data="adddata" trigger="hover" :disabled="disabled" v-model="defaultaddr" @on-change="handleChange" style="max-width:450px"></Cascader>',
    props: {
        defaultaddr: {
            type: Array,
            default: function () {
                return []
            }
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    data: function () {
        return {
            adddata: [],
            seladdr: [],
        }
    },
    mounted: function () {
        this.getAddr()
    },
    watch: {
        defaultaddr: function () {
            // console.log(444)
        }
    },
    methods: {
        getAddr: function () {
            this.$utils.ajax({
                url: '/companycenter/external/pc/v1/queryAreaList',
                success: function (res) {
                    if (res.statusCode == 200) {
                        this.adddata = res.data
                    }
                }.bind(this)
            })
        },
        handleChange: function (value, selectedData) {
            this.$emit('on-change', { 'value': value, 'selectedData': selectedData });
        }
    }
}