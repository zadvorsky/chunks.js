Game.Systems.AnimationSystem = function() {};

Game.Systems.AnimationSystem.prototype = {
    create:function() {
        this.aspect = Chunks.engine.createAspect().all(Game.Components.Animation);
        this.aspect.entityAdded.add(this.entityAddedHandler, this);

        this.entityToTweenMap = {};
    },

    entityAddedHandler:function(entity) {
        var a = entity.get(Game.Components.Animation);
        var tween = TweenLite.to(a.object, a.duration, a.props);

        tween.pause();

        this.entityToTweenMap[entity.id] = tween;
    },

    update:function(delta) {
        this.aspect.forEach(function(entity) {
            var tween = this.entityToTweenMap[entity.id];
            var animation = entity.get(Game.Components.Animation);
            var progress;

            animation.elapsed += delta / 1000;
            progress = animation.elapsed / animation.duration;
            tween.progress(progress);

            if (progress >= 1) {
                delete this.entityToTweenMap[entity.id];

                if (animation.destroyOnComplete === true) {
                    Chunks.engine.destroyEntity(entity);
                }
                else {
                    entity.remove(Game.Components.Animation);
                    entity.update();
                }
            }

        }, this);
    }
};