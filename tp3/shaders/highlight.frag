#version 300 es
precision highp float;

in vec4 vFinalColor;
in vec2 vTextureCoord;

out vec4 fragColor;

uniform sampler2D uSampler;

uniform bool uUseTexture;

uniform float colorx;
uniform float colory;
uniform float colorz;

uniform float offset_factor;
void main() {
	vec4 inputt = vec4(colorx, colory, colorz, 1.0);
	float time = offset_factor;
	if (uUseTexture)
	{
		vec4 textureColor = texture(uSampler, vTextureCoord);
		vec4 calculatedColor = textureColor * vFinalColor; 
		fragColor = mix(calculatedColor, inputt, time);
	}
	else
	{
		vec4 calculatedColor = vFinalColor;
		fragColor = mix(calculatedColor, inputt, time);
	}

}