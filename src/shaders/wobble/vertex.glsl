uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequncy;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequncy;
uniform float uWarpStrength;
uniform float uAudioFrequncy;
uniform float uAudioMultiplier;

attribute vec4 tangent;

varying float vWobble;

#include "../partials/simplexNoise4d.glsl"

float getWobble(vec3 position)
{
    float audioStrength = pow((uAudioFrequncy) / 100.0, 5.0);

    vec3 warpedPosition = position;
    warpedPosition += simplexNoise4d(vec4(
        position * uWarpPositionFrequency,
        uTime * uWarpTimeFrequncy
    )) * uWarpStrength;

    return simplexNoise4d(vec4(
        warpedPosition * uPositionFrequency, // XYZ
        uTime * uTimeFrequncy                // W
    )) * uStrength * (1.0 + audioStrength * uAudioMultiplier);
}

void main()
{
    // Calculate BiTangent using tangent and normal
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighnours positions
    float shift  = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;

    // Wobble
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    // Compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    // Varying
    vWobble = wobble / uStrength;
}