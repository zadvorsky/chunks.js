Game.Systems.PositionSystem = function() {};
Game.Systems.PositionSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.PixiSprite, Game.Components.Velocity);
    },

    update:function(delta) {
        var dt = delta / 1000;

        this.aspect.forEach(function(entity) {
            var p = entity.get(Game.Components.PixiSprite).sprite;
            var v = entity.get(Game.Components.Velocity);

            p.x += v.x * dt;
            p.y += v.y * dt;
        }, this);
    }
};