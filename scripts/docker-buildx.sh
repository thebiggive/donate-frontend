#!/usr/bin/env bash

## script Copied from https://github.com/CircleCI-Public/aws-ecr-orb/blob/e76d2fe9df77f13f1300a2e0472585219b697e5c/src/scripts/docker_buildx.sh

#MIT License
#
#Copyright (c) 2019 CircleCI Public
#
#Permission is hereby granted, free of charge, to any person obtaining a copy
#of this software and associated documentation files (the "Software"), to deal
#in the Software without restriction, including without limitation the rights
#to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#copies of the Software, and to permit persons to whom the Software is
#furnished to do so, subject to the following conditions:
#
#The above copyright notice and this permission notice shall be included in all
#copies or substantial portions of the Software.
#
#THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#SOFTWARE.

AWS_ECR_EVAL_REGION="$(eval echo "${AWS_ECR_STR_REGION}")"
AWS_ECR_EVAL_REPO="$(eval echo "${AWS_ECR_STR_REPO}")"
AWS_ECR_EVAL_TAG="$(eval echo "${AWS_ECR_STR_TAG}")"
AWS_ECR_EVAL_PATH="$(eval echo "${AWS_ECR_EVAL_PATH}")"
AWS_ECR_STR_AWS_DOMAIN="$(echo "${AWS_ECR_STR_AWS_DOMAIN}" | circleci env subst)"
AWS_ECR_EVAL_ACCOUNT_ID="$(eval echo "${AWS_ECR_STR_ACCOUNT_ID}")"
AWS_ECR_VAL_ACCOUNT_URL="${AWS_ECR_EVAL_ACCOUNT_ID}.dkr.ecr.${AWS_ECR_EVAL_REGION}.${AWS_ECR_STR_AWS_DOMAIN}"
AWS_ECR_EVAL_PUBLIC_REGISTRY_ALIAS="$(eval echo "${AWS_ECR_STR_PUBLIC_REGISTRY_ALIAS}")"
AWS_ECR_STR_EXTRA_BUILD_ARGS="$(echo "${AWS_ECR_STR_EXTRA_BUILD_ARGS}" | circleci env subst)"
AWS_ECR_EVAL_BUILD_PATH="$(eval echo "${AWS_ECR_EVAL_BUILD_PATH}")"
AWS_ECR_EVAL_DOCKERFILE="$(eval echo "${AWS_ECR_STR_DOCKERFILE}")"
AWS_ECR_EVAL_PROFILE_NAME="$(eval echo "${AWS_ECR_STR_PROFILE_NAME}")"
AWS_ECR_EVAL_PLATFORM="$(eval echo "${AWS_ECR_STR_PLATFORM}")"
AWS_ECR_EVAL_LIFECYCLE_POLICY_PATH="$(eval echo "${AWS_ECR_STR_LIFECYCLE_POLICY_PATH}")"
# shellcheck disable=SC2034 # used indirectly via environment in `docker buildx` builds
BUILDX_NO_DEFAULT_ATTESTATIONS=1

if [ -n "${AWS_ECR_STR_EXTRA_BUILD_ARGS}" ]; then
  IFS=" " read -a args -r <<<"${AWS_ECR_STR_EXTRA_BUILD_ARGS[@]}"
  for arg in "${args[@]}"; do
    set -- "$@" "$arg"
  done
fi
ECR_COMMAND="ecr"
number_of_tags_in_ecr=0

IFS=', ' read -ra platform <<<"${AWS_ECR_EVAL_PLATFORM}"
number_of_platforms="${#platform[@]}"

if [ -z "${AWS_ECR_EVAL_ACCOUNT_ID}" ]; then
  echo "The account ID is not found. Please add the account ID before continuing."
  exit 1
fi

if [ "${AWS_ECR_BOOL_PUBLIC_REGISTRY}" -eq "1" ]; then
  ECR_COMMAND="ecr-public"
  AWS_ECR_VAL_ACCOUNT_URL="public.ecr.aws/${AWS_ECR_EVAL_PUBLIC_REGISTRY_ALIAS}"
fi

IFS="," read -ra DOCKER_TAGS <<<"${AWS_ECR_EVAL_TAG}"
for tag in "${DOCKER_TAGS[@]}"; do
  if [ "${AWS_ECR_BOOL_SKIP_WHEN_TAGS_EXIST}" -eq "1" ] || [ "${AWS_ECR_BOOL_SKIP_WHEN_TAGS_EXIST}" = "true" ]; then
    docker_tag_exists_in_ecr=$(aws "${ECR_COMMAND}" describe-images --profile "${AWS_ECR_EVAL_PROFILE_NAME}" --registry-id "${AWS_ECR_EVAL_ACCOUNT_ID}" --region "${AWS_ECR_EVAL_REGION}" --repository-name "${AWS_ECR_EVAL_REPO}" --query "contains(imageDetails[].imageTags[], '${tag}')")
    if [ "${docker_tag_exists_in_ecr}" = "true" ]; then
      IFS="," read -ra PLATFORMS <<<"${AWS_ECR_EVAL_PLATFORM}"
      for p in "${PLATFORMS[@]}"; do
        docker pull "${AWS_ECR_VAL_ACCOUNT_URL}/${AWS_ECR_EVAL_REPO}:${tag}" --platform "${p}"
      done
      number_of_tags_in_ecr=$((number_of_tags_in_ecr += 1))
    fi
  fi
  docker_tag_args="${docker_tag_args} -t ${AWS_ECR_VAL_ACCOUNT_URL}/${AWS_ECR_EVAL_REPO}:${tag}"
done

if [ "${AWS_ECR_BOOL_SKIP_WHEN_TAGS_EXIST}" -eq "0" ] || [[ "${AWS_ECR_BOOL_SKIP_WHEN_TAGS_EXIST}" -eq "1" && ${number_of_tags_in_ecr} -lt ${#DOCKER_TAGS[@]} ]]; then
  if [ "${AWS_ECR_BOOL_PUSH_IMAGE}" -eq "1" ]; then
    set -- "$@" --push

    if [ -n "${AWS_ECR_EVAL_LIFECYCLE_POLICY_PATH}" ]; then
      aws ecr put-lifecycle-policy \
        --profile "${AWS_ECR_EVAL_PROFILE_NAME}" \
        --repository-name "${AWS_ECR_EVAL_REPO}" \
        --lifecycle-policy-text "file://${AWS_ECR_EVAL_LIFECYCLE_POLICY_PATH}"
    fi

  elif [ "${AWS_ECR_BOOL_PUSH_IMAGE}" -eq "0" ] && [ "${number_of_platforms}" -le 1 ]; then
    set -- "$@" --load
  fi

  if [ "${number_of_platforms}" -gt 1 ]; then
    # In order to build multi-architecture images, a context with binfmt installed must be used.

    if ! docker context ls | grep builder; then
      # We need to skip the creation of the builder context if it's already present
      # otherwise the command will fail when called more than once in the same job.
      docker context create builder
      docker run --privileged --rm tonistiigi/binfmt --install all
      docker --context builder buildx create --name DLC_builder --use
    fi
    context_args="--context builder"
  # if no builder instance is currently used, create one
  elif ! docker buildx ls | grep -q "default * docker"; then
    set -x
    if ! docker buildx ls | grep -q DLC_builder; then
      docker buildx create --name DLC_builder --use
    else
      docker buildx use DLC_builder
    fi
    echo "Context is set to DLC_builder"
    set +x
  fi

  set -x
  docker \
    ${context_args:+$context_args} \
    buildx build \
    -f "${AWS_ECR_EVAL_PATH}"/"${AWS_ECR_EVAL_DOCKERFILE}" \
    ${docker_tag_args:+$docker_tag_args} \
    --platform "${AWS_ECR_EVAL_PLATFORM}" \
    --progress plain \
    "$@" \
    "${AWS_ECR_EVAL_BUILD_PATH}"
  set +x

fi
