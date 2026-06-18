[中文文档](./README_CN.md)

# AcrylicGlass

An Apple Vision Pro style acrylic glass effect component. Uses SVG filters to apply fisheye lens expansion or liquid ripple distortion to the background, layered with highlights and shadows for a thick, translucent glass look.

## Features

- **Fisheye lens** and **liquid ripple** distortion modes
- Chromatic dispersion refraction (red/blue edge separation), simulating a prism effect
- Adjustable gloss intensity, blur, and edge sharpness
- Dark / light mode support
- Custom background color with alpha transparency
- Mouse drag to move
- Pure CSS + SVG, no extra dependencies

## Files

| File | Framework | Notes |
|------|-----------|-------|
| `AcrylicGlass.jsx` | React 18+ | Uses incrementing counter instead of `useId` for broad compatibility |
| `AcrylicGlass-next.jsx` | Next.js 13+ App Router | `'use client'` client component |
| `AcrylicGlass.vue` | Vue 3.x (SPA) | Counter-based version, no Nuxt required |
| `AcrylicGlass-nuxt.vue` | Vue 3.5+ / Nuxt | Uses `useId` for unique filter IDs |

## Quick Start

### React

```jsx
import AcrylicGlass from './AcrylicGlass'

<AcrylicGlass borderRadius="20px" paddingX="16px" paddingY="12px">
  <p>Any child content</p>
</AcrylicGlass>
```

### Vue

```vue
<script setup>
import AcrylicGlass from './AcrylicGlass.vue'
</script>

<template>
  <AcrylicGlass border-radius="20px" padding-x="16px" padding-y="12px">
    <p>Any child content</p>
  </AcrylicGlass>
</template>
```

## Props

### Dimensions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `'100%'` | Component width |
| `height` | `string` | `'auto'` | Component height |
| `borderRadius` | `string` | `'26px'` | Border radius (e.g. `'50%'` for a circle) |
| `paddingX` | `string` | `'0'` | Horizontal inner padding |
| `paddingY` | `string` | `'0'` | Vertical inner padding |

### Glass Effect

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'fisheye' \| 'liquid'` | `'fisheye'` | Distortion mode |
| `distort` | `number` | `30` | Distortion strength, `0` to disable |
| `blur` | `string` | `'2px'` | Background blur amount |
| `gloss` | `number` | `0.5` | Surface gloss intensity (0–1) |
| `refract` | `number` | `0` | Chromatic refraction strength (0–1) |
| `sharp` | `boolean` | `false` | Show edge highlight line |
| `dark` | `boolean` | `true` | Dark / light mode |
| `bgColor` | `string` | — | Custom background color (supports alpha, e.g. `'rgba(255,0,0,0.2)'`) |
| `draggable` | `boolean` | `false` | Enable mouse drag to move |

## Browser Support

Requires `backdrop-filter` and SVG `<filter>` support. Fully supported in Chrome and Edge.

## License

[Mozilla Public License 2.0](./LICENSE) — Commercial use allowed. Modified MPL-licensed files must remain under MPL-2.0 with the original copyright notice retained; all other files in your project are not affected and can remain proprietary.
