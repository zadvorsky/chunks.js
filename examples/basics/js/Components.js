Game.Components.Position = function(x, y) {
    this.x = x;
    this.y = y;
};
Game.Components.Velocity = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};
Game.Components.Collision = function(radius) {
    this.radius = radius;
};
Game.Components.CircleGraphic = function(radius, color) {
    this.radius = radius;
    this.color = color;
};
Game.Components.Player = function(speed) {
    this.speed = speed;
};
Game.Components.Enemy = function() {

};
Game.Components.Coin = function(value) {
    this.value = value;
};

Chunks.engine.registerComponents(Game.Components);
