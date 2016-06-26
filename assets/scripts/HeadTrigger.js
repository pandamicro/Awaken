var Attacker = require('Attacker');

cc.Class({
    extends: cc.Component,

    properties: {
        hero: Attacker
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('touchend', function () {
            if (this.hero) {
                this.hero.attack(this.node);
            }
        }, this);
    }
});
