mod build;
mod checkhealth;
mod cli;
mod consts;
mod doc;
mod label;
mod parser;
mod pdftex;
mod prelude;
mod structs;
mod utils;

use cli::Cli;
use pdftex::PdfTex;
use prelude::*;

use std::collections::{HashMap, HashSet};
use std::fs;
use std::io::Write;
use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;

fn main() -> Result<()> {
    use cli::Commands::*;

    let cli = Cli::parse();
    match cli.command {
        Build { all, jobname, mut files, pipe } => {
            if all {
                utils::extend_file_list(&mut files);
            }
            match pipe {
                true => {
                    let mut pdftex = PdfTex::new(&jobname)?;
                    pdftex.write_lines(pdftex::DOC_START)?;
                    for file in files {
                        pdftex.write_bytes(&fs::read(&file)?)?;
                        pdftex.write_bytes(b"\n\\newpage\n")?;
                    }
                    pdftex.write_lines(pdftex::DOC_END)?;
                    pdftex.monitor(true, true)?;
                    pdftex.close()?;
                    pdftex.move_pdf_to_cwd()?;
                }
                false => {
                    let mut basename = PathBuf::from(jobname);
                    basename.set_extension("tex");
                    let build_dir = pdftex::build_dir();
                    consts::create_dir(&build_dir)?;
                    let out_file = build_dir.join(basename);
                    let mut f = fs::File::create(&out_file)?;
                    for l in pdftex::DOC_START {
                        writeln!(f, "{l}")?;
                    }
                    for file in files {
                        f.write_all(&fs::read(&file)?)?;
                        f.write_all(b"\n\\newpage\n")?;
                    }
                    for l in pdftex::DOC_END {
                        writeln!(f, "{l}")?;
                    }
                    f.flush()?;
                    drop(f);
                    println!("Output written to: {}", out_file.display());
                }
            }
        }
        Dev { files } => {
            use notify::RecursiveMode;
            use std::path::Path;
            use std::process::Command;
            use std::time::Duration;

            let (tx, rx) = std::sync::mpsc::channel();

            let interval = Duration::from_millis(1000);
            let base_dir = Path::new(".");
            let mut count = 1;

            let mut db = notify_debouncer_mini::new_debouncer(interval, tx)?;
            db.watcher().watch(&base_dir, RecursiveMode::NonRecursive)?;

            let mut build = || {
                let output = match Command::new("minimath")
                    .arg("build")
                    .arg("--pipe")
                    .args(["--jobname", "out"])
                    .args(&files)
                    .output()
                {
                    Ok(v) => v,
                    Err(_) => return println!("build failed"),
                };
                println!(
                    "{}",
                    String::from_utf8_lossy(&output.stdout).trim_end()
                );
                println!("build number [{}]", count);
                count += 1;
            };

            println!("started server...");
            for res in rx {
                for event in res.unwrap_or_default() {
                    if event.path.extension().map_or(false, |v| v == "tex") {
                        build();
                        break;
                    }
                }
            }
        }
        Label => {
            let tex_files = utils::tex_files()?;
            let mut existing =
                HashSet::from_iter(label::Label::from_files(&tex_files)?);
            let mut parser = parser::Parser::new();
            for mut tex_file in tex_files {
                tex_file.add_labels(&mut existing, &mut parser)?;
                tex_file.save_changes()?;
            }
        }
        Checkhealth => {
            let mut tex_files = utils::tex_files()?;
            checkhealth::run(&mut tex_files)?;
        }
        GenerateMarks => consts::MARKS.iter().for_each(|theorem| {
            let desc = r"\ifx&#2&\else\hspace{0.5em}(#2)\fi";
            let x = format!(r"{}{}{}", theorem, " {#1}", desc.b());
            let x = format!(r"\subsection{}", x.b()).b();
            println!(r"\def\{theorem}#1#2{x}")
        }),
        TOC => {
            // hi
            println!("GOT HERE")
        }
    };
    Ok(())
}

#[allow(unused)]
fn marks_and_toc() -> Result<()> {
    let mut parser = parser::Parser::new();
    let mut toc: HashMap<String, Vec<Mark>> = HashMap::new();
    for mut tex_file in utils::tex_files()? {
        let marks = tex_file.get_marks(&mut parser)?.clone();
        toc.insert(tex_file.path().display().to_string(), marks);
    }
    Ok(())
}
