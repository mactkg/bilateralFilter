#version 120

uniform sampler2DRect tex0;
uniform float sigma_gauss;
uniform float sigma_color;
uniform int select;

varying vec2 texCoordVarying;

// helper functions
float normpdf(in float x, in float sigma)
{
    // 0.39894 == 1/sqrt(s * pi)
    // normpdf: http://jp.mathworks.com/help/stats/normpdf.html
    // (e^(-(x-u)^2 / 2s^2)) / s*sqrt(2*pi)
    return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}

float normpdf3(in vec3 v, in float sigma)
{
    // 0.39894 == 1/sqrt(s * pi)
    return 0.39894*exp(-0.5*dot(v,v)/(sigma*sigma))/sigma;
}


// filters
vec4 gblur()
{
    // http://imagingsolution.net/imaging/gaussian/
    vec4 c = texture2DRect(tex0, texCoordVarying);
    const int kSize = 5;
    const int size = kSize*2 + 1;
    float kernel[size];
    vec3 c_final = vec3(0.0);
    
    // generate base kernel
    float Z = 0.0;
    for (int d = 0; d <= kSize; d++) {
        kernel[kSize+d] = kernel[kSize-d] = normpdf(float(d), sigma_gauss);
    }
   
    // sum all base kernel
    for (int d = 0; d <= size; d++) {
        Z += kernel[d];
    }
    
    // apply kernel
    for (int y = -kSize; y <= kSize; ++y) {
        for (int x = -kSize; x <= kSize; ++x) {
            c_final += kernel[kSize+x] * kernel[kSize+y] *
                       texture2DRect(tex0, texCoordVarying + vec2(x, y)).rgb;
        }
    }
    
    // divide color by summed kernel value^2
    return vec4(c_final/(Z*Z), 1.0);
}

vec4 bblur()
{
    // http://imagingsolution.net/imaging/gaussian/
    vec4 c = texture2DRect(tex0, texCoordVarying);
    const int kSize = 5;
    const int size = kSize*2 + 1;
    float kernel[size];
    vec3 c_final = vec3(0.0);
    
    // generate base kernel
    float Z = 0.0;
    for (int d = 0; d <= kSize; d++) {
        kernel[kSize+d] = kernel[kSize-d] = normpdf(float(d), sigma_gauss);
    }
   
    // apply kernel
    for (int y = -kSize; y <= kSize; ++y) {
        for (int x = -kSize; x <= kSize; ++x) {
            vec4 cc = texture2DRect(tex0, texCoordVarying + vec2(x, y)); // target pixel
            float fs = kernel[kSize+x] * kernel[kSize+y]; // gauss kernel
            float fr = normpdf3((c-cc).rgb, sigma_color); // bilateral kernel based on difference between center(c) pixel and target(cc) pixel
            c_final += fs * fr * cc.rgb; // calcit
            Z += fs * fr; // sum kernel
        }
    }
    
    // divide color by summed kernel
    return vec4(c_final/Z, 1.0);
}


void main()
{
    if(select == 0) {
        gl_FragColor = texture2DRect(tex0, texCoordVarying); // normal
    } else if(select == 1) {
        gl_FragColor = gblur(); // gaussian blur
    } else if(select == 2) {
        gl_FragColor = bblur(); // bilateral blur
    }
}