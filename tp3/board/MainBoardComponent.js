import { GeneralBoardComponent } from "./GeneralBoardComponent.js";
import { PlayerCheckerComponent } from "./PlayerCheckerComponent.js";
import { TextButtonComponent } from "../components/TextButtonComponent.js";
import { Material } from "../materials/Material.js";
import { Sprite } from "../sprites/Sprite.js";
import { MyLiddedCylinder } from "../primitives/MyLiddedCylinder.js";
import { GameState } from "../game/src/State/GameState.js";
import { BoardCamera } from "./BoardCamera.js";

var CUBE_SIZE = 0.5;
export class MainBoardComponent extends GeneralBoardComponent {
  constructor(id, sceneGraph, game, transformation, material, texture) {
    let cellsNumber = {
      x: 8,
      y: 8,
    };
    super(
      id,
      sceneGraph,
      game,
      cellsNumber,
      transformation,
      material,
      texture,
      cellsNumber
    );
    this.createButtons();
    this.createCamera();
  }

  createCell(
    id,
    position,
    transfMatrix,
    materials,
    textures,
    animation,
    highlight
  ) {
    super.createCell(
      id,
      position,
      transfMatrix,
      materials,
      textures,
      animation,
      highlight
    );
    this.createBoardChecker(position.i, position.j, transfMatrix);
  }

  createBoardChecker(i, j, cellTransformationMatrix) {
    let checkerId = "checker" + (i + 1) + (j + 1);
    let checkerInGame = this.game.getChecker(i, j);
    let checkerComponent;
    let materials, textures, player;
    if (checkerInGame == "w" || checkerInGame == "W") {
      materials = [
        this.game.whiteCheckerMaterial,
        this.game.whiteCheckerMaterialActive,
      ];
      textures = [
        this.game.whiteCheckerTexture,
        this.game.whiteCheckerTextureActive,
      ];
      player = this.game.p1;
    } else if (checkerInGame == "b" || checkerInGame == "B") {
      materials = [
        this.game.blackCheckerMaterial,
        this.game.blackCheckerMaterialActive,
      ];
      textures = [
        this.game.blackCheckerTexture,
        this.game.blackCheckerTextureActive,
      ];
      player = this.game.p2;
    } else {
      return;
    }
    let position = {
      i: i,
      j: j,
    };
    checkerComponent = new PlayerCheckerComponent(
      checkerId,
      this.sceneGraph,
      this.game,
      this,
      player,
      position,
      this.size,
      cellTransformationMatrix,
      materials,
      textures
    );
    if (checkerInGame == "W" || checkerInGame == "B") {
      checkerComponent.makeQueen();
    }
    // checkerComponent = new CheckerComponent(checkerId, this.sceneGraph, this.game, this, position, size, cellTransformationMatrix, materials, textures);
    // this.components.push(checkerComponent);
    this.checkers[[i, j]] = checkerComponent;
  }

  getBaseButtonTransformation(scale, scalex, scaley, scalez) {
    let baseTransformation = mat4.create();
    baseTransformation = mat4.scale(
      baseTransformation,
      baseTransformation,
      vec3.fromValues(scalex, scaley, scalez)
    );
    baseTransformation = mat4.scale(
      baseTransformation,
      baseTransformation,
      vec3.fromValues(scale, scale, scale)
    );
    baseTransformation = mat4.translate(
      baseTransformation,
      baseTransformation,
      vec3.fromValues(CUBE_SIZE, CUBE_SIZE, 0)
    );
    baseTransformation = mat4.rotate(
      baseTransformation,
      baseTransformation,
      Math.PI / 2,
      vec3.fromValues(0, 0, 1)
    );
    baseTransformation = mat4.rotate(
      baseTransformation,
      baseTransformation,
      Math.PI / 2,
      vec3.fromValues(1, 0, 0)
    );
    return baseTransformation;
  }

  createButtons() {
    let buttons = [];
    let materials;
    let scene = this.sceneGraph.scene;
    let shininess = 10;

    let red, activeRed;
    let green, activeGreen;
    let blue, activeBlue;
    let yellow, activeYellow;
    let color1, activeColor1;
    let color2, activeColor2;
    let color3, activeColor3;
    let color4, activeColor4;

    [red, activeRed] = this.getMaterials(shininess, 1, 0, 0);
    [green, activeGreen] = this.getMaterials(shininess, 0, 1, 0);
    [blue, activeBlue] = this.getMaterials(shininess, 0, 0, 1);
    [yellow, activeYellow] = this.getMaterials(shininess, 1, 1, 0);
    [color1, activeColor1] = this.getMaterials(shininess, 0.2, 0.5, 0.8);
    [color2, activeColor2] = this.getMaterials(shininess, 0.8, 0.2, 0.5);
    [color3, activeColor3] = this.getMaterials(shininess, 0.5, 0.8, 0.2);
    [color4, activeColor4] = this.getMaterials(shininess, 0.5, 0.2, 0.5);

    //undo
    //filme
    //camera
    // end turn

    //reset
    //pause time
    //continue time
    let scale = 0.2;
    let scalex = 1,
      scaley = 1,
      scalez = 0.3;
    let button, sprite, idIndex;

    // Player buttons
    let texts = ["UNDO", "REPLAY", "CAMERA", "END\nTURN"];
    materials = [
      [red, activeRed],
      [green, activeGreen],
      [blue, activeBlue],
      [yellow, activeYellow],
    ];
    let buttonSize = scale * scalex;
    let numberPlayerButtons = texts.length;
    let xMult =
      buttonSize +
      (1 - numberPlayerButtons * buttonSize) / (numberPlayerButtons - 1);

    let xspacing = 0.05;

    let baseTransformation = this.getBaseButtonTransformation(
      scale,
      scalex,
      scaley,
      scalez
    );
    for (let i = 0; i < 2; i++) {
      let t = mat4.create();
      if (i == 0) {
        t = mat4.translate(t, t, vec3.fromValues(1 + xspacing, 0, 0));
      }
      if (i == 1) {
        t = mat4.translate(t, t, vec3.fromValues(-xspacing, 1, 0));
        t = mat4.rotate(t, t, Math.PI * i, vec3.fromValues(0, 0, 1));
      }

      for (let j = 0; j < numberPlayerButtons; j++) {
        let bt = mat4.create();
        bt = mat4.translate(
          bt,
          mat4.create(),
          vec3.fromValues(0, j * xMult, 0)
        );
        bt = mat4.multiply(bt, bt, baseTransformation);
        bt = mat4.multiply(bt, t, bt);
        idIndex = "-" + i + "-" + j;
        button = new TextButtonComponent(
          "button" + idIndex,
          this.sceneGraph,
          bt,
          materials[j]
        );
        sprite = new Sprite(
          "sprite" + idIndex,
          this.sceneGraph,
          texts[j],
          0.2,
          0.2
        );
        sprite.setStrategy([
          ["horizontal-align", "center"],
          ["vertical-align", "center"],
        ]);
        button.setSprite(sprite);
        if (j == 0) {
          button.setOnClick(() => {
            if (!(this.game.game.state.canPickButton())) {
              return;
            }
            this.game.game.state.undo();
          });
        } else if (j == 1) {
          button.setOnClick(() => {
            if (!(this.game.game.state.canPickButton())) {
              return;
            }
            this.game.game.state.movie();
          });
        } else if (j == 2) {
          // camera
          let player = i + 1;
          button.setOnClick(() => {
            if (!(this.game.game.state.canPickButton())) {
              return;
            }
            this.camera.turnCamera(player);
          });
        } else if (j == 3) {
          button.setOnClick(() => {
            if (!(this.game.game.state.canPickButton())) {
              return;
            }
            this.game.game.state.endTurn(this.game);
            this.game.leaderboard.endTurn();
          });
        }
        buttons.push(button);
      }
    }

    // Game buttons
    texts = ["RESET", "PAUSE\nTIME", "CONTINUE\nTIME", "VISIBLE\nLIGHT"];
    materials = [
      [color1, activeColor1],
      [color2, activeColor2],
      [color3, activeColor3],
      [color4, activeColor4],
    ];
    let numberGameButtons = texts.length;
    buttonSize = scale * scalex;
    xMult =
      buttonSize +
      (1 - numberGameButtons * buttonSize) / (numberGameButtons - 1);
    let yspacing = 0.1;

    baseTransformation = this.getBaseButtonTransformation(
      scale,
      scalex,
      scaley,
      scalez
    );

    let t = mat4.create();
    t = mat4.translate(
      t,
      mat4.create(),
      vec3.fromValues(scale * scaley, 1 + yspacing, 0)
    );
    t = mat4.rotate(t, t, Math.PI / 2, vec3.fromValues(0, 0, 1));
    t = mat4.multiply(t, t, baseTransformation);
    for (let i = 0; i < texts.length; i++) {
      let bt = mat4.create();
      bt = mat4.translate(bt, mat4.create(), vec3.fromValues(i * xMult, 0, 0));
      bt = mat4.multiply(bt, bt, t);
      idIndex = "-game-button-" + i;
      button = new TextButtonComponent(
        "button" + idIndex,
        this.sceneGraph,
        bt,
        materials[i]
      );
      sprite = new Sprite(
        "sprite" + idIndex,
        this.sceneGraph,
        texts[i],
        0.2,
        0.2
      );
      sprite.setStrategy([
        ["horizontal-align", "center"],
        ["width", ["maxWidth", 4]],
        ["vertical-align", "center"],
      ]);
      button.setSprite(sprite);

      if (i == 0) {
        button.setOnClick(() => {
          if (!(this.game.game.state.canPickButton())) {
            return;
          }
          this.game.game.state.resetState();
          this.game.leaderboard.reset();
          this.game.resetBoards();
        });
      } else if (i == 1) {
        button.setOnClick(() => {
          if (!(this.game.game.state.canPickButton())) {
            return;
          }
          this.game.leaderboard.pauseTime();
        });
      } else if (i == 2) {
        button.setOnClick(() => {
          if (!(this.game.game.state.canPickButton())) {
            return;
          }

          this.game.leaderboard.resumeTime();
        });
      } else if (i == 3) {
        button.setOnClick(() => {
          if (!(this.game.game.state.canPickButton())) {
            return;
          }

          this.game.spotlight.toggleVisibility();
          button.toggleSelect();
        });
      }

      buttons.push(button);
    }

    this.addComponents(buttons);
  }

  getActiveLightComponents(lightComponents) {
    let activeLightComponents = [];
    let factor = 0.4;
    for (let i = 0; i < lightComponents.length; i++) {
      let activeLightComponent = lightComponents[i].map((value, index) => {
        return value + (1 - value) * factor;
      });
      activeLightComponents.push(activeLightComponent);
    }
    return activeLightComponents;
  }

  getColorLightComponents(r, g, b) {
    return [
      [0, 0, 0, 1],
      [r, g, b, 1],
      [r, g, b, 1],
      [r, g, b, 1],
    ];
  }

  getMaterials(s, r, g, b) {
    let lightComponents = this.getColorLightComponents(r, g, b);
    let activeLightComponents = this.getActiveLightComponents(lightComponents);
    let materials = [];
    materials[0] = new Material(this.sceneGraph.scene, s, lightComponents);
    materials[1] = new Material(
      this.sceneGraph.scene,
      s,
      activeLightComponents
    );
    return materials;
  }

  createCamera() {
    let id = "camera";
    this.camera = new BoardCamera(id, this.sceneGraph, this);
    this.sceneGraph.views[id] = this.camera;
    this.sceneGraph.defaultView = id;
    this.camera.setCamera();
  }

  draw(path, thisMaterial, thisTexture) {
    super.draw(path, thisMaterial, thisTexture);
    this.camera.draw();
  }

  resetBoard(){
    this.checkers = {};
    for(let i = 0; i < this.cellsNumber.x; i++){
      for(let j = 0; j < this.cellsNumber.y; j++){
        let cell = this.cells[[i,j]];
        let transfMatrix = cell.transformation;
        this.createBoardChecker(i, j, transfMatrix);
      }
    }
  }
}
