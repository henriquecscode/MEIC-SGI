import { InheritedTexture } from "../textures/InheritedTexture.js";
import { Texture } from "../textures/Texture.js";
import { CGFscene } from '../../lib/CGF.js';
import { CGFaxis, CGFcamera, CGFshader } from '../../lib/CGF.js';
import { MyRectangle } from "../primitives/MyRectangle.js";
import { MyLiddedCylinder } from "../primitives/MyLiddedCylinder.js";
import { MyInterface } from "../MyInterface.js";
import { NoAnimation } from "../animations/NoAnimation.js";
import { Animation } from "../animations/Animation.js";
import { Keyframe } from "../animations/Keyframe.js";
import { Translation } from "../animations/Translation.js";
import { Rotation } from "../animations/Rotation.js";
import { Scale } from "../animations/Scale.js";
import { NoHighlight } from "../highlighted/NoHighlight.js";

export class CheckerComponent {
    SLICES = 10;
    STACKS = 10;
    ANIMATION_TIME = 1;
    MOVE_BOARD_ANIMATION_TIME = 2;
    SPOTLIGHT_HEIGHT = 0.1;
    constructor(id, sceneGraph, game, board, position, size, transformation, materials, textures) {
        this.id = id
        this.positionParams;
        this.sceneGraph = sceneGraph;
        this.game = game;
        this.board = board;
        this.generalTransformationMatrix = transformation
        this.transformation = transformation;
        this.materials = materials;
        this.textures = textures;
        this.animation = new NoAnimation();
        this.highlight = new NoHighlight();
        this.components = [];
        this.createChecker(position, size);
        this.deselect();

    }

    createChecker(position, size) {
        this.radius = this.game.CHECKER_SIZE.radius * Math.min(size.x, size.y);
        this.height = this.game.CHECKER_SIZE.height;
        this.primitives = [
            new MyLiddedCylinder(this.sceneGraph.scene, this.id, this.radius, this.radius, this.height, this.SLICES, this.STACKS)
        ]
        this.calcMoveChecker(position.i, position.j);
    }

    calcCheckerMovement(board, i, j) {
        let x = this.game.PADDINGX + this.game.size.x * i + this.game.size.x / 2;
        x = x / board.widthMult;
        let y = this.game.PADDINGY + this.game.size.y * j + this.game.size.y / 2;
        y = y / board.heightMult;
        let checkerTransformationMatrix = mat4.create();
        let boardScaleTransformationMatrix = mat4.create();
        let translateTransformationMatrix = mat4.create();
        translateTransformationMatrix = mat4.translate(translateTransformationMatrix, translateTransformationMatrix, [x, y, 0]);
        boardScaleTransformationMatrix = mat4.scale(boardScaleTransformationMatrix, boardScaleTransformationMatrix, [1 / board.widthMult, 1 / board.heightMult, 1]);
        checkerTransformationMatrix = mat4.multiply(checkerTransformationMatrix, boardScaleTransformationMatrix, checkerTransformationMatrix);
        checkerTransformationMatrix = mat4.multiply(checkerTransformationMatrix, translateTransformationMatrix, checkerTransformationMatrix);
        checkerTransformationMatrix = mat4.multiply(checkerTransformationMatrix, this.generalTransformationMatrix, checkerTransformationMatrix);
        return [x, y, checkerTransformationMatrix];
    }

    moveChecker(i, j, x, y, checkerTransformationMatrix) {
        this.i = i;
        this.j = j;
        this.x = x;
        this.y = y;
        this.transformation = checkerTransformationMatrix;
    }

    calcMoveChecker(i, j) {
        let x, y, checkerTransformationMatrix;
        [x, y, checkerTransformationMatrix] = this.calcCheckerMovement(this.board, i, j);
        this.moveChecker(i, j, x, y, checkerTransformationMatrix);

    }

    setTextureCoordinates(path, prevTexture) {
        let appliedTexture;
        if (this.texture instanceof Texture) {
            appliedTexture = this.texture;
        }
        else if (this.texture instanceof InheritedTexture) {
            appliedTexture = prevTexture
        }
        else { //NoTexture
            appliedTexture = null;
        }

        for (let primitiveObj of this.primitives) {

            if (appliedTexture != null) {
                primitiveObj.updateTexCoords(appliedTexture.length_s, appliedTexture.length_t);
            }
        }

        for (let component of this.components) {
            this.sceneGraph.components[component].setTextureCoordinates(path + ' ' + this.id, appliedTexture);
        }
    }

    display(path, prevMaterial, prevTexture) {
        if (!this.animation.isVisible(this.sceneGraph.now)) {
            return;
        }
        if (prevMaterial == null) {
            prevMaterial = this.material.material;
        }
        if (prevTexture == null) {
            prevTexture = this.texture;
        }

        let [thisMaterial, thisTexture] = this.setDisplay(prevMaterial, prevTexture);
        this.draw(path, thisMaterial, thisTexture);
        this.unsetDisplay();
    }

    setDisplay(prevMaterial, prevTexture) {
        let appliedMaterial = this.material.apply(prevMaterial);
        let appliedTexture = this.texture.setOnMaterial(prevTexture, appliedMaterial);

        this.sceneGraph.scene.pushMatrix();
        this.sceneGraph.scene.multMatrix(this.transformation);

        this.animation.update(this.sceneGraph.now);
        this.animation.apply();

        if (this.sceneGraph.highlights[this.id]) {
            this.highlight.setDisplay(this.sceneGraph.scene, this.sceneGraph.scene.shaders)
            this.highlight.updateNow(this.sceneGraph.now, this.sceneGraph.scene.shaders, this.texture)
        }

        return [appliedMaterial, appliedTexture];
    }

    draw(path, thisMaterial, thisTexture) {
        thisMaterial.apply()
        for (let primitiveObj of this.primitives) {
            primitiveObj.display();
        }

        for (let component of this.components) {
            this.sceneGraph.components[component].display(path + ' ' + this.id, thisMaterial, thisTexture);
        }

    }

    unsetDisplay() {
        this.sceneGraph.scene.popMatrix();
        this.highlight.setDisplay(this.sceneGraph.scene, this.sceneGraph.scene.defaultShader)
    }

    pick() {
        this.game.pickChecker(this.board, this.i, this.j)
    }

    select() {
        this.isActive = true;
        this.texture = this.textures[1];
        this.material = this.materials[1];
    }

    deselect() {
        this.isActive = false;
        this.texture = this.textures[0];
        this.material = this.materials[0];
    }

    toggleSelect() {
        if (this.isActive) {
            this.deselect();
        }
        else {
            this.select();
        }
    }

    /**
     * 
     * @param {*} i destiny coordinates 
     * @param {*} j 
     */
    moveInBoard(i, j) {
        let x, y, transf;
        [x, y, transf] = this.calcCheckerMovement(this.board, i, j);
        this.startMoveAnimation(i, j, x, y, transf);
    }

    startMoveAnimation(newi, newj, newx, newy, trans) {

        let dx, dy, keyframes;
        dx = this.game.size.x * (newi - this.i);
        dy = this.game.size.y * (newj - this.j);
        let startTime = this.sceneGraph.now;
        let endTime = startTime + this.ANIMATION_TIME;

        keyframes = [
            new Keyframe(startTime,
                new Translation([0, 0, 0]),
                new Rotation('x', 0),
                new Rotation('y', 0),
                new Rotation('z', 0),
                new Scale([1, 1, 1])
            ),
            new Keyframe(endTime,
                new Translation([dx, dy, 0]),
                new Rotation('x', 0),
                new Rotation('y', 0),
                new Rotation('z', 0),
                new Scale([1, 1, 1])
            )
        ]
        this.animation = new Animation(this.sceneGraph, this.id, keyframes,
            () => {
                if (this.stopThisFrame) {
                    this.stopThisFrame = false;
                    this.stopAnimation();
                    this.game.spotlight.turnOff();
                    return;
                }
                this.moveChecker(newi, newj, newx, newy, trans);
                this.stopThisFrame = true;
            },
            (t) => {
                let ratio = (t - startTime) / (endTime - startTime);
                let dx = ratio * (newx - this.x)
                let curx = this.x + dx;
                curx = curx * this.board.widthMult;
                let dy = ratio * (newy - this.y);
                let cury = this.y + dy;
                cury = cury * this.board.heightMult;
                this.checkerBoardCollisions(curx, cury);
                this.moveSpotlight(dx, dy);
            });

        this.game.game.state.startedAnimation();
        this.game.spotlight.turnOn();
        this.game.leaderboard.animationStarted();
    }

    checkerBoardCollisions(curx, cury) {
        for (let checker of Object.values(this.board.checkers)) {
            if (checker == this) {
                continue;
            }
            let dist = Math.sqrt(Math.pow(curx - checker.x * checker.board.widthMult, 2) + Math.pow(cury - checker.y * checker.board.heightMult, 2));
            if (dist < checker.radius + this.radius) {
                this.boardCollision(checker);
            }
            else {
                this.noBoardCollision(checker);
            }
        }
    }

    moveSpotlight(dx, dy) {
        let pos, target;
        pos = vec4.fromValues(dx, dy, this.SPOTLIGHT_HEIGHT, 1);
        target = vec3.fromValues(dx, dy, 0);
        this.game.spotlight.moveSpotlight(pos, target);
    }

    boardCollision(checker) {
        checker.select();
    }

    noBoardCollision(checker) {
        checker.deselect();
    }

    moveToBoard(board, i, j) {
        this.board.removeChecker(this);
        board.addChecker(this, i, j);
        let x, y, transf;
        [x, y, transf] = this.calcCheckerMovement(board, i, j);
        this.startBoardMoveAnimation(board, i, j, x, y, transf);
        this.board = board;
    }

    startBoardMoveAnimation(board, i, j, x, y, transf) {
        this.baseTransformation = Array.from(transf);
        let keyframes;
        let invBoardTransf = mat4.create();
        invBoardTransf = mat4.invert(invBoardTransf, board.transformation);

        let initialMatrix = mat4.create();
        initialMatrix = mat4.multiply(initialMatrix, this.transformation, initialMatrix);
        initialMatrix = mat4.multiply(initialMatrix, this.board.transformation, initialMatrix);

        let finalMatrix = mat4.create();
        finalMatrix = mat4.multiply(finalMatrix, transf, finalMatrix);
        finalMatrix = mat4.multiply(finalMatrix, board.transformation, finalMatrix);

        let startTime = this.sceneGraph.now;
        let finalTime = this.sceneGraph.now + this.MOVE_BOARD_ANIMATION_TIME;

        this.transformation = mat4.multiply(this.transformation, invBoardTransf, initialMatrix); //First animation, considering we are in the other board now

        keyframes = this.createBoardAnimationKeyframes(startTime, finalTime, 0.3, 20);
        this.animation = new Animation(this.sceneGraph, this.id, keyframes,
            () => {
                //Don't need to do the next frame trick because it is not the Animation object that deals with the transformation here
                this.transformation = this.baseTransformation;
                this.deselect();
                this.stopAnimation();
                this.moveChecker(i, j, x, y, transf);
            },
            (t) => {
                let ratio = (t - startTime) / (finalTime - startTime);
                let transfMatrix = mat4.create()
                transfMatrix = Array.from(initialMatrix).map((x, i) => {
                    return x * (1 - ratio) + finalMatrix[i] * ratio;
                });


                transfMatrix = mat4.multiply(transfMatrix, invBoardTransf, transfMatrix);
                this.transformation = transfMatrix;
            }
        );
        this.game.game.state.startedAnimation();
        this.game.leaderboard.animationStarted();
    }

    createBoardAnimationKeyframes(startTime, finalTime, scale, numberOfIntermediary) {
        let keyframes = [];
        for (let i = 0; i < numberOfIntermediary + 2; i++) {
            let t = startTime + (finalTime - startTime) * i / (numberOfIntermediary + 1);
            let z = scale * Math.sin(Math.PI * i / (numberOfIntermediary + 1));
            let keyframe = new Keyframe(t,
                new Translation([0, 0, z]),
                new Rotation('x', 0),
                new Rotation('y', 0),
                new Rotation('z', 0),
                new Scale([1, 1, 1])
            )
            keyframes.push(keyframe);


        }
        return keyframes;
    }

    stopAnimation() {
        this.animation = new NoAnimation();
        this.game.game.state.finishedAnimation();
        this.game.leaderboard.animationEnded();
    }
}