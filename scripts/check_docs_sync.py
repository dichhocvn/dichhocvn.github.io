#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def latest_mtime(paths: list[Path]) -> float:
    times = [p.stat().st_mtime for p in paths if p.exists()]
    return max(times) if times else 0.0


def collect_files(base: Path, patterns: list[str]) -> list[Path]:
    out: list[Path] = []
    for pat in patterns:
        out.extend(base.glob(pat))
    return [p for p in out if p.is_file()]


def main() -> int:
    checks = [
        (
            "core-js-readme",
            collect_files(ROOT / "src/js/core", ["*.js"]),
            ROOT / "src/js/core/README.md",
        ),
        (
            "render-js-readme",
            collect_files(ROOT / "src/js/render", ["*.js"]),
            ROOT / "src/js/render/README.md",
        ),
        (
            "features-js-readme",
            collect_files(ROOT / "src/js/features", ["*.js"]),
            ROOT / "src/js/features/README.md",
        ),
        (
            "rules-js-readme",
            collect_files(ROOT / "src/js/rules", ["*.js"]),
            ROOT / "src/js/rules/README.md",
        ),
        (
            "rules-txt-readme",
            collect_files(ROOT / "src/rules", ["*.txt"]),
            ROOT / "src/rules/README.md",
        ),
        (
            "css-readme",
            collect_files(ROOT / "src/css", ["*.css"]),
            ROOT / "src/css/README.md",
        ),
        (
            "root-guides",
            collect_files(ROOT, ["src/**/*.js", "src/**/*.css", "src/rules/*.txt"]),
            ROOT / "ARCHITECTURE.md",
        ),
        (
            "claude-guide",
            collect_files(ROOT, ["src/**/*.js", "src/**/*.css", "src/rules/*.txt"]),
            ROOT / "CLAUDE.md",
        ),
    ]

    stale: list[str] = []
    for name, source_files, doc_file in checks:
        if not source_files or not doc_file.exists():
            continue
        src_time = latest_mtime(source_files)
        doc_time = doc_file.stat().st_mtime
        if doc_time < src_time:
            stale.append(f"- {name}: `{doc_file}` cũ hơn code liên quan")

    if stale:
        print("Docs chưa đồng bộ với code:")
        print("\n".join(stale))
        print("\nHãy cập nhật README/guide trước khi kết thúc thay đổi.")
        return 1

    print("Docs sync OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
