uniform vec3 uColor0;
uniform vec3 uColor1;
uniform float uMixStrength;

varying float vWobble;

void main()
{
    float colorMix = smoothstep(-1.0, 1.0, vWobble * uMixStrength);

    // Mixed color
    vec3 mixedColor = mix(uColor0, uColor1, colorMix);

    // Final color
    csm_DiffuseColor.rgb = mixedColor;

    // // Mirror step
    // csm_Metalness = step(0.25, vWobble);
    // csm_Roughness = 1.0 - csm_Metalness;

    // Shiny tip
    csm_Roughness = 1.0 - colorMix;
}