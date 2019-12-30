<template>
  <div class="home">
    <div class="task-mark-content-meta">
      <div class="task-mark-content-meta-item">
        <span class="item-label">任务名称:</span>
        <span class="item-value">{{detail.taskName}}</span>
      </div>
      <div class="task-mark-content-meta-item">
        <span class="item-label">任务模版:</span>
        <span class="item-value">{{taskType === 'Mark' ? '标注任务' : '分割任务'}}</span>
      </div>
      <div class="task-mark-content-meta-item">
        <span class="item-label">任务描述:</span>
        <span class="item-value">
          <strong>{{detail.taskRemark}}</strong>
        </span>
      </div>
    </div>
    <div class="btn-group">
      <button @click="()=>{taskItemMark()}">提交数据</button>
      <button v-if="!isReturnItem" @click="()=>{taskItemMark(true)}">下一题</button>
      <!-- <button @click="view">黑白图片预览</button> -->
    </div>
    <div v-if="isReturnItem" style="margin: 10px 0;">
      <RadioGroup v-model="taskItemStatus" :disabled="true">
        <Radio :disabled="true" label="5">通过</Radio>
        <Radio :disabled="true" label="3">不通过</Radio>
      </RadioGroup>
      <Input
        :disabled="true"
        v-model="taskItemReviewAdvise"
        type="textarea"
        :rows="4"
        placeholder="审核意见"
      />
    </div>
    <tag-tool
      ref="tool"
      :height = "canvasStyle.height"
      :width = "canvasStyle.width"
      @on-data-change="saveTagData"
      @on-tag-change="changeTagData"
      :isNoData="!this.isNext"
      :tag-data="tagData"
    ></tag-tool>
  </div>
</template>

<script>
import tagTool from '../components/tagtool'
// import demoData from './demo'
import { taskItemAllotMark, tagMarkAdd, tagMarkList, itemTaskUpload, taskItemMark, tagClassifyList, tagClassifyAdd, taskItemDetail } from "@/api/task";
import { 
  BASEURL
 } from "@/api/config.js";
import _util from '@/utils/utils'
 import minxin from "../../../authType/minxin";
export default {
  mixins: [minxin],
  name: 'Mark',
  components: {
    tagTool
  },
  data () {
    return {
      canvasStyle:{
        height: 1615.25,
        width: 910
      },
      taskItemList: [],
      isNext: true,
      taskItemReviewAdvise: "",
      taskItemStatus: "",
      tagData: [
        // {
        //   'title': '箭头',
        //   'desc': '箭头标注',
        //   'selected': false
        // },
      ],
      tagDataList: [],
      taskType: ''
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

  created() {
      console.log(_util.getWindowWH());
      let {width, height} = _util.getWindowWH();
      this.canvasStyle.width = width - 540;
      this.canvasStyle.height = height - 258;
      console.log(this.canvasStyle)
  },

  mounted () {
    this.taskType = this.$route.query.type
    // this.tagMarkAdd();
    const taskId = this.$route.query.id
    const taskItemId = this.$route.query.taskItemId
    this.viewOnly = this.$route.query.viewOnly;
    // 当前存在 taskItemId ，返工任务
    this.getTagMarkList();
    if (taskItemId) {
      this.taskItemDetail(taskId, taskItemId)
    } else {
      this.taskItemAllotMark();
    }
  },

  methods: {
    taskItemAllotMark () {
      const taskId = this.$route.query.id
      this.taskItemList = [];
      this.ismounted = false;
      if(!this.isNext){
        this.setTagData({})
        return this.$Message.warning("没有下一题了");
      }

      taskItemAllotMark({
        taskId
      }).then( res => {
        const {taskItemList, dataRecordList, userList} = res;
        if(!taskItemList || taskItemList.length == 0){
          this.isNext = false;
          this.$Message.warning("没有下一题了");
        }
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src =  BASEURL + dataRecordList[item.dataRecordId].fileUrl
          this.imgUrl = BASEURL + dataRecordList[item.dataRecordId].fileUrl;
          return item
        }) : []
        this.isNext = !!taskItemList;
        if(taskItemList.length > 0) {
          // this.$nextTick( () => {
              this.setImage(this.taskItemList[0].src);//设置图片
              this.getTagMarkList();
              this.$refs["tool"].clearShapeItems();
              // this.upload(this.taskItemList[0].src);
          // })
        }
      })
    },

    //有next说明是点了下一题
    taskItemMark (next) {
      let markData = {}
      this.taskItemList.forEach(item => {
        markData = {
          taskItemId: item.id,
          markData: this.getTagData ()
        }
      })
      const data = {
        taskId: this.$route.query.id,
        markData
      }

      if(JSON.stringify(markData) == "{}"){
        return this.$Message.error("请先标注数据");
      }
      
      taskItemMark(data).then(res => {
        this.$Message.success("提交成功")
        if (next) {
          this.taskItemAllotMark();
        }
      });
    },

    taskItemDetail (taskId, taskItemId) {
      this.taskItemList = []
      taskItemDetail({
        taskId,
        taskItemId
      }).then(res => {
        const {taskItemList, dataRecordList} = res;
        this.taskItemList = taskItemList ? taskItemList.map(item => {
          item.src = BASEURL + dataRecordList[item.dataRecordId].fileUrl
          this.imgUrl = BASEURL + dataRecordList[item.dataRecordId].fileUrl;
          item.tag = item.taskData
          return item
        }) : []
        this.isNext = !!taskItemList
        if(taskItemList.length > 0) {
           this.taskItemReviewAdvise = taskItemList[0].reviewAdvise
          this.taskItemStatus = String(taskItemList[0].itemStatus)
          console.log(JSON.parse(this.taskItemList[0].taskData))
          this.setTagData(JSON.parse(this.taskItemList[0].taskData));//设置数据
          // this.upload(this.taskItemList[0].src);
        }
      })
    },

    getTagMarkList () {
      let taskId = parseInt(this.$route.query.id); 
      tagMarkList({
        taskId
      }).then(res => {
        console.log(res)
        const { list } = res;
        console.log(list);
        this.tagData = list.map( item => {
          return {
            title: item.tagName,
            desc: item.tagDesc,
            selected: false
          }
        })
      })
    },

    changeTagData (item, data) {
      // 增加或者编辑标签属性，触发。
      let isNew = this.tagData.filter(i => {
        return i.title === item.title && i.desc === item.desc
      })
      console.log(data, item)

      if(isNew.length === 0) {
        let params = {
          tagName: item.title,
          tagDesc: item.desc,
          tagType: ""
        }
        params.taskId = parseInt(this.$route.query.id);
        tagMarkAdd([params]).then( res => {
        });

        this.tagData.push({
          'title': item.title,
          'desc': item.desc,
          'selected': false
        });
      }
    },

    setImage (imgUrl) {
      this.$refs.tool.setImage(imgUrl)
    },
    setTagData (data) {
      this.$refs.tool.setTagData(data)
    },
    getTagData () {
      let data = this.$refs.tool.getTagData()
      if(JSON.stringify(data) != {}){
        this.tagDataList = data.items.map( item => {
          return {
            tagName: item.title,
            tagDesc: item.desc,
            tagType: "",
            taskId: parseInt(this.$route.query.id)
          }
        })
      }
      return JSON.stringify(data)
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
            // self.canvasStyle.height = self.canvasStyle.width * (parseInt(image.height)/parseInt(image.width));    
            
            // self.canvasStyle.width = image.width;
            self.canvasStyle.height = image.height;
            console.log(image.height, image.width);
            // self.$nextTick( () => {
            //   self.setImage(src);//设置图片
            // })
            
        } 
    } 
  }
}
</script>
<style lang="scss">
.task-mark-content-meta {
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
.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background-color: white;
  color: #000000;
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
