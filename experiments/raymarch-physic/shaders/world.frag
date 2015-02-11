precision mediump float;

#define PI 3.1415926535897932384626433832795

uniform vec2 uResolution;
uniform float uNear;
uniform float uFar;
uniform float uFov;
uniform float uTime;
uniform float uProgress;
uniform float uDirectionHotness;
uniform vec3 uLightPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform sampler2D uNoiseTexture;
uniform float uSounds[5];

// STRUCTURES

struct Voxel
{
  float dist;
  vec4 color;
};

// PRIMITIVES

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

// NOISES

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 random2f( vec2 seed )
{
  float rnd1 = mod(fract(sin(dot(seed, vec2(14.9898,78.233))) * 43758.5453), 1.0);
  float rnd2 = mod(fract(sin(dot(seed+vec2(rnd1), vec2(14.9898,78.233))) * 43758.5453), 1.0);
  return vec2(rnd1, rnd2);
}

float hash1( float n ) { return fract(43758.5453123*sin(n)); }
float hash1( vec2  n ) { return fract(43758.5453123*sin(dot(n,vec2(1.0,113.0)))); }
vec2  hash2( float n ) { return fract(43758.5453123*sin(vec2(n,n+1.0))); }
vec2  hash2( vec2  n ) { n = vec2( dot(n,vec2(127.1,311.7)), dot(n,vec2(269.5,183.3)) ); return fract(sin(n)*43758.5453); }
vec3  hash3( vec2  n ) { return fract(43758.5453123*sin(dot(n,vec2(1.0,113.0))+vec3(0.0,1.0,2.0))); }
vec4  hash4( vec2  n ) { return fract(43758.5453123*sin(dot(n,vec2(1.0,113.0))+vec4(0.0,1.0,2.0,3.0))); }

float noise( in float x )
{
    float p = floor(x);
    float f = fract(x);

    f = f*f*(3.0-2.0*f);

    return mix( hash1(p+0.0), hash1(p+1.0),f);
}

float noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    f = f*f*(3.0-2.0*f);

    float n = p.x + p.y*157.0;

    return mix(mix( hash1(n+  0.0), hash1(n+  1.0),f.x),
               mix( hash1(n+157.0), hash1(n+158.0),f.x),f.y);
}

float cheapNoise( vec3 p) {
  return sin(p.x * 2.0)*sin(p.y * 2.0)*sin(p.z * 2.0);
}

const mat2 m2 = mat2( 0.80, -0.60, 0.60, 0.80 );

float fbm( vec2 p )
{
    float f = 0.0;

    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}

// UTILS

Voxel smin( Voxel voxel1, Voxel voxel2, float blendRatio )
{
  float ratio = clamp(.5 + .5 * (voxel2.dist - voxel1.dist) / blendRatio, 0., 1.);
  
  float dist = mix(voxel2.dist, voxel1.dist, ratio) - blendRatio * ratio * (1. - ratio);
  vec4 color = mix(voxel2.color, voxel1.color, ratio);

  return Voxel(dist, color);
}

Voxel min( Voxel voxel1, Voxel voxel2 )
{
  if(voxel1.dist - voxel2.dist < 0.) {
    return voxel1;
  }
  else {
    return voxel2;
  }
}

float maxcomp( in vec3 v ) { return max( max( v.x, v.y ), v.z ); }

vec4 getTexture(sampler2D texture, vec2 position, float scale) {
  return texture2D(uNoiseTexture, fract(position / scale));
}

// MAIN

Voxel stars( vec3 p ) {

  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

  float modulo = 150.;

  vec2 pos = floor(p.xz / modulo);

  vec3 noiseRatio = hash3(pos);

  p += noiseRatio * 100.;

  p = mod(p, modulo) - modulo * .5;
  float dist = sdSphere(p, .5);
  
  return Voxel( dist, color );
}

Voxel airCubes( vec3 p ) {

  vec4 color = vec4(1., 0., 0., 1.);

  float modulo = 300.;

  vec2 pos = floor(p.xz / modulo);

  vec2 noiseRatio = hash2(pos);

  color.g = noiseRatio.x;
  color.b = noiseRatio.y;
  color *= 3.5;

  p = mod(p, modulo) - modulo * .5;
  p += (noiseRatio.x * noiseRatio.y) * 100. - 50.;

  // radius 
  // float radius = 0.;

  p.y -= 100.;

  // p.x += sin(uTime * .11) * 100.;

  // if (uProgress > 0.) {
  //   p.y -= 100. * (uProgress * 2. - 1.);
  //   radius += (20. + (noiseRatio.x * noiseRatio.y) * 100.);
  //   radius *= uSounds[0] * 3.;
  // }
  
  vec3 cub = vec3(5., 5., 5.) * (noiseRatio.x + noiseRatio.y);
  cub *= uSounds[1] * 5.;
  if (uProgress > 5.) {
    cub *= 1. + uSounds[4] * 4. * (noiseRatio.x + noiseRatio.y);
  }
  if (uProgress <= 5.) {
    cub *= 1. + uSounds[3] * 20.;
  }

  // cub.y *= uSounds[0];
  // cub *= (noiseRatio.x + noiseRatio.y) * 3.;

  float scale = .1;
  // p += sin(uTime * .1) * 10.;
  p += sin(p.x * scale * sin(uTime * .1 + (noiseRatio.x + noiseRatio.y))) * sin(p.y * scale) * sin(p.z * scale) * 10.;
  // cub.y *= uSounds[1];

  float dist = udRoundBox(p, cub, 0.);

  return Voxel( dist, color );
}

Voxel cubes( vec3 p ) {

  // vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 color = vec4(1., 0., 0., 1.);

  float modulo = 10.;

  vec2 pos = floor(p.xz / modulo);

  vec2 noiseRatio = hash2(pos);

  color.g = noiseRatio.x;
  color.b = noiseRatio.y;
  color *= 1.5;

  p.xz = mod(p.xz, modulo) - modulo * .5;
  // p.xz += noiseRatio * 100.;

  // radius 
  // float radius = 0.;

  p.y += 10.;
  // if (uProgress > 0.) {
  //   p.y -= 100. * (uProgress * 2. - 1.);
  //   radius += (20. + (noiseRatio.x * noiseRatio.y) * 100.);
  //   radius *= uSounds[0] * 3.;
  // }
  
  vec3 cub = vec3(2., 10., 2.);

  // cub.y *= uSounds[0];
  cub.y += (noiseRatio.x + noiseRatio.y) * 10.;
  cub.y *= uSounds[2] * 2.;
  if (uProgress > 5.) {
    cub.y *= 1. + uSounds[3] * 5.;
  }

  float dist = udRoundBox(p, cub, 0.);

  return Voxel( dist, color );
}

Voxel spheres( vec3 p ) {

  vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

  float modulo = 400.;

  vec2 pos = floor(p.xz / modulo);

  vec2 noiseRatio = hash2(pos);

  p.y += (noiseRatio.x + noiseRatio.y) * -40.;
  color.g = noiseRatio.x;
  color.b = noiseRatio.y;
  color *= 2.5;

  p.xz = mod(p.xz, modulo) - modulo * .5;
  p.xz += noiseRatio * 100.;

  // radius 
  float radius = 0.;

  p.y += 100.;
  if (uProgress > 0.) {
    p.y -= 100. * (uProgress * 2. - 1.);
  }

  radius += (20. + (noiseRatio.x * noiseRatio.y) * 150.);
  radius *= uSounds[0] * 1.5;
  radius *= 1. + uSounds[1] * 5.;

  if (uProgress > 5.) {
    p.y = 0.;
    radius *= uProgress - .5;
    radius *= .1;
  }

  float dist = sdSphere(p, radius);

  return Voxel( dist, color );
}

Voxel ground( vec3 p, vec4 tex ) {

  vec4 color = vec4(.95, .95, .95, 1.);
  
  float displacement = (tex.r + tex.g + tex.b) / 3.;

  p.y += -displacement * 5.;

  float dist = p.y;

  return Voxel(dist, color);
}

Voxel map( vec3 p) {

  vec4 noiseTex = getTexture(uNoiseTexture, p.xz, 500.);

  Voxel voxel = ground(p, noiseTex);

  voxel = smin(spheres(p), voxel, 10.);
  voxel = smin(cubes(p), voxel, 1.);
  voxel = smin(airCubes(p), voxel, 10.);

  voxel = min(stars(p), voxel);

  return voxel;
}

vec3 calcNormal ( vec3 p ) {
  vec2 e = vec2(1., 0.0);
  return normalize(vec3(
    map(p + e.xyy).dist - map(p - e.xyy).dist,
    map(p + e.yxy).dist - map(p - e.yxy).dist,
    map(p + e.yyx).dist - map(p - e.yyx).dist
  ));
}

Voxel trace( vec3 ro, vec3 rd)
{
  Voxel voxel = Voxel(uFar, vec4(0.0));

  float rayMarchingStep = 0.00001;
  float dist = uNear;

  for(int i = 0; i < 32; i++) {
    if (rayMarchingStep < 0.00001 || rayMarchingStep > uFar) break;
    voxel = map( ro + rd * dist);
    rayMarchingStep = voxel.dist;
    dist += rayMarchingStep;
    voxel.dist = dist;
  }
  
  if (dist < uFar) {
    vec3 normal = calcNormal(ro + rd * dist);
    voxel.color *= .75 + dot(normal, normalize(vec3(1., 1., 0.))) * .75 * vec4(.4, .4, 1., 1.);
    voxel.color += max(1. - (abs(length(uLightPosition - (ro + rd * voxel.dist))) / 100.), 0.) * vec4(1., .2, .2, 1.) * 3.;
  }

  return voxel;
}

void main()
{
  float fovScaleY = tan((uFov / 180.0) * PI * .5);
  float aspect = uResolution.x / uResolution.y;

  vec2 position = ( gl_FragCoord.xy / uResolution.xy );
  position = position * 2. - 1.;

  vec3 vEye = -( uModelViewMatrix[3].xyz ) * mat3( uModelViewMatrix );
  vec3 vDir = vec3(position.x * fovScaleY * aspect, position.y * fovScaleY,-1.0) * mat3( uModelViewMatrix );
  vec3 vCameraForward = vec3( 0.0, 0.0, -1.0) * mat3( uModelViewMatrix );

  vec3 rayOrigin = vEye;
  vec3 rayDirection = normalize(vDir);
  
  Voxel voxel = trace(rayOrigin, rayDirection);

  float eyeHitZ = voxel.dist * dot(vCameraForward, rayDirection);

  float depth = eyeHitZ * 1.;

  depth = smoothstep( uNear, uFar, depth );

  voxel.color.rgb *= (1. - depth);
  voxel.color.rgb += vec3(0., 0., .1) * depth + uDirectionHotness * .1 * vec3(1., .5, .5);

  gl_FragColor = vec4(voxel.color.rgb, 1.0 - depth);
  // gl_FragColor = vec4(voxel.color.rgb, 1.0);
}