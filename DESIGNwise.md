# Wise Design System — Comprehensive Reference

> Scraped from https://docs.wise.design — 2026-05-21
>
> This document covers Wise's full design system: brand foundations (colour, typography, spacing, motion, icons, logo, tone of voice) and all 55 UI components with their variants, states, usage rules, and content guidelines. Use it as a reference when designing or building UI that aligns with Wise's design language.
>
> **Foundations covered:** Colour · Typography · Spacing · Size · Radius · Padding · Icons · Illustration · Logo · Focus States · Motion System · Transitions · Grid · Tapestries · Vocabulary · Grammar & Style · Tone of Voice
>
> **Components covered:** 55 components from Action Prompt to Upload Input

## Table of Contents

- [Foundations](#foundations)
  - [Colour](#colour)
  - [Typography](#typography)
  - [Spacing](#spacing)
  - [Size](#size)
  - [Radius](#radius)
  - [Padding](#padding)
  - [Icons](#icons)
  - [Illustration](#illustration)
  - [Logo](#logo)
  - [Focus States](#focus-states)
  - [Motion System](#motion-system)
  - [Transitions](#transitions)
  - [Grid](#grid)
  - [Tapestries](#tapestries)
  - [Vocabulary](#vocabulary)
  - [Grammar and Style](#grammar-and-style)
  - [Tone of Voice](#tone-of-voice)
- [Components](#components)
  - [Action Prompt](#action-prompt)
  - [Avatar](#avatar)
  - [Bottom Sheet](#bottom-sheet)
  - [Button](#button)
  - [Card](#card)
  - [Carousel Cards](#carousel-cards)
  - [Checkbox](#checkbox)
  - [Chip](#chip)
  - [Circular Button](#circular-button)
  - [Compact Date Input](#compact-date-input)
  - [Copy Block](#copy-block)
  - [Critical Banner](#critical-banner)
  - [Date Input](#date-input)
  - [Date Picker](#date-picker)
  - [Divider](#divider)
  - [Dropdown](#dropdown)
  - [Expressive Money Input](#expressive-money-input)
  - [Icon Button](#icon-button)
  - [Image Ratios](#image-ratios)
  - [Info Prompt](#info-prompt)
  - [Inline Prompt](#inline-prompt)
  - [Instruction](#instruction)
  - [List Item](#list-item)
  - [List Item   Button](#list-item--button)
  - [List Item   Checkbox](#list-item--checkbox)
  - [List Item   Icon Button](#list-item--icon-button)
  - [List Item   Navigation](#list-item--navigation)
  - [List Item   No Action](#list-item--no-action)
  - [List Item   Radio](#list-item--radio)
  - [List Item   Switch](#list-item--switch)
  - [Media Button](#media-button)
  - [Modal](#modal)
  - [Money Input](#money-input)
  - [Navigation Option](#navigation-option)
  - [Nudge](#nudge)
  - [Password Input](#password-input)
  - [Popover](#popover)
  - [Progress Bar](#progress-bar)
  - [Progress Spinner](#progress-spinner)
  - [Promo Card](#promo-card)
  - [Radio](#radio)
  - [Screen Loader](#screen-loader)
  - [Search Input](#search-input)
  - [Section Header](#section-header)
  - [Segmented Control](#segmented-control)
  - [Select](#select)
  - [Snackbar](#snackbar)
  - [Summary](#summary)
  - [Switch](#switch)
  - [Table](#table)
  - [Tabs](#tabs)
  - [Text Area](#text-area)
  - [Text Input](#text-input)
  - [Upload](#upload)
  - [Upload Input](#upload-input)

---

# Foundations

## Colour

### Brand Philosophy

Wise's primary colour is green — energetic and vibrant. The palette extends with secondary colours inspired by global cultures.

### Core Brand Colours

| Name | HEX | RGB | CMYK | PMS |
|------|-----|-----|------|-----|
| Bright Green | `#9FE870` | 159 / 232 / 112 | 47 / 0 / 72 / 0 | PANTONE 7487 |
| Forest Green | `#163300` | 22 / 51 / 0 | 54 / 0 / 100 / 80 | PANTONE 2411 |
| White (8% Forest Green tint) | `#F9FBF7` (approx) | — | — | — |

### Secondary Palette

| Name | HEX | RGB | CMYK | PMS |
|------|-----|-----|------|-----|
| Bright Orange | `#FFC091` | 255 / 192 / 145 | 0 / 40 / 50 / 0 | PANTONE 163 |
| Bright Yellow | `#FFEB69` | 255 / 235 / 105 | 2 / 0 / 65 / 0 | PANTONE 113 |
| Bright Blue | `#A0E1E1` | 160 / 225 / 225 | 45 / 0 / 10 / 0 | PANTONE 310 |
| Bright Pink | `#FFD7EF` | 255 / 215 / 239 | 0 / 30 / 0 / 0 | PANTONE 671 |
| Dark Purple | `#260A2F` | 38 / 10 / 47 | 100 / 100 / 0 / 59 | PANTONE 5255 |
| Dark Gold | `#3A341C` | 58 / 52 / 28 | 33 / 43 / 80 / 66 | PANTONE 448 |
| Dark Charcoal | `#21231D` | 33 / 35 / 29 | 54 / 27 / 36 / 82 | PANTONE 446 |
| Dark Maroon | `#320707` | 50 / 7 / 7 | 47 / 85 / 55 / 59 | PANTONE 4975 |

### Product / Content Colours

| Token | HEX | Usage |
|-------|-----|-------|
| Content Primary | `#0E0F0C` | Primary content emphasis |
| Content Secondary | `#454745` | Body text, supportive elements |
| Content Tertiary | `#6A6C6A` | De-emphasised, placeholders |

Background and interactive colour tokens are also defined in the product theme, including disabled, positive, negative, warning, and interactive states.

### Colour Usage Rules

- Always start and end with green — it's the first impression and the farewell.
- Introduce secondary palette once green is established (e.g., deeper in a flow or story).
- Secondary palette can be applied to the logo in deep marketing applications.
- Colour combos are purposefully complementary and accessible — do not mix outside the defined pairs.

### Theming

Wise supports multiple themes (personal, business). Semantic colour tokens are used to ensure theming works consistently across product surfaces.

## Typography

### Typefaces

| Face | Usage |
|------|-------|
| **Inter** | Default for most UI — body, labels, form inputs. Clean and legible at all sizes. |
| **Wise Sans** | Display/headline font. Bold, short headlines. Used for celebration/announcement moments. |
| **International Glyphs** | Expressive glyphs used big, bold, and sparingly. |

### Product Type Scale

| Style | Font | Weight | Size | Line Height | Letter Spacing | Notes |
|-------|------|--------|------|-------------|----------------|-------|
| Display Large | Wise Sans | Bold | 96px | 85% | +2% | Uppercase |
| Display Medium | Wise Sans | Bold | 64px | 85% | +1.5% | Uppercase |
| Display Small | Wise Sans | Bold | 40px | 85% | +1.5% | Uppercase |
| Title Screen | Inter | SemiBold | 30px | 34px | -2.5% | One per screen, pairs with large body |
| Title Section | Inter | SemiBold | 26px | 32px | -1.5% | Divides screen into sections |
| Title Subsection | Inter | SemiBold | 22px | 28px | -1.5% | Sections within sections |
| Title Body | Inter | SemiBold | 18px | 24px | -1% | — |

old 30px
Line height 34px
Letter spacing -2.5%
Paragraph Spacing 8px

Title screen

Used for the main screen title, should be used only once per screen. It pairs with large body.

Inter
Semi bold 26px
Line height 32px
Letter spacing -1.5%
Paragraph Spacing 8px

Title section

Handy for dividing your screen into sections. It pairs perfectly with large body.

Inter
Semi bold 22px
Line height 28px
Letter spacing -1.5%
Paragraph Spacing 8px

Title subsection

Designed for sections within sections to increase the information hierarchy.

Inter
Semi bold 18px
Line height 24px
Letter spacing -1%
Paragraph Spacing 8px

Title body

Perfect for large amounts of content. Pairs with large body and default body.

Inter
Medium 14px
Line height 20px
Letter spacing 1.5%Title group

Inter
Regular 16px
Line height 24px
Letter spacing -0.5%
Paragraph Spacing 8px

Body large

Used for for paragraphs. Pairs with screen title and section title.

Inter
Semi bold 16px
Line height 24px
Letter spacing 0.5%
Paragraph Spacing 8px

Body large bold

Emphasises and highlights important words or small titles. It’s used in expressive components, such as buttons and links.

Inter
Regular 14px
Line height 22px
Letter spacing 1%
Paragraph Spacing 8px

Body default

When you need something a little smaller than large, or to compliment large body.

Inter
Semi bold 14px
Line height 22px
Letter spacing 1.25%
Paragraph Spacing 8px

Body default bold

Emphasises and highlights important words or small titles.  It’s used in expressive components, such as buttons and links.

Inter
Semi bold underlined 16px
Line height 24px
Letter spacing 1%
Paragraph Spacing 8px

Link large Used in line with large body, or when you need a large link.

Inter
Semi bold underlined 14px
Line height 22px
Letter spacing 1.25%
Underlined

Link default Used in line with default body, or when you need a smaller link.

Inter

Inter’s simplicity, clarity and rounded forms make it the perfect functional typeface for us.

Always default to Inter. Unless you’re being expressive, use Inter to make sure you communicate easily with everyone, especially in product.

Inter MediumABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890£$€!?#%&¢∞¥₿№@ΩωInter Semi BoldABCDEFGHIJKLMNOPQRSTUVWXYZabcdef

## Spacing

Spacing

Spacing tokens separate elements inside components and layout blocks — both horizontally, and vertically.
Our spacing scale helps make things consistent, while also making content easier to scan in a screen layout.

Foundational tokens

We use foundational tokens to set up all of our components and templates. 
They are used as a base for our semantic tokens.

Name

Valuesize-44pxsize-88pxsize-1212pxsize-1616pxsize-2424pxsize-3232pxsize-4040pxsize-4848pxsize-5656pxsize-6464pxsize-7272pxsize-8080pxsize-8888pxsize-9696pxsize-104104pxsize-112112pxsize-120120pxsize-128128px

Accessibility scaling

We have a defined scale for accessibility so that when screens are increased in size our content dynamically grows. This is so our customers continue to get that incredible Wise experience no matter what settings they have switched on.100%85%130%155%4px3px5px6px8px7px10px12px12px10px16px19px16px14px21px25px24px20px31px37pxetc...

Semantic tokens

So you know what space to use, and where, we use semantic tokens. 
These tokens are linked to our foundational tokens so that you don’t need to remember that component default is size-16 — neat, huh.

Usage

Use semantic tokens from the design system.

Use semantic tokens, not foundational tokens in your work.

Don’t use custom or hard-coded values.

Horizontal

Horizontal spacing refers to elements that go next to each other.

Name

Value

Accessibility scalingbetween-cardssize-12between-chipssize-8screen-mobilesize-24component-defaultsize-16Between cards

Cards are self contained blocks of content. In product these can be placed next to one another and scroll off screen.

Balance cards

Promotional cards

Others

Between chips

Chips allow us to filter content and are typically placed next to one another and scroll off screen.

Chips

Screen mobile

This is the overarching spacing that contains our mobile designs.

Mobile screens

Component default

When there are no other specific spacing tokens for components, use component default.

Buttons

Vertical

Vertical spacing refers to how sections of a screen are separated. It also applies to the spacing between components.

Name

Value

Accessibility scalingbetween-textsize-8image-bottomsize-8display-text-bottomsize-16text-to-componentsize-16content-to-buttonsize-24between-sectionssize-32between-optionssize-0component-defaultsize-16Between text

Text is any copy that isn’t using a display style. It’s built into our text styles, but you’ll need to add it in when they’re not in the same block of content.

Screen title to body

Body copy paragraph spacing

Image bottom

Our 3D assets contain built in padding, but sometimes require a little bit of extra breathing room.

Image to title

Display text bottom

Display text require a bit of extra space before other text due to their tight line height, uppercase and bold format.

Display bottom

Text to component

This refers to any text style that isn’t using a display style to any component.

Title to component

Body copy to component

Content to button

When a button is displayed directly below the content or form and not in a footer.

Form field to button

Between sections

Sections are groups of content that we need stronger proximity between so that it’s evident they’re separate.

Launchpad sections

Between option sections

Between options

Spacing is built in to all option components due to the large touch area. This means spacing between options is set to 0px by default.

Between activity options

Component default

When there are no other specific component spacing tokens, use component default.

Below section header

Between form fields

Between buttons

## Size

Size

Size is the vertical height of components — whether for variable or as a ‘fixed’ value.
A scale for sizes helps make the Wise experience more consistent. It means there is a more uniform look and feel, which relies on a series of predefined values.

Tokens

Use tokens coming from the design system.

Use semantic tokens instead of token values.

Don’t use custom or hard-coded values.

Name

Valuesize-x-small24pxsize-medium40pxsize-large48pxsize-x-large56pxsize-2x-large72px

Icons

The default size for icons is 24px. This is how they are used in the majority of cases.

Tokens:24px

Icons

Avatars

Avatars (used to contain images, flags, initials or icons) can be in 1 of 4 different sizes, depending on their context.

Tokens:24px48px56px72px

Inside inputs — 24px

As a secondary element — 40px

In alerts — 48px

In a list of items — 56px

As main element on screen — 72px

Buttons

Buttons (and other interactive elements, such as chips) come in different sizes.

Tokens:32px48px56px

Main actions — 48px

Circular buttons — 56px

Secondary interactions — 32px

Variable height

Some components don’t have a fixed height, so they can grow vertically and adapt to the amount of content they hold. In these components, padding takes priority. This differs from previous components, where the padding needs to serve the desired component height.

Alert

Popover

Option-based components

## Radius

Radius

Radius (or radii) are the rounded corners in components, and other pieces of content. They give the Wise experience a bolder and more expressive appearance.

Desktop scale

Name

Valueradius-small16pxradius-medium20pxradius-large30pxradius-x-large40pxradius-2x-large60px

Mobile scale

Name

Valueradius-small10pxradius-medium16pxradius-large24pxradius-x-large32pxradius-2x-large48px

Example

Patterns such as the Card Cluster use the radius tokens in conjunction with padding to ensure the content that sits inside has enough room to breath, making it easier to digest.

Desktopradius-x-large
40px

Mobileradius-x-large
32px

## Padding

Padding

Padding is the internal spacing in components that separates content from external boundaries.
Padding helps content breath, so places with lot of information don’t feel so crowded — making that content easier to consume.

Tokens

Use tokens coming from the design system.

Use semantic tokens instead of token values.

Don’t use custom or hard-coded values.

Name

Valuepadding-x-small8pxpadding-small16pxpadding-medium24pxpadding-large32px

Compact data

Components that are usually part of a set, and that need to contain distinct information in a small area.

Tokens:16px

Accounts

Stacked components

Variable height content

Components that have a varying amount of content inside use paddings that give content space to breathe, make it easier to read and digest.

Tokens:24px

Alert

Nudge

Popover

Card-based content

Content that goes inside a card (for example, with a background) may have a small padding area if the amount of information you need to fit inside cannot afford bigger space.

Tokens:16px

Graphs and banners

Footers

Footers have padding around to separate components from the rest of the content. Mobile has tighter paddings due to screen size, whereas it's bigger on desktop.

Tokens:16px24px

Mobile — 16px

Desktop — 24px

## Icons

Icons

They say a picture paints a thousand words. Well, our icons do that too. They're the ultimate shorthand — straightforward, simple, accessible.

Approach

Less is more

Solid lines, simple shapes, no unnecessary parts.
Easy as that.

Universally understood

We’re not trying to reinvent the wheel (icon). Clarity trumps clever concepts, especially for a global audience.A perfect pairing

The icons are designed to complement our 2 typefaces — Wise Sans and Inter.
They feature the same rounded corners of Wise Sans, the cleaner form and light weights of Inter, and the square terminals of both.

Choosing the right asset

Our assets each come with their own set of strengths. So we’ve outlined which asset to use where. And what the impact of that will be.

Icons

If you’re talking about product functions, or there are multiple products on one screen, use icons.

Illustration

If it’s a moment of celebration, something metaphorical, or just something bigger on screen, use an illustration.

Words

Finally, if you’re after a change of pace, or it’s more easily said than done, just use words.

Colour variations

In most cases, icons sit on neutral backgrounds. And the icon colour depends on whether it is interactive or informational. There is also a white version designed to work against a neutral surface. The bright green background is used very sparingly. Go to colour guidance.

Interactive

For interactive elements like close buttons we use Forest Green (Interactive Primary) on a neutral background.

Informational

For informational icons in lists, like in option components, use Content Primary on a neutral background.

White background

For use on neutral backgrounds, there is an alternative version with a white circular background.

Highlight

Bright Green backgrounds are used very sparingly to highlight — whether it’s a button or the selected category in a list.

Using icons expressively

Icons can be used outside of their functional boundaries to communicate key features in a far more expressive manner.

Key feature icons

Send

This icon symbolises sending money to others worldwide.

Receive

Knock, knock, your money’s here. This icon symbolises receiving money straight to your account.

Convert

Real rates. Quick speeds. Fair fees.  This icon symbolises converting money between different currencies.

Spend

Dollar isn't the default — we want to speak to our customers in their own currency. So we have a set of currency icons for the currencies we support.

Keep

Have 54 currencies on hand? This icon symbolises holding onto them.

Invest

Time to put your money to work. This icon symbolises investing your money with Wise.

Best practice

Key feature icon used in appropriate message.

Key feature icon used as decorative graphic.

Sizing

We have two different sizing rules for product and marketing.

Product

In product you can use icons at 16px, 24px and 32px.

Editorial

In editorial you can use icons at 16px, 24px, 48px, 64px and 96px.

Full library

Sign in

## Illustration

Illustration

Illustration helps us talk about our products in a more compelling way. It delivers bags of energy and character, providing moments of magic that help our brand leap off the screen, billboard, or wherever.

Sign in

## Logo

Logo

Our logo comprises the Wise wordmark and our Fast Flag. We can fly it just about anywhere. A mark of constant progress, it isn’t stuck to the borders that separate people. It brings us closer together.

Colour versions

Primary colour versions

Colour is the first visual thing we remember, and a powerful asset in building brand recognition. Our colour is green. We use it first, last, and for nearly everything in between.

Go to colour guidance.

Logos in secondary colours

When deep into a marketing application, you can also apply our secondary palette to our logo.  If it feels appropriate.

Using the Fast Flag

When people see our Fast Flag, they know whoever they are, wherever they are, they can use money. To make sure it stays that way, we use it wisely in the right places.

App tile

There's been a lot of discussion about how big our Fast Flag should be. Here, it sits larger and more to the left than in any other context.

Social avatar

In social situations, we never shout. So here the Fast Flag is a little smaller, while still sitting slightly to the left to make it optically central. It looks best that way.

Size and borders

Money doesn’t need borders. Logos do. Ours requires one flag’s worth of clear space  in all directions.

Minimum logo sizes

Print — 6mm high

Digital — 35px high

Positions

Placing our logo in the corner makes it nice and visible without taking up too much room, especially digitally. It can fly centrally though —  just give it plenty of space and make sure it sits slightly to the left.

Partner lockups

If you want to get somewhere fast, go alone. If you want to go far, go together. Our mission takes us around the world, so some strong partnerships are going to come in handy. Here’s how to let the world know who we work with.

Horizontal lock-up

When we display a partner’s logo alongside ours, we set it at the same height as our Fast Flag so it’s nice and consistent. And we use its width to create a good amount of space between the two.

Vertical lock-up

When we vertically stack a partner’s logo, they always go below us. We set their logo at the same width as ours. And we use the height of our Fast Flag to create the right amount of space between the two. Logo with tapestries

When it comes to type on tapestries, the first rule is always ensuring our logo is visible. To do that, we stick to white or Bright Green, and always make sure there’s plenty of contrast.

Go to tapestries guidelines.

White with enough contrast.

Bright Green with enough contrast.

Lacking in contrast.

Things to avoid

Don’t change the logo lockups.

Don’t adjust the logo.

Don’t place the logo on an angle.

Don’t add effects to the logo.

Don’t use the logo as a mask.

Don’t use the logo as a keyline.

Downloads

Sign in

## Focus States

Focus states

Focus states are the unsung heroes of the web experience. They're essential for users with impairments that make it hard to use a mouse, or who prefer a different method of navigation. They show the user exactly which interactive element they’re on as they tab through the screen using a keyboard or assistive technology.

Principles

Highly visible

Accessibility is a must. We’re here to open the world up, not shut people out. So our focus states are designed to go above and beyond the requirements in WCAG 2’s focus appearance criteria.

Branded for scale

We reuse colours from our existing palette so our focus states feel on-brand and look good against other colours on the screen. The designs scale across all colour themes so they stand out on any of our surfaces.

Never distracting

We only show focus states for users that need them. On tab, not on click. It’s a win-win strategy because it means we can be highly accessible, while also reducing visual noise wherever it’s not needed.

Buttons

Style overview

For buttons and components where at least one variant has a filled surface colour that’s different to the screen background, the focus state is a highly contrasting 2 pixel border.

Visibility across colour themesA 2px transparent offset between the focus border and the component keeps the border clearly visible no matter the surface theme. Focus border colour

We almost always use our interactive-primary colour for the focus state border. But very occasionally, we might use a different colour token if it helps to keep things looking intentional. For example, on our negative button we make the focus border colour sentiment-negative to match the button surface because it looks cleaner visually. Form inputs A 3px border in our highly contrasting interactive-primary colour really makes input focus states stand out from the crowd.  
Interactive icons

Default guidance

For interactive icons, the focus state is a solid 2 pixel border in our interactive-primary colour. We also round the corners of this container by 4 pixels to keep it on brand. Exceptions

There are a very small number of exceptions where we make the icon's focus state completely rounded to add visual style:
For close or back buttons that are already in a circular container.

If the icon has a round border, like an info circle, and we know that it will never change to a different shaped icon.
Links

On focus, we surround links with a solid 2 pixel border using our interactive-primary colour and we round the edges by 4 pixels. We also add 2 pixels of internal padding to give the link text space to breathe. Any more, and the focus border would start to overlap other nearby text. 
Tabs and navigation

For tabs and other navigational components, we need to be mindful of the selected state, which can be different to what’s in focus. To keep it crystal clear which tab is selected and which is in focus, we only put the focus state container around the label itself, and not the whole tab.
Other interactive elements

For other UI elements that don’t need to appear in a form alongside inputs, we stick to a 2 pixel border. Here’s an example of a navigation option in focus.

Tips for custom components

Any UI element that users can interact with needs a focus state, so you’ll need to apply the styles listed above to any custom components your team builds. Never just rely on the browser default styles as they look off-brand and probably won’t have enough contrast against our colours to be accessible. The system styles are designed to work for all use cases. But if you ever get really stuck and need something custom, make sure you follow the WCAG 2 focus appearance guidelines to keep it accessible. 

Don’t forget to test on dark mode and all of our other surface themes too. That way you can make sure that the focus states always stay visible and pass WCAG requirements. You should also make sure the focus state is never obscured. For example, the user shouldn’t be able to tab to an element that they can’t see because it’s offscreen or hidden within an unopened dropdown menu.

## Motion System

MotionA brand that moves money, needs an identity that moves too.

Principles

Follow these 3 simple principles to ensure we flow just as the world’s currencies do. Snappy

Wise is revolutionising banking by challenging old systems that restricted money. In motion we communicate breaking away from institutions with snappy, simple, fast and satisfying movements. Like flipping a coin. But it’s not hyperactive, erratic or rushed. Let’s not give people motion sickness.A match cut creates a snappy transition by smoothly aligning animated properties like movement and shape between scenes.

The above example also uses a match cut technique to create a snappy but smooth transition.

Fluid

Wise is on a mission to make money borderless. For money to become borderless it takes on a fluid state. In motion we communicate fluidity with organic and flowing movements.

Fluid is not a kite in the wind — unstable and directionless, with nothing to hold on to.A fluid rhythm can be created by transitioning elements, such as text and icons, into and out of a scene.

Tapestries contain many animated layers that can also add fluidity and depth when used.

Morphing elements to transition from one scene to the next can achieve a sense of fluidity.

Intuitive

People are leading increasingly global lives, yet the tools available for managing money remain outdated. At Wise, we prioritise transparency, speed, and ease of use in the services we offer to our customers. Through motion, we convey our human-centric approach with a natural pace and a sense of physical weight in movement.

Intuitive isn’t crudely handmade, polished to perfection or complicated, intuitive is natural.

The UI elements move intuitively, mimicking a natural user interaction scrolling through the different balances.

Numbers scale as the user interacts with the calculator, toggling between input values. The animations provides immediate and clear feedback.

Applying principles

Here is a deeper dive into how to apply the motion principles. These aren’t rules, but tips on how to make motion feel distinctly Wise, and how to avoid going too far.

Speed graphs

Our motion should feel natural and human, like the swipe of a finger. Motion shouldn’t feel stiff or mechanical.

Natural Movement

Mechanical movement

Visual intensity

Snappy allows us to be visually bold and exciting. But be careful not to become inaccessible and disorientating.

Intentional and paced

Inaccessible and disorientating

Product UI colours used within UIProduct colours used as expressive colours

Repetitive fluidity

Our motion should be fluid and rhythmic, which means hitting the right beats. Motion that doesn't land or rest becomes nauseating.

Steady rhythm

Directionless and loose

Tapestries in Motion

Our tapestries are bold and expressive. But with motion, they really come alive.

Work with layers

Our tapestries are artworks full of detail, and animating them flat doesn’t do that justice.
Using the original .PSB files, retaining the same .PSB layer modes animate each layer individually using the positioning, scaling and timings values.
Explore the details of the entire tapestry, play with crops, but always consider the final, full layout.

Finish with a displacement map and noise

The final touch is generating gentle, water-like fractal noise and subtly applying a displacement map layer to our tapestry.
Now it flows, natural and expansive, and delightful to watch.

Illustration in motion

Add an extra dimension to illustrations with motion. Both objects and tapestries can move to bring them to life. Just make sure things feel fluid, appropriately paced and looped to get the best desired effect. Animating tapestries

We’ve applied distortions to our tapestries to create areas of fast and slow movement, giving each a slightly magical way of moving.
We achieve this by warping the object UVs to create areas of high and low tension.
In Cinema 4D this can be done simply by distorting the UV mesh slightly with soft selection turned on, or by using the ‘weld and relax’ command with a only a few discreet edge cuts.

Animating form

To make the most of our message we can also animate the form of the illustration itself. This can be a slippery slope, so here's a few tips on to stay on your feet (and on brand).

Fluid and steady motion

Our illustrations are purposefully bright and expressive. The last thing we want is motion weighing them down. Keep it grounded and make sure they loop seamlessly.

Geometric alignment

Motion should make our illustrations sing, not tear them to pieces. Keep everything moving along an axis to keep them in perfect harmony.

Accessibility

All video content should be accessible to people with visual and/or hearing impairments. Below are a four ways you can make your videos more inclusive and compliant. Captions

Video captions are synchronised text displayed on a video showing dialogue, sound effects, and important audio cues.
Most platforms use speech recognition technology to automatically add captions to videos. While useful, these captions may have errors. Ensure that you review captions to reduce errors.

Transcripts

Transcripts provide the full text of a video's audio, including dialogue and narration. Transcripts allow people to quickly search for key words of phrases.
Similar to captions, most platforms use speech recognition technology to automatically generate transcripts for videos. However, it is still important to review these transcripts to minimise errors, as this technology is not always accurate.

Audio

Audio descriptions are narrations of the visual elements of a video. Audio descriptions help people who are visually impaired by explaining what’s happening visually.
Unfortunately most platforms do not offer automated audio descriptions. However, there are plenty of third party tools that can be used to generate audio descriptions for videos. More information how to produce audio descriptions can be found on the WCAG website.


_[content truncated]_

## Transitions

Transitions

Transitions occur when users move between screens starting a new flow or navigating within a journey. They help users navigate through the app creating a sense of continuation. These transitions should always be unobtrusive and natural.

When to use  and types

Currently, we support two main kinds of page transitions

Upwards

Sideways
And two supplementary modals transitions

Modals

Bottom sheets

Upwards

Indicate the start of a new action. Use it for the opening of a new flow like Send or Request Money.

Sideways

Indicate the continuation of a flow. Use it for consecutive pages within the same flow.

Modal

Use it as a quick supplementary task like selectors or filters during an activity, it should always be dismissible.

Bottom Sheet

Use it as a small supplementary action or content display during a flow or activity.

Upwards

This pattern indicates the start of a new flow/action in the app, such as send or receive money. Its purpose is to communicate that a new user journey or action starts from that point. It must always contain a dismissal button on its top left corner.

Upcoming screen comes in from the bottom fully covering the previous screen.IOSScreen slides in from the bottom

Android

Screen slides in from the bottom

Sideways

This pattern indicates the continuation of a flow whenever an action has already been started. It allows the user to navigate forward and backward between pages at consecutive levels within the same hierarchy. Sideways are lateral transitions used for consecutive screens on the same hierarchy levelIOSOn IOS an overlay is shown below the upcoming page

Android

Android doesn’t use overlay

Web

On web the content moves from forward to backward and disappears quickly with a transparency effect.modalsA Modal is a container to display supporting content such as selectors or a short supplementary task on mobile experiences and it should always have a dismiss button on the top left corner For more information on this topic, check the Modals page on Components section.A modal is an overlay that interrupts the user’s task to show an important message, disabling the rest of the screen.IOSOn IOS a full page bottom sheet is available and recommended to be used for selectors and single page actions.

Android

Bottom sheets are displayed as full pages but serve the same purpose as IOS.bottom sheetsA bottom sheet is a container you can use to display supporting content or a short, supplementary task on mobile and web experiences, also known as Modals or Pop-ups. For more information on this topic, check the Bottom Sheets page on Components section.

Bottom Sheets supports supplementary tasks on mobile and web experiences.IOSAndroid

Web

Container comes in from the bottom and disappears with a fade when dismissed.

Best practices

Do not use consecutive modals to replace typical page-to-page user flows.

Designers should always specify which kind of transition should be used when handing off flows to Engineers.

Transitions should always be intentional. Avoid using different transition patterns for similar needs.

## Grid

Grid

Our grid system ensures that our content is appropriately designed for all screen sizes.

Grid scale

Our grid consists of 5 sizes from XS on mobile to XL on desktop. Our maximum grid width is 1440px. Anything larger than this the content centralises to the viewport.XS320px - 479px
Columns: 6
Margin: 20
Gutter: 12S480px - 767px
Columns: 6
Margin: 32
Gutter: 12M768px - 991px
Columns: 12
Margin: 40
Gutter: 16L992px - 1199px
Columns: 12
Margin: 80
Gutter: 28XL1200px - 1440px
Columns: 12
Margin: 100
Gutter: 32XXL+1440px
Grid is centred

## Tapestries

Tapestries

They say life is a rich tapestry, so we created our own. Fusing colour, imagery and texture, each weaves together its own story of global experience and culture. Painting an evocative picture of truly borderless money. With something new to spot every time.

Sign in

## Vocabulary

Vocabulary

The words of the Wise experience, and how to to write them.AAccount

Users can sign up for an account to send, spend and receive in multiple currencies, as well as hold and convert money.
We offer 2 types of account:

a personal account (the Wise account)
a business account (the Wise Business account)

For the personal account — ‘account’ is always lowercase. For the business account — ‘Business’ is uppercase and ‘account’ lowercase. Sometimes it’s ok to write ‘business account’ in lowercase if you’re saying something more generic, like “switch from your personal to your business account”.
Be careful not to say or imply that a customer has a Wise account or Wise Business account if they have registered with Wise, but have not been through the verification process. Only say or imply that they have either account once they have been verified.

Account details

Bank account numbers that we give to account customers so they can receive money from different regions, as if they had a bank account in that country.
Always lowercase (except at the beginning of a sentence).

Assets

Assets is a feature that lets customers choose how they hold their money with Wise.
They can choose to hold their money as cash, which is how money is typically held. They can also choose to switch their cash to either:

Interest — where we invest their money in a Money Market Fund
Stocks — where we invest their money in an index-tracking fund

If customers turn on Assets for a currency in their main account, they can still send and spend their money as usual.
Always write Assets, Stocks and Interest with capital letters.

Auto Conversions

Auto Conversions is a feature that lets customers pick a desired exchange rate between 2 eligible currencies, plus an amount to convert. Wise then automatically converts the money when the desired rate is met.
Capitalise both words when referring to the feature itself, for example "You can now use Auto Conversions". But use lowercase when using it in context, for example "set up an auto conversion".
When talking about the exchange rate itself, use "when your desired rate is met". Rather than 'hit', 'reached', or any other variation.BBalance

Use the term balance to refer to the amount of money someone has.
For example:

The total balance in your Wise account
Your account has a negative balance

Don’t use balance as an identifier for a specific currency. For instance, don't say ‘Your GBP balance’ if you mean ‘Your GBP’.

Bank

We’re all about money. But we’re not a bank.
We can talk about customer ‘accounts’. We can talk about money, currencies and conversion. We can talk about the bank details that money is being sent to.
But keep banking language — in particular the words ‘bank’, ‘banking’ and ‘bank account’ — out of copy when describing Wise, our services or our products.

Batch payment

Multiple payments made to different people using one payment from a single bank account.CCurrency

The official money of a country or region. For example, US dollars, Chinese yuan, euro.
Use the term currency or currencies to identify a specific type of money that customers have within their Wise account.
For example:

Add a currency (when a customer wants to add a new currency to their account)
Your available currencies
Customers

People and businesses who send, spend, receive, or otherwise manage money with us.

Customer Support team

The team that supports customers when they need help. Use a capital 'C' and 'S' because it's the name of a team.
Use "Chat with us" or "Talk with our team", rather than "Chat with an agent".DGroups

Groups are available on both the consumer and business accounts.
On the consumer account, they allow customers to share money with other Wise customers.
On the business account, they allow customers to separate money from their main account and get a dedicated digital card for that money.
Should be lowercase, unless you are specifically referring to the feature itself.
For example:

Create a new group
Move money to your group
Read more about Groups
EExchange rate

When a customer converts from one currency to another, we give them an exchange rate. An exchange rate is the price of one currency in terms of another currency.
Exchange rates rise and fall depending on demand for each currency — we do not pick and choose our rates. They come from a combination of Google and Reuters, who typically get them from stock exchanges around the world.
Don't say 'best rate', because we can't always guarantee that we're the best.
Sometimes you can drop 'exchange' if it's obvious from the context that the topic is about currency conversion.FFee

When a customer uses a part of our product that costs money, we charge them a fee. Other financial institutions can charge us or customers fees as well. Usually, a fee is there to help ‘cover a cost’.GGlobal

Use ‘global’ when talking about cashflow and services, but never when talking about Wise as a brand or team.

Groups

Groups are available on both the consumer and business accounts.
On the consumer account, they allow customers to share money with other Wise customers.
On the business account, they allow customers to separate money from their main account and get a dedicated digital card for that money.
Should be lowercase, unless you are specifically referring to the feature itself.
For example:

Create a new group
Move money to your group
Read more about Groups
JJar

Customers can use jars to separate and save money away from their main account. Customers can open as many jars as they need, in whichever currencies they use. Customers can also add multiple currencies to the same jar.
Should be lowercase, unless you are specifically referring to the feature itself.
For example:

Set aside money in a jar
Use jars to separate your money
Read more about Jars
MMain accountA customer’s main account is where they hold their primary currencies. It's separate from any groups or jars they open.
Use main account when it’s important to distinguish between it and other jars or groups.
Examples:

We’ll create a new jar using money from your main account

Guidelines:

Should be ‘Main account’ when used at the start of a sentence, or to label the container.
Should be ‘main account’ when used within a sentence.
Multi-user accessA feature of the business account. It gives multiple users access and permissions within a single account.PPayment method

The way a customer chooses to pay a fee for a transfer or other feature. For example, bank transfer, debit card, and credit card are all payment methods.RRecipient

The person or business that receives the money when a customer makes a transfer.SScheduled transfer

Customers can choose to set up a transfer so it sends automatically at a later date. They have to select the date and frequency of the transfer, and we’ll take care of the rest.

Statement

When a customer wants a record of their transactions, they can get a statement from us.
A statement shows transactions over a certain time frame. While a receipt shows the details of a particular transfer, payment, or batch payment.TTransfer

Transfer (n) — money a person or business sends or receives, in one transaction, through our product.
Transfer (v) — when a person or business sends money using us.UUniversal

Use ‘universal’ when you’re talking about Wise overall — it’s encompassing, inclusive, and right at a brand level.VVerify

To provide proof to show that something is true and legitimate, like your identity or where your money came from. Financial organisations often have to ask customers for proof to help keep their money safe.WWise debit cardA card we offer that allows users to spend in 150+ currencies.
Bear in mind that some regions have different card offerings, which might have particular requirements about what we call the card in marketing content.
Use the full title ‘Wise debit card’ the first time you refer to it, and once it’s clear that you’re referring to the Wise debit card, you can use 'y

_[content truncated]_

## Grammar and Style

Grammar and style

We've got our own way of writing certain things, and we cover them here. It helps us to be consistent, whatever and and wherever we're writing.AAcronyms

Don't use an acronym unless it's commonly used, and spelling the words out will cause more confusion.PDFPortable document format

Active voice

Use the active voice instead of the passive voice. In the active voice, the subject of the sentence does the action. In the passive voice, the subject of the sentence has the action done to it. The active voice makes it clear to our customers who is doing what.

Jon broke the sauna

The sauna got broken by Jon

Ampersands

Don’t use ampersands. Stick to a good, old-fashioned “and”, unless the ampersand is part of a brand name — like Tiffany & Co. or Ben & Jerry’s.

Send and receive money

Send & receive moneyBBrackets (these)Only use brackets for referencing abbreviations or data. They can make things a bit difficult to read otherwise.

If you’ve got part of a sentence in brackets, then the punctuation sits outside them (like this). (But if you’ve got an entire sentence in brackets, then it sits inside. Like this!)Don't put punctuation inside brackets (if only part of the sentence is in the brackets.)Bullet points

Bullets are useful for adding structure to longer copy, and making it easier to scan. Only write one point per bullet point. And don't put full stops at the end of bullets.
If the sentence that introduces the bullet points is a full sentence, then the bullets start with capitals. But if the sentence that introduces the list of bullet points isn’t a full sentence, don’t use capitals.

We’ll need some things from you:

A copy of your passport
Proof of your address, dated within the last 3 months
Proof of your income, like a payslip or tax return

We’ll ask for:

a copy of your passport
proof of your address, dated within the last 3 months
proof of your income, like a payslip or tax return
We'll need some things from you:

a copy of your passport.
proof of your address, dated within the last 3 months.
proof of your income, like a payslip or tax return.

We’ll ask for:

A copy of your passport.
Proof of your address, dated within the last 3 months.
Proof of your income, like a payslip or tax return.
CCases

Use sentence case for body copy, headings, subheadings, links and buttons. That means that only the first letter of the first word is a capital. But if there’s a proper noun, like a name or a place, make sure you give that a capital.

Sending money internationally

Sending Money Internationally

Change

Use ‘Change’ if the user is switching from one option to another. But if they have the ability to make changes to something, use ‘Edit’ instead.
For example, if you want to change the postcode on your saved address, you would ‘edit your address’. But if you want to switch between two saved addresses, you would ‘change address’.

Change your default currency

Edit your default currency

Choose

Use ‘Choose’ when the user needs to make a decision between options, where any of the options could be true. If the user doesn’t need to decide anything, and only one of the options can be true, use ‘Select’.

Choose how people can pay you

Choose your date of birth

Contractions

Use contractions. They help make your writing conversational and human.

We're, you're, can't, doesn't, won't

We are, you are, cannot, does not, will not

Countries

Abbreviate countries that are abbreviated in spoken language — places like the United Kingdom, United States of America, and United Arab Emirates. And don't include full stops/periods between letters.UK, US, UAEU.K, U.S, U.A.ECurrencies

Currency codes are the language of our product. Depending on the context, you may need to explain what the currency code is. Write it in brackets after the full currency name:

New Zealand dollar (NZD)
Euro (EUR)

When writing out the name of the currency in full, always capitalise the country, but never capitalise the name of the currency.
When writing out an amount of money, put the currency code after the figure, with a space between.
Avoid using symbols — unless you're writing for a specific market — as one symbol, like $, can represent several different currencies.US dollar, British pound
10,000 SGD, 50 BRLUS Dollar, British Pound
10,000sgd, 50brlDDashes

Use an em dash (—) with a space either side instead of brackets, or in place of commas, to show an interruption or to add emphasis.
Don't use dashes for a range of numbers. See Numbers.

Use an em dash to show emphasis — like this.
Use an en dash to show a range of numbers, say from 1–10.

Don't use an em dash for a range of numbers, like 4—8.
Don't use an en dash in place of commas – or to add emphasis – because it's all wrong.

Dates

Every localised team should do numbers in a way that suits their regional audience. For the UK, the format’s dd/mm/yyyy.
Don't use cardinals in dates (the -th, -rd or -nd after the number).
Include the day when writing a date if you’re writing longer form copy (like an email), and the day of the week is of relevance or importance to the user. For example, if you’re telling them about a date when our service might be interrupted, it could be useful to include whether it’s a Monday or Saturday.1 March
1 March 2023
Wednesday 1 March 20231st March
1st March 2023
Wed 1st March 2023Driving licence

You need a driving licence to drive a car. A different spelling won't get you anywhere.

Driving licence

Driver's licence, drivers licence

Dropdown

One word, no hyphen.

Dropdown

Drop-downEEdit

Use ‘Edit’ when the user can make changes to something that already exists. If the user is just switching from one option to another, use ‘Change’ instead.
For example, if you want to change the postcode on your saved address, you would ‘edit your address’. But if you want to switch between two saved addresses, you would ‘change address’.

Edit personal information

Change personal informationE.g.

Write ‘for example’ instead, if you have to. It’s better to use a more conversational word when giving examples, though, like ‘like’.

For example, likeE.g.

Emoji

Our language is bold and simple. Written to be understood by anyone, anywhere. So don’t use emojis. They're hard to localise, and aren't that accessible.

Words are the way forward❌Ellipses

Ellipses (...) are used to indicate that a thought isn’t finished, or that there’s something missing from the sentence. Don't put any spaces before or after ellipses, ever.I’m not sure about it...but I’ll work it out.

This doesn't look right ... because it isn't.

Email

No hyphen.

EmailE-mail

Etc.

Don’t use ‘etc.’ or ‘and more’ in external communications. If there’s space, it’s better to give some examples to show what you mean.

Don't be lazy, give examples.

Etc., and more

Exclamation marks

Most of the time, you don't need an exclamation mark. They don't work in our tone of voice. But if you must, only use one at a time.

Hey!

Hey there!!!FFull stops (periods)Use them. And use them some more. Full stops are one of the easiest ways to break up chunks of text, and make content more succinct and readable.
Quick tip — if you read a sentence out loud, and you feel like you need to breathe in before the end, you need more full stops.
For headings and subheadings — don’t use full stops (in either the product, or in marketing). Only use them in body copy, or when specific components say so.

Bold heading
And some body copy.

Bold heading.
And some body copyLLogin

Login, one word, is an adjective. Log in, two words, is a verb.

Put in your login details.
Log in to your account.

Put in your log in details.
Login to your account.MMarkup

Markup, one word, is a noun. Mark up, two words, is a verb.

There are no markups on the exchange rate.
We don’t mark up exchange rates.

There are no mark ups on the exchange rate.
We don’t markup exchange rates.NNumbers

Use numerals instead of spelling numbers out. For example, write 10 not ten. Numerals are much 

_[content truncated]_

## Tone of Voice

Tone of voice

We’re on a mission. And it’s money without borders. Instant, convenient, transparent and — eventually — free.
We want to tell the whole world about it. All the people. In all the places. Which is why we’ve got to find the right words for everyone, everywhere, every single time. On the side of a bus, in the depths of the internet, or staring you in the face on the subway.
Words for here, there and everywhere. It’s our voice that joins the dots. It makes us consistently and unmistakably Wise. Language isn’t unique, but the way we use it is.
Here we’ll explain how to be Wise with your words. How to confidently and clearly speak in our voice. When to dial it up, and when to tone it down. So that no matter the writer, our customers only hear Wise.

Principles

The foundations that guide our voice. The why behind our words. The rails that keep us on track, and always looking forwards.

Intrepid

Forget the road less travelled. We forged our own. Going where others won’t is in our DNA. As is using our voice. Being outspoken when it’s right, not just when it’s convenient. But we’re not different to be disruptive. We’re disruptive because we believe in a different way of doing things.

Universally authentic

Authenticity means staying true to our mission. And showing up as ourselves. Wherever we are, whoever we’re speaking to and whatever we’re saying. We do it openly and honestly. It’s how we create trust — and genuine impact.

Delightfully simple

We exist to simplify people’s international lives. To put the power, pounds and pesos back into their hands. Moving money at lightning speed is complex. But it’s our job to make it sound, feel and be simple. Even magical. So it’s more second nature, less second guessing.

How to speak Wise

Celebrate the mission

Highlight speed, ease and transparency whenever you can. And don’t be shy when talking about MONEY. Kuna to krona. Yes to yen. Win with won. But no west-centred supremacy on GBP, USD and euros please.

Be concise

We aim for 100% clarity, as briefly as possible. Our words must inspire confidence, not cause confusion. So write headlines as if it’s illegal to write subcopy. Universal simplicity, max transparency.

Make it modern

We’re inclusive. For everyone, everywhere. And our language should be too. So pick the right pronouns. Use everyday words — the ones used by everyday people. It’s ok to bend grammar rules (but don’t break them). And be careful with slang. LOL works on Insta, but not for investing.

Give it energy

Wise is going places. Just like our customers’ money. Our voice is pacey, playful, and full of infectious enthusiasm to match. Paint pictures with words to show movement. F1 speeds, car sharing fees. Cairo to Cali.  Here, there, everywhere. Add colour

We add delight right when it’s needed, not only when it’s expected. It could be a little alliteration, a well-chosen cultural reference, or 1 perfect word instead of 5. Cha-ching. Each makes the experience richer. In as few words as possible, naturally. Right place, right tone

Wise is well travelled. Used across the globe, by millions of people, for work and WAHEY.

And whatever our customers are doing with their money, our words are right there with them. Touching down in a new city. Taking their business to the next level. Feeling flush. Or feeling the pinch.

There’s only one Wise voice. But the tone flexes depending on the situation. Let’s look at a few.

Standing out

This is the fun part. Where we can dial up the energy for max engagement. A clear, crisp message is the name of the game. Think billboards, social ads and anywhere we need to make our mark in seconds.  We’re heeeeeeere! How?

Short and sweet

Full of energy

Lots of colour

Converting customers

Headlines hook people’s attention, but we need more to reel them in. So it’s time to dial up speed, ease and transparency. Perfect for landing pages, the App Store, and anywhere we want people to hop aboard.

How?

Direct and concise

Real language, no stiff sales jargon

Lead with the customer benefit and what people gain

Adding delight

We believe people need more than low prices to sign up and stick around. So treat the seemingly insignificant moments like they’re anything but.

How?

Play with the unexpected

Add a touch of humour when it suits

Write like a 21st century human

Providing reassurance

Things may go wrong, but we can still get it right. Be clear and concise, without  being cold. How?

Personable and human, but to the point

Reflect the mission pillars

No messing with metaphors or humour

Go global, write local

Maria’s the most common name in the world. You probably know one. And we want to reach them. Do they live in Santiago? Bern? Bromley? Point is, these millions of Marias all speak different languages. Money without borders doesn’t mean money for English speakers only. To make our voice universal we localise Wise. That doesn’t mean simply translating. It’s a license to transcreate — to bring conc

_[content truncated]_

---

# Components

## Action Prompt

_Source: https://docs.wise.design/components/action-prompt_

Action prompt

An action prompt is a message that requires the user to actively choose between options.

When to use

Use an action prompt when you want the user to make a choice. They should have at least two options, even if one is just to dismiss the message.

Types & Usage

There are 5 types of action prompts: error, warning, neutral, success and proposition. Each has a different use case and rules around their implementation.

Error

Use an error to let users know when something has gone wrong and needs their attention. This explains why a transaction failed and what the user can do to fix it.

Don’t use an error for potential future problems — use a warning.

Warning

Use a warning when you need to alert users to potential issues that could impact their experience. These messages are preventative — they help users take action to avoid negative outcomes. This warns the user that without adding money, their payment will be declined.

Don’t use a warning when something has gone wrong and needs the user’s attention. Neutral

Use a neutral prompt for everyday tasks that need a response to move forward. These are functional requests, such as asking a user to "Send" or "Decline" a request for money.

Use a neutral prompt when the action has no risk or urgency — like responding to a payment request.

Don’t use a neutral prompt when you need to alert users to negative issues.

Success

Use a success prompt to confirm a process is finished and offer the user their next logical action.

Use a success prompt to convey that an action or process was completed. Don’t use a success prompt to promote an action the user hasn’t started.

Proposition

Use a proposition to encourage the user to take an action that might benefit them. Only include a proposition when it fits naturally into the user's current context. Consider what screen they're on and what they've recently done. Use a proposition to encourage the user to do something relevant to their current task.

Don’t use a proposition where there’s no clear benefit or reward to the user.

Placement

Outside of Launchpad, place action prompts where they’re most relevant to what the user is doing. Interaction

Dismissibility

If the prompt has two buttons (like "Send" and "Decline") don’t include a close button. In these cases, the message will disappear as soon as the user makes their choice.

Include a close button (X) for optional actions, if either button doesn’t allow the user dismiss the prompt.

Include a dismiss (X) for single-action prompts so users can clear the message.

Don’t use a dismiss (X) when dual CTAs (like Send/Decline) already handle the dismissal.

Call to actions (CTAs)Action prompts always need a button because their purpose is to get a decision from the user. The button should clearly state what will happen next.

This states where the user will go and what they can expect.

Don’t use an action prompt without a button. Consider using an Info Prompt instead.

Writing an Action prompt

Every action prompt must give the user enough information to make a confident choice. You should always:Be direct: clearly explain the situation and the choice the user needs to make.

Use specifics: include names, dates, or amounts to help the user act quickly.

Write in full sentences: use full stops in body copy to make the text easier to read.

It’s important to consider the tone of your message. Sometimes you might be giving the user good news, and sometimes it might be a warning, or bad news. Depending on the scenario, you'll need to adopt a suitable tone of voice.

Error

This prompt must explain what went wrong and how to fix it. Clarity is the most important part of an error message.

Header

Be specific and put the most important details first, like the amount or the merchant name, so they understand the issue at a glance.

Payment declined: 30 GBP at Apple.

There was a problem with a card payment.

Body copy

Use the body copy to give extra details that help the user solve the problem. Explain why the issue happened and what the next step is.

Your card’s frozen — unfreeze it to continue spending. Card frozen. Call to action

The CTA should start with a verb that describes the user's next step or the place they’re going. Unfreeze card

Continue

Help the user understand the issue by placing key information in the header.

The header is vague, the body copy doesn't explain how to fix the issue, and the button doesn't describe the action the user is taking.

WarningA warning prompt must make the risk clear and the next step obvious. Use every part of the prompt to guide the user toward the right action.

Header

Use the header to land the most important information. Be specific and front-load key details so the user understands the risk at a glance.

Your Wise card expires on 14 August Your card will expire

Body copy

Use the body copy to explain the risk and how to avoid it. Be direct about what will happen if they don't act.

Renew your card to keep spe

_[content truncated]_

## Avatar

_Source: https://docs.wise.design/components/avatar_

Avatar

An avatar is a representation of a unique entity — like a person, a business, or an object. It can contain initials, images, icons, or flags.

Sizes

Supported sizes are 16, 24, 32, 40, 48, 56,  and 72.

Avatar sizes

List item supports five different avatar sizes with 48px as the default, other avatars supported include 32px, 40px, 56px and 72px.32px

Used on a case by case basis where a smaller list item is required.40px

Used for summaries and where you need additional space.48px - Default

Default size for list items used across the app.56px

Used where a larger size is needed when choosing between options.72px

Used for promotional purposes.

Media

There are 4 media types available for avatar. Image, flag, icon and text.

Image

Avatars can have an image. Can be uploaded by the user or representation of a partner by utilising their logo.

Flag

Flags allow us to visually communicate countries  and currencies.

Icon

Icons are used to illustrate information or as an entry point.

Text

If the user profile image is unavailable, a fallback up to two numerical characters can be used instead.

Image

Images are used to represent either a person or a brand by utilising their logo.

If no profile image is available fallback to initials on the text avatar type.

If no logo is available fallback to category icon on the icon type.

Do not stretch or allow logos to bleed outside of the avatar shape.

If no profile image is available fallback to initials on the text avatar type.

If no logo is available fallback to category icon on the icon type.

Logo should be recognisable inside of the shape.

Do not stretch or allow logos to bleed outside of the avatar shape or use images with transparent backgrounds.

Flag

Flags are used to represent either a currency or a country. We support all global flags in our libraries.

Icon

Icons are used to illustrate information or as an entry point.

Icon avatars come in an interactive and non interactive state, see more information under interaction.

Use icons that clearly represent the action being presented.

Used to represent categories

Used as standalone to support other content

Text

Text is used to represent a person or to showcase there are more than 2 items in a collection on a double avatar.

Text avatars come in an interactive and non interactive state, see more information under interaction.

Size 16 avatar does not support the text variant as it doesn’t pass accessibility standards.

Use text for initials

Use text to reflect more than 2 items in a double avatar

When you need to display more than 9 additional items display it as +9Don’t add more than 2 characters

Text can be used for initials

Text can be used to represent a number of items behind an avatar

Don’t add more than 2 characters.

When you need to display more than 9 additional items display it as 9+Types

There are 2 different types of avatar with multiple subtypes underneath each.

Single

Double

Single

There are 3 types of single avatar, standalone, with a badge or with a notifications.

Standalone

With badge

With notification

Standalone

When you need to make it easier for a user to identify content, like a recipient or currency.

Used on list items to visually elevate and support the information.

With badge

Badges contain additional information to support avatars, such as flags, the Wise logo, images, statuses actions and references.

There are 6 different types of badges you can use.

Flag

Used to represent currency or country

Fast flag

Used to represent a Wise account.

Image

Used to represent other brands

Status

Used to represent status.

Action

Used to indicate a supporting action.

Reference

Used as a reference to an action already taken.

Use on activity list, navigation option or standalone avatars.

Don’t use more than one badge in the avatar.

With notification

Notifications are used to indicate to the user that there is a notification behind the avatar that requires their attention. These are primarily used for the profile avatar.

Notification usage on the profile avatar.

Double

Double avatars are used when you need to display more than one avatar at the same level of hierarchy. This can be useful for representing recipient and currency or for currency conversion.

Horizontal

Diagonal

Double horizontal

When you don’t need to retain width alignment with other avatars to keep content aligned — for example in action buttons or tables.

Double horizontal avatars are used to represent two related items on the same level of hierarchy within variable width content.

Use within variable width content where there is no impact on the visual alignment.

Avoid using a double horizontal avatar if it affects the content alignment, such as in a navigation option.

Use the second avatar to highlight when you need to communicate more than 2.

Don’t use more than 2 avatars.

Double diagonal

Use when you need to retain width alignment with other avatars — for example in n

_[content truncated]_

## Bottom Sheet

_Source: https://docs.wise.design/components/bottom-sheet_

Bottom sheetA bottom sheet is a container you can use to display supporting content or a short, supplementary task on mobile experiences.

When to use

Use a bottom sheet:in mobile experiences when you need to temporarily break away from the main context to show content, or a short task, that’s supporting or supplementary

Don't use a bottom sheet:if the content or task is not supplementary or supporting, and is part of the main context (use a full screen instead)Best practice

Keep tasks short and simple — you don’t want the user to forget the main context they came from, so avoid creating a product within a product.

Don’t navigate between views within bottom sheets because they are just for short, simple tasks, and users could get lost if they don’t know how to go back.

Don't display a bottom sheet on top of another bottom sheet — either add the extra information to the existing bottom sheet content, or direct users to a new screen.

Interaction

Scrolling the content

The height of the bottom sheet automatically adjusts to the content inside it. But if the content is longer than the maximum height that the bottom sheet can expand to, the content will overflow and become scrollable.

Dismissing a bottom sheet

Users can dismiss the bottom sheet by:tapping or clicking the close buttontaking an action within the bottom sheet contentdragging or swiping the bottom sheet down

PlacementA bottom sheet is a type of overlay that appears on top of the main content on the screen. It’s fixed to the bottom of the screen and sits above a dimmer. The dimmer is used to focus the users attention on the bottom sheet content so that the user needs to interact with it before they can progress.

Width

Bottom sheets fill the full width the screen on mobile devices.

On wider screens, like i

Pads, the bottom sheet will fill 2/3 of the width of the screen. Alternatively, you can configure the bottom sheet to adapt so that it displays the content within a different component on wider screens, to match the experience on desktop — for example, a popover, drawer, dropdown, or modal.

Height

The height of a bottom sheet automatically adjusts to the content it contains.

Safe zone

There’s a 64 pixel safe zone at the top of the screen when the bottom sheet is fully expanded. It’s there to reassure users that they are still within the original context, and gives them another way to dismiss.

Accessibility

Screenreader users won’t be able to use the drag down gesture to dismiss the bottom sheet as swipe gestures are already used to operate voice over software. Instead, they can use these alternative ways to dismiss the bottom sheet on each platform.

Android

Android users can dismiss the bottom sheet by using the native navigation to go back.iOSOn iOS, a close button appears when Voice

Over is switched on, allowing screenreader users to dismiss the bottom sheet.

There's also a standard iOS Voice

Over gesture that allows users to dismiss an alert or return to the previous screen. It’s a two-finger scrub, where you move two fingers back and forth three times quickly in a 'Z' shape.

Web

The bottom sheet has an invisible close button on web that screenreader users can tab to.

Content

There’s a lot of flexibility when it comes to writing for bottom sheets as we don’t specify how the content should be displayed. But when designing for mobile experiences, it’s important to be concise.

It’s also good practice to front load the most important information. For example, if you’re using the bottom sheet to display a list of options, make sure the most relevant or important options are at the top.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Button

_Source: https://docs.wise.design/components/button_

ButtonA button lets the user perform an action with a tap or a click.

When to use

Use a button:when the user needs to perform an action, like initiating a new flow or confirming something.

Don't use a button:when you want to link to other pages or external resources (use a link instead)for hierarchical navigation, where the user navigates to a sub-topic and goes deeper into the product (use a navigation option instead)Types

There are two different types of button that, default and negative, these designed to emphasise the nature of the action.

Default

Default is the standard button type that conveys a general action. Use this by default.

Negative

Use negative for confirming destructive actions, like canceling a transfer or closing a balance.

Priorities

Priorities set a visual hierarchy amongst the buttons displayed on the screen to help more important buttons to take precedence over others.

Primary

The most important action to move forward in a flow, acknowledge and dismiss, or finish a task.

Secondary

Use secondary for providing alternatives to the primary action, or when none of your actions are more important than the others.

Secondary neutral

For functional actions, such as copying information like bank details with a button, controls or for navigation.

Tertiary button

Dismissive actions give users a way out of something, letting them cancel, do nothing, dismiss, or skip.

Primary

The most important action to move forward in a flow, acknowledge and dismiss, or finish a task.

You should always have one primary button per page where relevant, this can contextually change if another action needs to be completed before being able to proceed.

Use one primary button per page to indicate the most important action.

Don’t use multiple primary buttons on a page.

Secondary

Use secondary for providing alternatives to the primary action, or when none of your actions are more important than the others.

Use secondary buttons when you need to display multiple key actions at the same level of hierarchy.

Don’t pair a secondary with a negative action, use secondary neutral or tertiary instead.

Pair primary and secondary neutral on neutral surfaces

Don’t use the secondary on a neutral surface.

Secondary neutral

Use secondary neutral for less important convenience actions, such as copying information like bank details with a button, controls or for navigation.

Use secondary neutral buttons for controls and views such as the bank details.

Avoid using secondary neutral buttons for dismissive actions, use tertiary instead.

Use the secondary neutral on neutral surfaces

Don’t use the secondary on a neutral surface.

Sizes

There are three different button sizes, small medium and large, each used for different purposes.

Large

Medium

Small

Large

The large button is used to move users forward in a flow. It’s used at full width on mobile and auto-width, adjusting to the content on desktop depending on use case.

Use large button at the bottom of the page or content to aid the user to the next step.

Don’t use large buttons inside cards or list items.

Medium

The medium button is used for in line content that needs a greater emphasis than small button or that simply needs to be kept in line with other content on the same line — For example in the nav where you have a 40px close or back icon button.

Medium supports icon left and right, and single or double avatars and wraps to the content.

Medium supports icon left and right, and single or double avatars and wraps to the content.

Use in line with other buttons at the same size

Don’t use inside of list items

Small

The small button is used for smaller in line content such as list items.

Small button supports icon left and right and wraps to the content.

Small button supports icon left and right and wraps to the content.

Use in line with other buttons at the same size or where you need more horizontal space.

Don’t use in place of large buttons or at full width

Accessories

Media left

Icon right

Large

Medium

Icon or avatar

Small

Icon only

Icons

Use icon right for actions

Use icon left to support the message

Use icons that best match the written content

Don’t use icons for the sake of it

Don’t change the avatar placement

Use icon right for actions and left to support the message

Don’t place actions on the left, or supporting icons on the right

Avatars

Use avatar on the left

Use avatar to support written content or indicate currency or recipient

Don’t use avatars for the sake of it

Don’t change the avatar placement

Don’t use double diagonal avatar, use horizontal only

Don’t use double diagonal avatars.

Don’t change the avatar placement.

Interaction

Unless the button is disabled, the user can tap or click on it to perform the action assigned to it.

Placement

The button should always be contextual, which is why it should be used in line with the content. This gives a stronger cohesion between the context and the acti

_[content truncated]_

## Card

_Source: https://docs.wise.design/components/card_

Card

Card is a container that groups related content.

Types

There are 2 different types of card — Small and large.

Small card

Designed for more compact component, and has a smaller border radius and padding to match.
It has a min height of 88px and max of 300px.

Large card

Used to highlight and group content that need stronger hierarchy in an experience.
It has a min height of 300px.

When to use

The card component is ideal for highlighting content whilst still keeping structure. It is primarily used for promotions or conveying crucial information. It's also useful for presenting related details about a specific topic. Use multiple cards as part of a heterogeneous collection to display a variety of content types at the same time on the same page. Don’t use cards for listed content or components.

Use multiple cards as part of a heterogeneous collection to display a variety of content types at the same time on the same page.

Don’t use cards for listed content or components.

Small card

Use to display related information on a single subject.

We use small card for our balance cards, alerts and nudges.

Large card

Large cards are best suited for situations where you need to clearly highlight content, like in the case of promotions. We use large card in our promo card component.

Best practices

Utilise cards for presenting both content and actions related to a specific topic. Ensure that cards are designed for effortless scanning of pertinent and actionable details. Arrange elements such as text and images on the cards in a manner that effectively communicates their hierarchy.

Cards can function as entry points into deeper layer of information or navigation.

Don’t use cards on existing standalone components,  e.g. navigation option, or form elements.

Placement

Cards can be showcased collectively in a grid, vertical list, or carousel format.

Can be positioned at the top, middle or bottom of a screen paired with a heading.

Don’t place in a carousel if the cards have different height values.

Can be placed together in a carousel, grid or vertical list.

Don’t place them next to related text or images.

Interaction

The card component has optional states based on if the card is clickable or static. As well as buttons and dismiss icons.

Cards can include action buttons.

Cards can include links as part of supporting text.

Cards have an option to be dismiss.

Large card includes footer accessories that promote  interaction.

Accessibility

The card component scales in height with scaled text.

Long texts or accessibly scaled text can run over 2 lines

Your scaled text should never fall behind your image.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Carousel Cards

_Source: https://docs.wise.design/components/carousel-cards_

Carousel Cards

The carousel cards allow us to display different types of information in a carousel pattern.

When to use

Our carousel cards are used within our carousel pattern to help showcase steps, customer imagery or reviews. We have 5 cards types:Image

Stepper White

Stepper Neutral

Video Testimonial

Text Testimonial
Card types should never be mixed within the same pattern.

Image

Use images when showcasing Wise customers

Stepper White

Use stepper white when guiding users through a step by step process and the carousel pattern has a colour background

Stepper Neutral

Use stepper neutral when guiding users through a step by step process and the carousel pattern has a white background

Video Testimonial

Use the video testimonial card when we have a video from a Wise customer to showcase

Text Testimonial

Use the text testimonial card when we have a quote from a Wise customer, typically from Trustpilot

Accessibility

To ensure maximum accessibility for our users, use plain language in accordance with our tone of voice for an inclusive reading experience. The text should be precise and informative. Ensure that images are accompanied by appropriate alternative text (alt text) for screen readers. An ideal alt text is descriptive and concise to convey the meaning and purpose of the image to users who may not be able to see it.

## Checkbox

_Source: https://docs.wise.design/components/checkbox_

Checkbox

Checkboxes let users select zero, one, or multiple items from a list.

When to use

Use a checkbox:to give users a range of options to choose from in a formto let users confirm if they agree to a policy, service, or set of terms and conditions

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Chip

_Source: https://docs.wise.design/components/chip_

Chip

Chips allow users to filter content or make a choice from a set of options within a compact area.

Types of chip

You can use chips in 2 different ways — as choice chips, or as filter chips. Choice chips let users choose one chip from a set, whereas filter chips let users add multiple filters.

Choice chips

Choice chips let users choose a single chip from a set.

Interaction

Best practice for choice chips is to have one chip pre-selected by default, like radio buttons. This should be the most desired or most frequently selected chip.

Then, if the user wants to make a different selection, they can tap or click on one of the unselected chips. Selecting a new chip will unselect the original one, so there is never more than one chip selected at once.

Filter chips

Filter chips let users add filters to content by selecting one or more chips from a set.

Interaction

Filter chips are unselected by default. The user can then tap or click on each chip to select as many as they like. Tapping or clicking the clear button will unselect the chip.

When selecting a filter chip, it’s also possible to trigger additional input information in a dropdown or bottom sheet. The item selected would form a new chip at the start of the list, while the original chip that triggered the dropdown or bottom sheet would remain in place.

Placement

Whether you're using filter chips or choice chips, the chips should be placed in a horizontally scrollable row on the screen. They can be shown underneath a search field, and are normally positioned towards the top of the screen or above the content that they filter.

Best practice

Always use chips in a set — they should never stand alone.

Try to optimise the list, by putting the most frequently selected chip at the start.

Don't let the list of chips get too long.

Accessibility

Chips should stay in the same position when selected, as the movement of reordering the list based on selection would add too much cognitive load for users.

With filter chips, if a new chip is added from a bottom sheet or dropdown, it should appear at the front of the list. But the rest of the order should stay the same.

Content

Text

Chip text should:be extremely short (just one word where possible)describe a single element — (usually a noun)work as part of a coherent set (chips are always displayed alongside other chips)be in sentence casehave no full stop

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Circular Button

_Source: https://docs.wise.design/components/circular-button_

Circular buttonA circular button lets the user perform an action with a tap or a click.

When to use

Use a circular button:when the user can perform multiple equally important actions related to an entity that's on screen

Don't use a circular button:just so you can display an icon with a button (use a regular button instead)Types

Types are designed to emphasise the nature of the action.

Default

Default is the standard button type that conveys a general action. Use this by default.

Negative

Use negative for confirming destructive actions, like canceling a transfer or closing a balance.

Priority

Priorities set a visual hierarchy amongst the buttons displayed on the screen to help more important buttons to take precedence over others.

Circular buttons support 2 different priorities that can be combined with 2 different types. Primary

Use primary for displaying the most important action of the screen, such as confirming something or submitting a form. You may have multiple primary actions depending on your use case.

Secondary

Use secondary for providing alternatives to the primary action, or when none of your actions are more important than the others.

Best practice

Don't have just one circular button on its own.

Pair circular button with other circular buttons.

Don’t use circular button on it’s own, unless it’s an edge case where other icons would usually be displayed.

Interaction

Unless the button is disabled, the user can tap or click on it to perform the action assigned to it.

Accessibility

Both the icon and font size can change based on the user’s accessibility preferences. When you put circular buttons in a horizontal layout, make sure to flip them to a vertical layout when a huge font size is preferred by the user, so the content still fits on the screen.

When using a screen reader, the text of the button will be read out loud and the icon will be ignored. Make the title contextual, so people completely relying on the screen reader will also understand what the action is related to.

Content

Button

Button copy should:start with a verb, like ‘Pay’ or ‘Send’be just a few words (ideally 1 or 2)describe the action (if someone only reads the button, they should know what will happen next) connect to the content around it — for example, it might use the same words as the titleavoid using first person pronouns like ‘me’, ‘my’ and ‘I’be in sentence case (only capitalise the first letter of the first word)have no full stop

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Compact Date Input

_Source: https://docs.wise.design/components/compact-date-input_

Compact date inputA compact date input lets people enter a short date within a form.

When to use

Use a compact date input:when asking users for a date they already know, or can easily find (like their expiration date)Don't use a compact date input:when asking for a full date with day, month and year (use the date input instead)when asking users for multiple dates, such as a range, or a start and finish date (use date lookup instead)Best practice

Include an information message if you have evidence that users need more context.

Content

Label

Label copy should:be no more than 3 wordsbe a noun that describes the information the user needs to enter (and not a verb)Description (optional)Description copy should:be a single sentencegive some extra context to help the user enter the right information

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Copy Block

_Source: https://docs.wise.design/components/copy-block_

Copy Block

The copy block is used to explain our features, benefits or service offering to our users.

When to use

Our copy blocks are used with the vast majority of our marketing patterns within the system. They are there to allow us to explain our services, benefits and features to our users, usually paired with a button. The block comes in multiple sizes and with a centred or left aligned layout.

Do not extend the maximum width of the copy block. Do not justify or right align the text within the block.

Left aligned

Centrally aligned

Do not extend the maximum width of the copy block.

Do not justify or right align the text within the block.

## Critical Banner

_Source: https://docs.wise.design/components/critical-banner_

Critical bannerA critical banner tells the user that they need to either unblock their account, or stop it from being blocked or closed.

When to use Only use a critical banner:if the user's account is blocked or closing (or at risk of either)if the user has a short time frame in which to actif a user's account could be blocked, remain blocked, or closed permanently if they fail to act

Don't use a critical banner:just because the situation is negative (try an alert instead)if the situation relates to just one activity, like a failed transferif the situation isn’t time sensitive

Best practice

Only use one critical banner at a time, and only ever for a single message.

Don’t rely on a critical banner — if the situation is urgent, think how else to contact the user.

Only include a description when really necessary, like to give a time frame.

PlacementA critical banner should sit across the top of each screen, and be shown on all root screens within the logged in experience (but don’t show it on screens that open on top of other screens).

Interaction

In most cases, the button should take the user to a screen where they can fix the issue.

In situations where there are multiple things the user might need to do (for example, if their account is closing) consider having the button open a modal, so that you can provide the user with more information.A critical banner is not dismissible — it should remain until the user has addressed the issue.

Accessibility

When using the critical banner on mobile, keep in mind that its height might change based on the preferred font size that the user has set system-wide for accessibility purposes.

Content

Title

Title copy should:explain the situation and what the user needs to dobe short and clear be 1 or 2 full sentences use plain languagebe in the active voicebe in sentence casehave a full stop

Description (optional)Description copy should:give the user a time frame in which to actbe short and clear be 1 sentence use plain languagebe in sentence casehave a full stop

Button

Button copy should:start with a verb, like ‘Pay’ or ‘Send’be just a few words (ideally 1 or 2)describe the action (if someone only reads the button, they should know what will happen next) connect to the content around it — for example, it might use the same words as the titleavoid using first person pronouns like ‘me’, ‘my’ and ‘I’be in sentence case (only capitalise the first letter of the first word)have no full stop

Content patterns

Suggested copy for common scenarios where a critical banner might be used.

Account blockedA user won’t be able to use their account when it’s blocked, and any existing activities — like transfers or direct debits — will also fail. So as well as the critical banner, you should consider using contextual alerts or emails to tell the user about specific activities that need their attention.

Title

Description

Button

We’ve temporarily blocked your account because [reason].N/AUnblock account

Your account is at risk of being blocked.

You need to [action] by [date] to keep your money moving.[Action]Availability

Platform

Available

AndroidiOSWeb

## Date Input

_Source: https://docs.wise.design/components/date-input_

Date inputA date input lets people enter a date within a form.

When to use

Use a date input:when asking users for a date they already know, or can easily find, like their date of birth

Don't use a date input:when you need just the month and the year (use the compact date input instead)when asking users for multiple dates, such as a range, or a start and finish date (use date lookup instead)Best practice

Change the order of the sub-fields to reflect your users' location (for example, some put the day first, some the month).

Include a description if you have evidence that users need more context.

Content

Label

Label copy should:be no more than 3 wordsbe a noun that describes the information the user needs to enter (and not a verb)Description (optional)Description copy should:be a single sentencegive some extra context to help the user enter the right information

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Date Picker

_Source: https://docs.wise.design/components/date-picker_

Date picker

Use date picker to let users pick a date from a calendar.

When to use

Use a date picker:when the user needs to decide a date — like the best date for an appointment when the date options are relatively close to the present day

Don't use a date picker:when the user needs to select a set date that they know, like their birthday — use date input instead

Best practice

Date picker should open the native picker, like the native calendar.

Availability Platform

Available

Developer documentation

AndroidiOSWeb

## Divider

_Source: https://docs.wise.design/components/divider_

Divider

Dividers are used to create stronger hierarchy between contents, sub-section, and sections.

Types

Section

Section dividers are used to separate completely unrelated sections of content. Use section spacing before and after.

Use at full width of container

Use full width of screen

Don’t include margin/padding

Sub-section

Sub-section dividers are used to separate related pieces of content that require additional hierarchy. Use section spacing before and after

Include padding to match content

Don’t use with section headers that include dividers

Use to separate grouped information

Don’t use with section headers that have built in dividers

Content

Content dividers are used to break down a specific piece of content or information. They help to visually separate distinct parts, highlight key figures, or introduce summaries within a single content block.

Use component spacing before and after.

Don’t use to separate unrelated contents.

Don’t use to separate different content blocks —use section or sub-section dividers instead.

Use to break down a specific piece of content or information

Don’t use to separate different content blocks — use section or group dividers instead.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Dropdown

_Source: https://docs.wise.design/components/dropdown_

DropdownA dropdown (sometimes called a select) lets users choose a single item from a dropdown list.

When to use

Use a dropdown:when you have a list of 7 items or more that the user needs to pick from

Don't use a dropdown:if the user needs to compare the options side-by-side to make a decision

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Icon Button

_Source: https://docs.wise.design/components/icon-button_

Icon Button

An icon button lets the user perform an action with a tap or a click.

Sizes

Supported sizes are 16, 24, 32, 40, 48, 56,  and 72.

Priorities

Priorities set a visual hierarchy amongst the buttons displayed on the screen to help more important buttons to take precedence over others.

Icon buttons support 3 different priorities that can be combined with 3 different types. Primary

Secondary

Tertiary

Minimal

Primary

Use primary for the most important action to move forward in a flow, acknowledge and dismiss, or finish a task.

Secondary

Use secondary for providing alternatives to the primary action, or when none of your actions are more important than the others.

Tertiary

Used for controls and views, such as back button or a currency selection.

Minimal

Used for dismissive actions like dismiss, or skip. As well as supplementary controls like copying or viewing tooltips.

Types

Types are designed to emphasise the nature of the action.

Default

Default is the standard button type that conveys a general action.

Negative

Use negative for destructive actions, like canceling a transfer, closing a balance or removing an uploaded item.

Best practices

Icon buttons work best if they are recognisable without accompanying copy.

Use icons that are most obvious for the proposed action.

Don’t use icon buttons for a specific action that isn’t obvious with the icon alone.

Icon usage

Different icons are used across different use cases. Here are some of our most common use cases

Send

Add

Convert

Receive or request

Move

Upload

Back

Next

Close

Schedule

Tooltip

Copy

Delete

Switch

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web Documentation

## Image Ratios

_Source: https://docs.wise.design/components/image-ratios_

Image Ratios

We use a range of different image ratios across the editorial patterns.

Image scale

We use a set of image ratios throughout the editorial patterns to ensure that our product and lifestyle photography is correctly displayed.16:93:44:31:1Accessibility

To ensure maximum accessibility for our users, use plain language in accordance with our tone of voice for an inclusive reading experience. The text should be precise and informative. Ensure that images are accompanied by appropriate alternative text (alt text) for screen readers. An ideal alt text is descriptive and concise to convey the meaning and purpose of the image to users who may not be able to see it.

## Info Prompt

_Source: https://docs.wise.design/components/info-prompt_

Info prompt

An info prompt is a message that appears in a specific part of the screen. It relates directly to a section or multiple components.
They help the user stay informed, fix something, or get more out of what they’re doing.

When to use

Use an info prompt if your message is about one specific part of a screen or the user's current activity. Use them to give more context, confirm success, explain a problem, or highlight a benefit related to what the user is doing.

Don't use info prompts for messages about just one component. Use inline prompts for single components instead.

Use an info prompt to give more context about a section on a screen or update the user on what they’re doing.

Types & Usage

There are 5 types of info prompts — error, warning, neutral, success and proposition. Each has a different use case and rules around their implementation. Error

Use an error to let users know when something has gone wrong and needs their attention. Use an error to explain why the user can't progress with their action.

Don't use an error to warn about potential issues — use a warning instead.

Warning

Use a warning when you need to alert users to potential issues that could impact their experience. 
These messages are preventative — they help customers take action to avoid negative outcomes. Use a warning when you need to alert users to potential issues that could impact their experience.

Don’t use a warning when something has already gone wrong and needs the user’s attention — use an error instead.

Neutral

Use a neutral prompt when you want to guide the user or give additional context. These messages are informative rather than corrective.

Use a neutral prompt to explain what’s happening.

Don't use a neutral prompt when the purpose is to help the user avoid a negative outcome — use a warning instead.

Success

Use a success prompt to communicate that an action or process was completed successfully. These provide positive reinforcement and closure for the user, especially when there's no dedicated success screen. This prompt's main job is to confirm success, but it can also guide the user to the next logical step — especially if that helps them benefit from what they just did.

This tells the user what they’ve done and what they can do next.

Don't use success for upselling or promoting a feature — use a proposition instead.

Proposition

Use an info proposition to encourage users to learn more about a feature that might benefit them. Unlike action prompts which drop users straight into a flow to start a task, info propositions lead to an educational page where they can read the details first.

Only surface a proposition if it’s relevant to what the user is doing. If we show too many, or they feel off-topic, we risk undermining trust and the experience feeling like spam.

Use propositions where they’re relevant — like a travel-related promo in Travel Hub.

Don’t use a proposition in a form or flow that has no connection to what the user is doing.

Placement

Info prompts relate to what the user is doing in the moment, so place them next to the section where they’re the most relevant. Interaction

Users can dismiss specific info prompts and interact with those that include a link.

Dismissibility

Users can only dismiss an info prompt if it’s a success, neutral or proposition. Errors and warnings provide more urgent information — removing them could lead to a negative outcome for the user. Links

Only add links if users need extra information to finish their task. Most info prompts should provide enough context so users can stay focused on what they’re doing.

If the prompt includes an action link, it makes the whole component tappable on Android and iOS, as well as mobile web touchscreen devices. On web, the link is also clickable and underlined, so it works for click-based interactions too — like using a mouse or keyboard.

Avoid using more than one link within the Info prompt.

Include links that are relevant to the message and offer a way for users to get more information.

Don't use links to repeat what’s obvious. In this example, a way to change the currency is on the same screen.

Writing an info prompt

All info prompts should:Be clear — explain what’s happened and what to do.

Be concise — try and use no more than 1-2 short sentences.

Include key details — if relevant, specify dates, amounts, or names to make the message actionable.

Use full sentences — write in complete sentences with full stops.
Headings

These prompts can include headings when they help users scan and understand content faster. Keep them short and clear so they support rather than compete with your main message.

Tone

Vary your tone depending on the type of message you’re giving. Sometimes you might be communicating good news, and sometimes it might be a warning, or bad news. Depending on the scenario, you'll need to use a suitable tone of voice.

Error

With any error message, clarity is key. Something has gone wro

_[content truncated]_

## Inline Prompt

_Source: https://docs.wise.design/components/inline-prompt_

Inline Prompt

Inline prompts appear alongside a specific component on the screen. They help the user stay informed, fix something, or get more out of what they’re doing.

When to use

Use an inline prompt:if you have a message that relates to a single component.

Don't use an inline prompt:if the message relates to multiple components — use an info prompt.

Use an inline prompt in relation to a single component e.g password input.

Types & Usage

There are 5 different types of inline prompts — error, warning, neutral, success and proposition. Each has a different use case and rules around their implementation. Error

Use an error to let users know when something has gone wrong and needs their attention. This explains what went wrong and what the user should do next.

Don’t use an error to communicate something that could affect a user’s future experience – use a warning.

Warning

Use a warning when you need to alert users to potential issues that could impact their experience. 
These messages are preventative — they help users take action to avoid negative outcomes. This helps prevent a bad experience by explaining invoices without key information could lead to delays.

Don’t use a warning when something has already gone wrong — use an error.

Neutral

Use a neutral prompt when you need to guide the user or give additional context.

Neutral prompts can transition to a success or error message when used in a form.A neutral prompt can change into an error message if someone types something wrong in a form.

Success

Use a success prompt to communicate that an action or process was completed successfully. These provide positive reinforcement and closure for the user.

You can use a status icon alongside the message — just make sure to use one relevant to the message.

Use an icon that feels connected to your message.

Don’t use arbitrary or unrelated icons.

This should be a proposition because the message encourages the user to take a future action, rather than confirming a completed one.

Proposition

Use a proposition to encourage the user to take an action that might benefit them. These should only appear in list items. The feature or benefit should be clearly related to the action in the list.

Only include a proposition if it’s relevant to what the user is already doing. If we show too many of these prompts, or they feel off-topic, we risk undermining trust and the experience feeling like spam.

Only use a proposition on list items.

Don’t use a proposition on form inputs.

Use icons that relate to the message.

Don’t use arbitrary or unrelated icons.

Propositions should be clearly linked to the option in the list item.

Don’t take the user to anywhere other than the list item’s destination.

Placement

Inline prompts should appear next to the component they relate to. This helps users connect the message to a specific action.

Muted

For components that are disabled, the inline prompt will be muted, and displayed with a backslash circle icon where the prompt icon was previously.

Muted inline prompt with link

Muted inline prompt without link

Interaction

Links

Avoid adding a link to an inline prompt. These messages should help users complete their current task, not take them to another screen unless absolutely necessary.

Inline propositions should never include a link. This is because they’re designed to supplement an action in a list item with an offer or benefit. Real-time checks

Inline prompts are also used when forms need to check something in the background, like verifying an account number is real. We’ll show a loading message and icon while waiting for the check to finish.

Only use background checks for things that need to be verified with external systems, like bank account numbers or IBANs.

Use a neutral prompt to tell users upfront when we’ll check something.

Don't use these types of checks for every field.

Use asynchronous validation only for inputs that require backend checks, such as routing number.

Only use these for things that need to be verified with external systems, like bank account numbers or IBANs.

Writing an inline prompt

All inline prompts should:
Be specific – clearly starting what the customer needs to know or do.

Be concise – no more than 2 short sentences so users can quickly understand the message.

Include key details – use dates, names, or amounts when they add clarity.

Avoid headings or paragraph breaks – these messages should feel part of the experience, not separate from it.

Use full sentences with full stops – this helps keep the message clear and professional.
Tone

Your tone should vary depending on the type of message you’re giving. Sometimes you might be telling the user good news, and sometimes it might be a warning, or bad news. Use a tone of voice that matches the scenario. Error

With any error message, be clear. Something has gone wrong and so the job of the prompt is to communicate what’s happened and how it can be resolved.

Clearly state t

_[content truncated]_

## Instruction

_Source: https://docs.wise.design/components/instruction_

Instruction

Instructions are a list of bullet points marked as positive and negative.

When to use

Use instructions:to give users positive and negative instructions — things like do's and don'ts, correct and incorrect requirements, and complete and incomplete tasksto explain what a feature does and doesn't do

Best practice

Don't have too many points in one instruction list.

Content

Keep each point to a single line.

Use as few words as possible.

Points should be statements, not questions.

All points in a list should relate to one another, and follow the same format.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## List Item

_Source: https://docs.wise.design/components/list-item_

List Item

List items let users review or select options from a dynamic list, adaptable to different use cases.

When to use

Use a list item when you want to display different options grouped as a list.

Types

There's six ways to use a list item — navigation, radio, checkbox, switch, icon button and button. 
When a list item is non-interactive with no accessory, it should only display information.

Use section headers to separate lists with different accessory types on the same page.

Don’t mix different accessory types in the same list

Navigation

Used for navigation to other parts of the product

Checkbox

Used for selecting multiple options

Radio

Used for selecting a single option

Icon button

Used for supporting actions related to the item itself, such as tooltips, copying information or editing

Switch

Used for toggling a feature on or off

Button

Used to trigger an action

Non-interactive

For showing purely informational content without any interaction.

Use clear dividers like section headers to group lists with different accessory types on the same page.

Don’t mix different accessory types in the same list

Avatar

Avatars are optional and are used as a visual aid to the list item. Refer to the Avatar usage guidance.

Do:Use relevant media to support content

Don't:Use an illustration in place of the avatar

Do use avatar with icons to support content.

Don’t use an illustration in place of the avatar.

Avatar sizes

List item supports five different avatar sizes with 48px as the default, other avatars supported include 32px, 40px, 56px and 72px.32px

Used on a case by case basis where a smaller list item is required.40px

Used for summaries and where you need additional space.48px - Default

Default size for list items used across the app.56px

Used where a larger size is needed when choosing between options.72px

Used for promotional purposes.

Double avatar

Do:Use double horizontal avatars where more prominence is required, outside of a list

Use double diagonal avatars in lists with single avatars

Don't:Don’t mix double horizontal with double diagonal or single avatars

Diagonal

Used within a list that contains both single and double avatars to keep content aligned.

Horizontal

Used where more prominence is required.

Use double diagonal avatars in lists with single avatars.

Don’t mix double horizontal with double diagonal or single avatars on the same list.

Prompt

There are 4 different sentiment types for the inline prompt — neutral, positive, warning and negative. Neutral

Use a neutral alert to give users contextual hints or general information.

Positive

Use a positive alert to tell a user about something that’s resolved, or now available due to their action.

Warning

Use a warning alert to warn a user about something that could negatively impact their experience.

Negative

Use a negative alert to tell a user about something that has negatively affected their experience.

Single line

When the content is short and succinct, the container adjusts to match the width of the content.

Multi-line

When the content has multiple lines the validation will stretch to the full width (minus the Avatar).

Links

Prompts only ever support a single link. On mobile the full prompt is clickable, whereas on desktop only the link is.

Prompt Link content should be intimately connected to the action of the parent List Item. It should take the user to a nearby and quick loading page, not to a totally different part of the website.

Spotlight

Interactive list items can alternatively be displayed with a spotlight.

Inactive

Use to suggest an action the user hasn't done

Active

Use to show an option the user has activated

Use spotlighted list items in scenarios where you need to convey the notion of an empty state to the user.

Don’t use spotlighted list items to draw attention to a specific list item, and don't mix spotlighted and non-spotlighted items within the same list.

Interaction

The list item can be either fully or partially interactive based on the accessory used and the use case. Don't:Combine fully interactive and partially interactive list items in the same list

Fully interactive

All accessories will make the list item fully interactive by default. Interacting anywhere on the list item will trigger both the full components associated state as well as the state of the associated accessory.

Fully interactive list items are supported by hover, active, disabled and focus states.

Hover

Active

Disabled

Focus

Partially interactive

Icon button and button accessories can also be partially interactive, where the touch area area is targeted on the accessory.

The interaction states of these areas depend on the style of the component or text link. Here's how it works:Non-interactive list items without any accessory can include inline links.

Icon button and button can optionally target specific touch areas.

If a button or icon button list item includes both inline links and acce

_[content truncated]_

## List Item — Button

_Source: https://docs.wise.design/components/list-item---button_

Button Item

Button item is used when an action is triggered by the list item.

Usage

List items with buttons can be fully or partially interactive. Buttons should be used to trigger n action — for example ‘change/add’ being the action on a payment method list item.

The secondary priority is the default for list item but can be changed to tertiary or primary depending on your use case. Refer to button guidance.

Use:to trigger an actionfor supporting actions that unblock the user

Don't use:to navigate the user to the next step in a flow the user is already in, use a navigation accessory instead.

Use list item with button to trigger an action

Don’t use to navigate the user to the next step in a flow the user is already in, use a navigation accessory instead.

Availability

Platform

Availability

Figma

AndroidiOSWeb

## List Item — Checkbox

_Source: https://docs.wise.design/components/list-item---checkbox_

Checkbox Item

Checkbox item allows users to select multiple items from a mutually exclusive list of options.

Usage

Use:within a select inputwhen a user needs to choose within a list of more than 6 options

Don't use:in a checkbox group, use checkbox group insteaddirectly in a form - unless used as a full screen overlay in modal or bottom sheetas a standalone or in place of a switch

Use as list items within a select input or full page list of options — for instance selecting multiple currencies.

Don’t use within a checkbox group or directly on a form. Use checkbox group instead.

Availability

Platform

Availability

Figma

AndroidiOSWeb

## List Item — Icon Button

_Source: https://docs.wise.design/components/list-item---icon-button_

Icon button item

Icon button item is used to emphasise the action or as a secondary isolated action on the item.

Usage

If the action is separate from the main list item, the button can be partially interactive. For example when it's being used:to copy or edit informationto link to more detailed additional informationas a visual aid for a supporting action to the information presented.

Use:when the user needs to copy information or find out more info on the list itemwhen more prominence is needed on the list items action

Don't use:when the icon itself isn’t explicit on what the associated action iswhen more context is needed to highlight the associated action, use a button instead

List item with tooltip

Used to include additional information via a tooltip.

List item with edit

Allows users to edit details, like an address.

List item with add

Lets users add something new, such as a recipient.

Use icons that are self evident and related to the associated action

Avoid using abstract icons that don’t explicitly indicate what the associated action is

Availability

Platform

Availability

Figma

AndroidiOSWeb

## List Item — Navigation

_Source: https://docs.wise.design/components/list-item---navigation_

Navigation Item

Navigation item gives users a rich way to choose between options and navigate to another screen or step in a flow.

Usage

Use:if you want to give the user a rich way to make a choice and navigate to another screen or step in a flow.if making a choice is the primary action on the screenif there are multiple options that the user can choose fromif some extra context — such as an icon, image or description — would help the user understand where they'll navigate to if they select that option.

Don' usetto ask the user to choose options within a form — use radio or checkbox insteadwhen there is just one primary option, and perhaps an alternative secondary option — use a button insteadto display temporary information such as contextual upsells — use a nudge insteadwhen the user needs to complete all the options on a screen, rather than choose one

Use navigation if there are multiple options that the user can choose from

Don’t use navigation to ask the user to choose from options within a form — use radio or checkbox with a continue button instead

Don’t use navigation to ask the user to choose from options within a form — use radio or checkbox with a continue button instead

Don’t use to display temporary information such as contextual upsells — use a nudge instead

Availability

Platform

Availability

Figma

AndroidiOSWeb

## List Item — No Action

_Source: https://docs.wise.design/components/list-item---no-action_

No Action ItemA list item with no action is for information items with no action.

Usage

When no accessory is used, the full list item is not interactive and should not provide an action. In-line links can be used within non interactive list items and should be targeted actions with the click/tap area specific to the link itself and not the list item as a whole. See the interaction section below for more info.

Use inline links where you need targeted interaction.

Don’t make a no action list item fully interactive.

Availability

Platform

Availability

Figma

AndroidiOSWeb

## List Item — Radio

_Source: https://docs.wise.design/components/list-item---radio_

Radio Item

Radio item allows users to select a single item from a mutually exclusive list of options.

Usage

Use:to select a single option within a list of optionswithin a select inputwhen a user needs to choose within a list of more than 6 options

Don't use:in a radio groupdirectly in a form - unless used as a full screen overlay in modal or bottom sheet. Use radio group instead.as a standalone or in place of a switch

Use to select a single option within a list of options — for instance within a select input on a form.

Don’t use within a radio group or directly on a form. Use radio group instead.

Availability

Platform

Availability

Figma

AndroidiOSWeb

## List Item — Switch

_Source: https://docs.wise.design/components/list-item---switch_

Switch Item

Switch item allows user to instantly toggle a feature on or off. For example when giving access to receiving notifications.

Usage

Use:for binary on/off decisionsfor immediate action options, whereby no additional action is required

Don't use:in place of a standalone checkboxin place of a radio

Switch should be used to toggle a binary option on/off with immediate action.

Don’t use in place of a standalone checkbox — switches should be feature based only, and shouldn’t be used in forms.

Availability

Platform

Availability

Figma

AndroidiOSWeb

## Media Button

_Source: https://docs.wise.design/components/media-button_

Media Button

Our media button lets the user pause and stop moving content for more control and enhanced accessibility

When to use

The media button allows users to pause and stop any content that starts moving automatically and moves for more than 5 seconds.

Media with light background

Media with dark background

Placement

The button should be positioned at the bottom right corner of the media.

## Modal

_Source: https://docs.wise.design/components/modal_

ModalA modal is an overlay that interrupts the user’s task to show an important message, disabling the rest of the screen.

When to use

Use a modal:when the user needs to continue a secondary part of a flow or task, where it’s important for the them not to lose contextif you need to show important content that the user needs to interact with before they can continue

Don't use a modal:for actions or tasks that need to be perfomed quickly (as they risrupt the main journey and disable the rest of the screen until the user acts)if you can display the content in a less intrusive way within a screen as part of the main flow (a bottom sheet could be a good alternative for short amounts of content on mobile)for flows that require multiple pages of forms or information

Best practice

Make the relationship between the modal and the previous screen clear.

Keep the content of the modal succinct — you have limited space overall, and the information in a modal should be aiming to achieve a goal.

Don't display a modal on top of another modal (either add the extra information to the existing modal content, or direct users to a new screen).

PlacementA modal is a type of overlay that appears on top of the main content on the screen. It’s centred on the screen and sits above a dimmer. The dimmer is used to focus the user's attention on the modal content, so that the user needs to interact with it before they can progress.

Width and height

Modals have a fixed width of 540px on desktop. The height of a modal automatically adjusts to its contents, until it reaches a maximum height of 800px.

Safe zone

There’s a 80 pixel safe zone at the top and bottom of the screen if the modal occupies a big space. This is to reassure users that they are still within the original context, and gives them another way to dismiss.

Interaction

The height of the modal automatically adjusts to the content inside it. But if the content is longer than the maximum height that the modal can expand to, it will overflow and become scrollable.

Accessibility

Users can dismiss the modal modal in 3 different ways:using the close buttonclicking on the dimmed backgroundusing the escape key

Despite this, never remove the close button on the top. Users will need to find a clear and visible way to dismiss the modal, and get back to their original context.

Avoid using modals too much. They block the screen, have limited space, and demand more attention and focus from the user.

Content

You can use modals for many different purposes, so the content within them may vary. But there are some general guidelines you should follow.

Title

Title copy should:be just a few wordsput the most important words firstsummarise or introduce the content it relates to (imagine the user only reads the title)be a statement rather than a question (unless the content is asking the user something)be in sentence case (only capitalise the first letter of the first word)have no full stop

If the modal is asking the user to confirm an action, then the title may make more sense as a question.
But the same rule applies to questions — be concise and front-load the most important words.

Main content

Warnings

With modals that are warning the user — where the action is destructive or irreversible — include vital information in the title and action, and not just in the main content. This is because users might skip the main content and only read the title and the action.

Actions

If you're using a button for the modal action, the button copy should:summarise the purpose of the modal — if the user skips the title and the main content, the button should be enough for them to understand what they are about to dodescribe the action in as few words as possible — ideally one or twostart with a strong, imperative verb, like 'Pay', 'Send' or 'Log in'connect to the rest of the copy in the modal — for example, with a primary button it can be good to use the same verb that's in the titleavoid using first person pronouns like 'me', 'my' and 'I'be in sentence case — only capitalise the first letter of the first wordhave no full stop

If you have two buttons on a modal, be careful that the copy doesn't confuse the user. It should be competely clear what each button does. A user shouldn't have to second guess what the result of their actions will be.

An example would be if the modal is asking the user to confirm a cancellation.

Here, the primary button uses the same language as the title, and makes it clear what will happen if the user selects that button. And the secondary button (which closes the modal) uses different language to the title and the main action.

Here, the secondary button (which closes the modal) uses the same language as the title and main action of the modal. This is confusing, as it's not clear whether the secondary button confirms the action and cancels the Direct Debit, or cancels the action and closes the modal.

Availability

Platform

Available

Developer documentatio

_[content truncated]_

## Money Input

_Source: https://docs.wise.design/components/money-input_

Money input

Money input lets users enter an amount in a currency of their choice or validate a prefilled currency.

When to use

Use a money input:to allow users to insert a monetary value and currencywhen users need to send or convert an amount

Don't use a money input:if users only need to enter a non monetary value (try a text input instead)if users only need to select currencies (use a dropdown instead)Best practice

Use a read-only money input when users need to send or convert but cannot select a currency.

Keep the label concise and related to the action.

Disable the currency selector when people have to send or convert from a balance.

Enable the currency selector when users are transferring money.

Provide an icon to perform additional actions and to display non critical information.

Placement

Use the money input contextually within flows where the user is sending or converting money.

On web, currency selector options are displayed in a panel. On mobile web they are displayed in a bottom sheet.

On mobile, currency selector options are displayed inside a full page surface.

Interaction

The interactive parts of the money input are the text input, icon and the currency selector.

Selecting the text input allows the user to type a value.

Clicking or tapping the currency selector trigger shows the user a list of selectable currency options or actions.

Clicking or tapping on the icon performs additional actions and displays extra non critical information.

Content

The content around the money input should make it clear to users as to what information they need to enter.

For currencies, write [Currency code] + [Currency name]. For example, ARS Argentine Peso. Or AUD Australian dollar.

Don't use currency symbols, because some symbols (like $) could mean multiple different currencies.

Currency names

For currency names:capitalise the country name, but not the currency keep it singular, and don't add an 's'remember to include special characters

Option group

Make sure you use relevant option group section titles for popular categories.

Input label

Label copy should be accurate and make it clear what will happen.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Expressive Money Input

_Source: https://docs.wise.design/components/expressive-money-input_

Expressive Money Input

Expressive money input is a currency input used exclusively for money movement flows.
This is a contributed component.

When to use

Use within money movement flows such as send, receive, convert and add. Use expressive money input:for money movement transactions

Don't use expressive money input:in forms, use a money input instead

Use in money movement flows, e.g. top up

Don’t use in forms, use a money input instead

How to use

Balance details

Use balance details on the source target currency in the empty state of the component to indicate availability. Balance details

Prompts

Use an error prompt to let the user know why they can’t perform an action.

Error

Interaction

Input

Selecting the input will scale the size of the value, typing beyond the length available will scale the size down to fit.

For source and target inputs, the target should update based on the source where relevant.

The input value colour changes between the empty and filled states.

Expressive money input in action

## Navigation Option

_Source: https://docs.wise.design/components/navigation-option_

Navigation optionA navigation option gave users a rich way to choose between options and navigate to another screen or step in a flow. Navigation options are presented in a list or as tiles (tiles are web only).
It has been deprecated. Please use list item.

When to use

Use a navigation option:if there are multiple options that the user can choose fromif making a choice is the primary action on the screenif you want to give the user a rich way to make a choice and navigate to another screen or step in a flowif Some extra context — such as an icon, image or description — would help the user understand where they'll navigate to if they select that option

Don't use a navigation option:when there's no action attached to the content (use a summary intead)to display temporary information such as contextual upsells (use a nudge instead)to ask the user to choose options within a form (use radio or checkbox instead)when there is just one primary option, and perhaps an alternative secondary option (use a button instead)when the user needs to complete all the options on a screen, rather than choose one

Best practice

Always use navigation options in a set.

Don't mix and match images and avatars, and don't include a description for some navigation options in a set, and not for others.

Presentation

Navigation options are presented in a list or as tiles.

List

List presentation shows the navigation options stacked vertically on top of one another. This is well suited to small screen widths, or if you have more than 4 options.

Tiles (web only)Tile presentation shows the navigation options arranged horizontally on the screen. This is well suited to large screens, where you have 4 options or less.

Because the tiles will not wrap on to new lines, they will be forced to display as a list at small screen widths.

With tiles, you can use different media for a single navigation option — one to be displayed when the option is presented as a tile, and one when it's presented in a list.

Tiles can also be rendered at 2 sizes: medium and small.

Interaction

When a user selects a navigation option, it should navigate them straight to a new screen or step in a flow.

The whole component should be tappable on mobile, and clickable on web.

Navigation options can be disabled, in which case the user will not be able to select them.

Accessibility

On web, the available area for displaying the media changes between the list and tile views. Make sure the media works at both the small and medium sizes, or provide one for each.

Content

Title

Title copy should:be just a few wordsput the most important words firstsummarise or introduce the content it relates to (imagine the user only reads the title)be a statement rather than a question (unless the content is asking the user something)be in sentence case (only capitalise the first letter of the first word)have no full stop

Description (optional)Include a description if you have evidence that users need a little more context in order to understand where the navigation option with navigate them. If you include a description for one option in a set, then include it for all of them.

Description copy should:be short — aim for a maximum of 2 sentences and remember that content might expand when translated and look different in a list vs tilesbe plain text — that means no bold text, links, or other fancy formattinguse sentence case — only capitalise the first letter of the first wordinclude a full stop

Availability

Platform

Available

Developer documentation

Web

Web documentation

## Nudge

_Source: https://docs.wise.design/components/nudge_

NudgeA nudge directs users to take an action on something that might be relevant at the time they see it.

When to use

Use a nudge:to suggest a new feature or action that a user might not be aware ofif there's an optional feature or action that's relevant to what the user is currently doing

Don't use a nudge:if the information is critical, or requires time sensitive actionif the feature is something that everyone needsif there's no action for the user to take

Variants

There are 7 different variants of nudge, each with a different illustration.

Globe

Use the globe if you're referring to moving money around the world.

Padlock

Use the padlock if you're referring to account security.

Wallet

Use the wallet if you're referring to spending.

Cog

Use the cog if you're referring to settings, or account setup.

Envelope

Use the envelope when referring to the invite scheme.

Personal account card

Use the personal account card when referring to the personal account.

Business account card

Use the business account card when referring to the business account.

Placement

Place a nudge at the top of the screen or section it applies to, or below a section header.

Never have more than one nudge on the same screen.

Interaction

Nudges direct users to another view to complete an action.

Tapping anywhere on the nudge triggers the action — except for the area around the close button, which dismisses it.

Content

Nudges are for suggesting new features or actions, not for communicating negative or critical information. So while nudge copy should be short and sweet, it's ok to add some energy and colour. Try to have maximum impact, with the minimum amount of words. See our tone of voice.

Title

Title copy should:start with a verbdescribe the action the user might like to takeinclude a clear benefit for the user — like making something quicker, safer, or cheaper for thembe short (4–7 words)capitalise the first letter of the first wordnot have a full stop

If you can't fit the action and the benefit in one sentence, you can include a second sentence. Just make sure it:explains the benefit to the user includes full stops as there are 2 sentencesis short — no more than 6 words

Action

Action copy should:start with a verb — like ‘add’, ‘enable’, ‘find’describe a specific action the user will take — it shouldn't be vaguebe no more than 3 wordscapitalise the first letter of the first wordhave no full stop

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Password Input

_Source: https://docs.wise.design/components/password-input_

Password input

Lets users enter their password as part of a login or authentication process.

When to use

Use a password input:when asking for a user's password as part of a login or authentication process

Don't use a password input:if you need the text the user enters to be visible (use text input instead)Best practice

Hide the text by default — users can choose to show the content of the field with the built-in action if they want to.

Only add a description if you have evidence that users need more context.

Content

Label

Label copy should:be no more than 3 wordsbe a noun that describes the information the user needs to enter (and not a verb)A noun that describes the information the user needs to enter, like 'Password'.

An instruction.

Description (optional)Description copy should:be a single sentencegive some extra context to help the user enter the right information

Placeholders

Placeholders are not supported in most of our components, since (according to our research):people may confuse the content with real valueslack of contrast make them usually difficult to readthey are often used with dummy values, so aren’t helpful to our users

The optional description offers a good alternative when you need to provide help on how to fill an input.
Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Popover

_Source: https://docs.wise.design/components/popover_

PopoverA popover is a short, floating message that gives the user some non-critical, extra context.

When to use

Use a popover:to give optional, supplementary information that might be useful for the userto give short definitions of terms or phrases, or to provide some extra context

Don't use a popover:if the information is critical, and the user needs the information to complete a task (make it visible on the screen or in the flow)Best practice

Use popovers for non-critical information.

Keep the content short and succinct.

Don't have lots of popovers on the same screen.

Add a link to more content if you need to.

Include a title if you're using the popover to define a term or phrase.

Placement

Only use popovers on web. On mobile and mobile web, show the content in a bottom sheet instead.

Popovers can sit above, below, to the left, or to the right of the button that triggers them.

The component will adjust its placement automatically depending on its position and the space available on the screen.

InteractionA popover should always be triggered by a button. The popover appears when the user taps or clicks on the button. It doesn’t appear on hover.

Once a popover has been triggered, it will stay open until the user dismisses it, which they can do by clicking anywhere outside of it.

You can include links in the content, but no other interactive elements.

Accessibility

Add an aria-label to the icon button that triggers the popover, to hint at the content for those using screen readers.

You can include an image within the content as an extra visual cue, but you should never rely on the image alone to give the user an explanation.

If you include an image, it must be:an illustration that has no text within itaccompanied by a description or some instruction text that's not part of the image

Content

Content

Content copy should:define a term or phrase, or give some extra contextonly communicate non-critical information that not every user needsbe concise — 100 characters or fewer is ideal, but try not to go over 250be mostly plain text, but can include links, bold, bullets, and imagesnot include any other text styles or interactive elements

This content defines a term some users might not know. And those who already know what a SWIFT code is don’t need to read it.

This content shouldn’t be in a popover because it’s essential for the user to complete their task.

Title (optional)Don’t include a title unless you are using the popover to define a term or phrase.

Title copy should:be the same as the term or phrase you’re definingbe sentence case, unless the term has its own capitalisation rules — for example, Direct Debit always has a capital D for Debit because it’s a scheme namehave no full stop

Include a title for definitions.

Don't include a title for other messages.

Availability

Platform

Available

Developer documentation

Web

Web documentation

## Progress Bar

_Source: https://docs.wise.design/components/progress-bar_

Progress bar The Progress bar informs the user that the system needs time to load content. If you are on web please refer to screen loader guidance page.

Types

There are two types of progress bars, indeterminate and determinate. Indeterminate The indeterminate progress bar shows that a process is happening, but there's an unspecified amount of wait time.

Determinate

The determinate progress bar displays how long a process will take. They are used when the progress is very fast or when the progress is changes from unknown to known. The determinate progress bar always plays from 0 - 100% before exiting the frame.

When to use

Progress bars are used when the server cannot reliably predict what content will be loaded next. If the action take less then 200 milliseconds to load content, no loading state is needed.

If the action takes longer than 200ms the determinate bar is shown for 700ms.

At 700ms we decide to either exit the animation or......run the Indeterminate state.

When the app knows what content to load the indeterminate progress indicator changes to a determinate progress indicator.

If there is an unusual long wait time due to poor connection reassuring copy will appear on screen after approximately 5000ms.

Progress Spinner vs Bar

The progress spinner and bar are used to communicate different loading behaviours.

Progress Spinner

The Progress spinner should be used to add reassurance when the user is executing long and/or stressful tasks. Stressful tasks can include situations like, uploading documents, sending money or retrieving card details. To find out more on when to use progress spinners click here.

Progress Bar The progress bar should be used when the user is performing generic tasks that usually load fast. Generic tasks can include situations like, loading content following navigation or loading data in back ground after an action has been performed.

Placement and Specs

Place a progress bar within the container that's loading. If a group of items is loading, place a progress indicator at the top of the page, to show progress of the whole group.A progress bar can be placed at the top of bottom sheets centred.

Light and dark mode

Light mode and dark mode use different tapestry fills. Tapestry 05Tapestry 08

## Progress Spinner

_Source: https://docs.wise.design/components/progress-spinner_

Progress Spinner

Progress spinner provides reassurance to users that the app hasn’t crashed when they are executing lengthy and/or stressful tasks.

When to use

When the user is executing long and/or stressful tasks (e.g uploading documents, sending money or retrieving card details.) Don’t use for actions that typically load within one second.

Use when user is executing lengthy and stressful tasks.

Progress Spinner vs Progress bar

Progress Spinners

Progress spinners are used to add reassurance when the user is executing long and/or stressful tasks. Stressful tasks can include situations like, uploading documents, sending money or retrieving card details.

Progress Bar Progress bars are used when the user is performing generic tasks that usually load fast. Generic tasks can include situations like loading content following navigation or loading data in background after an action has been performed. To find out more on when to use progress bars click here.

Best Practice

Below are a few examples of best practices to consider when using the progress spinner. Do not use on top of a forest green themed background.

Add contextualised message to explain why the user needs to wait.

Do not add a blur effect when transitioning from one state to the next.

Content

The spinner and content is always displayed immediately and cycles indefinitely until screen has loaded. The content cycles between four different lines of messaging. The first line of messaging can be changed to give context and explain why the user needs to wait. 
Placement The spinning progress indicator should be centred horizontally and vertically within containers on mobile and web. Test the whole flow to check the screen loaders are consistent in terms of screen location and size. This will help to ensure that spinners that occur one after the other on different screens have the same size and position.

## Promo Card

_Source: https://docs.wise.design/components/promo-card_

Promo cardA promo card is used to promote products and features.

When to use

Used for highlighting products and features, as well as giving high level information on them. Don’t use as a navigation option when choosing between items in a flow.

Don’t use as replacement for a list of content.

Used for highlighting products and features, as well as giving high level information on them.

Cards can be showcased collectively horizontally on a grid on desktop and vertically stacked or in a carousel on mobile.

Can also be used with other cards as a selection tool.

Don’t use cards for as navigation option when choosing between items in a flow.

Best practices

Content and actions should be related to a specific topic.  Content such as text and images on the cards should be used to communicate their hierarchy effectively.
Ensure content is scannable and non-obtrusive.

Cards can function as entry points into deeper layer of information or navigation.

Be aware when using images to not overpass the text.

Placement

Cards can be showcased collectively horizontally on a grid on desktop, vertically stacked on mobile or in a carousel.

Don’t place in a carousel if the cards have different height values.

Cards can be showcased collectively horizontally on a grid on desktop, vertically stacked on mobile or in a carousel.

Don’t place in a carousel if the cards have different height values.

Interaction

The whole card can be clickable, as well as links and buttons.

Promo card has an optional interactive icon as an accessory.

Accessibility

The card component scales in height with dynamic text.

Longer content or dynamic text can run over  2 lines

Your scaled text should never fall behind your image.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Storybook

## Radio

_Source: https://docs.wise.design/components/radio_

RadioA radio lets users select a single item from a mutually exclusive list.

When to use

Use a radio:in forms, to make it easy for users to compare their options

Availability

Platform

Available

Developer documentation

Web

Web documentation

## Screen Loader

_Source: https://docs.wise.design/components/screen-loader_

Screen loaderA screen loader is a temporary indicator to tell the user that a screen is loading. Once it’s finished, the loader is replaced by the screen. If on mobile please refer to the progress bar guidance page.

When to use

Use a screen loader:when you want the loader to overlay the whole screen

Don't use a screen loader:when an in-line loader would make more sense and be less disruptive to the user experiencewhen you use Forest Green theme for the screen

Best practice

Make sure screen loaders that show one after the other on different screens are the same size and position. Test the whole flow to check the screen loaders are consistent from start to finish in terms of screen location and size.

Placement

The screen loader should be centred horizontally on the screen, and be towards the top of the screen on Web. Availability Platform

Developer documentation

AndroidiOSWeb

## Search Input

_Source: https://docs.wise.design/components/search-input_

Search inputA search input allows users to look for information from a wide set of possible results.

When to use

Use a search input:when you want give users the possibility of finding information that is not immediately visiblewhen there could be multiple results from different sources

Don't use a search input:when there are limited options a user can pick from (use a dropdown instead)if you want users to filter results from a predefined set of options

Best practice If you have limited vertical space, use the placeholder instead of the label (but try and use the label wherever possible as it is clearer and more accessible).

Use the size of the input to suggest how many characters a user should enter — so if you only need a few characters, don’t make it too wide.

Only add a description if you have evidence that users need more context.

Content

Label

Label copy should:be no more than 3 wordsbe a noun that describes the information the user needs to enter (and not a verb)Description (optional)Description copy should:be a single sentencegive some extra context to help the user enter the right information

Placeholder

Placeholder copy should:be relevant and short tell the user what to enter (for example, 'Search')Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Section Header

_Source: https://docs.wise.design/components/section-header_

Section headerA section header divides sections of a screen.

Types

There are two different types of section header — section and group.

Sectionused to group different sections of content together.

Groupused to introduce a list of items, and separate lists from the rest of the content on a screen.

When to use

Use a section headerto divide content with different purposes into sections within a screento introduce a list of items, and separate that list from the rest of the content on a screenif here’s a single action that relates to the content in the section — for example, you could use the section header for a list with limited items, and a ‘See more' button to display the rest of them

Don't use a section header:if you have a list that will always contain just one item — use a heading text style instead

Best practice

The icon border stroke should encroach the top or bottom of the text slightly without disrupting the visibility of the text.

Don't include a link unless it's absolutely necessary.

Content

Text

Text should:be no more than 3 wordsuse a noun that describes the information within the section, like ‘Account services’not start with a verb or be an instruction (like ‘Select’ or ‘Choose')Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Segmented Control

_Source: https://docs.wise.design/components/segmented-control_

Segmented controlA segmented control allows users to update views of content and select between 2-3 alike options.

When to use

Use segmented control:To update or change views of content

To select between alike options

Don’t use segmented control:To navigate between content

To filter between content

With dissimilar options or more than 3 options

Used in forms and changing page view.

Used in updates and details for page alternating page views

Best practice

Use segmented control between options when filling out a form.

Use segmented control for sequential content options (eg: 1, 2, 3).

Placement

Can be positioned at the top, middle or bottom of a screen paired with a heading or related content inside a form.

Center aligned

Never use segmented control at 100% wide on desktop

Horizontally centred and aligned with content container within grid

Scaled at 100% width

Left aligned and used in place of tabs

Interaction

Clicking an alternate option within segmented control slides the active state to the selected option.

Selecting certain options inside forms may trigger alerts.

Accessibility

For longer translations or scaled content, text will wrap over 2 lines if needed.

Never use truncation, this hides options and is poor for discoverability. Large titles or accessibly scaled text can run over 2 lines

Truncation

Content

Segmented control should be used for assisting users when viewing or updating content, as well as selecting different options within forms. So the copy should always be titled and remain similar to each option.

Options should:Be at the top of the hierarchy for the section

Be short (1–3 words)Capitalise the first letter of the first word

Not have any punctuation1-3 words4 words and punctuation

Consistent alike titles

Inconsistent titles

Titles on the same level hierarchy

Titles on varied levels of hierarchy

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Select

_Source: https://docs.wise.design/components/select_

SelectA select lets a user pick an option from a long list of options — typically 6 or more.

When to use

Use a select:when a user needs to pick a single option from a long list — typically 6 or more options

Don't use a select:for shorter lists — use a radio insteadif the user needs to select multiple options — use checkbox instead

Placement

Select is typically used alongside other fields, like in a form.

On larger screens, you can display multiple fields side by side, but on mobile you should only have one per row.

Interaction

Users can use a keyboard to tab through and open a select. The select can open different things depending on the platform, such as a dropdown.

Accessibility

Select supports Talk

Back on Android, and Voice

Over on iOS.
Content

Label

Label copy should:be no more than 3 wordsbe a noun that describes the information the user needs to enter, not an instruction

Description (optional)Description copy should:be a single sentencegive some extra context to help the user enter the right information

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Snackbar

_Source: https://docs.wise.design/components/snackbar_

SnackbarA snackbar is a brief, temporary notification that confirms the outcome of an action or process that’s just happened.

When to use

Use a snackbar:to give users immediate, non-critical feedback on the outcome of an action or process (without disrupting their experience)Don't use a snackbar:if the message is critical, or requires the user to do something

Best practice

Only show information that the user can find somewhere else on the screen (if they don't see the snackbar).

Never use snackbars for critical information — some users may not notice it, or might not have time to read the text before it fades out.

Only include a button if really necessary, and made sure the user can perform the same action somewhere else on the screen.

Placement

Place the snackbar at the bottom centre of the screen. On mobile, make sure it sits just above the bottom navigation.

Only use one snackbar on a screen at once.

Interaction

Snackbars are temporary, and fade out automatically. The user doesn’t need to interact with them or dismiss them.

The only part of a snackbar that is clickable is the optional button. But don’t include a button unless you really have to. They’re rarely needed.

There should never be more than one button on a snackbar. And the user should still be able to perform the same action somewhere else on the screen.

Accessibility

Don’t trigger snackbars too often — frequent interruptions are disruptive for people with cognitive and visual impairments.

Content

Text

The text should:confirm what just happeneduse the pattern noun + verbbe 3 words or lesshave no full stop

Button

Button copy should:start with a verb, like ‘Pay’ or ‘Send’be just a few words (ideally 1 or 2)describe the action (if someone only reads the button, they should know what will happen next) connect to the content around it — for example, it might use the same words as the titleavoid using first person pronouns like ‘me’, ‘my’ and ‘I’be in sentence case (only capitalise the first letter of the first word)have no full stop

Snackbars confirm actions that have already happened, so it’s too late to cancel.

This is redundant as snackbars fade out automatically.

There’s no need for the user to confirm they’ve understood a snackbar.

Navigating to an area is not specific enough. What will the user do there?

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Summary

_Source: https://docs.wise.design/components/summary_

SummaryA summary summarises instructions, tasks, or benefits in a list.

When to use

Use a summary:when you need to show a list of instructions, tasks or benefits

Don't use a summaryr:if you need to give users positive or negative instructions (use instruction instead)Types

Adding a status is optional. There are 3 status types you can add.

Type

Icon

Usage

Done

Use this to indicate that a task is complete.

Pending

Use this to indicate that a task is in progress.

Not done

No icon

If an item is not done, it's indicated by the lack of an icon. The content should already clearly communicate what the user needs to do.
To help those using screenreaders, you can add a ‘not done’ aria label.

Best practice

Keep the same structure for all the summaries in a list — start all titles with verbs, or all with nouns, but don’t mix and match.

Don't use more than 6 summaries in a list — any more and it gets hard to scan and difficult to take in information.

Don’t use the info button for critical information as users might not click on it.

Don't use an info button for too many items in a list — try to stick to one per list at the most.

Use a status when you need to show the user the status of an action.

Use a description if you need to expand on the information in the title, and surface important information on the screen.

Include an action if you need to redirect the user to a related, secondary task — for example, to give the user an opportunity to amend a previous action, like editing an address they’ve already confirmed.

Interaction

The only interactive parts of the summary are the info button and the action.
Info button

Clicking or tapping the info button shows the user some additional information or educational content.

On web, this triggers either a popover or a modal. Use popovers for short definitions or brief bits of additional info, and modals for richer content.

On mobile, interacting with the info button should open a bottom sheet or a full screen modal.

Action

The action lets users navigate to a secondary task.

Accessibility

Be mindful of how frequently you use the info button — too many info buttons add visual noise to the screen, increasing the cognitive load.

You can use an optional status to indicate the state of items that require action — this will add an appropriate aria label for screenreader users, and for some statuses, an icon.

If you do choose to use a status, don't rely on the aria label or icon alone to communicate it. Make sure this information is clear from the title, too. For example:'Verify your address' would match a not done status'We’re verifying your address' would match a pending status'Your address is verified' would match a done status

Statuses are optional as not all summary items are actionable — but if you use a status for one item, you should use a status for all items.

Content

Title

Title copy should:sum up a single piece of information the user needs to knowmake the status obvious (if there is one)be short — aim for 6 words or lessuse sentence casehave no full stop

Consistent titles

Inconsistent titles

Description (optional)Description copy should:expand on the title by providing important, related informationbe plain text — that means no bold, links, or other fancy formattingbe short — aim for 2 lines and remember content might expand when translateduse sentence caseinclude a full stop

Consistent descriptions

Inconsistent descriptions

Action (optional)Action copy should:direct users to an optional, but directly-related secondary taskstart with a verbbe 1-3 wordsuse sentence casehave no full stop

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Switch

_Source: https://docs.wise.design/components/switch_

SwitchA switch lets the user toggle an individual setting on or off.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

## Table

_Source: https://docs.wise.design/components/table_

Table

Tables allow users to review large amounts of sequential information at a glance.

Best practices

Tables are useful for organising data in grids and can be used to: Compare data points, Find insights, Find specific information within a large data set, and Show long lists of sequential or structured content. Keep cell content short and succinct

Don’t write long form content inside of table cells

Keep cell content short and succinct

Don’t write long form content inside of table cells

When to use

Use tables when you need to display comparison information across columns and rows.

Don’t put a table inside of another table

Don’t use tables for minimal information where you can use a list item component instead

Avoid using detailed tables in small spaces like modals or drawers

Avoid using detailed tables in small spaces like modals or drawers

Don’t use tables for minimal information where you can use a list item component instead

Interaction

Users can perform a single action across a row.

Single action

Device

The table component is a mobile responsive web component — at smaller screen widths it activates a horizontal scroll, so that the user can still scan all information.

Full width on desktop

Responsive width with horizontal scroll

Cell types

Table has 5 different cell types used for different types of information — header, leading, text, currency and status.

Leading

Text

Currency

Status

Leading

The leading cell is used for your first table cell to lead the rest of the content. While your leading cell should be used as your first cell type, depending on your use case you can use different cell types as your leading cell.

Leading supports default, error and success states.

Default

Error

Success

Text

The content cell is used for text based information.

Content supports default, error and success states.

Default

Error

Success

Currency

The currency cell is used for displaying currency and currency flags. This cell is always right aligned to conform to numerical display standards in tables.

Currency supports default, error and success states.

Default

Error

Success

Status

The status cell is used for indicating the status of a row.

Status supports info, pending, warning, error and success states.

Info

Pending

Alert

Error

Success

Header

Table headers are used for identifying the tables primary content.

Default

Error

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Tabs

_Source: https://docs.wise.design/components/tabs_

Tabs

Tabs organise content into sections that users can alternate between.

When to use

Use tabs:to let users navigate between related, but distinct groups of content at the same level of hierarchy

Don’t use tabs:To change views of content

To filter between content

To select between options within forms

Use tabs to categorise content groups.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation

Best practice

Keep the tabs text short and relevant to the content in the section

Initial focus should begin on the left for left-to-right languages and on the right for right-to-left languages Use at the top of a page or section

Group content into helpful categories

Use for filtering content

Placement

Place tabs at the top of a page or section to categorise content.

Tabs are used for navigating between different available groups of content, it remains at the top of the page so users can see all available content groups.

Content

Tab labels should describe the content within. They appear in a single row, and are horizontally scrollable if the tab group overflows on the screen.

Options should:Be at the top of the hierarchy for the section

Be short (1–3 words)Capitalise the first letter of the first word

Not have any punctuation

Related content

Sequential content

Navigational groups of content

Selecting between alike switches/options

Related content

Filtering

## Text Area

_Source: https://docs.wise.design/components/text-area_

Text areaA text area is a field that lets users enter several lines of text.

When to use

Use a text area:when users need space to add several lines of text (for example, when leaving a comment or adding a description)when there’s a character limit that you want users to be aware of

Don't use a text area:if you need the user to enter a single line of text (use the text input instead)Best practice

Use the character limitation counter if there's a character limit. If the field is optional, make sure to include the optional indication.

Only add a description if you have evidence that users need more context.

Content

Label

Label copy should:be no more than 3 wordsbe a noun that describes the information the user needs to enter (and not a verb)Description (optional)Description copy should:be a single sentencegive some extra context to help the user enter the right information

Placeholders

Placeholders are not supported in most of our components, since (according to our research):people may confuse the content with real valueslack of contrast make them usually difficult to readthey are often used with dummy values, so aren’t helpful to our users

The optional description offers a good alternative when you need to provide help on how to fill an input.
Availability

Platform

Available

Developer documentation

AndroidiOSWeb

## Text Input

_Source: https://docs.wise.design/components/text-input_

Text inputA text input lets users enter a single line of text.

When to use

Use a text input:in a form, when the user needs to enter information that's unique and can’t be selected from a finite listwhen the information is known to the user (like their name, email address, IBAN or card number)Don't use a text input:if you need users to enter text that may be more than a single line (use the text area instead)if you want to predetermine the information a user must enter, and the way they enter it (use specific input components instead, like phone number input, date input or password input)Best practice

Hide the text by default — users can choose to show the content of the field with the built-in action if they want to.

Only add a description if you have evidence that users need more context.

Content

Label

Label copy should:be no more than 3 wordsbe a noun that describes the information the user needs to enter (and not a verb)Description (optional)Description copy should:be a single sentencegive some extra context to help the user enter the right information

Placeholders

Placeholders are not supported in most of our components, since (according to our research):people may confuse the content with real valueslack of contrast make them usually difficult to readthey are often used with dummy values, so aren’t helpful to our users

The optional description offers a good alternative when you need to provide help on how to fill an input.
Availability

Platform

Available

Developer documentation

AndroidiOS

## Upload

_Source: https://docs.wise.design/components/upload_

Upload

Upload lets users upload a single file when uploading is the primary purpose of the screen.

When to use

Use an upload:when the user needs to upload a single filewhen uploading a file is the purpose of the screen and main CTADon't use an upload:if the user may need to upload multiple files — use an upload input insteadwithin a form — use an upload input instead

Best practice

Include a description if you need to specify the file requirements, such as the type or size (and you haven’t got this info somewhere else on the screen).

Placement

The upload should be the priority interaction on the screen.

Interaction

Users can either drag and drop their file, or use the button.

Content

Title

Title copy should:be the name of the file the user needs to uploadbe in sentence casehave no full stop

Description (optional)Description copy should:give the user more information about the file requirementsbe 1 or 2 sentenceshave a full stop

Availability

Platform

Available

Developer documentation

Web

## Upload Input

_Source: https://docs.wise.design/components/upload-input_

Upload input

An upload input lets users upload a single file, or multiple files, within a form.

When to use

Use an upload input:in forms alongside other fields or inputswhen there's no need for the user to see a preview or thumbnail on screen of what they've uploaded

Don't use an upload input:if the only input on the screen is for uploading filesif you need to show users a thumbnail or preview image of their upload on the same screen

Types

You can use the upload input to let users upload a single file or multiple files.

Single file

Multiple files

For each new file the user uploads, a new cell is added to the bottom of the list. The initial default state always stays at the bottom of the list so that the user can upload more files.

Best practice

Only use the upload input within forms. If the user removes a file, display a prompt alert to confirm the action.

If an upload fails, make sure the description text on the failed state is specific, so user understands what went wrong.

When truncating long file names, make sure the ellipsis is in the center of the string to avoid truncating essential identifiers, like the end of the name and the file extension.

Placement

You can use an upload input on both desktop and mobile screens. Its width should be aligned with the other input fields in a form.

Interaction

Users can tap or click anywhere on the input field to trigger the upload as the whole area is interactive. This allows them to select the file(s) they want to upload from their device.

Once a file has been successfully uploaded, users can click or tap on the cell to see a preview of the file, allowing them to double check what they uploaded.

Users can also remove a file by pressing the interactive bin icon, at which point we should display a prompt alert to confirm the action. This is a native dialogue alert on iOS and Android, or a modal on web.

States

The upload input has 4 different states.

Default

The default state is always visible before the user interacts with the component. The title is a call to action that instructs the user to upload files, and the description communicates any upload constraints the user should be aware of, like file type and size.

Loading

When the user submits a file to upload, the title changes to the name of the file. The description and icon also change to communicate the loading status.

Uploaded

Once the file has successfully uploaded, the icon and description change to communicate this. A clear button also appears allowing the user to remove the file if they want to.

Failed

If there's an error and the upload doesn't work, the description tells the user why the file failed to upload.
It is possible to have more than one error on a file. If this happens, the errors will be displayed in a bulleted list.

Content

Label

The label describes the type of file the user needs to upload, for example 'Invoice'. It should also be consistent with the other labels in the form.

Title

In the default state, the title is a call to action. The default copy for this state is 'Upload file' or 'Upload files'. But if you need to change this, treat it like writing button copy. That means starting with a verb, and using as few words as possible.

Description

The description describes the state of the upload. For the failed state, it's important to make this copy as specific as possible so the user understands what went wrong and what they can do to fix it.

Availability

Platform

Available

Developer documentation

AndroidiOSWeb

Web documentation
