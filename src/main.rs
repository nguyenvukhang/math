mod cli;
mod pdftex;

use cli::Cli;

use std::fs;
use std::path::PathBuf;

use clap::{Parser, Subcommand};

use anyhow::Result;

fn list_dir() -> Result<Vec<PathBuf>> {
    Ok(fs::read_dir(".")?.filter_map(|v| v.ok()).map(|v| v.path()).collect())
}

fn checkhealth() -> Result<()> {
    Ok(())
}

fn get_labels() -> Result<()> {
    Ok(())
}

fn main() -> Result<()> {
    let cli = Cli::parse();
    println!("{cli:?}");
    let mut pdflatex = pdftex::builder()
        .build_dir(".git/.build")
        .jobname("minimath")
        .add_input_dir("tex_modules")
        .build()?;
    pdflatex.writeln("\\documentclass{article}");
    pdflatex.writeln("\\usepackage{headers}");
    pdflatex.writeln("\\begin{document}");
    list_dir()?
        .into_iter()
        .filter(|v| v.extension().map_or(false, |v| v == "tex"))
        .for_each(|tex_file| {
            println!("\x1b[0;33m*\x1b[0m {}", tex_file.display());
            if let Ok(bytes) = fs::read(tex_file) {
                pdflatex.writeln(String::from_utf8_lossy(&bytes));
            }
        });
    pdflatex.writeln("\\end{document}");
    pdflatex.close()
}
