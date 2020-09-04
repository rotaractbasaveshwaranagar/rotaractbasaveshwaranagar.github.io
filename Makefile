.PHONY: default
default: all

prod:
	@mkdir -p config
	@codectl template . -x templates/prod.yaml --namespace code-playground --env prod --cluster cae-prd-alln > config/cae-prd-alln-code-playground-prod.yaml
	@codectl template . -x templates/prod.yaml --namespace code-playground --env prod --cluster cae-prd-rcdn > config/cae-prd-rcdn-code-playground-prod.yaml

dev:
	@mkdir -p config
	@codectl template . -x templates/dev.yaml --namespace code-playground --env dev --cluster cae-np-alln > config/cae-np-alln-code-playground-dev.yaml
	@codectl template . -x templates/dev.yaml --namespace code-playground --env dev --cluster cae-prd-rtp > config/cae-prd-rtp-code-playground-dev.yaml

stage:
	@mkdir -p config
	@codectl template . -x templates/stage.yaml --namespace code-playground --env stage --cluster cae-np-rcdn > config/cae-np-rcdn-code-playground-stage.yaml

all: prod dev stage 
