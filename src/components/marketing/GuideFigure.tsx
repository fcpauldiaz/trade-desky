import { guideAssetUrl } from '#/lib/guides'

type GuideFigureProps = {
  src: string
  alt: string
  caption: string
}

export default function GuideFigure({ src, alt, caption }: GuideFigureProps) {
  return (
    <figure className="guide-figure">
      <img src={guideAssetUrl(src)} alt={alt} loading="lazy" decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
