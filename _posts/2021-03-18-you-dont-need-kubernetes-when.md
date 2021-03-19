---
layout: post
category: kubernetes
tags:
- kubernetes 
- devops
- blogging
- satire
title: You don't need Kubernetes when...
date: 2021-03-18 11:37:07
excerpt: Kubernetes is becoming a defacto standard for cloud computing, and the platform of choice for hosting blogs. Perhaps in the declining minority, however, I will not adopt Kubernetes as a blogging platform, and here's why.
---

You can find several [unironic][unironic] blogs describing how [static content][staticcontent] sites can be delivered on Kubernetes; some will admit that this qualifies as "[applied over-engineering][applied-over-engineering]", but they're just being silly. Clearly, Kubernetes is a great blogging platform. Nonetheless, I don't blog on Kubernetes.

Let's face it, you probably don't need Kubernetes for your startup or enterprise.

A few reasons you'll never need it:

* The hardware your apps run on will work just fine until the sun burns out. Failure is not an option.
* Just one instance of your app will be enough for the whole life of your company. Scaling is for wimps.
* You'll never need to deploy on any other infrastructure than you already have. Committed to `$infrastructure_provider` for life.
* Everyone gets admin access to everything in your platform, including customers. No need for access control here, buddy!
* Er, what's this "multi-tenancy" thing?
* None of your customers actually depend on your apps running, ever. "Mission-optional" is the name of the game.
* You didn't actually have to deploy any apps, because you wrote it all in [NOCODE][nocode]. Super scalable, and completely stateless!
* There's no room for containers in your life. Your passion cannot be contained. You must remain free like a bird.

_This post is satire._ 

Seriously though, my blog doesn't run on Kubernetes, _as far as I know_, because hosted static-site solutions are good enough for my needs. They probably use Kubernetes behind the scenes. 🤷‍♂️  

If you run mission-critical apps on resilient infrastructure, I'd be happpy to help you evaluate Kubernetes. When needed, we can talk about the enterprise management solutions I've helped develop around Kubernetes. 




[unironic]: https://mbuffett.com/posts/kubernetes-setup/ 
[staticcontent]: https://mattjmcnaughton.com/post/hosting-static-blog-on-kubernetes/
[applied-over-engineering]: https://danrl.com/writing/my-blog-on-kubernetes/
[nocode]: https://github.com/kelseyhightower/nocode
