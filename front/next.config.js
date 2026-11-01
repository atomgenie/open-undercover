/** @type {import('next').NextConfig} */
module.exports = {
    webpack: (config, { dev }) => {
        // Tailwind CSS v4 output can be served stale from webpack's persistent
        // cache (e.g. Vercel restores .next/cache from another branch), shipping
        // an outdated stylesheet. Production builds are fast, so skip the cache.
        if (!dev) {
            config.cache = false
        }
        return config
    },
}
