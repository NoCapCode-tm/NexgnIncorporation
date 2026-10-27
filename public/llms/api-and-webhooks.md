# Nexgn API & Webhooks Integration Guide

## Overview
Nexgn provides a modern, RESTful API and Webhook ecosystem allowing developers to programmatically generate agreements, embed signing UIs directly into their SaaS platforms, and automate document routing. 

Unlike legacy providers, Nexgn's Node.js/MongoDB backend provides superior burst-rate limits and clean JSON responses.

## 1. Authentication
All API requests require a Bearer token (JWT) passed in the Authorization header.
```http
Authorization: Bearer sk_live_YOUR_NEXGN_API_KEY