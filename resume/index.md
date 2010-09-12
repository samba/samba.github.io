--
title: Sam Briesemeister
subtitle: Systems Engineer
layout: default


employers:
- name: Analytics Pros
  period: Feb 2009 - Current
  title: Sr Systems Engineer
  description: GACP; Created and maintained Javascript frameworks for integration with client websites and applications; Created "Dimensionator", a Google Analytics UI enhancement
- name: FE Corporation
  period: Mar 1999 - Current
  title: IT Consultant
  description: part-time, as-needed maintenance of servers, workstations, and website
- name: SafeDesk Solutions
  period: Jul 2008 - Oct 2009
  title: Software Engineer
  description: Design and implement boot-time system policy engine for Linux in WAN environments; Automated system configuration, maintenance. (Shell, Python, client-server contexts.)
- name: Washington State University
  period: Nov 2004 - Jun 2008
  title: Information Systems Specialist
  description: Deploy and maintain hybrid Windows/Linux network; Conduct system development projects for internal applications and web site integration
- name: Cabin River Web Solutions
  period: Mar 2000 - Sep 2004
  title: Sr Software Development Consultant
  description: Design and develop web-based project management solution, various encryption and database abstraction modules for team projects

education:
- name: University of Idaho
  period: 2004 - 2008
  degree: B.S. Business: Information Systems; minor Computer Science, minor German
  activities: Sigma Phi Epsilon, WSU Linux Users Group
- name: Yakima Valley Community College
  period: 2000 - 2002
  degree: AA

interests:
- Open-Source Software
- Business and Entrepreneurship
- Humanitarian efforts
- Foreign languages

--

***NOTE*** This is a work in progress.



h2. Employment

{% for e in employers %}
div(employer). <span class='date'>{{ e.period }}</span> <span class='name'>{{ e.name }}</span> <span class='title'>{{ e.title }}</span> <div class='description'>{{ e.description }}</div>
{% endfor %}

h2. Education

{% for e in education %}
div(edu). <span class='date'>{{ e.period }}</span> <span class='name'>{{ e.name }}</span> <span class='title'>{{ e.degree }}</span> <div class='description'>{{ e.activities }}</div>
{% endfor %}

h2. Interests

{% for i in interests %}
* {{ i }}
{% endfor %}