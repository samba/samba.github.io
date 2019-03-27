---
title: Continuous Deployment with Python Packages
date: 2016-06-12 12:24:00
categories: devops python gitlab continuous-deployment
tags: devops continuous-deployment python gitlab
redirect_from:
  - /continuous-python-packaging
layout: post
sticky: true
excerpt: >
  Streamline your Python development with GitLab CI; automate build,
  test, and publication of libraries to PyPI package repositories.

---

So you wrote an application in Python, maybe just an incredibly useful library. Fantastic!

Now, how to get it to users, into environments that require it?
The natural choice is Python's PyPI package distribution infrastructure, of course.

But you're a fast mover, adherent to the DevOps paradigms, and generally like lean process. Right?

Enter the practices of continuous integration, continuous delivery, and continuous deployment.

I've come to love [GitLab][2] and their CI features, previously a separate product, but now thoroughly integrated.
(There's room for some UI/UX improvement, but that's another story.) They've constructed a layer of automation that
facilitates all kinds of workflows. With a little configuration, it can also handle full testing of Python applications,
and deployment in the way of pushing packages to PyPI services.

## Package Registration

[Peter Downs wrote a wonderful tutorial][3] on preparing your package for distribution, including much of the important
administrative components, e.g. package registration. [Others have similarly][4] posted relevant tutorials. You'll want
to review these tutorials, and register your package with PyPI accordingly.

For the purposes of continuous deployment, there are a few additional steps:

- A separate user should be registered with PyPI, whose credentials will be stored in GitLab as well (securely). This
**should not** be your primary account.
- Once created, add this separate user as a maintainer, in PyPI, so it can push new package versions.
- Save the credentials somewhere, you'll need them later.

## Configuring the GitLab Project

This isn't too tricky, but there are a few important parts to get right.

First, you'll obviously have to have a project repository registerd in [GitLab][2]. Once you've done that, you'll
configure the *Variables* used during build/test/etc.

Recent releases of GitLab put the Variables configuration in the "gear icon" menu on the far right, when looking at a
repository's homepage. (One of those UI/UX improvements I mentioned...)

Configure the following Variables:

- Key `PYPI_USER`: the username you registered (separately) on PyPI, strictly for automatic package upload.
- Key `PYPI_PASSWORD`: the password for that user. Hopefully this is quite unique.

*Security note*: These values are exposed as _environment variables_ to the runners. They will not be visible unless
some part of your build/test/deploy application *prints* them to console output (`stdout`, `stderr` etc). Their configuration
can only be managed by users, in GitLab, who are granted `Master` or `Owner` permissions in the repository. The credentials
used to upload packages should be treated as _sensitive_ data. Please be mindful of whom you're granting access to, and
how your automation handles these values.

## Configuring the GitLab Runner

This is best done by code example, I'm afraid, annotated for clarity. This configuration belongs in the file `.gitlab-ci.yml` in your code repository. (Mine, for example, [here][6].)

```yaml
# Advise GitLab that these environment vars should be loaded from the Variables config.
variables:
    PYPI_USER: SECURE
    PYPI_PASSWORD: SECURE

stage:
  - test
  - deploy
  - cleanup

unittest:   # I hope you're testing before you push a package...
  stage: test
  script:
    - echo # prepare your environment as needed
    - python -m unittest discover -f -s test/ -t ./
    - echo # any other testing/coverage kit you need to apply...

deploy_pypi:
  stage: deploy
  script:   # Configure the PyPI credentials, then push the package, and cleanup the creds.
    - echo "[server-login]" >> ~/.pypirc
    - echo "username=" ${PYPI_USER} >> ~/.pypirc
    - echo "password=" ${PYPI_PASSWORD} >> ~/.pypirc
    - python setup.py check sdist bdist upload   # This will fail if your creds are bad.
    - echo "" > ~/.pypirc && rm ~/.pypirc  # If the above fails, this won't run.
  only:
    - /^v\d+\.\d+\.\d+([abc]\d*)?$/  # PEP-440 compliant version (tags)
  except:
    - branches


cleanup_pypirc:
   stage: cleanup
   when: always   # this is important; run even if preceding stages failed.
   script:
    - rm -vf ~/.pypirc  # we don't want to leave these around, but GitLab may clean up anyway.
```

And that's the bulk of it.  Provided your package's `setup.py` is configured sensibly, this should "just work."

## A Live Example

It's always nice to have a functioning sample for reference, isn't it?

I've recently rolled out a package of my own, "[webapptitude][1]" that demonstrates all this.

This package is a library to extend Google AppEngine, especially `webapp2`, and composes many features that I find
essential for building applications. As such its test setup is somewhat convoluted (i.e. the AppEngine SDK), but
the process works well enough.

The configuration above, and my own project, relies on Git tags explicitly declaring versions to deploy. This requires
version-tags to comply with [PEP-440][5], and in my configuration, with a prefixed "v" on the tags. My `Makefile` also
prepares these tags based on the version identified in the package code.

Feel free to throw questions at me on Twitter. :)


[1]: https://gitlab.com/samba/webapptitude
[2]: http://www.gitlab.com/
[3]: http://peterdowns.com/posts/first-time-with-pypi.html
[4]: http://zaiste.net/2015/06/how_to_submit_a_python_package_to_pypi/
[5]: https://www.python.org/dev/peps/pep-0440/
[6]: https://gitlab.com/samba/webapptitude/blob/master/.gitlab-ci.yml
