import sharp from 'sharp'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tentsDir = join(__dirname, '..', 'public', 'tents')

// SVG watermark — OUTORA text bottom-left, subtle
function makeWatermarkSvg(width, height) {
  const fontSize = Math.round(width * 0.028)
  const padding = Math.round(width * 0.025)
  const letterSpacing = Math.round(fontSize * 0.4)
  const textWidth = fontSize * 6 + letterSpacing * 5
  const barH = Math.round(fontSize * 2.2)
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Dark bar behind text -->
      <rect x="${padding}" y="${height - padding - barH}" width="${textWidth + padding}" height="${barH}" fill="rgba(0,0,0,0.45)" rx="0"/>
      <!-- OUTORA text -->
      <text
        x="${padding + Math.round(textWidth/2 + padding/2)}"
        y="${height - padding - Math.round(barH * 0.28)}"
        font-family="Georgia, serif"
        font-size="${fontSize}"
        letter-spacing="${letterSpacing}"
        fill="#C4954A"
        text-anchor="middle"
        font-weight="300"
      >OUTORA</text>
      <!-- Thin gold underline -->
      <line
        x1="${padding}"
        y1="${height - padding - barH}"
        x2="${padding + textWidth + padding}"
        y2="${height - padding - barH}"
        stroke="#C4954A"
        stroke-width="1"
        opacity="0.6"
      />
    </svg>
  `)
}

const slugs = await readdir(tentsDir)

for (const slug of slugs) {
  const heroPath = join(tentsDir, slug, 'hero.png')
  const outPath  = join(tentsDir, slug, 'hero-branded.png')

  try {
    const meta = await sharp(heroPath).metadata()
    const { width, height } = meta

    const watermark = makeWatermarkSvg(width, height)

    await sharp(heroPath)
      .composite([{ input: watermark, top: 0, left: 0 }])
      .png({ quality: 95 })
      .toFile(outPath)

    console.log(`✓ ${slug}  (${width}×${height})`)
  } catch (e) {
    console.log(`✗ ${slug}: ${e.message}`)
  }
}

console.log('\nDone.')
