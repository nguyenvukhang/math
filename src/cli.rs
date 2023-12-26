use std::path::PathBuf;

use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None, arg_required_else_help(true))]
pub struct Cli {
    /// Name of pdf to compile
    pub name: Option<String>,

    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    /// Build a PDF
    Build {
        /// lists test values
        #[arg(short, long)]
        all: bool,

        /// True: use `pdftex` to build. False: write to a file.
        #[arg(short, long)]
        pipe: bool,

        #[arg(short = 'J', long, default_value = "minimath")]
        jobname: String,

        files: Vec<PathBuf>,
    },

    /// Build a PDF and monitor changes
    Dev {
        files: Vec<PathBuf>,
    },

    /// Add labels to marked sections (Theorems, Lemmas, ...) that are not
    /// labelled yet
    Label,

    Checkhealth,

    GenerateMarks,

    TOC,
}
