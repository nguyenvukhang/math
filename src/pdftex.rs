use crate::consts;
use crate::doc::Doc;

use std::fs;
use std::io::{self, BufRead, BufReader, Write};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};

use anyhow::Result;

const BUILD_DIR: &str = ".build";
pub const DOC_START: [&str; 3] =
    [r"\documentclass{article}", r"\usepackage{headers}", r"\begin{document}"];
pub const DOC_END: [&str; 1] = [r"\end{document}"];

pub fn build_dir() -> PathBuf {
    let git = Path::new(".git");
    match git.is_dir() {
        true => git.join(BUILD_DIR),
        false => PathBuf::from(BUILD_DIR),
    }
}

/// LaTex build tool, equivalent to running `pdftex...` in shell.
pub struct PdfTex {
    jobname: String,
    child: Child,
}

impl PdfTex {
    pub fn new(jobname: &str) -> Result<Self> {
        let build_dir = build_dir();
        consts::create_dir(&build_dir)?;

        let mut pdftex = Command::new("pdflatex");
        pdftex.env("TEXINPUTS", "tex_modules/:");
        pdftex.arg("--halt-on-error");
        pdftex.arg("--output-directory").arg(&build_dir);
        pdftex.arg("--jobname").arg(jobname);
        pdftex.arg("--");
        pdftex.stdin(Stdio::piped());
        pdftex.stdout(Stdio::piped());

        Ok(Self { child: pdftex.spawn()?, jobname: jobname.to_string() })
    }

    pub fn write_lines<S: AsRef<str>>(
        &mut self,
        lines: impl IntoIterator<Item = S>,
    ) -> Result<()> {
        if let Some(stdin) = self.child.stdin.as_mut() {
            for line in lines {
                writeln!(stdin, "{}", line.as_ref())?;
            }
        }
        Ok(())
    }

    pub fn write_bytes(&mut self, buffer: &[u8]) -> Result<()> {
        if let Some(stdin) = self.child.stdin.as_mut() {
            stdin.write_all(buffer)?;
        }
        Ok(())
    }

    pub fn monitor(&mut self, print: bool, pretty: bool) -> Result<()> {
        match (print, pretty) {
            (false, _) => Ok(()),
            (true, true) => monitor::pretty_print(
                &mut self.child.stdout.take().unwrap(),
                io::stdout().lock(),
            ),
            (true, false) => {
                let stdout = self.child.stdout.take().unwrap();
                let mut target = io::stdout().lock();
                for l in BufReader::new(stdout).lines().filter_map(|v| v.ok()) {
                    writeln!(target, "{l}")?;
                }
                Ok(())
            }
        }
    }

    pub fn close(&mut self) -> Result<()> {
        if let Some(stdin) = self.child.stdin.as_mut() {
            stdin.flush()?;
        }
        self.child.wait()?;
        Ok(())
    }

    pub fn move_pdf_to_cwd(&self) -> Result<()> {
        let build_dir = build_dir();
        let basename = format!("{}.pdf", self.jobname);
        fs::rename(build_dir.join(&basename), basename)?;
        Ok(())
    }
}

fn _build(jobname: &str, doc: &Doc, print: bool) -> Result<()> {
    let mut pdftex = PdfTex::new(jobname)?;
    pdftex.write_lines(DOC_START)?;
    pdftex.write_lines(doc.get_lines())?;
    pdftex.write_lines(doc.get_appendix())?;
    pdftex.write_lines(DOC_END)?;
    pdftex.monitor(print, true)?;
    pdftex.close()?;
    pdftex.move_pdf_to_cwd()?;
    Ok(())
}

pub fn build(jobname: &str, doc: &Doc) -> Result<()> {
    _build(jobname, doc, true)
}

pub fn silent_build(jobname: &str, doc: &Doc) -> Result<()> {
    println!("silent build...");
    _build(jobname, doc, false)
}

/// Monitor stdout of `pdftex` and hides harmless warnings.
///
/// Each message from `pdftex` comes in a `chunk` that can span
/// mulitple lines. We will group these chunks together and inspect
/// them one by one.
mod monitor {
    use anyhow::{anyhow, Result};
    use std::io::{BufRead, BufReader, Read, Write};

    pub fn pretty_print<R, W>(stdout: &mut R, mut target: W) -> Result<()>
    where
        R: Read,
        W: Write,
    {
        let lines = BufReader::new(stdout).lines().filter_map(|v| v.ok());
        let mut chunk = vec![];
        let mut ok = true;
        for line in lines {
            if is_chunk_start(&line, &mut ok) {
                print_chunk(&chunk, &mut target);
                chunk.clear();
            }
            if line.len() > 1 {
                chunk.push(line)
            }
        }
        print_chunk(&chunk, &mut target);
        match ok {
            true => Ok(()),
            false => Err(anyhow!("LaTeX Error.")),
        }
    }

    fn is_chunk_start(line: &str, ok: &mut bool) -> bool {
        let c1 = line.chars().nth(0);
        *ok &= c1 != Some('!');
        c1 == Some('*')
            || c1 == Some('!')
            || line.starts_with("Output written")
            || line.starts_with("Transcript written")
    }

    fn print_chunk<W: Write>(buf: &Vec<String>, f: &mut W) {
        let message = buf.join("");
        let m = &message;
        if !(message.is_empty()
            || sw(m, "Package hyperref Warning")
            || sw(m, "This is pdfTeX")
            || ew(m, r"(Please type a command or say `\end')")
            || (sw(m, "*[") && ew(m, "]"))
            || (sw(m, "*(") && ew(m, ")"))
            || sw(m, "**entering extended mode")
            || sw(m, "*geometry*")
            || message.chars().filter(|v| v == &'/').count() >= 10)
        {
            let _ = writeln!(f, "{message}");
        }
    }

    fn sw(text: &str, v: &str) -> bool {
        text.starts_with(v)
    }

    fn ew(text: &str, v: &str) -> bool {
        text.ends_with(v)
    }
}
