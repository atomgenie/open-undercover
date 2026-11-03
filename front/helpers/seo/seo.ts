// Single source of truth for search-engine and social-preview metadata.
// `public/robots.txt` and `public/sitemap.xml` are static files that repeat SITE_URL;
// `seo.test.ts` fails if they drift apart.

export const SITE_URL = "https://undercover.tamtanguy.com"

export const SITE_NAME = "Open Undercover"

// Shown as the search result title: keep it under ~60 characters
export const SITE_TITLE = "Open Undercover – Free Undercover Party Game Online"

// Shown as the search result snippet: keep it between 50 and 160 characters
export const SITE_DESCRIPTION =
    "Play Undercover, the free word party game of bluff and deduction, on one phone. 3+ players, 400+ word pairs in English, French and Spanish."

export const SITE_KEYWORDS = [
    "undercover",
    "undercover game",
    "Mr. White",
    "party game",
    "word game",
    "social deduction game",
    "who is the spy",
    "jeu undercover",
]

// Social preview image (1200×630), relative to `public/`
export const OG_IMAGE = {
    path: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "Open Undercover: the party game of words, bluff and betrayal",
}

export const THEME_COLOR = "#7c3aed"

// Languages the word pairs are available in (the UI itself is English)
export const CONTENT_LANGUAGES = ["en", "fr", "es"]

/** Builds an absolute URL on the production site, e.g. `/og-image.png`. */
export const absoluteUrl = (path = "/"): string =>
    new URL(path, `${SITE_URL}/`).toString()

/**
 * Whether search engines may index this deployment. Vercel preview deployments
 * (`NEXT_PUBLIC_VERCEL_ENV=preview`) must not compete with the production site.
 */
export const isIndexable = (vercelEnv: string | undefined): boolean =>
    vercelEnv !== "preview"

/** schema.org structured data for the home page, rendered as JSON-LD. */
export const buildStructuredData = () => ({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            url: absoluteUrl("/"),
            name: SITE_NAME,
            alternateName: "Undercover",
            description: SITE_DESCRIPTION,
            inLanguage: "en",
        },
        {
            "@type": ["WebApplication", "VideoGame"],
            "@id": absoluteUrl("/#app"),
            url: absoluteUrl("/"),
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            image: absoluteUrl(OG_IMAGE.path),
            applicationCategory: "GameApplication",
            genre: ["Party game", "Word game", "Social deduction"],
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
            inLanguage: CONTENT_LANGUAGES,
            isAccessibleForFree: true,
            numberOfPlayers: { "@type": "QuantitativeValue", minValue: 3 },
            playMode: "MultiPlayer",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            isPartOf: { "@id": absoluteUrl("/#website") },
        },
    ],
})

/**
 * Serializes JSON-LD for an inline `<script>` tag. Escaping `<` keeps a stray
 * `</script>` in the data from closing the tag early.
 */
export const serializeJsonLd = (data: unknown): string =>
    JSON.stringify(data).replace(/</g, "\\u003c")
