<template>
  <div>
    <div class="driverCertification">
      <mt-header title="填写司机认证表">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
        <mt-field label="姓名" placeholder="请输入姓名" v-model="driverDetail.name" :disableClear="true" :readonly="true"></mt-field>
        <mt-field label="国籍" placeholder="请输入国籍" v-model="driverDetail.nation"></mt-field>
        
        <mt-cell title="家庭住址" class="chooseCell" is-link><span class="chooseText" v-on:click="openCityPicker">{{homeAddress || '请选择'}}</span></mt-cell>
        <!-- <mt-field label="家庭住址" placeholder="请输入家庭住址" v-model="driverMsg.address"></mt-field> -->
        <mt-field label="详细地址" placeholder="请输入详细地址" v-model="address"></mt-field>
        <mt-field label="驾驶证号" placeholder="请输入驾驶证号" v-model="driverDetail.driverLicense" type="number"></mt-field>
        <mt-field label="档案编号" placeholder="请输入档案编号" v-model="driverDetail.fileCode" type="number"></mt-field>
        <mt-cell title="准驾车型" class="chooseCell" is-link><span class="chooseText" v-on:click="quasiDriverPicker">{{QDdata || '请选择'}}</span></mt-cell>
        <a class="mint-cell mint-field">
            <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">初次领证日期</span>
                </div>
                <div class="mint-cell-value" v-on:click="openPicker('first')">
                    <span class="text">{{firstLeadDate ? firstLeadDate : '请选择'}}</span>
                </div>
            </div>
        </a>
        <a class="mint-cell mint-field">
            <div class="mint-cell-wrapper">
                <div class="mint-cell-title">
                    <span class="mint-cell-text">有效限期</span>
                </div>
                <div class="mint-cell-value">
                    <span class="text" v-on:click="openPicker('start')">{{effStartDate ? effStartDate : '请选择'}}</span>
                    <span class="text"><i class="toForm"></i></span>
                    <span class="text" v-on:click="openPicker('end')">{{effEndDate ? effEndDate : '请选择'}}</span>
                </div>
            </div>
        </a>
        <div class="component-wrapper">
            <div class="block-title">上传行驶证照片（{{uploadList.length}}/3)：</div>
            <image-uploader v-on:upload="upload" v-bind:option="uploadOption" v-bind:max="3"></image-uploader>
        </div>
        <div class="driverBtn">
            <mt-button size="large" v-on:click="submit">提交</mt-button>
        </div>
      </div>
    </div>
    <mt-datetime-picker
        v-model="driverTime"
        ref="driverDate"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="driverTimeConfirm"
        >
    </mt-datetime-picker>
    <mt-popup v-model="cityPickerVisible" class="cityChoose" position="bottom">
      <div class="bar bar-nav">
        <h1 class="title">省市区选择</h1>
      </div>
      <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5"></mt-picker>
    </mt-popup>
    <mt-popup v-model="quasiDrivingModel" class="quasiDriver page-popup">
      <mt-header title="准驾车型">
        <mt-button icon="back" slot="left" v-on:click="cancelquasiDriver"></mt-button>
        <mt-button slot="right" v-on:click="makesureQD">确定</mt-button>
      </mt-header>
        <div class="checkContent">
            <mt-checklist
            align="right"
            v-model="value"
            :options="options">
            </mt-checklist>
        </div>
    </mt-popup>
  </div>
</template>
<script>
import { citiesData } from '../commonComponents/cities-data.js'
export default {
  name: 'driverCertification',
  data() {
    return {
      uploadList: [],
      uploadOption: {
        uploadFileName: 'default',
        tableName: 'default',
        tableCloumn: 'default'
      },
      effEndDate:'',
      effStartDate:'',
      firstLeadDate:'',
      driverTime:new Date().format('yyyy-MM-dd'),
      Datetype:'',
      driverDetail:{
            employeeId:window.userInfo.empId,
            name:window.userInfo.username,
            nation:'',
            address:'',
            driverLicense:'',
            fileCode:'',
            driverLicenseType:'',
            firstTime:'',
            validStartTime:'',
            validEndTime:''
      },
      address:'',
      cityPickerVisible: false,
      quasiDrivingModel: false,
      addressSlots: [{
        flex: 1,
        values: Object.keys(citiesData),
        className: 'slot1',
        textAlign: 'center'
      }, {
        flex: 1,
        className: 'slot2',
        textAlign: 'center'
      }, {
        flex: 1,
        className: 'slot3',
        textAlign: 'center'
      }],
      province: '',
      city: '',
      street: '',
      value:[],
      QDdata:'',
      tPicList:[],
      options:[
        {
            label: 'A1',
            value: 'A1'
        },
        {
            label: 'A2',
            value: 'A2'
        },
        {
            label: 'A2',
            value: 'A3'
        },
        {
            label: 'B1',
            value: 'B1'
        },
        {
            label: 'B2',
            value: 'B2'
        },
        {
            label: 'C1',
            value: 'C1'
        },
        {
            label: 'C2',
            value: 'C2'
        },
        {
            label: 'C3',
            value: 'C3'
        },
        {
            label: 'C4',
            value: 'C4'
        },
        {
            label: 'C5',
            value: 'C5'
        },
        {
            label: 'D',
            value: 'D'
        },
        {
            label: 'E',
            value: 'E'
        },
        {
            label: 'F',
            value: 'F'
        },
        {
            label: 'M',
            value: 'M'
        },    
        {
            label: 'N',
            value: 'N'
        },
        {
            label: 'P',
            value: 'P'
        }     
    ]
    }    
  },
computed: {
    homeAddress() {
      return (this.province ? this.province : '') + (this.city ? this.city : '') + (this.street ? this.street : '')
    }
  },
  methods:{
    openPicker(type) {
      this.$refs.driverDate.open()
      this.Datetype = type
    },
    driverTimeConfirm(){
      var repeatDate = new Date(this.driverTime);
      if(this.Datetype == 'start'){
        this.effStartDate = repeatDate.getFullYear()+'-'+((repeatDate.getMonth()+1) < 10 ? '0'+(repeatDate.getMonth()+1):(repeatDate.getMonth()+1)) + '-' +(repeatDate.getDate() < 10 ? '0'+repeatDate.getDate():repeatDate.getDate())
      }else if(this.Datetype == 'end'){
        this.effEndDate = repeatDate.getFullYear()+'-'+((repeatDate.getMonth()+1) < 10 ? '0'+(repeatDate.getMonth()+1):(repeatDate.getMonth()+1)) + '-' +(repeatDate.getDate() < 10 ? '0'+repeatDate.getDate():repeatDate.getDate())
      }else{
        this.firstLeadDate = repeatDate.getFullYear()+'-'+((repeatDate.getMonth()+1) < 10 ? '0'+(repeatDate.getMonth()+1):(repeatDate.getMonth()+1)) + '-' +(repeatDate.getDate() < 10 ? '0'+repeatDate.getDate():repeatDate.getDate())  
      }
    },
    upload(urlArray) {
      this.uploadList = urlArray
      console.log(urlArray)
    },
    openCityPicker() {
        this.cityPickerVisible = true
    },
    quasiDriverPicker(){
        this.quasiDrivingModel = true
    },
    cancelquasiDriver(){
        this.quasiDrivingModel = false
    },
    makesureQD(){
        this.QDdata = this.value.toString()
        this.quasiDrivingModel = false
    },
    onAddressChange(picker, values) {
      picker.setSlotValues(1, Object.keys(citiesData[values[0]]))
      picker.setSlotValues(2, citiesData[values[0]][values[1]])
      this.province = values[0]
      this.city = values[1]
      this.street = values[2]
    },
    submit(){
        let fromData = [
            {
                title: '国籍',
                value: this.driverDetail.nation,
                require: true
            },{
                title: '家庭地址',
                value: this.homeAddress,
                require: true
            },{
                title: '详细地址',
                value: this.address,
                require: true
            },{
                title: '驾驶证号',
                value: this.driverDetail.driverLicense,
                require: true
            },{
                title: '档案编号',
                value: this.driverDetail.fileCode,
                require: true
            },{
                title: '准驾车型',
                value: this.QDdata,
                require: true,
                select: true
            }
            ,{
                title: '初次领证日期',
                value: this.firstLeadDate,
                require: true,
                select: true
            },{
                title: '开始有效限期',
                value: this.effStartDate,
                require: true,
                select: true
            },{
                title: '结束有效限期',
                value: this.effEndDate,
                require: true,
                select: true
            },{
                title: '行驶证照片',
                value: this.uploadList,
                require: true,
                select: true
            }
        ]
        if (Date.parse(this.effStartDate) >= Date.parse(this.effEndDate)) {
            this.$toast('开始时间应早于结束时间')
            return false
        }
        if(this.uploadList.length != 0){
            if (this.uploadList.length < 3) {
                this.$toast('至少上传3张行驶证图片')
                return false
            }
        }

        let flag = this.$utils.validate(fromData)     
        if(flag){
            this.$set(this.driverDetail,'address',this.homeAddress + this.address)
            this.$set(this.driverDetail,'driverLicenseType',this.QDdata)
            this.$set(this.driverDetail,'firstTime',Date.parse(new Date(this.firstLeadDate.replace(/-/g, '/'))))
            this.$set(this.driverDetail,'validStartTime',Date.parse(new Date(this.effStartDate.replace(/-/g, '/'))))
            this.$set(this.driverDetail,'validEndTime',Date.parse(new Date(this.effEndDate.replace(/-/g, '/'))))
            for(let i=0;i<this.uploadList.length;i++){
                this.tPicList.push(this.uploadList[i].attach)
            }
            console.log(this.driverDetail)
            this.$utils.ajax({
                url:'driver/save',
                data:{
                    employeeId:window.userInfo.empId,
                    driverDetail:JSON.stringify(this.driverDetail),
                    picList:JSON.stringify(this.tPicList)
                },
                success:(res)=>{
                    if (res.httpCode === 200) {
                        this.$toast('提交成功')
                        this.$router.push({'name':'driverqualifications'})
                    } else {
                    this.$toast(res.msg)
                    }
                },error: (err) => {
                this.$toast('出错了')
                },
            })
        }
         
    }
  }
}

</script>
<style lang="less">
.cityChoose{
    width: 100%;
}
.mint-cell-value{
    .mint-field-core{
        color: @gary;
        &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: @gary;
        }

        &::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: @gary;
        }

        &:-ms-input-placeholder{
            color: @gary;
        }

        &::-webkit-input-placeholder{
            color: @gary;
        }
    }
    .text{
        color: @gary;
        // flex: 1;
        font-size: 12px;
        &:nth-child(2){
            flex: 0 0 40px;
        }
        &:nth-child(1){
            flex: 0 0 80px;
        }
        &:nth-child(3){
            flex: 0 0 80px;
        }
        text-align: center;
        .toForm{
            display: inline-block;
            height: 1px;
            width: 30px;
            background:rgba(216,216,216,1);
            border-radius:0px 100px 100px 0px;
            position: relative;
            vertical-align: middle;
            &:before{
                content: '';
                position: absolute;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                width: 4px;
                height: 1px;
                background:rgba(216,216,216,1);
                border-radius:100px 100px 25px 66px;
                right: 0;
                top: -1.5px;
            }
            &:after{
                content: '';
                position: absolute;
                width:3px;
                height:3px;
                background:rgba(216,216,216,1);
                border-radius:3px;
                left: 0px;
                top: 50%;
                margin-top: -1.5px;
            }
        }
    }
    .chooseText{
        display: flex;
    }
}
.chooseCell{
    .mint-cell-value{
        width: 100%;
        .chooseText{
            display: block;
            width: 100%;
        }
    }
}
.driverBtn{
    padding: 10px;
}
.driverCertification{
    .mint-cell{
        .mint-cell-title{
            flex: none;
            width: 105px;
        }
    }
}
.quasiDriver{
    width: 100%;
    height: 100%;
    .mint-checklist-title{
        margin: 0;
    }
    .checkContent{
        position: absolute;
        top: 44px;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
    }
}
</style>
