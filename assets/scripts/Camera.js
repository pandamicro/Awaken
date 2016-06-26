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
        scene: cc.Node,
        
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
        this._prevPos = cc.v2(0, 0);
        this._targetPos = cc.v2();
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        var targetTrans = this.target.getNodeToWorldTransform();
        var halfW = cc.winSize.width / 2,
            halfH = cc.winSize.height / 2,
            halfSW = this.scene.width / 2,
            halfSH = this.scene.height / 2,
            s = this.scale;

        if (this._prevPos.x !== targetTrans.tx || this._prevPos.y !== targetTrans.ty) {
            var appx = this.target._anchorPoint.x * this.target.width;
            var appy = this.target._anchorPoint.y * this.target.height;
            if (this.type === CameraType.INSTANT) {
                var x = this.node.x + halfW - (targetTrans.tx + appx + this.offset.x);
                var y = this.node.y + halfH - (targetTrans.ty + appy + this.offset.y);

                var l = x + halfW - halfSW * s;
                if (l > 0) {
                    x -= l;
                }
                var b = y + halfH - halfSH * s;
                if (b > 0) {
                    y -= b;
                }
                var r = halfW - x - halfSW * s;
                if (r > 0) {
                    x += r;
                }
                var t = halfH - y - halfSH * s;
                if (t > 0) {
                    y += t;
                }
                this.node.x = x;
                this.node.y = y;
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
