type BrandLogoVariant = 'full' | 'compact' | 'mark'

const brandName = 'MCEP高端机床云边协同应用平台'

const variantClasses: Record<BrandLogoVariant, string> = {
  full: 'h-auto w-[236px] min-[1280px]:w-[250px] min-[1536px]:w-[270px]',
  compact: 'h-auto w-[158px]',
  mark: 'h-8 w-auto',
}

export function BrandLogo({ variant = 'full', className = '' }: { variant?: BrandLogoVariant; className?: string }) {
  const source = variant === 'mark' ? 'brand/mcep-symbol.png' : 'brand/mcep-logo-dark.png'
  return (
    <img
      src={`${import.meta.env.BASE_URL}${source}`}
      alt={brandName}
      aria-label={brandName}
      className={`${variantClasses[variant]} block shrink-0 object-contain ${className}`}
    />
  )
}
