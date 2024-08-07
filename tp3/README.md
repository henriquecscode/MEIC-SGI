# SGI 2022/2023 - TP3

### Project information

- Strong points:
  - Milestone 1
    - Tested with multiple scenes and proved to work
    - File structure has been refactored allowing for a quick understanding of the program
    - Quadric primitives are well designed
    - Efficiency optimizations: 
      - Since the scene graph is not a tree, resulting in multiple nodes having the same child, texture coordinates for a primitive need to be accounted for. In order to prevent calling the initGLBuffers functions is frame, each primitive is independent from every other and kept for each traversal path of the scene graph. Since a primitive is just a collection of points, this purely consumes memory and does not hinder efficiency.
  - Milestone 2
    - Fixed milestone 1 issues with text textures (as can be seen by the exit sign in the door)
    - Each lid for the barrels are a single nurb
    - Walls are now nurbs allowing for better lighting
    - Some animations displayed are complex, using animations both before and after the static transformations by encapsulating the component in another one (as recommended by the teacher)
    - The shader is able to calculate ilumination
- Scene
  - An office room, with several elements and pieces of furniture.
  - For Milestone 2:
    - Added surreal animations, displaying scaling, rotation and translation
    - Curtains make use of the tent nurb
    - Walls make use of the rectangle nurb
    - Cans on the shelves make use of the barrel nurb
  - For Milestone 3:
    - Removed highlights and animations
    - Added another scene, a pizzeria
    - Menu allows to select the material and textures of the scene by first picking the object and then the material or the scene
    - Menu allows to select the scene by click the respective button
    - Starting the game can either be done by the scene button or by the GUI
    - There are four player buttons
      - Undo, which undoes the last move
      - Replay, which will restart the game and do a movie with the plays of the game
      - Camera which will rotate the camera to the other player
      - End turn which, in case it is possible to pass, will pass the turn to the other player
    - There are four game buttons
      - Visible light which, when clicked, will show the object associated with the spotlight that only shows when a piece moves in the main board
      - Continue time which will resume the timer
      - Stop time which will pause the timer
      - Reset which will reset the game
    - The leaderboard is displayed in the bot right corner and shows the player times and the turn time, who is playing, the pieces and overall scores, and a help message
  - Screenshots of the scene can be seen [here](./screenshots/)

----
### Issues/Problems

- All functionalities work without problem
