Game.Systems.InvaderHealthSystem = function () {};

Game.Systems.InvaderHealthSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.Invader, Game.Components.Health);
        this.aspect.entityAdded.add(this.entityAddedHandler, this);
        this.aspect.entityRemoved.add(this.entityRemovedHandler, this);

        this.entityIdToHealthBarMap = {};
    },

    entityAddedHandler:function(entity) {
        var sprite = entity.get(Game.Components.PixiSprite).sprite;

        this.entityIdToHealthBarMap[entity.id] = Game.EntityManager.createInvaderHealthBar(sprite);
    },

    entityRemovedHandler:function(entity) {
        var healthBar = this.entityIdToHealthBarMap[entity.id];

        delete this.entityIdToHealthBarMap[entity.id];

        Chunks.engine.destroyEntity(healthBar);
    },

    update:function() {
        this.aspect.forEach(function(entity) {
            var health = entity.get(Game.Components.Health),
                invader = entity.get(Game.Components.Invader);

            this.updateHealthBar(entity, health);

            if (health.current <= 0) {
                Game.State.budget += invader.value;
                Chunks.engine.destroyEntity(entity);
            }
        }, this);
    },

    updateHealthBar:function(invaderEntity, health) {
        var healthBarEntity = this.entityIdToHealthBarMap[invaderEntity.id],
            healthBarSprite = healthBarEntity.get(Game.Components.PixiSprite).sprite,
            percentage = health.current / health.max;

        healthBarSprite.barFill.scale.x = percentage;
    }
};