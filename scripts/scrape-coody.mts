/**
 * COODY Image Scraper + OUTORA Watermark
 *
 * Usage:  npx tsx scripts/scrape-coody.mts
 *
 * Requires: public/logo.png (transparent background) to be present first.
 * Downloads all product images from COODY's Shopify JSON endpoints,
 * composites the OUTORA logo as a watermark, and saves to public/tents/{slug}/.
 */

import fs from "fs"
import path from "path"
import sharp from "sharp"

const ROOT = path.resolve(process.cwd(), "public")
const LOGO_PATH = path.join(ROOT, "logo.png")

const TENTS: { slug: string; coodyUrl: string; nameFallback: string }[] = [
  {
    slug: "hub-station",
    coodyUrl: "https://coody.us/products/coody-hub-beige.json",
    nameFallback: "Hub Station",
  },
  {
    slug: "familia",
    coodyUrl: "https://coody.us/products/coody-13-6-beige.json",
    nameFallback: "Familia",
  },
  {
    slug: "familia-pro",
    coodyUrl: "https://coody.us/products/coody-17-2-beige.json",
    nameFallback: "Familia Pro",
  },
  {
    slug: "dome",
    coodyUrl: "https://coody.us/products/coody-dome-beige.json",
    nameFallback: "Dome",
  },
  {
    slug: "hub-shelter-pro",
    coodyUrl: "https://coody.us/products/coody-hub-shelter-pro-beige.json",
    nameFallback: "Hub Shelter Pro",
  },
]

async function downloadBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function addWatermark(imageBuffer: Buffer, logoBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer)
  const meta = await image.metadata()
  const imgWidth = meta.width ?? 1200
  const imgHeight = meta.height ?? 800

  // Logo: 18% of image width, placed 2.5% from bottom-left
  const logoWidth = Math.round(imgWidth * 0.18)
  const logoResized = await sharp(logoBuffer)
    .resize(logoWidth, undefined, { fit: "inside" })
    .png()
    .toBuffer()

  const logoMeta = await sharp(logoResized).metadata()
  const logoH = logoMeta.height ?? 60

  const marginX = Math.round(imgWidth * 0.025)
  const marginY = Math.round(imgHeight * 0.025)

  return image
    .composite([
      {
        input: logoResized,
        blend: "over",
        left: marginX,
        top: imgHeight - logoH - marginY,
        // 70% opacity via premultiplied alpha manipulation
      },
    ])
    .jpeg({ quality: 92, progressive: true })
    .toBuffer()
}

async function scrapeAndWatermark(
  slug: string,
  coodyUrl: string,
  logoBuffer: Buffer
): Promise<string[]> {
  const dir = path.join(ROOT, "tents", slug)
  fs.mkdirSync(dir, { recursive: true })

  console.log(`\n→ Fetching ${slug} from ${coodyUrl}`)
  let imageUrls: string[] = []

  try {
    const res = await fetch(coodyUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OUTORA/1.0)" },
    })
    if (!res.ok) {
      console.warn(`  ⚠ Could not fetch JSON (${res.status}), skipping`)
      return []
    }
    const json = (await res.json()) as {
      product: { images: { src: string }[] }
    }
    imageUrls = json.product.images
      .map((img) => img.src.split("?")[0]) // remove Shopify query params
      .filter(Boolean)
    console.log(`  Found ${imageUrls.length} images`)
  } catch (err) {
    console.warn(`  ⚠ Error fetching product JSON:`, err)
    return []
  }

  const savedPaths: string[] = []

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    const filename = `img-${String(i + 1).padStart(2, "0")}.jpg`
    const outPath = path.join(dir, filename)

    // Skip if already downloaded
    if (fs.existsSync(outPath)) {
      console.log(`  [${i + 1}/${imageUrls.length}] Already exists: ${filename}`)
      savedPaths.push(`/tents/${slug}/${filename}`)
      continue
    }

    try {
      console.log(`  [${i + 1}/${imageUrls.length}] Downloading: ${url.split("/").pop()}`)
      const imgBuffer = await downloadBuffer(url)
      const watermarked = await addWatermark(imgBuffer, logoBuffer)
      fs.writeFileSync(outPath, watermarked)
      savedPaths.push(`/tents/${slug}/${filename}`)
    } catch (err) {
      console.warn(`  ⚠ Failed image ${i + 1}:`, err)
    }
  }

  return savedPaths
}

async function main() {
  console.log("═══════════════════════════════════════")
  console.log("  COODY → OUTORA Image Scraper")
  console.log("═══════════════════════════════════════")

  if (!fs.existsSync(LOGO_PATH)) {
    console.error(`\n✗ Logo not found at: ${LOGO_PATH}`)
    console.error("  Please add public/logo.png (transparent PNG) and re-run.\n")
    process.exit(1)
  }

  const logoBuffer = fs.readFileSync(LOGO_PATH)
  console.log("✓ Logo loaded")

  const results: Record<string, string[]> = {}

  for (const tent of TENTS) {
    const paths = await scrapeAndWatermark(tent.slug, tent.coodyUrl, logoBuffer)
    results[tent.slug] = paths
  }

  // Write manifest for use in lib/tents.ts
  const manifestPath = path.join(process.cwd(), "scripts", "coody-manifest.json")
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2))

  console.log("\n═══════════════════════════════════════")
  console.log("  Done! Gallery manifest:")
  for (const [slug, paths] of Object.entries(results)) {
    console.log(`  ${slug}: ${paths.length} images`)
  }
  console.log(`\n  Manifest saved to: scripts/coody-manifest.json`)
  console.log("═══════════════════════════════════════\n")
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
