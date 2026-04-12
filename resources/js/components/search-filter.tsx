interface SearchFilterProps {
  placeholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  onFilterClick: () => void
}

export default function SearchFilter({
  placeholder = "Cari...",
  searchValue,
  onSearchChange,
  onFilterClick,
}: SearchFilterProps) {
  return (
    <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden">
      <span className="pl-3 text-gray-400 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
      />
      <div className="w-px h-6 bg-gray-200 shrink-0" />
      <button
        onClick={onFilterClick}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white transition font-medium shrink-0"
      >
        Filter
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .707 1.707L13 12.414V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 17v-4.586L3.293 5.707A1 1 0 0 1 3 5V4z" />
        </svg>
      </button>
    </div>
  )
}