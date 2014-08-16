Game.Systems.InvaderMovementSystem = function () {};

Game.Systems.InvaderMovementSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.Invader, Game.Components.PixiSprite, Game.Components.Velocity);
        this.aspect.entityAdded.add(this.entityAddedHandler, this);
    },

    entityAddedHandler:function(entity) {
        var invader = entity.get(Game.Components.Invader);
        var sprite = entity.get(Game.Components.PixiSprite).sprite;

        invader.next = invader.path.next();
        sprite.x = invader.next.xIndex * Game.TILE_SIZE;
        sprite.y = invader.next.yIndex * Game.TILE_SIZE;
    },

    update:function() {
        this.aspect.forEach(function(entity) {
            var invader = entity.get(Game.Components.Invader);
            var sprite = entity.get(Game.Components.PixiSprite).sprite;
            var velocity = entity.get(Game.Components.Velocity);

            if ((invader.prev === null) || checkNextReached(invader, sprite)) {
                var next = invader.path.next();

                if (next) {
                    invader.prev = invader.next;
                    invader.next = next;

                    velocity.x = (next.xIndex - invader.prev.xIndex) * invader.speed;
                    velocity.y = (next.yIndex - invader.prev.yIndex) * invader.speed;
                }
                else {
                    Chunks.engine.destroyEntity(entity);
                    Game.State.lives--;
                }
            }
        });

        function checkNextReached(invader, sprite) {
            var dx = invader.next.xIndex - invader.prev.xIndex,
                dy = invader.next.yIndex - invader.prev.yIndex,
                sx = sprite.x / Game.TILE_SIZE,
                sy = sprite.y / Game.TILE_SIZE,
                reachedX = ((dx <= 0 && sx <= invader.next.xIndex) || (dx >= 0 && sx >= invader.next.xIndex)),
                reachedY = ((dy <= 0 && sy <= invader.next.yIndex) || (dy >= 0 && sy >= invader.next.yIndex));

            return (reachedX && reachedY);
        }
    }
};