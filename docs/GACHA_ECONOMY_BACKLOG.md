# Gacha structure ideas — undecided backlog

Owner brainstorm, 2026-10-15 America/Chicago. Not a pool, price, rate, currency
or save migration decision. Keep presentation work separate from economy design.

## Desired experience

Ten-pulls should have an incentive: perhaps slightly better rates or an SR
guarantee. Consider combining support/items and characters to make a character
arrival feel rarer and more exciting; items allow wider visual/content variety.
Counterpoint: individual Power-Ups and party-wide Assists are already distinct,
so keeping item/support pulls separate may still be preferable.

## Possible three-banner structure

| Candidate | Contents | Currency / cost idea |
| --- | --- | --- |
| Featured character-only | Only fighters; featured character | More expensive, or rarer character currency |
| Mixed | Characters plus item/support results | Accepts both currencies; conversion / combined-payment rules undecided |
| Featured item-only | Items/supports, with featured SSR/UR items comparably rare to characters | Easier-to-earn item currency |

Do not invent the mixed-banner exchange rate, split of result kinds, new pity,
prices, rates or currencies from this brainstorm. Decide eligibility of both
Power-Ups and Assists, rate dilution, duplicate value, featured guarantees and
save compatibility before implementing a new banner. UR items are a proposal,
not an existing production pool.

## Current implementation checked

`src/config/rules.js`: fighter and supply both have `srHard: 10`.
`src/gacha.js` `rollRarity` and the `sinceSr` update guarantee an SR-or-better
within ten draws, with progress retained across singles. Every ten consecutive
draws on a channel therefore include SR+. A read-only forced-low-roll check
returned nine R then SR for both channels. No rule changed in storyboard 03.

This is NOT a ten-pull-exclusive bonus: ten singles have the same guarantee.
There is no implemented batch-only rate increase or discount in `drawPulls`.
If the owner wants a distinct batch incentive beyond convenience, resolve that
explicitly in the later economy pass rather than advertising invented odds now.
