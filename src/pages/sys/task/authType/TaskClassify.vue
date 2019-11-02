<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
      <div class="task-classify-content-list">
        <div class="task-classify-content-list-item"  v-for="(item, index) in taskItemList" :key="index" >
          <div class="item-thumb" :style="{backgroundImage: 'url(' + BASEURL + item.src + ')', 'background-size': 'cover'}">
            <!-- <img :src="BASEURL + item.src" alt=""> -->
          </div>
          <div class="desc" style="fontSize:20px;fontWeight: bold">标注信息：{{item.taskData}}</div>
        </div>
      </div>
      <RadioGroup v-model="taskItemStatus">
          <Radio  label="5">通过</Radio>
          <Radio  label="4">不通过</Radio>
      </RadioGroup>
      <Input v-model="taskItemReviewAdivse" type="textarea" :rows="4" placeholder="审核意见" />

      <div class="task-classify-content-opt">
        <!-- <Button class="opt-btn" type="primary" @click="submit">提交</Button> -->
        <Button class="opt-btn" type="primary" @click="submit" >确认并跳到下一题</Button>
      </div>
    </div>
  </div>
</template>

<script>
import FormComponent from 'components/form/FormComponent.vue'
import { taskItemAllotReview, taskItemReview } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
export default {
  name: 'TaskClassify',
  data() {
    return {
      taskItemList: [],
      isShowModal: false,
      BASEURL,
      taskItemStatus: "5",
      taskItemReviewAdivse: "",
      formProp: [
        {
          label: '快捷',
          type: 'select',
          value: [],
          options: [],
          placeholder: '可以选择已标记过的标签',
          key: 'tags'
        },
        {
          label: '名称',
          type: 'text',
          value: '',
          key: 'name'
        },
        {
          label: '描述',
          type: 'textarea',
          value: '',
          key: 'dis'
        }
      ],
      formCustom: {},
      isNext: false //是否可点击下一题
    }
  },
  components: {
    FormComponent
  },
  created() {
    this.taskItemAllotReview()
  },
  computed: {
    isSelected () {
      return this.taskItemList.some(item => {
        return item.isSelected === true
      })
    }
  },
  methods: {
    taskItemAllotReview () {
      const taskId = this.$route.query.id
      taskItemAllotReview({
        taskId
      }).then(res => {
        this.isNext = false
        let {taskItemList, dataRecordList, userList} = res;
        taskItemList = taskItemList || [];//没有居然是null
        this.taskItemList = taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          item.tag = ''
          return item
        })
      })
    },
    cancel () {

    },
    submit () {
      let taskItemId = this.taskItemList.map( item => item.id)[0];
      const data = {
        taskId: this.$route.query.id,
        taskItemId: String(taskItemId),
        taskItemStatus: this.taskItemStatus,
        taskItemReviewAdivse: this.taskItemReviewAdivse
      }
      console.log('data', data)
      taskItemReview(data).then(res => {
        console.log('res', res)
      }).then( () => {
          // this.$message.success("提交成功，下一题");
          this.$Message.info('提交成功，下一题');
          this.taskItemAllotReview();
        }).catch( () => {
          this.$Message.error("提交失败");
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.page-task-classify {
  .task-classify-content {
    &-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      &-item {
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 12px;
        margin-right: 12px;
        box-sizing: border-box;
        width: 250px;
        height: 150px;
        &.selected-border {
          border: 2px solid #f00;
          box-sizing: border-box;
        }
        .item-thumb {
          width: 100%;
          height: 100%;
        }
        .item-isselect {
          position: absolute;
          font-size: 36px;
          left: -2px;
          top: -14px;
        }
        .item-opt {
          position: absolute;
          right: 20px;
          bottom: 20px;
        }
      }
    }
    &-opt {
      display: flex;
      justify-content: center;
      .opt-btn {
        margin: 0 12px;
      }
    }
  }
}
</style>