# SGI 2022/2023 - TP2

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
    - The shader is able to calculate ilumination and work with textures
- Scene
  - An office room, with several elements and pieces of furniture.
  - For Milestone 2:
    - Added surreal animations, displaying scaling, rotation and translation
    - Curtains make use of the tent nurb
    - Walls make use of the rectangle nurb
    - Cans on the shelves make use of the barrel nurb
  - Screenshots of the scene can be seen [here](./screenshots/)

- Notes
  - The block for the transformation inside of a component allows for both transformationref's and canonical transformations. We opted to implement it this way because it allows the person writing the xml more freedom and makes more sense from a product development point of view
----
### Issues/Problems

- All functionalities work without problem


### Notes

- Some classes do not follow the naming specified on the project description. Namely, MyKeyframeAnimation is instead just called Animation and MyPatch is just called Patch.
