/**
 * When we build the site for deployment to AWS S3 and AWS ECR/ECS we need to use a consistent node version,
 * partly for compatibility with our code, but also to make sure that all generated js chunk checksums match up
 * so that the two builds will work together as one app and not fall over with 404 errors as we saw in DON-1073
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from 'path'
import {readFileSync} from "node:fs";
const expectedNodeVersion = '20.13.1';

const modulePath = dirname(fileURLToPath(import.meta.url));

test('should only have the expected node version mentioned in circle config for S3 build', async () => {
  const circleConfig = readFileSync(resolve(modulePath, '../../.circleci/config.yml')).toString();
  const nodeMentions = [...circleConfig.matchAll(/node[0-9\\.]+/g)];
  nodeMentions.forEach(match => {
    assert.equal(match[0], `node${expectedNodeVersion}`);
  })
});

test('should have the expected node version mentioned in Dockerfile for ECR/ECS build', async () => {
  const dockerFile = readFileSync(resolve(modulePath, '../../Dockerfile')).toString();
  const nodeMentions = [...dockerFile.matchAll(/node:[0-9\\.]+/g)];
  nodeMentions.forEach(match => {
    assert.equal(match[0], `node:${expectedNodeVersion}`);
  })})
