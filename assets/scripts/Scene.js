var SceneConfig = require('SceneConfig');
var VisibilityPolygon = require('visibility_polygon_dev');

cc.Class({
    extends: cc.Component,

    properties: {
        level: 0,
        light: cc.Node,
        lightColor: cc.Color
    },

    // use this for initialization
    onLoad: function () {
        var polygons = SceneConfig[this.level];
        var segments = VisibilityPolygon.convertToSegments(polygons);
        segments = VisibilityPolygon.breakIntersections(segments);

        var width = this.node.width;
        var height = this.node.height;
        segments.unshift([[-1,-1],[width+1,-1],[width+1,height+1],[-1,height+1]]);

        // var lightTrans = this.light.getNodeToWorldTransform();
        var position = [this.light.x - this.node.x + width/2, this.light.y - this.node.y + height/2];
        var vertices = VisibilityPolygon.computeViewport(position, segments, [-this.node.x, -this.node.y], [width, height]);

        var lineColor = cc.color(0, 0, 0, 0);

        var drawNode = new cc.DrawNode();
        this.node._sgNode.addChild(drawNode, 10);
        drawNode.x = -width/2;
        drawNode.y = -height/2;
        drawNode.clear();
        for (var i = 0, l = vertices.length; i < l; ++i) {
            vertices[i] = cc.p(vertices[i][0], vertices[i][1]);
        }
        drawNode.drawPoly(vertices, this.lightColor, 5, lineColor);
    }
});
