var UploadImg = {
    template:
'        <div> \
        <div class="demo-upload-list" v-for="item in uploadList">\
            <template v-if="item.status === \'finished\'">\
                <img :src="item.url">\
                <div class="demo-upload-list-cover">\
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>\
                    <Icon v-show="!disabled" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>\
                </div>\
            </template>\
            <template v-else>\
                <i-Progress v-if="item.showProgress" :percent="item.percentage" hide-info></i-Progress>\
            </template>\
        </div>\
        <Upload v-show="max>uploadList.length&&!disabled" \
            ref="upload"\
            :show-upload-list="false"\
            :default-file-list="defaultList"\
            :on-success="handleSuccess"\
            :format="[\'jpg\',\'jpeg\',\'png\']"\
            :max-size="5120"\
            :on-format-error="handleFormatError"\
            :on-exceeded-size="handleMaxSize"\
            :before-upload="handleBeforeUpload"\
            multiple\
            type="drag"\
            action="/api/system/upload/uploadFileAjax"\
            style="display: inline-block;width:58px;">\
            <div style="width: 58px;height:58px;line-height: 58px;">\
                <Icon type="ios-camera" size="20"></Icon>\
            </div>\
        </Upload>\
        <Modal title="查看图片" v-model="visible">\
            <img :src="activeImg" v-if="visible" style="width: 100%">\
        </Modal>\
    </div>',
    
    data: function() {
        return {
            defaultList: [],
            activeImg: '',
            visible: false,
            uploadList: []
        }
    },
    mounted: function() {
        this.uploadList = this.$refs.upload.fileList;
        
        // console.log(this.$refs.upload.fileList)

    },
    watch: {
        defaultimg:function() {
            // console.log(this.defaultimg)
            // console.log(this.$refs.upload.fileList)
           this.$refs.upload.clearFiles();
        //    console.log(this.$refs.upload.fileList)  
           this.uploadList = this.$refs.upload.fileList;
            // this.uploadList = [];
            // console.log('444')
            _.each(this.defaultimg, function(data){
                var a = data 
                a.status = 'finished';
                this.uploadList.push(a)
            }.bind(this));
            this.$emit('on-change', this.uploadList);
        }
      },
    methods: {
    	handleView:function (item) {
            this.activeImg = item.url;
            this.visible = true;
        },
        handleRemove:function (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            console.log(this.uploadList)
            this.$emit('on-change', this.uploadList);
        },
        handleSuccess:function (res, file) {
            
            // console.log(this.defaultList);
            file.url = res.resultMap.filePath;
            file.name = res.resultMap.fileName;
            // console.log(this.defaultimg);
            this.$emit('on-change', this.uploadList);

        },
        handleFormatError:function (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize:function (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 5M。'
            });
        },
        handleBeforeUpload:function () {
            const check = this.uploadList.length < this.max;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 '+this.max+' 张图片。'
                });
            }
            return check;
        }
    },
    props: {
        defaultimg: {
            type: Array,
            default: []
        },
        max: {
            type: Number,
            default: 20
        },
        disabled:{
            type: Boolean,
            default: false
        }
    }
}