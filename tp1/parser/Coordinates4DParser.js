export function coordinates4DParser(node, messageError) {
    var position = [];

    //Get x, y, z
    position = this.parseCoordinates3D(node, messageError);

    if (!Array.isArray(position))
        return position;


    // w
    var w = this.reader.getFloat(node, 'w');
    if (!(w != null && !isNaN(w)))
        return "unable to parse w-coordinate of the " + messageError;

    position.push(w);

    return position;
}