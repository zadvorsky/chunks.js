Game.Systems.P2PhysicsSystem = function () {};

Game.Systems.P2PhysicsSystem.prototype = {
    create:function(world) {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.P2Body);
        this.aspect.entityAdded.add(this.entityAddedHandler, this);

        this.world = world;
    },

    entityAddedHandler:function(entity) {
        this.world.addBody(entity.get(Game.Components.P2Body).body);
    },

    update:function(delta) {
        this.world.step(delta / 1000);

        this.aspect.forEach(function(entity) {
            if (entity.has(Game.Components.PixiSprite)) {
                var body = entity.get(Game.Components.P2Body).body;
                var sprite = entity.get(Game.Components.PixiSprite).sprite;

                sprite.x = body.position[0] * Game.PHYSICS_SCALE;
                sprite.y = -(body.position[1] * Game.PHYSICS_SCALE) + Game.VIEWPORT_HEIGHT_PX;
                sprite.rotation = -body.angle;
            }
        }, this);
    }
};