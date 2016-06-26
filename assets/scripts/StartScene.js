
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
        
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        
        starButton: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () 
    {
        this.startFlag=1;
        this.Array=[];
        var faceParent=this.node.getChildByName("faceParent");
        var OffsetX=-180;
        for( var i=0;i<12;i++)
        {
            var newStar = cc.instantiate(this.starPrefab);
            // 将新增的节点添加到 Canvas 节点下面
            faceParent.addChild(newStar);
            // 为星星设置一个随机位置
            newStar.setPosition(OffsetX,0);
            newStar.zIndex=(12-i);
            OffsetX=OffsetX+160;
            
            var  Head=newStar.getComponent("LevelButton");  
           // Head.HeadsUp();
            
            this.Array.push(newStar);
        }
        
        this.MaxOffsetX=OffsetX-160;
        
        this.Update();
        this.schedule(this.Update, 9);
    },
    
    MoveHead:function(Head)
    {
        var m1 = cc.moveBy(9, cc.p(160,0));
        //var call = cc.callFunc(this.MoveHead, Head);
        Head.runAction(cc.sequence(m1));
        
       // Head.x=Head.x+2;
    },
    
    
    Update :function(dt)
    {
        if(this.startFlag<=0)
        {
            this.unscheduleAllCallbacks();
            this.PlayAnimation();
            
            this.startFlag=-100;
            return;
        }
            
        //this.startFlag--;
        
        for (var i in this.Array) 
        {
            var node = this.Array[i];
            if(  Math.floor(node.x) > this.MaxOffsetX + 10)
            {
                node.x=-180;
                node.zIndex=node.zIndex+12;
            }
            
            //node.x=node.x+90*dt;
            this.MoveHead(node);
        }
    },
    

    startGame : function()
    {
        //cc.director.loadScene("Intro");
        this.startFlag=0;
        
        //this.starButton.active=false;
        
        
        var Play=this.starButton.getChildByName("play");
        if(Play)
        {
            
            Play.runAction(cc.sequence(
              //  cc.scaleTo(0.15, 0.95, 0.95).easing(cc.easeInOut(1.6)),
                cc.scaleTo(0.4, 1.4, 1.4).easing(cc.easeInOut(1.6)),
                cc.scaleTo(0.25, 0.0, 0.0).easing(cc.easeInOut(1.6))
                ));
        }
        var p=this.starButton.getChildByName("p");
        if(p)
        {
            cc.log("llllll");
            var pp=p.getComponent("cc.ParticleSystem");
            if(pp)
            {
                cc.log("rrrrr");
                pp.duration=3.5;
            }
        }
        
    },
    
    PlayAnimation : function()
    {
        for (var i in this.Array) 
        {
            var node = this.Array[i];
            
            var  Head=node.getComponent("LevelButton");   
            
            var offsetX= Math.abs( Head.node.x -  (-180+160*4));
            
            //cc.log("%f  off %f",Head.x,offsetX);
            
            if(offsetX<=100  )
            {
                Head.HeadsUp();
            }
            else
            {
                Head.Breath();
            }
            
            
        }
        
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
