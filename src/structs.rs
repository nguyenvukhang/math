use crate::consts;
use crate::label::Label;
use crate::parser::Parser;

use std::collections::HashSet;
use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::path::{Path, PathBuf};

use anyhow::{anyhow, Result};
use regex::Regex;

#[derive(Debug, Clone)]
pub enum MarkKind {
    Algorithm,
    Axiom,
    Corollary,
    Definition,
    Example,
    Exercise,
    Lemma,
    Problem,
    Principle,
    Proposition,
    Remark,
    Result,
    Theorem,
}

impl TryFrom<&str> for MarkKind {
    type Error = ();
    fn try_from(arg: &str) -> std::result::Result<Self, ()> {
        match arg {
            "Algorithm" => Ok(MarkKind::Algorithm),
            "Axiom" => Ok(MarkKind::Axiom),
            "Corollary" => Ok(MarkKind::Corollary),
            "Definition" => Ok(MarkKind::Definition),
            "Example" => Ok(MarkKind::Example),
            "Exercise" => Ok(MarkKind::Exercise),
            "Lemma" => Ok(MarkKind::Lemma),
            "Principle" => Ok(MarkKind::Principle),
            "Problem" => Ok(MarkKind::Problem),
            "Proposition" => Ok(MarkKind::Proposition),
            "Remark" => Ok(MarkKind::Remark),
            "Result" => Ok(MarkKind::Result),
            "Theorem" => Ok(MarkKind::Theorem),
            _ => Err(()),
        }
    }
}

#[derive(Debug, Clone)]
pub struct Mark {
    pub kind: MarkKind,
    pub number: Option<String>,
    pub title: Option<String>,
    pub label_id: Option<String>,
}

/// A `PathBuf` wrapper for convenience with interacting with a .tex file.
pub struct TexFile {
    path: PathBuf,
    lines: Option<Vec<String>>,
    marks: Option<Vec<Mark>>,
}

#[allow(unused)]
impl TexFile {
    pub fn new<P: AsRef<Path>>(path: P) -> Self {
        Self { path: path.as_ref().to_path_buf(), lines: None, marks: None }
    }

    pub fn path(&self) -> &Path {
        self.path.as_path()
    }

    /// Read entire file into a byte vector
    pub fn bytes(&self) -> Result<Vec<u8>> {
        Ok(fs::read(&self.path)?)
    }

    /// Read entire file into an iterator of `String` values, one for each line
    pub fn lines(&mut self) -> Result<&Vec<String>> {
        match self.lines.is_some() {
            true => Ok(&self.lines.as_ref().unwrap()),
            false => {
                let file = fs::File::open(&self.path)?;
                self.lines = Some(
                    BufReader::new(file)
                        .lines()
                        .filter_map(|v| v.ok())
                        .collect(),
                );
                Ok(self.lines.as_ref().unwrap())
            }
        }
    }

    /// Override the current set of lines
    pub fn set_lines<S: AsRef<str>>(
        &mut self,
        lines: impl IntoIterator<Item = S>,
    ) {
        self.lines =
            Some(lines.into_iter().map(|v| v.as_ref().to_string()).collect())
    }

    pub fn set_line<S>(&mut self, lnum: usize, line: S) -> Result<()>
    where
        S: AsRef<str>,
    {
        if let Some(lines) = self.lines.as_mut() {
            if lnum < lines.len() {
                lines[lnum] = line.as_ref().to_string()
            }
            Ok(())
        } else {
            Err(anyhow!("Lines not read yet."))
        }
    }

    /// Write a `Vec` of strings to a file, line by line
    pub fn write_lines<S: AsRef<str>>(&self, lines: Vec<S>) -> Result<()> {
        let mut file = fs::File::create(&self.path)?;
        lines.iter().map(|v| Ok(writeln!(file, "{}", v.as_ref())?)).collect()
    }

    /// Save any changes made to the file into storage
    pub fn save_changes(&self) -> Result<()> {
        match &self.lines {
            None => return Err(anyhow!("No changes made")),
            Some(v) => {
                let mut f = fs::File::create(&self.path)?;
                v.iter().map(|v| Ok(writeln!(f, "{}", v)?)).collect()
            }
        }
    }

    /// Obtain a list of all marks from the file
    pub fn get_marks(&mut self, parser: &mut Parser) -> Result<&Vec<Mark>> {
        match self.marks.is_some() {
            true => return Ok(self.marks.as_ref().unwrap()),
            false => {
                self.marks = Some(
                    self.lines()?
                        .into_iter()
                        .filter_map(|line| parser.parse_mark(&line))
                        .collect(),
                );
                Ok(self.marks.as_ref().unwrap())
            }
        }
    }

    /// Add labels to all sections. From this:
    /// ```tex
    /// \Proposition{5.1.3}{Extending a CNF to 3 variables}
    /// ```
    ///
    /// to this:
    /// ```tex
    /// \Proposition{5.1.3}{Extending a CNF to 3 variables}\label{a4316e4}
    /// ```
    pub fn add_labels(
        &mut self,
        existing: &mut HashSet<Label>,
        parser: &mut Parser,
    ) -> Result<()> {
        let lines: Vec<_> = self
            .lines()?
            .iter()
            .map(|v| match consts::is_marked_line(v, 1) {
                true if parser
                    .parse(&v)
                    .map_or(false, |t| t.root_node().child_count() <= 1) =>
                {
                    format!(r"{v}{}", Label::fresh(existing).tex())
                }
                _ => v.to_string(),
            })
            .collect();
        self.set_lines(lines);
        Ok(())
    }

    pub fn get_labels(&self, label_regex: &Regex) -> Result<Vec<Label>> {
        let bytes = self.bytes()?;
        let haystack = String::from_utf8(bytes)?;
        let mut labels = vec![];
        for hit in label_regex.captures_iter(&haystack) {
            let label = hit.get(1).unwrap().as_str();
            labels.push(Label(label.to_string()));
        }
        Ok(labels)
    }
}
