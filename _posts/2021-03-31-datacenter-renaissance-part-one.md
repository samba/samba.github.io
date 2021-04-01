---
layout: post
category: [ "cloud", "datacenter", "transformation", "kubernetes" ]
tags: kubernetes lean cloud transformation
title: "Datacenter Renaissance: part one"
date: 2021-03-31 17:20:53
---


With the rise of Kubernetes, enterprise investments in legacy datacenters can become significant economic leverage, by converting legacy IT ops into private clouds.  
While many enterprises have considered divesting their datacenter infrastructure, and moving primarily or purely into public cloud environments, they may be missing a significant economic opportunity.  
Kubernetes, along with other automation, provides a unique opportunity to transform cost centers into value-producers, creating efficiencies and accelerating innovation. 

## From Legacy Thinking

The notion of hyper-converged infrastructure is not new. 
As an industry, we've been discussing its benefits since the mid- to late-2000s. 
Cloud platforms are simply the logical evolution, from software-managed and software-defined infrastructure, into fully dynamic self-service environments for each application, and then to commoditization of infrastructure and billable multi-tenant allocation. 
The cloud providers we all know (and possibly love) simply figured out how to monetize this earliest, as illustrated in [the creation of Amazon Web Services](https://techcrunch.com/2016/07/02/andy-jassys-brief-history-of-the-genesis-of-aws/).

Enterprises have the same opportunity, to create economic leverage from datacenters. 
They can be transformed from cost centers into value generators, and ultimately strategic assets when their "cloud-ification" starts to enable faster innovation. 
This requires a commitment to automation, and some [new thinking in operations](https://www.morganclaypool.com/doi/abs/10.2200/S00516ED2V01Y201306CAC024), application lifecycle, and service-center models for enterprise infrastructure and development teams.

Many enterprises haven't noticed that opportunity yet though, and are thinking of migrating to public cloud, while divesting from their datacenter investments. 
Such migrations are motivated by a desire to manage costs, where an OpEx model offers a clearer near-term ROI, and maintaining a CapEx investment may not appear to be paying off fast enough.  
This migration itself is costly: new operational systems are required, applications have to be re-packaged to run safely in public cloud environments. 
Teams may require retooling and retraining, and many teams may require other staffing changes.
These challenges are the same in a transformation of existing datacenters into private cloud platforms.

The major differences are in the movement of applications and data, comparing your private cloud as a "provider" to an actual public cloud provider. 
The sheer volume of data in many enterprises is massive: it may be cheap to move in, but it won't be cheap to move out. 
On the other hand, if your transformation allows you to "move in" to your own infrastructure, you only need to move your applications, while youre data can remain in place.
Naturally, the age-old argument of lock-in applies, when considering proprietary services (e.g. Amazon DynamoDB), but numerous services are available that are compatible with open-source alternatives. 
The open-source alternatives could just as well run on your infrastructure, provided your team(s) can handle the operational requirements. 
Lift-and-shift has costs, either way.

## The New Datacenter: a Private Cloud

Adopting Kubernetes as a defacto standard gives your application teams a profound advantage in managing software lifecycle. 
With one of the largest open-source communities providing a library of solutions for managing the most popular databases, machine learning stacks, continuous deployment capabilities, and observability/traceability substrates, your teams will be able to quickly create the environments their applications require for both development and production. 
This enables teams to innovate faster, adapt more fluidly to customer demand, and reallocate time that would otherwise be focused on infrastructure problems to improving customer-focused outcomes.


To achieve this, datacenter operations teams need to automate the entire stack, and build APIs to drive a self-service consumption model within your enterprise. 
This starts with network partitioning, machine bootstrapping, storage configuration, virtual machine creation (if needed), and ultimately the creation of Kubernetes clusters. 
When these capabilities are exposed by an API, teams can dynamically (re)allocate infrastructure where it's most needed, scaling up clusters when application demands increase, potentially automatic with customer traffic, or scale them down when legacy applications are deprecated.  
These APIs become the primary responsibility of your datacenter operations group: correct and reliable on-demand automation of infrastructure. 
(Let's not forget resource planning, but we'll save that for another post.)

## Accelerate Innovation

Then your database teams can extend this, to build "database as a service" on your internal infrastructure, creating new self-service capabilities for application teams. 
Similarly, their primary responsibility becomes *correct* and *reliable* **automated** delivery of databases, on-demand, via self-service APIs.

For every layer of automation, every new API, another innovation can create new efficiencies and opportunities. 
As teams automate their own work with those APIs, and share solutions among other teams, they further accelerate customer-focused outcomes, by reducing the "overhead problems" of every subsequent sprint.

This way, private clouds create value. 
Datacenter assets become value centers, instead of cost centers. When your automation correctly isolates tenant applications, you can consider leasing capacity to business partners, in the form of "cluster as a service", or even higher application layers. 
The commoditization of infrastructure and datacenter operations becomes a value stream opportunity, in the same way that Toyota's quality management ideas extended into their supply chain, to lower costs and create efficiencies.

## Creating the new Value Stream

When we consider the big picture, we see that it's possible to "reduce, reuse, and recycle" our datacenter footprint, which reduces the environmental cost of our modern technological supply chain. 
We continue to use more data, stream more movies, store more photos in the cloud, and study bigger data problems, and in that we need to realize economy-scale efficiencies.  
The ecological effect ("negative externalities") cannot be ignored: we should consider an ethical duty to achieve these efficiencies. 
Enterprises have an opportunity to leverage this transformation for social goodwill as well: those which optimize their private cloud operations and integrate them with other firms in their supply chains can "pass the savings" onto their customers (by paying less to public clouds), while they feel good about their choice in platform.

The full advantages of private cloud transformation have not yet been realized by most enterprises, but I dare say, there's real opportunity here. 

Please watch this space for upcoming articles in this topic. I'll post more soon, the change management, project management, program design, technical, and operational considerations to support this evolution. 



