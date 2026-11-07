import React, { type ReactNode } from 'react';
import facts from '@site/src/data/competitors.json';
import RivalLink from '@site/src/components/RivalLink';

type Status = 'yes' | 'no' | 'partial' | 'not-stated';

interface Price {
  readonly plan: string;
  readonly amount: number | null;
  readonly currency: string;
  readonly period: string;
  readonly country?: string;
  readonly note?: string;
  readonly source: string;
  readonly checkedOn: string;
}

interface Fact {
  readonly status: Status;
  readonly source?: string;
  readonly note?: string;
}

interface Rival {
  readonly slug: string;
  readonly name: string;
  readonly officialUrl: string;
  readonly lastChecked: string;
  readonly prices: readonly Price[];
  readonly features: Readonly<Record<string, Fact>>;
}

const STATUS: Readonly<Record<Status, string>> = {
  yes: 'Yes',
  no: 'No',
  partial: 'Partly',
  'not-stated': 'Not stated on the pages we checked',
};

const day = (iso: string): string =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'Asia/Karachi' }).format(new Date(iso));

function priceText(price: Price): string {
  if (price.amount === null) return price.note ?? '';
  const amount = price.currency === 'USD' ? `$${price.amount}` : `${price.amount} ${price.currency}`;
  return `${amount} a ${price.period}`;
}

/** The dated fact table of one rival, from the same facts as the app's comparison page. */
export default function RivalFacts({ slug }: { readonly slug: string }): ReactNode {
  const rival = (facts.competitors as unknown as readonly Rival[]).find((entry) => entry.slug === slug);
  if (rival === undefined) throw new Error(`RivalFacts: no rival "${slug}" in src/data/competitors.json`);
  const ours = facts.ours as Readonly<Record<string, Status>>;
  return (
    <>
      <p>
        Last checked {day(rival.lastChecked)}. <RivalLink href={rival.officialUrl}>Check {rival.name}'s own page</RivalLink>
      </p>
      <h3>What {rival.name} charges</h3>
      {rival.prices.length === 0 ? (
        <p>{rival.name} did not state a price on the pages we checked.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Plan or rate</th><th>Price</th><th>Country</th><th>Their note</th><th>Source</th></tr>
          </thead>
          <tbody>
            {rival.prices.map((price) => (
              <tr key={price.plan}>
                <td>{price.plan}</td>
                <td>{priceText(price)}</td>
                <td>{price.country ?? 'Not tied to a country'}</td>
                <td>{price.note}</td>
                <td><RivalLink href={price.source}>Their page, {day(price.checkedOn)}</RivalLink></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Side by side</h3>
      <table>
        <thead>
          <tr><th>What you might need</th><th>{rival.name}</th><th>SMS Mobile App</th></tr>
        </thead>
        <tbody>
          {facts.features.map((feature) => {
            const fact = rival.features[feature.key];
            return (
              <tr key={feature.key}>
                <td>{feature.label}</td>
                <td>
                  {STATUS[fact.status]}
                  {fact.note === undefined ? null : `. ${fact.note}`}
                  {fact.source === undefined ? null : <> (<RivalLink href={fact.source}>their page</RivalLink>)</>}
                </td>
                <td>{STATUS[ours[feature.key]]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
