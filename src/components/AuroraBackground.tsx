'use client';

import { useEffect, useRef } from 'react';

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0, 1);
      }
    `;

    // Fragment shader source
    const fragmentShaderSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      
      #define filmGrainIntensity 0.1
      
      mat2 Rot(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
      }
      
      vec2 hash(vec2 p) {
        p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
        return fract(sin(p)*43758.5453);
      }
      
      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        float n = mix(mix(dot(-1.0+2.0*hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), dot(-1.0+2.0*hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x), mix(dot(-1.0+2.0*hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(-1.0+2.0*hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
        return 0.5 + 0.5*n;
      }
      
      float filmGrainNoise(in vec2 uv) {
        return length(hash(vec2(uv.x, uv.y)));
      }
      
      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = fragCoord / iResolution.xy;
        float aspectRatio = iResolution.x / iResolution.y;
        vec2 tuv = uv - .5;
        
        float degree = noise(vec2(iTime*.05, tuv.x*tuv.y));
        tuv.y *= 1./aspectRatio;
        tuv = Rot(radians((degree-.5)*720.+180.)) * tuv;
        tuv.y *= aspectRatio;
        
        float frequency = 5.;
        float amplitude = 30.;
        float speed = iTime * 2.;
        tuv.x += sin(tuv.y*frequency+speed)/amplitude;
        tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
        
        vec3 auroraGreen = vec3(80.0, 255.0, 130.0)/255.0;
        vec3 auroraCyan = vec3(70.0, 230.0, 255.0)/255.0;
        vec3 auroraMagenta = vec3(220.0, 100.0, 255.0)/255.0;
        vec3 auroraBlue = vec3(30.0, 60.0, 200.0)/255.0;
        vec3 auroraPurple = vec3(120.0, 60.0, 200.0)/255.0;
        vec3 auroraPink = vec3(255.0, 110.0, 180.0)/255.0;
        vec3 auroraYellowGreen = vec3(180.0, 255.0, 120.0)/255.0;
        vec3 auroraMidnight = vec3(10.0, 30.0, 60.0)/255.0;
        
        float cycle = sin(iTime * 0.5);
        float t = (sign(cycle) * pow(abs(cycle), 0.6) + 1.) / 2.;
        
        vec3 color1 = mix(auroraGreen, auroraPurple, t);
        vec3 color2 = mix(auroraCyan, auroraMidnight, t);
        vec3 color3 = mix(auroraMagenta, auroraYellowGreen, t);
        vec3 color4 = mix(auroraBlue, auroraPink, t);
        
        vec3 layer1 = mix(color3, color2, smoothstep(-.3,.2, (Rot(radians(-5.))*tuv).x));
        vec3 layer2 = mix(color4, color1, smoothstep(-.3,.2, (Rot(radians(-5.))*tuv).x));
        vec3 color = mix(layer1, layer2, smoothstep(.5, -.3, tuv.y));
        
        color = color - filmGrainNoise(uv) * filmGrainIntensity;
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vsrc: string, fsrc: string) {
      const vshader = createShader(gl, gl.VERTEX_SHADER, vsrc);
      const fshader = createShader(gl, gl.FRAGMENT_SHADER, fsrc);
      if (!vshader || !fshader) return null;

      const prog = gl.createProgram();
      if (!prog) return null;
      gl.attachShader(prog, vshader);
      gl.attachShader(prog, fshader);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(prog));
        gl.deleteProgram(prog);
        return null;
      }
      return prog;
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    function main() {
      resize();
      const prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);
      if (!prog) return;

      const positionLoc = gl.getAttribLocation(prog, 'position');
      const iTimeLoc = gl.getUniformLocation(prog, 'iTime');
      const iResolutionLoc = gl.getUniformLocation(prog, 'iResolution');
      
      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1, 1, 1
      ]), gl.STATIC_DRAW);

      function render(t = 0) {
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(iTimeLoc, t * 0.001);
        gl.uniform2f(iResolutionLoc, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
      }

      render();
    }

    window.addEventListener('resize', resize);
    main();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="gl-canvas"
        className="fixed top-0 left-0 w-full h-full block z-0"
        style={{ width: '100vw', height: '100vh' }}
      />
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-900/70" />
    </>
  );
}
