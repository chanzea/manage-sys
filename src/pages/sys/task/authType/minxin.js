const minxin = {
    data(){
        return {
            isReturnItem: false
        } 
    },
    created() {
        this.isReturnItem = this.$route.query.taskItemId;
    },
}

export default minxin;