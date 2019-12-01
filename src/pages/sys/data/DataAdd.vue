<template>
  <div class="page-data-add">
    <div class="data-add-content">
      <Form ref="formItem" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="文件夹名称" prop="folderName">
          <Input v-model="formItem.folderName" placeholder="名称"></Input>
        </FormItem>
        <FormItem label="文件夹描述" prop="folderDesc">
          <Input v-model="formItem.folderDesc" type="textarea" placeholder="描述"></Input>
        </FormItem>
        <FormItem label="归属组织" prop="organizationIds">
          <CheckboxGroup v-model="formItem.organizationIds">
            <Checkbox v-for="(item, index) in organizationsList" :label="parseInt(item.id)" :key="index">{{item.organizationName}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="上传文件">
          <div class="file-upload">
            <span style="margin-bottom: 10px;">支持扩展名：.zip,.jpg..</span>
            <div class="upload-item" v-if="startUpload">
              <Circle class="upload-circle" :size="24" :percent="percent" :stroke-color="color">
                <Icon v-if="percent === 100" type="ios-checkmark" size="24" style="color:#5cb85c"></Icon>
              </Circle>
              <span style="font-size:12px;color: #2db7f5">文件上传中: {{ percent }}%</span>
            </div>
            <div v-if="fileName.length !== 0" style="margin-bottom: 10px;display: flex;align-items: center">
              <div v-for="(item, index) in fileName" :key="index" style="margin-left: 8px;color: #2d8cf0">
                <Icon type="ios-paper-outline" /><span style="margin-left: 8px;color: #2d8cf0">{{item}}</span>
              </div>
            </div>
            <Upload
              class="upload-comp"
              type="drag"
              :before-upload="beforeUpload"
              action="">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖到这里上传</p>
              </div>
            </Upload>
          </div>
        </FormItem>
      </Form>
      <div class="btn-list">
        <Button class="btn-list-item" :loading="loading" type="primary" :disabled="!isDisabled"  @click="handleSubmit('formItem')">提交</Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {
  BASEURL
} from 'api/config'
import browserMD5File from '../../../utils/md5.js'
import {
  fileUploadInfo,
  fileUpload,
  dataSetCreate,
  fileMerge
} from 'api/data.js'
import {
  orgainzationList
} from 'api/organization.js'
export default {
  name: 'DataAdd',
  data () {
    return {
      startUpload: false, //开始上传
      percent: 0,
      loading: false,
      organizationsList: [],
      formItem: {

      },
      fileId: '', //文件返回的id
      fileName: [],
      startChunkNumber: '',
      ruleValidate: {
        folderName: [
          {
            required: true,
            message: '请输入文件名称'
          }
        ],
        folderDesc: [
          {
            required: true,
            message: '请输入文件描述'
          }
        ],
        organizationIds: [
          {
            required: true,
            message: '请选择归属组织'
          }
        ],
      }
    }
  },
  created() {
    this.orgainzationList()
  },
  computed: {
    isDisabled() {
      return this.fileId !== ''
    },
    color () {
      let color = '#2db7f5';
      if (this.percent === 100) {
          color = '#5cb85c';
      }
      return color;
    }
  },
  methods: {
    // 获取用户详情
    orgainzationList () {
      orgainzationList({
        layerNumber: 2
      }).then(res => {
        const {organizationList} = res
        this.organizationsList = organizationList
      })
    },
    beforeUpload (file) {
      const _this = this
      const form = new FormData();
      _this.startUpload = false
      _this.percent = 0 //清空进度
      browserMD5File(file, function (err, md5) {
        fileUploadInfo({
          fileMD5: md5,
          fileName: file.name,
          fileSize: file.size
        }).then(res => {
          _this.fileId = res.fileId
          _this.formItem.fileIds = [res.fileId]
          _this.startChunkNumber = res.startChunkNumber
          if (res.startChunkNumber === -1) {  //表示已经上传过
            _this.fileName.push(file.name)
          } else {
            if (res.chunkTotal > 1) {
              _this.startUpload = true
              console.log('res.chunkTotal', res.chunkTotal)
              _this.chunkUpload(0, 1, res.chunkThreshold, res.chunkTotal, file, res.fileId)
              // const chunkTotal = Math.ceil(file.size / 131072) //测试用
              // _this.chunkUpload(0, 1, 131072, chunkTotal, file, res.fileId) //测试用
            } else {
              const form = new FormData();
              form.append('file', file);
              form.append('fileId', res.fileId)
              form.append('chunkNum', res.startChunkNumber)
              fileUpload(form).then(res => {
                _this.fileName.push(file.name)
              })
            }
          }
        })
      });
    },

    // 分块上传
    chunkUpload (start, startChunkNumber, chunkThreshold, chunkTotal, file, fileId) {
      const _this = this
      const fileSize = file.size
      console.log('文件大小', file.size)
      let blob = null //二进制对象
      let end = start + chunkThreshold //
      console.log(`第${startChunkNumber}次`, 'start:', start)
      // 如果超出文件大小
      if (end > fileSize) {
        blob = file.slice(start, fileSize, file.type);
      } else {
        console.log(`第${startChunkNumber}次`, 'end大小:', end)
        blob = file.slice(start, end, file.type);
      }
      console.log('blob', blob)
      const form = new FormData();
      form.append('file', blob);
      form.append('fileId', fileId)
      form.append('chunkNum', startChunkNumber)
      fileUpload(form).then(res => {
        if (startChunkNumber < chunkTotal) {        
          _this.percent = (end / fileSize).toFixed(2) * 100; //进度条比例
          console.log('当前进度', _this.percent)
          _this.chunkUpload(end, ++startChunkNumber, chunkThreshold, chunkTotal, file, fileId)
        } else {
          _this.percent = 100 //进度条完成
          fileMerge({
            file_id: fileId
          }).then(res => {
            console.log('fileMerge', res)
            _this.fileName.push(file.name)
          })
        }
      })
    },

    // 提交源数据
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          dataSetCreate(this.formItem).then(res => {
            this.loading = false
            this.$Message.success('上传成功');
            this.$router.push('/dataSet/list')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.page-data-add {
  .data-add-content {
    width: 550px;
    padding-left: 40px;
    .file-upload {
      display: flex;
      flex-direction: column;
      .upload-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .upload-circle {
          margin-right: 12px;
        }
      }
      .upload-comp {
        & /deep/ .ivu-upload-list {
          display: none !important;
        }
      }
    }
    .btn-list {
      padding-left: 100px;
      display: flex;
      &-item {
        margin-right: 8px;
      }
    }
  }
}
</style>