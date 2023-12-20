use std::path::PathBuf;

use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Cli {
    /// Name of pdf to compile
    name: Option<String>,

    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// does testing things
    Build {
        /// lists test values
        #[arg(short, long)]
        all: bool,

        // #[arg(dd)]
        files: Vec<PathBuf>,
    },
}
