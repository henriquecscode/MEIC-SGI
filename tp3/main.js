import { CGFapplication } from '../lib/CGF.js';
import { XMLscene } from './XMLscene.js';
import { MenuInterface } from './MenuInterface.js'
import { MyInterface } from './MyInterface.js';
import { MySceneGraph } from './MySceneGraph.js';
import { BoardFileGraph } from './BoardFileGraph.js';
import { GameEngine } from './game/src/GameEngine.js';

var app = new CGFapplication(document.body);
const engine = new GameEngine();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}

function onStart(boardGraph, deleteMenuInterface) {

    deleteMenuInterface();
    var myInterface = new MyInterface();
    var myScene = new XMLscene(myInterface);
    app.setScene(myScene);
    app.setInterface(myInterface);
    myInterface.setActiveCamera(myScene.camera);

    let boardData = boardGraph.menu.getBoardData();
    boardData = {
        ...boardData,
        engine,
    }
    let scene = boardData.scene;

    engine.nextState()
    var myGraph = new MySceneGraph(scene.file, myScene, myInterface, boardData);
    myGraph.init();

}

function main() {

    // Standard application, scene and interface setup
    var menuInterface = new MenuInterface();
    var menuScene = new XMLscene(menuInterface);
    var filename = getUrlVars()['file'] || "board.xml";

    app.init();
    app.setScene(menuScene);
    app.setInterface(menuInterface);
    var boardGraph = new BoardFileGraph(filename, menuScene, menuInterface, onStart);
    boardGraph.init();
    app.run();
}

main();