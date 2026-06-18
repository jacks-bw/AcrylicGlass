<script setup lang="ts">
/**
 * AcrylicGlass - 亚克力玻璃效果组件
 *
 * 复刻 Apple Vision Pro 风格的亚克力玻璃材质——通过 SVG 滤镜对背景图做
 * 鱼眼镜头膨胀，叠加多层高光与阴影，呈现出玻璃的厚实感与通透感。
 *
 * ---
 * 依赖要求
 *   - Vue 3.5+（需 useId，若低于 3.5 请自行提供唯一 ID）
 *   - 浏览器需支持 backdrop-filter 与 SVG filter（Chrome/Edge 完整支持）
 *
 * ---
 * 快速开始
 *   <AcrylicGlass border-radius="20px" padding-x="16px" padding-y="12px">
 *     <p>任意子组件内容</p>
 *   </AcrylicGlass>
 *
 * ---
 * Props 一览
 *
 * 基础尺寸
 *   width         ?: string   = '100%'    组件宽度（CSS 值）
 *   height        ?: string   = 'auto'    组件高度（CSS 值）
 *   borderRadius  ?: string   = '26px'    边框圆角（CSS 值，如 '50%' 可做圆形）
 *   paddingX      ?: string   = '0'       内容区水平内边距
 *   paddingY      ?: string   = '0'       内容区垂直内边距
 *
 * 玻璃效果
 *   mode          ?: 'fisheye' | 'liquid' = 'fisheye'  扭曲模式：fisheye=鱼眼放大镜, liquid=液态水波纹
 *   distort       ?: number   = 30        扭曲强度，0 关闭，越大越强
 *   blur          ?: string   = '2px'     背景模糊程度（CSS blur() 值，如 '4px'）
 *   gloss         ?: number   = 0.5       表面高光强度，0~1
 *   refract       ?: number   = 0         色散折射强度，0~1，模拟棱镜边缘红/蓝分离
 *   sharp         ?: boolean  = false     是否显示边缘亮线
 *   dark          ?: boolean  = true      深色 / 浅色模式
 *   bgColor       ?: string               自定义背景色（覆盖 dark/light 的默认底衬），支持半透明如 'rgba(255,0,0,0.2)'
 *   draggable     ?: boolean  = false     是否允许鼠标拖拽移动
 *
 * ---
 * 组合示例
 *
 *   基础深色玻璃
 *     <AcrylicGlass border-radius="16px" padding-x="12px" padding-y="8px">
 *       <span style="color:#fff">Hello</span>
 *     </AcrylicGlass>
 *
 *   浅色玻璃
 *     <AcrylicGlass :dark="false" border-radius="16px" padding-x="12px" padding-y="8px">
 *       <span style="color:#333">Hello</span>
 *     </AcrylicGlass>
 *
 *   强鱼眼 + 色散
 *     <AcrylicGlass :distort="50" :refract="0.4" border-radius="20px">
 *       <p style="color:#fff">放大镜效果更强</p>
 *     </AcrylicGlass>
 *
 *   液态水波纹风格
 *     <AcrylicGlass mode="liquid" :distort="60" border-radius="20px">
 *       <p style="color:#fff">原始的波纹扭曲</p>
 *     </AcrylicGlass>
 *
 *   纯毛玻璃（无扭曲无折射）
 *     <AcrylicGlass :distort="0" blur="6px" border-radius="20px">
 *       <p style="color:#fff">简洁毛玻璃</p>
 *     </AcrylicGlass>
 *
 *   自定义背景色
 *     <AcrylicGlass bg-color="rgba(30, 130, 220, 0.25)" border-radius="20px">
 *       <p style="color:#fff">蓝色调玻璃</p>
 *     </AcrylicGlass>
 *
 *   可拖拽玻璃
 *     <AcrylicGlass draggable width="200px" border-radius="20px">
 *       <p style="color:#fff">拖拽我</p>
 *     </AcrylicGlass>
 */

import { useId, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 组件宽度，CSS 值 */
    width?: string
    /** 组件高度，CSS 值 */
    height?: string
    /** 边框圆角，CSS 值 */
    borderRadius?: string
    /** 内容区水平内边距 */
    paddingX?: string
    /** 内容区垂直内边距 */
    paddingY?: string
    /** 背景模糊程度，CSS blur() 值 */
    blur?: string
    /** 扭曲模式：fisheye=鱼眼放大镜, liquid=液态水波纹 */
    mode?: 'fisheye' | 'liquid'
    /** 扭曲强度，0 关闭，越大越强 */
    distort?: number
    /** 表面高光强度，0-1 */
    gloss?: number
    /** 色散折射强度，0-1，模拟棱镜边缘色彩分离 */
    refract?: number
    /** 深色 / 浅色模式 */
    dark?: boolean
    /** 是否显示边缘亮线 */
    sharp?: boolean
    /** 自定义背景色，覆盖 dark/light 默认底衬，支持半透明 */
    bgColor?: string
    /** 是否允许鼠标拖拽移动 */
    draggable?: boolean
  }>(),
  {
    width: '100%',
    height: 'auto',
    borderRadius: '26px',
    paddingX: '0',
    paddingY: '0',
    blur: '2px',
    mode: 'fisheye' as const,
    distort: 30,
    gloss: 0.5,
    refract: 0,
    dark: true,
    sharp: false,
    draggable: false,
  },
)

const filterId = useId()
const liquidFilterId = useId()

// 拖拽状态
const dragX = ref(0)
const dragY = ref(0)
const dragging = ref(false)
let startX = 0, startY = 0

function onDragStart(e: MouseEvent) {
  if (!props.draggable) return
  dragging.value = true
  startX = e.clientX - dragX.value
  startY = e.clientY - dragY.value
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  if (!dragging.value) return
  dragX.value = e.clientX - startX
  dragY.value = e.clientY - startY
}

function onDragEnd() {
  dragging.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}
</script>

<template>
  <div>
    <!--
      SVG 滤镜定义区
      fisheye: feTurbulence(超低频噪声) → feGaussianBlur → feDisplacementMap → 膨胀放大
      liquid:  feTurbulence(噪声)  → feDisplacementMap(随机扭曲) → 水波纹
    -->
    <svg style="display: none" aria-hidden="true">
      <defs>
        <!--
          fisheye — 鱼眼放大镜：
          feTurbulence(超低频) → feGaussianBlur(极度平滑) → feDisplacementMap
          → 产生单一平滑球面位移 → 放大镜般的凸透镜效果
        -->
        <filter :id="filterId" x="-20%" y="-20%" width="140%" height="140%">
          <!--
            生成径向膨出的位移地图：
            两路超低频噪声(不同 seed) → 分别提取 R/G 通道 → 合成 → 高斯平滑
            → 产生类似球面的连续位移场 → 鱼眼放大镜效果
          -->
          <feTurbulence type="fractalNoise" baseFrequency="0.002" numOctaves="1" seed="1" result="noiseR" />
          <feTurbulence type="fractalNoise" baseFrequency="0.002" numOctaves="1" seed="42" result="noiseG" />
          <feColorMatrix in="noiseR" type="matrix" result="rChan"
            values="1 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0" />
          <feColorMatrix in="noiseG" type="matrix" result="gChan"
            values="0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0" />
          <feComposite in="rChan" in2="gChan" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="displaceMap" />
          <feGaussianBlur in="displaceMap" stdDeviation="20" result="lensCurve" />
          <feDisplacementMap in="SourceGraphic" in2="lensCurve" :scale="distort" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <!--
          liquid — 液态水波纹：
          feTurbulence 生成 Perlin 噪声 → feDisplacementMap 用噪声随机扭曲背景
          → 液态波纹感
        -->
        <filter :id="liquidFilterId" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" :scale="distort" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>

    <div
      class="acrylic-glass-wrapper"
      :class="{ dark, draggable: draggable, dragging }"
      :style="{ width, height, ...(draggable ? { transform: `translate(${dragX}px, ${dragY}px)`, position: 'absolute', zIndex: 100 } : {}) }"
      @mousedown="onDragStart"
    >
      <!-- 层 0：背景扭曲 + 高斯模糊 → 核心效果 -->
      <div
        class="acrylic-glass-outer"
        :style="{
          borderRadius,
          backdropFilter: `url(#${mode === 'liquid' ? liquidFilterId : filterId}) blur(${blur})`,
          WebkitBackdropFilter: `url(#${mode === 'liquid' ? liquidFilterId : filterId}) blur(${blur})`,
        }"
      />

      <!-- 层 1：底衬（bgColor 优先，否则按 dark/light 模式） -->
      <div
        class="acrylic-glass-cover"
        :style="{
          borderRadius,
          ...(bgColor ? { background: bgColor } : {}),
        }"
        :class="{ light: !dark && !bgColor }"
      />

      <!-- 层 2：斜向白色高光 → 玻璃反光感 -->
      <div class="acrylic-glass-gloss" :style="{ borderRadius, opacity: gloss }" />

      <!-- 层 3：棱镜色散 → 左上暖红、右下冷蓝 -->
      <div class="acrylic-glass-refraction" :style="{ borderRadius, opacity: refract }" />

      <!-- 层 4：内阴影 → 增强立体感 -->
      <div class="acrylic-glass-reflect" :style="{ borderRadius }" />

      <!-- 层 5：边缘亮线（可选） -->
      <div v-if="sharp" class="acrylic-glass-sharp" :style="{ borderRadius }" />

      <!-- 层 6：内容插槽 -->
      <div class="acrylic-glass-content" :style="{ padding: `${paddingY} ${paddingX}` }">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * 所有类名使用 scoped，不会污染宿主项目
 */

/* ---------- 容器 ---------- */
.acrylic-glass-wrapper {
  position: relative;
  display: flex;
  overflow: hidden;
}

/* 可拖拽模式 */
.acrylic-glass-wrapper.draggable {
  cursor: grab;
  user-select: none;
}
.acrylic-glass-wrapper.dragging {
  cursor: grabbing;
}

/* ---------- 层 0：背景扭曲 ---------- */
.acrylic-glass-outer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* ---------- 层 1：底衬 ---------- */
.acrylic-glass-cover {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.12); /* 深色默认；bgColor prop 或 .light 可覆盖 */
}

.acrylic-glass-cover.light {
  background: rgba(255, 255, 255, 0.55);
}

/* ---------- 层 2：斜向高光 ---------- */
.acrylic-glass-gloss {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.1) 30%,
    transparent 50%
  );
  pointer-events: none;
}

/* ---------- 层 3：色散折射 ---------- */
.acrylic-glass-refraction {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  box-shadow:
    /* 左上暖红边缘 */
    inset 2px 1px 3px -1px rgba(255, 60, 60, 0.5),
    inset 4px 2px 8px -3px rgba(255, 100, 40, 0.35),
    /* 右下冷蓝边缘 */
    inset -2px -1px 3px -1px rgba(40, 140, 255, 0.5),
    inset -4px -2px 8px -3px rgba(40, 200, 255, 0.35),
    /* 中间光晕 */
    inset 0 0 36px 0 rgba(60, 80, 255, 0.12),
    inset 0 0 36px 0 rgba(255, 80, 40, 0.08);
}

/* ---------- 层 4：内阴影 ---------- */
.acrylic-glass-reflect {
  position: absolute;
  inset: 1px;
  z-index: 4;
  box-shadow:
    inset 2px 2px 6px 2px rgba(255, 255, 255, 0.2),
    inset -2px -2px 4px -1px rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

/* ---------- 层 5：边缘亮线 ---------- */
.acrylic-glass-sharp {
  position: absolute;
  inset: 0;
  z-index: 5;
  box-shadow:
    inset 1px 1px 0px 0px rgba(255, 255, 255, 0.5),
    inset -1px -1px 0px 0px rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

/* ---------- 层 6：内容 ---------- */
.acrylic-glass-content {
  position: relative;
  z-index: 6;
  display: flex;
  width: 100%;
  align-items: center;
}

/* ========== 浅色模式 ========== */

.acrylic-glass-wrapper:not(.dark) .acrylic-glass-gloss {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 30%,
    transparent 50%
  );
}

.acrylic-glass-wrapper:not(.dark) .acrylic-glass-sharp {
  box-shadow:
    inset 1px 1px 0px 0px rgba(255, 255, 255, 0.7),
    inset -1px -1px 0px 0px rgba(0, 0, 0, 0.08);
}

.acrylic-glass-wrapper:not(.dark) .acrylic-glass-reflect {
  box-shadow:
    inset 2px 2px 6px 2px rgba(255, 255, 255, 0.4),
    inset -2px -2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
