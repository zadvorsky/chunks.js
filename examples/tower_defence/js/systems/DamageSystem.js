Game.Systems.DamageSystem = function () {};

Game.Systems.DamageSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.Damage, Game.Components.Projectile);
    },

    update:function() {
        this.aspect.forEach(function(entity) {
            var damage = entity.get(Game.Components.Damage).damage,
                hitInvaders = entity.get(Game.Components.Projectile).hitInvaders;

            for (var i = 0; i < hitInvaders.length; i++) {
                hitInvaders[i].get(Game.Components.Health).current -= damage;
            }
        });
    }
};