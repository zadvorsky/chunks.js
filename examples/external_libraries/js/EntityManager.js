Game.EntityManager = {

    // RESOURCES

    init:function(p2World) {
        this.p2World = p2World;

        this.initContainers();
        this.initTextures();
        this.initMaterials();
    },

    initContainers:function() {
        this.cameraContainer = new PIXI.DisplayObjectContainer();
    },

    initTextures:function() {
        this.projectileTexture = PIXI.Texture.fromImage('res/projectile.png');
        this.backgroundTexture = PIXI.Texture.fromImage('res/background.png');
        this.groundTexture = PIXI.Texture.fromImage('res/ground.png');
    },

    initMaterials:function() {
        this.projectileMaterial = new p2.Material();
        this.wallMaterial = new p2.Material();

        this.p2World.addContactMaterial(new p2.ContactMaterial(this.wallMaterial, this.projectileMaterial, {
            restitution:0.5,
            friction:1
        }));
    },

    // ENTITY CREATION

    createCameraContainer:function() {
        var e = Chunks.engine.createEntity('camera_container');

        e.add(new Game.Components.PixiSprite(this.cameraContainer));

        e.update();
    },

    createCamera:function() {
        var e = Chunks.engine.createEntity('camera');

        e.add(new Game.Components.Camera(this.cameraContainer));

        e.update();
    },

    createBackground:function() {
        var e = Chunks.engine.createEntity('background');
        var sprite = new PIXI.TilingSprite(this.backgroundTexture, Game.VIEWPORT_WIDTH_PX, Game.VIEWPORT_HEIGHT_PX);

        e.add(new Game.Components.PixiSprite(sprite));
        e.add(new Game.Components.Background());

        e.update();
    },

    createProjectile:function(x, y) {
        var e = Chunks.engine.createEntity('projectile');

        var sprite = new PIXI.Sprite(this.projectileTexture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        var body = new p2.Body({
            mass:1,
            position:[x, y]
        });

        var shape = new p2.Rectangle(2, 2);
        shape.material = this.projectileMaterial;
        body.addShape(shape);

        e.add(new Game.Components.PixiSprite(sprite, this.cameraContainer));
        e.add(new Game.Components.P2Body(body));
        e.add(new Game.Components.Draggable());
        e.add(new Game.Components.CameraFocus());

        e.update();
    },

    createGround:function() {
        var e = Chunks.engine.createEntity('ground');

        var sprite = new PIXI.TilingSprite(this.groundTexture, Game.VIEWPORT_WIDTH_PX * 100, 32);

        var shape = new p2.Plane();
        shape.material = this.wallMaterial;

        var body = new p2.Body({
            position:[0, 1]
        });
        body.addShape(shape);

        e.add(new Game.Components.P2Body(body));
        e.add(new Game.Components.PixiSprite(sprite, this.cameraContainer));

        e.update();
    }
};