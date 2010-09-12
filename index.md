---
title: Sam Briesemeister
layout: default

links:
  analyticspros: '"Analytics Pros":http://www.analyticspros.com/'
  github: http://github.com/samba
  usafutura:  http://www.usafutura.com/
  formlessandvoid: http://formlessandvoid.blogspot.com/

projects:
- name: dotfiles
  description: Linux shell and working environment configuration 
- name: server-tools
  description: scripts, configuration, and schedulers
- name: sshkeymgmt
  description: key manager for SSH
- name: workstationpkg
  description: provisioning and setup scripts for my own systems
- name: logstat
  description: an attempt at finding irregularities in SSH events 

resources:
- name: Be Freely
  url: http://befreely.blogspot.com/
  description: My technical blog, sometimes relating to what I do professionally
- name: Twenty3Nineteen
  url: http://sites.google.com/a/befreely.dyndns.org/twenty3nineteen/
  description: Knowledgebase for my personal projects, etc
---

<div class='interior'>


<!-- Github Blog Posts -->
{% for post in site.posts limit:3 %}
div(post). "{{ post.title }}":{{ post.url }} <span class='date'>{{ post.date | date_to_string }}</span> <span class='excerpt'>{% if post.excerpt %}{{ post.excerpt }}{% endif %}</span>
{% endfor %}



h2. About Me

* Sr Systems Engineer at {{ page.links.analyticspros }}

Currently my work is focused on web analytics and related systems...
* Maintaining Javascript frameworks and delivery platforms
* Maintaining Urchin Hosted, our cloud-based Urchin analytics service platform
* Integrating our products with clients' systems

See also: "my r&eacute;sum&eacute;":/resume


<div id='projects'>
h2. Side Projects

{% for p in page.projects %}
div(project). "{{ p.name }}":{{ page.links.github }}/{{ p.name }} %(description){{ p.description }}%
{% endfor %}
</div>

<div id='resources'>
h2. Other resources

{% for p in page.resources %}
div(resource). "{{ p.name }}":{{ p.url }} %(description){{ p.description }}%
{% endfor %}
</div>


</div>