use std::fs;
use std::io;
use std::io::Write;
use std::io::{BufRead, BufReader};
use std::path::PathBuf;
use std::process::Child;
use std::process::Command;
use std::process::Stdio;

use anyhow::anyhow;
use anyhow::Result;

pub struct PdfTex {
    child: Child,
    jobname: String,
    build_dir: PathBuf,
}

fn print_buffer<W: Write>(buf: &Vec<String>, f: &mut W) {
    let message = buf.join("");
    let sw = |v: &str| message.starts_with(v);
    let ew = |v: &str| message.ends_with(v);
    if !(message.is_empty()
        || sw("Package hyperref Warning")
        || sw("This is pdfTeX")
        || ew(r"(Please type a command or say `\end')")
        || (sw("*[") && ew("]"))
        || (sw("*(") && ew(")"))
        || sw("**entering extended mode")
        || sw("*geometry*")
        || message.chars().filter(|v| v == &'/').count() >= 10)
    {
        let _ = writeln!(f, "{message}");
    }
}

impl PdfTex {
    fn new(
        build_dir: Option<String>,
        jobname: Option<String>,
        texinputs: Vec<String>,
    ) -> Result<Self> {
        let mut cmd = Command::new("pdflatex");
        build_dir
            .as_ref()
            .map(|v| cmd.args(["--output-directory", v.as_str()]));
        jobname.as_ref().map(|v| cmd.args(["--jobname", v.as_str()]));
        cmd.env("TEXINPUTS", texinputs.join(":") + ":");
        let child = cmd
            .arg("--halt-on-error")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()?;

        let build_dir = build_dir
            .map(PathBuf::from)
            .unwrap_or(std::env::current_dir().unwrap());
        let jobname = jobname.unwrap_or("texput".to_string());
        if !build_dir.is_dir() {
            let _ = fs::remove_dir_all(&build_dir);
            fs::create_dir_all(&build_dir)?;
        }
        Ok(Self { child, build_dir, jobname })
    }

    pub fn output_file(&self) -> PathBuf {
        let mut f = self.build_dir.join(&self.jobname);
        f.set_extension("pdf");
        f
    }

    /// Writes a line to stdin
    pub fn writeln<S: AsRef<str>>(&mut self, line: S) {
        if let Some(stdin) = self.child.stdin.as_mut() {
            let _ = writeln!(stdin, "{}", line.as_ref());
        }
    }

    pub fn pretty_print_stdout(&mut self) -> Result<()> {
        let stdout = self
            .child
            .stdout
            .as_mut()
            .expect("Unable to take stdout from child process");
        let lines = BufReader::new(stdout).lines().filter_map(|v| v.ok());
        let mut buf = vec![];
        let output = &mut io::stdout();
        let mut ok = true;
        for line in lines {
            let c1 = line.chars().next();
            ok &= c1 != Some('!');
            if c1 == Some('*')
                || c1 == Some('!')
                || line.starts_with("Output written")
                || line.starts_with("Transcript written")
            {
                print_buffer(&buf, output);
                buf.clear();
            }
            if line.len() > 1 {
                buf.push(line)
            }
        }
        print_buffer(&buf, output);
        match ok {
            true => Ok(()),
            false => Err(anyhow!("LaTeX Error.")),
        }
    }

    /// Run and wait
    pub fn build(&mut self) {
        if let Some(stdin) = self.child.stdin.as_mut() {
            let _ = stdin.flush();
        }
        let _ = self.child.wait();
    }

    /// Flush stdin and wait/kill.
    pub fn close(mut self) -> Result<()> {
        if let Some(mut stdin) = self.child.stdin.take() {
            let _ = stdin.flush();
            drop(stdin);
        }
        let result = self.pretty_print_stdout();
        let _ = self.child.wait();
        result
    }
}

pub struct PdfTexBuilder {
    jobname: Option<String>,
    build_dir: Option<String>,
    texinputs: Vec<String>,
}

impl PdfTexBuilder {
    pub fn jobname(mut self, jobname: &str) -> Self {
        self.jobname = Some(jobname.to_string());
        self
    }

    pub fn build_dir(mut self, build_dir: &str) -> Self {
        self.build_dir = Some(build_dir.to_string());
        self
    }

    pub fn add_input_dir(mut self, input_dir: &str) -> Self {
        self.texinputs.push(input_dir.to_string());
        self
    }

    pub fn build(self) -> Result<PdfTex> {
        PdfTex::new(self.build_dir, self.jobname, self.texinputs)
    }
}

pub fn builder() -> PdfTexBuilder {
    PdfTexBuilder { jobname: None, build_dir: None, texinputs: vec![] }
}
