Game.Systems.TowerFiringSystem = function () {};

Game.Systems.TowerFiringSystem.prototype = {
    create:function() {
        this.towerAspect = Chunks.engine.createAspect().all(Game.Components.Tower, Game.Components.PixiSprite);
        this.invaderAspect = Chunks.engine.createAspect().all(Game.Components.Invader, Game.Components.PixiSprite);
    },

    update:function(delta) {
        this.towerAspect.forEach(function(entity) {
            var tower = entity.get(Game.Components.Tower),
                nearestInvader;

            tower.elapsed += delta;

            if (tower.elapsed >= tower.shotInterval) {
                tower.elapsed = 0;

                nearestInvader = this.findNearestInvader(entity);

                if (nearestInvader !== null) {
                    this.fireAtInvader(entity, nearestInvader);
                }
            }
        }, this);
    },

    findNearestInvader:function(towerEntity) {
        var tower = towerEntity.get(Game.Components.Tower),
            towerSprite = towerEntity.get(Game.Components.PixiSprite).sprite,
            nearestInvader = null,
            nearestDistance = Infinity;

        this.invaderAspect.forEach(function(invaderEntity) {
           var invaderSprite = invaderEntity.get(Game.Components.PixiSprite).sprite,
               dx = Math.abs(towerSprite.x - invaderSprite.x),
               dy = Math.abs(towerSprite.y - invaderSprite.y),
               distance = Math.sqrt((dx * dx) + (dy * dy));

           if (distance <= tower.range && distance < nearestDistance) {
               nearestDistance = distance;
               nearestInvader = invaderEntity;
           }
        }, this);

        return nearestInvader;
    },

    fireAtInvader:function(towerEntity, invaderEntity) {
        var tower = towerEntity.get(Game.Components.Tower),
            towerSprite = towerEntity.get(Game.Components.PixiSprite).sprite,
            invaderSprite = invaderEntity.get(Game.Components.PixiSprite).sprite;

        var dx = invaderSprite.x - towerSprite.x,
            dy = invaderSprite.y - towerSprite.y,
            distance = Math.sqrt((dx * dx) + (dy * dy)),
            vx = dx / distance * tower.projectileSpeed,
            vy = dy / distance * tower.projectileSpeed;

        Game.EntityManager.createProjectile(tower.type, tower.projectileDamage, towerSprite.x, towerSprite.y, vx, vy, invaderSprite);
    }
};