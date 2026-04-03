# Charcoal Smoke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the WebGL smoke fragment shader so it looks hand-drawn — charcoal on paper — with more smoke density in corners.

**Architecture:** All changes are inside the `fragmentShaderSource` string in `spooky-smoke-animation.tsx`. Two independent edits: (1) bump corner/alpha numbers, (2) replace the single `alpha=smoothstep(...)` line with posterized bands + anisotropic scratch + grain.

**Tech Stack:** WebGL2 GLSL ES 3.0, React, TypeScript

---

## Files

| Action | Path |
|--------|------|
| Modify | `src/components/ui/spooky-smoke-animation.tsx` |

---

### Task 1: Update corner params and alpha multiplier

**Files:**
- Modify: `src/components/ui/spooky-smoke-animation.tsx`

Three number changes inside `fragmentShaderSource`. No logic change — just tuning the final revealed state to push more smoke into corners.

- [ ] **Step 1: Open the file and locate the corner mask block**

In `src/components/ui/spooky-smoke-animation.tsx`, find this block inside `fragmentShaderSource` (around line 65):

```glsl
  float cornerRadius=mix(0.4,2.4,u_reveal);
  float cornerPower=mix(0.8,2.8,u_reveal);
```

And the final output line (around line 76):

```glsl
  O=vec4(u_color,clamp(alpha*1.5,0.0,1.0));
```

- [ ] **Step 2: Update cornerRadius end value**

Change:
```glsl
  float cornerRadius=mix(0.4,2.4,u_reveal);
```
To:
```glsl
  float cornerRadius=mix(0.4,2.8,u_reveal);
```

- [ ] **Step 3: Update cornerPower end value**

Change:
```glsl
  float cornerPower=mix(0.8,2.8,u_reveal);
```
To:
```glsl
  float cornerPower=mix(0.8,4.0,u_reveal);
```

- [ ] **Step 4: Update alpha multiplier**

Change:
```glsl
  O=vec4(u_color,clamp(alpha*1.5,0.0,1.0));
```
To:
```glsl
  O=vec4(u_color,clamp(alpha*2.2,0.0,1.0));
```

- [ ] **Step 5: Visual check**

Run `npm run dev` and open the hero section. The smoke corners should be noticeably denser and extend slightly further from each corner compared to before. The overall shape should look the same — just more smoke.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/spooky-smoke-animation.tsx
git commit -m "feat: increase corner smoke density and alpha"
```

---

### Task 2: Add charcoal texture — posterize, scratch, grain

**Files:**
- Modify: `src/components/ui/spooky-smoke-animation.tsx`

Replace the single smooth alpha line with posterized bands + anisotropic scratch texture + body grain. This is the entire hand-drawn feel.

- [ ] **Step 1: Locate the line to replace**

In `fragmentShaderSource`, find this single line (immediately after the `density` computation):

```glsl
  // Lower threshold — more smoke regions pass through
  float alpha=smoothstep(0.52,1.1,density);
```

- [ ] **Step 2: Replace it with the charcoal computation**

Replace the comment + that one line with:

```glsl
  // Charcoal: posterize density into 3 bands, scratch at edges, grain throughout
  float bandCount=3.0;
  float bandT=density*bandCount;
  float band=floor(bandT)/bandCount;
  float alpha=smoothstep(0.52,1.1,band);

  // Anisotropic scratch — stretched diagonally to simulate charcoal stroke direction
  vec2 scratchUV=vec2(uv.x*1.6-uv.y*0.5,uv.y*0.4+uv.x*0.2)*38.0;
  float scratch=noise(scratchUV+vec2(T*0.008,0.0));

  // Band-edge roughness: fract(bandT) approaches 0 at band boundaries
  float edgeFrac=fract(bandT);
  float atEdge=1.0-smoothstep(0.0,0.18,edgeFrac)*smoothstep(1.0,0.82,edgeFrac);
  alpha*=mix(1.0,scratch,0.3+atEdge*0.5);

  // Body grain — gentle medium-freq roughness throughout
  float grain=noise(uv*18.0+vec2(0.0,T*0.01));
  alpha*=mix(0.88,1.0,grain);
```

- [ ] **Step 3: Verify the full alpha pipeline is intact**

After your replacement, the alpha variable flows through the rest of main() unchanged. Confirm the block order still reads:

1. `density` computation (RGB fbm average) — unchanged
2. Your new charcoal block (sets and modifies `alpha`)
3. Corner mask (`alpha*=cornerMask`) — unchanged
4. Mouse kill (`alpha*=(1.0-mouseEffect*0.97)`) — unchanged
5. Text suppression (`alpha*=(1.0-textEffect*0.8)`) — unchanged
6. Output (`O=vec4(u_color,clamp(alpha*2.2,0.0,1.0))`) — from Task 1

- [ ] **Step 4: Visual check**

With the dev server running, open the hero. Look for:
- Distinct layering in the smoke body — not a smooth gradient, visible banding
- Scratchy/rough edges where smoke density bands meet — not a clean line
- The smoke should look like it was drawn with charcoal, not rendered

If the smoke disappears entirely, the posterize step is quantizing density to 0 — reduce `bandCount` to `2.0` as a fallback.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/spooky-smoke-animation.tsx
git commit -m "feat: charcoal smoke — posterized bands, scratch texture, body grain"
```
