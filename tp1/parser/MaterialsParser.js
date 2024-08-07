import { Material } from "../materials/Material.js";

export function materialsParser(materialsNode) {
    var children = materialsNode.children;

    this.materials = [];

    var grandChildren = [];
    var nodeNames = [];

    // Any number of materials.
    for (var i = 0 ; i < children.length; i++) {
        var child = children[i];
        if (child.nodeName != "material") {
            this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
            continue;
        }

        // Get id of the current material.
        var materialID = this.reader.getString(child, 'id');
        if (materialID == null)
            return "no ID defined for material";

        // Checks for repeated IDs.
        if (this.materials[materialID] != null)
            return "ID must be unique for each material (conflict: ID = " + materialID + ")";

        var shininess = this.reader.getFloat(child, "shininess")
        if (!(shininess != null && !isNaN(shininess))) {
            return "unable to parse shininess attribute for material" + materialID;
        }

        var lightComponentsElements = child.children;
        nodeNames = [];
        for (var j = 0; j < lightComponentsElements.length; j++) {
            nodeNames.push(lightComponentsElements[j].nodeName);
        }

        var emissionIndex = nodeNames.indexOf("emission");
    
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");
        if(emissionIndex == -1){
            return "No emission component for " + materialID;
        }
        if(ambientIndex == -1){
            return "No ambient component for " + materialID;
        }
        if(diffuseIndex == -1){
            return "No diffuse component for " + materialID;
        }
        if(specularIndex == -1){
            return "No specular component for " + materialID;
        }
        var indices = [emissionIndex, ambientIndex, diffuseIndex, specularIndex]

        var lightComponents = [];
        for(let indice of indices){
            let lightComponent = this.parseColor(lightComponentsElements[indice], "material " + materialID);
            lightComponents.push(lightComponent);
        }
        var material = new Material(this.scene, shininess, lightComponents);
        this.materials[materialID] = material;
    }

    //this.log("Parsed materials");
    return null;
}

function lightComponentParser(lightComponent, materialId){
    let r = this.reader.getFloat(lightComponent, "r")

    let g = this.reader.getFloat(lightComponent, "g")

    let b = this.reader.getFloat(lightComponent, "b")

    let a= this.reader.getFloat(lightComponent, "a")

    return (r,g,b,a);
}