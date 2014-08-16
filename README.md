### chunks.js
Chunks is an [ECS](http://en.wikipedia.org/wiki/Entity_component_system) implementation in JavaScript.
Chunks consists of four basic objects:

+ *Components* have data, no logic.
+ *Entities* have components, no logic.
+ *Aspects* are lists of components which have a particular set of components.
+ *System* contain all the logic, operating on aspects.

### Usage
Every object in your game is an entity with particular components.
These entities are grouped into aspects, which are operated on by systems.
The game loop consists of a number of systems being updated in order, changing the data stored in the components.
For instance, an entity may have an Image and a Position.
The position is changed by a system that handles player input
The image gets drawn at the position by a system that draws the screen.
### Pros
+ Avoid problems caused by inheritance in games with many different objects.
+ Clear code execution order.
+ High modularity makes it easy to add and remove chunks of game logic without affecting the rest. For instance, you could implement different game modes by initialising different sets of systems.
+ Data is clearly separated from logic. This makes Chunks suitable for multi-player games where data has to be synced between clients and a server.
+ Saving and loading can be easily implemented by serialising all entities and recreating them with dematerialised data.
### Cons
+ More overhead for smaller projects.