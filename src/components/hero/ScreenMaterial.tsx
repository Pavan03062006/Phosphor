import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uFlicker;
  uniform float uCurvature;
  uniform float uScanline;
  uniform float uVignette;
  uniform float uTime;
  uniform vec3 uTint;
  varying vec2 vUv;

  vec2 curveUv(vec2 uv) {
    vec2 c = uv * 2.0 - 1.0;
    vec2 offset = c.yx * uCurvature;
    c = c + c * offset * offset;
    return c * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = curveUv(vUv);

    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    float aberration = 0.0018;
    float r = texture2D(uMap, uv + vec2(aberration, 0.0)).r;
    float g = texture2D(uMap, uv).g;
    float b = texture2D(uMap, uv - vec2(aberration, 0.0)).b;
    vec3 color = vec3(r, g, b);

    float scan = sin(uv.y * 340.0 + uTime * 2.0) * 0.5 + 0.5;
    color *= mix(1.0, 0.86 + 0.14 * scan, uScanline);

    float dist = length(uv - 0.5);
    float vig = 1.0 - smoothstep(0.32, 0.9, dist);
    color *= mix(1.0, vig, uVignette);

    float noise = fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
    color += noise * 0.006;

    color *= uTint;
    color *= uFlicker;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export class ScreenShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      toneMapped: false,
      uniforms: {
        uMap: { value: null as THREE.Texture | null },
        uFlicker: { value: 0 },
        uCurvature: { value: 0.09 },
        uScanline: { value: 0.35 },
        uVignette: { value: 0.55 },
        uTime: { value: 0 },
        uTint: { value: new THREE.Color(0.95, 1.03, 0.99) },
      },
    });
  }

  set uMap(value: THREE.Texture | null) {
    this.uniforms.uMap.value = value;
  }
  get uMap(): THREE.Texture | null {
    return this.uniforms.uMap.value;
  }

  set uFlicker(value: number) {
    this.uniforms.uFlicker.value = value;
  }
  get uFlicker(): number {
    return this.uniforms.uFlicker.value;
  }

  set uTime(value: number) {
    this.uniforms.uTime.value = value;
  }
  get uTime(): number {
    return this.uniforms.uTime.value;
  }
}
