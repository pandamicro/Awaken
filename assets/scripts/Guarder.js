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
        
        
        nMoveTime : 3,
        nDistanceX : 100,
        nDistanceY: 0,
        nBeginDirectionX: 1,
        nBeginDirectionY: 1,
    },

    // use this for initialization
    onLoad: function () 
    {
        this.Action = this.setAction();
        this.node.runAction(this.Action);
    },
    
    setAction: function () 
    {
        // 跳跃上升
        var Move = cc.moveBy(this.nMoveTime, cc.p(this.nDistanceX* this.nBeginDirectionX,
        this.nDistanceY * this.nBeginDirectionY)).easing(cc.easeInOut(3.0));
        // 下落
        var MoveBack = Move.reverse();
      return cc.repeatForever(cc.sequence(Move, MoveBack));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
