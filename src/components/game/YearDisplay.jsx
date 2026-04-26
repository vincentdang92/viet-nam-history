import { formatYear } from '../../utils/helpers'

export default function YearDisplay({ year, arc }) {
  const arcLabels = { 1: 'Lập Quốc', 2: 'Kháng Nguyên', 3: 'Thịnh Rồi Suy' }
  return (
    <div className="text-center">
      <div className="text-tran-secondary font-serif text-lg font-bold">
        {formatYear(year)}
      </div>
      <div className="text-tran-textMuted text-xs mt-0.5">
        Nhà Trần — {arcLabels[arc] ?? ''}
      </div>
    </div>
  )
}
