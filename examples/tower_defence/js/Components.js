Game.Components.PixiSprite = function(sprite, parent) {
    this.sprite = sprite;
    this.parent = parent || null;
};

Game.Components.Animation = function(object, duration, props, destroyOnComplete) {
    this.object = object;
    this.duration = duration;
    this.props = props;
    this.destroyOnComplete = destroyOnComplete !== undefined ? destroyOnComplete : true;

    this.elapsed = 0;
}

Game.Components.Velocity = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Game.Components.Collision = function(radius) {
    this.radius = radius;
}

Game.Components.BuildTile = function(xIndex, yIndex) {
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.empty = true;
};

Game.Components.PathTile = function(xIndex, yIndex, isStartTile) {
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.isStartTile = isStartTile;
};

Game.Components.Invader = function(speed, value) {
    this.speed = speed;
    this.value = value;
    this.path = null;
    this.next = null; // path node
    this.prev = null; // path node
};

Game.Components.Health = function(v) {
    this.current = v;
    this.max = v;
};

Game.Components.Target = function(target) {
    this.target = target;
};

Game.Components.Tower = function(type, range, shotInterval, projectileSpeed, projectileDamage) {
    this.type = type;
    this.range = range;
    this.projectileSpeed = projectileSpeed;
    this.projectileDamage = projectileDamage;
    this.shotInterval = shotInterval;
    this.elapsed = 0;
};

Game.Components.Projectile = function(splashRadius) {
    this.splashRadius = splashRadius || 0;
    this.hitInvaders = [];
};

Game.Components.Damage = function(damage) {
    this.damage = damage;
};

Game.Components.Slow = function(factor) {
    this.factor = factor;
};

Game.Components.Explosive = function() {
};

Chunks.engine.registerComponents(Game.Components);