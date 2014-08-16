// this system will check for collisions between:
// player and enemies
// player and coins
Game.Systems.CollisionSystem = function() {};

Game.Systems.CollisionSystem.prototype = {
    create:function() {
        this.enemyAspect = Chunks.engine.createAspect().all(Game.Components.Enemy, Game.Components.Position, Game.Components.Collision);
        this.coinAspect = Chunks.engine.createAspect().all(Game.Components.Coin, Game.Components.Position, Game.Components.Collision);
        this.playerAspect = Chunks.engine.createAspect().all(Game.Components.Player, Game.Components.Position, Game.Components.Collision);
    },

    update:function() {
        // there is only one player, so this is save
        var player = this.playerAspect.getFirst();
        var playerPosition = player.get(Game.Components.Position);
        var playerRadius = player.get(Game.Components.Collision).radius;

        this.coinAspect.forEach(function(entity) {
            var position = entity.get(Game.Components.Position);
            var radius = entity.get(Game.Components.Collision).radius;
            var value = entity.get(Game.Components.Coin).value;

            if (checkOverlap(playerPosition, playerRadius, position, radius)) {
                Game.State.score += value;

                Chunks.engine.destroyEntity(entity);
            }
        }, this);

        this.enemyAspect.forEach(function(entity) {
            var position = entity.get(Game.Components.Position);
            var radius = entity.get(Game.Components.Collision).radius;

            if (checkOverlap(playerPosition, playerRadius, position, radius)) {
                Game.State.gameOver = true;

                Chunks.engine.destroyEntity(player);

                // returning false halts iteration
                return false;
            }

            return true;
        }, this);

        function checkOverlap(p1, r1, p2, r2) {
            var dx = p1.x - p2.x,
                dy = p1.y - p2.y,
                d = Math.sqrt((dx * dx) + (dy * dy)),
                r = r1 + r2;

            return (d < r);
        }
    }
};