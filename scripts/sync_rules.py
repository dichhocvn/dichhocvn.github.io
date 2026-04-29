#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RULES_DIR = ROOT / "src" / "rules"
OUT_FILE = ROOT / "src" / "js" / "rules" / "rules-data.js"

FILE_TO_KEY = {
    "menh.txt": "menh",
    "phu-mau.txt": "phu mau",
    "phuc-duc.txt": "phuc duc",
    "dien-trach.txt": "dien trach",
    "quan-loc.txt": "quan loc",
    "no-boc.txt": "no boc",
    "thien-di.txt": "thien di",
    "tat-ach.txt": "tat ach",
    "tai-bach.txt": "tai bach",
    "tu-tuc.txt": "tu tuc",
    "phu-the.txt": "phu the",
    "huynh-de.txt": "huynh de",
}


def to_template_literal(text: str) -> str:
    return text.replace("\\", "\\\\").replace("`", "\\`")


def main() -> None:
    lines = ["const TUVI_RULES_TEXT_BY_CUNG = {"]
    for file_name, key in FILE_TO_KEY.items():
        p = RULES_DIR / file_name
        raw = p.read_text(encoding="utf-8") if p.exists() else ""
        val = to_template_literal(raw.rstrip())
        lines.append(f"  {key!r}: `{val}`,")
    lines.append("};")
    lines.append("")
    OUT_FILE.write_text("\n".join(lines), encoding="utf-8")
    print(f"Synced rules -> {OUT_FILE}")


if __name__ == "__main__":
    main()
