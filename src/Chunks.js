var Chunks = {};

Chunks._ENTITY_UID = 0;
Chunks._COMPONENT_UID = 0;

// UTILS

// based on underscore.js
Chunks.extend = function(obj) {
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (obj[prop] === undefined) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
}

// SIGNAL

Chunks.Signal = function() {
    this._handlers = [];
};

Chunks.Signal.prototype = {
    add:function(handler, context){
        this._handlers.push({handler:handler, context:context});
    },

    remove:function(handler, context) {
        var i = this._getIndex(handler, context);

        if (i !== -1) {
            this._handlers.splice(i, 1)
        }
    },

    dispatch:function() {
        var i = this._handlers.length,
            current;

        while (i--) {
            current = this._handlers[i];
            current.handler.apply(current.context, arguments);
        }
    },

    _getIndex:function(h, c) {
        var i = this._handlers.length,
            current;

        while (i--) {
            current = this._handlers[i];
            if (current.handler === h && current.context === c) {
                return i;
            }
        }

        return -1;
    },

    destroy:function() {
        delete this._handlers;
    }
};

// LINKED LIST

Chunks.List = function() {
    this.head = null;
    this.tail = null;
    this.size = 0;
};

Chunks.List.prototype = {
    _createNode:function(data) {
        return {data:data, next:null};
    },

    getLast:function() {
        return this.tail !== null ? this.tail.data : null;
    },

    getFirst:function() {
        return this.head !== null ? this.head.data : null;
    },

    add:function(data) {
        var node = this._createNode(data);

        if (this.head === null) {
            this.head = node;
            this.tail = this.head;
        }
        else {
            this.tail.next = node;
            this.tail = node;
        }

        this.size++;
    },

    remove:function(data) {
        var current = this.head;
        var prev = null;

        while (current !== null) {
            if (data === current.data) {
                if (current === this.head) {
                    this.head = current.next;
                }
                else if (current === this.tail) {
                    prev.next = null;
                    this.tail = prev;
                }
                else {
                    prev.next = current.next;
                }
                this.size--;

                return data;
            }

            prev = current;
            current = current.next;
        }
    },

    removeAll:function() {
        this.forEach(this.remove, this);
        this.head = null;
        this.tail = null;
    },

    contains:function(data) {
        var current = this.head;

        while (current !== null) {
            if (current.data === data) {
                return true;
            }
            current = current.next;
        }

        return false;
    },

    forEach:function(callback, context) {
        var current = this.head;

        while (current !== null) {
            if (callback.call(context, current.data) === false) break;

            current = current.next;
        }
    },

    getIterator:function() {
        return new Chunks.Iterator(this);
    }
};

Chunks.Iterator = function(list) {
    this.head = list.head;
}

Chunks.Iterator.prototype = {

    next:function() {
        var data;

        if (this.head !== null) {
            data = this.head.data;
            this.head = this.head.next;
        }

        return data;
    },

    peek:function() {
        if (this.head !== null) {
            return this.head.data;
        }
        return undefined;
    }
};

// ENTITY

Chunks.Entity = function() {
    this.id = Chunks._ENTITY_UID++;
    this.size = 0;

    this._components = {};
    this._componentsCache = {};
    this._updated = new Chunks.Signal();
};

Chunks.Entity.prototype = {
    add:function(component) {
        if (component.constructor._componentId !== undefined) {
            this._components[component.constructor._componentId] = component;
            this.size++;
        }
        else {
            throw 'Invalid Component added.';
        }

        return this;
    },

    // accepts a component instance or constructor
    // always returns the component instance
    remove:function(componentConstructorOrInstance) {
        // constructor
        if (typeof(componentConstructorOrInstance) === "function" && componentConstructorOrInstance._componentId !== undefined) {
            var temp = this._components[componentConstructorOrInstance._componentId]

            this._componentsCache[componentConstructorOrInstance._componentId] = temp;

            delete this._components[componentConstructorOrInstance._componentId];

            this.size--;

            return temp;
        }
        // instance
        else if (typeof(componentConstructorOrInstance) === "object" && componentConstructorOrInstance.constructor._componentId !== undefined) {
            this._componentsCache[componentConstructorOrInstance.constructor._componentId] = componentConstructorOrInstance;

            delete this._components[componentConstructorOrInstance.constructor._componentId];

            this.size--;

            return componentConstructorOrInstance;
        }
        else {
            throw 'Invalid Component removed';
        }
    },

    removeAll:function() {
        for (var key in this._components) {
            this.remove(this._components[key]);
        }
    },

    get:function(Component, checkCache) {
        if (checkCache === true) {
            return this._components[Component._componentId] || this._componentsCache[Component._componentId];
        }
        return this._components[Component._componentId];
    },

    has:function(Component) {
        return this.get(Component) !== undefined;
    },

    update:function() {
        this._updated.dispatch(this);

        return this;
    },

    clearCache:function() {
        for (var key in this._componentsCache) {
            delete this._componentsCache[key];
        }
    },

    toString:function() {
        return "Entity [id=" + this.id + ", name=" + this.name + "]";
    }
};

// ASPECT

Chunks.Aspect = function() {
    this.entityAdded = new Chunks.Signal();
    this.entityRemoved = new Chunks.Signal();
    this._updated = new Chunks.Signal();

    this._required = [];
    this._optional = [];
    this._forbidden = [];

    this._entities = new Chunks.List();
};

Chunks.Aspect.prototype = {
    all:function() {
        var argArr = Array.prototype.slice.call(arguments);

        this._required = this._required.concat(argArr);

        return this;
    },

    any:function() {
        var argArr = Array.prototype.slice.call(arguments);

        this._optional = this._optional.concat(argArr);

        return this;
    },

    none:function() {
        var argArr = Array.prototype.slice.call(arguments);

        this._forbidden = this._forbidden.concat(argArr);

        return this;
    },

    update:function() {
        this._updated.dispatch(this);

        return this;
    },

    forEach:function(callback, context) {
        this._entities.forEach(callback, context);
    },

    getFirst:function() {
        if (this._entities.head) {
            return this._entities.head.data;
        }

        return undefined;
    },

    _addEntity:function(entity) {
        // never match empty entities
        // this was added to support aspects with only _forbidden Components
        var match = entity.size === 0 ? false : this._matchEntity(entity);
        var contains = this._entities.contains(entity);

        if (match && !contains) {
            this._entities.add(entity);
            this.entityAdded.dispatch(entity);
        } else if (!match && contains) {
            this._entities.remove(entity);
            this.entityRemoved.dispatch(entity);
        }
    },

    _matchEntity:function(entity) {
        var i;
        // first, check forbidden
        i = this._forbidden.length;
        while (i--) {
            if (entity.has(this._forbidden[i])) {
                return false;
            }
        }
        // then, check required
        i = this._required.length;
        while (i--) {
            if (!entity.has(this._required[i])) {
                return false;
            }
        }
        // finally, check optional
        i = this._optional.length;
        if (i > 0) {
            while (i--) {
                if (entity.has(this._optional[i])) {
                    return true;
                }
            }

            return false;
        }

        return true;
    },

    _destroy:function() {
        this.entityAdded.destroy();
        this.entityRemoved.destroy();
        this._updated.destroy();
        this._entities.removeAll();

        delete this.entityAdded;
        delete this.entityRemoved;
        delete this._updated;
        delete this._entities;
        delete this._required;
        delete this._optional;
        delete this._forbidden;
    },

    get size () {
        return this._entities.size;
    },

    isEmpty:function() {
        return this.size === 0;
    }
}

// SYSTEM

Chunks.System = function() {

};

Chunks.System.prototype = {
    create:function() {
    },

    preUpdate:function() {
        return true;
    },

    update:function() {
    },

    postUpdate:function() {

    },

    destroy:function() {
    }
}

// ENGINE (singleton)

Chunks.engine = (function() {
    var _systems = new Chunks.List();
    var _aspects = new Chunks.List();
    var _entities = new Chunks.List();

    var _entityPool = [];

    function _entityUpdated(entity) {
        function checkEntityWithAspect(aspect) {
            aspect._addEntity(entity);
        }

        _aspects.forEach(checkEntityWithAspect, this);
    }

    function _aspectUpdated(aspect) {
        function checkAspectWithEntity(entity) {
            aspect._addEntity(entity);
        }

        _entities.forEach(checkAspectWithEntity, this);
    }

    function _postUpdate() {
        _entities.forEach(function(entity) {
            entity.clearCache();
        }, this);
    }

    return {
        createSystem:function(System, args) {
            Chunks.extend(System.prototype, Chunks.System.prototype);

            var system = new System();

            system.create.apply(system, args);

            _systems.add(system);

            return system;
        },

        createEntity:function(name) {
            var entity = _entityPool.pop() || new Chunks.Entity();

            entity.name = name !== undefined ? name : "";
            entity._updated.add(_entityUpdated);

            _entities.add(entity);

            return entity;
        },

        destroyEntity:function(entity) {
            if (_entities.remove(entity)) {
                // first, remove all components
                // and update all aspects (which will discard the empty entity)
                entity.removeAll();
                entity.update();
                // then clean up the entity
                // and add it to the pool
                entity._updated.remove(_entityUpdated);
                entity.clearCache();
                _entityPool.unshift(entity);
            }
        },

        createAspect:function() {
            var aspect = new Chunks.Aspect();

            aspect._updated.add(_aspectUpdated);

            _aspects.add(aspect);

            return aspect;
        },

        destroyAspect:function(aspect) {
            if (_aspects.remove(aspect)) {
                aspect._destroy();
            }
        },

        registerComponent:function(Component) {
            Component._componentId = Chunks._COMPONENT_UID++;
        },

        registerComponents:function(components) {
            for (var key in components) {
                this.registerComponent(components[key]);
            }
        },

        update:function(delta) {
            function updateSystem(system) {
                if (system.preUpdate(delta) !== false) {
                    system.update(delta);
                    system.postUpdate();
                }
            }

            _systems.forEach(updateSystem, this);

            _postUpdate();
        },

        destroy:function() {
            _systems.forEach(function(system) {
                system.destroy();
            }, this);

            _systems.removeAll();
            _aspects.removeAll();
            _entities.removeAll();

            _entityPool = [];

            Chunks._ENTITY_UID = 0;
            Chunks._COMPONENT_UID = 0;
        }
    };
})();