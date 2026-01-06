import XCTest
import SwiftTreeSitter
import TreeSitterMoss

final class TreeSitterMossTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_moss())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Moss grammar")
    }
}
