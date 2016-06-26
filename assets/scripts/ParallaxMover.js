cc.Class({
    extends: cc.Component,

    properties: {
        parent: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        if (this.node.parent.width) {
            this.ratioX = this.node.width / this.node.parent.width;
        }
        else {
            this.ratioX = 1;
        }
        if (this.node.parent.height) {
            this.ratioY = this.node.height / this.node.parent.height;
        }
        else {
            this.ratioY = 1;
        }
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        var x = this.parent.x;
        var y = this.parent.y;
        this.node.x = x * this.ratioX - x;
        this.node.y = y * this.ratioY - y;
    },
});
