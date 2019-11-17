const minxin = {
    data(){
        return {
            isReturnItem: false
        } 
    },
    created() {
        this.isReturnItem = this.$route.query.taskItemId;
    },

    convertTagData(){
        
    }

}

export default minxin;