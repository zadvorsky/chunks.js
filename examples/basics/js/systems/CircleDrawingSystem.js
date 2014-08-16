// a very basic system for drawing circles on a canvas element
Game.Systems.CircleDrawingSystem = function() {};

Game.Systems.CircleDrawingSystem.prototype = {
    create:function() {
        // entities with a Position and a CircleGraphic will be updated by this system
        this.renderAspect = Chunks.engine.createAspect().all(Game.Components.Position, Game.Components.CircleGraphic);

        this.canvasElement = document.getElementById("main_canvas");
        this.canvasElement.width = Game.WORLD_WIDTH;
        this.canvasElement.height = Game.WORLD_HEIGHT;
        this.ctx = this.canvasElement.getContext('2d');

        this.TWO_PI = Math.PI * 2;
        this.clearColor = 'rgba(0, 0, 0, 0.2)';
    },

    update:function() {
        // clear
        this.ctx.fillStyle = this.clearColor;
        this.ctx.fillRect(0, 0, Game.WORLD_WIDTH, Game.WORLD_HEIGHT);

        // draw circles
        this.renderAspect.forEach(draw, this);

        function draw(entity) {
            var position = entity.get(Game.Components.Position);
            var circle = entity.get(Game.Components.CircleGraphic);

            this.ctx.fillStyle = circle.color;
            this.ctx.beginPath();
            this.ctx.arc(position.x, position.y, circle.radius, 0, this.TWO_PI);
            this.ctx.fill();
        }
    }
};