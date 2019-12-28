let util = {
    getWindowWH: function() {
        let width, height;
        if (window.innerHeight !== undefined) {
            width = window.innerWidth;
            height = window.innerHeight;
        } else if (document.compatMode === "CSSCompat") {
            width = document.documentElement.clientWidth;
            height = document.documentElement.clientHeight;
        } else {
            width = document.body.clientWidth;
            height = document.body.clientHeight;
        }
        return {
            width,
            height
        }
    }
};

export default util;
