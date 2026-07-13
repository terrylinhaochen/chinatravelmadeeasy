#!/usr/bin/env python3
"""Static SEO and AI-search audit for the generated Astro site.

The checks intentionally mirror the useful, portable parts of the public
claude-seo framework: crawlability, indexability, schema, on-page metadata,
image accessibility, and AI-search citability signals. It audits built HTML in
dist/ so failures reflect what crawlers and answer engines can actually read.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


SITE = "https://chinatravelmadeeasy.com"
SKIP_FILES = {"googleb65d715d2e0cbcd7.html"}
MIN_WORDS = {
    "home": 500,
    "guide": 900,
    "listing": 250,
    "answer_listing": 100,
    "curated_tool": 40,
    "region": 450,
    "tool": 250,
    "utility": 80,
    "profile": 80,
    "video_detail": 100,
    "place_detail": 100,
}
QUESTION_RE = re.compile(r"\b(who|what|when|where|why|how|can|do|does|should|is|are|will)\b|[?]", re.I)


@dataclass
class PageData:
    title: str = ""
    meta_description: str = ""
    meta_robots: str = ""
    canonical: str = ""
    og: dict[str, str] = field(default_factory=dict)
    twitter: dict[str, str] = field(default_factory=dict)
    alternates: list[dict[str, str]] = field(default_factory=list)
    headings: dict[str, list[str]] = field(default_factory=lambda: {"h1": [], "h2": [], "h3": []})
    images: list[dict[str, str]] = field(default_factory=list)
    links: list[dict[str, str]] = field(default_factory=list)
    schema_raw: list[str] = field(default_factory=list)
    text_parts: list[str] = field(default_factory=list)
    refresh_redirect: bool = False


class SEOParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.data = PageData()
        self._tag_stack: list[str] = []
        self._capture_schema = False
        self._schema_buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs_raw: list[tuple[str, str | None]]) -> None:
        attrs = {k.lower(): (v or "") for k, v in attrs_raw}
        self._tag_stack.append(tag)

        if tag == "meta":
            name = attrs.get("name", "").lower()
            prop = attrs.get("property", "").lower()
            content = attrs.get("content", "")
            http_equiv = attrs.get("http-equiv", "").lower()
            if name == "description":
                self.data.meta_description = content
            elif name == "robots":
                self.data.meta_robots = content
            elif name.startswith("twitter:"):
                self.data.twitter[name] = content
            if prop.startswith("og:"):
                self.data.og[prop] = content
            if http_equiv == "refresh":
                self.data.refresh_redirect = True

        elif tag == "link":
            rel = attrs.get("rel", "").lower()
            if rel == "canonical":
                self.data.canonical = attrs.get("href", "")
            elif rel == "alternate" and attrs.get("hreflang"):
                self.data.alternates.append({"hreflang": attrs.get("hreflang", ""), "href": attrs.get("href", "")})

        elif tag == "img":
            self.data.images.append({
                "src": attrs.get("src", ""),
                "alt": attrs.get("alt", ""),
                "loading": attrs.get("loading", ""),
            })

        elif tag == "a" and attrs.get("href"):
            self.data.links.append({"href": attrs.get("href", ""), "text": ""})

        elif tag == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self._capture_schema = True
            self._schema_buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._capture_schema:
            self.data.schema_raw.append("".join(self._schema_buffer).strip())
            self._capture_schema = False
            self._schema_buffer = []
        if self._tag_stack:
            self._tag_stack.pop()

    def handle_data(self, text: str) -> None:
        if self._capture_schema:
            self._schema_buffer.append(text)
            return
        current = self._tag_stack[-1] if self._tag_stack else ""
        clean = " ".join(text.split())
        if not clean:
            return
        if current == "title":
            self.data.title += clean
        elif current in self.data.headings:
            self.data.headings[current].append(clean)
        elif current not in {"script", "style", "nav", "footer", "header"}:
            self.data.text_parts.append(clean)
        if current == "a" and self.data.links:
            self.data.links[-1]["text"] = (self.data.links[-1]["text"] + " " + clean).strip()


def route_for_file(path: Path, dist: Path) -> str:
    rel = path.relative_to(dist)
    if rel.name == "index.html":
        route = "/" + str(rel.parent).replace("\\", "/")
        return "/" if route == "/." else route.rstrip("/") + "/"
    return "/" + str(rel).replace("\\", "/")


def page_kind(route: str) -> str:
    if route == "/":
        return "home"
    if route == "/profile/":
        return "profile"
    if route.startswith("/guides/") and route != "/guides/" and "/page/" not in route:
        return "guide"
    if route.startswith("/regions/") and route != "/regions/":
        return "region"
    if route.startswith("/videos/") and route != "/videos/":
        return "video_detail"
    if route.startswith("/places/"):
        return "place_detail"
    if route == "/curated/" or route.startswith("/curated/"):
        return "curated_tool"
    if route in {"/map-import/", "/content-seeds/", "/pulse/"}:
        return "tool"
    if route == "/404.html":
        return "utility"
    return "listing"


def parse_page(path: Path) -> PageData:
    parser = SEOParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser.data


def schema_items(raw_blocks: list[str]) -> tuple[list[dict], list[str]]:
    items: list[dict] = []
    errors: list[str] = []
    for raw in raw_blocks:
        if not raw:
            continue
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as exc:
            errors.append(str(exc))
            continue
        candidates = parsed if isinstance(parsed, list) else [parsed]
        for candidate in candidates:
            if isinstance(candidate, dict) and isinstance(candidate.get("@graph"), list):
                items.extend([entry for entry in candidate["@graph"] if isinstance(entry, dict)])
            elif isinstance(candidate, dict):
                items.append(candidate)
    return items, errors


def schema_types(items: list[dict]) -> set[str]:
    types: set[str] = set()
    for item in items:
        value = item.get("@type")
        if isinstance(value, list):
            types.update(str(v) for v in value)
        elif value:
            types.add(str(value))
    return types


def is_absolute_site_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and parsed.netloc == "chinatravelmadeeasy.com"


def audit_page(path: Path, dist: Path) -> dict:
    route = route_for_file(path, dist)
    data = parse_page(path)
    kind = page_kind(route)
    schemas, schema_errors = schema_items(data.schema_raw)
    types = schema_types(schemas)
    text = " ".join(data.text_parts)
    latin_words = re.findall(r"[A-Za-z0-9][A-Za-z0-9'%-]*", text)
    cjk_chars = re.findall(r"[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]", text)
    # Treat roughly two CJK characters as one English-token equivalent for
    # page-depth checks. This avoids false thin-content failures on localized
    # Korean/Japanese QA pages while still catching genuinely empty pages.
    word_count = len(latin_words) + (len(cjk_chars) // 2)
    issues: list[str] = []
    warnings: list[str] = []
    is_noindex = "noindex" in data.meta_robots.lower()

    if path.name in SKIP_FILES:
        return {"route": route, "kind": "skip", "issues": [], "warnings": [], "word_count": word_count}

    if data.refresh_redirect:
        if "noindex" not in data.meta_robots.lower():
            issues.append("Redirect page is missing noindex robots meta.")
        return {"route": route, "kind": "redirect", "issues": issues, "warnings": warnings, "word_count": word_count}

    if not data.title:
        issues.append("Missing title.")
    elif not (25 <= len(data.title) <= 75):
        warnings.append(f"Title length is {len(data.title)} characters.")

    if not data.meta_description:
        issues.append("Missing meta description.")
    elif not (70 <= len(data.meta_description) <= 180):
        warnings.append(f"Meta description length is {len(data.meta_description)} characters.")

    if not data.canonical:
        issues.append("Missing canonical.")
    elif not is_absolute_site_url(data.canonical):
        issues.append(f"Canonical is not an absolute site URL: {data.canonical}")

    expected = f"{SITE}{route}"
    if route != "/404.html" and data.canonical and data.canonical != expected:
        warnings.append(f"Canonical differs from generated route: {data.canonical} != {expected}")

    if len(data.headings["h1"]) != 1:
        issues.append(f"Expected exactly one H1, found {len(data.headings['h1'])}.")

    if data.og.get("og:title") != data.title:
        warnings.append("Open Graph title does not match title.")
    for prop in ["og:description", "og:url", "og:image"]:
        if not data.og.get(prop):
            issues.append(f"Missing {prop}.")
    for prop in ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]:
        if not data.twitter.get(prop):
            issues.append(f"Missing {prop}.")

    if schema_errors:
        issues.append(f"Invalid JSON-LD: {'; '.join(schema_errors[:2])}")
    if not is_noindex and not schemas:
        issues.append("Missing JSON-LD structured data.")
    if "Dataset" in types:
        warnings.append("Dataset schema detected; use ItemList/DataCatalog-style schema for AI-search support instead of retired rich-result type.")

    required_schema = {
        "home": {"WebSite", "FAQPage"},
        "guide": {"Article", "BreadcrumbList"},
        "region": {"CollectionPage", "FAQPage"},
        "listing": {"CollectionPage", "WebPage", "FAQPage"},
        "curated_tool": {"CollectionPage", "ItemList"},
        "tool": {"WebPage", "FAQPage", "ItemList"},
        "profile": {"ProfilePage"},
        "video_detail": {"VideoObject"},
        "place_detail": {"Place"},
    }.get(kind, set())
    if not is_noindex and required_schema and not (types & required_schema):
        issues.append(f"Missing expected schema type for {kind}: one of {sorted(required_schema)}.")

    min_word_key = "answer_listing" if re.fullmatch(r"/(answers|ko/answers|ja/answers)(/page/\d+)?/", route) else kind
    min_words = MIN_WORDS[min_word_key]
    if not is_noindex and word_count < min_words:
        issues.append(f"Thin content for {kind}: {word_count} words < {min_words}.")

    for img in data.images:
        if img["src"] and not img["alt"].strip():
            issues.append(f"Image missing alt text: {img['src']}")
    if not is_noindex and kind in {"listing", "guide", "region", "home"} and not data.images:
        warnings.append("No image detected on content page.")

    internal_links = [link for link in data.links if link["href"].startswith("/") or "chinatravelmadeeasy.com" in link["href"]]
    if route != "/404.html" and len(internal_links) < 3:
        warnings.append(f"Low internal link count: {len(internal_links)}")

    question_headings = [h for level in ("h1", "h2", "h3") for h in data.headings[level] if QUESTION_RE.search(h)]
    has_faq = "FAQPage" in types
    if not is_noindex and kind in {"guide", "region", "listing", "tool"} and not (question_headings or has_faq):
        warnings.append("No question-style heading or FAQ schema found for AI-search citability.")

    if route in {"/ko/answers/", "/ja/answers/", "/answers/"}:
        langs = {alt["hreflang"] for alt in data.alternates}
        if not {"en", "ko", "ja", "x-default"}.issubset(langs):
            issues.append("Localized answer page missing full hreflang set.")

    return {
        "route": route,
        "kind": kind,
        "title": data.title,
        "word_count": word_count,
        "schema_types": sorted(types),
        "issues": issues,
        "warnings": warnings,
    }


def site_level_checks(dist: Path) -> list[str]:
    issues: list[str] = []
    if not (dist / "robots.txt").exists():
        issues.append("Missing robots.txt in dist.")
    elif "Sitemap:" not in (dist / "robots.txt").read_text(encoding="utf-8"):
        issues.append("robots.txt does not reference a sitemap.")
    if not (dist / "sitemap-index.xml").exists():
        issues.append("Missing sitemap-index.xml in dist.")
    llms = dist / "llms.txt"
    if not llms.exists():
        issues.append("Missing llms.txt in dist.")
    else:
        llms_text = llms.read_text(encoding="utf-8")
        for required in ["/guides/", "/answers/", "/regions/", "/map-import/"]:
            if required not in llms_text:
                issues.append(f"llms.txt missing {required}.")
    return issues


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist", default="dist", help="Built Astro output directory.")
    parser.add_argument("--json", action="store_true", help="Print machine-readable report.")
    args = parser.parse_args()

    dist = Path(args.dist)
    if not dist.exists():
        print(f"Missing dist directory: {dist}", file=sys.stderr)
        return 2

    pages = [audit_page(path, dist) for path in sorted(dist.rglob("*.html"))]
    site_issues = site_level_checks(dist)
    issue_pages = [page for page in pages if page["issues"]]
    warning_pages = [page for page in pages if page["warnings"]]
    report = {
        "summary": {
            "pages_checked": len([p for p in pages if p["kind"] != "skip"]),
            "pages_with_issues": len(issue_pages),
            "pages_with_warnings": len(warning_pages),
            "site_issues": site_issues,
        },
        "pages": pages,
    }

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"Checked {report['summary']['pages_checked']} generated HTML pages.")
        if site_issues:
            print("Site issues:")
            for issue in site_issues:
                print(f"  - {issue}")
        if issue_pages:
            print("Page issues:")
            for page in issue_pages:
                for issue in page["issues"]:
                    print(f"  - {page['route']}: {issue}")
        if warning_pages:
            print("Warnings:")
            for page in warning_pages[:40]:
                for warning in page["warnings"][:4]:
                    print(f"  - {page['route']}: {warning}")
            extra = sum(len(page["warnings"]) for page in warning_pages[40:])
            if extra:
                print(f"  ... {extra} more warnings")

    return 1 if site_issues or issue_pages else 0


if __name__ == "__main__":
    raise SystemExit(main())
