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
        attractCount: 1,
    },

    // use this for initialization
    onLoad: function () 
    {
        this.setInputControl();
        this.attracted = 0;
    },

    die: function () {
        this.node.active = false;
    },

    reset: function () {
        this.node.active = true;
        this.node.runAction(cc.fadeIn(0.5));
        this.attracted = 0;
    },
    
    Attract : function()
    {
        if (this.attracted >= this.attractCount) {
            return;
        }
        var playerComp = this.player;
        playerComp.BeAttract(this.node.x,this.node.y,this.direction);
        this.attracted++;
        if (this.attracted >= this.attractCount) {
            this.node.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(this.die, this)));
        }
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
