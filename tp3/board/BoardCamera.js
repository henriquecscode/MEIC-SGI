import '../../lib/CGF.js';
import { CGFcamera } from '../../lib/CGF.js';
import { AbstractComponent } from "../components/AbstractComponent.js";
import { PerspectiveView } from '../views/PerspectiveView.js';

var BOARD_CENTER_X = 0.5;
var BOARD_CENTER_Y = 0.5;
var BOARD_CENTER = vec3.fromValues(BOARD_CENTER_X, BOARD_CENTER_Y, 0);
var CAMERA_HEIGHT = 1;
var CAMERA_DISTANCE = 0.9;
var CAMERA_CENTER_OFFSET = 0.4; // More is more close to our buttons
var ANIMATION_TIME = 1;

function getCameraFocus(player = 1) {
    let playerMultiplier = player == 1 ? 1 : -1;
    return BOARD_CENTER_X + playerMultiplier * CAMERA_CENTER_OFFSET * BOARD_CENTER_X

}

function getFrom(player = 1) {
    let playerMultiplier = player == 1 ? 1 : -1;
    return vec3.fromValues(BOARD_CENTER_X + playerMultiplier * CAMERA_DISTANCE, BOARD_CENTER_Y, CAMERA_HEIGHT);
}

function getTo(player = 1) {
    return vec3.fromValues(getCameraFocus(player), BOARD_CENTER_Y, 0);
}

function getLevelTo() {
    return vec3.fromValues(BOARD_CENTER_X, BOARD_CENTER_Y, CAMERA_HEIGHT);

}

function vec4Tovec3(vec4) {
    return vec3.fromValues(vec4[0], vec4[1], vec4[2]);
}

export class BoardCamera extends PerspectiveView {
    constructor(id, sceneGraph, board) {
        super(0.4, 500, 45, getFrom(), getTo());
        this.id = id;
        this.sceneGraph = sceneGraph;
        this.board = board;
        this.calcTransformations();
        this.calcBoardVectors();
        this.moveCamera();
        this.moving = false;
        // this.turn();
    }

    calcBoardVectors() {
        let point0 = vec3.fromValues(0, 0, 0);
        let point1 = vec3.fromValues(1, 0, 0);
        let point2 = vec3.fromValues(0, 1, 0);
        let point0Transformed = this.setupDisplay(point0);
        let point1Transformed = this.setupDisplay(point1);
        let point2Transformed = this.setupDisplay(point2);
        let vector1 = vec3.create();
        let vector2 = vec3.create();
        vec3.subtract(vector1, point1Transformed, point0Transformed);
        vec3.subtract(vector2, point2Transformed, point0Transformed);
        let boardNormal = vec3.create();
        boardNormal = vec3.cross(boardNormal, vector1, vector2);
        boardNormal = vec3.normalize(boardNormal, boardNormal);
        this.boardNormal = boardNormal;
        this.boardCenter = this.setupDisplay(BOARD_CENTER);
        this.levelBoardCenter = this.setupDisplay(getLevelTo());
        this.setCameraUp(boardNormal);
    }

    calcTransformations() {
        this.transformation = this.board.transformation;
        this.inverseTransformation = mat4.create();
        this.inverseTransformation = mat4.invert(this.inverseTransformation, this.transformation);
    }

    // turn(angle = Math.PI) {
    //     let untransformedCoordinates = this.unsetDisplay(this.camera.position);
    //     let circleCoordinates = vec3.create();
    //     circleCoordinates = vec3.sub(circleCoordinates, untransformedCoordinates, BOARD_CENTER);
    //     let rotatedCircleCoordinates = vec3.create();
    //     let rotation = mat4.create();
    //     rotation = mat4.rotate(rotation, rotation, angle, this.boardNormal)
    //     rotatedCircleCoordinates = vec3.transformMat4(rotatedCircleCoordinates, circleCoordinates, rotation);
    //     let newUntransformedCoordinates = vec3.create();
    //     newUntransformedCoordinates = vec3.add(newUntransformedCoordinates, rotatedCircleCoordinates, BOARD_CENTER);
    //     let newCoords = this.setupDisplay(newUntransformedCoordinates);
    //     this.camera.setPosition(newCoords);

    // }
    turn(angle = Math.PI) {
        this.resetCamera();
        let originalFrom = vec4.clone(this.camera.position);
        let originalTo = vec4.clone(this.camera.target);
        // Turn the focus
        this.camera.setPosition(vec4Tovec3(this.camera.target));
        this.camera.setTarget(this.boardCenter);
        this.camera.orbit(this.boardNormal, angle);
        let newTo = vec4.clone(this.camera.position);
        this.camera.setPosition(vec4Tovec3(originalFrom));

        // Turn the camera
        let levelTo = this.levelBoardCenter;
        this.camera.setTarget(levelTo);
        this.camera.orbit(this.boardNormal, angle);

        this.camera.setTarget(vec4Tovec3(newTo));
        this.saveCamera();
    }

    // turn(angle = Math.PI) {
    //     // Turn the focus
    //     let originalTo = vec4.clone(this.camera.target);
    //     let levelTo = getLevelTo();
    //     let transformedLevelTo = this.setupDisplay(levelTo);


    //     // this.camera.setTarget(levelTo);
    //     this.camera.setTarget(transformedLevelTo);
    //     this.camera.orbit(this.boardNormal, angle);

    //     this.camera.setTarget(vec4Tovec3(originalTo));
    // }


    unsetDisplay(coords) {
        let transformation = this.inverseTransformation;
        let newCoords = vec3.create();
        newCoords = vec3.transformMat4(newCoords, coords, transformation);
        return newCoords;
    }

    setupDisplay(coords) {
        let transformation = this.transformation;
        let newCoords = vec3.create();
        newCoords = vec3.transformMat4(newCoords, coords, transformation);
        return newCoords;
    }

    moveToOrigin() {
        this.camera.setPosition(vec3.fromValues(0, 0, 0));
        this.camera.setTarget(vec3.fromValues(0, 0, 0));
    }

    rotateCameraAlongAxis() {
        let axis = this.camera.calculateDirection();
        let axisv3 = vec3.fromValues(axis[0], axis[1], axis[2]);
        this.camera.rotate(axisv3, Math.PI);
    }

    saveCamera() {
        this.previousPosition = vec4Tovec3(this.camera.position);
        this.previousTarget = vec4Tovec3(this.camera.target);
    }

    setCameraUp(up) {
        this.camera._up = vec3.clone(this.boardNormal);
    }
    resetCamera() {
        this.camera.setPosition(this.previousPosition);
        this.camera.setTarget(this.previousTarget);
        this.setCameraUp(this.boardNormal);
    }

    moveCamera(player = 1) {
        let position = getFrom(player);
        let from = this.setupDisplay(position);
        let target = getTo(player);
        // target = getLevelTo();
        let to = this.setupDisplay(target);
        this.camera.setPosition(from);
        this.camera.setTarget(to);
        this.saveCamera();
    }

    setCameraInScene() {
        let controllers = this.sceneGraph.scene.interface.gui.__controllers
        let viewController = controllers.find(e => e.property == 'defaultView')
        viewController.setValue(this.id);
        viewController.domElement.children[0].value = this.id;
    }

    startTurnAnimation(player) {
        this.turning = true;
        this.turningStart = this.sceneGraph.now;
        this.turningEnd = this.turningStart + ANIMATION_TIME;
        this.turningPlayer = player;
        this.setCameraInScene();
    }
    doTurnAnimation() {
        let now = this.sceneGraph.now;
        let angle = Math.PI * (now - this.turningStart) / ANIMATION_TIME;
        angle = Math.min(angle, Math.PI);
        this.moveCamera(this.turningPlayer)
        this.turn(angle);
        if (now > this.turningEnd) {
            this.turning = false;
        }

    }
    turnCamera(player = 1) {
        this.startTurnAnimation(player);
    }

    setCamera() {
        this.sceneGraph.defaultView = this.id;
        this.sceneGraph.scene.initCameras();
    }

    draw() {
        if (this.turning) {
            this.doTurnAnimation();
        }
    }
}