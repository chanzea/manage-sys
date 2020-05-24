<template>
  <div class="home">
    <div class="task-review-content-meta">
      <div class="task-review-content-meta-item">
        <span class="item-label">任务名称:</span>
        <span class="item-value">{{detail && detail.taskName}}</span>
      </div>
      <div class="task-review-content-meta-item">
        <span class="item-label">任务模版:</span>
        <span class="item-value">{{taskType === 'Mark' ? '检测框标注' : '分割任务'}}</span>
      </div>
      <div class="task-review-content-meta-item">
        <span class="item-label">任务描述:</span>
        <span class="item-value"><strong>{{detail && detail.taskRemark}}</strong></span>
      </div>
    </div>
    <div class="btn-group" v-if="!viewOnly">
      <button @click="taskItemReview">审核</button>
      <button v-if="!isReturnItem" @click="taskItemReview(true)">下一题</button>
      <!-- <button @click="view">黑白图片预览</button> -->
    </div>
    <div style="margin: 10px 0;">
      <RadioGroup v-model="taskItemStatus" >
          <Radio  label="5">通过</Radio>
          <Radio  label="3">不通过</Radio>
      </RadioGroup>
      <Input  v-model="taskItemReviewAdvise" type="textarea" :rows="4" placeholder="审核意见" />
    </div>
    
    <tag-tool ref="tool"
      :height = "canvasStyle.height"
      :width = "canvasStyle.width"
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
 import _util from '@/utils/utils'
 import minxin from "../../../authType/minxin";
export default {
  mixins: [minxin],
  name: 'home',
  components: {
    tagTool
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      canvasStyle:{
        height: 2000,
        width: 910
      },
      taskItemList: [],
      isNext: true,
      viewOnly: false, 
      taskItemStatus: "5",
      taskItemReviewAdvise: "",
      tagData: [
        // {
        //   'title': '箭头',
        //   'desc': '箭头标注',
        //   'selected': false
        // },
        // {
        //   'title': '马',
        //   'desc': '动物世界马',
        //   'selected': false
        // },
        // {
        //   'title': '轮船',
        //   'desc': '世界轮船',
        //   'selected': false
        // },
        // {
        //   'title': '航空母舰',
        //   'desc': '军事图片识别',
        //   'selected': false
        // }
      ],
      taskType: ''
    }
  },

  created() {
      let {width, height} = _util.getWindowWH();
      this.canvasStyle.width = width - 540;
      this.canvasStyle.height = height - 258;
      console.log(this.canvasStyle)
  },

  mounted () {
    this.taskType = this.$route.query.type
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

      if(!this.isNext){
        this.setTagData({})
        return this.$Message.warning("没有下一题了");
      }

      taskItemAllotReview({
        taskId
      }).then(res => {
        this.isNext = false
        let {taskItemList, dataRecordList, userList} = res;

        if(!taskItemList || taskItemList.length == 0){
          this.isNext = false;
          this.$Message.warning("没有下一题了");
        }
        taskItemList = taskItemList || [];//没有居然是null
        this.taskItemList = taskItemList.map(item => {
          item.src = BASEURL + dataRecordList[item.dataRecordId].fileUrl
          item.isSelected = false
          return item
        })

        this.isNext = !!taskItemList;
        if(taskItemList.length > 0) {
          console.log(this.taskItemList[0].taskData)
          let tagData =  JSON.parse(this.taskItemList[0].taskData);
          if(tagData.imgSrc == ''){
            tagData.imgSrc = this.taskItemList[0].src;
          }
          this.setTagData(tagData);//设置图片
          // this.upload(tagData.imgSrc);
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
          item.src = BASEURL + dataRecordList[item.dataRecordId].fileUrl
          item.tag = item.taskData
          return item
        }) : []
        this.isNext = !!taskItemList
        if(taskItemList.length > 0) {
          // console.log(JSON.parse(this.taskItemList[0].taskData))
          this.setTagData(JSON.parse(this.taskItemList[0].taskData));//设置数据
          // this.upload(this.taskItemList[0].src);
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
    },

    upload(src) {    
      let self = this;
      var image = new Image();
      image.src = src // 设置image的地址为base64的地址             
      image.onload = function(){       
          let {width, height} = _util.getWindowWH();
          self.canvasStyle.width = width - 530;
          self.canvasStyle.height = self.canvasStyle.width * (parseInt(image.height)/parseInt(image.width));  
          // self.canvasStyle.height = image.height;
      } 
    } 
  }
}
</script>
<style lang="scss">
.task-review-content-meta {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 60%;
  &-item {
    display: flex;
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
    // user-select: none;
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
