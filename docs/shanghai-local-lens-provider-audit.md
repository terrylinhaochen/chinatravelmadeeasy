# Shanghai Local Lens provider audit

Checked 2026-07-14 against the public source pages and publicly indexable AMap and Apple Maps records.

## Result

Only **one of the ten** Chinese-source treatment candidates currently meets the product's resolved-place threshold. Eight are probable and one is unresolved:

- 1 resolved place with persistent AMap and Apple identities;
- 4 probable places with incomplete or ambiguous provider agreement;
- 4 probable route segments whose source-defined endpoints still need provider review;
- 1 unresolved street recommendation with no usable endpoints.

This is a product finding, not just a data-cleaning problem. Local-language recommendations frequently describe a walk, street section, entrance, or sequence. Forcing every recommendation into one pin would discard the local knowledge the product is meant to preserve.

## One rubric for every candidate

`kind` and `state` are evaluated separately.

- **Place:** a venue or attraction expected to have a provider identity.
- **Route:** a bounded segment with a start and end; it should become a route handoff rather than a midpoint pin.
- **Street:** an unbounded recommendation that remains editorial context until endpoints are chosen.

Resolution states:

- **Resolved:** exact place, city and reviewed address agree, and both a persistent AMap POI ID and Apple Place ID are present.
- **Probable:** the source grounds the entity or route, but provider agreement is incomplete, ambiguous, or still search-based.
- **Unresolved:** the recommendation lacks enough spatial identity to produce a safe place or route handoff.

Only a resolved `place` is eligible for automatic save. Probable and unresolved records remain visible for correction and research, but must not silently enter a map collection.

## Candidate review

| Candidate | Kind | Provider evidence | State | Product action |
| --- | --- | --- | --- | --- |
| 衡山路（天平路—桃江路） | Route | [Shanghai BendiBao](https://sh.bendibao.com/tour/20231120/279779.shtm) defines two endpoints; persistent intersection identities not reviewed. | Probable | Show start and end searches plus an Apple walking-route handoff; do not invent a midpoint pin. |
| 霍山路 | Street | [Shanghai BendiBao](https://sh.bendibao.com/tour/20231120/279779.shtm) names the street but provides no bounded segment. | Unresolved | Keep as editorial context and request endpoints before map save. |
| 愚园路（定西路—乌鲁木齐北路） | Route | [Shanghai BendiBao](https://sh.bendibao.com/tour/20231120/279779.shtm) defines two endpoints; persistent intersection identities not reviewed. | Probable | Treat as a route preview, not a place. |
| 康平路（华山路—高安路） | Route | [Shanghai BendiBao](https://sh.bendibao.com/tour/20231120/279779.shtm) defines two endpoints; persistent intersection identities not reviewed. | Probable | Treat as a route preview, not a place. |
| 思南路（淮海中路—建国中路） | Route | [Shanghai BendiBao](https://sh.bendibao.com/tour/20231120/279779.shtm) defines two endpoints; persistent intersection identities not reviewed. | Probable | Treat as a route preview, not a place. |
| 杨树浦驿站秦皇岛路码头党群服务站 | Place | A current [Yangpu government route](https://www.shyp.gov.cn/shypq/myyp/20250307/475615.html) places the service station near the display hall. AMap exposes [黄浦码头旧址 `B00156R4QY`](https://www.amap.com/place/B00156R4QY) and adjacent [秦皇岛路游船码头 `B00156O685`](https://www.amap.com/place/B00156O685), both around 秦皇岛路32号, but not an unambiguous service-station POI. | Probable | Show both AMap alternatives and require the traveler or reviewer to choose the intended anchor. |
| 绿之丘 | Place | Yangpu government gives [杨树浦路1500号](https://www.shyp.gov.cn/shypq/xwzx-bmdt/20231007/438359.html). Apple exposes [Place ID `H2710I3F9268ED09EE6`](https://maps.apple.com/place?_provider=57879&place-id=H2710I3F9268ED09EE6). A persistent AMap POI was not confirmed. | Probable | Open the Apple place directly and keep AMap as a reviewed search handoff. |
| 皂梦空间 | Place | Yangpu government gives [平定路1号](https://www.shyp.gov.cn/shypq/ggfw-bmgg/20220104/400267.html). Persistent AMap and Apple identities were not confirmed in the public-web audit. | Probable | Preserve the official address, but require provider review before saving. |
| 杨树浦电厂遗迹公园 | Place | Yangpu government gives [杨树浦路2800号](https://www.shyp.gov.cn/shypq/xwzx-bmdt/20230920/437151.html) and describes the entrance near 腾越路. Persistent AMap and Apple identities were not confirmed in the public-web audit. | Probable | Keep the address and entrance context visible; require provider review. |
| 复兴岛公园 | Place | AMap [POI `B00154DQQ7`](https://www.amap.com/place/B00154DQQ7) and Apple [Place ID `H2710I3F80D8CC0908F`](https://maps.apple.com/place?_provider=57879&place-id=H2710I3F80D8CC0908F) agree on 复兴岛公园 at 共青路386号. | Resolved | Eligible for direct AMap/Apple handoff and automatic save. |

## UX consequence

The reveal now makes the distinction visible:

- resolved places open direct provider records and are labeled safe to save;
- probable places open the confirmed provider when available, otherwise a search, and remain preview-only;
- route segments expose their two endpoints and an Apple walking-route handoff;
- ambiguous provider matches expose the alternates rather than choosing silently;
- unresolved streets explicitly say what must be supplied before they become map-ready.

This is stricter than the earlier UI, which gave every candidate visually equivalent AMap and Apple search links. Searchability is not identity resolution.

## Limits and next verification

- Public search indexing does not prove what a signed-in traveler sees inside AMap, Dianping, or Xiaohongshu.
- AMap and Apple use different identifiers and coordinate systems; the audit does not infer one provider's identity from another provider's coordinates.
- The four route segments still require start/end identity review inside both map providers.
- The probable places need direct AMap/Apple confirmation or a correction from a person familiar with the venue.
- Opening a correct provider record is not yet evidence that a traveler saved, reopened, routed to, or visited it.

The next provider gate is eight reviewed route endpoints, the Qinhuangdao anchor choice, and persistent AMap/Apple identities for Green Hill, Soap Dream Space, and the power-plant park. Only then can the study test the full discovery-to-map chain rather than recommendation preference alone.
