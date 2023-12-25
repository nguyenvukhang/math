use crate::consts;
use crate::prelude::*;

use anyhow::anyhow;
use anyhow::Result;
use tree_sitter::{Parser as TSParser, Tree};

pub struct Parser(TSParser);

impl Parser {
    pub fn new() -> Self {
        let mut parser = TSParser::new();
        parser.set_language(tree_sitter_latex::language()).unwrap();
        Self(parser)
    }

    pub fn parse<S: AsRef<str>>(&mut self, text: S) -> Result<Tree> {
        let text = text.as_ref();
        self.0.parse(text, None).ok_or_else(|| {
            anyhow!(
                "Treesitter unable to parse text:\n{}",
                &text[..30.min(text.len())]
            )
        })
    }

    pub fn parse_mark<S: AsRef<str>>(&mut self, text: S) -> Option<Mark> {
        let text = text.as_ref();
        if !consts::is_marked_line(text, 1) {
            return None;
        }
        let tree = self.parse(text).ok()?;
        let r = tree.root_node();
        let kind = &r.child(0)?.child(0)?.t(text)[1..];
        let kind: MarkKind = kind.try_into().ok()?;
        let number = r.mark_number(text);
        let title = r.mark_title(text);
        let label_id = r.mark_label_id(text);
        Some(Mark {
            kind,
            number: number.map(|v| v.to_string()),
            title: title.map(|v| v.to_string()),
            label_id: label_id.map(|v| v.to_string()),
        })
    }
}
