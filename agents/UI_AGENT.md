# UI Agent — Tạo và Sửa React Components

## Context

Game Minh Chủ — Reigns-style, lịch sử Việt Nam.
Stack: Next.js 15 (App Router) + React 19 + Tailwind CSS v3 + Framer Motion v11.

**QUAN TRỌNG:** Mọi component có hooks hoặc event handlers PHẢI có `'use client'` ở dòng đầu tiên.

## Palette Màu (Tailwind Custom Tokens)

```css
bg-tran-bg         /* #1A0F0A — nền tối cổ kính */
bg-tran-card       /* #2D1F1A — nền thẻ bài */
text-tran-text     /* #F5E6D0 — chữ kem nhạt */
text-tran-secondary /* #D4A017 — vàng đế vương */
text-tran-textMuted /* #A08070 — chữ mờ */
text-tran-primary  /* #8B1A1A — đỏ trầm */
border-tran-border /* #5A3020 — viền */
```

## Stats Colors

```
binhLuc    → #C0392B (đỏ thẫm)
danTam     → #27AE60 (xanh lá)
quocKho    → #F39C12 (vàng)
trieuCuong → #8E44AD (tím)
```

## Font

```
font-serif  → 'Noto Serif' — tiêu đề, tên, quote
font-sans   → 'Be Vietnam Pro' — body text
```

## Component Conventions

```jsx
// Import order
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../../context/GameContext'

// Luôn mobile-first, max-w-sm
// Không dùng px fixed width — dùng %/flex/grid
// Touch targets tối thiểu 44px
```

## Animation Patterns

```jsx
// Card entrance (quan trọng nhất)
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{ type: 'spring', damping: 20 }}
>

// Slide up from bottom (popups)
<motion.div
  initial={{ y: 80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ type: 'spring', damping: 25 }}
>

// Fade in (screens)
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
>
```

## Game State Access

```jsx
import { useGame } from '../../context/GameContext'

const { state, dispatch } = useGame()

// Actions
dispatch({ type: 'START_GAME' })
dispatch({ type: 'CHOOSE', choiceId: 'choice_a' })
dispatch({ type: 'DISMISS_FACT' })
dispatch({ type: 'RESTART' })
```

## Layout GameScreen (Reference)

```
┌─────────────────────────────┐  max-w-sm
│  ⚔️ ████░  👥 █████░  │  StatsBar (grid 2x2)
│  💰 ███░░  📜 ████░  │
├─────────────────────────────┤
│                             │
│    [Portrait — 64px]        │  CharacterPortrait
│  "Năm 1257 — quote..."      │  CardDisplay
│  Bối cảnh sự kiện...        │
│                             │
├─────────────────────────────┤
│         Năm 1257            │  YearDisplay
│  ┌─────────────────────┐   │
│  │ Lựa chọn A          │   │  ChoiceButton
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ Lựa chọn B          │   │  ChoiceButton
│  └─────────────────────┘   │
└─────────────────────────────┘
```

## File Paths

```
src/components/
  screens/HomeScreen.jsx
  screens/GameScreen.jsx
  screens/GameOverScreen.jsx
  screens/SuKyScreen.jsx
  game/CardDisplay.jsx
  game/ChoiceButton.jsx
  game/StatsBar.jsx
  game/CharacterPortrait.jsx
  game/YearDisplay.jsx
  ui/FactPopup.jsx
  ui/EndingCard.jsx
  ui/SuKyCard.jsx
src/context/GameContext.jsx
src/constants/gameConfig.js
src/constants/theme.js
```

## Prompt Template

```
Tạo/sửa component [TênComponent] cho game Minh Chủ.
File: src/components/[path]/[Component].jsx

Yêu cầu:
- [mô tả chi tiết behavior]
- Mobile-first, max-w-sm
- Theme: nền tối #1A0F0A, text kem #F5E6D0, accent vàng #D4A017

State cần dùng:
- state.[field] để đọc
- dispatch({ type: '...' }) để cập nhật
```
