pub use crate::structs::*;

pub use tree_sitter::Node;

pub trait Tex {
    fn b(&self) -> String;
}

impl<S: AsRef<str>> Tex for S {
    fn b(&self) -> String {
        format!("{{{}}}", self.as_ref())
    }
}

/// Node operations I find useful
pub trait NodeExt {
    /// Extract text of a node
    fn t<'a>(&self, src: &'a str) -> &'a str;

    /// Obtains the "proof" in "\begin{proof}"
    fn env_name<'a>(&self, src: &'a str) -> Option<&'a str>;

    /// Obtains "aeac31f" in
    /// ```tex
    /// \Definition{5.0.0}{Standard Nonlinear Program}\label{aeac31f}
    /// ```
    fn mark_label_id<'a>(&self, src: &'a str) -> Option<&'a str>;

    /// Obtains "5.0.0" in
    /// ```tex
    /// \Definition{5.0.0}{Standard Nonlinear Program}\label{aeac31f}
    /// ```
    fn mark_number<'a>(&self, src: &'a str) -> Option<&'a str>;

    /// Obtains "Standard Nonlinear Program" in
    /// ```tex
    /// \Definition{5.0.0}{Standard Nonlinear Program}\label{aeac31f}
    /// ```
    fn mark_title<'a>(&self, src: &'a str) -> Option<&'a str>;
}

impl<'n> NodeExt for Node<'n> {
    fn t<'a>(&self, src: &'a str) -> &'a str {
        &src[self.byte_range()]
    }

    fn env_name<'a>(&self, src: &'a str) -> Option<&'a str> {
        Some(self.child(0)?.child(1)?.child(1)?.t(src))
    }

    fn mark_label_id<'a>(&self, src: &'a str) -> Option<&'a str> {
        Some(self.child(1)?.child(1)?.t(src))
    }

    fn mark_number<'a>(&self, src: &'a str) -> Option<&'a str> {
        Some(self.child(0)?.child(1)?.t(src))
    }

    fn mark_title<'a>(&self, src: &'a str) -> Option<&'a str> {
        Some(self.child(0)?.child(2)?.t(src))
    }
}
