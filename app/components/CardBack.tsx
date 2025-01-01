'use client'

const CardBack = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-gray-50 p-6">
      <div className="relative w-full h-full">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo/Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <svg 
              className="w-8 h-8 text-white"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>

        {/* Border Design */}
        <div className="absolute inset-4 border-2 border-gray-200/50 rounded-lg" />
        <div className="absolute inset-5 border border-gray-200/30 rounded-lg" />

        {/* Corner Decorations */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 border-2 border-indigo-500/20"
            style={{
              [i < 2 ? 'top' : 'bottom']: '1rem',
              [i % 2 === 0 ? 'left' : 'right']: '1rem',
              borderRadius: '0.5rem',
              transform: `rotate(${45 * i}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CardBack;
