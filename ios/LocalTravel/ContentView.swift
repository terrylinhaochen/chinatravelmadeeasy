import MapKit
import SwiftUI

struct ContentView: View {
    @StateObject private var savedPlaces = SavedPlacesStore()

    var body: some View {
        TabView {
            GuidesView(guide: LocalGuideFixtures.yangpu)
                .environmentObject(savedPlaces)
                .tabItem {
                    Label("Guides", systemImage: "book.pages")
                }

            TripMapView(guide: LocalGuideFixtures.yangpu)
                .environmentObject(savedPlaces)
                .tabItem {
                    Label("Map", systemImage: "map")
                }

            ResearchBriefView(guide: LocalGuideFixtures.yangpu)
                .tabItem {
                    Label("Research", systemImage: "sparkle.magnifyingglass")
                }
        }
    }
}

struct GuidesView: View {
    let guide: LocalGuide

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    GuideHeader(guide: guide)
                    SourceEvidenceStrip(guide: guide)

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Places locals actually use")
                            .font(.title2.bold())

                        ForEach(guide.places) { place in
                            NavigationLink {
                                PlaceDetailView(place: place)
                            } label: {
                                PlaceCard(place: place)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding()
                .padding(.bottom, 24)
            }
            .navigationTitle("Local Travel")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct GuideHeader: View {
    let guide: LocalGuide

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Local China guides")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
                .textCase(.uppercase)

            Text(guide.title)
                .font(.system(.title, design: .default, weight: .bold))
                .fixedSize(horizontal: false, vertical: true)

            Text("\(guide.city) · \(guide.neighborhood)")
                .font(.headline)
                .foregroundStyle(.secondary)

            Text(guide.summary)
                .font(.body)
                .foregroundStyle(.primary)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                StatPill(value: "\(guide.places.count)", label: "researched")
                StatPill(value: "\(guide.resolvedPlaces.count)", label: "map-ready")
                StatPill(value: guide.checkedAt, label: "checked")
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

struct StatPill: View {
    let value: String
    let label: String

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(value)
                .font(.subheadline.monospacedDigit().weight(.bold))
                .lineLimit(1)
                .minimumScaleFactor(0.75)
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 10)
        .padding(.horizontal, 12)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 8))
    }
}

struct SourceEvidenceStrip: View {
    let guide: LocalGuide

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .firstTextBaseline) {
                Text("Source notes")
                    .font(.title3.bold())
                Spacer()
                Text("\(guide.sourceNotes.count) checked")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(guide.sourceNotes) { note in
                        SourceEvidenceCard(note: note)
                    }
                }
                .scrollTargetLayout()
            }
            .scrollTargetBehavior(.viewAligned)
        }
    }
}

struct SourceEvidenceCard: View {
    let note: LocalSourceNote

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(note.platform)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                Spacer()
                Text(note.originalLanguage)
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.blue)
            }

            Text(note.title)
                .font(.headline)
                .lineLimit(3)
                .fixedSize(horizontal: false, vertical: true)

            Text(note.localSignal)
                .font(.subheadline)
                .foregroundStyle(.primary)
                .lineLimit(4)

            Spacer(minLength: 0)

            Label("\(note.mappedPlaceIDs.count) mapped", systemImage: "mappin.and.ellipse")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
        }
        .frame(width: 270, alignment: .topLeading)
        .frame(minHeight: 190, alignment: .topLeading)
        .padding(16)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 8))
    }
}

struct PlaceCard: View {
    let place: LocalGuidePlace

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(place.englishName)
                        .font(.headline)
                    Text(place.localName)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                ResolutionBadge(state: place.resolutionState)
            }

            Text(place.localUse)
                .font(.subheadline)
                .foregroundStyle(.primary)

            Text(place.evidenceGrade.label)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
        }
        .padding(16)
        .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 8))
    }
}

struct ResolutionBadge: View {
    let state: ResolutionState

    var body: some View {
        Text(state.label)
            .font(.caption.weight(.semibold))
            .foregroundStyle(state == .resolved ? .green : .orange)
            .padding(.vertical, 5)
            .padding(.horizontal, 8)
            .background((state == .resolved ? Color.green : Color.orange).opacity(0.12), in: Capsule())
    }
}

struct PlaceDetailView: View {
    @EnvironmentObject private var savedPlaces: SavedPlacesStore
    let place: LocalGuidePlace

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(place.localName)
                        .font(.title3)
                        .foregroundStyle(.secondary)
                    Text(place.englishName)
                        .font(.largeTitle.bold())
                    Text(place.address)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                PlaceMapSnapshot(place: place)
                    .frame(height: 220)
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                SaveButton(place: place)

                DetailSection(title: "Why locals use it", bodyText: place.localUse)
                DetailSection(title: "Evidence", bodyText: place.evidence)
                DetailSection(title: "Traveler context", bodyText: place.travelerContext)

                VStack(alignment: .leading, spacing: 10) {
                    Text("Open in maps")
                        .font(.headline)

                    if let amapURL = place.amapURL {
                        Link("Open AMap", destination: amapURL)
                            .buttonStyle(.bordered)
                    }

                    if let appleMapsURL = place.appleMapsURL {
                        Link("Open Apple Maps", destination: appleMapsURL)
                            .buttonStyle(.bordered)
                    }
                }
            }
            .padding()
        }
        .navigationTitle(place.englishName)
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct SaveButton: View {
    @EnvironmentObject private var savedPlaces: SavedPlacesStore
    let place: LocalGuidePlace

    var body: some View {
        Button {
            savedPlaces.toggle(place)
        } label: {
            Label(savedPlaces.isSaved(place) ? "Saved to trip" : "Save to trip", systemImage: savedPlaces.isSaved(place) ? "checkmark.circle.fill" : "plus.circle")
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
        .disabled(!place.resolutionState.canAutoSave)

        if !place.resolutionState.canAutoSave {
            Text("This place stays review-only until the provider identity is grounded.")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}

struct DetailSection: View {
    let title: String
    let bodyText: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
            Text(bodyText)
                .font(.body)
                .foregroundStyle(.primary)
        }
    }
}

struct PlaceMapSnapshot: View {
    let place: LocalGuidePlace

    var body: some View {
        Map(initialPosition: .region(MKCoordinateRegion(
            center: place.coordinate,
            span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
        ))) {
            Marker(place.englishName, coordinate: place.coordinate)
        }
    }
}

struct TripMapView: View {
    @EnvironmentObject private var savedPlaces: SavedPlacesStore
    let guide: LocalGuide

    private var saved: [LocalGuidePlace] {
        guide.places.filter(savedPlaces.isSaved)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                Map(initialPosition: .region(MKCoordinateRegion(
                    center: CLLocationCoordinate2D(latitude: 31.268, longitude: 121.55),
                    span: MKCoordinateSpan(latitudeDelta: 0.06, longitudeDelta: 0.06)
                ))) {
                    ForEach(saved.isEmpty ? guide.resolvedPlaces : saved) { place in
                        Marker(place.localName, coordinate: place.coordinate)
                    }
                }
                .frame(minHeight: 320)

                List {
                    Section(saved.isEmpty ? "Map-ready places" : "Saved places") {
                        ForEach(saved.isEmpty ? guide.resolvedPlaces : saved) { place in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(place.englishName)
                                    .font(.headline)
                                Text(place.localName)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Trip map")
        }
    }
}

struct ResearchBriefView: View {
    let guide: LocalGuide

    var body: some View {
        NavigationStack {
            List {
                Section("Agent brief") {
                    Text(guide.intent)
                    Text(guide.methodNote)
                        .foregroundStyle(.secondary)
                }

                Section("Rubric") {
                    Label("Search Chinese sources first", systemImage: "magnifyingglass")
                    Label("Separate resident testimony from weaker signals", systemImage: "checklist")
                    Label("Only save pins with grounded provider identity", systemImage: "mappin.and.ellipse")
                }

                Section("Current source access") {
                    LabeledContent("Chinese local web", value: "Reviewed")
                    LabeledContent("Xiaohongshu", value: "Not connected")
                    LabeledContent("Dianping", value: "Not connected")
                }
            }
            .navigationTitle("Research")
        }
    }
}
