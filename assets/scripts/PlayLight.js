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
    
        var a1 = cc.fadeTo(3, 0);//(3, 0, 10)//(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
                // 下落
       var a2  = cc.fadeTo(3,255);
                
       var Rep= cc.repeatForever(cc.sequence(a1, a2));
    
        this.node.runAction(Rep);
        

    
    
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
