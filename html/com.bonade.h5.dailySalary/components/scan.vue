<template>
  <div>
    <div class="page-scan">
      <mt-header title="扫描加人">
        <mt-button icon="back" slot="left" v-on:click="goBack"></mt-button>
      </mt-header>
      <div class="content">
        <p class="tips">提示：请参照示例拍照上传个人身份证的正反面照片，注意反光，保证身份证内容清晰可见。</p>
        <div class="id-wrapper">
          <div>身份证人面像</div>
          <div>
            <span v-bind:style="'background-image:url(' +base64+');'"></span>
          </div>
          <div>
            <a v-on:click="ocr">拍照片</a>
          </div>
        </div>
        <mt-field label="姓名" placeholder="请输入用户名" v-model="name"></mt-field>
        <!-- <mt-field label="证件类型" placeholder="请选择证件类型" v-model="idType" v-on:focus.native.capture
="openPicker" disableClear> -->
        <mt-field label="证件类型" placeholder="请选择证件类型" v-model="idType" disableClear readonly>
        </mt-field>
        <mt-field label="证件号码" placeholder="请输入身份证号码" v-model="id" type="text"></mt-field>
        <div class="button-wrapper">
          <mt-button size="large" v-on:click="doSubmit" ref="button">提交</mt-button>
        </div>
      </div>
      <mt-popup v-model="pickerVisible" position="bottom">
        <mt-picker :slots="slots" v-on:change="onValuesChange" showToolbar>
          <div class="bar bar-nav">
            <button class="button pull-right" v-on:click="closePicker">关闭</button>
            <h1 class="title">请选择证件类型</h1>
          </div>
        </mt-picker>
      </mt-popup>
    </div>
  </div>
</template>
<script>
export default {
  name: 'scan',
  data() {
    return {
      pickerVisible: false,
      name: '',
      idType: '身份证',
      id: '',
      file: '',
      base64: './static/img/id_surface_sample.png',
      slots: [{
        flex: 1,
        values: ['身份证'],
        // values: ['身份证', '港澳身份证', '护照'],
        defaultIndex: 0
      }]
    }
  },
  created() {
    sessionStorage.removeItem('idCardBitmap')
  },
  computed: {
    projectId() {
      return this.$route.params.projectId
    }
  },
  methods: {
    doSubmit() {
      let fromData = [{
        title: '姓名',
        value: this.name,
        rule: 'name',
        require: true
      }, {
        title: '身份证',
        value: this.id,
        rule: 'id',
        require: true
      }]
      let flag = this.$utils.validate(fromData)
      if (flag) {
        this.$refs.button.disabled = true
        this.$utils.ajax({
          url: '/sal/day/app/v1/scanMember',
          data: {
            prjId: this.projectId,
            idno: this.id,
            userName: this.name
          },
          success: (res) => {
            let params
            params = {
              name: res.data.name,
              id: res.data.idNo,
              account: res.data.cardNo || ' ',
              bankName: res.data.bank || ' ',
              projectId: this.projectId
            }
            if (res.data.id === null) {
              this.$router.push({ name: 'card', params })
            } else if (res.data.projectId === null) {
              this.$router.push({ name: 'card', params })
            } else {
              params = {
                staffId: res.data.id
              }
              this.$router.push({ name: 'memberInfo', query: params })
            }
            this.$refs.button.disabled = true
          },
          error: () => {
            this.$refs.button.disabled = true
          }
        })
      }
    },
    ocr() {
      this.$app.ocr('idCardFront', (res) => {
        if (res.data !== undefined) {
          res.data = JSON.parse(res.data)
        }
        if (res.status === '0') {
          //用户退出
          indicator.close()
          return false
        }
        console.log(res)
        indicator.close()
        if (res.status === '1' && res.data.ret === '0') {
          this.name = res.data.name
          this.slots[0].defaultIndex = 0
          this.id = res.data.id
        } else {
          this.name = ''
          // this.idType = ''
          this.id = ''
          this.$toast('识别失败')
        }
        this.base64 = 'data:image/jpeg;base64,' + res.bitmap
        sessionStorage.setItem('idCardBitmap', res.bitmap)
      })
    },
    onValuesChange(picker, values) {
      this.idType = values
      console.log(values)
    },
    openPicker() {
      this.pickerVisible = true
      this.slots[0].defaultIndex = 0
    },
    closePicker() {
      this.pickerVisible = false
    }
  }
}

</script>
<style lang="less" scoped>
.mint-popup {
  width: 100%;
  text-align: center;
}

.mint-field-other {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.tips {
  color: @supportColor;
  padding: 0 10px;
  margin-top: 20px;
  line-height: 25px;
  margin-bottom: 20px;
}

.id-wrapper {
  border-radius: 10px;
  border: 2px solid @supportColor;
  min-height: 200px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  div {
    width: 20px;
    box-sizing: content-box;
    font-size: 18px;
    color: @supportColor;
    text-align: center;
    writing-mode: tb-rl;
    writing-mode: vertical-rl;

    &:nth-child(2) {
      width: 70%;
      height: 170px;

      span {
        background-color: @gary;
        display: block;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }
    }

    &:first-child {
      margin-left: 10px;
      margin-right: 10px;
    }

    &:nth-child(3) {
      padding: 25px 5px;
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 20px;
      border: 2px solid @supportColor;
      position: relative;
    }
  }
}

input[type=file] {
  background-color: transparent;
  opacity: 0;
  z-index: 99;
  display: block;
  width: 32px;
  height: 100%;
  left: 0;
  top: 0;
  position: absolute;
}

</style>
