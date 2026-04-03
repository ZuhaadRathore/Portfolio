# Smoke Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the hero WebGL smoke to be clearly visible, corner-concentrated with a cinematic reveal, text-repelling, and dramatically mouse-reactive.

**Architecture:** All changes are contained in two files. The GLSL fragment shader gains three new uniforms (`u_reveal`, `u_text_center`, `u_text_radius`) and updated constants. The `Renderer` class gets new fields/methods to drive those uniforms. `SmokeBackground` gains a `reveal` prop that triggers a 1200ms ease-out animation. `HeroSection` passes `reveal={isLoaded}` down.

**Tech Stack:** WebGL2, GLSL ES 3.00, React, TypeScript

---

### Task 1: Update Renderer class with new uniforms and methods

**Files:**
- Modify: `src/components/ui/spooky-smoke-animation.tsx`

- [ ] **Step 1: Add private fields for new state**

In the `Renderer` class, after the existing `private mouse` field, add:

```typescript
private reveal: number = 0
private textCenter: [number, number] = [0.5, 0.5]
private textRadius: number = 0.32
```

- [ ] **Step 2: Cache new uniform locations in `init()`**

At the end of the `init()` method, after the existing uniform location lines, add:

```typescript
;(program as any).u_reveal      = gl.getUniformLocation(program, 'u_reveal')
;(program as any).u_text_center = gl.getUniformLocation(program, 'u_text_center')
;(program as any).u_text_radius = gl.getUniformLocation(program, 'u_text_radius')
```

- [ ] **Step 3: Add updateReveal and updateTextZone methods**

After the existing `updateMouse` method, add:

```typescript
updateReveal(v: number) {
  this.reveal = v
}

updateTextZone(cx: number, cy: number, r: number) {
  this.textCenter = [cx, cy]
  this.textRadius = r
}
```

- [ ] **Step 4: Pass new uniforms in render()**

In the `render()` method, after the existing `gl.uniform2fv((program as any).u_mouse, ...)` line, add:

```typescript
gl.uniform1f((program as any).u_reveal,      this.reveal)
gl.uniform2fv((program as any).u_text_center, this.textCenter)
gl.uniform1f((program as any).u_text_radius,  this.textRadius)
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/spooky-smoke-animation.tsx
git commit -m "feat: add reveal/textZone uniforms to smoke Renderer"
```

---

### Task 2: Replace fragment shader with updated version

**Files:**
- Modify: `src/components/ui/spooky-smoke-animation.tsx`

- [ ] **Step 1: Replace the entire `fragmentShaderSource` constant**

Replace everything from `` const fragmentShaderSource = `#version 300 es `` through the closing backtick with:

```typescript
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
uniform vec2 u_mouse;
uniform float u_reveal;
uniform vec2 u_text_center;
uniform float u_text_radius;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 uv=(FC-.5*R)/R.y;
  uv.x+=.25;
  uv*=vec2(2,1);

  // Mouse repulsion — expanded radius and stronger push
  vec2 mouseUV=(u_mouse-0.5)*vec2(R.x/R.y,1.0);
  mouseUV.x+=0.25;
  mouseUV*=vec2(2.0,1.0);
  vec2 toMouse=uv-mouseUV;
  float mouseDist=length(toMouse);
  float mouseEffect=smoothstep(0.75,0.0,mouseDist);
  uv+=normalize(toMouse+vec2(0.001,0.001))*mouseEffect*0.55;

  // Text repulsion — static void around name
  vec2 textUV=(u_text_center-0.5)*vec2(R.x/R.y,1.0);
  textUV.x+=0.25;
  textUV*=vec2(2.0,1.0);
  vec2 toText=uv-textUV;
  float textDist=length(toText);
  float textEffect=smoothstep(u_text_radius,0.0,textDist);
  uv+=normalize(toText+vec2(0.001,0.001))*textEffect*0.4;

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  // RGB offset for smoke density
  float r=fbm(uv+vec2(0,T*.015)+n);
  float g=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  float b=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  float density=(r+g+b)/3.0;

  // Lower threshold — more smoke regions pass through
  float alpha=smoothstep(0.52,1.1,density);

  // Corner mask driven by u_reveal: starts wide (0.4), tightens to 2.4
  vec2 sc=FC/R;
  float d=min(min(length(sc),length(sc-vec2(1,0))),
              min(length(sc-vec2(0,1)),length(sc-vec2(1,1))));
  float cornerRadius=mix(0.4,2.4,u_reveal);
  float cornerPower=mix(0.8,2.8,u_reveal);
  float cornerMask=pow(clamp(1.0-d*cornerRadius,0.0,1.0),cornerPower);
  alpha*=cornerMask;

  // Mouse alpha kill — near-total clear under cursor
  alpha*=(1.0-mouseEffect*0.97);

  // Text zone alpha suppression
  alpha*=(1.0-textEffect*0.8);

  O=vec4(u_color,clamp(alpha*1.5,0.0,1.0));
}`
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/spooky-smoke-animation.tsx
git commit -m "feat: rework smoke shader — visibility, corners, text zone, mouse drama, reveal"
```

---

### Task 3: Add reveal prop and animation to SmokeBackground

**Files:**
- Modify: `src/components/ui/spooky-smoke-animation.tsx`

- [ ] **Step 1: Add reveal to SmokeBackgroundProps interface**

Replace:
```typescript
interface SmokeBackgroundProps {
  smokeColor?: string
}
```
With:
```typescript
interface SmokeBackgroundProps {
  smokeColor?: string
  reveal?: boolean
}
```

- [ ] **Step 2: Add reveal to component destructuring**

Replace:
```typescript
export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({
  smokeColor = '#D00000',
}) => {
```
With:
```typescript
export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({
  smokeColor = '#D00000',
  reveal = false,
}) => {
```

- [ ] **Step 3: Call updateTextZone inside the setup useEffect**

Inside the main setup `useEffect`, directly after `rendererRef.current = renderer`, add:

```typescript
renderer.updateTextZone(0.5, 0.5, 0.32)
```

- [ ] **Step 4: Add reveal animation useEffect**

After the existing `useEffect` for `smokeColor`, add a new effect:

```typescript
useEffect(() => {
  if (!reveal) return
  const renderer = rendererRef.current
  if (!renderer) return

  const startTime = performance.now()
  const duration = 1200
  let rafId: number

  const animate = (now: number) => {
    const t = Math.min((now - startTime) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
    renderer.updateReveal(eased)
    if (t < 1) {
      rafId = requestAnimationFrame(animate)
    }
  }
  rafId = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(rafId)
}, [reveal])
```

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/spooky-smoke-animation.tsx
git commit -m "feat: add reveal prop to SmokeBackground with 1200ms ease-out animation"
```

---

### Task 4: Wire HeroSection and verify visually

**Files:**
- Modify: `src/components/hero-section.tsx`

- [ ] **Step 1: Pass reveal prop to SmokeBackground**

Replace:
```tsx
<SmokeBackground smokeColor="#D00000" />
```
With:
```tsx
<SmokeBackground smokeColor="#D00000" reveal={isLoaded} />
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Start dev server and verify visually**

Run: `npm run dev`

Open `http://localhost:3000` and check:
- On page load: smoke fills a large portion of the screen (wide, soft)
- Over ~1.2s: smoke retreats and concentrates tightly at all 4 corners
- Center is clear — name visually "splits" the smoke
- Moving mouse across hero: large, dramatic parting effect follows cursor
- Smoke is clearly visible (red, dense) against the parchment background

- [ ] **Step 4: Commit**

```bash
git add src/components/hero-section.tsx
git commit -m "feat: wire reveal prop in HeroSection to drive smoke cinematic"
```
