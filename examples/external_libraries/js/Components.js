Game.Components.PixiSprite = function(sprite, parent) {
    this.sprite = sprite;
    this.parent = parent || null;
};

Game.Components.P2Body = function(body) {
    this.body = body;
};

Game.Components.Camera = function(container) {
    this.container = container;
    this.x = 0;
    this.y = 0;
}

Game.Components.CameraFocus = function(){};
Game.Components.Background = function(){};
Game.Components.Draggable = function(){};


Chunks.engine.registerComponents(Game.Components);