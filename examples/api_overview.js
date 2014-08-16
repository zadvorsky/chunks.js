// component registration

// components contain data
// components are identified by their constructor
// component constructors must be registered with the engine before they can be used
Components = {};

Components.ComponentOne = function(data) {
    this.data = data;
}

Components.ComponentTwo = function(data) {
    this.data = data;
}

// this registers an object containing several constructors, like the Constructors 'namespace' above
// alternatively, you can register individual constructors with Chunks.engine.registerComponent
Chunks.engine.registerComponents(Components);

// aspect creation

// aspects contain component constructors
// these will be matched whenever an entity is updated
// aspects should always be created by the engine
// aspects can be constructed in several ways

// an aspect that contains entities with an instance of ComponentOne
var aspectOne = Chunks.engine.createAspect().all(Components.ComponentOne);
// an aspect that contains entities with an instance of ComponentTwo
var aspectTwo = Chunks.engine.createAspect().all(Components.ComponentTwo);
// an aspect that contains entities with an instance of ComponentOne AND an instance of ComponentTwo
var aspectBoth = Chunks.engine.createAspect().all(Components.ComponentOne, Components.ComponentTwo);
// an aspect that contains entities with an instance of ComponentOne AND NOT an instance of ComponentTwo
var aspectOnlyOne = Chunks.engine.createAspect().all(Components.ComponentOne).none(Components.ComponentTwo);
// an aspect that contains entities with an instance of ComponentONE OR an instance of ComponentTwo (inclusive)
var aspectAny = Chunks.engine.createAspect().any(Components.ComponentOne, Components.ComponentTwo);

// entity creation

// entities contain components
// entities should always be created by the engine
var entityOne = Chunks.engine.createEntity();
// entities can be given user defined names, which is mostly useful for debugging
var entityTwo = Chunks.engine.createEntity("name");
var entityBoth = Chunks.engine.createEntity();

// adding a component
entityOne.add(new Components.ComponentOne("one"));
entityTwo.add(new Components.ComponentTwo("two"));
// add returns the entity, so chaining is possible
entityBoth.add(new Components.ComponentOne("both")).add(new Components.ComponentTwo("both"));

// after components are added or removed, the entity must be updated
// when updated, the entity is matched with all aspects
// if they DO match, and WERE NOT added previously, they will be added
// if they DO NOT match, and WERE added previously, they will be removed
entityOne.update();
entityTwo.update();
entityBoth.update();

console.log("entities updated");
console.log(aspectOne.size);        // 2 [entityOne, entityBoth]
console.log(aspectTwo.size);        // 2 [entityTwo, entityBoth]
console.log(aspectBoth.size);       // 1 [entityBoth]
console.log(aspectOnlyOne.size);    // 1 [entityOne]
console.log(aspectAny.size);        // 3 [entityOne, entityTwo, entityBoth]

// destroying an entity will remove all of it's components and trigger an update
// the now empty entity will be removed from any aspect that contained it
Chunks.engine.destroyEntity(entityOne);

console.log("entityOne destroyed");
console.log(aspectOne.size);        // 1 [entityBoth] (entityOne has been removed)
console.log(aspectTwo.size);        // 2 [entityTwo, entityBoth] (unaffected)
console.log(aspectBoth.size);       // 1 [entityBoth] (unaffected)
console.log(aspectOnlyOne.size);    // 0 [] (entityOne has been removed)
console.log(aspectAny.size);        // 2 [entityTwo, entityBoth] (entityOne has been removed)

// removing a component, and updating the entity will also update all aspects
entityBoth.remove(Components.ComponentOne);
entityBoth.update();

console.log("ComponentOne removed from entityBoth");
console.log(aspectOne.size);        // 0 [] (entityBoth has been removed)
console.log(aspectTwo.size);        // 2 [entityTwo, entityBoth] (unaffected)
console.log(aspectBoth.size);       // 0 [] (entityBoth has been removed)
console.log(aspectOnlyOne.size);    // 0 [] (unaffected)
console.log(aspectAny.size);        // 2 [entityTwo, entityBoth] (unaffected)

// systems

Systems = {};

Systems.SystemOne = function() {

}

Systems.SystemOne.prototype = {
    // create is called when a system instance is created
    // create aspects here
    create:function() {
        this.aspectOne = Chunks.engine.createAspect().all(Components.ComponentOne);
        this.aspectOne.entityAdded.add(this.entityAddedHandler, this);
        this.aspectOne.entityRemoved.add(this.entityRemovedHandler, this);
    },
    // triggered when an entity is added to the aspect
    entityAddedHandler:function(entity) {
        console.log("added entity " + entity);
    },
    // triggered when an entity is removed from the aspect
    entityRemovedHandler:function(entity) {
        console.log("removed entity " + entity);
    },
    // preUpdate is called by engine before update
    // if it returns false, update (and postUpdate) will not be called
    preUpdate:function() {
        return this.aspectOne.isEmpty() === false;
    },
    // update is called by engine
    update:function() {
        this.aspectOne.forEach(function(entity) {
            console.log(entity.get(Components.ComponentOne).data);
        }, this);
    },
    // postUpdate is called by the engine after update
    // it's mostly here for symmetry, but may be useful
    postUpdate:function() {

    },
    // destroy is called by engine.destroy()
    // destroy aspects here
    destroy:function() {
        Chunks.engine.destroyAspect(this.aspectOne);
    }
}

// create an instance of the system, and add it to the engine
// returns the instance that was just created
Chunks.engine.createSystem(Systems.SystemOne);

// one-liner for entity creation
Chunks.engine.createEntity().add(new Components.ComponentOne("foo")).update();

// updates all systems
// systems are updated in the order they are created
Chunks.engine.update();

// calls destroy on all systems (in the order they were created)
// removes all aspects
// removes all systems
// removes all entities
// components are not unregistered
// after the engine is destroyed, it can be used again
Chunks.engine.destroy();