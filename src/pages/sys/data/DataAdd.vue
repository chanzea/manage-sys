<template>
  <div class="page-data-add">
    <div class="data-add-content">
      <Form ref="formItem" :rules="ruleValidate" :model="formItem" :label-width="100">
        <FormItem label="文件夹名称" prop="fileName">
          <Input v-model="formItem.fileName" placeholder="名称"></Input>
        </FormItem>
        <FormItem label="文件夹描述" prop="fileDis">
          <Input v-model="formItem.fileDis" type="textarea" placeholder="描述"></Input>
        </FormItem>
        <FormItem label="归属组织" prop="organization">
          <Select v-model="formItem.organization">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="上传文件">
          <div class="file-upload">
            <span style="margin-bottom: 10px;">支持扩展名：.zip,.jpg..</span>
            <Upload
              multiple
              type="drag"
              action="//jsonplaceholder.typicode.com/posts/">
              <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖到这里上传</p>
              </div>
          </Upload>
          </div>
        </FormItem>
      </Form>
      <div class="btn-list">
        <Button class="btn-list-item" type="primary"  @click="handleSubmit('formItem')">提交</Button>
        <Button class="btn-list-item" @click="handleReset('formItem')">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataAdd',
  data () {
    return {
      formItem: {

      },
      ruleValidate: {
        fileName: [
          {
            required: true,
            message: '请输入文件名称'
          }
        ],
        fileDis: [
          {
            required: true,
            message: '请输入文件描述'
          }
        ],
        organization: [
          {
            required: true,
            message: '请选择归属组织'
          }
        ],
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
        } else {
          this.$Message.error('Fail!');
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