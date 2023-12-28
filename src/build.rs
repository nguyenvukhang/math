#![allow(unused)]

use std::collections::HashSet;

use crate::label::Label;
use crate::parser::Parser;
use crate::structs::TexFile;

type Range = std::ops::Range<usize>;

#[allow(unused)]
use crate::prelude::*;

use anyhow::Result;

fn get_env_ranges(
    node: &Node,
    text: &str,
    capture: &Vec<&str>,
    output: &mut Vec<Range>,
) {
    let mut cursor = node.walk();
    for child in node.children(&mut cursor) {
        match child.env_name(text) {
            Some(v) if capture.contains(&v) => {
                // println!("{:?}", child.child());
                output.push(child.byte_range());
            }
            _ => get_env_ranges(&child, text, capture, output),
        };
    }
}

/// Obtains the complement list of ranges from `u`. Assumes that `u` is in order
/// already.
fn get_complement(s: Range, u: &Vec<Range>) -> Vec<Range> {
    if u.len() == 0 {
        return vec![s];
    }
    let (mut prev, mut ranges) = (s.start, Vec::with_capacity(u.len() + 2));
    for u in u {
        ranges.push(prev..u.start);
        prev = u.end;
    }
    ranges.push(prev..s.end);
    ranges
}

// fn content(pdftex: &mut PdfTex, tex_files: &Vec<TexFile>) -> Result<()> {
//     let mut labels = HashSet::from_iter(Label::from_files(tex_files)?);
//     let mut parser = Parser::new();
//     // Import each file
//
//     let mut mem = vec![];
//     for tex_file in tex_files {
//         let bytes = tex_file.bytes()?;
//         let text = String::from_utf8(bytes)?;
//         let ts = parser.parse(&text)?;
//         let rt = ts.root_node();
//         let mut env_ranges = vec![];
//         let mut envs = vec![];
//         envs.push("proof");
//         envs.push("compute");
//         get_env_ranges(&rt, &text, &envs, &mut env_ranges);
//
//         let complement = get_complement(0..text.len(), &env_ranges);
//
//         let env_ranges = env_ranges
//             .into_iter()
//             .map(|r| (r, Label::fresh(&mut labels)))
//             .collect::<Vec<_>>();
//
//         println!("{}, {}", env_ranges.len(), complement.len());
//
//         for (i, range) in complement.into_iter().enumerate() {
//             pdftex.writeln(&text[range]);
//             if i < env_ranges.len() {
//                 pdftex.writeln(format!(
//                     r"link: \href{{{}}}{{proof}}.",
//                     env_ranges[i].1
//                 ))
//             }
//         }
//         pdftex.writeln(r"\newpage");
//
//         mem.push((text, env_ranges));
//     }
//
//     for (src, ranges) in mem {
//         for (range, label) in ranges {
//             pdftex.writeln(format!(r"\label{{{}}}", label));
//             pdftex.writeln(&src[range])
//         }
//     }
//
//     Ok(())
// }
//
// pub fn run(
//     mut pdftex: PdfTex,
//     packages: Vec<String>,
//     tex_files: &Vec<TexFile>,
// ) -> Result<()> {
//     // Start of document
//     pdftex.writeln(r"\documentclass{article}");
//     for p in packages {
//         pdftex.writeln(format!(r"\usepackage{{{p}}}"));
//     }
//     pdftex.writeln(r"\begin{document}");
//
//     // Main content
//     content(&mut pdftex, tex_files)?;
//
//     // End of document
//     pdftex.writeln("\\end{document}");
//     // drop(pdftex);
//     // Ok(())
//     pdftex.close()?;
//     pdftex.move_output_pdf_to_cwd()
// }
