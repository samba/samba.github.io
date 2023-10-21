---
layout: post
category: leadership
tags: leadership, starup, team
title: New startup, new team, new game
date: 2023-10-19 21:07:54
---

It's been a couple adventurous years since I last published here.
This is a bit of a _lessons learned_ post; a few quick reflections.

One should always learn from their work. In this post I mostly focus on culture and leadership. Other lessons in technical and practical topics for another post.

## Mesosphere

In mid 2018, I joined Mesosphere, to help them establish a new Kubernetes platform offering.
This proved to be a radical shift in their strategy, formerly based on the Mesos technology they had invented.

As I've [written before][chaos], this episode was profoundly enlightening, provided a proving ground for leadership ideas I believed but had until then not had an opportunity to apply. I'm forever grateful to all those who partnered with me in that success.

In early 2021, I left Mesosphere/D2IQ, during a period of volatility among their leadership.
After helping them establish a new strategy on Kubernetes, they asked me to help lead product management.
Some prominent leaders had recently left, and I waited long enough for the dust to settle, to see how it was going to shape up.
At the time, I could not shake the feeling that my talents in engineering leadership were critical to the company's success, than direct product leadership.
Whether indicative of the challenges, or a byproduct of my own departure, several other colleagues' departure only confirmed my sense of turmoil in the company culture.
Sadly, even more recent layoffs confirmed it again.

Turns out, ideas shape behaviors, behaviors drive culture, and culture determines business outcomes. 

Well, that's a lot of water under the bridge. Mistakes were made; I made a few too.

A few key lessons from D2IQ:

* Launch as fast as you can, but start by consciously iterating with internal feedback loops from the people who know your customer best. Accept that your first product will not meet all your customer's needs, and you will have to change it as you learn more about their needs. "2.0" happens for good reasons.
* People are sometimes more committed to _how to work_ than to _which customer needs to meet_.  This leads to various dysfunctions in the organization. People (organizations) struggle to grasp that changing _how_ we work and _how_ we organize is often necessary to meeting customer's needs. Empowering the "lowest" people in the org-chart to change _how_ they work and how they organize, to meet customers' needs fastest, will always win the market.
* Culture needs to embrace change, not resist it -- this is probably the hardest, because people fear what they don't know. They perceive "chaos", but this should be guided by a central mandate, to reorganize as quickly as possible to meet customers' needs -- as quickly as possible. Speed matters.
* Surprising people with changes they didn't approve will always lead to debate. This has to be managed carefully, because it can a waste of precious time. Embracing change requires constantly re-inforcing trust -- this counteracts the fear. Relationships between people (across all teams) are vital to maintain. In your culture, the "why" and the "what" (outcome) must be more important than the "how" (method, design, plan). Plans will always change. Perfect planning is waste. We must accept that we will learn, and learning requires change. Get good at change.

## Mycelial

I spent the next six months attempting to kickstart another startup with another product, this time taking systems orchestration into new frontiers -- the farther reaches of civilization.
Generally that group of cofounders were great. That company is still going, and I'm glad to see their persistence and I hope for their success.
Ultimately I left it for one major reason, one with side effects: leadership, again. It matters very much, How we treat each other early on, when the problems are ambiguous and the stresses run high.
Lesson learned though: before committing, make sure the people you're committing to know how to manage their stress, with compassion and kindness.

> *Pro Tip:* if you feel like you have to yell at someone at work, you should probably start by taking the day off. Cofounders should not yell at each other.

Seconarily, another case when the _how_ was too important. Some people are more committed to the new shiny thing than they are to acually shipping product quickly and iterating. That's a serious red flag, in a startup. (Ironically, the same people kept quoting, "choose boring technology.")

Again, water under the bridge.  The yelling dude since left that startup too, and their product direction seems to be evolving rapidly.
I sincerely wish them all well, but in particular, I hope dude starts a meditation practice, and I hope his new crew benefit from his newfound tranquility.

## Amazon EKS

Late 2021 through mid 2023, I joined Amazon EKS.
When I joined them in 2021, they were lagging fully a year behind their competitors' Kubernetes minor version releases, with release projects requiring 16 weeks coordination across some 14 teams across AWS.
By the time I left, we had launched Kubernetes (EKS) 1.27 ahead of all our competitors, and only about 4 weeks after it was released upstream.

I had accomplished what I came to do:  make a repeatable, strategically impactful change in the organization that leads to better outcomes for customers and advances our position in the market. Also, a 400% acceleration of the release management isn't too shabby.

The real challenge at EKS wasn't in the technology, though there were (and are) many unsolved (but largely solveable) problems in their technology.
No, the real challenge was in organizaitonal thinking.  Not a surprise, really.

The 400% improvement in release management came by applying discipline in two critical areas:

* Software quality management - faster, better testing at critical stages, earlier, to avoid rework and delays.
* Project management across teams - coordinating the right actions at the right time, proactively, and ensuring that teams were not introducing new (avoidable) risks late in the process.

A little bit of Deming, Goldratt, and Ohno goes a long way.

Neither of these are rocket science. No one would intentionally neglect them, either.
No, the state of the organization when I started on this problem was largely unintentional, a byproduct of two critical gaps:

* Leadership of the organization was focused on triaging immediate problems, and struggled to invest in long-term thinking.
* With reactive management, the priority of developing the right skills among managers was too low, to sustain higher organizational outcomes.
* Managers were therefore usually fighting fires, and had neither the time nor the awareness to proactively improve these processes.


Well, after having made some significant strides in this area, with results visible in the public market, I then made a big mistake.
Upper management had wanted "automation" to improve the release process, but in a group meeting among managers, I highlighted the fact that the gains were mostly not from automation, actually, aside from a bit of test automation, and that actually the gains came from process improvement, project management, and quality management.
To an organization that prizes automation, and to leaders with pedigree as founding engineers of the product, this may have been a bit of a slap in the face.
My bad. I'll mind my audience a bit more in the future.

Actually the reason I highlighted the cause of those gains remains legit: in general, automating complex processes with insufficient validation, and significant "failure demand" (retries, rework when failures occur), is usually en exercise in futility. That's a major cause of technical debt in many organizations.
If humans don't actually understand the process enough to optimize it, they probalby shouldn't be automating it yet.
Automating the wrong process is also a quick way to *miss* your business goals too.
Categorically though, "a system cannot understand itself", and any time a recurring process requires coordination across multiple teams, you can't expect them to accidentally optimize it.

Are there exceptions to this pattern? Probably, but I haven't seen one yet.
I have yet to see a repeatable success of automating something that we don't understand.

Lesson learned: Automating parts of a process, where inputs, outpus, flows and feedback loops are well-defined and measureable -- do this in as small of pieces as possible, as early as possible.

I'll admit another mistake, and thanks to one product manager who highlighted it for me -- his advice, in retrospect, was to "boil the frog."
I came on too strong with the big picture outcomes and ambitious goals, in this project.
This was problematic, because the goals and outcomes were only achievable with significantly different principles in play, and they required essentially redesigning major parts of the EKS delivery pipeline. Understandably, this was perceived as a big risk.
After a false-start in pitching that redesign project, I worked with my manager to identify some intermediate goals ("milestones") which by observation of the process should yield significant reduction of some types of "failure demand" rework.
This proved successful, as it provided an avenue for measureable progress on smaller scopes of change, which were easier for management to buy into.
I'll call that an object lesson in "earning trust" (in Amazon terms).

I tried something new in that setting though, which proved extremely impactful (channeling a bit of Goldratt here).

* I continually measured and reported the overall duration of the release process in every cycle, at the macro level, because this was the context of the business goal.
* I steered the project planning toward critical parts of the release process that failed most frequently, or had the most time impact in failing.
* I defined the _measure of success_ for each milestone in terms of _actually measured performance_ in process duration and failure rates.
* With my team, we identified several (dozen) candidate system improvements, and frequently re-tried those parts of the process, to determine if we were meeting the measured goal.
* We _stopped_ improvement activities when we met the performance and reliability goals. (This let us pivot when performance was good enough.)

By the time we finished, we had reduced failure rates on critical processes from 8 cycles to 4 per release, and reduced its duration (i.e. cost of failure) from 1 week per cycle to 1 day. This meant that every failure could recover faster, without impacting the project timeline, but also shortened the timeline by removing several causes of failure.

This all sounds like project management, and it is... but at EKS, this was a culture change (i.e. leadership), because the legacy culture focused heavily on micro-optimizations.
The improvement project methodology allowed us focus on the _broader impact_ of small actions, while avoiding unnecessary system changes, minimizng change effort in total, and achieving significant overall performance gains in a fairly short time and relatively few headcount.

In short, we met our business goal with the minimum investment, as early as possible.

The major learning here was actually about organizational thinking. It was not feasible to radically shift organizational thinking, even in half a year. In part this is due to a lack of executive mandate across the whole organization. Historically most such projects are "owned" by individual teams, but success requires change across all teams.

It was necessary to fit some of the existing habits of the organization, and adapt them gradually.
Further, it was not possible to actually teach the principles as theory alone. Believe me, I tried.
Alas, in that organizational setting, they cannot be taught -- only demonstrated, and through outcomes, proven.

By the end, we achieved a 400% improvement in release process efficiency, and met a business goal that had been missed for all of the preceding 5 years. None of this would have been possible without the broad critical analysis, proactive experimentation, and collaboration of my team, and support of certain peers. In particular, a special thanks to Ahmed Ibrahim, a highly effective colleague and even better friend, who partnered with me in these endeavors, running the day-to-day recurring projects across many teams, and employing the tools, processes, and disciplines we identified to improve it.

I will always remember one specific comment Ahmed, in a private conversation after I left. I will paraphrase:

> In my culture, we don't value hard managers; we recognize that good managers have a kind of *love* their teams.

I left Amazon in good conscience, putting them in a better position than when I joined, and with measureable, market-visible impact.


## The Next Chapter

I've since joined a stealth startup working in AI. (Who doesn't love a buzzword?) Naturally my work also has something to do with Kubernetes, at this point.

This project is uniquely ambitious. While some weeks are harder than others, I know that every day is a step toward a bigger impact on an industry, and I sleep well knowing that my skills are applied in a multiplicative effect.

I love the team I'm building. I love their attitude: always learning, always supporting each other, and moving as fast as possible toward something we've never done before.
We believe we can do it, because we trust each other, and we're collectively accountable for our combined success.
We listen humbly, because we value the diverse wisdom and experience, and we'll adapt our plans to avoid the problems we've seen before.
We are in it, to win it, together.

The methods I've learned for leadership, cultural influence, teaching, organizational evolution, systems thinking, customer empathy, product iteration, automation, and quality management all apply, every day.
The principles of kindness, hope, persistence, determination, experimentation and collective learning all continue to prove worthy for the biggest undertaking I've contemplated.

I'm also hiring, rapidly, for a variety of specialty skills. If you want to work with such a team, feel free to reach out. (You can find me on LinkedIn.)


## And the next one after that...

Somehow, amid all this, my thoughts turn to the distant future in the stars, of what humanity can become with the right ideas, values, and changes to our systems.
Our future is bright, if we can change ourselves to be worthy of it. (I am writing on this topic separately, to pubilsh another time, in another place.)

For tonight, and until next time -- good luck to you.


[chaos]: /blog/2019/lean/software/agile/product/orchestrated-chaos
