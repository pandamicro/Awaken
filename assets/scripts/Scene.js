var SceneConfig = require('SceneConfig');
var VisibilityPolygon = require('visibility_polygon_dev');

cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        hero: cc.Node,
        mask: cc.Node,
        phare: cc.Node,
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
        this.vertices = null;

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
        this.vertices = VisibilityPolygon.computeViewport(position, this.segments, [-this.node.x, -this.node.y], [width, height]);

        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, width, height);
        var trans = this.node.getNodeToWorldTransform();
        this.ctx.setTransform(trans.a, trans.b, trans.c, trans.d, trans.tx, trans.ty);
        this.ctx.moveTo(this.verticesvertices[0][0], this.verticesvertices[0][1]);
        for (var i = 1; i < this.verticesvertices.length; ++i) {
            this.ctx.lineTo(this.verticesvertices[i][0], this.verticesvertices[i][1]);
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
        // for (var i = 0, l = this.verticesvertices.length; i < l; ++i) {
        //     this.verticesvertices[i] = cc.p(this.verticesvertices[i][0], this.verticesvertices[i][1]);
        // }
        // this.drawNode.drawPoly(this.verticesvertices, this.lightColor, 5, this.lineColor);
        
        this.drawNode.stopAllActions();
        this.drawNode.opacity = 0;
        this.drawNode.runAction(this.action);

        this.hero.getComponent(cc.Animation).stop();
    },

    startSpread: function () {
        if (this.drawNode) {
            this.drawNode.visible = false;
        }
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

        this.mask.getComponent(cc.Animation).play();
        this.phare.getComponent(cc.Animation).play();
    },

    checkLive: function () {
        var herox = this.hero.x + this.node.width/2;
        var heroy = this.hero.y + this.node.height/2;

        return VisibilityPolygon.inPolygon([herox, heroy], this.vertices);
    }
});
