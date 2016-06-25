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
        
        fadeDuration:3,
        op:128,
        
    },

    // use this for initialization
    onLoad: function () 
    {
        var m1=cc.fadeTo(this.fadeDuration, this.op);
        var m2=cc.fadeIn(this.fadeDuration);
        this.node.runAction(cc.repeatForever(cc.sequence(m1, m2)));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
