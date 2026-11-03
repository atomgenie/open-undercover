import Head from "next/head"
import {
    OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_NAME,
    SITE_TITLE,
    absoluteUrl,
    buildStructuredData,
    isIndexable,
    serializeJsonLd,
} from "helpers/seo"

// Tags carry a `key` so next/head deduplicates them if a page ever overrides one
export const Seo: React.FC = () => {
    const url = absoluteUrl("/")
    const image = absoluteUrl(OG_IMAGE.path)

    return (
        <Head>
            <title key="title">{SITE_TITLE}</title>
            <meta key="description" name="description" content={SITE_DESCRIPTION} />
            <meta key="keywords" name="keywords" content={SITE_KEYWORDS.join(", ")} />
            <meta
                key="robots"
                name="robots"
                content={
                    isIndexable(process.env.NEXT_PUBLIC_VERCEL_ENV)
                        ? "index, follow, max-image-preview:large"
                        : "noindex, nofollow"
                }
            />
            <link key="canonical" rel="canonical" href={url} />

            <meta key="og:type" property="og:type" content="website" />
            <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
            <meta key="og:title" property="og:title" content={SITE_TITLE} />
            <meta
                key="og:description"
                property="og:description"
                content={SITE_DESCRIPTION}
            />
            <meta key="og:url" property="og:url" content={url} />
            <meta key="og:locale" property="og:locale" content="en_US" />
            <meta key="og:image" property="og:image" content={image} />
            <meta key="og:image:type" property="og:image:type" content="image/png" />
            <meta
                key="og:image:width"
                property="og:image:width"
                content={String(OG_IMAGE.width)}
            />
            <meta
                key="og:image:height"
                property="og:image:height"
                content={String(OG_IMAGE.height)}
            />
            <meta key="og:image:alt" property="og:image:alt" content={OG_IMAGE.alt} />

            <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta key="twitter:title" name="twitter:title" content={SITE_TITLE} />
            <meta
                key="twitter:description"
                name="twitter:description"
                content={SITE_DESCRIPTION}
            />
            <meta key="twitter:image" name="twitter:image" content={image} />
            <meta
                key="twitter:image:alt"
                name="twitter:image:alt"
                content={OG_IMAGE.alt}
            />

            <script
                key="ld-json"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: serializeJsonLd(buildStructuredData()),
                }}
            />
        </Head>
    )
}
