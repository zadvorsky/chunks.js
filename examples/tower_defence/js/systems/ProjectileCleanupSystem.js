Game.Systems.ProjectileCleanupSystem = function () {};

Game.Systems.ProjectileCleanupSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.Projectile, Game.Components.PixiSprite);

        this.xMin = 0;
        this.yMin = 0;
        this.xMax = Game.VIEWPORT_WIDTH_PX + Game.TILE_SIZE;
        this.yMax = Game.VIEWPORT_HEIGHT_PX + Game.TILE_SIZE;
    },

    update:function() {
        this.aspect.forEach(function(entity) {
            var sprite = entity.get(Game.Components.PixiSprite).sprite,
                hits = entity.get(Game.Components.Projectile).hitInvaders;

            if (hits.length > 0 ||
                sprite.x < this.xMin ||
                sprite.x > this.xMax ||
                sprite.y < this.yMin ||
                sprite.y > this.yMax) {

                Chunks.engine.destroyEntity(entity);
            }

        }, this);
    }
};