
## The State of Mobile App Analytics

Mobile app analytics is, frankly, not that hard of a problem anymore. Several vendors even automate much of the process, including tracking of screenviews and app open events, so the foundational measurement is really "low hanging fruit."

For the more interesting business cases though, we need more than just screen views and button taps. More interesting are engagements such as users logging in, upgrading their subscriptions, sharing content and buying add-ons for your app. These typically require custom instrumentation, which I'll refer to as "business events."

Occasionally, an app evolves: new features are added, business processes change, and new elements of the user engagement deserved to be measured. Soon you're in for Round 2, changing existing tracking and adding new events. And if app development was out-sourced to a third-party, it may take several iterations to get right. 

A challenge eventually develops, in representing the same kind of *business* activity with consistent events across an app with some legacy. Some segment of users will perpetually have an out-dated version, because they're reticent to upgrade their mobile devices. Over time you tend to see multiple versions of the (underlying, technical) event model in the wild.

Fortunately, Google Tag Manager offers a few sensible ways to accommodate changes and minor discrepancies in, for example, event names. The Triggers model allows *regular expression* matching, which covers a wide swath of these kinds of issues, particularly tracking a single [Event][7] based on matching multiple underlying event specifications.

**Note** this post uses [Swift][3] in reference to developing applications of Apple's iOS mobile devices, Google Tag Manager and Google Analytics.



## The Struggle with Scale

A naive approach to [Event tracking in Google Analytics][7], using Google Tag Manager, would produce one discrete trigger, and one discrete Event tag for each business event. Suppose each business event also has one or more attributes (i.e. variables) that represent the business state as a dimension. At a minimum, the representation of business events requires three distinct configuration items then: one trigger, one variable, and one tag. 

That's an *effort* multiple of 3 for tracking each business event you need to measure, in this naive model.

Regrettably, I've seen large enterprises maintain massive GTM configurations, in both web and mobile applications, in exactly this model: they now have hundreds of tags, hundreds of triggers, and twice that many variables. (Generally you see more variables than triggers, to represent business dimensions, in a mature application.)

With hundreds of tags and triggers, it has historically become quite impractical to maintain. Some of the more recent improvements to Google Tag Manager (namely workspaces, folders, and search) significantly improve these issues, but there remain some challenges.

In particular, Tag Manager's configuration, when it ships to the browser and mobile app environments, contains *everything* in the container. I've seen cases where, with many hundreds of *things* (tags, triggers, variables) it can reach a few megabytes in volume. Over the internet, this can at times significantly delay analytics data collection from an app, which will occasionally result in *data loss* when users close the application before GTM loads. 

You'll notice this smacks of poor design. I attribute this frustration **not** to Google, but to implementers with a lack of end-to-end design in their DataLayer, GTM configuration, and analytics data models. When we treat Google Analytics (users) as the end consumer of the data, and plot the course of every dimension's transmission from the app to the report, a *flow* can be designed with better results.



## The Benefits of Structure

On the one hand, Google Tag Manager's DataLayer is wonderfully flexible, supporting truly arbitrary event models to represent the myriad business states of virtually any organization's apps, regardless of their market, industry, and user engagment model.

On the other, this flexibility means it's possible to track *anything* even when it's *wrong*. "Wrong", of course, is relative: in this case it would mean *noncompliant* with the expectation of the analytics platform, or any intervening configuration environment - namely Google Tag Manager. 


### The Truth of Chaos

For example, GTM (natively) allows for *tracking calls* to be issued without enforcing correct values; herein lies the problem with the *overly abstracted* GTM configuration.

Suppose two events were pushed in sequence: 

```swift
dataLayer.push([ 
	"event": "trackEvent", 
	"eventCategory": "Account", 
	"eventAction": "View Setup Screen", 
	"eventLabel": "New Account" 
])
dataLayer.push([ 
	"event": "trackEvent", 
	"eventCategory": "Game", 
	"eventAction": "Play", 
	"eventLabel": "(Game Title)" 
])
dataLayer.push([ 
	"event": "trackEvent",  
	// NOTE: missing eventCategory
	"eventAction": "Delete"
	"eventLabel": "Deleted Account" 
])
```

For GTM, with a naively abstracted example where these properties flow directly into an Event tracking tag, we'd end up with these events in GA:

| # | Category          | Action            | Label           |
|---|-------------------|-------------------|-----------------|
| 1.| Account           | View Setup Screen | New Account     |
| 2.| Game              | Play              | (Game Title)    |
| 3.| Game              | Delete            | Deleted Account |

This might be seen as *incorrect* because it was the Account that was deleted, not the Game.

Because the **configuration** in GTM was *abstracted*, and GTM's DataLayer inherits previous property state, the `eventCategory` property of the previous event (#2) was adopted by the last (#3). This behavior is *great* for properties like `servicePlan`, that describe the user's whole account, but usually not for discrete interaction properties.

The chances of *missing* a property, such as in this example, turn out to be pretty high: in every engagement I lead, there seemed to be somewhere around 20% error for each tracking tag we recommmended. The application developers weren't really *invested* in correctly representing tracking data. (Another topic for another post.)

### Strict Enforcement

There are a few approaches to this that become equally unweildy, on the other side of the complexity spectrum.

In the case above, we could have provided a function to track two different cases:

```swift
func trackAccountEvent(_ eventAction: String, _ eventLabel: String? = nil){
	dataLayer.push([ 
		"event": "trackEvent", 
		"eventCategory": "Account", 
		"eventAction": eventAction, 
		"eventLabel": eventLabel 
	])
}
```

This is fine for one category of events, but suppose your app has dozens of categories? (Yes, I've seen it happen in large apps). Now you have dozens of functions to maintain as well. Maybe that's OK at first, but as the business case evolves, its sustainability will quickly degrade.




## Balancing Simplicity

In Google Tag Manager, as in many environments, there's a balance to find:

<dl>
	<dt>Excessively explicit event handling</dt>
	<dd>Naive configuration resulting in discrete entities for every single aspect of tracking.</dd>
	<dd>One trigger, one tag with hard-coded properties, and multiple variables per event.</dd>
	
	<dt>Overly abstracted event handling</dt>
	<dd>Nothing is explicitly configured, everything is transmitted straight from the app to Google Analytics.</dd>
	<dd>One trigger, one tag with <em>zero</em> hard-coded properties; potentially dozens of *variables* to populate each property.</dd>
	
	<dt>Balanced Configuration</dt>
	<dd>Categorically related events are represented by a single Event tag</dd>
	<dd>Categorically related tags are triggered by one or more triggers.</dd>
	<dd>One or two properties may be populated by datalayer variables.</dd>

</dl>




In the first case, *excessively explicit*, you'll see Event tags where Category, Action, and Label are all plain text, never populated by a variable. You'll see DataLayer events triggering them, with simplistic design, like so:

```swift
dataLayer.push([ "event": "screen-view-account-setup" ])
```

With the second, *overly abstracted*, you'll find event signaled with all of the properties as they should be seen in GA reports, like so:

```swift
dataLayer.push([ 
	"event": "trackEvent", 
	"eventCategory": "Account", 
	"eventAction": "View Setup Screen", 
	"eventLabel": "New Account" 
])
```

When a configuration is balanced, you'll see more events with semantic definition, like this:

```swift
dataLayer.push([ 
	"event": "accountSetup", 
	"accountType": "New Account", 
	"servicePlan": "Premium"
])
```

**Note** the guiding line here is not the _number_ of DataLayer properties; rather it's the _effort_ of updating tracking configuration when something changes, be it business process or application design, for any reason. There are still cases where the *explicit* and *abstracted* event models above may have a role, but there must be an option to constrain and extend the effects of either case.

If the business adds a new service plan, you shouldn't have to go change dozens of entries in GTM. (A few, maybe, if you were somehow filtering for them.) If the account set up gets split into multiple stages, adding one for `accountProfileSetup` should not be terribly arduous: adding another trigger for that _event_ in GTM should be all that's required, as the other properties should remain useful in populating the categorical event tag.

## Adapting To The Unknown

What happens when a developer accidentally populates `accountType` with some numeric code rather than the humane text? There may be a case for *filtering* the acceptable values for certain properties; GTM's *exception* conditions provide a good avenue for this. 

Suppose though, that this developer is employed by a third-party vendor, and their deployment cycle is going to delay *correcting* the `accountType` value for 6 weeks. Is that acceptable?

In my opinion, it's not. There are better options. Don't wait.

With Tag Manager for the web, there have been two features that enable extending and constraining the *DataLayer* events, intercepting or augmenting their representation in Google Analytics. These are, chiefly:
 
- Lookup tables, to infer translatable values from any DataLayer property or event
- Custom Javascript variables, to interpret events and DataLayer state into other derivative values.

These are profoundly useful: if, for example, the Event Action for `accountProfileSetup` and `accountSetup` should be derived from two *other* discrete properties of the DataLayer, I can easily provide a Custom Javascript variable to handle that:

```javascript
// A Custom Javascript variable for GTM in the Web.
function(){
	switch("{{ event }}"){
		case 'accountSetup': return "{{ accountSetup_action }}";
		case 'accountProfileSetup': return "{{ accountProfile_action }}";
		default: return "(none)";
	}	
}
```

With a little fore-thought, this can be implemented purely through Lookup Tables as well, by referencing other _DataLayer variables_ as the values associated to each key in the lookup table.


Unfortunately, GTM for Mobile apps has offered neither of these features natively. There's no capacity to provide custom functions from *within* GTM, they must be provided and registered by the app. Lookup Tables really aren't supported: the Variable Collection feature really isn't the same, as it requires *the app* to fetch values from the container, and cannot be directly referenced from within GTM configuration (as independent variables).



## Evolving Capability

With all these design considerations, technical caveats, and cautions on complexity, one might be reticent to leverage Google Tag Manager for their mobile analytics. I'd say that's quite understandable, but it's not the end of the story. 

A little design thinking goes a long way when (properly) integrating analytics tools. With a modular approach to integrating the vendor tooling, and a light abstraction for hooking into the application code, this all becomes much easier. We can extend GTM's capabilities in mobile quite successfully: Lookup Table functionality, and all the benefits if offers is within reach.

A few key principles make GTM quite sustainable, and support the integratin of other vendors' tools as well:

- A single module should handle all Analytics *installation* within the app.
	- 	Includes all necessary logic to enforce consistency, minimize errors by app developers.
- That module should provide:
	- Simple functions for standard tracking, e.g. `trackScreenView`, `trackEvent`
	- A standard model for custom, business-semantic events, e.g. `pushDataLayerEvent`


The functions provided by this module will *abstract* the actual handling of events to GTM and other vendors' tools; they'll enforce limited (but clear) standards for the *data structures* passed to each analytics tool.


## Presenting a Solution

I'm pleased to offer you a reference implementation, which demonstrates the principles herein described.

[ios-analytics-demo][10]





**Why** do we pain-stakingly install analytics and data collection code in our software applications? Because we want to understand user behavior, and the success of the business case behind the application.

**Why** do we want to understand it? So we can change it, improve it, and better satisfy more customers.

That change brings some uncomfortable challenges











## Measure it, Manage it

> If you can't measure it, you can't manage it.

We can thank [W. Edwards Deming][2] for this [misquoted][1] pearl; in fact he positioned this as **false**.

In spite of its inaccuracy, it remains relevant: we measure applications and business processes to observe their influence on strategic goals. Analytics around software actually benefits from distilling the *true* interpretation of Deming's quote: that measurements can be *stratified*, abstracted and evaluated as inputs and outputs in a statistical model. (More on this **stratification** of measurements in a later post.)

If our aim, pursuant to the larger strategy, is to increase the _customer lifetime value_, then measuring components of the _customer lifetime_ provides meaningful input, while the _value_ is likely an output related to specific events. Those events signal things we expect to change, though perhaps indirectly.

Change complicates things though, if our measurement techniques are too rigid in their most granular pieces: the *event* data structure.

## Enable Evolution in Data
 
Because we expect, and indeed *want* applications to change, our data structures and data models must be capable of co-evolving with the applications. As software changes, the original structure of an event will also have to change. 

When Brand X decides to upgrade their app to support a new pricing model, this will require three distinct updates:

- Google Tag Manager's dataLayer events will require updating to reflect the pricing plan variations.
- Google Tag Manager's configuration will need to be updated to correctly present that data to Google Analytics. 
- Google Analytics configuration may need to be updated with a custom dimension, custom metric, a goal, etc.

Some other analytics vendors provide attribute models that circumvent this complexity, which is great, but similar updates will be required for extraction of that data to blend with other organizational data sources, in most BI environments.












### An Example

Suppose the company "Brand X" publishes an app, and has a single pricing plan. Subscribers can log into the app, and when they do, our Tag Manager DataLayer receives this event:

```swift
dataLayer.push([ "event": "userLogin", "userId": "12345" ])
```

Naturally you probably tracking this, in Google Tag Manager, something like so:

| Event Category | Action | Label  |
|----------------|--------|--------|
| Engagement     | Login  | (none) |


### Then they want to make money.


Two weeks later, they add a Premium pricing plan.






Today I'd like to present a technique for improved analytics instrumentation in mobile apps, via Google Tag Manager. 

First, the goals and benefits this aims to achieve:

- Easier launch of mobile apps with analytics.
- Faster and more reliable instrumentation workflows. 
- Better visibility into the app's data, and fewer surprise errors.
- Streamlined evolution of the app's analytics ecosystem.

This is the first in a small series in the app measurement category.








I'll have to defer the *strategic*  value discussion to another post.





Stratifying measurement.








The field of marketing and user-engagement analytics in mobile and web applications provides an abundance of tools, technologies, and tactics for extracting new and better data, new and better insights. It can be hard to distinguish usefulness and value among them, for your own organization. Each carries a set of assumptions and expectations about your data, your instrumentation (implementation), and your business needs, which may not apply to your particular case.






Wouldn't it be great if you could get measurement data from mobile apps, intrinsicly, without having to inject code for it? Many vendors try, and with some success, to deliver on this premise.

For representation of the application's state, and interaction of the user with the application's structure, the vendors' approaches are largely sufficient.

But some more nuanced challenges evolve out of collecting such data. Specifically, the gradual evolution of the business, the software, and the market requires an evolving representation of user engagement.

This challenge is largely abstracted by high-level Key Performance Indicators, such as customer lifetime-value, allowing aggregate performance can be measured in the long-term in spite of such evolving facets.



But applications change, and the representation of *business* state of the user becomes less tangibly related to the application's structure. The initial *signal* of business events changes, potentially quite quickly.





Let me frame *fluidity* here, as it relates to data:

<dl>
	<dt>Fluidity</dt>
	<dd>The property of being amorphous, and assuming the shape of a containing structure.</dd>
	<dd>Pliable, reshapable, continuous and flowing.</dd>
</dl>

In this context there are a few containers to negotiate: 

- Google Analytics' screen views, events, and transactions.
- Google Tag Manager's DataLayer events.




 the modeling of application measurement data 


Google Analytics 


Then Google acquired Firebase. While this opens a new world of measurement possibilites, it remains *different enough* and not well-enough integrated with Google Analytics, that it deserves to be used in tandem with Google Analytics.




[1]: https://blog.deming.org/2015/08/myth-if-you-cant-measure-it-you-cant-manage-it/
[2]: https://en.wikipedia.org/wiki/W._Edwards_Deming
[3]: https://developer.apple.com/swift/
[4]: https://twitter.com/hashtag/measure
[5]: https://twitter.com/hashtag/analytics
[6]: https://en.wikipedia.org/wiki/Coupling_(computer_programming)
[7]: https://support.google.com/analytics/answer/1136960?hl=en
[10]: https://github.com/samba/ios-analytics-demo