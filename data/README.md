# data/ — downloaded textbooks (not in git)

`data/pdf/<grade>/<subject>/<catalog-id>.pdf` is produced by `python3 -m crawler download`.
`data/manifest.json` (tracked) records sha256, size, page count and origin URL of every file that was downloaded,
so anyone can verify a mirror with `python3 -m crawler verify`.

Full corpus size is ~5 GB for one preferred copy of every book. Use `--budget-gb` to fetch what fits:

    python3 -m crawler download --budget-gb 2            # broadest coverage first, small files first
    python3 -m crawler download --grades 5,6 --kinds textbook
