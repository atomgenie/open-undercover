// PostToolUse hook: formats the file Claude just edited with the repo's Prettier config.
// Never blocks the agent: any failure is silently ignored.
import { existsSync } from "node:fs"
import { join, relative } from "node:path"

const FORMATTABLE = /\.(ts|tsx|js|jsx|mjs|cjs|css)$/

try {
    const input = await Bun.stdin.json()
    const filePath: string | undefined = input?.tool_input?.file_path
    const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
    const frontDir = join(projectDir, "front")
    const prettier = join(frontDir, "node_modules", ".bin", "prettier")

    const inFront = filePath && !relative(frontDir, filePath).startsWith("..")
    if (filePath && inFront && FORMATTABLE.test(filePath) && existsSync(prettier)) {
        Bun.spawnSync([prettier, "--write", "--ignore-unknown", filePath], {
            cwd: frontDir,
            stdout: "ignore",
            stderr: "ignore",
        })
    }
} catch {}
