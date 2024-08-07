import { InheritedTexture } from "../textures/InheritedTexture.js";
import { Texture } from "../textures/Texture.js";
import { CGFscene, CGFcamera, CGFappearance, CGFaxis, CGFtexture, CGFshader } from "../../lib/CGF.js";
import { MyQuad } from "../primitives/MyQuad.js";
import { StaticComponent } from "../components/StaticComponent.js";


var QUAD_OFFSET = 0.5;
var CHAR_OFFSET = 0.15;

export class Sprite extends StaticComponent {
    static CHAR_MULTIPLIER = 0.6;
    static HEIGHT_MULTIPLIER = 1;
    static fontTexture = null
    static surface = null

    static loadSprites(scene) {
        Sprite.fontTexture = new CGFtexture(scene, "./sprites/oolite-font.trans.png");
        Sprite.surface = new MyQuad(scene);
        Sprite.shader = new CGFshader(scene.gl, "./shaders/font.vert", "./shaders/font.frag");
        Sprite.shader.setUniformsValues({ 'dims': [16, 16] });
    }

    constructor(id, sceneGraph, text, scalex = 1, scaley = 1, material = null) {
        super(id, sceneGraph);
        this.setDefaultStrategies();
        this.setText(text);
        this.scalex = scalex;
        this.scaley = scaley;
        this.setMaterial(material);
    }

    setDefaultStrategies() {
        this.strategy = {
            'width': null,
            'horizontal-align': null,
            'height': null,
            'vertical-align': null
        }
    }
    getWidth() {
        let maxChars = Math.max(...this.lines.map(line => line.length));
        return maxChars;
    }

    getLineWidth(line) {
        let realLineWidth = line.length * this.charMultiplier;
        return realLineWidth;
    }

    getRealWidth() {
        let realWidth = this.getWidth() * this.charMultiplier;
        return realWidth;
    }


    getHeight() {
        let maxHeight = this.lines.length;
        return maxHeight = this.lines.length;
    }

    getLines(text) {
        return text.split('\n');
    }

    calcCharMultiplier() {
        this.charMultiplier = Sprite.CHAR_MULTIPLIER;
        if (this.strategy['width']) {
            let strategy, value;
            let width = this.getWidth();
            [strategy, value] = this.strategy['width'];
            if (strategy == 'minWidth') {
                if (width * Sprite.CHAR_MULTIPLIER < value) {
                    this.charMultiplier = value / width;
                }
            }
            else if (strategy == 'maxWidth') {
                if (width * Sprite.CHAR_MULTIPLIER > value) {
                    this.charMultiplier = value / width;
                }

            }
            else if (strategy == 'fixedWidth') {
                this.charMultiplier = value / width;
            }
        }
    }

    calcHeightMultiplier() {

        this.heightMultiplier = Sprite.HEIGHT_MULTIPLIER;
        if (this.strategy['height']) {
            let strategy, value;
            let height = this.getHeight();
            [strategy, value] = this.strategy['height'];
            if (strategy == 'minHeight') {
                if (height * Sprite.HEIGHT_MULTIPLIER < value) {
                    this.heightMultiplier = value / height;
                }
            }
            else if (strategy == 'maxHeight') {
                if (height * Sprite.HEIGHT_MULTIPLIER > value) {
                    this.heightMultiplier = value / height;
                }

            }
            else if (strategy == 'fixedHeight') {
                this.heightMultiplier = value / height;
            }
        }
    }

    setText(text) {
        this.text = text;
        this.lines = this.getLines(text)

        this.calcCharMultiplier();
        this.calcHeightMultiplier();
    }

    setMaterial(material) {
        if (material) {
            this.material = material.material;
        }
        else {
            this.material = new CGFappearance(this.sceneGraph.scene);
        }
    }

    setStrategy(strategies) {
        for (let strategy of strategies) {
            let [key, value] = strategy;
            if (!key in this.strategy) {
                return;
            }
            this.strategy[key] = value;
        }
        this.setText(this.text);

    }
    unsetStrategy(key) {
        this.strategy[key] = null;
    }

    setPositionDisplay() {
        this.sceneGraph.scene.scale(this.scalex, this.scaley, 1)
    }
    setDisplay() {
        this.sceneGraph.scene.setActiveShaderSimple(Sprite.shader);
        this.sceneGraph.scene.gl.disable(this.sceneGraph.scene.gl.DEPTH_TEST);
        this.material.setTexture(Sprite.fontTexture);
        this.material.apply();
        this.sceneGraph.scene.pushMatrix();

        this.setPositionDisplay();

    }

    display(path, prevMaterial, prevTexture) {
        this.setDisplay();
        this.draw();
        this.unsetDisplay();
    }

    getCharCoords(charCode) {
        let x = charCode % 16;
        let y = Math.floor(charCode / 16);
        return [x, y];
    }

    drawCarriageForward(distance) {
        this.sceneGraph.scene.translate(distance * this.charMultiplier, 0, 0);
    }
    drawCarriageChar() {
        this.sceneGraph.scene.translate(this.charMultiplier, 0, 0);
    }

    drawCarriageBackward(distance) {
        this.sceneGraph.scene.translate(-distance * this.charMultiplier, 0, 0);
    }

    drawTop() {
        // vertical align
        if (this.strategy['vertical-align']) {
            let strategy = this.strategy['vertical-align'];
            if (strategy == 'top') {
                return;
            }
            else if (strategy == 'bottom') {
                this.sceneGraph.scene.translate(0, this.lines.length, 0);
            }
            else if (strategy == 'center') {
                this.sceneGraph.scene.translate(0, (this.lines.length - QUAD_OFFSET) / 2, 0);
            }
        }
        return;
    }

    drawSetCarriage() {
        let setCarriage = 0;
        if (this.strategy['horizontal-align']) {
            if (this.strategy['horizontal-align'] == 'left') {
                setCarriage = this.getWidth() / 2 - QUAD_OFFSET - CHAR_OFFSET;
            }
            else if (this.strategy['horizontal-align'] == 'right') {
                setCarriage = -this.getWidth() / 2 - QUAD_OFFSET - CHAR_OFFSET;
            }
        }
        this.drawCarriageBackward(setCarriage);
        return setCarriage;
    }

    drawSetLineCarriage(line) {
        let leftSide = 0;
        if (this.strategy['horizontal-align']) {
            let width = this.getWidth();
            let strategy = this.strategy['horizontal-align'];
            if (strategy == 'left') {
                leftSide = 0;
            }
            else if (strategy == 'center') {
                leftSide = line.length / 2 - QUAD_OFFSET + CHAR_OFFSET;
            }
            else if (strategy == 'right') {
                leftSide = line.length
            }
        }
        // horizontal align
        this.drawCarriageBackward(leftSide);
        return leftSide;
    }


    drawResetCarriage(line, carriageStart) {
        // horizontal align
        let start = line.length;
        if (this.strategy['horizontal-align']) {
            let strategy = this.strategy['horizontal-align'];
            if (strategy == 'left') {
                start = line.length;
            }
            else if (strategy == 'center') {
                start = line.length / 2

            }
            else if (strategy == 'right') {
                start = 0;
            }
        }

        this.drawCarriageBackward(start);
    }

    drawLineBreak() {
        this.sceneGraph.scene.translate(0, -this.heightMultiplier, 0);
    }

    draw() {
        let x, y, carriageSet, carriageStart;
        this.drawTop();
        carriageSet = this.drawSetCarriage();
        for (let line of this.lines) {
            carriageStart = this.drawSetLineCarriage(line);
            for (let char of line) {
                let charCode = char.charCodeAt();
                [x, y] = this.getCharCoords(charCode);
                Sprite.shader.setUniformsValues({ 'charCoords': [x, y] });
                Sprite.surface.display();
                this.drawCarriageChar();
            }
            this.drawResetCarriage(line, carriageStart);
            this.drawLineBreak();
        }

    }

    unsetDisplay() {
        this.sceneGraph.scene.popMatrix();
        this.sceneGraph.scene.setActiveShaderSimple(this.sceneGraph.scene.defaultShader);
        this.sceneGraph.scene.gl.enable(this.sceneGraph.scene.gl.DEPTH_TEST);

    }


}