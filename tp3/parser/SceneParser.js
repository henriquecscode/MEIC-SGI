export function sceneParser(sceneNode){
    // Get root of the scene.
    var root = this.reader.getString(sceneNode, 'root')
    if (root == null)
        return "no root defined for scene";

    this.idRoot = root;

    // Get axis length        
    var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
    if (axis_length == null)
        this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

    this.referenceLength = axis_length || 1;

    this.log("Parsed scene");

    return null;
}