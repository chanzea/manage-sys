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
            <span style="margin-bottom: 5px;">支持扩展名：.zip,.jpg..</span>
         
            <template v-for=" item in uploadListMap" >
              <div class="upload-item" :key="item.md5" v-if="item.isUploading">
                <Circle class="upload-circle" :size="24" :percent="item.percent" :stroke-color="color">
                  <Icon v-if="item.percent === 100" type="ios-checkmark" size="24" style="color:#5cb85c"></Icon>
                </Circle>
                <span style="font-size:12px;color: #2db7f5">文件上传中: {{ item.percent }}%</span>
                <Icon class="icon" v-if="item.isPause" @click="continueUpload(item.md5)" type="stop"></Icon>
                <Icon class="icon" v-else @click="pauseUpload(item.md5)" type="pause"></Icon>
              </div>
            </template>

            <div v-if="fileName.length !== 0" style="margin-bottom: 10px;display: flex;align-items: center">
              <div v-for="(item, index) in fileName" :key="index" style="margin-left: 8px;margin-right: 8px;color: #2d8cf0">
                <Icon type="ios-paper-outline" /><span style="margin-left: 8px;color: #2d8cf0">{{item}}</span>
              </div>
              <Button size="small" type="primary" @click="deleteFile">删除</Button>
            </div>
            <!-- <div class="upload-item" v-if="startUpload">
              <Circle class="upload-circle" :size="24" :percent="percent" :stroke-color="color">
                <Icon v-if="percent === 100" type="ios-checkmark" size="24" style="color:#5cb85c"></Icon>
              </Circle>
              <span style="font-size:12px;color: #2db7f5">文件上传中: {{ percent }}%</span>
            </div>
            
            <div v-show="isUploading" style="margin-bottom: 10px;">
              <Button size="small" type="primary" v-if="!isPause" @click="isPause=true">暂停</Button>
              <Button size="small" type="primary" v-else @click="continueUpload">继续</Button>
            </div> -->
            <Upload
              v-if="isSupportMultiple"
              multiple
              class="upload-comp"
              type="drag"
              :before-upload="beforeUpload"
              :disabled="isUploading"
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
      isUploading: false, //上传中
      startUpload: false, //开始上传
      fileId: '', //文件返回的id
      startChunkNumber: '',
      isPause: false, //是否暂停
      pauseData: {},
      percent: 0,
      uploadListMap:{},
      
      loading: false,
      organizationsList: [],
      isSupportMultiple: true,
      formItem: {},
      
      fileName: [],
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
    deleteFile () {
      this.fileName = []
      this.fileId = ''
      this.isUploading = false //上传中
      this.startUpload = false //开始上传
      this.isPause = false //是否暂停
      this.pauseData = {}
      this.percent = 0
      this.loading = false
    },
    beforeUpload (file) {
      const _this = this
      browserMD5File(file, function (err, md5) {
        if(err){
          return;
        }
        _this.fileUploadInfo(file, md5);
      });
      return false;
    },

    fileUploadInfo: function(file, md5) {
      
      fileUploadInfo({
        fileMD5: md5,
        fileName: file.name,
        fileSize: file.size
      }).then(res => {
        
        const fileSize = file.size
        console.log('文件大小', fileSize)
        // this.fileId = res.fileId
        // this.formItem.fileIds = [res.fileId]
        // this.startChunkNumber = res.startChunkNumber

        let {chunkTotal, startChunkNumber, fileId, fileType, chunkThreshold } = res;

        this.$set(this.uploadListMap, md5, {
          md5,
          startUpload: true,
          percent: 0,
          chunkTotal, 
          startChunkNumber, 
          fileId, 
          fileType, 
          chunkThreshold,
          file,
          isUploading: true
        });

        if (res.startChunkNumber === -1) {  //表示已经上传过
          this.fileName.push(file.name)
          this.uploadListMap[md5].isUploading = false
          return;
        }

        if (res.chunkTotal > 1) {
          
          console.log('需要分片')
          // this.startUpload = true
          // this.isUploading = true

          console.log(this.uploadListMap);

          this.chunkUpload(this.uploadListMap[md5]);
          return;
        }

        console.log('不需要分片')
        const form = new FormData();
        form.append('file', file);
        form.append('fileId', res.fileId)
        form.append('chunkNum', res.startChunkNumber)
        fileUpload(form).then(res => {
          this.fileName.push(file.name);
          this.uploadListMap[md5].isUploading = false;
        }) 
      })
    },

    // 继续上传
    continueUpload (md5) {
      console.log()
      this.uploadListMap[md5].isPause = false;
      this.chunkUpload(this.uploadListMap[md5]);
      this.isPause = false //暂停上传置为false
    },

    //暂停
    pauseUpload (md5){
      this.uploadListMap[md5].isPause = true;
    },

    // 分块上传
    chunkUpload ({startChunkNumber, chunkThreshold, chunkTotal, file, fileId, isPause, md5}) {

      //该文件暂停
      if(isPause) {
        this.uploadListMap[md5].startChunkNumber = startChunkNumber;
        return;
      }

      console.trace("调用战");

      console.log(file);

      const _this = this
      const fileSize = file.size
      let blob = null //二进制对象
      let start = (startChunkNumber - 1) * chunkThreshold;
      let end = start + chunkThreshold //
      // 如果超出文件大小
      let sliceEndIndex = end > fileSize ? fileSize : end;
      blob = file.slice(start, sliceEndIndex, file.type);

      const form = new FormData();
      form.append('file', blob);
      form.append('fileId', fileId)
      form.append('chunkNum', startChunkNumber)
      let percent = 0;
      percent = Number(((end / fileSize) * 100).toFixed(2)); //进度条比例
      this.updateProcess(md5, percent);
      
      fileUpload(form).then(res => {
        console.log('分片上传')
        if (startChunkNumber < chunkTotal) {        
          
          this.uploadListMap[md5].startChunkNumber = this.uploadListMap[md5].startChunkNumber + 1;
          console.log(_this.uploadListMap[md5])
          _this.chunkUpload(_this.uploadListMap[md5])    
        } else {
          percent = 100 //进度条完成
          fileMerge({
            file_id: fileId
          }).then(res => {
            _this.fileName.push(file.name);
            this.uploadListMap[md5].isUploading = false;
          })
        }
        this.uploadListMap[md5].percent = percent;
  
      }).catch(err => {
        console.error('err', err)
      })
    },

    //进度条
    updateProcess(md5, realPercent){
      let percent = this.uploadListMap[md5].percent;
      let _this = this;
      let timer = setTimeout(t, 1000);
      function t(){
        if(_this.uploadListMap[md5].percent >=  realPercent - (realPercent - 5 - percent) / 10) {
          timer = null;
          clearTimeout(timer);
          return;
        }
        _this.uploadListMap[md5].percent += (realPercent - 5 - percent) / 10;
        timer = setTimeout(t, 1000);
      }
      
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
    },
    changeUploadType (status) {
      this.isSupportMultiple = status;
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