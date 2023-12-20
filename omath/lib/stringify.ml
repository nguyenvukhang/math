let string_of_option f = function
  | None -> "None"
  | Some x -> "Some(" ^ f x ^ ")"
;;

(* Option<T> *)
let soo f x =
  match x with
  | None -> "None"
  | Some x -> "Some(" ^ f x ^ ")"
;;

let string_of_oint = soo string_of_int
let string_of_ostring = soo (fun x -> x)

let string_of_list (stringify : 'a -> string) xs =
  let rec go a = function
    | [] -> "[" ^ String.sub a 2 (String.length a - 2) ^ "]"
    | x :: xs -> go (a ^ ", " ^ stringify x) xs
  in
  go "" xs
;;

let string_of_int_list = string_of_list string_of_int
let string_of_string_list = string_of_list (fun x -> x)
