Game.Systems.SlowingSystem = function () {};

Game.Systems.SlowingSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.Slow, Game.Components.Projectile);
    },

    update:function() {
        this.aspect.forEach(function(entity) {
            var slowFactor = entity.get(Game.Components.Slow).factor,
                hitInvaders = entity.get(Game.Components.Projectile).hitInvaders,
                invaderEntity,
                invader,
                velocity;

            for (var i = 0; i < hitInvaders.length; i++) {
                invaderEntity = hitInvaders[i];
                velocity = invaderEntity.get(Game.Components.Velocity);
                invader = invaderEntity.get(Game.Components.Invader);

                velocity.x *= slowFactor;
                velocity.y *= slowFactor;

                invader.speed *= slowFactor;
            }
        });
    }
};