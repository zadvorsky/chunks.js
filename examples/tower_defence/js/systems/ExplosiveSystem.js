Game.Systems.ExplosiveSystem = function () {};

Game.Systems.ExplosiveSystem.prototype = {
    create:function() {
        this.projectileAspect = Chunks.engine.createAspect().all(Game.Components.Explosive, Game.Components.Projectile);
    },

    update:function() {
        this.projectileAspect.forEach(function(entity) {
            var hits = entity.get(Game.Components.Projectile).hitInvaders,
                sprite = entity.get(Game.Components.PixiSprite).sprite;

            if (hits.length > 0) {
                Game.EntityManager.createExplosion(sprite.x, sprite.y);
            }
        }, this);
    }
};