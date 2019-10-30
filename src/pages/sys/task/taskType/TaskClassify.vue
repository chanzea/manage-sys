<template>
  <div class="page-task-classify">
    <div class="task-classify-content">
      <div class="task-classify-content-list">
        <div class="task-classify-content-list-item" :class="item.isSelected ? 'selected-border' : ''" v-for="(item, index) in taskItemList" :key="index" @click="item.isSelected = !item.isSelected">
          <div class="item-thumb" :style="{backgroundImage: 'url(' + BASEURL + item.src + ')', 'background-size': 'cover'}">
            <!-- <img :src="BASEURL + item.src" alt=""> -->
          </div>
          <div class="item-isselect">
            <Icon type="ios-checkbox-outline" style="color: #fff" v-if="!item.isSelected" />
            <Icon type="md-checkbox" style="color: #2d8cf0" v-else />
          </div>
        </div>
      </div>
      <div class="task-classify-content-opt">
        <Button class="opt-btn" type="primary" @click="isShowModal = true" :disabled="!isSelected">批量添加标注</Button>
        <Button class="opt-btn" type="primary" @click="taskItemAllotMark" :disabled="!isNext">下一题</Button>
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
      isNext: false //是否可点击下一题
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
    }
  },
  methods: {
    taskItemAllotMark () {
      const taskId = this.$route.query.id
      taskItemAllotMark({
        taskId
      }).then(res => {
        this.isNext = false
        const {taskItemList, dataRecordList, userList} = res
        this.taskItemList = taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          item.tag = ''
          return item
        })
      })
    },
    confirm () {
      console.log('biaodan', this.formCustom)
      const markDataList = []
      this.taskItemList.forEach(item => {
        markDataList.push({
          taskItemId: item.id,
          markData: item.isSelected ? this.formCustom.name : ''
        })
      })
      const data = {
        taskId: this.$route.query.id,
        markDataList
      }
      console.log('data', data)
      taskItemMarklist(data).then(res => {
        console.log('res', res)
        this.isNext = true
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