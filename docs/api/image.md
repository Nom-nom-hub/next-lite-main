# Image API

The Next-Lite Image component provides optimized image loading and rendering.

## Components

### `<Image>`

The `Image` component is used to display optimized images.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | (required) | The source URL of the image |
| `alt` | `string` | (required) | Alternative text for the image |
| `width` | `number` | `undefined` | The width of the image in pixels |
| `height` | `number` | `undefined` | The height of the image in pixels |
| `layout` | `'fixed' \| 'responsive' \| 'fill'` | `'responsive'` | The layout mode of the image |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | How the image should be resized to fit its container |
| `quality` | `number` | `75` | The quality of the optimized image (1-100) |
| `priority` | `boolean` | `false` | Whether to prioritize loading this image |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | The loading behavior of the image |
| `onLoad` | `() => void` | `undefined` | Callback when the image is loaded |
| `onError` | `() => void` | `undefined` | Callback when the image fails to load |
| `className` | `string` | `''` | Additional CSS class for the image container |

#### Example

```tsx
import { Image } from 'next-lite/image';

function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      <Image
        src="/profile.jpg"
        alt="Profile picture"
        width={500}
        height={300}
        layout="responsive"
        objectFit="cover"
        quality={80}
        priority
      />
    </div>
  );
}
```

## Layout Modes

### Fixed

The image will be rendered with the exact dimensions specified:

```tsx
<Image
  src="/profile.jpg"
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
  src="/profile.jpg"
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
    src="/profile.jpg"
    alt="Profile picture"
    layout="fill"
    objectFit="cover"
  />
</div>
```

## Configuration

You can configure the Image component in your `next-lite.config.js` file:

```js
module.exports = {
  images: {
    // Domains to allow for external images
    domains: ['example.com', 'images.unsplash.com'],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for responsive images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Image formats to support
    formats: ['image/webp'],
    
    // Minimum cache TTL in seconds
    minimumCacheTTL: 60,
    
    // Whether to allow SVG images
    dangerouslyAllowSVG: false,
  },
};
```

## Functions

### `getOptimizedImageUrl`

Generates an optimized image URL.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `src` | `string` | The source URL of the image |
| `options` | `ImageOptions` | Options for the optimized image |

#### Returns

| Type | Description |
|------|-------------|
| `string` | The optimized image URL |

#### Example

```tsx
import { getOptimizedImageUrl } from 'next-lite/image';

const optimizedUrl = getOptimizedImageUrl('/profile.jpg', {
  width: 500,
  height: 300,
  quality: 80,
});
```

## Types

### `ImageProps`

Props for the `Image` component.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | `string` | (required) | The source URL of the image |
| `alt` | `string` | (required) | Alternative text for the image |
| `width` | `number` | `undefined` | The width of the image in pixels |
| `height` | `number` | `undefined` | The height of the image in pixels |
| `layout` | `'fixed' \| 'responsive' \| 'fill'` | `'responsive'` | The layout mode of the image |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | How the image should be resized to fit its container |
| `quality` | `number` | `75` | The quality of the optimized image (1-100) |
| `priority` | `boolean` | `false` | Whether to prioritize loading this image |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | The loading behavior of the image |
| `onLoad` | `() => void` | `undefined` | Callback when the image is loaded |
| `onError` | `() => void` | `undefined` | Callback when the image fails to load |
| `className` | `string` | `''` | Additional CSS class for the image container |

### `ImageOptions`

Options for the `getOptimizedImageUrl` function.

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number \| undefined` | The width of the image in pixels |
| `height` | `number \| undefined` | The height of the image in pixels |
| `quality` | `number` | The quality of the optimized image (1-100) |
