import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-200 py-5">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="text-primary text-sm font-semibold tracking-widest uppercase"
        >
          LeaderShift
        </Link>
      </div>
    </header>
  )
}
