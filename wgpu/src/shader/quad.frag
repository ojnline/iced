#version 450

layout(location = 0) in vec4 v_Color;
layout(location = 1) in vec4 v_BorderColor;
layout(location = 2) in vec2 v_Pos;
layout(location = 3) in vec2 v_Scale;
layout(location = 4) in float v_BorderRadius;
layout(location = 5) in float v_BorderWidth;

layout(location = 0) out vec4 o_Color;

float distance( in vec2 uv, in vec2 p, in vec2 b, float r )
{
    vec2 q = abs(uv-p)-b+r;
    return (min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r );
}

void main() {

    // note that the antialising effect of this is tied to the screen dpi,
    // it should be computed on the cpu and passed in a uniform
    // or replaced as a constant when compiling the shader
    const float tolerance = 1.0;

    float d = distance(
        gl_FragCoord.xy,
        v_Pos+v_Scale*0.5,
        v_Scale/2.0,
        v_BorderRadius
    );

    float radius_backround = smoothstep(0.5 - tolerance, 0.5 + tolerance, d+v_BorderWidth);
    float radius_border =    smoothstep(0.5 - tolerance, 0.5 + tolerance, d);

    o_Color = v_Color * (1.0 - radius_backround)
            + v_BorderColor * (1.0 - radius_border) * radius_border;
}