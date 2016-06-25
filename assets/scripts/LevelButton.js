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
        Stage:1,
        pass:0,
        HeasUpMoveHeight : 20,
        
        frames:[cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function () {
        
        this.node.activate=false;
        
        var Head= this.node.getChildByName("Head");
        if(Head!==null)
        {
            if(this.pass===0)
            {
                Head.getComponent(cc.Sprite).spriteFrame = this.frames[1];
                Head.rotation=10;
            }
            else
            {
                Head.getComponent(cc.Sprite).spriteFrame = this.frames[0];
                
                Head.y=Head.y+this.HeasUpMoveHeight;
            }
            
            this.Breath();
            
        }
        
        
        
        
    },

    startLevel : function ()
    {
       
       this.HeadsUp();
    },
    
    Breath : function()
    {
        var Head= this.node.getChildByName("Head");
       
        if(Head!==null)
        {
            cc.log("!!!!!!!!!"); 
            
            if(this.pass===0)
            {
                
                var delay=(Math.random()*5+1)/10;
                
                var d1=cc.delayTime(delay);
                
                var a1 = cc.rotateBy(3, 2, 2);//(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
                // 下落
                var a2  = a1.reverse();
                
                var Rep= cc.repeatForever(cc.sequence(d1,a1, a2));
               
                Head.runAction(Rep);
            }
            else
            {
                var a1 = cc.moveBy(3, 0, 10)//(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
                // 下落
                var a2  = a1.reverse();
                
                var Rep= cc.repeatForever(cc.sequence(a1, a2));
               
                
                Head.runAction(Rep);
            }
        }
        
    },
    
    HeadsUp : function()
    {
        var Head= this.node.getChildByName("Head");
        if(Head!==null)
        {
            Head.stopAllActions();
            
            var sFace=Head.getComponent(cc.Sprite);
            
            
            
            var face = new cc.Node();
            var comp = face.addComponent(cc.Sprite);
            comp.spriteFrame = this.frames[1] ;
            comp.node.anchorX=Head.anchorX;
            comp.node.anchorY=Head.anchorY;
            
           // face.rotation=Head.rotation;
            face.x=0;
            face.y=0;
            Head.addChild(face);
            
            var time=1.5;
            
            
            var f1=    cc.fadeOut(time).easing(cc.easeIn(3));
            face.setCascadeOpacityEnabled(true);
            face.runAction(f1);
            
            Head.getComponent(cc.Sprite).spriteFrame = this.frames[0];
            
            this.pass=1;
            
            var r1=cc.rotateTo(time, 0, 0);
            
            var s= cc.sequence(r1,cc.callFunc(function(action,data)
            {
                this.Breath();
            },this,0));
               
            Head.runAction(s);
            
            var m=cc.moveBy(time, this.HeasUpMoveHeight, this.HeasUpMoveHeight);
            Head.runAction(m);
            
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
