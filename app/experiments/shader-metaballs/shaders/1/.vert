attribute vec2 a_position;
varying vec2 v_position;

void main() {
    gl_Position = vec4(a_position, 1, 1);
    v_position = a_position;
}