var math;
var view;

var CameraType = cc.Enum({
    INSTANT: 0,
    TRACKING: 1
});

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        offset: cc.Vec2,
        scale: 1,
        
        type: {
            type: CameraType,
            default: CameraType.INSTANT
        },

        trackSpeed: 5
    },

    // use this for initialization
    onLoad: function () {
        math = cc.math;
        view = cc.view;

        this._tracking = false;
        var targetTrans = this.target.getNodeToWorldTransform();
        this._prevPos = cc.v2(targetTrans.tx, targetTrans.ty);
        this._targetPos = cc.v2();
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        var targetTrans = this.target.getNodeToWorldTransform();
        if (this._prevPos.x !== targetTrans.tx || this._prevPos.y !== targetTrans.ty) {
            var appx = this.target._anchorPoint.x * this.target.width;
            var appy = this.target._anchorPoint.y * this.target.height;
            if (this.type === CameraType.INSTANT) {
                this.node.x += cc.winSize.width / 2 - (targetTrans.tx + appx + this.offset.x);
                this.node.y += cc.winSize.height / 2 - (targetTrans.ty + appy + this.offset.y);
            }
            else {
                this._targetPos.x = this.node.x + cc.winSize.width / 2 - (targetTrans.tx + appx + this.offset.x);
                this._targetPos.y = this.node.y + cc.winSize.height / 2 - (targetTrans.ty + appy + this.offset.y);
                this._tracking = true;
            }
            this._prevPos.x = targetTrans.tx;
            this._prevPos.y = targetTrans.ty;
        }

        if (this._tracking) {
            var distx = this._targetPos.x - this.node.x;
            var disty = this._targetPos.y - this.node.y;
            var distance = Math.sqrt(distx * distx + disty * disty);

            if (distance > this.trackSpeed) {
                var angle = Math.atan2(disty, distx);
                var dx = this.trackSpeed * Math.cos(angle);
                var dy = this.trackSpeed * Math.sin(angle);
                this.node.x += dx;
                this.node.y += dy;
            }
            else {
                this.node.x = this._targetPos.x;
                this.node.y = this._targetPos.y;
                this._tracking = false;
            }
        }

        if (this.scale !== this.node.scale) {
            this.node.scale = this.scale;
        }
    },
});
