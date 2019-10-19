<template>
  <div class="page-data-add">
    <div class="data-add-content">
      {{formItem}}
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
            <div v-if="fileName" style="margin-bottom: 10px;display: flex;align-item: center">
              <Icon type="ios-paper-outline" /><span style="margin-left: 8px;color: #2d8cf0">{{fileName}}</span>
            </div>
            <Upload
              multiple
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
        <Button class="btn-list-item" type="primary" :disabled="!isDisabled"  @click="handleSubmit('formItem')">提交</Button>
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
  dataSetCreate
} from 'api/data.js'
import {
  getUserInfo
} from 'api/user'
export default {
  name: 'DataAdd',
  data () {
    return {
      organizationsList: [],
      formItem: {

      },
      fileId: '', //文件返回的id
      fileName: '',
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
    this.getUserInfo()
  },
  computed: {
    isDisabled() {
      return this.fileId !== '' && this.startChunkNumber > 0
    }
  },
  methods: {
    // 获取用户详情
    getUserInfo () {
      const userId = localStorage.getItem('userId')
      getUserInfo({
        userId
      }).then(res => {
        const {organizationList} = res
        Object.keys(organizationList).forEach(item => {
          this.organizationsList.push({
            id: item,
            organizationName: organizationList[item].organizationName
          })
        })
      })
    },
    beforeUpload (file) {
      const _this = this
      console.log('file', file)
      // let self = this
      // function getUploadDataInfo(file, uuid, filemd5, date) {
      //   let shardSize = self.sizes
      //   let name = file.name;        //文件名
      //   let size = file.size;        //总大小
      //   self.fileSize = size
      //   let shardCount = Math.ceil(size / shardSize);  //总片数
      //   // 获取 md5 列表
      //   self.getMd5List(0, shardCount, file, size, name, uuid, date, filemd5)
      // }
      //   let ipport = this.url
      //   //构造一个表单，FormData是HTML5新增的
        const form = new FormData();
      
        browserMD5File(file, function (err, md5) {
          console.log('md5', md5)
            form.append('file', file);
            fileUploadInfo({
              fileMD5: md5,
              fileName: file.name,
              fileSize: file.size
            }).then(res => {
              console.log('fileUpload', res)
              _this.fileId = res.fileId
              _this.startChunkNumber = res.startChunkNumber
              form.append('fileId', res.fileId)
              form.append('chunkNum', res.startChunkNumber)
              return fileUpload(form)
              // axios({
              //   url: `${BASEURL}/file/upload`,
              //   method: 'post',
              //   headers: {
              //     'tokenId': localStorage.getItem('tokenId'),
              //     'Content-Type': 'multipart/form-data'
              //   },
              //   data: form
              // })
            }).then(res => {
              _this.fileName = file.name
              console.log('/file/upload', res)
            })
        });
    },

    // 提交源数据
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log('valid', valid)
          dataSetCreate(this.formItem).then(res => {
            this.$Message.success('上传成功');
            this.$router.push('/data/list')
          })
        } else {
          this.$Message.error('校验失败');
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