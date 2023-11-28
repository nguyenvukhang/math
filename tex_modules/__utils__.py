from os import curdir
from typing import TypeVar

T = TypeVar("T")


# get index `i` form list `l`, `d` if out of range
def get(l, i, d=None):  # type: (list[T], int, T | None) -> T
    return l[i] if (i >= 0 and len(l) > i) or (i < 0 and len(l) >= -i) else d


def run_observer(handler):
    from watchdog.observers import Observer
    from time import sleep

    observer = Observer()
    observer.schedule(handler, curdir, recursive=False)
    observer.start()
    try:
        while True:
            sleep(1)
    finally:
        (observer.stop(), observer.join())


# all substrings are included in any line in the buffer
def __starts_with__(buf, x):
    return any(map(lambda l: l.startswith(x), buf))


# buffer has any line that starts with substring
def __includes__(buf, x):
    return any(map(lambda l: all(map(lambda x: x in l, x)), buf))


def should_pretty_print(x):
    sw, inc = __starts_with__, __includes__

    return not (
        sw(x, b"This is pdfTeX")
        or sw(x, b"*geometry*")
        or sw(x, b"**entering extended mode")
        or sw(x, b"Package hyperref Warning")
        or sw(x, b"Underfull \hbox (badness 10000)")
        or inc(x, (b"texlive", b"texmf", b"latex"))  # system package
        or inc(x, (b"texlive", b"texmf", b"pdftex"))  # system package
        or inc(x, (b"(Please type a command or say `\end')\n"))
        or sw(x, b"LaTeX Warning: You have requested package")
    )


#
# now = lambda: datetime.datetime.now().strftime("%H:%M:%S")
# build = lambda: __build__(args)
# report = lambda: print("\x1b[33m[Last build: %s]\x1b[0m" % now())
# (build(), report())
#
# class EventHandler(FileSystemEventHandler):
#     def __init__(self, args):
#         self.args = args
#         self.last_trigger_time = time.time()
#
#     def on_modified(self, event):
#         if not event.src_path.endswith(".tex"):
#             return
#         current_time = time.time()
#         if (current_time - self.last_trigger_time) < 1:
#             return
#         self.last_trigger_time = current_time
#         (build(), report())
#
# observer = Observer()
# observer.schedule(EventHandler(args), os.curdir, recursive=False)
# observer.start()
# try:
#     while True:
#         time.sleep(1)
# finally:
#     (observer.stop(), observer.join())
