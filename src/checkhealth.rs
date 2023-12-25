use crate::consts::{self, Colored};
use crate::label::Label;
use crate::parser;
use crate::prelude::*;

use std::collections::HashSet;
use std::path::Path;

use anyhow::{anyhow, Result};

const CUSTOM_ENVS: &[&str] = &["proof", "compute"];

/// Looks for duplicates in a list of items
fn find_duplicate<T: Eq + std::hash::Hash>(list: &Vec<T>) -> Option<&T> {
    let mut u: HashSet<&T> = HashSet::new();
    for x in list {
        if !u.insert(x) {
            return Some(x);
        }
    }
    None
}

fn assert_all_unique_labels(tex_files: &Vec<TexFile>) -> Result<()> {
    let labels = Label::from_files(tex_files)?;
    Label::all_valid(&labels)?;
    match find_duplicate(&labels) {
        Some(v) => Err(anyhow!("Error: duplicate label [{}]", v.as_str())),
        None => Ok(()),
    }
}

struct Checker {
    parser: parser::Parser,
}

impl Checker {
    fn new() -> Self {
        Self { parser: parser::Parser::new() }
    }

    /// Check that a marked line is valid. Using a simple treesitter parse. For
    /// example, each line:
    ///
    /// ```tex
    /// \Theorem{1.2.8}{Bernoulli's inequality}\label{d44713f}
    /// ````
    ///
    /// Should have a name ("Theorem") with two arguments, and a label.
    fn assert_valid_marked_line<S>(&mut self, line: S) -> Result<()>
    where
        S: AsRef<str>,
    {
        let line = line.as_ref();
        if line.len() <= 1 || !consts::is_marked_line(line, 1) {
            return Ok(());
        }
        let p = self.parser.parse(line)?;
        let root = p.root_node();
        if root.has_error() {
            Err(anyhow!("Marked line spans more than one line:\n{line}"))?;
        }
        if root.child_count() != 2 {
            Err(anyhow!("Marked line has wrong structure:\n{line}\n\nSee other marked lines for examples"))?;
        }
        Ok(())
    }

    /// Asserts that a .tex file has all valid lines.
    fn assert_valid_lines(&mut self, tex_file: &mut TexFile) -> Result<()> {
        for line in tex_file.lines()? {
            // insert line-by-line tests here
            self.assert_valid_marked_line(&line)?;
        }
        Ok(())
    }

    /// Custom environments are defined in `CUSTOM_ENVS` and also in the default
    /// `tex_modules/headers.sty`. This test asserts that these environments are
    /// not nested.
    fn assert_no_nested_custom_environments(
        &mut self,
        tex_file: &TexFile,
    ) -> Result<()> {
        let text = String::from_utf8(tex_file.bytes()?)?;
        let ts = self.parser.parse(&text)?;

        /// Checks that the stack (of environments) does not have more than 2
        /// from the list of custom defined environments
        fn valid_stack(stack: &Vec<Option<&str>>) -> bool {
            stack
                .iter()
                .filter(|v| v.map_or(false, |v| CUSTOM_ENVS.contains(&v)))
                .count()
                <= 1
        }

        fn walk(
            path: &Path,
            text: &str,
            node: Node,
            stack: &Vec<Option<&str>>,
        ) -> Result<()> {
            if !valid_stack(&stack) {
                return Err(anyhow!(
                    "Found nested custom environments:\n* {}",
                    path.display()
                ));
            }
            let mut cursor = node.walk();
            for child in node.children(&mut cursor) {
                match child.kind() {
                    "generic_environment" => {
                        let mut stack = stack.clone();
                        stack.push(child.env_name(text));
                        walk(path, text, child, &stack)?
                    }
                    _ => walk(path, text, child, stack)?,
                }
            }
            Ok(())
        }

        walk(tex_file.path(), text.as_str(), ts.root_node(), &vec![])?;
        Ok(())
    }
}

pub fn run(tex_files: &mut Vec<TexFile>) -> Result<()> {
    println!("Running checkhealth on these files:");
    for f in tex_files.iter() {
        println!("{} {}", "*".yellow(), f.path().display());
    }
    assert_all_unique_labels(&tex_files)?;
    let mut checker = Checker::new();
    for mut tex_file in tex_files {
        checker.assert_valid_lines(&mut tex_file)?;
        checker.assert_no_nested_custom_environments(&tex_file)?;
    }
    println!("{}", "checkhealth all ok!".green());
    Ok(())
}
