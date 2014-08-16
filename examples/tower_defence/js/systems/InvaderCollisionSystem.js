Game.Systems.InvaderCollisionSystem = function() {};

Game.Systems.InvaderCollisionSystem.prototype = {
    create:function() {
        this.invaderAspect = Chunks.engine.createAspect().all(Game.Components.Invader, Game.Components.PixiSprite, Game.Components.Collision);
        this.projectileAspect = Chunks.engine.createAspect().all(Game.Components.Projectile, Game.Components.PixiSprite, Game.Components.Collision);
    },

    update:function() {
        this.projectileAspect.forEach(function(entity) {
            var sprite = entity.get(Game.Components.PixiSprite).sprite,
                radius = entity.get(Game.Components.Collision).radius,
                splashRadius = entity.get(Game.Components.Projectile).splashRadius,
                hits = entity.get(Game.Components.Projectile).hitInvaders;

            // reset hits (these would be the hits calculated last frame)
            hits.length = 0;
            // check if any invaders are hit
            this.getInvadersHit(sprite, radius, hits);
            // if so, and the projectile has a splash damage radius, check again
            if (hits.length > 0 && splashRadius > 0) {
                this.getInvadersHit(sprite, splashRadius, hits);
            }

        }, this);
    },

    getInvadersHit:function(projectileSprite, projectileRadius, hits) {
        this.invaderAspect.forEach(function(invaderEntity) {
            var invaderSprite = invaderEntity.get(Game.Components.PixiSprite).sprite,
                invaderRadius = invaderEntity.get(Game.Components.Collision).radius;

            if (this.checkOverlap(projectileSprite, projectileRadius, invaderSprite, invaderRadius)) {
                if (hits.indexOf(invaderEntity) === -1) {
                    hits.push(invaderEntity);
                }
            }
        }, this);
    },

    checkOverlap:function(p1, r1, p2, r2) {
        var dx = p1.x - p2.x,
            dy = p1.y - p2.y,
            d = Math.sqrt((dx * dx) + (dy * dy)),
            r = r1 + r2;

        return (d < r);
    }
};