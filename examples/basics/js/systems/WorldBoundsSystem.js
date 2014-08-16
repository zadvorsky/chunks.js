Game.Systems.WorldBoundsSystem = function() {};

Game.Systems.WorldBoundsSystem.prototype = {
    create:function() {
        this.destroyAspect = Chunks.engine.createAspect().all(Game.Components.Position).any(Game.Components.Enemy, Game.Components.Coin);
        this.constrainAspsect = Chunks.engine.createAspect().all(Game.Components.Player, Game.Components.Position);
    },

    update:function() {
        this.destroyAspect.forEach(function(entity) {
            var p = entity.get(Game.Components.Position);

            if (p.x < 0 || p.x > Game.WORLD_WIDTH ||
                p.y < 0 || p.y > Game.WORLD_HEIGHT) {

                Chunks.engine.destroyEntity(entity);
            }

        }, this);

        this.constrainAspsect.forEach(function(entity) {
            var p = entity.get(Game.Components.Position);

            p.x = p.x > Game.WORLD_WIDTH ? Game.WORLD_WIDTH : (p.x < 0 ? 0 : p.x);
            p.y = p.y > Game.WORLD_HEIGHT ? Game.WORLD_HEIGHT : (p.y < 0 ? 0 : p.y);

        }, this);
    }
};