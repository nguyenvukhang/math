use std::collections::HashSet;

use anyhow::Result;
use regex::Regex;

use crate::label::{self, Label};
use crate::parser::Parser;
use crate::prelude::*;

type Range = (usize, usize);

pub struct Doc {
    lines: Vec<String>,
    tex_files: Vec<TexFile>,
    parser: Parser,
    appendix: Vec<String>,
    labels: HashSet<Label>,
    label_rx: Regex,
}

const CUSTOM_ENVS: [&str; 2] = ["proof", "compute"];

impl Doc {
    pub fn new() -> Self {
        Self {
            lines: vec![],
            tex_files: vec![],
            parser: Parser::new(),
            appendix: vec![],
            labels: HashSet::new(),
            label_rx: Regex::new(label::SHA_REGEX_VALID).unwrap(),
        }
    }

    pub fn add_files(&mut self, tex_files: Vec<TexFile>) -> Result<()> {
        for tex_file in tex_files {
            self.add_file(tex_file)?;
        }
        Ok(())
    }

    pub fn add_file(&mut self, tex_file: TexFile) -> Result<()> {
        let text = String::from_utf8(tex_file.bytes()?)?;
        self.labels.extend(Label::from_text(&text, &self.label_rx));
        let tree = self.parser.parse(&text)?;
        let root_node = tree.root_node();

        // ranges that cover custom environments
        let mut env_ranges = vec![];
        get_env_ranges(&root_node, &text, &mut env_ranges);

        // remaining ranges
        let text_ranges = get_complement((0, text.len()), &env_ranges);

        self.tex_files.push(tex_file);
        for (s, e) in &text_ranges {
            self.lines.push(text[*s..*e].to_string())
        }
        for (s, e) in &env_ranges {
            self.appendix.push(text[*s..*e].to_string());
        }
        Ok(())
    }

    pub fn line(&mut self, line: String) {
        self.lines.push(line)
    }

    pub fn get_lines(&self) -> &Vec<String> {
        &self.lines
    }

    pub fn get_appendix(&self) -> &Vec<String> {
        &self.appendix
    }
}

/// Obtain the ranges at which custom envs occur
fn get_env_ranges(node: &Node, text: &str, output: &mut Vec<Range>) {
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
        match child.env_name(text) {
            Some(v) if CUSTOM_ENVS.contains(&v) => {
                // println!("{:?}", child.child());
                let r = child.byte_range();
                output.push((r.start, r.end));
            }
            _ => get_env_ranges(&child, text, output),
        };
    }
}

/// Obtains the complement list of ranges from `u`. Assumes that `u` is in order
/// already.
fn get_complement(s: Range, u: &Vec<Range>) -> Vec<Range> {
    if u.len() == 0 {
        return vec![s];
    }
    let (mut prev, mut ranges) = (s.0, Vec::with_capacity(u.len() + 2));
    for u in u {
        ranges.push((prev, u.0));
        prev = u.1;
    }
    ranges.push((prev, s.1));
    ranges
}
