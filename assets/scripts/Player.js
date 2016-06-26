var Scene = require('Scene');


var Player = cc.Class({
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

        scene: Scene,
        
        gravity:-5,
        Attractive:10,
        
         // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        //最多跳跃次数
        maxJumpCount: 1,
        
        accelX: 0,
        accelY: 0,
        
        //衰减值
        weaken:0.04,
    },

    // use this for initialization
    onLoad: function () {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        //this.node.runAction(this.jumpAction);
        
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
    
        this.JumpCount=0;
        
        this.StartFlag=0;

        this.startX = this.node.x;
        this.startY = this.node.y;
        
        this.attractiveX=0;
        this.attractiveY=0;
        // 初始化键盘输入监听
        this.setInputControl();

        this._active = true;
    },

    lightUp: function () {
        var succeed = this.scene.lightUp();

        if (succeed) {
            this._active = false;
            this.scene.startSpread();
        }
        else {
            this.die();
        }
    },

    reborn: function () {
        this._active = true;
        this.StartFlag = 0;
        this.node.x = this.startX;
        this.node.y = this.startY;
        var normal = this.node.getChildByName('normal');
        normal.getComponent(cc.ParticleSystem).resetSystem();
        normal.active = true;
        this.node.getChildByName('explode').active = false;
        this.scene.reset();
    },

    die: function () {
        this._active = false;
        this.node.getChildByName('normal').active = false;
        var explode = this.node.getChildByName('explode');
        explode.getComponent(cc.ParticleSystem).resetSystem();
        explode.active = true;
        this.scheduleOnce(this.reborn, 1);
    },

    
    BeAttract:function( x,y ,direction )
    {   
        this.StartFlag=1;
        cc.log(x,y);
        cc.log(this.node.x, this.node.y);
        var p2=cc.v2(x,y);
        var p1 = cc.v2(this.node.x, this.node.y);
        var radius=cc.pToAngle(cc.pSub(p2,p1));

        cc.log("Radius=",radius, "  ",radius*180/Math.PI);
        
        //radius=radius *Math.PI /360.0;
        
        this.attractiveX= Math.cos(radius) * this.Attractive;
        this.attractiveY= Math.sin(radius) * this.Attractive;
        
        
        if(direction===0)
        {
            
        }
        else
        {
            this.attractiveX=-this.attractiveX;
            this.attractiveY=-this.attractiveY;
        }
        
        
        this.airresistance=0;
        this.dtAcc=0;
    },
    
    setJumpAction: function () 
    {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        
        var callBack = cc.CallFunc(this.callBackJumpEnd,this,0);
       
        // return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
        return cc.sequence(jumpUp, jumpDown, cc.callFunc(function(action,data)
        {
            this.JumpCount--;
        },this,0));
    },
    
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.space:
                        self.lightUp();
                        break;
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                    case cc.KEY.h:
                        
                        if(self.JumpOnce === true)
                            break;
                            
                        self.JumpFlag =true;
                        self.JumpOnce=true;
                        cc.log("!!!!");
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                    case cc.KEY.h:
                        self.JumpOnce=false;
                        break;
                }
            }
        }, self.node);
    },
    
     update: function (dt) 
     {
        if (!this._active) {
            return;
        }

        if (this.StartFlag===0)
            return;
            
        var temp=this.gravity ;
        this.attractiveY=this.attractiveY+ temp;
         
        this.airresistance= Math.sqrt(this.attractiveX * this.attractiveX + this.attractiveY *this.attractiveY) *this.weaken;

        
        var airRX;
        var airRY;
        var radius = cc.pToAngle(cc.pSub(cc.v2(this.attractiveX,this.attractiveY),cc.v2(0,0)));
        airRX=Math.abs(Math.cos(radius) *this.airresistance);
        airRY=Math.abs(Math.sin(radius) *this.airresistance);
        
        if(this.attractiveX>0)
            airRX=-airRX;
            
        if(this.attractiveY>0)
            airRY=-airRY;    
         
       
        this.attractiveX=this.attractiveX+airRX;
        this.attractiveY=this.attractiveY+airRY;
        
        // if(airRX>= Math.abs(this.attractiveX * dt/2))
        // {
        //     airRX=-this.attractiveX * dt/2;
        // }
        // if(airRY>=  Math.abs(this.attractiveY *dt/2))
        // {
        //     airRY=-this.attractiveY * dt/2;
        // }
        
        if(this.dtAcc==0)
            this.dtAcc=dt;
        // else
        // {
        //     this.dtAcc=this.dtAcc*0.98;
        //     if(this.dtAcc<=dt * 0.3)
        //         this.dtAcc=dt*0.3;
        // }
         // 根据当前速度更新主角的位置
        this.node.x = this.node.x + (this.attractiveX * this.dtAcc );
        this.node.y = this.node.y + (this.attractiveY * this.dtAcc);
         
         
        // Check dead
        if (!this.scene.checkLive()) {
            // Dead
            this.die();
        }
         
        return;
        
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
        
        if(this.JumpFlag === true)
        {
            cc.log("JumpCount %d",this.JumpCount);a
            
            if(this.JumpCount >= this.maxJumpCount)
                return;
            this.JumpCount++;
            this.node.runAction(this.jumpAction);
            this.JumpFlag = false ; 
        }
        
    },
});
