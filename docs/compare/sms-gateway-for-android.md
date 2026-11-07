---
title: Moving from SMSGate to SMS Mobile App
description: "What stays behind when you leave SMSGate, the steps to send your first reviewed job, and a dated fact table with sources."
sidebar_position: 2
last_update:
  date: 2026-11-07
---

import RivalFacts from '@site/src/components/RivalFacts';
import Steps from '../_partials/compare-steps.mdx';
import Limits from '../_partials/compare-limits.mdx';

# Moving from SMSGate to SMS Mobile App

SMSGate puts a REST API on your phone, for people who write their own software. SMS Mobile App has a web dashboard and a review screen, and no API.

## What stays behind

Anything that calls SMSGate's API or reads its webhooks has nothing to call here, and replies do not reach SMS Mobile App. If software triggers your sends, stay on SMSGate. Move only the sends a person prepares by hand.

## Steps

<Steps />

## What SMS Mobile App will not do

<Limits />

## The facts, with their dates

<RivalFacts slug="sms-gateway-for-android" />

The [comparison page](https://smsapp.aoneahsan.com/compare/sms-gateway-for-android) sets out who each one suits better.
