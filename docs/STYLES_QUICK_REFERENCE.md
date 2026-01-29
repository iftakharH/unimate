# 🎨 Styles Quick Reference

A quick reference guide for common styling patterns in Unimate.

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-gold:    #e7b22f  /* Primary actions, CTAs */
--secondary-teal:  #5aa5a0  /* Hover states */
--text-primary:    #111111  /* Main text */
--text-secondary:  #6b7280  /* Muted text */
--border-light:    rgba(17, 17, 17, 0.08)
--border-strong:   rgba(17, 17, 17, 0.14)
```

### Usage Examples
- **CTA Buttons:** Gold (#e7b22f)
- **Hover Effects:** Teal (#5aa5a0)
- **Text:** Black (#111111)
- **Captions:** Gray (#6b7280)

---

## 📐 Spacing Scale

| Size | Value | Usage |
|------|-------|-------|
| xs   | 0.25rem | Tight spacing |
| sm   | 0.5rem | Small gaps |
| md   | 1rem | Default spacing |
| lg   | 1.5rem | Section spacing |
| xl   | 2rem | Large gaps |
| 2xl  | 3rem | Hero sections |

---

## 🔘 Border Radius

| Size | Value | Usage |
|------|-------|-------|
| Small | 6px | Buttons, inputs |
| Medium | 10px-12px | Cards, containers |
| Large | 14px-18px | Hero cards, modals |
| Round | 50% / 999px | Avatars, pills |

---

## 💫 Common Animations

### Button Hover
```css
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  transition: all 180ms ease;
}
```

### Card Lift
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.12);
}
```

### Border Highlight
```css
.element:hover {
  border-bottom: 2px solid #5aa5a0;
}
```

---

## 📱 Responsive Breakpoints

| Device | Width | Grid Columns |
|--------|-------|--------------|
| Desktop | >900px | 3-4 columns |
| Tablet | ≤900px | 2 columns |
| Mobile | ≤560px | 1 column |
| Small | ≤420px | Compact layout |

---

## 🎯 Component Patterns

### Button Styles

**Primary:**
```css
background: #e7b22f;
color: #fff;
padding: 8px 16px;
border-radius: 6px;
```

**Outline:**
```css
background: transparent;
border: 1px solid #3f3f3f;
```

**Icon:**
```css
background: transparent;
border-radius: 8px;
```

### Card Pattern
```css
background: #fff;
border: 1px solid rgba(17, 17, 17, 0.08);
border-radius: 18px;
box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
```

### Input Focus
```css
border-color: #3498db;
box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
outline: none;
```

---

## 📝 Naming Conventions

### BEM-like Structure
```
.block { }
.block__element { }
.block--modifier { }
```

### Common Prefixes
- `mp-*` → Marketplace
- `pro-*` → Profile
- `chat-*` → Chat
- `nav-*` → Navigation
- `auth-*` → Authentication

---

## ✨ Special Effects

### Glassmorphism
```css
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.82);
```

### Glow Effect
```css
.element::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, rgba(231, 178, 47, 0.35), ...);
  opacity: 0;
  filter: blur(10px);
}

.element:hover::before {
  opacity: 1;
}
```

---

## 🎓 File Organization

**Component Style:**
1. Create file: `src/styles/ComponentName.css`
2. Import: `import '../styles/ComponentName.css';`
3. Use prefix: `.component-name-*`

**Variables:**
```css
:root {
  --component-color: #value;
}
```

---

## 🚀 Quick Tips

1. **Use CSS Grid for layouts** (not floats or tables)
2. **Use Flexbox for alignment** (not margins)
3. **Use rem units** for sizing (not px)
4. **Use CSS variables** for colors (not hardcoded hex)
5. **Test all breakpoints** before committing

---

For detailed information, see [STYLES_DOCUMENTATION.md](../STYLES_DOCUMENTATION.md)
