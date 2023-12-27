use std::fs;
use std::path::Path;

use anyhow::Result;

pub const MARKS: &[&str] = &[
    "Algorithm",
    "Axiom",
    "Corollary",
    "Definition",
    "Example",
    "Exercise",
    "Lemma",
    "Principle",
    "Problem",
    "Proposition",
    "Remark",
    "Result",
    "Theorem",
];

pub fn create_dir<P: AsRef<Path>>(dir: P) -> Result<()> {
    let dir = dir.as_ref();
    if !dir.is_dir() {
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir)?;
    }
    Ok(())
}

pub fn is_marked_line<S: AsRef<str>>(line: S, offset: usize) -> bool {
    let line = line.as_ref();
    if line.len() < offset {
        return false;
    }
    MARKS.iter().any(|v| line[offset..].starts_with(v))
}

pub trait Colored {
    fn red(&self) -> String;
    fn green(&self) -> String;
    fn yellow(&self) -> String;
}

impl<S: AsRef<str>> Colored for S {
    fn red(&self) -> String {
        format!("\x1b[0;31m{}\x1b[0m", self.as_ref())
    }
    fn green(&self) -> String {
        format!("\x1b[0;32m{}\x1b[0m", self.as_ref())
    }
    fn yellow(&self) -> String {
        format!("\x1b[0;33m{}\x1b[0m", self.as_ref())
    }
}
