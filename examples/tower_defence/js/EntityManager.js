Game.EntityManager = {

    // RESOURCES

    init:function() {
        this.container = new PIXI.DisplayObjectContainer();
        this.container.x = Game.VIEWPORT_X;
        this.container.y = Game.VIEWPORT_Y;

        this.buildTileTexture = PixiUtils.generateTilingRectTexture(Game.TILE_SIZE - 1, Game.TILE_SIZE - 1, 0x666666, 0x888888);
        this.pathTileTexture = PixiUtils.generateTilingRectTexture(Game.TILE_SIZE - 1, Game.TILE_SIZE - 1, 0xcccccc, 0xeeeeee);
        this.invaderTexture = PixiUtils.generateCircTexture(10, 0xff0000, 0x000000);
        this.towerTexture = PixiUtils.generateRectTexture(32, 32, 0xffffff);
        this.projectileTexture = PixiUtils.generateCircTexture(4, 0xffffff);
        this.explosionTexture = PixiUtils.generateCircTexture(40, 0xFFA500);

        this.healthBarBackgroundTexture = PixiUtils.generateRectTexture(38, 4, 0x000000);
        this.healthBarForegroundTexture = PixiUtils.generateRectTexture(38, 4, 0xbada55);
    },

    // ENTITY CREATION

    parseGrid:function(grid) {

        for (var i = 0; i < grid.length; i++) {

            for (var j = 0; j < grid[i].length; j++) {

                switch (grid[i][j]) {
                    case Game.Tiles.START:
                        this.createPathTile(j, i, true);
                        break;
                    case Game.Tiles.PATH:
                        this.createPathTile(j, i, false);
                        break;
                    case Game.Tiles.BUILD:
                        this.createBuildTile(j, i);
                        break;
                    default:
                        break;
                }
            }
        }
    },

    createContainer:function() {
        var e = Chunks.engine.createEntity('container');

        e.add(new Game.Components.PixiSprite(this.container));

        e.update();
    },

    createPathTile:function(xIndex, yIndex, isStartTile) {
        var e = Chunks.engine.createEntity('path_tile');

        var sprite = new PIXI.Sprite(this.pathTileTexture);
        sprite.x = xIndex * Game.TILE_SIZE;
        sprite.y = yIndex * Game.TILE_SIZE;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.PathTile(xIndex, yIndex, isStartTile));
        e.update();
    },

    createBuildTile:function(xIndex, yIndex) {
        var e = Chunks.engine.createEntity('build_tile');

        var sprite = new PIXI.Sprite(this.buildTileTexture);
        sprite.x = xIndex * Game.TILE_SIZE;
        sprite.y = yIndex * Game.TILE_SIZE;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.BuildTile(xIndex, yIndex));
        e.update();
    },

    createInvader:function(speed, health, value) {
        var e = Chunks.engine.createEntity('invader');

        var sprite = new PIXI.Sprite(this.invaderTexture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.Invader(speed, value));
        e.add(new Game.Components.Velocity());
        e.add(new Game.Components.Collision(6)); // 6
        e.add(new Game.Components.Health(health));

        e.update();
    },

    createInvaderHealthBar:function(parent) {
        var e = Chunks.engine.createEntity('invader_heath_bar');

        var healthBarContainer = new PIXI.DisplayObjectContainer(),
            healthBarBackground = new PIXI.Sprite(this.healthBarBackgroundTexture),
            healthBarForeground = new PIXI.Sprite(this.healthBarForegroundTexture);

        healthBarBackground.x = healthBarForeground.x = -20;
        healthBarBackground.y = healthBarForeground.y = -18;
        healthBarContainer.addChild(healthBarBackground);
        healthBarContainer.addChild(healthBarForeground);
        healthBarContainer.barFill = healthBarForeground;
        healthBarContainer.alpha = 0.75;

        e.add(new Game.Components.PixiSprite(healthBarContainer, parent));
        e.update();

        return e;
    },

    createRegularTower:function(xIndex, yIndex, damage) {
        var e = Chunks.engine.createEntity('tower');

        var sprite = new PIXI.Sprite(this.towerTexture);
        sprite.x = xIndex * Game.TILE_SIZE;
        sprite.y = yIndex * Game.TILE_SIZE;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.tint = 0x000000;

        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.Tower('regular', 96, 1000, 400, damage)); // type, range, shotInterval, projectileSpeed, projectileDamage
        e.update();
    },

    createSlowingTower:function(xIndex, yIndex, damage) {
        var e = Chunks.engine.createEntity('tower');

        var sprite = new PIXI.Sprite(this.towerTexture);
        sprite.x = xIndex * Game.TILE_SIZE;
        sprite.y = yIndex * Game.TILE_SIZE;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.tint = 0x5F9F9F;

        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.Tower('slowing', 96, 1000, 400, damage)); // type, range, shotInterval, projectileSpeed, projectileDamage
        e.update();
    },

    createExplosiveTower:function(xIndex, yIndex, damage) {
        var e = Chunks.engine.createEntity('tower');

        var sprite = new PIXI.Sprite(this.towerTexture);
        sprite.x = xIndex * Game.TILE_SIZE;
        sprite.y = yIndex * Game.TILE_SIZE;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.tint = 0xFFA500;

        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.Tower('explosive', 96, 1000, 400, damage)); // type, range, shotInterval, projectileSpeed, projectileDamage
        e.update();
    },

    createProjectile:function(type, damage, x, y, vx, vy, target) {
        switch(type) {
            case 'regular':
                this.createRegularProjectile(damage, x, y, vx, vy, target);
                break;
            case 'slowing':
                this.createSlowingProjectile(damage, x, y, vx, vy, target);
                break;
            case 'explosive':
                this.createExplosiveProjectile(damage, x, y, vx, vy, target);
                break;
        }
    },

    createRegularProjectile:function(damage, x, y, vx, vy, target) {
        var e = Chunks.engine.createEntity('projectile');

        var sprite = new PIXI.Sprite(this.projectileTexture);
        sprite.x = x;
        sprite.y = y;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.tint = 0x000000;

        e.add(new Game.Components.Projectile());
        e.add(new Game.Components.Damage(damage));
        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.Velocity(vx, vy));
        e.add(new Game.Components.Collision(4)); // 4
        e.add(new Game.Components.Target(target));
        e.update();
    },

    createSlowingProjectile:function(damage, x, y, vx, vy, target) {
        var e = Chunks.engine.createEntity('projectile');

        var sprite = new PIXI.Sprite(this.projectileTexture);
        sprite.x = x;
        sprite.y = y;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.tint = 0x5F9F9F;

        e.add(new Game.Components.Projectile());
        e.add(new Game.Components.Damage(damage));
        e.add(new Game.Components.Slow(0.8));
        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.Velocity(vx, vy));
        e.add(new Game.Components.Collision(4)); // 4
        e.add(new Game.Components.Target(target));
        e.update();
    },

    createExplosiveProjectile:function(damage, x, y, vx, vy, target) {
        var e = Chunks.engine.createEntity('projectile');

        var sprite = new PIXI.Sprite(this.projectileTexture);
        sprite.x = x;
        sprite.y = y;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.tint = 0xFFA500;

        e.add(new Game.Components.Projectile(45));
        e.add(new Game.Components.Explosive());
        e.add(new Game.Components.Damage(damage));
        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.add(new Game.Components.Velocity(vx, vy));
        e.add(new Game.Components.Collision(4)); // 4
        e.add(new Game.Components.Target(target));
        e.update();
    },

    createExplosion:function(x, y) {
        var e = Chunks.engine.createEntity('explosion');

        var sprite = new PIXI.Sprite(this.explosionTexture);
        sprite.x = x;
        sprite.y = y;
        sprite.alpha = 0.5;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        sprite.scale.x = 1e-6;
        sprite.scale.y = 1e-6;

        e.add(new Game.Components.Animation(sprite.scale, 0.3, {x:1, y:1, ease:Cubic.easeOut}));
        e.add(new Game.Components.PixiSprite(sprite, this.container));
        e.update();
    }
};