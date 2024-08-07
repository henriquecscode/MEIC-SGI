import { CGFtexture } from "../../lib/CGF.js";

export function texturesParser(texturesNode) {
        //For each texture in textures block, check ID and file URL

        this.textures = [];
        if (texturesNode.children.length == 0) {
                return "No texture in <textures> block";
        }
        var children = texturesNode.children;

        for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.nodeName != "texture") {
                        this.onXMLMinorError("unknown tag <" + child.nodeName + ">");
                        continue;
                }
                var id, fileName;
                id = this.reader.getString(child, "id");
                if (id == null) {
                        return "no ID defined for texture";
                }

                // Checks for repeated IDs.
                if (this.textures[id] != null) {
                        return "ID must be unique for each texture (conflict: ID = " + id + ")";
                }

                fileName = this.reader.getString(child, "file");
                if (fileName == null) {
                        return "no file defined for texture";
                }
                if (!(fileName.endsWith(".jpg") || fileName.endsWith(".png"))) {
                        return "specified texture file must be a jpg or a png";
                }
                var texture = new CGFtexture(this.scene, fileName);
                this.textures[id] = texture;

        }

        if (Object.keys(this.textures).length == 0) {
                return "No existent valid texture in <textures> block";
        }
}