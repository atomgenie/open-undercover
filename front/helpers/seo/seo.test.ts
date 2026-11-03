import { describe, expect, test } from "bun:test"
import { readFileSync } from "fs"
import { join } from "path"

import { WORDS } from "helpers/words"
import {
    OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_TITLE,
    SITE_URL,
    absoluteUrl,
    buildStructuredData,
    isIndexable,
    serializeJsonLd,
} from "./seo"

const readPublic = (file: string) =>
    readFileSync(join(import.meta.dir, "../../public", file))

describe("metadata", () => {
    test("site URL is an https origin without trailing slash", () => {
        expect(SITE_URL).toStartWith("https://")
        expect(new URL(SITE_URL).origin).toBe(SITE_URL)
    })

    test("title fits in a search result", () => {
        expect(SITE_TITLE.length).toBeLessThanOrEqual(60)
    })

    test("description fits in a search result snippet", () => {
        expect(SITE_DESCRIPTION.length).toBeGreaterThanOrEqual(50)
        expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160)
    })

    test("description does not overstate the number of word pairs", () => {
        const claimed = Number(SITE_DESCRIPTION.match(/(\d+)\+ word pairs/)?.[1])
        expect(WORDS.length).toBeGreaterThanOrEqual(claimed)
    })
})

describe("absoluteUrl", () => {
    test("resolves paths against the site URL", () => {
        expect(absoluteUrl()).toBe(`${SITE_URL}/`)
        expect(absoluteUrl("/og-image.png")).toBe(`${SITE_URL}/og-image.png`)
        expect(absoluteUrl("og-image.png")).toBe(`${SITE_URL}/og-image.png`)
    })
})

describe("isIndexable", () => {
    test("hides Vercel previews from search engines", () => {
        expect(isIndexable("preview")).toBe(false)
    })

    test("indexes production and non-Vercel deployments", () => {
        expect(isIndexable("production")).toBe(true)
        expect(isIndexable(undefined)).toBe(true)
    })
})

describe("structured data", () => {
    test("describes the site and the game with absolute URLs", () => {
        const data = buildStructuredData()
        expect(data["@context"]).toBe("https://schema.org")
        const [site, app] = data["@graph"]
        expect(site["@type"]).toBe("WebSite")
        expect(site.url).toBe(`${SITE_URL}/`)
        expect(app.url).toBe(`${SITE_URL}/`)
        expect(app.image).toBe(`${SITE_URL}${OG_IMAGE.path}`)
    })

    test("serializes to JSON that cannot close its script tag", () => {
        const json = serializeJsonLd({ text: "</script><script>alert(1)</script>" })
        expect(json).not.toContain("<")
        expect(JSON.parse(json).text).toBe("</script><script>alert(1)</script>")
    })
})

describe("static SEO files", () => {
    test("robots.txt points to the sitemap on the site URL", () => {
        expect(readPublic("robots.txt").toString()).toContain(
            `Sitemap: ${SITE_URL}/sitemap.xml`,
        )
    })

    test("sitemap.xml lists the home page on the site URL", () => {
        expect(readPublic("sitemap.xml").toString()).toContain(`<loc>${SITE_URL}/</loc>`)
    })

    test("social preview image is a PNG of the declared size", () => {
        const png = readPublic(OG_IMAGE.path.slice(1))
        expect(png.subarray(1, 4).toString()).toBe("PNG")
        expect(png.readUInt32BE(16)).toBe(OG_IMAGE.width)
        expect(png.readUInt32BE(20)).toBe(OG_IMAGE.height)
    })
})
