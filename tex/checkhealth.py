import os, re

ALL_OK = True


def get_tex_files():
    return list(filter(lambda x: x.endswith(".tex"), os.listdir()))


def read_file(filename) -> str:
    with open(filename, "r") as f:
        return f.read()


Ids = dict[str, list[str]]


def get_duplicates(filename: str, data: str, ids: Ids):
    res = re.search("\\\label{([0-9a-z]{7})}", data)
    while res != None:
        id = res.groups()[0]

        t = ids.get(id, [])
        t.append(filename)
        ids[id] = t

        data = data[res.span()[1] :]
        res = re.search("\\\label{([0-9a-z]{7})}", data)


def assert_unique_ids():
    global ALL_OK
    tex_files = get_tex_files()

    ids = {}
    for f in tex_files:
        get_duplicates(f, read_file(f), ids)
        print

    dups = [(k, v) for k, v in ids.items() if len(v) > 1]

    if len(dups) > 0:
        ALL_OK = False
        print("Duplicate ids found:")
        for k, v in dups:
            print(f"{k}")
            [print("\t*", v) for v in v]


assert_unique_ids()

if ALL_OK:
    print("All checks passed!")
