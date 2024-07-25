import Image from 'next/image';
export default function Home() {
  return (
    <main className="min-h-screen container py-2">
      <span className="flex items-center">
        <Image
          src="/logo.svg"
          alt="InternSync Logo"
          width={200}
          height={200}
          quality={100}
          className="w-14 h-14"
        />
        <div className="text-2xl font-bold pl-2 text-primary">InternSync</div>
      </span>
    </main>
  );
}
