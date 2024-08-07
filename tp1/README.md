# SGI 2022/2023 - TP1


## Project information

- Strong points:
  - Tested with multiple scenes and proved to work
  - File structure has been refactored allowing for a quick understanding of the program
  - Quadric primitives are well designed
  - Efficiency optimizations: 
    - Since the scene graph is not a tree, resulting in multiple nodes having the same child, texture coordinates for a primitive need to be accounted for. In order to prevent calling the initGLBuffers functions is frame, each primitive is independent from every other and kept for each traversal path of the scene graph. Since a primitive is just a collection of points, this purely consumes memory and does not hinder efficiency.
- Scene
  - An office room, with several elements and pieces of furniture.
  - Screenshots of the scene can be seen [here](./screenshots/)

- Notes
  - The block for the transformation inside of a component allows for both transformationref's and canonical transformations. We opted to implement it this way because it allows the person writing the xml more freedom and makes more sense from a product development point of view
----
## Issues/Problems

- All functionalities work without problem
