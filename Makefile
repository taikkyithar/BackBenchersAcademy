.PHONY: index catalog download verify web-dev web-build
BUDGET_GB ?= 2

index:      ; python3 -m crawler index --sizes
catalog:    ; python3 -m crawler catalog
download:   ; python3 -m crawler download --budget-gb $(BUDGET_GB)
verify:     ; python3 -m crawler verify
web-dev:    ; cd web && npm install --legacy-peer-deps && npm run dev
web-build:  ; cd web && npm install --legacy-peer-deps && npm run build
