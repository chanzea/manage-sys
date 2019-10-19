<template>
  <div class="page-task-add">
    <div class="task-add-content">
      <Form :model="formItem" :label-width="100">
        <FormItem label="任务编号">
          <Input v-model="formItem.taskId" placeholder="编号"></Input>
        </FormItem>
        <FormItem label="任务名称">
          <Input v-model="formItem.taskName" placeholder="编号"></Input>
        </FormItem>
        <FormItem label="任务用途">
          <Input
            v-model="formItem.taskRemark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="描述"
          ></Input>
        </FormItem>
        <FormItem label="标注任务积分">
          <div class="task-mark">
            <span style="margin-right:12px">按</span>
            <Select class="task-mark-select" v-model="formItem.markPointType">
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
            <span style="margin:0 12px">积分,每次</span>
            <Input class="task-mark-input" type="number" v-model="formItem.markPoint"  placeholder="积分"></Input>
          </div>
        </FormItem>
        <FormItem label="审核任务积分">
          <div class="task-mark">
            <span style="margin-right:12px">完成任务累计</span>
            <Input class="task-mark-input" type="text" v-model="formItem.reviewPoint" placeholder="积分"></Input>
          </div>
        </FormItem>
        <FormItem label="任务模版">
          <Select v-model="formItem.taskType">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="数据源">
          <Select v-model="formItem.dataSetId" placeholder="选择数据源">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="标注人员">
          <Select v-model="formItem.markUserIds" multiple filterable clearable>
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="审核人员">
          <Select v-model="formItem.reviewUserIds"  multiple filterable clearable>
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="btn-list">
        <Button class="btn-list-item" type="primary" @click="getFormData">提交</Button>
        <Button class="btn-list-item">取消</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskAdd",
  data() {
    return {
      formItem: {

      }
    };
  },
  methods: {
    getFormData() {}
  }
};
</script>

<style lang="scss" scoped>
.page-task-add {
  .task-add-content {
    width: 550px;
    padding-left: 40px;
    .task-mark {
      display: flex;
      &-select {
        width: 170px;
      }
      &-input {
        width: 85px;
        position: relative;
        &::after {
          content: "分";
          position: absolute;
          top: 7px;
          right: -20px;
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