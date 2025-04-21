# Image Optimization in Next-Lite

Next-Lite includes an optimized Image component similar to Next.js's Image component, providing automatic image optimization and improved performance.

## Getting Started

Import the Image component from the Next-Lite framework:

```tsx
import { Image } from 'next-lite-framework/components';
```

## Basic Usage

```tsx
<Image
  src="/images/profile.jpg"
  alt="Profile picture"
  width={500}
  height={300}
/>
```

## Props

The Image component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | (required) | The source URL of the image |
| alt | string | (required) | Alternative text for the image |
| width | number | undefined | The width of the image in pixels |
| height | number | undefined | The height of the image in pixels |
| layout | 'fixed' \| 'responsive' \| 'fill' | 'responsive' | The layout mode of the image |
| objectFit | 'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down' | 'cover' | How the image should be resized to fit its container |
| quality | number | 75 | The quality of the optimized image (1-100) |
| priority | boolean | false | Whether to prioritize loading this image |
| loading | 'lazy' \| 'eager' | 'lazy' | The loading behavior of the image |
| onLoad | function | undefined | Callback when the image is loaded |
| onError | function | undefined | Callback when the image fails to load |
| className | string | '' | Additional CSS class for the image container |

## Layout Modes

### Fixed

The image will be rendered with the exact dimensions specified:

```tsx
<Image
  src="/images/profile.jpg"
  alt="Profile picture"
  width={500}
  height={300}
  layout="fixed"
/>
```

### Responsive

The image will scale to fit its container while maintaining its aspect ratio:

```tsx
<Image
  src="/images/profile.jpg"
  alt="Profile picture"
  width={1600}
  height={900}
  layout="responsive"
/>
```

### Fill

The image will stretch to fill its container:

```tsx
<div style={{ position: 'relative', width: '100%', height: '300px' }}>
  <Image
    src="/images/profile.jpg"
    alt="Profile picture"
    layout="fill"
    objectFit="cover"
  />
</div>
```

## Priority Images

For important images (like hero images), use the `priority` prop to preload the image:

```tsx
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
/>
```

## Image Optimization

Next-Lite automatically optimizes images by:

1. Serving images in modern formats (WebP, AVIF) when supported
2. Resizing images to the requested dimensions
3. Lazy loading images by default
4. Providing a placeholder during loading
5. Optimizing quality to reduce file size

## External Images

To use external images, the source domain must be configured in your `next-lite.config.js` file:

```js
// next-lite.config.js
module.exports = {
  images: {
    domains: ['example.com', 'images.unsplash.com'],
  },
}
```

Then you can use external images:

```tsx
<Image
  src="https://images.unsplash.com/photo-1234567890"
  alt="Unsplash image"
  width={800}
  height={600}
/>
```

## Responsive Images with Art Direction

For responsive images with different sources based on screen size:

```tsx
<div className="hero-container">
  {/* Mobile image */}
  <div className="mobile-only">
    <Image
      src="/images/hero-mobile.jpg"
      alt="Hero"
      width={640}
      height={640}
      layout="responsive"
    />
  </div>
  
  {/* Desktop image */}
  <div className="desktop-only">
    <Image
      src="/images/hero-desktop.jpg"
      alt="Hero"
      width={1920}
      height={1080}
      layout="responsive"
    />
  </div>
</div>
```

With CSS:

```css
.mobile-only {
  display: block;
}

.desktop-only {
  display: none;
}

@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
  
  .desktop-only {
    display: block;
  }
}
```
