Game.Systems.TargetSeekingSystem = function () {};

Game.Systems.TargetSeekingSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.PixiSprite, Game.Components.Velocity, Game.Components.Target);
    },

    update:function(delta) {
        this.aspect.forEach(function(entity) {
            var target = entity.get(Game.Components.Target).target;
            var sprite = entity.get(Game.Components.PixiSprite).sprite;
            var velocity = entity.get(Game.Components.Velocity);

            var dx = target.x - sprite.x,
                dy = target.y - sprite.y,
                d = Math.sqrt((dx * dx) + (dy * dy)),
                speed = Math.sqrt((velocity.x * velocity.x) + (velocity.y * velocity.y));

            if (d > speed * (delta / 1000)) {
                var ndx = dx / d,
                    ndy = dy / d;

                velocity.x = ndx * speed;
                velocity.y = ndy * speed;
            }
            else {
                entity.remove(Game.Components.Target);
                entity.update();
            }
        });
    }
};