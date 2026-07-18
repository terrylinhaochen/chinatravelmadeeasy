import Foundation

@MainActor
final class SavedPlacesStore: ObservableObject {
    @Published private(set) var savedPlaceIDs: Set<String>

    private let defaults: UserDefaults
    private let storageKey = "localTravel.savedPlaceIDs"

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        let existing = defaults.stringArray(forKey: storageKey) ?? []
        self.savedPlaceIDs = Set(existing)
    }

    func isSaved(_ place: LocalGuidePlace) -> Bool {
        savedPlaceIDs.contains(place.id)
    }

    func toggle(_ place: LocalGuidePlace) {
        guard place.resolutionState.canAutoSave else { return }
        if savedPlaceIDs.contains(place.id) {
            savedPlaceIDs.remove(place.id)
        } else {
            savedPlaceIDs.insert(place.id)
        }
        defaults.set(savedPlaceIDs.sorted(), forKey: storageKey)
    }
}
