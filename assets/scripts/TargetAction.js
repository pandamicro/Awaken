cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {


        var  t= Math.random()*3+2;
        var a1 = cc.rotateBy(t, 30, 30)//(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var a2  = cc.scaleTo(3,1.1,1.1);
        var a3  = cc.scaleTo(3,1,1);
        
        
        var Rep= cc.repeatForever(cc.sequence(a1));
    
        this.node.runAction(Rep);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
