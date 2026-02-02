export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black relative flex items-center justify-center overflow-hidden">

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(255, 99, 71, 0.6) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(60, 179, 113, 0.3) 0%, transparent 80%)
          `,
        }}
      />

      
      <div className="relative z-10 text-center">
        <h1 className="text-white text-4xl md:text-6xl font-light tracking-widest uppercase animate-pulse">
          Por siempre Fresia        
        </h1>
      </div>
    </main>
  );
}