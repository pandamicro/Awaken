var Player = require("Player");

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
         player: {
            default: null,
            type: Player
        },
        direction:0,
    },

    // use this for initialization
    onLoad: function () 
    {
        this.setInputControl();
    },
    
    Attract : function()
    {
        var playerComp = this.player;
        playerComp.BeAttract(this.node.x,this.node.y,this.direction);
    },
    
    setInputControl: function () 
    {
        // 添加键盘事件监听
        this.node.on('touchstart', function (event) 
            {
                cc.log('Mouse Down: ' + event);
                this.node.runAction( cc.scaleTo(0.2, 0.9, 0.9));
                this.Attract();
            }, this);
            
        this.node.on('touchend', function (event) 
            {
                cc.log('Mouse Up: ' + event);
                this.node.runAction( cc.scaleTo(0.2, 1, 1));
            }, this);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
