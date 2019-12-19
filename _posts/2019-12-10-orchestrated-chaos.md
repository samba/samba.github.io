---
title: "Orchestrated Chaos: a Tale of Radical Progress"
date: 2019-12-10 21:17:20
categories: lean software agile product
tags: lean software agile product management leadership
excerpt_separator: "<!-- more -->"
---

*How my team pivoted a product strategy, delivered a product from idea to alpha in weeks, and launched a new product with mind-boggling speed.*

This year in my career has been absolutely amazing. We've delivered profound results by learning a new way to produce software that our customers love, quickly and responsively. This story conveys my recollection of this pivotal time in our careers, and the agile software principles that made us successful.

<!-- more -->

We build distributed systems, which adapt and evolve to be resilient in unforeseen conditions, in unforeseen environments.  We deliver software that must work at scales ranging from fairly small to very large, from just a few machines too many thousands in a datacenter. We rely heavily on open-source technology, particularly Kubernetes and related ecosystem. 

The systems we build are necessarily complex, but our customers demand simplicity, so reliable automation is fundamental to our success. It's commonly said that a distributed system should be understood as perpetually in a state of partial failure, while remaining fully operational for the customer's workload. Our work must be intentionally responsive to failure, and automatically recovering to health.  Customers' workloads, whenever possible, should *not* be effected by a component failure in the system: instead the system should recover itself, and the workload should recover without manual interaction from our customer. We deal with deep networking and infrastructure, asynchronous orchestration of machine lifecycles, and coordination of workloads across many machines. Kubernetes solves many problems with this basic paradigm, and fits our customers' needs wonderfully.

To my team of brilliant engineers, I want you all to know that I'm reminded every day why I love working with you, in spite of our challenges, because not only do we _see_ a brighter future ahead, we all strive _together_ to make it a reality. 

I'd particularly like to thank Amr Abdelrazik, my friend and (former) colleague, at that time my product manager, for his ambition, curiosity, and determination to learn with me, as we discovered new ways of working, to deliver amazing new results. Amr, your strong opinions and our productive disagreement will forever be unmatched. 

(*NB* I may revise this when colleagues share perspectives that better inform my interpretation of these past situations. Opinions here are stated from my subjective point of view.)

## Filling the Allotted Time
I joined this company just over a year ago. I encountered a culture which was imposing a unique multi-layered variety of Scrum on many teams. I'm told that in the year before my joining, they went from "complete chaos"  -- i.e. no recognizable process, no reporting, no velocity data -- to the rigid structure I observed on entry. I have no doubt that this represented significant progress.

The process they had embraced was effectively a *phase-gate* model of development, which they had called "dual-track Scrum", entailing a  *design* process for one feature happening simultaneously with the *development* of another, while still shepherding another through a subsequent QA process.  The design phase was allotted one month, and the development phase was _also_ allotted one month.  In a given month design work for feature N+1 was expected to be done, at the same time as development for feature N, while  N-1 is still in QA. Therefore our 4-week iteration is spread across 3 different features *at a minimum*, and most teams would have several features in each iteration. So a team's attention is on anywhere between 3 and 15 things at all times.  Also, any one feature has a cycle time of 3 months *if all goes to plan*. (sigh.)  

As they say, the work expands to fill the allotted time. The long-ingrained culture of this group prized individual engineering prowess, rewarding people for delivering complex things individually.  Engineers would take on features, for design, which were allowed to represent 4 weeks of work complexity. So they *planned* work at that scale, seemingly striving to _achieve_ complexity that would fill 4 weeks. As an unintended consequence, when they planned for 4 weeks' complexity, it was a gamble that they'd actually complete their expected scope, or that they'd be within an order-of-magnitude on time complexity. Granted, the technology context of their work at that time implied significant complexity: it was fundamentally complex software, and the architecture would have benefited from grounding principles, separation of concerns, and simplifying assumptions. 

Now, I have to take their word for it, that this 4-week window approach was an improvement over the past conditions. I hear tales of features that hadn't launched even after 2 years of development. If you squint, you'll see shadows miming these tales, hinting at scope creep, confusion about customers' needs and the diffusion of goals as time passed without validation.  I can imagine it being worse. I can imagine missed deadlines because of unexpected complexities. I can imagine taking shortcuts in a hurry, long after the initial deadline had passed, only creating new complexities to surprise some unfortunate soul in a future iteration. It must have been chaos. I've survived scenarios like that before too, they're scary.

## A New Horizon
After a few months of my blurting out ideas on fluid planning, rules of prioritization, faster iteration, economics of cloud computing and datacenter, and risk models of software development, apparently someone decided I was worth taking a bet on. 

One day, they asked me to visit HQ, to plan with a small cohort the development of a brand new platform built entirely from open-source components, most significantly Kubernetes. We had 5 days to define the plan, and 30 to execute the plan, to get an MVP in front of customers.  Let's just say I'm never afraid to test my mettle.

We pulled a few people together to drive some quick decisions on the high-level points of the project, to define scope and constraints, and establish some rough prioritization. After a few days of talk and research, we had a plan worth betting on. I pulled my team of (then) 6 engineers together, raised a toast to a new future, and declared our new mission.  The next day, on the flight home, I started drafting a new way of working. The old way was clearly not going to work here: what got us to where we were -- 3 month cycles -- was clearly not going to get me where I needed to be in 30 days.

This made for an exciting week, to say the least.

## Discovering Success
This project would not have been a success without having the right people, a clear mission, and trust. We all drove as fast as we could, making the best decisions we could at that time, even though we couldn't all be staring at the same dashboard all the time. We did amazing work, with brilliant people having significant relevant experience, and a drive to change the game. A few of us had actually built platforms like this before, in projects spanning the previous two years, so it was very familiar territory. We still had bruises and lumps from the lessons we learned, mistakes we made previously.  We built it together, through dialogue, discovery, and determination. 

*The first*, and perhaps most **fundamentally important** thing we changed was our iteration horizon. We adopted a *weekly* release cycle, and delivered demo-ready code from day 1.  With weekly releases, we delivered demos to sales people, and soon the customers they brought in, to get feedback as quickly as possible.  This fast cycle is _essential_ because quality results from being _responsive_ to customer feedback. If the customer doesn't *see* it change, you may as well not have done the work yet.

*Second*, every engineer on my team got to talk with sales people and customers, to understand their concerns, use-cases and product painpoints along the way. We intentionally aimed for a *very simple*  user experience (compared to the past products of this company) and we heard directly from the users who were effected by it: we understood their pain and their joy. When they loved it, we heard it from them directly.

*Third*, we prioritized that feedback. We put that on the top of our queue. When there was a quick-win available, we got it done in the next release. We turned around bug reports within a week, sometimes within a day.  In some sense this is *shortest job first* but only when it's validated by customer feedback.

*Fourth*, we prioritized *completing end-to-end workflows*, while constraining the scope of each one as tightly as possible. If a change allowed a customer could use the product to do something new, that was valuable, we'd ship it.  We'd cut scope aggressively to narrow the immediate goals. If we needed only one storage solution to solve a set of problems, we'd **actively avoid**  any work associated with supporting a secondary storage solution, instead favoring completion of all functionality that we could on just the one. We deferred *a lot* of optional features, and then in a future week when they were relevant or necessary, we'd deliver them after all.

*Fifth*, we *aggressively* avoided reinventing the wheel. We used open source software to fill in the gaps, where it would buy us time, to complete those end-to-end workflows as rapidly as possible.  We integrate Kubernetes and several ecosystem tools on top, so we benefit greatly from the community. This means we *intentionally* structure our roadmap to incorporate solutions that align with community projects, and we will participate in community roadmaps to fulfill our shared goals.

*Sixth*, we paired, tag-teamed, and brainstormed together how to unblock these things daily. Where we hit unexpected issues, we cut scope, deferred, and focused on delivering what value we could in that week. Fundamentally, **we accelerated decision-making through dialogue**, by leveraging the wisdom and experience of everyone on the team.  We were all focused on the goal (a 30-day MVP) so we *together* looked for good near-term solutions. 

*Seventh*, to support all this, we virtually did away with the legacy of Scrum, and replaced it with a Kanban workflow. I worked closely with my product manager to ensure the team's backlog was always *focused* and prioritized, based on the principles above, so the engineering team could apply their focus to the most valuable impact they could have on the shortest possible timeframe. We applied a guiding rule, that if the problem couldn't be solved in 1 or 2 days, it needed to be broken down more or deferred until we understood it better. This allowed engineers to push back on the process, _in favor of fast delivery_ so we **avoided front-loading research and design** effort.  We adopted Kanban, in principle, because it affords us the feedback loop we need with customers on this weekly cycle, without imposing overhead for planning and estimation. We practically replaced planning and estimation for big complex things by _not prioritizing_ big complex things: we made them small and clear instead, and picked only the most impactful pieces.

*Eighth*: I removed myself as a bottleneck. Being an engineer for many years, I naturally have opinions, but if I assert *engineering* opinions in this context, I'm probably slowing things down. I focused instead on informing *values* of user experience simplicity, and occasionally architectural principles of *separation of concerns* and similar. Sometimes I'd relax these too, if it seemed I was getting in the way.  If I'm going to slow things down, I better have a darn good reason. My focus, and the focus I wanted to foster in my team, was launching a fantastic product as quickly as possible. (Reducing time to market lifts ROI.)

None of this works if the culture and environment stifles creativity or undermines trust.  Teams must be able to self-organize, clearly understand shared goals and vision, and respond to intrinsic uncertainty of our work together. Team culture must specifically counter-balance fear, in the face of this uncertainty, by establishing leverage *for the team* to respond to customer feedback and ultimately to build their own success.  If the team believes they have the power to radically improve their outcomes, they're more likely to do something about it. [I'll share more on the necessary leadership dynamics in a future post.]


## Results Speak for Themselves
Our first alpha deployment for a customer was *three weeks* after development started. That alone blew me away. Not only did we do something this company had never done before, we actually **beat the original target** of 30 days. 

After the first 6 weeks, we were considering it "early beta", and inside sales was starting to gain interest. I'm told we sold some deals through the customer feedback cycle, somewhere in the low seven figures  around this time, _before the product even launched_. 

We continued in *beta* for several more weeks, getting more feedback (validation) from customers, and iterating over it to improve some longer-term sustainability concerns. We had kept track of a few issues we'd observed in our early prototypes, and wanted to resolve these before we had clusters in production. Some were byproducts of shortcuts we had taken intentionally. For some reason people think this is a bad word, but I call that technical debt.  That phrase doesn't scare me. I also use a credit card, and have to pay it down monthly.

Around 14 weeks or so, we were starting to view it as *ready for production*, and officially launched it. I had taken a vacation at that time, so my team actually launched it without me. (I might not take that approach in the future.) Press releases went out, a new site was launched... oh, the company also changed names, and started a re-org around the new product strategy.  

I'm told that our sales pipeline has radically changed too, showing something like a 230% increase over the prior quarter. Not bad at all. Optimizing for *fast*, iterative impact has served us well. 




