precision highp float;

#define PI 3.1415926535897932384626433832795

uniform vec2 resolution;
uniform float cameraNear;
uniform float cameraFar;
uniform float cameraFov;
uniform mat4 cameraModelViewMatrix;
uniform float time;
uniform mat4 objectsMatrices[40];

// STRUCTURES

struct Voxel
{
  float dist;
  vec4 color;
};

// PRIMITIVES

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
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

// MAIN

Voxel objects( vec3 p ) {

  Voxel voxel = Voxel( cameraFar, vec4(1.) );

  for(int i = 0; i < 40; i++) {
    vec3 q = (objectsMatrices[i] * vec4(p, 1.)).xyz;
    vec4 color = vec4(1.0, 0.2, 0.5, 1.0) + vec4(normalize(-objectsMatrices[i][3].xyz), 1.);
    // voxel = min(Voxel(sdSphere(q, 1.), color), voxel);
    voxel = smin(Voxel(sdBox(q, vec3(.5, .5, .5)), color), voxel, 1.);
  }

  return voxel;
}

Voxel ground( vec3 p) {

  vec4 color = vec4(.95, .95, .95, 1.);

  float dist = p.y;

  return Voxel(dist, color);
}

Voxel map( vec3 p) {

  Voxel voxel = ground(p);

  voxel = smin(objects(p), voxel, .5);

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

Voxel rayMarch( vec3 rayOrigin, vec3 rayDirection)
{
  Voxel voxel = Voxel(cameraFar, vec4(0.0));

  float rayMarchingStep = 0.00001;
  float dist = cameraNear;

  for(int i = 0; i < 32; i++) {
    if (rayMarchingStep < 0.00001 || rayMarchingStep > cameraFar) break;
    voxel = map( rayOrigin + rayDirection * dist );
    rayMarchingStep = voxel.dist;
    dist += rayMarchingStep;
    voxel.dist = dist;
  }

  if (dist < cameraFar) {
    vec3 normal = calcNormal(rayOrigin + rayDirection * dist);
    voxel.color *= .75 + dot(normal, normalize(vec3(1., 1., 0.))) * .75 * vec4(.4, .4, 1., 1.);
  }

  return voxel;
}

void main()
{
  float fovScaleY = tan((cameraFov / 180.0) * PI * .5);
  float aspect = resolution.x / resolution.y;

  vec2 position = ( gl_FragCoord.xy / resolution.xy );
  position = position * 2. - 1.;

  vec3 vCameraForward = vec3( 0.0, 0.0, -1.0) * mat3( cameraModelViewMatrix );

  vec3 rayOrigin = -( cameraModelViewMatrix[3].xyz ) * mat3( cameraModelViewMatrix );
  vec3 rayDirection = normalize(vec3(position.x * fovScaleY * aspect, position.y * fovScaleY, -1.0) * mat3( cameraModelViewMatrix ));

  Voxel voxel = rayMarch(rayOrigin, rayDirection);

  gl_FragColor = vec4(voxel.color.rgb, 1.);
}
