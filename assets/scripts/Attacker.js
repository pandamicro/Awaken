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

            var action = cc.sequence(
                cc.moveTo(1, target.x, target.y).easing(cc.easeInOut(2.0)),
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
