<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
            <div class="task-classify-content-meta">
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">aaaa</span>
        </div>
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">图片标注模版</span>
        </div>
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value"><strong>选择图片添加标注</strong></span>
        </div>
      </div>
      <div class="task-classify-content-list">
        <div class="task-classify-content-list-item" v-for="(item, index) in taskItemList" :key="index" @click="item.isSelected = !item.isSelected">
          <div class="item-thumb" :class="item.isSelected ? 'selected-border' : ''" :style="{backgroundImage: 'url(' + BASEURL + item.src + ')', 'background-size': 'cover'}">
          </div>
          <div class="item-isselect">
            <Icon type="ios-checkbox-outline" style="color: #fff" v-if="!item.isSelected" />
            <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
          </div>
          <span v-if="item.tag" class="item-tag">
            <Tag color="success" size="medium">{{item.tag}}</Tag>
          </span>
        </div>
      </div>
      <div class="task-classify-content-opt">
        <Button class="opt-btn" type="primary" @click="isShowModal = true" :disabled="!isSelected">批量添加标注</Button>
        <Button class="opt-btn" type="primary" @click="taskItemMarklist">下一题</Button>
      </div>
    </div>
    <Modal
      v-model="isShowModal"
      title="分类标注"
      @on-ok="confirm"
      @on-cancel="">
      <form-component ref="formProp" :formProp="formProp" :ruleCustom="ruleCustom" :formCustom="formCustom" />
    </Modal>
  </div>
</template>

<script>
import FormComponent from 'components/form/FormComponent.vue'
import { taskItemAllotMark, taskItemMarklist, tagClassifyList } from "@/api/task";
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
      // 验证规则
      ruleCustom: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入标签名称'
          }
        ],
        dis: [
          {
            required: true,
            trigger: 'blur',
            message: '请对标签进行描述'
          }
        ],
      },
      formCustom: {},
    }
  },
  components: {
    FormComponent
  },
  created() {
    this.taskItemAllotMark()
    this.tagClassifyList()
  },
  computed: {
    isSelected () {
      return this.taskItemList.some(item => {
        return item.isSelected === true
      })
    },
    selectedTaskItem () {
      return this.taskItemList.filter(item => {
        return item.isSelected === true
      }).map(item => {
        return item.id
      })
    }
  },
  methods: {
    taskItemAllotMark () {
      const taskId = this.$route.query.id
      taskItemAllotMark({
        taskId
      }).then(res => {
        const {taskItemList, dataRecordList, userList} = res
        this.taskItemList = taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          item.tag = ''
          return item
        })
      })
    },
    // 添加标注
    confirm () {
      this.taskItemList.forEach(item => {
        if(this.selectedTaskItem.includes(item.id)) {
          item.tag = this.formCustom.name
        }
      })
      this.formProp.forEach(item => {
        this.formCustom[item.key] = ''
      })
    },

    taskItemMarklist () {
      const isNext = this.taskItemList.some(item => {
        return item.tag !== ''
      })
      if (!isNext) {
        return
      }
      const markDataList = []
      this.taskItemList.forEach(item => {
        markDataList.push({
          taskItemId: item.id,
          markData: item.tag
        })
      })
      const data = {
        taskId: this.$route.query.id,
        markDataList
      }
      console.log('data', data)
      taskItemMarklist(data).then(res => {
        console.log('res', res)
        this.taskItemAllotMark()
      })
    },

    // 获取分类标签
    tagClassifyList () {
      const taskId = this.$route.query.id
      tagClassifyList({
        taskId
      }).then(res => {
        console.log('tagClassifyList', res)
        const { list } = res
        this.formProp[0].options = list
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.page-task-classify {
  .task-classify-content {
    padding: 0 28px;
    &-meta {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      &-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        font-size: 14px;
        .item-label {
          color: #333;
          margin-right: 20px;
        }
        .item-value {
          color: #666;
        }
      }
    }
    &-list {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 12px;
        margin-right: 12px;
        box-sizing: border-box;
        position: relative;
        .item-thumb {
          width: 250px;
          height: 150px;
          margin-bottom: 12px;
          &.selected-border {
            border: 2px solid #f00;
            box-sizing: border-box;
          }
        }
        .item-isselect {
          position: absolute;
          font-size: 36px;
          left: -2px;
          top: -14px;
        }
        .item-tag {
          color: #666;
          font-size: 14px;
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