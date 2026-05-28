export default function DegreesBadge({ degrees }) {
  return (
    <div className="inline-flex items-center gap-2 bg-gold text-noir-darker font-bold px-4 py-2 rounded-full">
      <span className="text-2xl">{degrees}</span>
      <span className="text-sm">
        {degrees === 1 ? 'Degree' : 'Degrees'}
      </span>
    </div>
  )
}
