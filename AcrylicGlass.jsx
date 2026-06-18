import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react'

/**
 * AcrylicGlass - 亚克力玻璃效果组件 (React Hooks 版)
 *
 * 复刻 Apple Vision Pro 风格的亚克力玻璃材质——通过 SVG 滤镜对背景图做
 * 鱼眼镜头膨胀，叠加多层高光与阴影，呈现出玻璃的厚实感与通透感。
 *
 * ---
 * 依赖要求
 *   - React 18+（使用 useId 生成唯一滤镜 ID）
 *   - 浏览器需支持 backdrop-filter 与 SVG filter（Chrome/Edge 完整支持）
 *
 * ---
 * 快速开始
 *   <AcrylicGlass borderRadius="20px" paddingX="16px" paddingY="12px">
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
 *   mode          ?: 'fisheye' | 'liquid' = 'fisheye'  扭曲模式：fisheye=鱼眼镜头, liquid=液态水波纹
 *   distort       ?: number   = 30        扭曲强度，0 关闭，越大越强
 *   blur          ?: string   = '2px'     背景模糊程度（CSS blur() 值，如 '4px'）
 *   gloss         ?: number   = 0.5       表面高光强度，0~1
 *   refract       ?: number   = 0         色散折射强度，0~1，模拟棱镜边缘红/蓝分离
 *   sharp         ?: boolean  = false     是否显示边缘亮线
 *   dark          ?: boolean  = true      深色 / 浅色模式
 *   bgColor       ?: string               自定义背景色（覆盖 dark/light 的默认底衬），支持半透明如 'rgba(255,0,0,0.2)'
 *   draggable     ?: boolean  = false     是否允许鼠标拖拽移动
 */

let idCounter = 0
function genId() {
  return `acrylic-glass-${++idCounter}`
}

export default function AcrylicGlass({
  width = '100%',
  height = 'auto',
  borderRadius = '26px',
  paddingX = '0',
  paddingY = '0',
  blur = '2px',
  mode = 'fisheye',
  distort = 30,
  gloss = 0.5,
  refract = 0,
  dark = true,
  sharp = false,
  bgColor,
  draggable = false,
  children,
}) {
  // 自增 ID，避免 useId 在 SSR/CSR 不一致问题
  const filterId = useRef(genId()).current
  const liquidFilterId = useRef(genId()).current

  // 拖拽状态
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const startRef = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    if (!draggable) return
    setDragging(true)
    startRef.current = {
      x: e.clientX - dragPos.x,
      y: e.clientY - dragPos.y,
    }
  }, [draggable, dragPos])

  useEffect(() => {
    if (!dragging) return

    const onMove = (e) => {
      setDragPos({
        x: e.clientX - startRef.current.x,
        y: e.clientY - startRef.current.y,
      })
    }
    const onUp = () => setDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  const wrapperStyle = useMemo(() => ({
    width,
    height,
    ...(draggable ? {
      transform: `translate(${dragPos.x}px, ${dragPos.y}px)`,
      position: 'absolute',
      zIndex: 100,
    } : {}),
  }), [width, height, draggable, dragPos])

  const outerStyle = useMemo(() => ({
    borderRadius,
    backdropFilter: `url(#${mode === 'liquid' ? liquidFilterId : filterId}) blur(${blur})`,
    WebkitBackdropFilter: `url(#${mode === 'liquid' ? liquidFilterId : filterId}) blur(${blur})`,
  }), [borderRadius, mode, liquidFilterId, filterId, blur])

  const coverStyle = useMemo(() => ({
    borderRadius,
    ...(bgColor ? { background: bgColor } : {}),
  }), [borderRadius, bgColor])

  const glossStyle = useMemo(() => ({ borderRadius, opacity: gloss }), [borderRadius, gloss])
  const refractStyle = useMemo(() => ({ borderRadius, opacity: refract }), [borderRadius, refract])
  const reflectStyle = useMemo(() => ({ borderRadius }), [borderRadius])
  const sharpStyle = useMemo(() => ({ borderRadius }), [borderRadius])
  const contentStyle = useMemo(() => ({ padding: `${paddingY} ${paddingX}` }), [paddingY, paddingX])

  let wrapperClass = 'acrylic-glass-wrapper'
  if (dark) wrapperClass += ' dark'
  if (draggable) wrapperClass += ' draggable'
  if (dragging) wrapperClass += ' dragging'

  return (
    <>
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.002" numOctaves="1" seed="1" result="noiseR" />
            <feTurbulence type="fractalNoise" baseFrequency="0.002" numOctaves="1" seed="42" result="noiseG" />
            <feColorMatrix in="noiseR" type="matrix" result="rChan"
              values="1 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0" />
            <feColorMatrix in="noiseG" type="matrix" result="gChan"
              values="0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0" />
            <feComposite in="rChan" in2="gChan" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="displaceMap" />
            <feGaussianBlur in="displaceMap" stdDeviation="20" result="lensCurve" />
            <feDisplacementMap in="SourceGraphic" in2="lensCurve" scale={distort} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={liquidFilterId} x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={distort} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className={wrapperClass} style={wrapperStyle} onMouseDown={onMouseDown}>
        <div className="acrylic-glass-outer" style={outerStyle} />
        <div
          className={'acrylic-glass-cover' + (!dark && !bgColor ? ' light' : '')}
          style={coverStyle}
        />
        <div className="acrylic-glass-gloss" style={glossStyle} />
        <div className="acrylic-glass-refraction" style={refractStyle} />
        <div className="acrylic-glass-reflect" style={reflectStyle} />
        {sharp && <div className="acrylic-glass-sharp" style={sharpStyle} />}
        <div className="acrylic-glass-content" style={contentStyle}>
          {children}
        </div>
      </div>

      <style>{`
        .acrylic-glass-wrapper {
          position: relative;
          display: flex;
          overflow: hidden;
        }
        .acrylic-glass-wrapper.draggable {
          cursor: grab;
          user-select: none;
        }
        .acrylic-glass-wrapper.dragging {
          cursor: grabbing;
        }
        .acrylic-glass-outer {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .acrylic-glass-cover {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: rgba(0, 0, 0, 0.12);
        }
        .acrylic-glass-cover.light {
          background: rgba(255, 255, 255, 0.55);
        }
        .acrylic-glass-gloss {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 30%, transparent 50%);
          pointer-events: none;
        }
        .acrylic-glass-refraction {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          box-shadow:
            inset 2px 1px 3px -1px rgba(255,60,60,0.5),
            inset 4px 2px 8px -3px rgba(255,100,40,0.35),
            inset -2px -1px 3px -1px rgba(40,140,255,0.5),
            inset -4px -2px 8px -3px rgba(40,200,255,0.35),
            inset 0 0 36px 0 rgba(60,80,255,0.12),
            inset 0 0 36px 0 rgba(255,80,40,0.08);
        }
        .acrylic-glass-reflect {
          position: absolute;
          inset: 1px;
          z-index: 4;
          box-shadow:
            inset 2px 2px 6px 2px rgba(255,255,255,0.2),
            inset -2px -2px 4px -1px rgba(255,255,255,0.2);
          pointer-events: none;
        }
        .acrylic-glass-sharp {
          position: absolute;
          inset: 0;
          z-index: 5;
          box-shadow:
            inset 1px 1px 0px 0px rgba(255,255,255,0.5),
            inset -1px -1px 0px 0px rgba(255,255,255,0.6);
          pointer-events: none;
        }
        .acrylic-glass-content {
          position: relative;
          z-index: 6;
          display: flex;
          width: 100%;
          align-items: center;
        }
        .acrylic-glass-wrapper:not(.dark) .acrylic-glass-gloss {
          background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 30%, transparent 50%);
        }
        .acrylic-glass-wrapper:not(.dark) .acrylic-glass-sharp {
          box-shadow:
            inset 1px 1px 0px 0px rgba(255,255,255,0.7),
            inset -1px -1px 0px 0px rgba(0,0,0,0.08);
        }
        .acrylic-glass-wrapper:not(.dark) .acrylic-glass-reflect {
          box-shadow:
            inset 2px 2px 6px 2px rgba(255,255,255,0.4),
            inset -2px -2px 4px -1px rgba(0,0,0,0.06);
        }
      `}</style>
    </>
  )
}
