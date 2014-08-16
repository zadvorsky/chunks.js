Game.Systems.TowerBuildingSystem = function () {};

Game.Systems.TowerBuildingSystem.prototype = {
    create:function() {
        this.towerModels = {
            regular_tower:{
                id:0,
                name:"Regular Tower",
                description:"Regular ol' tower",
                cost:10,
                damage:1
            },
            slowing_tower:{
                id:1,
                name:"Slowing Tower",
                description:"Slows targets it hits",
                cost:20,
                damage:1
            },
            explosive_tower:{
                id:2,
                name:"Explosive Tower",
                description:"Projectiles explode on impact",
                cost:50,
                damage:5
            }
        }

        this.buildTileAspect = Chunks.engine.createAspect().all(Game.Components.BuildTile, Game.Components.PixiSprite);
        this.buildTileAspect.entityAdded.add(this.buildTileAddedHandler, this);

        this.$towerButtons = $('.tower_button').click(this, $.proxy(towerButtonClickHandler, this));
        this.$towerNameField = $('#tower_info_title');
        this.$towerStatsField = $('#tower_info_stats');
        this.$towerDescriptionField = $('#tower_info_body');

        this.selectedTowerModel = null;

        function towerButtonClickHandler(event) {
            this.selectedTowerModel = this.towerModels[event.target.id];
            this.updateUI();

            this.$towerButtons.removeClass('tower_button_selected');
            $(event.target).addClass('tower_button_selected');
        }
    },

    updateUI:function() {
        var m = this.selectedTowerModel;

        this.$towerNameField.html(m.name);
        this.$towerStatsField.html('<b>Cost:</b> ' + m.cost + ' <b>Damage:</b> ' + m.damage);
        this.$towerDescriptionField.html(m.description);
    },

    buildTileAddedHandler:function(entity) {
        var buildCallback = this.buildTowerAt.bind(this, entity);
        var sprite = entity.get(Game.Components.PixiSprite).sprite;

        sprite.interactive = true;
        sprite.mouseover = function() {this.tint = 0xB4CDCD;};
        sprite.mouseout = function() {this.tint = 0xFFFFFF;};
        sprite.click = buildCallback;
    },

    buildTowerAt:function(tileEntity) {
        var tile = tileEntity.get(Game.Components.BuildTile);

        if (this.selectedTowerModel !== null &&
            this.selectedTowerModel.cost <= Game.State.budget &&
            tile.empty === true) {

            Game.State.budget -= this.selectedTowerModel.cost;
            tile.empty = false;

            switch (this.selectedTowerModel.id) {
                case 0:
                    Game.EntityManager.createRegularTower(tile.xIndex, tile.yIndex, this.selectedTowerModel.damage);
                    break;
                case 1:
                    Game.EntityManager.createSlowingTower(tile.xIndex, tile.yIndex, this.selectedTowerModel.damage);
                    break;
                case 2:
                    Game.EntityManager.createExplosiveTower(tile.xIndex, tile.yIndex, this.selectedTowerModel.damage);
                    break;
            }
        }
    },

    preUpdate:function() {return false}
};
