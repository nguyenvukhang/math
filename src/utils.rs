use anyhow::Result;

use std::fs;
use std::io::Write;
use std::path::PathBuf;

use crate::prelude::TexFile;

/// Lists files in the current directory, with the `./` prefix stripped.
pub fn list_dir() -> Result<Vec<PathBuf>> {
    let mut ls = fs::read_dir(".")?
        .filter_map(|v| v.ok())
        .map(|v| v.path())
        .map(|v| v.strip_prefix("./").map(|v| v.to_path_buf()).unwrap_or(v))
        .collect::<Vec<_>>();
    ls.sort();
    Ok(ls)
}

/// Lists the .tex files in the current directory.
pub fn tex_files() -> Result<Vec<TexFile>> {
    Ok(list_dir()?
        .into_iter()
        .filter(|v| v.extension().map_or(false, |v| v == "tex"))
        .map(|v| TexFile::new(v))
        .collect())
}

/// Extend a file list. Used when the `--all` flag is used for building.
pub fn extend_file_list(files: &mut Vec<PathBuf>) {
    for f in tex_files().unwrap_or_default() {
        let f = f.path().to_path_buf();
        if !files.contains(&f) {
            files.push(f)
        }
    }
}

/// Write all elements of an iterator into a target
pub fn write_all<W: Write, S: AsRef<str>>(
    target: &mut W,
    iter: impl IntoIterator<Item = S>,
) -> Result<()> {
    for v in iter {
        writeln!(target, "{}", v.as_ref())?;
    }
    Ok(())
}
