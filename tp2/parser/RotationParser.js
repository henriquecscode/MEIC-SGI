export function rotationParser(node, messageError) {

    var angle = this.reader.getFloat(node, 'angle');
    if (!(angle != null && !isNaN(angle)))
        return "unable to parse angle of the " + messageError;

    var axis = this.reader.getString(node, 'axis');
    if (!(axis == "z" || axis == "y" || axis == "x"))
        return "unable to parse axis of the " + messageError;

    return { angle: angle, axis: axis };
}
