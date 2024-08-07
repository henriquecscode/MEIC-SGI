export class InheritedMaterial {
    constructor() {
        this.material = {
            apply: function () { },
            setTexture: function () { }
        }
    }

    apply(prevMaterial) {
        prevMaterial.apply();
        return prevMaterial;
    }
}