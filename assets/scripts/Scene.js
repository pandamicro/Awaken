var SceneConfig = require('SceneConfig');
var VisibilityPolygon = require('visibility_polygon_dev');

cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        hero: cc.Node,
        colorScene: cc.Node,
        lightColor: cc.Color
    },

    // use this for initialization
    onLoad: function () {
        var polygons = SceneConfig[this.level];
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
        this.node._sgNode.addChild(this.drawNode, 10);

        this.action = cc.sequence(
            cc.fadeTo(0.1, 180),
            cc.fadeTo(0.1, 60),
            cc.fadeTo(0.2, 255),
            cc.fadeTo(0.5, 0),
            cc.callFunc(this.startSpread, this)
        );
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
        this.drawNode.x = - this.node.x;
        this.drawNode.y = - this.node.y;

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
    },

    startSpread: function () {
        if (this.drawNode) {
            this.drawNode.visible = false;
        }
        this.hero.getComponent(cc.Animation).stop();
        this.colorScene.active = true;
        var anim = this.colorScene.getComponent(cc.Animation);
        anim.play();
    }
});
