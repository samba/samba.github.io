---
title: Introduction to Game Theory
layout: post
permalink: /learn/intro/game-theory/prisoners-dilemma
tweet_bottom: true
dont_tweet: false
hide_meta: false
date: 2016-10-14 00:15:23
tags:
    - game-theory
    - social-science

redirect_from:
  - /game-theory-prisoners-dilemma

---


[Game theory][12] is the science of understanding behavior among multiple
decision-makers in any system of rules.


## The Prisoners' Dilemma

In the classic [Prisoner's Dilemna][11], two suspects are asked to divulge
incriminating information about the other in exchange for a reduced penalty.
Each has the option of remaining silent. There's no communication permitted
between the suspects: they must act speculatively, judging the other suspect's
motives and character, while evaluating their own subjective risk/reward model.

This is usually modeled as a matrix:

|          |B: divulge   |B: silent    |
|A: divulge| 2x each     | B: 3x; A: 0 |
|A: silent | B: 0; A: 3x | 1x each     |
{:.border}

* If both divulge, they each get 2 years imprisonment as penalty.
* If just one divulges, he receives no penalty, and the other receives 3 years.
* If both remain silent, both receive a 1 year penalty.

Traditionally the interpretation of this exercise is that agents (i.e. suspects
or prisoners) act based on subjective evaluation of the same matrix, albeit
perhaps subconsciously, and that their behaviors can be influenced by altering
the risk/reward model. Within that model though is a fundamental truth: choice
can be manipulated by _limiting_ information.

It's worth noting that to the prison, in terms of total time served (in
"man years"), the model looks like so:

|          |B: divulge |B: silent |
|A: divulge| 4 M.Y.    | 3 M.Y.   |
|A: silent | 3 M.Y.    | 2 M.Y.   |
{:.border}

Assuming the prison somehow benefits from maximizing total penalties, it's in
the prison's interest to motivate each suspect to divulge out of supposed self-
interest. Presuming the suspects behavior is truly criminal (according to the
prevailing social contract), one could argue that the whole society shares the
interests of the prison, and therefore maximizing total time served by both
suspects is advantageous.

A worthy question though: what role would _private_ prisons play in this dynamic?

[11]: https://en.wikipedia.org/wiki/Prisoner%27s_dilemma
[12]: https://en.wikipedia.org/wiki/Game_theory