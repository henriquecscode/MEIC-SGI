export function ambientParser(ambientsNode){

    var children = ambientsNode.children;

    this.ambient = [];
    this.background = [];

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
        nodeNames.push(children[i].nodeName);

    var ambientIndex = nodeNames.indexOf("ambient");
    var backgroundIndex = nodeNames.indexOf("background");

    var color = this.parseColor(children[ambientIndex], "ambient", true);
    if (!Array.isArray(color))
        return color;
    else
        this.ambient = color;

    color = this.parseColor(children[backgroundIndex], "background", true);
    if (!Array.isArray(color))
        return color;
    else
        this.background = color;

    this.log("Parsed ambient");

    return null;
}