import Head from 'next/head'
import DomParser from 'dom-parser';

const Linkout = ({ linkout }) => {
  let parser = new DomParser();
  const html = { __html: linkout.assetDescription }
  const dynamicHtml = { __html: linkout.assetDynamicContent }
  const description = parser.parseFromString(html.__html)?.getElementsByTagName('p')[0]?.innerHTML || linkout.assetSummary
  const cleanDescription = description?.replace('&nbsp;', ' ')?.replace(/[^a-zA-Z0-9.', ]/g, "")
  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <title>{`${linkout.assetSummary} on Linkout`}</title>
        <meta name="description" content={cleanDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fewcents.me/" />
        <meta property="og:title" content={`${linkout.assetSummary} on Linkout`} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:image" content="/linkoutMeta.jpg" />

        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content="https://fewcents.me/" />
        <meta property="twitter:title" content={`${linkout.assetSummary} on Linkout`} />
        <meta property="twitter:description" content={cleanDescription} />
        <meta property="twitter:image" content="/linkoutMeta.jpg" />
      </Head>

      <p>{linkout.assetName}{' '}</p>
      <p>{linkout.assetSummary}{' '}</p>
      <div dangerouslySetInnerHTML={html}></div>
      {dynamicHtml.__html ? (
        <div variant="outlined" className="paper-container" sx={theme.paper}>
          <div dangerouslySetInnerHTML={dynamicHtml}></div>
        </div>
      ) : null}
    </div>
  )
}

export default Linkout

export async function getServerSideProps({ params }) {
  const creators = await fetch(`https://api.hounds.fewcents.co/v1/publisher/digitalAsset/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then(res => res.json());

  let linkout = creators.data
  return {
    props: {
      linkout
    }
  }
}