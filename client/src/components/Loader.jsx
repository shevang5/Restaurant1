export default function Loader() {
  return (
    <div className="min-h-screen bg-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl animate-pulse">
        <div className="h-12 md:h-14 w-full max-w-xl rounded-full bg-gray-200 mx-auto mb-8" />

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
            >
              <div className="h-44 md:h-52 w-full rounded-xl bg-gray-200 mb-4" />
              <div className="h-4 w-3/4 rounded-full bg-gray-200 mb-3" />
              <div className="h-3 w-1/2 rounded-full bg-gray-200 mb-5" />
              <div className="h-10 w-full rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
