import * as THREE from "three";

export const ribbonVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}
`;

export const ribbonFragmentShader = `
uniform float uTime;
uniform float uFormation;

varying vec2 vUv;

vec3 blue   = vec3(0.16, 0.38, 1.0);
vec3 purple = vec3(0.47, 0.30, 1.0);
vec3 orange = vec3(1.00, 0.48, 0.12);
vec3 pink   = vec3(1.00, 0.25, 0.70);

void main() {
float formation =
  smoothstep(
    0.0,
    1.0,
    uFormation
  );

vec2 flowUv = vUv;

float chaos =
  (1.0 - formation);

flowUv.y +=
  sin(
    vUv.x * 12.0 +
    uTime * 0.8
  ) *
  0.35 *
  chaos;

flowUv.x +=
  sin(
    vUv.y * 8.0 +
    uTime * 0.4
  ) *
  0.15 *
  chaos;

  float flow =
    fract(
      vUv.x * 2.0
      - uTime * 0.15
    );

  vec3 color =
  mix(
    blue,
    purple,
    smoothstep(
      0.0,
      0.45,
      flowUv.y
    )
  );

color =
  mix(
    color,
    pink,
    smoothstep(
      0.35,
      0.75,
      flowUv.y
    )
  );

color =
  mix(
    color,
    orange,
    smoothstep(
      0.65,
      1.0,
      flowUv.y
    )
  );

  float highlight =
    smoothstep(
      0.0,
      0.15,
      flow
    ) *
    (1.0 -
      smoothstep(
        0.15,
        0.35,
        flow
      ));

  color += highlight * 0.9;


 float brightness =
  mix(
    0.15,
    1.0,
    formation
  );

gl_FragColor =
  vec4(
    color * brightness,
    1.0
  );
}
`;

export function createRibbonMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uFormation: { value: 1 },
    },

    vertexShader: ribbonVertexShader,

    fragmentShader: ribbonFragmentShader,

    side: THREE.DoubleSide,
  });
}
