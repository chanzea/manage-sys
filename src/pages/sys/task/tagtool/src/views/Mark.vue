<template>
  <div class="home">
    <div class="btn-group">
      <button @click="()=>{taskItemMark()}">提交数据</button>
      <button v-if="!isReturnItem" @click="()=>{taskItemMark(true)}">下一题</button>
      <button @click="view">黑白图片预览</button>
    </div>
    <div v-if="isReturnItem" style="margin: 10px 0;">
      <RadioGroup v-model="taskItemStatus" :disabled="true">
          <Radio :disabled="true" label="5">通过</Radio>
          <Radio :disabled="true" label="3">不通过</Radio>
      </RadioGroup>
      <Input :disabled="true" v-model="taskItemReviewAdvise" type="textarea" :rows="4" placeholder="审核意见" />
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
import { taskItemAllotMark, tagMarkList, itemTaskUpload, taskItemMark, tagClassifyList, tagClassifyAdd, taskItemDetail } from "@/api/task";
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
      isNext: true,
      taskItemReviewAdvise: "",
      taskItemStatus: "",
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
      tagDataList: [],
    }
  },
  mounted () {
    this.tagMarkAdd();
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
          item.src =  BASEURL + dataRecordList[item.dataRecordId].thumbnailUrl
          this.imgUrl = BASEURL + dataRecordList[item.dataRecordId].thumbnailUrl;
          return item
        }) : []
        this.isNext = !!taskItemList;
        console.log()
        if(taskItemList.length > 0) {
          this.setImage(this.taskItemList[0].src);//设置图片
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

      console.log(this.tagData);
      this.tagMarkAdd();
      taskItemMark(data).then(res => {
        this.$Message.success("提交成功")
        if (next) {
          this.taskItemAllotMark()
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
          item.src = dataRecordList[item.dataRecordId].thumbnailUrl
          item.tag = item.taskData
          return item
        }) : []
        this.isNext = !!taskItemList
        if(taskItemList.length > 0) {
           this.taskItemReviewAdvise = taskItemList[0].reviewAdvise
          this.taskItemStatus = String(taskItemList[0].itemStatus)
          console.log(JSON.parse(this.taskItemList[0].taskData))
          this.setTagData(JSON.parse(this.taskItemList[0].taskData));//设置数据
        }
      })
    },

    // getTagMarkList(){
    //   let params = {
    //     taskId: this.$route.query.id
    //   }
    //   tagMarkList(params).then(res => {
    //     console.log(params)
    //   })
    // },

    getTagMarkList () {
      let taskId = parseInt(this.$route.query.id); 
      tagMarkList({
        taskId
      }).then(res => {
        console.log(res)
        const { list } = res;
        this.taskData = list.map( item => {
          return {
            title: item.tagName,
            desc: item.tagDesc,
            selected: false
          }
        })
      })
    },

    tagMarkAdd() {
        tagMarkAdd(this.tagDataList);
    },

    setImage (imgUrl) {
      this.$refs.tool.setImage(imgUrl)
    },
    setTagData (data) {
      this.$refs.tool.setTagData(data)
    },
    getTagData () {
      let data = this.$refs.tool.getTagData()
      console.log("TCL: getTagData -> data", data)
      console.log(data);
      //这里获取标签数组
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
    }
  }
}
</script>
<style lang="less">

.ivu-input[disabled], fieldset[disabled] .ivu-input{
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
