use crate::utils;

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
    /// Build a single .tex file
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

    /// Build a single .tex file and its PDF and monitor changes
    #[cfg(feature = "dev")]
    Dev {
        files: Vec<PathBuf>,
    },

    /// Take a single compiled .tex file and output a PDF
    Pdf {
        src: String,
    },

    /// Add labels to marked sections (Theorems, Lemmas, ...) that are not
    /// labelled yet
    Label,

    Checkhealth,

    GenerateMarks,

    TOC,
}

/// Parse + post-process some args
pub fn parse() -> Cli {
    let mut cli = Cli::parse();
    match cli.command {
        Commands::Build { all, pipe: _, jobname: _, ref mut files } => {
            if all {
                utils::extend_file_list(files);
            }
        }
        _ => {}
    }
    cli
}
