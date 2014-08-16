Game.Systems.PlayerControlSystem = function() {};

Game.Systems.PlayerControlSystem.prototype = {
    create:function() {
        this.playerAspect = Chunks.engine.createAspect().all(Game.Components.Player, Game.Components.Velocity);
        this.downKeys = {};

        function keyDown(event) {
            this.downKeys[event.keyCode] = true;
        }
        function keyUp(event) {
            delete this.downKeys[event.keyCode];
        }

        document.onkeydown = keyDown.bind(this);
        document.onkeyup = keyUp.bind(this);
    },

    update:function(delta) {
        var player = this.playerAspect.getFirst(),
            playerSpeed = player.get(Game.Components.Player).speed,
            playerVelocity = player.get(Game.Components.Velocity),
            right = this.downKeys[39],
            left = this.downKeys[37],
            down = this.downKeys[40],
            up = this.downKeys[38],
            dx = right ? 1 : (left ? -1 : 0),
            dy = down ? 1 : (up ? -1 : 0),
            length = Math.sqrt((dx * dx) + (dy * dy));

        if (length > 0) {
            var ndx = dx / length,
                ndy = dy / length;

            playerVelocity.x = ndx * playerSpeed;
            playerVelocity.y = ndy * playerSpeed;
        }
        else {
            playerVelocity.x = 0;
            playerVelocity.y = 0;
        }
    }
};