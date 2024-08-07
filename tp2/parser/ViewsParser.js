import '../../lib/CGF.js';
import { toRads } from '../utils/utilities.js';
import { OrthoView } from "../views/OrthoView.js";
import { PerspectiveView } from "../views/PerspectiveView.js";

export function viewsParser(viewNode) {
    var children = viewNode.children;

    this.views = [];

    for (var i = 0; i < children.length; i++) {

        var child = children[i];
        var view;

        //Check type of view
        if (child.nodeName != "perspective" && child.nodeName != "ortho") {
            this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
            continue;
        }

        // Get id of the current view.
        var viewId = this.reader.getString(child, 'id');
        if (viewId == null)
            return "no ID defined for view";


        // Checks for repeated IDs.
        if (this.views[viewId] != null)
            return "ID must be unique for each view (conflict: ID = " + viewId + ")";

        var near, far, from, to;

        near = this.reader.getFloat(child, "near")
        if (!(near != null && !isNaN(near))) {
            return 'unable to parse near component for view ' + viewId;
        }

        far = this.reader.getFloat(child, "far")
        if (!(far != null && !isNaN(far))) {
            return 'unable to parse far component for view ' + viewId;
        }

        var grandChildren = child.children;
        // Specifications for the current light.

        var nodeNames = [];
        for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
        }


        // from tag
        var fromIndex = nodeNames.indexOf('from');
        if (fromIndex == -1) {
            return "From tag is mandatory for the view " + viewId;
        }
        else {
            from = this.parseCoordinates3D(grandChildren[fromIndex], "from position for ID " + viewId);
            from = vec3.fromValues(...from);
        }

        // to tag
        var toIndex = nodeNames.indexOf('to');
        if (toIndex == -1) {
            return "To tag is mandatory for the view " + viewId;
        }
        else {
            to = this.parseCoordinates3D(grandChildren[toIndex], "to position for ID " + viewId);
            to = vec3.fromValues(...to);
        }

        // View type variables
        if (child.nodeName == "perspective") {
            var angle;
            angle = this.reader.getFloat(child, "angle");
            if (!(angle != null && !isNaN(angle))) {
                return 'unable to parse angle component for perspective view ' + viewId;
            }
            angle = toRads(angle);

            view = new PerspectiveView(near, far, angle, from, to);
        }
        else if (child.nodeName == "ortho") {
            var left, right, top, bottom, up;

            var upIndex = nodeNames.indexOf("up");
            if (upIndex == -1) {
                up = vec3.fromValues(0, 1, 0);
            }
            else {
                up = this.parseCoordinates3D(grandChildren[upIndex], "up position for ID " + viewId);
                up = vec3.fromValues(...up);
            }
            left = this.reader.getFloat(child, "left");
            if (!(left != null && !isNaN(left))) {
                return 'unable to parse left component for ortho view ' + viewId;
            }
            right = this.reader.getFloat(child, "right");
            if (!(right != null && !isNaN(right))) {
                return 'unable to parse right component for ortho view ' + viewId;
            }
            top = this.reader.getFloat(child, "top");
            if (!(top != null && !isNaN(top))) {
                return 'unable to parse top component for ortho view ' + viewId;
            }
            bottom = this.reader.getFloat(child, "bottom");
            if (!(bottom != null && !isNaN(bottom))) {
                return 'unable to parse bottom component for ortho view ' + viewId;
            }

            view = new OrthoView(near, far, left, right, top, bottom, from, to, up);
        }
        this.views[viewId] = view;
    }

    if (Object.keys(this.views).length == 0) {
        return "There must be at least one valid view";
    }
    var defaultView = this.reader.getString(viewNode, "default");
    if (defaultView == null) {
        defaultView = Object.keys(this.views)[0];
        this.onXMLMinorError("no default view set, using " + defaultView);
    }
    else if (this.views[defaultView] == null) {
        var read = defaultView;
        defaultView = Object.keys(this.views)[0];
        this.onXMLMinorError("default view named '" + read + "' not found, using " + defaultView);

    }
    // Set the default view
    this.defaultView = defaultView;

    // Create an object with {key:key} for every view to be used in the inteface
    this.defaultViewSelector = Object.keys(this.views).reduce((obj, val) => {
        obj[val] = val;
        return obj;
    }, {});
    
    return null;
}