<template>
  <div class="home">
    <div class="btn-group" v-if="!viewOnly">
      <button @click="taskItemReview">审核</button>
      <button v-if="!isReturnItem" @click="taskItemReview(true)">下一题</button>
      <button @click="view">黑白图片预览</button>
    </div>
    <div style="margin: 10px 0;">
      <RadioGroup v-model="taskItemStatus" >
          <Radio  label="5">通过</Radio>
          <Radio  label="3">不通过</Radio>
      </RadioGroup>
      <Input  v-model="taskItemReviewAdvise" type="textarea" :rows="4" placeholder="审核意见" />
    </div>
    
    <tag-tool ref="tool"
      @on-data-change="saveTagData"
      :isNoData="!this.isNext"
      :tag-data="tagData"></tag-tool>
  </div>
</template>

<script>
import tagTool from '../components/tagtool'
import demoData from './demo'
import { taskItemAllotReview, taskItemReview, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
 import minxin from "../../../authType/minxin";
export default {
  mixins: [minxin],
  name: 'home',
  components: {
    tagTool
  },
  data () {
    return {
      taskItemList: [],
      isNext: false,
      viewOnly: false, 
      noMore: false,
      taskItemStatus: "5",
      taskItemReviewAdvise: "",
      tagData: [
        {
          'title': '箭头',
          'desc': '箭头标注',
          'selected': false
        },
        {
          'title': '马',
          'desc': '动物世界马',
          'selected': false
        },
        {
          'title': '轮船',
          'desc': '世界轮船',
          'selected': false
        },
        {
          'title': '航空母舰',
          'desc': '军事图片识别',
          'selected': false
        }
      ]
    }
  },
  mounted () {
    const taskId = this.$route.query.id;
    const taskItemId = this.$route.query.taskItemId
    // this.viewOnly = this.$route.query.viewOnly ? true : false;
    // 当前存在 taskItemId ，返工任务
    if (taskItemId) {
      this.taskItemDetail(taskId, taskItemId)
    } else {
      this.taskItemAllotReview();
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
        if(!taskItemList){
          this.$Message.info("任务审核完成");
          this.noMore = true;
          return;
        }
        taskItemList = taskItemList || [];//没有居然是null
        this.taskItemList = taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          return item
        })

        this.isNext = !!taskItemList;
        if(taskItemList.length > 0) {
          this.setTagData(JSON.parse(this.taskItemList[0].taskData));//设置图片
        }
      })
    },

    //查看
    taskItemDetail (taskId, taskItemId) {
      this.taskItemList = []
      taskItemDetail({
        taskId,
        taskItemId
      }).then(res => {
        const {taskItemList, dataRecordList} = res;
        if(taskItemList.length > 0) {
          this.taskItemReviewAdvise = taskItemList[0].reviewAdvise
          this.taskItemStatus = String(taskItemList[0].itemStatus)
        }
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src = dataRecordList[item.dataRecordId].filelUrl
          item.tag = item.taskData
          return item
        }) : []
        this.isNext = !!taskItemList
        if(taskItemList.length > 0) {
          // console.log(JSON.parse(this.taskItemList[0].taskData))
          this.setTagData(JSON.parse(this.taskItemList[0].taskData));//设置数据
        }
      })
    },

    //有next说明是点了下一题
    taskItemReview(next) {
      let taskItemId = this.taskItemList.map( item => item.id)[0];
      const data = {
        taskId: this.$route.query.id,
        taskItemId: String(taskItemId),
        taskItemStatus: this.taskItemStatus,
        taskItemReviewAdvise: this.taskItemReviewAdvise
      }
      console.log('data', data)
      taskItemReview(data).then(res => {
        console.log('res', res)
      }).then( () => {
          // this.$message.success("提交成功，下一题");
          this.$Message.info('提交成功');
          if(next){
            this.taskItemReviewAdvise = ""
            this.taskItemAllotReview();
          }
        }).catch( () => {
          this.$Message.error("提交失败");
        })
    },

    setImage (imgUrl) {
      this.$refs.tool.setImage(imgUrl)
    },
    setTagData (data) {
      this.$refs.tool.setTagData(data)
    },
    getTagData () {
      let data = this.$refs.tool.getTagData()
      return JSON.stringify(data)
      // alert(JSON.stringify(data))
    },
    saveTagData (data) {
      console.log(data)
    },
    view () {
      this.$refs.tool.view()
    }
  }
}
</script>
<style lang="less">
.btn-group {
  text-align: left;
  padding-bottom: 0.5em;
  button {
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    line-height: 1.5;
    outline: 0;
    touch-action: manipulation;
    cursor: pointer;
    background-color: #313343;
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid transparent;
    user-select: none;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 3px;
    transition: color 0.2s linear, background-color 0.2s linear,
      border 0.2s linear, box-shadow 0.2s linear;
    & + button {
      margin-left: 0.5em;
    }
    &:hover {
      background-color: #000000;
    }
  }
}
</style>
