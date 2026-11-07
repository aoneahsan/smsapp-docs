---
title: Moving from Traccar SMS Gateway to SMS Mobile App
description: "What stays behind when you leave Traccar SMS Gateway, the steps to send your first reviewed job, and a dated fact table with sources."
sidebar_position: 6
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';
import Steps from '../_partials/compare-steps.mdx';
import Limits from '../_partials/compare-limits.mdx';

# Moving from Traccar SMS Gateway to SMS Mobile App

Traccar SMS Gateway gives a Traccar server a small HTTP API for sending alerts through a phone. SMS Mobile App is for sending one message to a list of people.

## What stays behind

These two do different jobs, so there is rarely a real migration. Server alerts need an API and we have none: keep Traccar's gateway for those, and use a job here only for messages a person writes.

## Steps

<Steps />

## What SMS Mobile App will not do

<Limits />

## The facts, with their dates

<RivalFacts slug="traccar-sms-gateway" />

The [comparison page](https://smsapp.aoneahsan.com/compare/traccar-sms-gateway) sets out who each one suits better.
