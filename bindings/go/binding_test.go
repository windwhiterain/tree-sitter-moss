package tree_sitter_moss_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_moss "github.com/windwhiterain/tree-sitter-moss/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_moss.Language())
	if language == nil {
		t.Errorf("Error loading Moss grammar")
	}
}
