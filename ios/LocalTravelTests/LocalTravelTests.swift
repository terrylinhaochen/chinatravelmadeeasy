import XCTest
@testable import LocalTravel

final class LocalTravelTests: XCTestCase {
    func testYangpuGuideKeepsEvidenceSeparateFromResolution() {
        let guide = LocalGuideFixtures.yangpu

        XCTAssertEqual(guide.places.count, 4)
        XCTAssertEqual(guide.sourceNotes.count, 3)
        XCTAssertEqual(guide.places.filter { $0.evidenceGrade == .residentDirect }.count, 1)
        XCTAssertEqual(guide.places.filter { $0.resolutionState == .resolved }.count, 1)
        XCTAssertTrue(guide.methodNote.contains("Xiaohongshu"))
        XCTAssertTrue(guide.methodNote.contains("not connected"))
    }

    func testEverySourceNoteMapsBackToKnownPlaces() {
        let guide = LocalGuideFixtures.yangpu
        let placeIDs = Set(guide.places.map(\.id))

        for note in guide.sourceNotes {
            XCTAssertFalse(note.mappedPlaceIDs.isEmpty)
            XCTAssertTrue(note.mappedPlaceIDs.allSatisfy { placeIDs.contains($0) })
            XCTAssertEqual(note.originalLanguage, "Chinese")
        }
    }

    func testOnlyResolvedPlacesCanAutoSave() {
        let resolved = LocalGuideFixtures.yangpu.places.first { $0.resolutionState == .resolved }
        let probable = LocalGuideFixtures.yangpu.places.first { $0.resolutionState == .probable }

        XCTAssertEqual(resolved?.resolutionState.canAutoSave, true)
        XCTAssertEqual(probable?.resolutionState.canAutoSave, false)
    }

    func testMapReadyPlaceKeepsAmapAndAppleHandoffs() {
        let place = LocalGuideFixtures.yangpu.places.first { $0.id == "fuxing-island-park-local-use" }

        XCTAssertNotNil(place?.amapURL)
        XCTAssertNotNil(place?.appleMapsURL)
        XCTAssertTrue(place?.amapURL?.absoluteString.contains("amap.com/place") == true)
        XCTAssertTrue(place?.appleMapsURL?.absoluteString.contains("maps.apple.com/place") == true)
    }
}
