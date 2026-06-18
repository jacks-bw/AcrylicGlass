[English](./README_EN.md)

# AcrylicGlass

Apple Vision Pro 风格的亚克力玻璃效果组件，通过 SVG 滤镜对背景做鱼眼镜头膨胀 / 液态水波纹扭曲，叠加多层高光与阴影，呈现出玻璃的厚实感与通透感。

## 特性

- **鱼眼放大镜** 与 **液态水波纹** 两种扭曲模式
- 色散折射（红/蓝边缘分离），模拟棱镜效果
- 可调节的高光强度、模糊程度、边缘亮线
- 深色 / 浅色模式自适应
- 自定义背景色，支持半透明
- 鼠标拖拽移动
- 纯 CSS + SVG 实现，无额外依赖

## 文件说明

| 文件 | 适用框架 | 说明 |
|------|----------|------|
| `AcrylicGlass.jsx` | React 18+ | 使用自增计数器替代 useId，兼容性好 |
| `AcrylicGlass-next.jsx` | Next.js 13+ App Router | `'use client'` 客户端组件 |
| `AcrylicGlass.vue` | Vue 3.x（SPA） | 自增计数器版本，无需 Nuxt |
| `AcrylicGlass-nuxt.vue` | Vue 3.5+ / Nuxt | 使用 `useId` 生成唯一滤镜 ID |

## 快速开始

### React

```jsx
import AcrylicGlass from './AcrylicGlass'

<AcrylicGlass borderRadius="20px" paddingX="16px" paddingY="12px">
  <p>任意子组件内容</p>
</AcrylicGlass>
```

### Vue

```vue
<script setup>
import AcrylicGlass from './AcrylicGlass.vue'
</script>

<template>
  <AcrylicGlass border-radius="20px" padding-x="16px" padding-y="12px">
    <p>任意子组件内容</p>
  </AcrylicGlass>
</template>
```

## Props

### 基础尺寸

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `width` | `string` | `'100%'` | 组件宽度 |
| `height` | `string` | `'auto'` | 组件高度 |
| `borderRadius` | `string` | `'26px'` | 边框圆角（如 `'50%'` 可做圆形） |
| `paddingX` | `string` | `'0'` | 内容区水平内边距 |
| `paddingY` | `string` | `'0'` | 内容区垂直内边距 |

### 玻璃效果

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | `'fisheye' \| 'liquid'` | `'fisheye'` | 扭曲模式 |
| `distort` | `number` | `30` | 扭曲强度，`0` 关闭 |
| `blur` | `string` | `'2px'` | 背景模糊程度 |
| `gloss` | `number` | `0.5` | 表面高光强度（0~1） |
| `refract` | `number` | `0` | 色散折射强度（0~1） |
| `sharp` | `boolean` | `false` | 是否显示边缘亮线 |
| `dark` | `boolean` | `true` | 深色 / 浅色模式 |
| `bgColor` | `string` | — | 自定义背景色 |
| `draggable` | `boolean` | `false` | 是否允许拖拽移动 |

## 浏览器兼容性

需要浏览器支持 `backdrop-filter` 与 SVG `<filter>`，Chrome / Edge 完整支持。

## License

[Mozilla Public License 2.0](./LICENSE) — 允许商用。基于本项目的文件若被修改，修改后的文件必须继续以 MPL-2.0 开源并保留原始版权声明；项目中的其他文件不受限制，可闭源。
