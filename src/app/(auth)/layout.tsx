export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-cyan-100 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
