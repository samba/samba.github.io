---
layout: post
categories: agile analytics data-structure
tags: 
- analytics 
- measure 
- lean
- agile
title: Data Model Fluidity in Analytics
published: true
pinned: true
author: samba
date: 2016-10-26 16:10:56
description: Disciplines for a Sustainable Analytics Development Workflow
redirect_from:
  - /fluid-analytics-data-model
---

The world of data, intelligence and analytics perpetually evolves, so too will the data structures we work with. With the rising popularity of [data lakes][4], there's a steadily increasing need for developers, consultants, and vendors to work with all kinds of data, be it [structured][2], [unstructured][3], or [semistructured][1].

If you haven't already categorized your work in these terms, you should probably start. It can be quite helpful in avoiding using the **wrong** tool for the job.

While this piece focuses in part on the Google Analytics ecosystem, the major principles should be applied in many other domains as well. The same notions of *stricture*, abstraction, and semantics apply in all analytics *collection* environments. One of my current projects acquires such data from back-end `.NET` application logs, and feeds them into Amazon Redshift; the same problems and ideas apply there too.

* TOC
{:toc}

## Ode to Structured Data

The problems of [structured data models][2] arise from its legacy: many vendors' systems are built around performance, from an age when the most obvious way to achieve performance was to constrain the fields that your application could populate.

Who of you, consultants in the Google Analytics field, remember its genesis as [Urchin][6]? You may recall the days when we had only Pageviews, and then Google's extension of the data model to incorporate Events (interactions). Many consultants found the Category/Action/Label model too limiting, so they tucked multiple other values (concatenated) into the Label field. This often proved unwieldy for analysis, so we asked Google for [Custom Variables][9], and they gave us 5 "slots" to combine any key/values we wanted, initially.

See a trend here? They've long operated on *fixed structures*, which imposes limits on the kinds of things we can express about a particular interaction. With the addition of [Custom Dimensions][10] and Metrics, our capabilities in GA have improved, however we're still bound by a structure, even if it's so "wide" that we may rarely find its limits.

These trends persist, in any analytics platform which attempts to *extract* a fixed set of properties from its data stream; they have to assume some kind of schema to the data, to populate a consistent representation, which eventually becomes the reports you rely on.

## The Rise of Semistructured Data

Vendors such as [Keen.io][7] and [Mixpanel][8] took a fundamentally different approach, because they built their products on newer technology and under newer paradigms of computing. They turned the legacy problem on its head, focusing on *a dynamic query* capability at _reporting_ time, and rather than modeling the data to a fixed structure at _collection_ time.

They operate on a different assumption: you, the developer or consultant, need to collect everything you know in the app, rather than *just* what the analytics platform planned for (years prior).


To support this, these and other vendors adopted a simple convention: **let a developer push anything** _as JSON_.

Two important points to that assumption:

- The developer knows what they need to record; the analytics platform shouldn't limit the business context.
- There's a flexible, standard data format available basically anywhere: JSON.

JSON is just the *encoding*, while the semantics of the data model are left to the developer, removed from the analytics platform's own logic.

### Psuedo-structured

Google's Tag Manager provides a similarly flexible `dataLayer`, but it fundamentally acts as a middle-ware to the same (old) Analytics platform: your GTM configuration just *remodels* the `dataLayer` events into something that fits Google Analytics. GTM's function is _good_, provided our *business semantics* can either be sufficiently represented within the Analytics model, or we use GTM to augment Analytics with other platforms too.

In mobile applications, Firebase now accommodates some semi-structured analytics model as well, but this is built on BigQuery, a much newer technology than Google Analytics. The legacy mobile integration in Google Analytics remains *fixed* in structure, just like its web counterpart.

## Model Mutation

I love the flexibility that semi-structured models provide. Instead of warping our *business context* to fit the abstract, generic things in a prescribed structure (e.g. Event's Category, Action, Label), our data can be *semantically* modeled.

That's great, until things change... which is, of course, inevitable.

The chaos monkey takes many forms. The business case evolves when new services plans are added, the UI changes when new payment options are added, and occasionally a developer will alter the attributes of an analytics (or `dataLayer`) event without notifying the analytics stakeholders. Something you couldn't have planned for will throw a wrench in your beautifully architected data model.

### The Hazards Of Weak Structure

Models with great flexibility increase the propensity of errors, when developers are given general rules instead of explicit templates. These errors include communication factors, such as differences in naming convention.

When errors occur, the development cost multiplies, especially when relying on third-party software teams. The communication overhead of scheduling calls or meetings, and the hours invested in review and testing cycles become expensive and unsustainable. This often results in software teams **deprioritizing** analytics integration from the rest of their backlog, because they separate it from the rest of the feature development.

In some cases, I've seen teams defer analytics integration until **after launch**. As a result, the launch is basically *unmeasured*, so there's limited means (if any) of reporting the success of the development team in business terms. This should be seen as _disastrous_.

To the other extreme, providing only strict templates also inhibits the broader *systems thinking* necessary for developers to fully engage the analytics process. They're effectively discouraged from *including* meaningful business attributes of their own volition, because they have not been offered an easy way to envision it, so many won't even try. (They're busy, after all.)


## Sustainable Flow in Analytics Development

For a thriving analytics ecosystem within an organization, all stakeholders must be engaged to add value to the analytics model wherever possible. Analytics must be treated as an *intrinsic* part of the development workflow, by emphasizing the *measurement of results* especially at launch, and with every software release.

The goals of a sustainable flow are simple:

- Minimize review and testing cycles.
- Enable developers to integrate analytics with high-confidence _the first time_.
- Foster an attitude of *wanting analytics* to show success among developers.
- Standardize models to accelerate the bulk of the work; save time by guessing less.
- Support evolving data models for business semantics; allow for unplanned variations.
- Where possible, let software control for errors.

The realized benefits:

- Faster delivery of applications with analytics.
- Improved productivity and reduced frustration among both developers and analytics stakeholders.
- Faster evolution of the analytics ecosystem.


## Provide some *stricture* for the mundane

What are the most common tracking cases you can think of, for *all* of your organization's applications? Probably screenviews and button clicks, maybe some kind of form entry. Can you think of others that aren't intrinsically linked to your business case?

For these common cases, some simple, standard models are quite sufficient:

- A single function to track screen views
- A single function to track button clicks

Sharing these functions across all your applications enables developers to *do the right thing* when they're building the app: just *always* register a screen view, the same way every time.

Standardization is the key: it must be easy, obvious, and consistent.

Please note that I'm referring to **functions** very specifically: these should be part of the platform code, a standard library that your organization applies in all software. These functions *will produce* a standardized `dataLayer` event and handle analytics accordingly, but their _purpose_ is to enforce the standard for the benefit of the apps' developers.

These functions should roughly approximate:

```javascript
trackScreenView("home screen");
trackFormSubmit("newsletter signup");
trackButtonClick("newsletter unsubscribe");
```

It should be assumed that names will change, and understanding the business impact will require reconciliation of those changes over time. Therefore these methods should be further augmented:

- In data collection, translated to semantics for the analytics platform (e.g. [GTM via lookup tables][13])
- In reporting, translated to the business semantics (e.g. [GA's query-time import][12])

### Why would these be useful?

- The anticipated effects are clear, unambiguously expressed by the function name. There's no guessing involved.
- The programming environment (IDE) will enforce valid *function calls*, so the programmer will know immediately if something is amiss, and the problem will be fixed long before it's up for review.
- These standard models will be guaranteeably reliable within your analytics environment (or GTM).

This reliability is profoundly valuable. For example, when you see an event `screenView`, you expect there to be a (textual) `screenName` attached to it. The approach above prevents a developer from overlooking that attribute, or accidentally providing the *wrong kind* of data for it.

When features are added to the application, developers have a consistent reference for correctly adding the analytics they need, often without even asking their analytics stakeholders first. While that asking might still be good or useful, the need is reduced by supporting augmentation or *indirection* through lookup tables.

The net effect is that time is saved for all participants and stakeholders, by avoiding the cost of errors extending the review cycle.


## Prioritize semantic value

No application, in a business context, can be understood simply by screen views and UI events; these pieces are valuable, but they reflect the life of software, not the life of the business.

To derive the business context in analytics, there must be a *projection* of the business attributes into the data model (e.g. service plan, pricing, account expiration). This is where *semi-structured* data really thrives.

Here again though, there's some benefit in standardizing the **functions** used by developers within your organization; it reduces the exposure to unexpected errors, and provides a *semantic* within the code that developers will recognize.

In Javascript, such a function might be expressed like so:

```javascript
trackBusinessState("userLogin", { servicePlan: "premium" });
```

You may notice this bears some resemblance to the Firebase model for custom events in iOS; quite intentional.

A **critical** component of this semantic process is communication, though, and documentation can fulfill part of that requirement. The essential goal is to ensure that naming conventions, and any applicable constraints on associated attribute values are respected.

In widely dispersed teams, or multiple teams across large organizations, this may justify rigourous documentation of the naming conventions in use, in conjunction with a *workflow* that requires developers to validate the naming convention. In smaller, closely-collaborating teams conversation may be sufficient where the developers and analytics integrators convene regularly, however keeping a central record of adopted naming conventions still provides future value.

### Why is this useful?

- The model remains flexible, while identifying the sensitive case specifically and recognizably.
- The programming environment (IDE) will enforce the critical components of the standard.

The value of *semantic recognition* should not be overlooked: when developers are maintaining code, they will encounter such a function `trackBusinessState`, and distinguish it as *more sensitive* than the rest of the application code.


## Two Major Caveats

### 1. Avoid Over-Abstraction

The intent is **not** to provide a generic template for direct `dataLayer` interaction. This should **never** exist in application code:

```javascript
dataLayer.push({ event: "trackEvent", eventCategory: "engagement", eventAction: "login" });

```

I've seen many cases where the only *fixed* element of the data model is the `trackEvent` string.

Approaches like this expose the prescribed data model of Google Analytics to the developer. That's dangerous, because you've probably overlooked *constraining* it to ensure that the attributes the developer provided were valid. This fosters pollution of the GA reports which effectively unmanaged junk, when the developers neglect to coordinate with analytics stakeholders. In GA this can seriously compromise data quality, and at scale, can make legitimate data inaccessible.

### 2. Avoid Over-Specification

On the flip-side, it's possible to become excessively strictured. Taken to an extreme, a team of developers might assume that all *tracking* should be expressed as separate functions for each event model. While this supports all the benefits of standardization, it becomes a terrible burden to maintain.

As the business case evolves, the *availability* of certain business attributes will likely change. When it does, the standard tracking functions that require those attributes may no longer be suitable, and will require replication, replacement, or other adaptation.

## The Zen of Flow

With these principles in mind, and enacted by developers and other analytics stakeholders alike, you should find your software projects *accelerated*, with better data flowing sooner, and adapting faster with the business needs. There will be more time, less confusion, easier successes and a more flexible workflow for all stakeholders.

In a future post I'll also address an _agile model of analytics integration_ for new projects.


## Coming Soon: an iOS Reference Implementation

In the near future, I'll be releasing an example iOS application, which contains a module embodying these principles. Please watch me on [Twitter][11] for updates.

This sample application provides, among other things:

- Standard tracking functions per the advice above
- Lookup table functionality, otherwise missing from GTM for mobile apps


[1]: https://en.wikipedia.org/wiki/Semi-structured_data
[2]: https://en.wikipedia.org/wiki/Structured_data
[3]: https://en.wikipedia.org/wiki/Unstructured_data
[4]: https://en.wikipedia.org/wiki/Data_lake
[5]: https://en.wikipedia.org/wiki/Systems_integrator
[6]: https://en.wikipedia.org/wiki/Urchin_(software)
[7]: https://keen.io/
[8]: https://mixpanel.com/
[9]: http://cutroni.com/blog/2011/05/18/mastering-google-analytics-custom-variables/
[10]: http://www.lunametrics.com/blog/2012/08/28/20-ways-use-custom-dimensions/
[11]: http://twitter.com/systemalias
[12]: https://support.google.com/analytics/answer/6071511?hl=en
[13]: http://www.simoahava.com/analytics/google-tag-manager-lookup-table-macro/