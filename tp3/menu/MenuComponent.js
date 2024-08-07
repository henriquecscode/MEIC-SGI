import { StaticComponent } from "../components/StaticComponent.js";
import { TextButtonComponent } from "../components/TextButtonComponent.js";
import { Material } from "../materials/Material.js";
import { MyQuad } from "../primitives/MyQuad.js";
import { Sprite } from "../sprites/Sprite.js";

var CUBE_SIZE = 1;
var CUBE_HORIZONTAL_SPACING = 0.1;
var CUBE_ROWS_SPACING = 0.5;
var NUM_LIGHTS = 8;
var LIGHT_HEIGHT = 5;
var LABEL_HEIGHT = CUBE_SIZE + 0.5;
var PICK_MATERIAL = 'material', PICK_TEXTURE = 'texture', OPTION_MATERIAL = 'option_material', OPTION_TEXTURE = 'option_texture', PICK_SCENE = 'scene';

export class MenuComponent extends StaticComponent {
    buttonSpacing = CUBE_SIZE + CUBE_HORIZONTAL_SPACING;
    rowsSpacing = CUBE_SIZE + CUBE_ROWS_SPACING;
    materialsX = 0;
    texturesX = this.rowsSpacing;
    materialsOptionsX = this.rowsSpacing * 2;
    texturesOptionsX = this.rowsSpacing * 3;
    sceneX = this.rowsSpacing * 4;
    startX = this.rowsSpacing * 5;

    constructor(id, sceneGraph) {
        super(id, sceneGraph, mat4.create());
        this.createOptions();
        this.createMaterialButtons();
        this.createTextureButtons();
        this.createOptionsButtons();
        this.createStart();
        this.createLights();

        this.selected = null;
        this.typeSelected = null;
    }

    createOptions() {
        this.options = {
            materials: {
                whiteCellMaterial: 'green',
                whiteCellMaterialActive: 'lightGreen',
                blackCellMaterial: 'red',
                blackCellMaterialActive: 'lightRed',
                boardMaterial: 'white',
                whiteCheckerMaterial: 'white',
                whiteCheckerMaterialActive: 'green',
                blackCheckerMaterial: 'black',
                blackCheckerMaterialActive: 'red',
            },
            textures: {
                whiteCellTexture: 'demoTexture',
                whiteCellTextureActive: 'lightWood',
                blackCellTexture: 'demoTexture',
                blackCellTextureActive: 'lightWood',
                boardTexture: 'demoTexture',

                whiteCheckerTexture: 'demoTexture',
                whiteCheckerTextureActive: 'metal',
                blackCheckerTexture: 'demoTexture',
                blackCheckerTextureActive: 'basketball',
            },

            scene: 'office',
        }
    }

    createMaterialButtons() {
        let buttons = [];
        let materials = this.sceneGraph.materials;

        let i = 0;
        for (let [key, material] of Object.entries(materials)) {
            let t = mat4.create();
            t = mat4.translate(t, t, [0, 0, this.buttonSpacing * i]);
            let button = new TextButtonComponent(key, this.sceneGraph, t, [material]);
            button.setOnClick(() => {
                this.controller(PICK_MATERIAL, key);
            });
            buttons.push(button);
            i++;
        }

        this.addComponents(buttons);
    }

    createTextureButtons() {

        let buttons = [];
        let textures = this.sceneGraph.textures;
        let i = 0;
        for (let [key, texture] of Object.entries(textures)) {
            let t = mat4.create();
            t = mat4.translate(t, t, [this.rowsSpacing, 0, this.buttonSpacing * i]);
            let button = new TextButtonComponent(key, this.sceneGraph, t, [], [texture]);

            button.setOnClick(() => {
                this.controller(PICK_TEXTURE, key);
            });
            buttons.push(button);
            i++;
        }

        this.addComponents(buttons);
    }

    getGraphMaterial(material) {
        return this.sceneGraph.materials[material];
    }


    getTextFromProperty(property) {
        //Add a new line after every capital letter
        property = property.charAt(0).toUpperCase() + property.slice(1);
        return property.replace(/([A-Z])/g, '\n$1'); //.replace(/^./, function (str) { return str.toUpperCase(); });
    }

    getLabelsMaterials() {
        return [
            new Material(this.sceneGraph.scene, 10, [
                [0, 0, 0, 1],
                [0.5, 0.5, 0.5, 1],
                [0.5, 0.5, 0.5, 1],
                [0, 0, 0, 1],
            ]),
            new Material(this.sceneGraph.scene, 10, [
                [0, 0, 0, 1],
                [0.2, 0.8, 0.2, 1],
                [0.2, 0.8, 0.2, 1],
                [0, 0, 0, 1],
            ]),
        ]
    }


    createMaterialsOptionsButtons() {
        let buttons = [];
        let materials = this.options.materials;
        let i = 0;
        for (let [key, material] of Object.entries(materials)) {
            let t = mat4.create();
            t = mat4.translate(t, t, [this.materialsOptionsX, 0, this.buttonSpacing * i]);
            t = mat4.rotate(t, t, Math.PI / 2, [0, 1, 0]);
            let labelT = mat4.create();
            labelT = mat4.translate(labelT, labelT, [this.materialsOptionsX, LABEL_HEIGHT, this.buttonSpacing * i]);
            labelT = mat4.scale(labelT, labelT, vec3.fromValues(0.02, 0.8, 1));
            labelT = mat4.rotate(labelT, labelT, -Math.PI / 2, [0, 0, 1]);
            labelT = mat4.rotate(labelT, labelT, Math.PI / 2, [0, 1, 0]);
            let buttonMaterial = this.getGraphMaterial(material);
            let labelMaterials = this.getLabelsMaterials();

            let text = this.getTextFromProperty(key);
            let button = new TextButtonComponent(key, this.sceneGraph, t, [buttonMaterial]);
            let label = new TextButtonComponent(key + 'label', this.sceneGraph, labelT, labelMaterials);

            let sprite = new Sprite(key, this.sceneGraph, text, 0.2, 0.2);
            sprite.setStrategy([
                ['horizontal-align', 'left'],
                ['vertical-align', 'center'],
            ])
            button.setSprite(sprite);
            label.setSprite(sprite);
            buttons.push(button);
            buttons.push(label);

            button.setOnClick(() => {
                this.controller(OPTION_MATERIAL, key);
            });
            label.setOnClick(() => {
                this.controller(OPTION_MATERIAL, key);
            });

            this.optionsButtons[key] = button;
            this.optionsLabels[key] = label;

            i++;
        }

        this.addComponents(buttons);
    }


    createTexturesOptionsButtons() {
        let buttons = [];
        let textures = this.options.textures;
        let i = 0;
        for (let [key, texture] of Object.entries(textures)) {
            let t = mat4.create();
            t = mat4.translate(t, t, [this.texturesOptionsX, 0, this.buttonSpacing * i]);
            t = mat4.rotate(t, t, Math.PI / 2, [0, 1, 0]);
            let labelT = mat4.create();
            labelT = mat4.translate(labelT, labelT, [this.texturesOptionsX, LABEL_HEIGHT, this.buttonSpacing * i]);
            labelT = mat4.scale(labelT, labelT, vec3.fromValues(0.02, 0.8, 1));
            labelT = mat4.rotate(labelT, labelT, -Math.PI / 2, [0, 0, 1]);
            labelT = mat4.rotate(labelT, labelT, Math.PI / 2, [0, 1, 0]);

            let buttonTexture = this.sceneGraph.textures[texture];
            let labelMaterials = this.getLabelsMaterials();
            let text = this.getTextFromProperty(key);
            let button = new TextButtonComponent(key, this.sceneGraph, t, [], [buttonTexture]);
            let label = new TextButtonComponent(key + 'label', this.sceneGraph, labelT, labelMaterials);
            let sprite = new Sprite(key, this.sceneGraph, text, 0.2, 0.2);
            sprite.setStrategy([
                ['horizontal-align', 'left'],
                ['vertical-align', 'center'],
            ])
            button.setSprite(sprite);
            label.setSprite(sprite);
            buttons.push(button);
            buttons.push(label);

            button.setOnClick(() => {
                this.controller(OPTION_TEXTURE, key);
            });
            label.setOnClick(() => {
                this.controller(OPTION_TEXTURE, key);
            });
            this.optionsButtons[key] = button;
            this.optionsLabels[key] = label;
            i++;
        }

        this.addComponents(buttons);

    }

    getSceneMaterials() {
        return [
            new Material(this.sceneGraph.scene, 10, [
                [0, 0, 0, 1],
                [0.2, 0.2, 0.2, 1],
                [0.2, 0.2, 0.2, 1],
                [0, 0, 0, 1],
            ]),
            new Material(this.sceneGraph.scene, 10, [
                [0, 0, 0, 1],
                [0.2, 0.8, 0.2, 1],
                [0.2, 0.8, 0.2, 1],
                [0, 0, 0, 1],
            ]),
        ]
    }

    createScenesButtons() {
        let buttons = [];
        let scenes = this.sceneGraph.scenes;

        console.log(scenes);
        let i = 0;
        for (let [key, scene] of Object.entries(scenes)) {
            let t = mat4.create();
            t = mat4.translate(t, t, [this.sceneX, 0, this.buttonSpacing * i]);
            t = mat4.rotate(t, t, Math.PI / 2, [0, 1, 0]);
            // let labelT = mat4.create();
            // labelT = mat4.translate(labelT, labelT, [this.scenesOptionsX, LABEL_HEIGHT, this.buttonSpacing * i]);
            // labelT = mat4.scale(labelT, labelT, vec3.fromValues(0.02, 0.8, 1));
            // labelT = mat4.rotate(labelT, labelT, -Math.PI / 2, [0, 0, 1]);
            // labelT = mat4.rotate(labelT, labelT, Math.PI / 2, [0, 1, 0]);
            // let buttonMaterial = this.getGraphMaterial(material);
            let materials = this.getSceneMaterials();

            let text = this.getTextFromProperty(key);
            let button = new TextButtonComponent(key, this.sceneGraph, t, materials);

            let sprite = new Sprite(key, this.sceneGraph, text, 0.2, 0.2);
            sprite.setStrategy([
                ['horizontal-align', 'left'],
                ['vertical-align', 'center'],
            ])
            button.setSprite(sprite);
            // label.setSprite(sprite);
            buttons.push(button);
            // buttons.push(label);

            button.setOnClick(() => {
                this.controller(PICK_SCENE, key);
            });
            // label.setOnClick(() => {
            //     this.controller(OPTION_MATERIAL, key);
            // });

            this.optionsButtons[key] = button;
            // this.optionsLabels[key] = label;

            i++;
        }

        this.optionsButtons[this.options.scene].select();
        this.addComponents(buttons);
    }

    createOptionsButtons() {
        this.optionsButtons = {};
        this.optionsLabels = {};
        this.createMaterialsOptionsButtons();
        this.createTexturesOptionsButtons();
        this.createScenesButtons();
    }

    createStart() {
        let t = mat4.create();
        t = mat4.translate(t, t, [this.startX, 0, 0]);
        t = mat4.rotate(t, t, Math.PI / 2, [0, 1, 0]);

        let text = 'START';
        let materials = this.getSceneMaterials();
        let button = new TextButtonComponent(text, this.sceneGraph, t, materials);
        let sprite = new Sprite(text, this.sceneGraph, text, 0.2, 0.2);
        sprite.setStrategy([
            ['horizontal-align', 'left'],
            ['vertical-align', 'center'],
        ])
        button.setSprite(sprite);
        button.setOnClick(() => {
            this.sceneGraph.callback(this.sceneGraph, this.sceneGraph.scene.interface.delete.bind(this.sceneGraph.scene.interface));
        });

        this.addComponents([button]);
    }

    createLights() {
        let materialsLength = Object.keys(this.sceneGraph.materials).length;
        let texturesLength = Object.keys(this.sceneGraph.textures).length;
        let materialsPropertiesLength = Object.keys(this.options.materials).length;
        let texturesPropertiesLength = Object.keys(this.options.textures).length;
        let maximumLength = Math.max(materialsLength, texturesLength, materialsPropertiesLength, texturesPropertiesLength);
        let maximumZ = maximumLength * (this.buttonSpacing + CUBE_SIZE) - this.buttonSpacing;
        let maximumX = Math.max(this.materialsX, this.texturesX, this.materialsOptionsX, this.texturesOptionsX, this.sceneX);

        let lights = [];

        let step = maximumLength / (NUM_LIGHTS * 2);
        for (let z = step, i = 0; z < maximumZ; z += 2 * step, i++) {
            let light = [];

            //enabled
            light.push(true);

            //omni
            light.push("omni");

            //position
            light.push([maximumX / 2, LIGHT_HEIGHT, z, 1]);

            //ambient
            light.push([0, 0, 0, 1]);

            //diffuse
            light.push([0.5, 0.5, 0.5, 1])

            //specular
            light.push([0.5, 0.5, 0.5, 1]);

            //attenuation
            light.push([1, 0, 0]);

            lights.push(light);

            this.sceneGraph.lights["light" + i] = light;

        }

    }

    getBoardData() {
        let scene = this.sceneGraph.scenes[this.options['scene']]
        let materialOptions = Object.entries(this.options['materials']).reduce((obj, [key, val]) => {
            obj[key] = this.sceneGraph.materialsOptions[val]
            return obj;
        }, {});
        let textureOptions = Object.entries(this.options['textures']).reduce((obj, [key, val]) => {
            obj[key] = this.sceneGraph.texturesOptions[val]
            return obj;
        }, {});
        let boardData = {
            ...materialOptions,
            ...textureOptions,
            scene,
            'boardTransformation': scene.boardTransformation,
            'p1BoardTransformation': scene.p1BoardTransformation,
            'p2BoardTransformation': scene.p2BoardTransformation,
        }
        return boardData;
    }

    controller(action, key) {

        if (action == OPTION_MATERIAL || action == OPTION_TEXTURE) {
            if (this.selected) {
                if (this.selected != key) {
                    this.optionsLabels[this.selected].deselect()
                    this.optionsLabels[key].select()
                    this.typeSelected = action;
                    this.selected = key;
                } else {
                    this.optionsLabels[key].deselect()
                    this.typeSelected = null;
                    this.selected = null;
                }

            } else {
                this.selected = key;
                this.typeSelected = action
                this.optionsLabels[key].select()
            }
        }
        else if (action == PICK_MATERIAL || action == PICK_TEXTURE) {
            if (this.selected) {
                if (this.typeSelected == OPTION_MATERIAL && action == PICK_MATERIAL) {
                    this.options.materials[this.selected] = key;
                    this.optionsButtons[this.selected].material = this.sceneGraph.materials[key];
                }
                else if (this.typeSelected == OPTION_TEXTURE && action == PICK_TEXTURE) {
                    this.options.textures[this.selected] = key;
                    this.optionsButtons[this.selected].texture = this.sceneGraph.textures[key];
                }
            }
        }
        else if (action == PICK_SCENE) {
            let prevScene = this.options.scene;
            this.optionsButtons[prevScene].deselect();
            this.optionsButtons[key].select();
            this.options.scene = key;
        }
    }

}