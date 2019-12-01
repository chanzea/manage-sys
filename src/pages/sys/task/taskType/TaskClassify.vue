<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
      <div class="task-classify-content-meta">
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务名称:</span>
          <span class="item-value">{{detail.taskName}}</span>
        </div>
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务模版:</span>
          <span class="item-value">分类任务</span>
        </div>
        <div class="task-classify-content-meta-item">
          <span class="item-label">任务描述:</span>
          <span class="item-value"><strong>{{detail.taskRemark}}</strong></span>
        </div>
      </div>
      <div class="task-classify-content-list">
        <div class="task-classify-content-list-item" v-for="(item, index) in taskItemList" :key="index" @click="item.isSelected = !item.isSelected">
          <!-- <div class="item-thumb" :class="item.isSelected ? 'selected-border' : ''" :style="{backgroundImage: 'url(' + BASEURL + item.src + ')'}"> -->
            <div class="item-thumb">
              <img :src="BASEURL + item.src" alt="">
            </div>
          <!-- </div> -->
          <div class="item-isselect">
            <Icon type="ios-checkbox-outline" style="color: #fff" v-if="!item.isSelected" />
            <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
          </div>
          <span v-if="item.tag" class="item-tag">
            <Tag color="success" size="medium">{{item.tag}}</Tag>
          </span>
        </div>
      </div>
      <div class="task-classify-content-meta">
        <div class="task-classify-content-meta-item" v-if="reviewInfo.name">
          <span class="item-label">审核人:</span>
          <span class="item-value">{{reviewInfo.name}}</span>
        </div>
        <div class="task-classify-content-meta-item" v-if="reviewInfo.advise">
          <span class="item-label">审核意见:</span>
          <span class="item-value">{{reviewInfo.advise}}</span>
        </div>
      </div>
      <div class="task-classify-content-opt" v-if="!viewOnly">
        <Button class="opt-btn" type="primary" @click="selectAll">全选</Button>
        <Button class="opt-btn" type="primary" @click="tagClassifyList" :disabled="!isSelected">批量添加标注</Button>
        <Button class="opt-btn" type="primary" @click="taskItemMarklist(false)">保存</Button>
        <Button class="opt-btn" type="primary" @click="taskItemMarklist(true)" :disabled="!isNext">下一题</Button>
      </div>
    </div>
    <Modal
      v-model="isShowModal"
      title="分类标注"
      @on-ok="confirm">
      <form-component ref="formProp" :formProp="formProp" :ruleCustom="ruleCustom" :formCustom="formCustom" @on-change="selectTag" />
    </Modal>
  </div>
</template>

<script>
import FormComponent from 'components/form/FormComponent.vue'
import { taskItemAllotMark, taskItemMarklist, tagClassifyList, tagClassifyAdd, taskItemDetail } from "@/api/task";
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
          value: '',
          options: [],
          placeholder: '可以选择已标记过的标签',
          key: 'tags'
        },
        {
          label: '名称',
          type: 'text',
          value: '',
          key: 'name'
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
        ]
      },
      formCustom: {},
      isNext: true, //是否有下一題
      // 審核人員信息
      reviewInfo: {

      },
      // 查看详情
      viewOnly: false
    }
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    FormComponent
  },
  created() {
    const taskId = this.$route.query.id;
    const taskItemId = this.$route.query.taskItemId
    this.viewOnly = this.$route.query.viewOnly
    // 当前存在 taskItemId ，返工任务
    if (taskItemId) {
      this.taskItemDetail(taskId, taskItemId)
    } else {
      this.taskItemAllotMark()
    }
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
      this.taskItemList = []
      taskItemAllotMark({
        taskId
      }).then(res => {
        const {taskItemList, dataRecordList, userList} = res
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].thumbnailUrl
          item.isSelected = false
          item.tag = ''
          return item
        }) : []
        this.isNext = !!taskItemList
      })
    },
    // 添加标注
    confirm () {
      this.taskItemList.forEach(item => {
        if(this.selectedTaskItem.includes(item.id)) {
          item.tag = this.formCustom.name
        }
      })
      const params = {
        taskId: this.$route.query.id,
        tagName: this.formCustom.name,
        tagType: 1
      }
      this.formProp.forEach(item => {
        this.formCustom[item.key] = ''
      })
      tagClassifyAdd(params)
    },

    //選擇標簽
    selectTag (val) {
      this.formCustom.name = val
    },

    // 全选
    selectAll () {
      this.taskItemList.map(item => {
        item.isSelected = true
        return item
      })
    },

    // 提交任务
    taskItemMarklist (next) {
      const isNext = this.taskItemList.some(item => {
        return item.tag !== ''
      })
      if (!isNext) {
        this.$Message.warning('请选择图片添加标注');
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
      taskItemMarklist(data).then(res => {
        if (next) {
          this.taskItemAllotMark()
        }
      })
    },

    // 获取分类标签
    tagClassifyList () {
      const taskId = this.$route.query.id;
      tagClassifyList({
        taskId
      }).then(res => {
        const { list } = res
        this.formProp[0].options = list ? list.map(item => {
          item.value = item.tagName;
          item.label = item.tagName;
          return item
        }) : []
      })
      this.isShowModal = true
    },

    taskItemDetail (taskId, taskItemId) {
      this.taskItemList = []
      taskItemDetail({
        taskId,
        taskItemId
      }).then(res => {
        console.log('res', res)
        const {taskItemList, dataRecordList, userList} = res
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].thumbnailUrl
          item.isSelected = false
          item.tag = item.taskData
          return item
        }) : []
        taskItemList && taskItemList.forEach(item => {
          this.reviewInfo = {
            name: item.reviewUserId !== 0 ? userList[item.reviewUserId].userName : '',
            advise: item.reviewAdvise
          }
        })
        this.isNext = !!taskItemList
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
      width: 60%;
      &-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        font-size: 14px;
        .item-label {
          color: #333;
          min-width: 80px;
          margin-right: 20px;
        }
        .item-value {
          flex: 1;
          line-height: 17px;
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
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          // background-size: contain;
          // background-repeat: no-repeat;
          // background-position: center;
          box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
          &.selected-border {
            border: 2px solid #f00;
            box-sizing: border-box;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            display: inline-block;
          }
        }
        .item-isselect {
          position: absolute;
          font-size: 36px !important;
          left: -2px;
          top: -14px;
          i {
            font-size: 36px !important;
          }
        }
        .item-tag {
          color: #666;
          font-size: 14px;
        }
      }
    }
    &-review {
      margin-bottom: 20px;
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