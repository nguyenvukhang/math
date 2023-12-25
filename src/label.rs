use std::collections::HashSet;
use std::fmt;

use anyhow::anyhow;
use anyhow::Result;
use regex::Regex;

use crate::prelude::TexFile;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Label(pub String);

pub const CHARSET: &[u8; 16] = b"abcdef0123456789";
pub const LABEL_REGEX_GENERAL: &str = r"\\label\{([^{}]+)\}";
pub const SHA_REGEX_VALID: &str = r"[a-f][a-f0-9]{6}";

impl Label {
    pub fn new() -> Self {
        use rand::Rng;
        let mut rng = rand::thread_rng();
        let mut sha = Vec::with_capacity(7);
        sha.push(CHARSET[rng.gen_range(0..6)]);
        (0..6).for_each(|_| sha.push(CHARSET[rng.gen_range(0..16)]));
        Self(String::from_utf8(sha).unwrap())
    }

    pub fn as_str(&self) -> &str {
        self.0.as_str()
    }

    pub fn fresh(existing: &mut HashSet<Self>) -> Self {
        loop {
            let sha = Self::new();
            if existing.insert(sha.clone()) {
                break sha;
            }
        }
    }

    pub fn tex(&self) -> String {
        format!(r"\label{{{}}}", self)
    }

    /// Obtain all label ids from the list of .tex files.
    pub fn from_files(tex_files: &Vec<TexFile>) -> Result<Vec<Self>> {
        let label_rx = Regex::new(LABEL_REGEX_GENERAL).unwrap();
        Ok(tex_files
            .iter()
            .map(|v| v.get_labels(&label_rx))
            .collect::<Result<Vec<_>>>()?
            .into_iter()
            .flat_map(|v| v)
            .collect())
    }

    pub fn from_text<S: AsRef<str>>(text: S, rx: &Regex) -> Vec<Label> {
        let mut labels = vec![];
        for hit in rx.captures_iter(text.as_ref()) {
            let label = hit.get(0).unwrap().as_str();
            labels.push(Label(label.to_string()));
        }
        labels
    }

    pub fn all_valid(list: &Vec<Self>) -> Result<()> {
        let valid_rx = Regex::new(SHA_REGEX_VALID).unwrap();
        for label in list {
            if !valid_rx.is_match(label.as_str()) {
                return Err(anyhow!("Invalid label: {}", label.as_str()));
            }
        }
        Ok(())
    }
}

impl fmt::Display for Label {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}
