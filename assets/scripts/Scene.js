var SceneConfig = require('SceneConfig');
var VisibilityPolygon = require('visibility_polygon_dev');

cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        hero: cc.Node,
        targets: [cc.Node],
        handles: [cc.Node],
        enemies: [cc.Node],
        mask: cc.Node,
        phare: cc.Node,
        colorScene: cc.Node,
        lightColor: cc.Color
    },

    // use this for initialization
    onLoad: function () {
        var polygons = SceneConfig[this.level];

        for (var i = 0, l = polygons.length; i < l; ++i) {
            var polygon = polygons[i];
        }

        var segments = VisibilityPolygon.convertToSegments(polygons);
        this.segments = VisibilityPolygon.breakIntersections(segments);
        this.lineColor = cc.color(0, 0, 0, 0);

        var width = this.node.width;
        var height = this.node.height;
        this.segments.unshift([[-1,-1],[width+1,-1],[width+1,height+1],[-1,height+1]]);

        this.canvas = document.createElement('CANVAS');
        this.canvas.width = cc.winSize.width;
        this.canvas.height = cc.winSize.height;
        this.ctx = this.canvas.getContext('2d');

        var tex = new cc.Texture2D();
        tex.initWithElement(this.canvas);
        tex.handleLoadedTexture();
        this.drawNode = new _ccsg.Sprite(tex);
        this.drawNode.anchorX = 0;
        this.drawNode.anchorY = 0;
        this.node._sgNode.addChild(this.drawNode, 10);

        this.action = cc.sequence(
            cc.fadeTo(0.2, 180),
            cc.fadeTo(0.1, 60),
            cc.fadeTo(0.4, 255),
            cc.fadeTo(0.7, 0),
            cc.callFunc(this.hideDrawNode, this)
        );
    },

    reset: function () {
        var i;
        for (i = 0; i < this.handles.length; i++) {
            this.handles[i].getComponent('Neurons').reset();
        }
    },

    lightUp: function () {
        var width = this.node.width;
        var height = this.node.height;
        var position = [this.hero.x - this.node.x + width/2, height - (this.hero.y - this.node.y + height/2)];
        var vertices = VisibilityPolygon.computeViewport(position, this.segments, [-this.node.x, -this.node.y], [width, height]);

        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, width, height);
        var trans = this.node.getNodeToWorldTransform();
        this.ctx.setTransform(trans.a, trans.b, trans.c, trans.d, trans.tx, trans.ty);
        this.ctx.moveTo(vertices[0][0], vertices[0][1]);
        for (var i = 1; i < vertices.length; ++i) {
            this.ctx.lineTo(vertices[i][0], vertices[i][1]);
        }
        this.ctx.fillStyle = '#' + this.lightColor.toHEX("#rgb");
        this.ctx.globalAlpha = this.lightColor.a / 255;
        this.ctx.fill();

        this.drawNode.visible = true;
        this.drawNode.texture.handleLoadedTexture();
        this.drawNode.x = -this.node.width/2-trans.tx;
        this.drawNode.y = -this.node.height/2-trans.ty;

        // if (!this.drawNode) {
        //     this.drawNode = new cc.DrawNode();
        //     this.node._sgNode.addChild(this.drawNode, 10);
        //     this.drawNode.x = -width/2;
        //     this.drawNode.y = -height/2;
        // }
        // this.drawNode.clear();
        // for (var i = 0, l = vertices.length; i < l; ++i) {
        //     vertices[i] = cc.p(vertices[i][0], vertices[i][1]);
        // }
        // this.drawNode.drawPoly(vertices, this.lightColor, 5, this.lineColor);
        
        this.drawNode.stopAllActions();
        this.drawNode.opacity = 0;
        this.drawNode.runAction(this.action);

        for (var t in this.targets) {
            var targetx = this.targets[t].x + this.node.width/2;
            var targety = this.node.height/2 - this.targets[t].y;

            if (!VisibilityPolygon.inPolygon([targetx, targety], vertices)) {
                return false;
            }
        }
        return true;
    },

    startSpread: function () {
        this.mask.active = true;
        this.phare.active = true;
        var herox = this.hero.x;
        var heroy = this.hero.y;
        var x = this.hero.x - this.node.x;
        var y = this.hero.y - this.node.y;
        this.mask.x = x;
        this.mask.y = y;
        this.phare.x = x;
        this.phare.y = y;
        this.colorScene.x = -this.mask.x;
        this.colorScene.y = -this.mask.y;

        this.node.parent.getComponent(cc.Animation).play();
    },

    hideDrawNode: function () {
        if (this.drawNode) {
            this.drawNode.visible = false;
        }
    },

    checkLive: function () {
        var herox = this.hero.x + this.node.width/2;
        var heroy = this.node.height/2 - this.hero.y;

        if (herox <= 0 || heroy <= 0 || herox >= this.node.width || heroy >= this.node.height) {
            return false;
        }

        var polygons = SceneConfig[this.level];
        for (var i = 0; i < polygons.length; ++i) {
            if (VisibilityPolygon.inPolygon([herox, heroy], polygons[i])) {
                return false;
            }
        }
        return true;
    }
});
