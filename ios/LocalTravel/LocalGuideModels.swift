import Foundation
import CoreLocation

enum EvidenceGrade: String, CaseIterable, Identifiable {
    case residentDirect
    case localUseCorroborated
    case localUseProxy

    var id: String { rawValue }

    var label: String {
        switch self {
        case .residentDirect:
            "Direct resident testimony"
        case .localUseCorroborated:
            "Local-use signal"
        case .localUseProxy:
            "Community-program proxy"
        }
    }

    var shortLabel: String {
        switch self {
        case .residentDirect:
            "Resident"
        case .localUseCorroborated:
            "Corroborated"
        case .localUseProxy:
            "Proxy"
        }
    }
}

enum ResolutionState: String, CaseIterable, Identifiable {
    case resolved
    case probable
    case unresolved

    var id: String { rawValue }

    var label: String {
        switch self {
        case .resolved:
            "Map-ready"
        case .probable:
            "Needs provider check"
        case .unresolved:
            "Not saveable yet"
        }
    }

    var canAutoSave: Bool {
        self == .resolved
    }
}

struct LocalGuidePlace: Identifiable, Equatable {
    let id: String
    let englishName: String
    let localName: String
    let address: String
    let latitude: Double
    let longitude: Double
    let evidenceGrade: EvidenceGrade
    let resolutionState: ResolutionState
    let localUse: String
    let evidence: String
    let travelerContext: String
    let amapURL: URL?
    let appleMapsURL: URL?

    var coordinate: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }
}

struct LocalSourceNote: Identifiable, Equatable {
    let id: String
    let platform: String
    let title: String
    let originalLanguage: String
    let localSignal: String
    let candidatePlaceIDs: [String]
    let retrievedAt: String
}

struct LocalGuide: Identifiable, Equatable {
    let id: String
    let title: String
    let city: String
    let neighborhood: String
    let checkedAt: String
    let intent: String
    let summary: String
    let methodNote: String
    let sourceNotes: [LocalSourceNote]
    let places: [LocalGuidePlace]

    var resolvedPlaces: [LocalGuidePlace] {
        places.filter { $0.resolutionState == .resolved }
    }
}

enum LocalGuideFixtures {
    static let yangpu = LocalGuide(
        id: "local-lens-yangpu-everyday-weekend",
        title: "What Yangpu residents use on a slow day",
        city: "Shanghai",
        neighborhood: "Yangpu",
        checkedAt: "2026-07-17",
        intent: "Find public places with evidence of ordinary local use, then keep the resident signal, practical context, and map confidence attached.",
        summary: "Four Yangpu public spaces surfaced through Chinese-language resident reporting and local public sources. Direct testimony, community-use evidence, and provider confidence remain separate so local never becomes an unsupported label.",
        methodNote: "This reviewed slice searched accessible Chinese-local web sources. Xiaohongshu and Dianping adapters are not connected yet, so no candidate is attributed to either platform.",
        sourceNotes: [
            LocalSourceNote(
                id: "yangpu-student-family-green-hill",
                platform: "Chinese local reporting",
                title: "A Yangpu student returns to Green Hill with her brother",
                originalLanguage: "Chinese",
                localSignal: "Repeat resident use turns an architecture landmark into a family-accessible riverfront stop.",
                candidatePlaceIDs: ["green-hill-local-use"],
                retrievedAt: "2026-07-17"
            ),
            LocalSourceNote(
                id: "yangpu-child-friendly-waterfront",
                platform: "District community evidence",
                title: "Child-friendly waterfront spaces connect museum, factory, and river walk",
                originalLanguage: "Chinese",
                localSignal: "The useful travel idea is not one viral pin; it is a slower Yangpu waterfront day with indoor fallbacks.",
                candidatePlaceIDs: ["worldskills-museum-local-use", "soap-dream-space-local-use"],
                retrievedAt: "2026-07-17"
            ),
            LocalSourceNote(
                id: "fuxing-island-neighborhood-walk",
                platform: "Shanghai community attraction review",
                title: "Fuxing Island Park is used for quiet walks and neighborhood air",
                originalLanguage: "Chinese",
                localSignal: "Local use changes the itinerary role: this is a slow finish, not a marquee detour.",
                candidatePlaceIDs: ["fuxing-island-park-local-use"],
                retrievedAt: "2026-07-17"
            )
        ],
        places: [
            LocalGuidePlace(
                id: "green-hill-local-use",
                englishName: "Green Hill",
                localName: "绿之丘",
                address: "杨树浦路1500号, Yangpu, Shanghai",
                latitude: 31.254825,
                longitude: 121.538809,
                evidenceGrade: .residentDirect,
                resolutionState: .probable,
                localUse: "A repeat family activity stop and an accessible river overlook, rather than only an architecture photo.",
                evidence: "Chinese Youth Daily interviewed a Yangpu student who returns with her brother every one or two weeks. Local public reporting also describes program volume and accessible waterfront use.",
                travelerContext: "Best for a family, accessibility-conscious, or industrial-architecture afternoon. Check the current activity calendar separately.",
                amapURL: URL(string: "https://uri.amap.com/search?keyword=%E7%BB%BF%E4%B9%8B%E4%B8%98%20%E6%9D%A8%E6%B5%A6%20%E4%B8%8A%E6%B5%B7&city=310000&callnative=1"),
                appleMapsURL: URL(string: "https://maps.apple.com/place?_provider=57879&place-id=H2710I3F9268ED09EE6")
            ),
            LocalGuidePlace(
                id: "worldskills-museum-local-use",
                englishName: "WorldSkills Museum",
                localName: "世界技能博物馆",
                address: "杨树浦路1578号（正门面向安浦路）, Yangpu, Shanghai",
                latitude: 31.255879,
                longitude: 121.541547,
                evidenceGrade: .localUseCorroborated,
                resolutionState: .probable,
                localUse: "An indoor, interactive family stop that can carry the hottest or wettest part of a waterfront day.",
                evidence: "Yangpu reporting includes the museum in the district child-friendly waterfront network. Official visitor information confirms free entry, interactive exhibits, wheelchair access, the Anpu Road entrance, and reservation paths.",
                travelerContext: "Use it for two to three indoor hours, not as a quick photo stop. Recheck current reservation rules and Monday closure before leaving.",
                amapURL: URL(string: "https://uri.amap.com/search?keyword=%E4%B8%96%E7%95%8C%E6%8A%80%E8%83%BD%E5%8D%9A%E7%89%A9%E9%A6%86%20%E4%B8%8A%E6%B5%B7&city=310000&callnative=1"),
                appleMapsURL: URL(string: "https://maps.apple.com/place?auid=1118418027443630&lsp=57879")
            ),
            LocalGuidePlace(
                id: "soap-dream-space-local-use",
                englishName: "Soap Dream Space",
                localName: "皂梦空间",
                address: "平定路1号, Yangpu, Shanghai",
                latitude: 31.269899,
                longitude: 121.557848,
                evidenceGrade: .localUseProxy,
                resolutionState: .probable,
                localUse: "A small industrial-history pause inside the public waterfront network, especially relevant to families using the child-friendly corridor.",
                evidence: "Local reporting lists the former soap factory among child-friendly demonstration spaces. Municipal material preserves its industrial identity and address, but direct resident testimony is not present in this slice.",
                travelerContext: "Treat it as a conditional pause, not the reason to cross Shanghai. Confirm current public access and opening before building the day around it.",
                amapURL: URL(string: "https://uri.amap.com/search?keyword=%E7%9A%82%E6%A2%A6%E7%A9%BA%E9%97%B4%20%E6%9D%A8%E6%B5%A6%20%E4%B8%8A%E6%B5%B7&city=310000&callnative=1"),
                appleMapsURL: URL(string: "https://maps.apple.com/?q=%E7%9A%82%E6%A2%A6%E7%A9%BA%E9%97%B4%20%E6%9D%A8%E6%B5%A6%20%E4%B8%8A%E6%B5%B7")
            ),
            LocalGuidePlace(
                id: "fuxing-island-park-local-use",
                englishName: "Fuxing Island Park",
                localName: "复兴岛公园",
                address: "共青路386号, Yangpu, Shanghai",
                latitude: 31.286431,
                longitude: 121.562352,
                evidenceGrade: .localUseCorroborated,
                resolutionState: .resolved,
                localUse: "A quiet neighborhood walk for trees, river air, and a slower finish away from the central sightseeing circuit.",
                evidence: "Shanghai community-attraction reporting describes the park as a place residents use for walking, views, and quiet time. Provider identities agree on the same park address.",
                travelerContext: "Use the island as a separate slow finish, not as an implied continuation of every Yangpu waterfront walk. Check current access and the return before dusk.",
                amapURL: URL(string: "https://www.amap.com/place/B00154DQQ7"),
                appleMapsURL: URL(string: "https://maps.apple.com/place?_provider=57879&place-id=H2710I3F80D8CC0908F")
            )
        ]
    )
}
