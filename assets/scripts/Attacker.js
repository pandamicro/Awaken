var Attacker = cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Node
    },

    statics: {
        level: 1
    },

    onLoad: function () {
        this.target = null;
    },

    attack: function (target) {
        if (!this.target) {
            this.target = target;

            var trans = this.target.getNodeToWorldTransform();

            var action = cc.sequence(
                cc.moveTo(1, this.node.x + (trans.tx + this.target.width/2) - this.camera.x - cc.winSize.width / 2, this.node.y + (trans.ty - this.target.height/2) - this.camera.y - cc.winSize.height / 2).easing(cc.easeInOut(2.0)),
                cc.callFunc(this.preEnter, this)
            );
            this.node.runAction(action);
        }
    },

    preEnter: function () {
        this.camera.getComponent(cc.Animation).play('enter');
        this.scheduleOnce(this.enter, 3);
    },

    enter: function () {
        var level = "level" + Attacker.level;
        Attacker.level++;
        var camera = this.camera;
        var canvas = this.camera.parent;
        cc.loader.loadRes(level, function (err, prefab) {
            if (err) {
                console.log(err);
                return;
            }
            var levelCam = cc.instantiate(prefab);
            canvas.addChild(levelCam, 100);
            camera.active = false;
            // levelCam.opacity = 0;
        });
    }
});
