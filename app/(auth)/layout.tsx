export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
      {children}
    </div>
  );
}
