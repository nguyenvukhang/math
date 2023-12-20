open Minimath.Stringify

module PdfLatex : sig
  type child = private
    { stdout : in_channel
    ; stderr : in_channel
    ; stdin : out_channel
    }

  val init : unit -> child
  val write : string -> child -> unit
  val run : child -> unit
end = struct
  type child =
    { stdout : in_channel
    ; stderr : in_channel
    ; stdin : out_channel
    }

  let prog = "pdflatex"
  let args = [| prog; "-halt-on-error"; "-output-directory=_build"; "-jobname=minimath" |]
  let env = Array.append (Unix.environment ()) [| "TEXINPUTS=tex_modules/:" |]

  let print_channel (c : in_channel) =
    let rec loop () =
      let () = print_endline (input_line c) in
      loop ()
    in
    try loop () with
    | End_of_file -> close_in c
  ;;

  let init () : child =
    let stdout, stdin, stderr = Unix.open_process_args_full prog args env in
    { stdout; stderr; stdin }
  ;;

  let write (x : string) (c : child) = output_string c.stdin x

  let run (c : child) =
    close_out c.stdin;
    print_channel c.stdout;
    print_channel c.stderr
  ;;
end

let ( * ) a b = a + b print_int (10 * 10)
(* let content =InCh *)

let read_file filename =
  let lines = ref [] in
  let data = ref "" in
  let chan = open_in filename in
  try
    while true do
      let line = input_line chan in
      data := !data ^ "\n" ^ line;
      lines := line :: !lines
    done;
    !data
  with
  | End_of_file ->
    close_in chan;
    !data
;;

let x = read_file "../nonlinear-optimization-constrained.tex"
let pdf = PdfLatex.init ();;

PdfLatex.write "\\documentclass{article}" pdf;;
PdfLatex.write "\\usepackage{headers}" pdf;;
PdfLatex.write "\\begin{document}\n" pdf

let files =
  [ "../algorithm-design.tex"
  ; "../calculus.tex"
  ; "../complex-analysis.tex"
  ; "../nonlinear-optimization-constrained.tex"
  ; "../nonlinear-optimization-unconstrained.tex"
  ; "../ordinary-differential-equations.tex"
  ; "../plenary.tex"
  ; "../sandbox.tex"
  ; "../toc.tex"
  ]
;;

List.iter (fun x -> PdfLatex.write (read_file x) pdf) files;;
PdfLatex.write "\n\\end{document}" pdf;;
PdfLatex.run pdf
