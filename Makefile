.PHONY: default
default: all


prod:
	@mkdir -p config
	@codectl template . -x templates/prod.yaml --set namespace=code-playground --set environment.name=prod --set environment.cluster=cae-prd-alln > config/cae-prd-alln-code-playground-prod.yaml
	@codectl template . -x templates/prod.yaml --set namespace=code-playground --set environment.name=prod --set environment.cluster=cae-prd-rcdn > config/cae-prd-rcdn-code-playground-prod.yaml


dev:
	@mkdir -p config
	@codectl template . -x templates/dev.yaml --set namespace=code-playground --set environment.name=dev --set environment.cluster=cae-np-alln > config/cae-np-alln-code-playground-dev.yaml
	@codectl template . -x templates/dev.yaml --set namespace=code-playground --set environment.name=dev --set environment.cluster=cae-prd-rtp > config/cae-prd-rtp-code-playground-dev.yaml


stage:
	@mkdir -p config
	@codectl template . -x templates/stage.yaml --set namespace=code-playground --set environment.name=stage --set environment.cluster=cae-np-rcdn > config/cae-np-rcdn-code-playground-stage.yaml

all: prod dev stage 