---
layout: post
category: what?
title: Reviving Blog on GitHub Pages
date: 2016-02-29 12:23:21
author: Sam Briesemeister
description: Building a serious blog using Jekyll and GitHub Pages, and the Git workflow.
tags: github

project_url: 
  site: http://github.com/samba/samba.github.io
  tackle: http://github.com/samba/tackle-wsgi


tool: 
  sublime: https://www.sublimetext.com/
  materialize: http://www.materializecss.com/

blog_reference: 
 - https://www.analyticspros.com/blog/google-analytics/analytics-everywhere-the-universal-measurement-protocol-c-library/
 - https://www.analyticspros.com/blog/google-analytics/analytics-everywhere-the-really-big-picture-cross-platform-measurement/
 - https://www.analyticspros.com/blog/google-analytics/analytics-everywhere-universal-analytics-library-for-php/
 - https://www.analyticspros.com/blog/google-analytics/python-ga-server-side-library/
 - https://www.analyticspros.com/blog/tag-management/installing-google-tag-manager-in-your-cms-hubspot-squarespace-and-others/


---

## Finally Blogging Again.

First, it's good to be blogging again. My last publication was in 2014, for my previous employer, Analytics Pros, on [the C library we had written for Google Analytics integration]({{page.blog_reference[0]}}).

I've chosen GitHub Pages for this project, after much deliberation, as I strongly prefer the Git-based workflow. [This project]({{page.project_url.site}}) also leverages Docker to provide a consistent test environment for the site and blog content, running in Jekyll locally. The workflow is pleasant and (I find) intuitive:

1. Write in Markdown locally, in my favorite editor ([Sublime Text]({{page.tool.sublime}})).
2. Run the Jekyll server in Docker, which I've coordinated via a Makefile, so I `make serve`, and it continually recompiles my revisions.
3. Reload the page(s) in the browser to see the new revisions at any time.
4. When I'm happy with it, `git commit` and `git push`.

The Docker environment was chosen due to the very desirable separation of its Ruby dependencies from the rest of my Mac workstation. Docker builds out the Ruby dependencies in a Debian-based container, which can be re-instantiated very simply on any other Mac or Linux environment, with no awkwardness of custom configuration. Makes it easy to work on the same project across workstations.

### Requirements Matter.

- Write in Markdown, because I enjoy its brevity.
- Deploy with Git.
- Remain fairly performant, avoiding long loading/scanning/rendering times.
- Serve on my own custom domain apex.
- Doesn't let the scum of the earth execute DDoS attacks and distribute illicit contact on my dime.

### Alternatives Considered.

"Why not WordPress on PHP?", you might ask. I'd tell you, but then the fear and loathing might kill you. I've administered WordPress sites for too long, so quite frankly, I know better than to trust WordPress. I don't have time to work around its security problems anymore. I need tools that work reliably, aren't going to implode in 6 months when a plugin is out of date, and don't cause me to lose sleep due to the long-term administrative complexity. I lose enough sleep as it is. No thanks, WordPress. 

I considered several other blogging tools in other environments, especially in Python (which I admittedly favor), to run on my Gandi hosting, which provides a simple WSGI environment, and provides a Git-based deployment workflow. I went so far as to begin writing my own blog environment (based on my own [tackle-wsgi]({{page.project_url.tackle}})), but facing the complications of Gandi's deployment process, backed away from that.

Gandi's deployment process reconstructs a new Virtual Machine every time the `master` branch gets deployed. It's a fairly clever approach, actually, but doesn't quite fit. Unfortunately it doesn't lend itself to the workflow I'm looking for. Short of completely re-creating Jekyll in Python (generating static content files), which I then serve through Python anyway, there's no **convenient** way to deploy _content_ with Git to Gandi. Instead, it's more like deploying the _entire application_. As I prefer not to store compiled/generated content in Git, the server-side application would have to generate the page content within the Python environment, which should then be cached for the life of the deployment... justifying that complexity is hard, when Jekyll already exists. 

### Features Considered.

There are some nifty projects out there to support Blogging directly within GitHub, using its Issues feature to simulate content entries. The API integration for it doesn't feel right, as it's really an awkward fit, and when Jekyll already provides the notion of permalinks derived from content dates and other attributes, I've opted to stick with Jekyll (GitHub Pages') existing blog feature.

Comments are a tad more nuanced. Services like Disqus offer comment features embedded in the page, something of a traditional blog experience, however I dislike the remarketing feature they enforce. I value my own privacy, and that of any readership I may develop, too much to rely on Disqus. So instead, I've opted to rely on Twitter extensively. On Twitter, it's understood that everything is basically public and non-anonymous. I'm happy to engage on Twitter, and very few professionals in this space _don't_ use Twitter. Then if anonymity and privacy are required, I've provided my [Keybase](http://keybase.io/samba/) identity so I can be contacted securely, using GPG encryption.

GitHub Pages (not uniquely) presents solely static content to the end-user, compiled _during deployment_ by Jekyll. This has several major advantages:

- It's fast.
- It doesn't support dynamic queries.
- It's not going to let evil people upload and execute code.
- It plays nice with Markdown. 
- It deploys with Git, of course.

It also has a few downsides:

- Some features are quite primitive, or completely missing.
  - No comment support, basically, so I accepted Twitter as an alternative mode of engagement.
  - Indexing posts by tags (etc) is effectively missing, however I wrote an effective workaround.
  - Site search will have to be sorted out with an external provider (e.g. Google).

GitHub Pages is definitely not ready to roll out of the box. In addition to the work noted above, I also rolled my own theme, as everyone on GitHub Pages must. I chose [Materialize CSS]({{page.tool.materialize}}) as a CSS framework, which relies on jQuery, though I'll admit I felt the need to work around some of its default styles. For a few additional customizations on Twitter, and the Chuck Norris Jokes API integration, I thus relied on jQuery too.


### What about my old blogs?

Well, frankly they probably weren't very good, but the good parts I can readily migrate into GitHub Pages. I would want to rewrite them in Markdown anyway. Soon I'll begin migrating content from other blogging platforms I've historically experimented with.


